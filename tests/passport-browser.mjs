import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { launchBrowser } from '../scripts/browser-utils.mjs';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:5188',out='docs/passport-review';await fs.mkdir(out,{recursive:true});
const browser=await launchBrowser(),errors=[];const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
const next=async()=>{await page.locator('[data-story-next]').click();await page.waitForTimeout(800);};
try{
 await page.goto(`${base}/previous.html#projects/space-day`,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__crtExperience?.progress>.999);await page.waitForTimeout(300);
 await page.screenshot({path:`${out}/desktop-cover.png`});
 await next();await page.locator('[data-language=ar]').click();assert.equal(await page.locator('.passport-open').getAttribute('dir'),'rtl');
 await page.screenshot({path:`${out}/desktop-passport.png`});
 await next();await page.locator('[data-scan]').click();await page.waitForTimeout(500);assert.match(await page.locator('[data-scan-result]').textContent(),/approved/);
 await page.locator('[data-scan]').click();await page.waitForTimeout(500);assert.match(await page.locator('[data-scan-result]').textContent(),/repeat scan/);
 await page.locator('[data-expire]').click();await page.locator('[data-scan]').click();await page.waitForTimeout(500);assert.match(await page.locator('[data-scan-result]').textContent(),/Expired code rejected/);
 await page.screenshot({path:`${out}/desktop-scan.png`});
 for(let i=0;i<2;i++){await page.locator('[data-next-station]').click();await page.locator('[data-scan]').click();await page.waitForTimeout(500);}
 assert.match(await page.locator('[data-stamp-count]').textContent(),/3 \/ 3/);await next();assert.equal(await page.locator('.mission-certificate').evaluate(el=>el.classList.contains('is-unlocked')),true);
 await page.screenshot({path:`${out}/desktop-certificate.png`});
 await page.locator('[data-build-toggle]').first().click();assert.equal(await page.locator('.mission-build').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('.mission-build').isVisible(),false);assert.equal(await page.evaluate(()=>window.__crtExperience.state.view),'project');
 // Rapid direction reversal follows the latest gesture, without a queued scene change.
 await page.locator('[data-story-next]').click();await page.waitForTimeout(800);await next();
 const world=await page.locator('.mission-world').boundingBox();await page.mouse.move(world.x+world.width*.8,world.y+world.height*.5);await page.mouse.wheel(0,200);await page.mouse.wheel(0,-200);await page.waitForTimeout(800);assert.ok(Number(await page.locator('#mission-progress').inputValue())<1.1);
 for(const width of[768,390]){
  await page.setViewportSize({width,height:width===390?844:1024});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(`${base}/previous.html#projects/space-day`,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__crtExperience?.progress===1);
  await page.screenshot({path:`${out}/${width}-cover.png`});await next();await next();await page.locator('[data-scan]').click();assert.match(await page.locator('[data-scan-result]').textContent(),/approved/);
  await page.screenshot({path:`${out}/${width}-scan.png`});assert.equal(await page.locator('#screen-content').evaluate(el=>el.scrollWidth>el.clientWidth+1),false);
  assert.ok((await page.locator('[data-scan]').boundingBox()).height>=44);
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({result:'PASS',errors,desktopAndMobile:true}));
}catch(error){await page.screenshot({path:`${out}/failure.png`});throw error;}finally{await browser.close();}

