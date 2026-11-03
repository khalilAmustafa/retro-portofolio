import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import net from 'node:net';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8'
};

function findChromeBinary() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser'
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error('No Chrome/Chromium binary found. Set CHROME_PATH.');
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

function startStaticServer(distDir, port) {
  const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url, `http://127.0.0.1:${port}`);
    let pathname = decodeURIComponent(reqUrl.pathname);
    if (pathname === '/') pathname = '/index.html';

    const filePath = path.join(distDir, pathname);
    if (!filePath.startsWith(distDir) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function waitForJson(url, timeoutMs = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 120));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

class CdpSession {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.consoleErrors = [];
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });

    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(String(ev.data));
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method === 'Runtime.exceptionThrown') {
        this.consoleErrors.push(msg.params?.exceptionDetails?.text || 'Uncaught exception');
      } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params?.type === 'error') {
        this.consoleErrors.push(
          (msg.params.args || []).map((a) => a.value || a.description || '').join(' ')
        );
      }
    });

    await this.send('Page.enable');
    await this.send('Runtime.enable');
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(`Eval error: ${res.exceptionDetails.text}`);
    }
    return res.result?.value;
  }

  async setViewport(width, height, mobile = false) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile
    });
  }

  async screenshot(outFile) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, Buffer.from(data, 'base64'));
  }

  close() {
    this.ws.close();
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const repoRoot = process.cwd();
  const distDir = path.join(repoRoot, 'dist');
  const screenshotsDir = path.join(repoRoot, 'docs', 'baselines', 'v2');

  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    throw new Error('dist/index.html missing. Run `npm run build` first.');
  }

  const serverPort = await getFreePort();
  const debugPort = await getFreePort();
  const server = await startStaticServer(distDir, serverPort);
  const userDataDir = path.join(repoRoot, '.vite', `chrome-smoke-${Date.now()}`);
  fs.mkdirSync(userDataDir, { recursive: true });

  const chromeBin = findChromeBinary();
  const chromeProc = spawn(
    chromeBin,
    [
      '--headless=new',
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${userDataDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      '--window-size=1280,820',
      `http://127.0.0.1:${serverPort}/#projects/rooms`
    ],
    { stdio: 'ignore' }
  );

  let cdp = null;
  try {
    const targets = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`);
    const pageTarget = targets.find((t) => t.type === 'page');
    assert(pageTarget?.webSocketDebuggerUrl, 'Could not attach to headless Chrome page');

    cdp = new CdpSession(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.setViewport(1280, 820, false);
    await delay(700);

    // 1. Cold deep-link verification (#projects/rooms)
    const coldDeepLink = await cdp.eval(`({
      hash: location.hash,
      channelTag: document.getElementById('channel-tag')?.textContent,
      ch5Pressed: document.querySelector('.channel-button[data-channel="4"]')?.getAttribute('aria-pressed'),
      ch5Current: document.querySelector('.channel-button[data-channel="4"]')?.getAttribute('aria-current'),
      heading: document.querySelector('.case-study-title')?.textContent,
      dialTransform: document.getElementById('channel-dial')?.style.transform,
      feMapPreserve: document.getElementById('fe-crt-barrel-map')?.getAttribute('preserveAspectRatio')
    })`);

    assert(coldDeepLink.hash === '#projects/rooms', `Expected #projects/rooms, got ${coldDeepLink.hash}`);
    assert(coldDeepLink.channelTag === 'CH 05', `Expected CH 05 tag, got ${coldDeepLink.channelTag}`);
    assert(coldDeepLink.ch5Pressed === 'true', 'Expected CH 05 button aria-pressed=true');
    assert(coldDeepLink.ch5Current === 'page', 'Expected CH 05 button aria-current=page');
    assert(coldDeepLink.heading === 'ROOMS by VISION', `Expected ROOMS title, got ${coldDeepLink.heading}`);
    assert(coldDeepLink.dialTransform === 'rotate(45deg)', `Expected dial rotate(45deg), got ${coldDeepLink.dialTransform}`);
    assert(coldDeepLink.feMapPreserve === 'none', 'Expected feImage preserveAspectRatio="none"');
    console.log('✓ Cold deep link (#projects/rooms) & CRT filter verified');

    await cdp.screenshot(path.join(screenshotsDir, 'ch05-case-rooms.png'));

    // 2. Render & capture all 7 channels on desktop (1280x820)
    const channelShots = [
      { idx: 0, hash: '#home', file: 'ch01-home.png' },
      { idx: 1, hash: '#experience', file: 'ch02-experience.png' },
      { idx: 2, hash: '#education', file: 'ch03-education.png' },
      { idx: 3, hash: '#skills', file: 'ch04-skills.png' },
      { idx: 4, hash: '#projects', file: 'ch05-projects.png' },
      { idx: 5, hash: '#certifications', file: 'ch06-certifications.png' },
      { idx: 6, hash: '#contact', file: 'ch07-contact.png' }
    ];

    for (const ch of channelShots) {
      await cdp.eval(`window.select(${ch.idx})`);
      await delay(350);
      const state = await cdp.eval(`({
        hash: location.hash,
        hasH1: Boolean(document.querySelector('#screen-content h1')),
        brokenImages: Array.from(document.querySelectorAll('img')).filter(img => img.getAttribute('src') && (!img.complete || img.naturalWidth === 0)).map(i => i.src)
      })`);
      assert(state.hash === ch.hash, `Expected hash ${ch.hash}, got ${state.hash}`);
      assert(state.hasH1, `Missing H1 on ${ch.hash}`);
      assert(state.brokenImages.length === 0, `Broken images on ${ch.hash}: ${state.brokenImages.join(', ')}`);
      await cdp.screenshot(path.join(screenshotsDir, ch.file));
    }
    console.log('✓ All 7 channels rendered with intact images & desktop screenshots saved');

    // 3. Revisit Home 22 times and verify Vision fires exactly once per click (no listener leak)
    await cdp.eval(`(async () => {
      for (let i = 0; i < 22; i++) {
        window.select(4);
        window.select(0);
      }
    })()`);
    await delay(200);
    const visionDelta = await cdp.eval(`(() => {
      const before = window.__retroPortfolio.getVisionReactionCount();
      document.getElementById('character-vision').click();
      const after = window.__retroPortfolio.getVisionReactionCount();
      return after - before;
    })()`);
    assert(visionDelta === 1, `Expected Vision click delta of 1 after 22 Home visits, got ${visionDelta}`);
    console.log('✓ Zero Home listener leak confirmed across 22 channel switches');

    // 4. Gallery scroll preservation & Browser Back/Forward
    await cdp.eval(`window.select(4)`);
    await delay(250);
    await cdp.eval(`(() => {
      const sc = document.getElementById('screen-content');
      sc.scrollTop = 220;
      document.querySelector('[data-route="#projects/space-day"]').click();
    })()`);
    await delay(250);
    const onDetail = await cdp.eval(`({
      hash: location.hash,
      scrollTop: document.getElementById('screen-content').scrollTop
    })`);
    assert(onDetail.hash === '#projects/space-day', `Expected #projects/space-day, got ${onDetail.hash}`);
    assert(onDetail.scrollTop === 0, `Expected detail scrollTop 0, got ${onDetail.scrollTop}`);

    await cdp.eval(`history.back()`);
    await delay(250);
    const afterBack = await cdp.eval(`({
      hash: location.hash,
      scrollTop: document.getElementById('screen-content').scrollTop
    })`);
    assert(afterBack.hash === '#projects', `Expected history.back() to return to #projects, got ${afterBack.hash}`);
    assert(afterBack.scrollTop >= 180, `Expected gallery scrollTop restored (~220), got ${afterBack.scrollTop}`);
    console.log('✓ Gallery scroll restoration and browser Back navigation verified');

    // 5. Unknown project slug graceful fallback
    await cdp.eval(`window.__retroPortfolio.navigateTo('#projects/missing-case')`);
    await delay(200);
    const hasAlert = await cdp.eval(`Boolean(document.querySelector('.retro-alert'))`);
    assert(hasAlert, 'Expected graceful .retro-alert banner for unknown project ID');
    console.log('✓ Unknown project fallback banner verified');

    // 6. Skills proof navigation & hardware controls (CRT preset, Blank, Power)
    await cdp.eval(`window.select(3)`);
    await delay(200);
    await cdp.eval(`document.querySelector('[data-route="#projects/happensbefore"]').click()`);
    await delay(250);
    const hbHash = await cdp.eval(`location.hash`);
    assert(hbHash === '#projects/happensbefore', `Skill proof should open #projects/happensbefore, got ${hbHash}`);

    const hwChecks = await cdp.eval(`(() => {
      document.getElementById('crt-preset-toggle').click();
      const preset1 = window.__retroPortfolio.getCrtPreset();
      document.getElementById('crt-preset-toggle').click();
      const preset2 = window.__retroPortfolio.getCrtPreset();
      document.getElementById('crt-preset-toggle').click();
      const preset3 = window.__retroPortfolio.getCrtPreset();

      document.getElementById('blank-toggle').click();
      const isBlank = document.getElementById('tv').classList.contains('is-blank');
      document.getElementById('blank-toggle').click();

      document.getElementById('power').click();
      const isOff = document.getElementById('tv').classList.contains('is-off');
      document.getElementById('power').click();
      const isBackOn = !document.getElementById('tv').classList.contains('is-off');

      return { preset1, preset2, preset3, isBlank, isOff, isBackOn };
    })()`);
    assert(hwChecks.preset1 === 'performance' && hwChecks.preset2 === 'off' && hwChecks.preset3 === 'authentic', 'CRT preset cycle mismatch');
    assert(hwChecks.isBlank && hwChecks.isOff && hwChecks.isBackOn, 'Blank or power toggle failed');
    console.log('✓ Skill proof routing, CRT presets, Blank Screen, and Power controls verified');

    // 7. Responsive viewport checks (1920, 1280, 768, 390, 320) + Mobile screenshots
    const viewports = [
      { w: 1920, h: 1080, mobile: false },
      { w: 1280, h: 800, mobile: false },
      { w: 768, h: 1024, mobile: true },
      { w: 390, h: 844, mobile: true },
      { w: 320, h: 568, mobile: true }
    ];

    for (const vp of viewports) {
      await cdp.setViewport(vp.w, vp.h, vp.mobile);
      await cdp.eval(`window.select(0)`);
      await delay(250);
      const metrics = await cdp.eval(`({
        docScrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        btnHeight: document.querySelector('.channel-button')?.getBoundingClientRect().height || 0
      })`);
      assert(
        metrics.docScrollWidth <= metrics.innerWidth + 1,
        `Horizontal overflow at ${vp.w}x${vp.h}: scrollWidth=${metrics.docScrollWidth} > ${metrics.innerWidth}`
      );
      if (vp.w === 390) {
        assert(metrics.btnHeight >= 44, `Expected >=44px mobile channel button at 390px, got ${metrics.btnHeight}`);
        await cdp.screenshot(path.join(screenshotsDir, 'mobile-ch01-home.png'));
        await cdp.eval(`window.select(4)`);
        await delay(250);
        await cdp.screenshot(path.join(screenshotsDir, 'mobile-ch05-projects.png'));
        await cdp.eval(`window.__retroPortfolio.navigateTo('#projects/rooms')`);
        await delay(250);
        await cdp.screenshot(path.join(screenshotsDir, 'mobile-ch05-case-rooms.png'));
      }
    }
    console.log('✓ Responsive layouts verified (1920, 1280, 768, 390, 320) with zero horizontal overflow');

    assert(cdp.consoleErrors.length === 0, `Console errors detected: ${cdp.consoleErrors.join('; ')}`);
    console.log('✓ Zero browser console or runtime errors — ALL SMOKE TESTS PASSED');
  } finally {
    cdp?.close();
    chromeProc.kill();
    server.close();
    setTimeout(() => {
      try {
        fs.rmSync(userDataDir, { recursive: true, force: true });
      } catch {
        // Ignore Windows file lock cleanup race
      }
    }, 400);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
