import fs from 'node:fs/promises';
import { launchBrowser } from './browser-utils.mjs';
const browser=await launchBrowser();
try{
 const p=await browser.newPage({viewport:{width:1560,height:1000}});
 await p.goto('http://127.0.0.1:5188/legacy.html#home',{waitUntil:'networkidle'});
 await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
 const data=await p.evaluate(()=>Object.fromEntries(['#tv','.controls','.screen-assembly','.glass','.dial-face','.speaker','.sound-knob','#power'].map(s=>{const r=document.querySelector(s).getBoundingClientRect();return[s,{x:r.x,y:r.y,width:r.width,height:r.height}];})));
 await fs.mkdir('docs/tv-review',{recursive:true});await fs.writeFile('docs/tv-review/measurements.json',JSON.stringify(data,null,2));
 await p.locator('#tv').screenshot({path:'public/assets/experience/original-tv-reference.png'});
 console.log(JSON.stringify(data));
}finally{await browser.close();}
