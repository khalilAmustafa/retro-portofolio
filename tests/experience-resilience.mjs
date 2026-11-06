import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { launchBrowser } from '../scripts/browser-utils.mjs';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:5190';
const browser=await launchBrowser();const results=[];let page;
const settle=async()=>{await page.waitForFunction(()=>window.__crtExperience?.progress>.999);await page.waitForTimeout(600);};
try{
  page=await browser.newPage({viewport:{width:1440,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__crtExperience?.ready);
  await page.locator('#room-enter').click();await settle();
  const alignment=await page.evaluate(()=>{
    const r=document.querySelector('#tv').getBoundingClientRect(),css=getComputedStyle(document.documentElement);
    const read=k=>parseFloat(css.getPropertyValue(k));
    return Math.max(Math.abs(r.x-read('--room-tv-left')),Math.abs(r.y-read('--room-tv-top')),Math.abs(r.width-read('--room-tv-width')),Math.abs(r.height-read('--room-tv-height')));
  });assert.ok(alignment<=2,`Handoff mismatch: ${alignment}px`);results.push({check:'desktop handoff alignment',maxErrorPx:alignment});

  const stage=page.locator('#library-stage');const r=await stage.boundingBox();
  await page.mouse.move(r.x+r.width*.55,r.y+r.height*.50);await page.mouse.down();
  await page.mouse.move(r.x+r.width*.15,r.y+r.height*.50,{steps:12});await page.mouse.up();
  assert.equal(await page.locator('#selected-title').textContent(),'BandUp');
  await page.mouse.move(r.x+r.width*.45,r.y+r.height*.5);await page.mouse.down();
  await page.mouse.move(r.x+r.width*.85,r.y+r.height*.5,{steps:12});await page.mouse.up();
  assert.equal(await page.locator('#selected-title').textContent(),'ROOMS');results.push({check:'direct drag and reversal',result:'pass'});

  await page.mouse.move(r.x+r.width/2,r.y+r.height/2);
  await page.mouse.wheel(0,100);await page.mouse.wheel(0,-100);
  assert.equal(await page.locator('#selected-title').textContent(),'ROOMS','Wheel reversal must react to latest direction');
  results.push({check:'immediate wheel reversal',result:'pass'});

  await page.locator('#open-project').click();await page.waitForTimeout(700);
  assert.equal(await page.locator('.library-view').isVisible(),false,'Hidden library must not overlap preview');
  await page.locator('video').focus();await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>window.__crtExperience.state.view),'project','Video keys must not navigate');
  await page.locator('[data-action=close]').first().click();await page.waitForTimeout(650);
  assert.equal(await page.locator('#selected-title').textContent(),'ROOMS');results.push({check:'preview isolation, media keys and return',result:'pass'});

  const memoryBefore=await page.evaluate(()=>window.__crtExperience.metrics());
  for(let i=0;i<5;i++){await page.locator('#open-project').click();await page.waitForTimeout(180);await page.keyboard.press('Escape');await page.waitForTimeout(180);}
  await page.waitForTimeout(700);
  assert.equal(await page.locator('.project-transition-clip').count(),0,'Interrupted expansion left an overlay');
  results.push({check:'repeated interrupted project transitions',result:'pass',metrics:memoryBefore});

  const perf=await page.evaluate(async()=>{
    const values=[];let last=performance.now();
    for(let i=0;i<100;i++){await new Promise(requestAnimationFrame);const now=performance.now();values.push(now-last);last=now;if(i%20===0)document.querySelector('.next:not(:disabled),.previous:not(:disabled)')?.click();}
    const sorted=values.slice(5).sort((a,b)=>a-b);
    return {p50:sorted[Math.floor(sorted.length*.5)],p95:sorted[Math.floor(sorted.length*.95)],samples:sorted.length,dpr:devicePixelRatio,userAgent:navigator.userAgent};
  });results.push({check:'headless frame timing',...perf});

  await page.locator('[data-action=exit]').click();await page.waitForFunction(()=>window.__crtExperience.progress<.001);
  await page.locator('#room-enter').click();await page.waitForTimeout(180);await page.setViewportSize({width:1280,height:800});await settle();
  assert.equal(await page.locator('#open-project').isVisible(),true);results.push({check:'resize during approach',result:'pass'});
  const client=await page.context().newCDPSession(page);
  await client.send('Page.setWebLifecycleState',{state:'frozen'});await new Promise(r=>setTimeout(r,200));
  await client.send('Page.setWebLifecycleState',{state:'active'});await page.waitForTimeout(300);
  assert.equal(await page.locator('#open-project').isVisible(),true);results.push({check:'suspend and resume',result:'pass'});

  await page.evaluate(()=>document.querySelector('#cover-canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.waitForFunction(()=>document.body.classList.contains('library-fallback'));
  await page.locator('.cover-fallback [data-select="2"]').click();await page.locator('#open-project').click();
  assert.match(await page.locator('.preview-heading h1').textContent(),/BandUp/);results.push({check:'WebGL context loss fallback',result:'pass'});

  await page.goto(`${base}/?fail-prop=1`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.documentElement.dataset.optionalProp==='fallback');
  await page.locator('#room-enter').click();await settle();results.push({check:'missing optional model',result:'pass'});
  await page.route('**/rooms-cover.webp',route=>route.abort());
  await page.goto(`${base}/#projects`,{waitUntil:'networkidle'});await settle();
  await page.locator('#open-project').click();assert.match(await page.locator('.preview-heading h1').textContent(),/ROOMS/);
  results.push({check:'missing cover retains project access',result:'pass'});
  await page.unroute('**/rooms-cover.webp');
  await page.goto(`${base}/#projects/%E0%A4%A`,{waitUntil:'networkidle'});await settle();
  assert.equal(await page.evaluate(()=>window.__crtExperience.state.view),'library');
  await page.goto(`${base}/#projects/happensbefore`,{waitUntil:'networkidle'});await page.waitForURL('**/legacy.html#projects/happensbefore');
  results.push({check:'malformed route and retained legacy links',result:'pass'});

  const touchContext=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const touch=await touchContext.newPage();await touch.goto(`${base}/#projects`,{waitUntil:'networkidle'});await touch.waitForTimeout(500);
  const ts=await touch.locator('#library-stage').boundingBox();const tc=await touchContext.newCDPSession(touch);
  const x=ts.x+ts.width*.6,y=ts.y+ts.height*.5;
  await tc.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=6;i++)await tc.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-110*i/6,y}]});
  await tc.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(await touch.locator('#selected-title').textContent(),'BandUp');
  const before=await touch.locator('#selected-title').textContent();
  await tc.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  await tc.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-80}]});await tc.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(await touch.locator('#selected-title').textContent(),before);results.push({check:'real touch swipe and vertical gesture',result:'pass'});await touchContext.close();
  assert.deepEqual(errors,[],'Uncaught runtime errors');
  await fs.writeFile('docs/browser-results.json',JSON.stringify({results,errors},null,2));console.log(JSON.stringify({result:'PASS',results},null,2));
}catch(e){if(page)await page.screenshot({path:'docs/screenshots/resilience-failure.png'}).catch(()=>{});console.error(JSON.stringify(results,null,2));throw e;}
finally{await browser.close();}
