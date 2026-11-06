import fs from 'node:fs/promises';
import { launchBrowser } from './browser-utils.mjs';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:5173';
const browser=await launchBrowser();
try {
  const page=await browser.newPage({viewport:{width:1560,height:1000},deviceScaleFactor:1});
  page.on('pageerror',e=>console.error('PAGE ERROR',e.message));
  await page.goto(`${base}/?capture=1`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('.bezel').evaluate(img=>img.decode());
  await page.locator('#tv').screenshot({path:'public/assets/experience/crt-front.png',animations:'disabled'});
  const calibration=await page.evaluate(()=>{
    const plain=r=>({x:r.x,y:r.y,width:r.width,height:r.height});
    return {shell:plain(document.querySelector('#tv').getBoundingClientRect()),screen:plain(document.querySelector('.glass').getBoundingClientRect())};
  });
  await fs.writeFile('public/assets/experience/crt-calibration.json',JSON.stringify(calibration,null,2));
  console.log('Captured existing CRT shell',calibration);
}finally{await browser.close();}
