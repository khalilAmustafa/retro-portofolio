import './tv-review.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { createTvModel } from './tv-model.js';

const stage=document.querySelector('#model-stage'),canvas=document.querySelector('#model-canvas');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});}
catch{document.querySelector('#model-error').hidden=false;}
if(renderer){
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.VSMShadowMap;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#d9d6cc');
 // A real divided window in the reflection environment gives the convex lens depth.
 const env=new THREE.Scene();env.background=new THREE.Color('#4a4339');
 const windowGroup=new THREE.Group();windowGroup.position.set(-3,.4,7);windowGroup.lookAt(0,0,0);windowGroup.scale.setScalar(.95);
 for(let x=0;x<3;x++)for(let y=0;y<3;y++){
  const pane=new THREE.Mesh(new THREE.PlaneGeometry(.85,.95),new THREE.MeshBasicMaterial({color:y===0?'#d5a77c':'#c6d4df',side:THREE.DoubleSide}));
  pane.material.color.multiplyScalar(3);pane.position.set((x-1)*.94,(y-1)*1.05,0);windowGroup.add(pane);
 }env.add(windowGroup);
 const softbox=new THREE.Mesh(new THREE.PlaneGeometry(5,3),new THREE.MeshBasicMaterial({color:'#e5c399',side:THREE.DoubleSide}));softbox.position.set(1,6,0);softbox.lookAt(0,0,0);env.add(softbox);
 const pmrem=new THREE.PMREMGenerator(renderer),envTarget=pmrem.fromScene(env,.015);scene.environment=envTarget.texture;scene.environmentIntensity=.7;
 env.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});pmrem.dispose();
 const camera=new THREE.PerspectiveCamera(33,1,.1,50);camera.position.set(0,.1,9.5);camera.lookAt(0,0,0);
 const tv=createTvModel();scene.add(tv.root);
 const key=new THREE.DirectionalLight('#fff7e5',2.6);key.position.set(-4,6,7);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.radius=4;key.shadow.blurSamples=8;key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;key.shadow.normalBias=.012;key.shadow.bias=-.0002;scene.add(key);
 const fill=new THREE.DirectionalLight('#c7d6e2',1.2);fill.position.set(5,2,3);scene.add(fill);
 const ambient=new THREE.HemisphereLight('#f4eee2','#77705e',.7);scene.add(ambient);
 const wood=document.createElement('canvas');wood.width=1024;wood.height=512;const wc=wood.getContext('2d');wc.fillStyle='#60402b';wc.fillRect(0,0,1024,512);
 let woodSeed=731;const random=()=>{woodSeed=woodSeed*16807%2147483647;return woodSeed/2147483647;};
 for(let i=0;i<4500;i++){
  const y=random()*512,x=random()*1024;wc.strokeStyle=random()>.45?`rgba(22,12,5,${random()*.2})`:`rgba(213,151,84,${random()*.13})`;wc.lineWidth=.3+random()*1.2;wc.beginPath();wc.moveTo(x,y);wc.bezierCurveTo(x+60,y-3,x+160,y+4,x+260+random()*300,y+random()*3);wc.stroke();
 }for(const y of[170,340]){wc.fillStyle='rgba(15,9,4,.45)';wc.fillRect(0,y,1024,2);}
 const woodMap=new THREE.CanvasTexture(wood);woodMap.colorSpace=THREE.SRGBColorSpace;woodMap.wrapS=woodMap.wrapT=THREE.RepeatWrapping;woodMap.repeat.set(5,5);woodMap.anisotropy=8;
 const floorMat=new THREE.MeshStandardMaterial({color:'#827568',map:woodMap,roughness:.78,bumpMap:woodMap,bumpScale:.004});
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),floorMat);floor.rotation.x=-Math.PI/2;floor.position.y=-2.025;floor.receiveShadow=true;scene.add(floor);
 const screenCanvas=document.createElement('canvas');screenCanvas.width=1400;screenCanvas.height=1000;
 const c=screenCanvas.getContext('2d');
 const phosphor=c.createRadialGradient(660,450,120,700,500,820);
 phosphor.addColorStop(0,'#f1ecd4');phosphor.addColorStop(.62,'#e5dfc2');phosphor.addColorStop(1,'#69765a');
 c.fillStyle=phosphor;c.fillRect(0,0,1400,1000);
 c.fillStyle='rgba(44,63,37,.035)';for(let y=0;y<1000;y+=4)c.fillRect(0,y,1400,1);
 c.fillStyle='#3e4a30';c.textAlign='center';c.font='500 30px monospace';c.fillText('PERSONAL CHANNEL',700,240);
 c.fillStyle='#78834d';c.fillRect(465,267,470,5);
 c.fillStyle='#303a25';c.font='900 135px Arial';c.fillText('KHALIL',700,445);c.fillText('MUSTAFA',700,585);
 c.font='500 31px monospace';c.fillStyle='#425037';c.fillText('Software, systems & a little play.',700,670);
 c.fillStyle='#546335';c.beginPath();c.roundRect(550,745,300,80,12);c.fill();c.fillStyle='#ede8ce';c.font='500 34px monospace';c.fillText('Enter ↗',700,798);
 const texture=new THREE.CanvasTexture(screenCanvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;tv.setScreenTexture(texture);
 const screenGlow=new THREE.PointLight('#e5edb9',.8,3.0,2);screenGlow.position.set(-.5,0,.9);scene.add(screenGlow);
 let frames=0,disposed=false;
 function render(){if(!disposed){renderer.render(scene,camera);frames++;}}
 let activeView='front';
 const views={front:[0,.1,9.5],quarter:[6,2.2,8.4],rear:[5,2,-8.6]};
 function fittedPosition(){return new THREE.Vector3(...views[activeView]).multiplyScalar(Math.max(1,1.4/camera.aspect));}
 function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();gsap.killTweensOf(camera.position);camera.position.copy(fittedPosition());camera.lookAt(0,0,0);render();}
 const observer=new ResizeObserver(resize);observer.observe(stage);
 function draw(){camera.lookAt(0,0,0);render();}
 for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>{
  const view=b.dataset.view;activeView=view;
  document.querySelectorAll('[data-view]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));
  document.querySelector('#view-label').textContent={front:'Front view',quarter:'Three-quarter view',rear:'Rear view — inferred details'}[view];
  const p=fittedPosition();
  gsap.to(camera.position,{x:p.x,y:p.y,z:p.z,duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:.7,ease:'power2.inOut',onUpdate:draw});
 });
 for(const b of document.querySelectorAll('[data-light]'))b.addEventListener('click',()=>{
  const warm=b.dataset.light==='warm';document.body.dataset.light=b.dataset.light;
  document.querySelectorAll('[data-light]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));
  scene.background.set(warm?'#302d29':'#d9d6cc');
  key.color.set(warm?'#ffcf98':'#fff7e5');key.intensity=warm?2.8:2.6;key.position.set(-4,warm?5.5:6,warm?5:7);
  fill.intensity=warm?.55:1.2;ambient.intensity=warm?.35:.7;scene.environmentIntensity=warm?.65:.7;render();
 });
 document.querySelector('#channel').addEventListener('change',e=>{tv.setSelection(Number(e.target.value));render();});
 let powerOn=true;
 const powerLevel={value:1};
 function setScreenPower(on){
  powerOn=on;tv.screenSurface.visible=true;screenGlow.visible=true;
  const b=document.querySelector('#screen-power');b.setAttribute('aria-pressed',String(on));b.textContent=on?'Screen on':'Screen off';
  gsap.to(powerLevel,{value:on?1:0,duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:on?.38:.22,overwrite:true,ease:'power2.out',
   onUpdate:()=>{tv.screenSurface.material.opacity=powerLevel.value;screenGlow.intensity=.8*powerLevel.value;render();},
   onComplete:()=>{tv.screenSurface.visible=on;screenGlow.visible=on;render();}});
 }
 document.querySelector('#screen-power').addEventListener('click',()=>setScreenPower(!powerOn));
 const raycaster=new THREE.Raycaster();canvas.addEventListener('click',e=>{
  const r=canvas.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);
  const hit=raycaster.intersectObject(tv.root,true)[0];if(!hit)return;
  const id=hit.object.userData.controlId??[...tv.controls.entries()].find(([,m])=>m===hit.object)?.[0];
  if(id?.startsWith('channel-')){const keys=['home','experience','education','skills','projects','credentials','contact'];const i=keys.indexOf(id.slice(8));tv.setSelection(i);document.querySelector('#channel').value=i;}
  else if(id==='power'){setScreenPower(!powerOn);}
  else if(id==='dial'){const s=document.querySelector('#channel');s.value=(Number(s.value)+1)%7;tv.setSelection(Number(s.value));}
  render();
 });
 function fullyFramed(){
  const bounds=new THREE.Box3().setFromObject(tv.root);camera.updateMatrixWorld();
  for(const x of[bounds.min.x,bounds.max.x])for(const y of[bounds.min.y,bounds.max.y])for(const z of[bounds.min.z,bounds.max.z]){
   const p=new THREE.Vector3(x,y,z).project(camera);if(Math.abs(p.x)>.99||Math.abs(p.y)>.99)return false;
  }return true;
 }
 window.__tvReview={get ready(){return frames>0;},get fullyFramed(){return fullyFramed();},metrics:()=>({triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls,meshes:tv.root.children.length}),get selection(){return Number(document.querySelector('#channel').value);}};
 window.addEventListener('pagehide',e=>{if(e.persisted)return;disposed=true;observer.disconnect();gsap.killTweensOf(camera.position);gsap.killTweensOf(powerLevel);tv.dispose();texture.dispose();woodMap.dispose();floor.geometry.dispose();floorMat.dispose();envTarget.dispose();renderer.dispose();});
 resize();
 if(new URLSearchParams(location.search).get('finish')==='worn'){
  document.querySelector('[data-light=warm]').click();document.querySelector('[data-view=quarter]').click();
 }
}
for(const [id,source,caption]of[
 ['compare','original-tv-reference.png','Original portfolio · proportions and controls reference'],
 ['compare-finish','approved-crt-finish.png','Approved art direction · finish, glass and lighting target']
])document.querySelector(`#${id}`).addEventListener('click',e=>{
 const figure=document.querySelector('#reference'),wasActive=e.currentTarget.getAttribute('aria-pressed')==='true';
 for(const button of document.querySelectorAll('#compare,#compare-finish'))button.setAttribute('aria-pressed','false');
 figure.hidden=wasActive;e.currentTarget.setAttribute('aria-pressed',String(!wasActive));
 figure.querySelector('img').src=`assets/experience/${source}`;figure.querySelector('img').alt=caption;figure.querySelector('figcaption').textContent=caption;
});
