import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { launchBrowser } from '../scripts/browser-utils.mjs';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:5188';
const output='docs/screenshots';await fs.mkdir(output,{recursive:true});
const browser=await launchBrowser();const errors=[],failures=[];let page;
try {
  page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400&&!r.url().includes('fonts.'))failures.push(`${r.status()} ${r.url()}`);});
  await page.goto(`${base}/previous.html`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.__crtExperience?.ready);
  await page.screenshot({path:`${output}/desktop-room.png`});
  await page.locator('#room-enter').click();
  await page.waitForFunction(()=>window.__crtExperience.progress>.999);
  await page.waitForTimeout(650);
  assert.equal(await page.locator('#tv').getAttribute('aria-hidden'),'false');
  await page.screenshot({path:`${output}/desktop-library.png`});
  await page.locator('#library-stage').focus();
  await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowLeft');
  assert.equal(await page.locator('#selected-title').textContent(),'Space Day');
  await page.locator('#open-project').click();
  await page.waitForFunction(()=>window.__crtExperience.state.view==='project');
  await page.waitForTimeout(600);await page.screenshot({path:`${output}/desktop-space-day.png`});
  await page.locator('[data-action=close]').first().click();
  await page.waitForTimeout(500);
  assert.equal(await page.locator('#selected-title').textContent(),'Space Day');
  await page.goBack(); // previous history entry is project (the visible Back control adds library).
  await page.waitForTimeout(300);
  await page.goto(`${base}/previous.html#projects/rooms`,{waitUntil:'networkidle'});
  assert.equal(await page.locator('video').count(),1);
  await page.screenshot({path:`${output}/desktop-rooms.png`});
  await page.locator('[data-action=close]').first().click();await page.waitForTimeout(500);
  await page.keyboard.press('Escape');await page.waitForFunction(()=>window.__crtExperience.progress<.001);
  // An approach can reverse from its current position.
  await page.locator('#room-enter').click();await page.waitForTimeout(250);
  await page.keyboard.press('Escape');await page.waitForFunction(()=>window.__crtExperience.progress<.001);
  assert.equal(await page.locator('#room-enter').isEnabled(),true);
  for(const [width,height]of[[768,1024],[390,844]]){
    await page.setViewportSize({width,height});await page.goto(`${base}/previous.html`,{waitUntil:'networkidle'});
    await page.screenshot({path:`${output}/${width}-room.png`});
    await page.locator('#skip-room').click();await page.waitForFunction(()=>window.__crtExperience.progress>.999);await page.waitForTimeout(600);
    await page.screenshot({path:`${output}/${width}-library.png`});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page overflow');
    const box=await page.locator('#open-project').boundingBox();assert.ok(box.height>=40,'Open target too small');
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(`${base}/previous.html?no-webgl=1#projects`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.__crtExperience.progress===1);
  assert.equal(await page.locator('.cover-fallback').isVisible(),true);
  await page.locator('.cover-fallback [data-select="2"]').click();
  await page.locator('#open-project').click();
  assert.equal(await page.locator('.bandup-journey').isVisible(),true);
  await page.screenshot({path:`${output}/390-fallback.png`});
  assert.deepEqual(errors,[],'Browser console/runtime errors');
  assert.deepEqual(failures,[],'Failed local assets');
  console.log(JSON.stringify({result:'PASS',errors,failures,screenshots:output},null,2));
}catch(error){
  if(page)await page.screenshot({path:`${output}/failure.png`}).catch(()=>{});
  console.error(JSON.stringify({errors,failures},null,2));throw error;
}finally{await browser.close();}

