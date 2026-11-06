import { chromium } from 'playwright-core';
import fs from 'node:fs';
export async function launchBrowser(options={}) {
  const candidates=[process.env.CHROME_PATH,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','C:/Program Files/Microsoft/Edge/Application/msedge.exe'];
  const executablePath=candidates.find(p=>p&&fs.existsSync(p));
  if(!executablePath)throw new Error('Chrome/Edge not found. Set CHROME_PATH.');
  return chromium.launch({executablePath,headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],...options});
}
