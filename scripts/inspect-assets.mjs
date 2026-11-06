import fs from 'node:fs/promises';
for(const id of ['gamepad','desk_lamp_arm_01']) {
 const r=await fetch('https://api.polyhaven.com/files/'+id);const data=await r.json();
 await fs.writeFile('public/assets/experience/'+id+'-files.json',JSON.stringify(data,null,2));
 console.log(id,JSON.stringify(data.gltf?.['1k']??data.gltf??Object.keys(data)).slice(0,5500));
}
