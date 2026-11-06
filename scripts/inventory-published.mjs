import { launchBrowser } from './browser-utils.mjs';
import fs from 'node:fs/promises';
const out='docs/content-sources';await fs.mkdir(out,{recursive:true});
const browser=await launchBrowser();
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const responses=[];page.on('response',r=>{if(r.url().includes('khalils.codes'))responses.push({url:r.url(),status:r.status()});});
 await page.goto('https://khalils.codes',{waitUntil:'domcontentloaded',timeout:30000}).catch(e=>console.log(`Navigation note: ${e.message.split('\n')[0]}`));
 await page.waitForFunction(()=>!document.querySelector('.loading-screen'),{timeout:15000}).catch(()=>{});
 const snapshot=await page.evaluate(()=>({url:location.href,title:document.title,text:document.body.innerText,links:[...document.querySelectorAll('a')].map(a=>({text:a.innerText,href:a.href})),buttons:[...document.querySelectorAll('button')].map(b=>({text:b.innerText,label:b.getAttribute('aria-label')})),scripts:[...document.scripts].map(s=>s.src).filter(Boolean)}));
 await fs.writeFile(`${out}/published-home.json`,JSON.stringify(snapshot,null,2));
 await page.screenshot({path:`${out}/published-home.png`,fullPage:true});
 await fs.writeFile(`${out}/published-responses.json`,JSON.stringify(responses,null,2));
 const channels={};
 for(const [id,label]of[['experience','02_Experience'],['education','03_Education'],['skills','04_Skills'],['projects','05_Projects'],['certifications','06_Certifications'],['contact','07_Contact']]){
  const menu=page.getByRole('button',{name:'Open navigation',exact:true});if(await menu.isVisible())await menu.click();
  await page.getByRole('button',{name:label,exact:true}).click();
  await page.waitForTimeout(650);
  channels[id]=await page.evaluate(()=>({text:document.body.innerText,links:[...document.querySelectorAll('a')].map(a=>({text:a.innerText,href:a.href}))}));
 }
 await fs.writeFile(`${out}/published-channels.json`,JSON.stringify(channels,null,2));
 console.log(JSON.stringify(channels,null,2));
}finally{await browser.close();}
