import { launchBrowser } from './browser-utils.mjs';
import fs from 'node:fs/promises';
const out='docs/channel-review';await fs.mkdir(out,{recursive:true});const browser=await launchBrowser();const errors=[];
try{const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5188/channel.html',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__personalChannel?.ready);await page.waitForTimeout(1200);await page.screenshot({path:`${out}/desktop-home.png`});
 await page.locator('.collection-stage').hover();await page.mouse.wheel(0,370);await page.waitForTimeout(900);await page.screenshot({path:`${out}/desktop-browse.png`});
 await page.locator('.collection-open').click();await page.waitForTimeout(1000);await page.screenshot({path:`${out}/desktop-case.png`});
 await page.locator('.case-scroll').hover();await page.mouse.wheel(0,650);await page.waitForTimeout(700);await page.screenshot({path:`${out}/desktop-case-scroll.png`});
 await page.locator('[data-nav=atlas]').click();await page.waitForTimeout(1200);await page.screenshot({path:`${out}/desktop-atlas.png`});
 await page.locator('[data-nav=profile]').click();await page.waitForTimeout(500);await page.screenshot({path:`${out}/desktop-profile.png`});
 for(const [width,height]of[[768,1024],[390,844]]){await page.setViewportSize({width,height});await page.locator('[data-nav=work]').click();await page.waitForTimeout(700);await page.screenshot({path:`${out}/${width}-home.png`});await page.locator('.collection-open').click();await page.waitForTimeout(900);await page.screenshot({path:`${out}/${width}-case.png`});await page.locator('[data-nav=atlas]').click();await page.waitForTimeout(800);await page.screenshot({path:`${out}/${width}-atlas.png`});}
 console.log(JSON.stringify({errors,frame:await page.evaluate(()=>window.__personalChannel.frame)}));
}finally{await browser.close();}
