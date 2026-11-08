import fs from 'node:fs/promises';
import { catalog,channelProjects } from '../src/channel/content.js';

// Read-only checks: distinguish public HTTP failures from missing local assets.
const hrefs=new Set([
 ...channelProjects.flatMap(p=>p.links.map(l=>l.href)),
 ...channelProjects.flatMap(p=>p.media.flatMap(m=>[m.creditHref]).filter(Boolean)),
 ...catalog.evidence.map(e=>e.href).filter(Boolean),
 ...catalog.credentials.records.map(r=>r.evidenceHref),
 ...catalog.contact.links.map(l=>l.href),
]);
const local=new Set([
 ...channelProjects.flatMap(p=>p.media.filter(m=>m.ready).flatMap(m=>[m.src,m.poster]).filter(Boolean)),
 ...catalog.education.institutions.map(s=>s.media.src),
 ...[...hrefs].filter(h=>!h.startsWith('https://')),
]);
const assets=[];for(const path of local){try{await fs.access(new URL('../public/'+path,import.meta.url));assets.push({path,exists:true});}catch{assets.push({path,exists:false});}}
const external=[];const urls=[...hrefs].filter(h=>h.startsWith('https://'));
for(let offset=0;offset<urls.length;offset+=4){
 await Promise.all(urls.slice(offset,offset+4).map(async url=>{
  try{let response=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(12000)});
   if([403,405].includes(response.status)){response=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(12000)});await response.body?.cancel();}
   external.push({url,status:response.status,finalUrl:response.url});
  }catch(error){external.push({url,error:error.cause?.code??error.name});}
 }));
}
const report={checkedAt:new Date().toISOString(),assets,external};
await fs.mkdir(new URL('../docs/ux-refinement/',import.meta.url),{recursive:true});
await fs.writeFile(new URL('../docs/ux-refinement/link-checks.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({assets:assets.length,missing:assets.filter(a=>!a.exists),external:external.length,needsReview:external.filter(r=>!r.status||r.status>=400)},null,2));
if(assets.some(a=>!a.exists)||external.some(r=>!r.status||r.status>=400))process.exitCode=1;
