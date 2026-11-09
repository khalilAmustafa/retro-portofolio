import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { TV_SPEC } from './tv-spec.js';
import { createTvMaterials } from './tv-materials.js';

function rounded(w,h,r){
 const s=new THREE.Shape(),x=-w/2,y=-h/2;
 s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);
 s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
 s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);
 s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
}
function aperture(w,h){
 const p=new THREE.Path();
 for(let i=0;i<=128;i++){
  const t=-i/128*Math.PI*2,c=Math.cos(t),s=Math.sin(t);
  const x=w/2*Math.sign(c)*Math.pow(Math.abs(c),.4),y=h/2*Math.sign(s)*Math.pow(Math.abs(s),.4);
  if(i===0)p.moveTo(x,y);else p.lineTo(x,y);
 }return p;
}
function lensGeometry(w,h,depth){
 const g=new THREE.PlaneGeometry(w,h,64,48),p=g.attributes.position;
 for(let i=0;i<p.count;i++){
  const x=p.getX(i)/(w/2),y=p.getY(i)/(h/2);
  const limit=Math.pow(Math.max(0,1-Math.pow(Math.abs(y),5)),.2);
  p.setXYZ(i,x*w/2*limit,y*h/2,depth*(1-x*x)*(1-y*y));
 }g.computeVertexNormals();return g;
}
export function createTvModel(spec=TV_SPEC){
 const root=new THREE.Group();root.name='original-crt';
 const controls=new Map(),owned=createTvMaterials(spec.palette),m=owned.materials;
 const unit=spec.width/spec.referenceWidth;
 const world=(x,y)=>new THREE.Vector3((x-spec.referenceWidth/2)*unit,(spec.referenceHeight/2-y)*unit,0);
 const meshes=[];
 function box(name,w,h,d,x,y,z,material,r=.01,parent=root){
  const o=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/3,h/3,d/3)),material);
  o.name=name;o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);meshes.push(o);return o;
 }
 function pixelBox(name,w,h,d,x,y,z,mat,r=.01){const p=world(x,y);return box(name,w*unit,h*unit,d,p.x,p.y,z,mat,r);}
 function disc(name,r,depth,x,y,z,mat){
  const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,depth,64),mat);o.name=name;o.rotation.x=Math.PI/2;o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;root.add(o);meshes.push(o);return o;
 }
 function label(text,x,y,width,height,color='#e1ddc9',size=24){
  if(typeof document==='undefined')return;
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=128;
  const c=canvas.getContext('2d');c.font=`500 ${size*3}px Arial`;c.textAlign='center';c.textBaseline='middle';c.fillStyle=color;c.fillText(text,512,64,1000);
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;owned.textures.push(tex);
  const mat=new THREE.MeshStandardMaterial({map:tex,transparent:true,roughness:.9,depthWrite:false});
  const o=new THREE.Mesh(new THREE.PlaneGeometry(width*unit,height*unit),mat);const p=world(x,y);o.position.set(p.x,p.y,.515);root.add(o);meshes.push(o);return o;
 }
 box('cabinet',spec.width,spec.height,spec.depth,0,0,-.6,m.cream,.12);
 // A raised perimeter and recessed olive panel give the source silhouette real depth.
 const panel=spec.panel,pc=world(panel.x+panel.width/2,panel.y+panel.height/2);
 box('panel-trim',(panel.width+4)*unit,(panel.height+4)*unit,.06,pc.x,pc.y,.235,m.trim,.035);
 box('olive-panel',panel.width*unit,panel.height*unit,.065,pc.x,pc.y,.275,m.olive,.032);
 const bezel=spec.bezel,bc=world(bezel.x+bezel.width/2,bezel.y+bezel.height/2);
 const screen=spec.screen,sc=world(screen.x+screen.width/2,screen.y+screen.height/2);
 const shape=rounded(bezel.width*unit,bezel.height*unit,.13);
 const hole=aperture(screen.width*unit,screen.height*unit);
 // Hole coordinates are translated into the bezel's local coordinate system.
 hole.curves.forEach(curve=>{for(const key of ['v1','v2'])if(curve[key]){curve[key].x+=sc.x-bc.x;curve[key].y+=sc.y-bc.y;}});
 shape.holes.push(hole);
 const rim=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:true,bevelSize:.035,bevelThickness:.035,bevelSegments:4,steps:1,curveSegments:24}),m.black);
 rim.name='bezel-ring';rim.position.set(bc.x,bc.y,.245);rim.castShadow=true;rim.receiveShadow=true;root.add(rim);meshes.push(rim);
 // The broad recessed surround is a curved surface, not the extrusion's flat cap.
 const verts=[],uvs=[],indices=[],rings=24,segments=160;
 const profile=[[0,.405],[.12,.47],[.28,.47],[.62,.36],[.86,.305],[1,.30]];
 for(let row=0;row<=rings;row++){
  const t=row/rings;
  for(let j=0;j<=segments;j++){
   const a=j/segments*Math.PI*2,cos=Math.cos(a),sin=Math.sin(a);
   const ox=bc.x+bezel.width*unit/2*Math.sign(cos)*Math.pow(Math.abs(cos),2/12);
   const oy=bc.y+bezel.height*unit/2*Math.sign(sin)*Math.pow(Math.abs(sin),2/12);
   const ix=sc.x+screen.width*unit/2*Math.sign(cos)*Math.pow(Math.abs(cos),.4);
   const iy=sc.y+screen.height*unit/2*Math.sign(sin)*Math.pow(Math.abs(sin),.4);
   const upper=profile.findIndex(([p])=>p>=t);
   const aProfile=profile[Math.max(0,upper-1)],bProfile=profile[Math.max(0,upper)];
   const f=(t-aProfile[0])/Math.max(.001,bProfile[0]-aProfile[0]);
   const smooth=f*f*(3-2*f),z=aProfile[1]+(bProfile[1]-aProfile[1])*smooth;
   verts.push(ox+(ix-ox)*t,oy+(iy-oy)*t,z);
   uvs.push((ox+(ix-ox)*t-bc.x)/(bezel.width*unit)+.5,(oy+(iy-oy)*t-bc.y)/(bezel.height*unit)+.5);
   if(row<rings&&j<segments){const n=row*(segments+1)+j;indices.push(n,n+1,n+segments+1,n+1,n+segments+2,n+segments+1);}
  }
 }
 const sculptedGeometry=new THREE.BufferGeometry();sculptedGeometry.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));sculptedGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));sculptedGeometry.setIndex(indices);sculptedGeometry.computeVertexNormals();
 const sculpted=new THREE.Mesh(sculptedGeometry,m.black);sculpted.name='sculpted-bezel';sculpted.castShadow=true;sculpted.receiveShadow=true;root.add(sculpted);meshes.push(sculpted);
 // Cream lip around the black surround, with a real opening rather than a painted shadow.
 const lipShape=rounded((bezel.width+3)*unit,(bezel.height+3)*unit,.15);
 lipShape.holes.push(rounded((bezel.width-20)*unit,(bezel.height-20)*unit,.12));
 const lip=new THREE.Mesh(new THREE.ExtrudeGeometry(lipShape,{depth:.03,bevelEnabled:true,bevelSize:.012,bevelThickness:.012,bevelSegments:3,curveSegments:24}),m.cream);
 lip.name='cream-lip';lip.position.set(bc.x,bc.y,.39);root.add(lip);meshes.push(lip);
 const screenSurface=new THREE.Mesh(lensGeometry(screen.width*unit,screen.height*unit,.065),m.screen);
 const darkScreen=new THREE.Mesh(lensGeometry(screen.width*unit,screen.height*unit,.065),m.dark);
 darkScreen.name='screen-backing';darkScreen.position.set(sc.x,sc.y,.321);root.add(darkScreen);meshes.push(darkScreen);
 screenSurface.name='phosphor-surface';screenSurface.position.set(sc.x,sc.y,.325);root.add(screenSurface);meshes.push(screenSurface);
 const glass=new THREE.Mesh(lensGeometry(screen.width*unit,screen.height*unit,.12),m.glass);glass.name='curved-glass';glass.position.set(sc.x,sc.y,.34);root.add(glass);meshes.push(glass);
 const screenAnchor=new THREE.Object3D();screenAnchor.name='screen-anchor';screenAnchor.position.set(sc.x,sc.y,.40);
 screenAnchor.userData.aperture={width:screen.width*unit,height:screen.height*unit};root.add(screenAnchor);
 const cx=1416.4;
 label('CHANNEL',cx,46,120,20,'#e1ddc9',16);
 const dc=world(cx,149);
 disc('dial-seat',.29,.055,dc.x,dc.y,.35,m.trim);
 const dial=disc('channel-dial',.255,.10,dc.x,dc.y,.41,m.black);controls.set('dial',dial);
 const ridges=new THREE.InstancedMesh(new THREE.BoxGeometry(.009,.035,.014),m.metal,56);ridges.name='dial-ridges';
 const ridgeTransform=new THREE.Object3D();
 for(let i=0;i<56;i++){
  const t=i/56*Math.PI*2;ridgeTransform.position.set(dc.x+Math.sin(t)*.238,dc.y+Math.cos(t)*.238,.464);ridgeTransform.rotation.z=-t;ridgeTransform.updateMatrix();ridges.setMatrixAt(i,ridgeTransform.matrix);
 }ridges.castShadow=true;root.add(ridges);
 const grip=new THREE.Group();grip.name='channel-grip';grip.position.set(dc.x,dc.y,.48);root.add(grip);
 box('dial-grip',.075,.4,.085,0,0,0,m.grip,.018,grip);
 box('dial-pointer',.012,.06,.004,0,.14,.045,m.cream,.001,grip);
 grip.children.forEach(o=>o.userData.controlId='dial');
 for(let i=0;i<7;i++){
  const a=(-135+i*45)*Math.PI/180;
  label(String(i+1),cx+Math.sin(a)*96,149-Math.cos(a)*96,24,21,'#dedcc5',22);
 }
 const leds=[];
 spec.channels.forEach((id,i)=>{
  const y=307+i*56;
  const button=pixelBox(`button-${id}`,217,46,.065,cx,y,.365,m.black,.018);controls.set(`channel-${id}`,button);
  const pos=world(1327,y);
  const ledMat=new THREE.MeshStandardMaterial({color:'#a9d074',emissive:'#9dea55',emissiveIntensity:0,roughness:.4});
  const led=disc(`led-${id}`,unit*4,.015,pos.x,pos.y,.412,ledMat);leds.push(led);
  led.userData.controlId=`channel-${id}`;
  const printed=label(spec.labels[i],1435,y,159,27,'#e1ddc9',22);if(printed)printed.userData.controlId=`channel-${id}`;
 });
 for(let i=0;i<5;i++)pixelBox('speaker-slot',219,6,.025,cx,744+i*12,.32,m.dark,.008);
 label('SOUND',1362,817,75,15,'#dedcc5',17);
 const vol=world(1362,867);const volume=disc('volume-knob',.115,.07,vol.x,vol.y,.36,m.black);controls.set('volume',volume);
 const pointer=pixelBox('volume-pointer',5,25,.012,1366,860,.41,m.grip,.004);pointer.rotation.z=-.45;
 pointer.userData.controlId='volume';
 label('POWER',1482,820,65,15,'#dedcc5',17);
 const power=pixelBox('power',32,44,.055,1482,867,.36,m.black,.006);controls.set('power',power);
 const onLabel=label('I',1482,858,16,12,'#ede7cd',18),offLabel=label('O',1482,878,16,12,'#ede7cd',18);
 for(const l of[onLabel,offLabel])if(l)l.userData.controlId='power';
 pixelBox('volume-track',87,5,.015,1362,927,.34,m.dark,.004);
 const slider=world(1340,927);disc('volume-slider',.024,.015,slider.x,slider.y,.36,m.grip);
 label('K H A L I L',cx,966,150,17,'#e5ddc7',17);
 for(const y of[25,974]){const p=world(1532,y);disc('panel-screw',.014,.012,p.x,p.y,.32,m.metal);}
 for(const x of[-2,2])box('foot',.7,.12,.55,x,-spec.height/2-.04,-.45,m.black,.025);
 // Restrained rear ventilation; rear proportions are inferred from the front reference.
 for(let i=0;i<14;i++)box('rear-vent',.02,.42,.012,-1.3+i*.2,.5,-1.407,m.dark,.003);
 function setSelection(index){
  if(!Number.isFinite(index))return;
  const n=Math.max(0,Math.min(spec.channels.length-1,Math.round(index)));
  grip.rotation.z=-(-135+n*45)*Math.PI/180;
  leds.forEach((led,i)=>{led.material.emissiveIntensity=i===n?1.3:0;led.material.color.set(i===n?'#b2e884':'#3c5031');});
 }
 setSelection(0);
 // The portrait cabinet keeps the same materials and real controls. Independent
 // control proportions keep labels and knobs from stretching with the glass.
 const originals=new Map(root.children.map(o=>[o,{y:o.position.y,scale:o.scale.clone()}]));
 const dialParts=['dial-seat','channel-dial','dial-ridges','channel-grip'];
 const dialHousing=new THREE.Group();dialHousing.position.copy(dc);root.add(dialHousing);
 for(const name of dialParts){const o=root.getObjectByName(name);o.position.sub(dc);dialHousing.add(o);}
 const powerX=power.position.x;
 function setPortraitLayout(amount){
  const p=THREE.MathUtils.clamp(amount,0,1),stretch=1+1.8*p;root.scale.y=stretch;
  dialHousing.scale.set(1+.6*p,(1+.6*p)/stretch,1);
  for(const[o,base]of originals){
   const control=o.userData.controlId??[...controls].find(([,v])=>v===o)?.[0];
   if(control?.startsWith('channel-')||o.name.startsWith('led-')){
    o.position.y=.1+(base.y-.1)*(1+.45*p);
    if(o.name.startsWith('button-'))o.scale.y=base.scale.y*(1+.65*p);
    if(o.userData.controlId?.startsWith('channel-'))o.visible=p<.5;
   }
   if(['volume-knob','volume-pointer','volume-track','volume-slider'].includes(o.name))o.visible=p<.5;
  }
  power.position.x=powerX+(dc.x-powerX)*p;power.scale.x=1+5.7*p;power.scale.y=1+.78*p;
 }
 return{root,screenAnchor,screenSurface,controls,setSelection,setPortraitLayout,setScreenTexture(texture){m.screen.map=texture;m.screen.color.set(texture?'white':'#e8e6cf');m.screen.needsUpdate=true;},dispose(){
  const geometries=new Set(),extraMaterials=new Set();root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const mat of [].concat(o.material))if(!Object.values(m).includes(mat))extraMaterials.add(mat);});
  geometries.forEach(g=>g.dispose());extraMaterials.forEach(mat=>mat.dispose());owned.dispose();
 }};
}
