import fs from 'node:fs/promises';
import path from 'node:path';
const data=JSON.parse(await fs.readFile('public/assets/experience/gamepad-files.json','utf8'));
const asset=data.gltf['1k'].gltf;
const root='public/assets/experience/gamepad';await fs.mkdir(root,{recursive:true});
async function download(url,dest){const res=await fetch(url);if(!res.ok)throw new Error(res.status+' '+url);const bytes=new Uint8Array(await res.arrayBuffer());await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,bytes);return bytes.byteLength;}
let total=await download(asset.url,root+'/model.gltf');
for(const [name,file]of Object.entries(asset.include)){total+=await download(file.url,path.join(root,name));}
console.log('Downloaded CC0 Gamepad model and textures:',total,'bytes');
