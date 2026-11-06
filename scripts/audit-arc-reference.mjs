import { launchBrowser } from './browser-utils.mjs';
import fs from 'node:fs/promises';
const out='docs/arc-reference';await fs.mkdir(out,{recursive:true});const browser=await launchBrowser();
try{const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto('https://www.arcmarumo.com/',{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(6500);
 await page.screenshot({path:`${out}/home.png`});
 await fs.writeFile(`${out}/home.json`,JSON.stringify(await page.evaluate(()=>({text:document.body.innerText,links:[...document.querySelectorAll('a')].map(a=>({text:a.innerText,href:a.href})),fonts:[...document.fonts].map(f=>({family:f.family,status:f.status})),colors:[...document.querySelectorAll('body,h1,nav')].map(e=>({tag:e.tagName,color:getComputedStyle(e).color,background:getComputedStyle(e).backgroundColor,font:getComputedStyle(e).fontFamily}))})),null,2));
 await page.mouse.move(800,450);await page.mouse.wheel(0,550);await page.waitForTimeout(1400);await page.screenshot({path:`${out}/scrolled.png`});
 await page.goto('https://www.arcmarumo.com/profile',{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(4500);await page.screenshot({path:`${out}/profile.png`});
 await page.goto('https://www.arcmarumo.com/work/remyshoots',{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(4500);await page.screenshot({path:`${out}/work.png`});
 await page.mouse.wheel(0,750);await page.waitForTimeout(1200);await page.screenshot({path:`${out}/work-scroll.png`});console.log('Saved Arc reference home, scroll, profile and project captures.');
}finally{await browser.close();}
