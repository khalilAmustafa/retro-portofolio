import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { launchBrowser } from '../scripts/browser-utils.mjs';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:5188',out='docs/learning-review';await fs.mkdir(out,{recursive:true});
const browser=await launchBrowser(),errors=[],failedAssets=[];const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failedAssets.push(r.url());});
async function open(id){await page.goto(`${base}/previous.html#projects/${id}`,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__crtExperience?.progress>.999);await page.waitForTimeout(300);}
async function next(){await page.locator('.learning-dock [data-phase-next]').click();await page.waitForTimeout(800);}
try{
 await open('rooms');await page.screenshot({path:`${out}/desktop-rooms.png`});await next();
 await page.locator('[data-answer="0"]').click();assert.match(await page.locator('[data-round-feedback]').textContent(),/changes the result/);
 await page.locator('[data-answer="1"]').click();assert.match(await page.locator('[data-round-feedback]').textContent(),/Correct/);
 await page.screenshot({path:`${out}/desktop-round.png`});await next();await page.locator('[data-runtime-node="3"]').click();assert.match(await page.locator('[data-runtime-detail]').textContent(),/score review/);
 await next();await page.locator('[data-video-toggle]').first().click();assert.equal(await page.locator('.learning-video').isVisible(),true);assert.equal(await page.locator('video').count(),1);await page.keyboard.press('Escape');assert.equal(await page.locator('.learning-video').isVisible(),false);
 await open('bandup');await next();await page.locator('[data-lesson-node="2"]').click();assert.match(await page.locator('[data-lesson-detail]').textContent(),/Rule explanations/);await next();
 await page.locator('[data-graph-node="2"]').click();await page.waitForTimeout(650);assert.match(await page.locator('[data-graph-detail]').textContent(),/R&D/);assert.equal(await page.locator('.graph-traveler').getAttribute('cy'),'245');
 await page.screenshot({path:`${out}/desktop-learning-graph.png`});
 // Capture frame intervals while directly scrubbing; report the measurement, not universal performance.
 await page.evaluate(()=>{window.__storyFrames=[];let previous=performance.now();function sample(time){window.__storyFrames.push(time-previous);previous=time;if(window.__storyFrames.length<100)requestAnimationFrame(sample);}requestAnimationFrame(sample);});
 const slider=await page.locator('.learning-dock input').boundingBox();await page.mouse.move(slider.x+slider.width*.65,slider.y+slider.height/2);await page.mouse.down();await page.mouse.move(slider.x+slider.width*.15,slider.y+slider.height/2,{steps:50});await page.mouse.move(slider.x+slider.width*.8,slider.y+slider.height/2,{steps:50});await page.mouse.up();await page.waitForTimeout(1800);
 const frameTimes=await page.evaluate(()=>window.__storyFrames.slice(2).filter(n=>n>0).sort((a,b)=>a-b));const performance={browser:'Local headless Chrome',viewport:'1440x1000',samples:frameTimes.length,p50ms:frameTimes[Math.floor(frameTimes.length*.5)],p95ms:frameTimes[Math.floor(frameTimes.length*.95)]};
 for(const width of[768,390]){await page.setViewportSize({width,height:width===390?844:1024});await page.emulateMedia({reducedMotion:'reduce'});for(const id of['rooms','bandup']){await open(id);await next();if(id==='rooms')await page.locator('[data-answer="1"]').click();else{await next();await page.locator('[data-graph-node="3"]').click();}await page.screenshot({path:`${out}/${width}-${id}.png`});assert.equal(await page.locator('#screen-content').evaluate(el=>el.scrollWidth>el.clientWidth+1),false);}}
 assert.deepEqual(errors,[]);assert.deepEqual(failedAssets,[]);await fs.writeFile(`${out}/checks.json`,JSON.stringify({result:'PASS',errors,failedAssets,performance},null,2));console.log(JSON.stringify({result:'PASS',errors,failedAssets,performance}));
}catch(error){await page.screenshot({path:`${out}/failure.png`});throw error;}finally{await browser.close();}

