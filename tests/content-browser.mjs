import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { launchBrowser } from '../scripts/browser-utils.mjs';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:5188';
const out='docs/content-review';await fs.mkdir(out,{recursive:true});
const browser=await launchBrowser(),errors=[],failedAssets=[];
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failedAssets.push(`${r.status()} ${r.url()}`);});
async function open(hash){await page.goto(`${base}/previous.html${hash}`,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__crtExperience?.ready&&window.__crtExperience.progress>.999);await page.waitForTimeout(350);}
async function channel(id){await page.locator('#portfolio-channel').selectOption(id);await page.waitForFunction(id=>window.__crtExperience.state.channelId===id,id);}
try{
 await open('#projects/asad-math');
 await page.getByRole('tab',{name:'02 Explore the system'}).click();
 await page.locator('[data-stage="3"]').click();assert.match(await page.locator('[data-stage-title]').textContent(),/Instructor/);
 await page.screenshot({path:`${out}/desktop-asad-system.png`});
 await page.getByRole('tab',{name:'02 Explore the system'}).focus();await page.keyboard.press('ArrowRight');
 assert.equal(await page.getByRole('tab',{name:'03 My contribution'}).getAttribute('aria-selected'),'true');
 await page.keyboard.press('ArrowRight');assert.equal(await page.getByRole('tab',{name:'04 Results'}).getAttribute('aria-selected'),'true');
 await channel('archive');assert.equal(await page.locator('.archive-item').count(),11);
 await page.screenshot({path:`${out}/desktop-all-work.png`});
 await page.locator('.archive-item[href="#projects/asad-math"]').click();
 await page.waitForFunction(()=>window.__crtExperience.state.projectId==='asad-math');
 await page.getByRole('tab',{name:'03 My contribution'}).click();
 assert.match(await page.locator('[role=tabpanel]:visible').textContent(),/Socket.io/);
 assert.match(await page.locator('[role=tabpanel]:visible').textContent(),/real-time payment status/);
 await page.screenshot({path:`${out}/desktop-asad-contribution.png`});
 await channel('skills');await page.locator('[data-skill="3"]').click();
 assert.match(await page.locator('[data-skill-panel]:visible').textContent(),/Flutter/);
 await channel('education');assert.match(await page.locator('.academic-record').textContent(),/87\/100.*89\/132/);
 await channel('certifications');assert.equal(await page.locator('.credential-records>article').count(),18);
 await page.locator('[data-credential-type=Competition]').click();assert.equal(await page.locator('[data-record-type]:visible').count(),2);
 assert.equal(await page.locator('progress').getAttribute('value'),'8');
 await channel('contact');assert.equal(await page.locator('.contact-address').getAttribute('href'),'mailto:khalil.asad.2005@gmail.com');
 await open('#projects/bandup');await page.locator('.learning-dock [data-phase-next]').click();await page.waitForTimeout(700);await page.locator('.learning-dock [data-phase-next]').click();await page.waitForTimeout(700);await page.locator('[data-graph-node="2"]').click();assert.match(await page.locator('[data-graph-detail]').textContent(),/R&D/);
 await page.screenshot({path:`${out}/desktop-bandup-research.png`});
 await open('#projects/rooms');assert.equal(await page.locator('video').count(),1);
 for(let i=0;i<3;i++){await page.locator('.learning-dock [data-phase-next]').click();await page.waitForTimeout(700);}assert.match(await page.locator('.award-object').textContent(),/TEAM AWARD/);
 // Every project from both portfolios resolves within this experience.
 const ids=['nasa-space-apps','makan','happensbefore','futureing','abyss-of-the-loss','vision-career','vision-pulse'];
 for(const id of ids){await page.evaluate(id=>location.hash=`projects/${id}`,id);await page.waitForFunction(id=>window.__crtExperience.state.projectId===id,id);assert.equal(await page.getByRole('tab').count(),4);}
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const [width,height]of[[768,1024],[390,844]]){
  await page.setViewportSize({width,height});await open('#projects/asad-math');
  await page.getByRole('tab',{name:'02 Explore the system'}).click();
  await page.screenshot({path:`${out}/${width}-system.png`});
  const box=await page.getByRole('tab',{name:'02 Explore the system'}).boundingBox();assert.ok(box.height>=44,`Chapter target ${box.height}px`);
  for(const id of ['archive','experience','skills','education','certifications','contact']){
   await channel(id);const overflow=await page.locator('#screen-content').evaluate(el=>el.scrollWidth>el.clientWidth+2);assert.equal(overflow,false,`${width}px ${id} content overflow`);
  }
  await page.screenshot({path:`${out}/${width}-contact.png`});
 }
 await page.goBack();await page.waitForTimeout(250);
 assert.deepEqual(errors,[]);assert.deepEqual(failedAssets,[]);
 await fs.writeFile(`${out}/checks.json`,JSON.stringify({result:'PASS',projects:11,publishedCredentialRecords:18,errors,failedAssets},null,2));
 console.log(JSON.stringify({result:'PASS',projects:11,publishedCredentialRecords:18,errors,failedAssets}));
}catch(error){await page.screenshot({path:`${out}/failure.png`}).catch(()=>{});console.log(JSON.stringify({errors,failedAssets}));throw error;}
finally{await browser.close();}

