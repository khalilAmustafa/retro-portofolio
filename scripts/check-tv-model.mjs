import { launchBrowser } from './browser-utils.mjs';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
await fs.mkdir('docs/tv-review',{recursive:true});
const b=await launchBrowser();const errors=[];
try{
const p=await b.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:5188/tv-review.html',{waitUntil:'networkidle'});await p.waitForFunction(()=>window.__tvReview?.ready);
await p.screenshot({path:'docs/tv-review/front.png'});
await p.locator('[data-view=quarter]').click();await p.waitForTimeout(850);await p.screenshot({path:'docs/tv-review/quarter.png'});
await p.locator('[data-light=warm]').click();await p.screenshot({path:'docs/tv-review/evening.png'});
await p.locator('#channel').selectOption('4');assert.equal(await p.evaluate(()=>window.__tvReview.selection),4);
await p.locator('[data-view=front]').click();await p.waitForTimeout(850);
await p.locator('#compare').click();await p.waitForTimeout(200);assert.equal(await p.locator('#reference').isVisible(),true);
await p.screenshot({path:'docs/tv-review/compare.png'});
await p.locator('#compare').click();await p.setViewportSize({width:390,height:844});await p.waitForTimeout(200);
await p.screenshot({path:'docs/tv-review/mobile.png'});
assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
const metrics=await p.evaluate(()=>window.__tvReview.metrics());await fs.writeFile('docs/tv-review/browser-check.json',JSON.stringify({result:'PASS',errors,metrics},null,2));console.log(JSON.stringify({result:'PASS',errors,metrics}));
}finally{await b.close();}
