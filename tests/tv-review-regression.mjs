import assert from 'node:assert/strict';
import * as THREE from 'three';
import { launchBrowser } from '../scripts/browser-utils.mjs';
const browser=await launchBrowser(),failures=[];
try{
 for(const kind of['comparison','occlusion','power']){
  const p=await browser.newPage({viewport:{width:1440,height:1000}});
  try{
   await p.goto('http://127.0.0.1:5188/tv-review.html',{waitUntil:'networkidle'});await p.waitForFunction(()=>window.__tvReview?.ready);
   if(kind==='comparison'){await p.locator('#compare').click();await p.waitForTimeout(250);assert.equal(await p.evaluate(()=>window.__tvReview.fullyFramed),true,'Compare clips model');}
   if(kind==='power'){assert.equal(await p.locator('#screen-power').count(),1,'Missing accessible power preview');await p.locator('#screen-power').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('#screen-power').getAttribute('aria-pressed'),'false');}
   if(kind==='occlusion'){
    await p.locator('[data-view=rear]').click();await p.waitForTimeout(850);
    const r=await p.locator('#model-canvas').boundingBox();
    const cam=new THREE.PerspectiveCamera(33,r.width/r.height,.1,50);cam.position.set(5,2,-8.6);cam.lookAt(0,0,0);cam.updateMatrixWorld();
    const v=new THREE.Vector3((1416.4-780)*6/1560,(500-531)*6/1560,.365).project(cam);
    await p.mouse.click(r.x+(v.x+1)/2*r.width,r.y+(1-v.y)/2*r.height);
    assert.equal(await p.evaluate(()=>window.__tvReview.selection),0,'Hidden front button activated through cabinet');
   }
   console.log('PASS',kind);
  }catch(e){failures.push(`${kind}: ${e.message}`);}finally{await p.close();}
 }assert.deepEqual(failures,[]);
}finally{await browser.close();}
