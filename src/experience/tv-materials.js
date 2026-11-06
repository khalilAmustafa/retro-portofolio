import * as THREE from 'three';
export function createTvMaterials(palette){
 const textures=[];
 // Deterministic moulded-plastic grain, including broad, very quiet ageing.
 function surfaceTexture(kind){
  const w=512,h=256,data=new Uint8Array(w*h*4);let seed=319;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   seed=(seed*16807)%2147483647;const n=seed/2147483647;
   const broad=Math.sin(x*.037+Math.sin(y*.021)*2)*Math.cos(y*.029);
   let r,g,b;
   if(kind==='rough'){r=g=b=Math.round(200+n*45+broad*8);}
   else if(kind==='bump'){r=g=b=Math.round(128+(n-.5)*42);}
   else {
    const edge=Math.pow(Math.max(Math.abs(x-w/2)/(w/2),Math.abs(y-h/2)/(h/2)),5);
    r=Math.round(248+n*5+broad*2-edge*4);g=Math.round(r-2-edge*6);b=Math.round(r-5-edge*14);
   }
   const i=(y*w+x)*4;data.set([r,g,b,255],i);
  }
  const tex=new THREE.DataTexture(data,w,h);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
  tex.minFilter=THREE.LinearMipmapLinearFilter;tex.magFilter=THREE.LinearFilter;tex.generateMipmaps=true;
  if(kind==='color')tex.colorSpace=THREE.SRGBColorSpace;
  tex.repeat.set(kind==='bump'?2:1,kind==='bump'?2:1);tex.needsUpdate=true;textures.push(tex);return tex;
 }
 const roughnessMap=surfaceTexture('rough'),bumpMap=surfaceTexture('bump'),colorMap=surfaceTexture('color');
 const materials={
  cream:new THREE.MeshPhysicalMaterial({color:palette.cream,map:colorMap,roughness:.76,roughnessMap,bumpMap,bumpScale:.012,metalness:0,clearcoat:.025,clearcoatRoughness:.8}),
  trim:new THREE.MeshStandardMaterial({color:palette.edge,roughness:.46,roughnessMap,metalness:.22}),
  olive:new THREE.MeshStandardMaterial({color:palette.olive,map:colorMap,roughness:.84,roughnessMap,bumpMap,bumpScale:.009}),
  black:new THREE.MeshStandardMaterial({color:'#55564d',roughness:.78,roughnessMap,bumpMap,bumpScale:.012}),
  grip:new THREE.MeshStandardMaterial({color:'#d8c9a5',roughness:.28,roughnessMap,metalness:.06}),
  dark:new THREE.MeshStandardMaterial({color:'#0c160c',roughness:.88,bumpMap,bumpScale:.001}),
  metal:new THREE.MeshStandardMaterial({color:'#727a60',roughness:.45,metalness:.7}),
  glass:new THREE.MeshPhysicalMaterial({color:'#dfe8d6',transparent:true,opacity:.36,roughness:.075,metalness:.6,clearcoat:1,clearcoatRoughness:.045,envMapIntensity:2.3,depthWrite:false}),
  screen:new THREE.MeshBasicMaterial({color:'#e8e6cf',toneMapped:false,transparent:true})
 };
 // Visible, located patina. The original micro-grain was filtered away at viewing distance.
 if(typeof document!=='undefined'){
  let seed=4721;const rand=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
  function finish(kind){
   const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;const c=canvas.getContext('2d');
   c.fillStyle=kind==='panel'?'#474d34':kind==='rubber'?'#96978b':'#f0e3c7';c.fillRect(0,0,1024,1024);
   // Uneven oxidised finish, not a flat tint or a global dirt overlay.
   for(let i=0;i<65;i++){
    const x=rand()*1024,y=rand()*1024,r=40+rand()*160,g=c.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,kind==='rubber'?'rgba(83,74,48,.10)':'rgba(97,65,24,.035)');g.addColorStop(1,'rgba(60,40,20,0)');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);
   }
   for(let i=0;i<75000;i++){
    c.fillStyle=rand()>.5?'rgba(31,28,18,.13)':'rgba(255,240,200,.12)';const r=.5+rand()*1.5;c.fillRect(rand()*1024,rand()*1024,r,r);
   }
   const edge=c.createLinearGradient(0,0,1024,0);edge.addColorStop(0,'rgba(52,39,17,.38)');edge.addColorStop(.045,'rgba(52,39,17,0)');edge.addColorStop(.95,'rgba(52,39,17,0)');edge.addColorStop(1,'rgba(52,39,17,.30)');c.fillStyle=edge;c.fillRect(0,0,1024,1024);
   if(kind==='panel'){
    const halo=c.createRadialGradient(512,145,54,512,145,155);halo.addColorStop(0,'rgba(193,177,125,0)');halo.addColorStop(.62,'rgba(193,177,125,.24)');halo.addColorStop(1,'rgba(193,177,125,0)');c.fillStyle=halo;c.fillRect(340,0,344,320);
    for(let row=0;row<7;row++){
     const y=310+row*57;c.save();c.translate(685,y);c.scale(1,.36);const g=c.createRadialGradient(0,0,1,0,0,80);g.addColorStop(0,'rgba(177,166,117,.16)');g.addColorStop(1,'rgba(177,166,117,0)');c.fillStyle=g;c.fillRect(-80,-80,160,160);c.restore();
    }
    // Dust sits in the speaker area and seams; a few small finish losses live on outer edges.
    for(let i=0;i<160;i++){const x=60+rand()*900,y=744+rand()*60;c.fillStyle='rgba(197,179,132,.24)';c.fillRect(x,y,rand()*8+1,1);}
   }
   for(let i=0;i<(kind==='rubber'?80:145);i++){
    const x=rand()<.6?(rand()<.5?rand()*35:989+rand()*35):rand()*1024,y=rand()*1024;
    c.strokeStyle=kind==='panel'?'rgba(192,177,127,.40)':'rgba(73,62,41,.27)';c.lineWidth=.6+rand();c.beginPath();c.moveTo(x,y);c.lineTo(x+rand()*16-8,y+rand()*5-2);c.stroke();
   }
   // Fine dust gathers at the bottom of the moulding, while casing chips stay at edges.
   for(let i=0;i<2600;i++){
    const x=rand()*1024,y=kind==='rubber'?rand()*100:rand()*1024;
    if(kind!=='rubber'&&x>28&&x<996&&y>28&&y<996)continue;
    c.fillStyle=kind==='rubber'?'rgba(201,169,116,.40)':'rgba(94,72,41,.40)';
    c.fillRect(x,y,.6+rand()*2.2,.5+rand()*1.5);
   }
   const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;textures.push(tex);return tex;
  }
  materials.cream.map=finish('cream');materials.cream.color.set('white');materials.cream.bumpScale=.018;
  materials.olive.map=finish('panel');materials.olive.color.set('white');materials.olive.bumpScale=.016;
  materials.black.map=finish('rubber');materials.black.roughness=.62;materials.black.bumpScale=.018;
  // Smears alter reflection roughness, leaving screen content clear.
  const smudge=document.createElement('canvas');smudge.width=512;smudge.height=512;const sc=smudge.getContext('2d');sc.fillStyle='#686868';sc.fillRect(0,0,512,512);
  for(const[x,y]of[[55,435],[450,70],[430,410]]){
   const g=sc.createRadialGradient(x,y,0,x,y,58);g.addColorStop(0,'#dddddd');g.addColorStop(1,'#686868');sc.fillStyle=g;sc.fillRect(x-58,y-58,116,116);
  }
  const smudgeMap=new THREE.CanvasTexture(smudge);textures.push(smudgeMap);materials.glass.roughnessMap=smudgeMap;materials.glass.clearcoatRoughnessMap=smudgeMap;
 }
 return{materials,textures,dispose(){Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
