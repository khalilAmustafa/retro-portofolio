import * as THREE from 'three';
import { createTvModel } from '../experience/tv-model.js';
import gsap from 'gsap';
import { createDeskEnvironment } from './desk-environment.js';
import { deskCameraPose,DESK_TV } from './desk-camera.js';

export function screenRect(anchor,camera,width,height){
 const {width:w,height:h}=anchor.userData.aperture;anchor.updateWorldMatrix(true,false);camera.updateMatrixWorld();
 const corners=[[-w/2,-h/2],[w/2,h/2]].map(([x,y])=>new THREE.Vector3(x,y,0).applyMatrix4(anchor.matrixWorld).project(camera));
 const left=(corners[0].x+1)*width/2,right=(corners[1].x+1)*width/2,top=(1-corners[1].y)*height/2,bottom=(1-corners[0].y)*height/2;
 const x=Math.max(12,left+(right-left)*.055),y=Math.max(12,top+(bottom-top)*.075);
 return {x,y,width:Math.max(1,Math.min(width-12,right-(right-left)*.055)-x),height:Math.max(1,Math.min(height-12,bottom-(bottom-top)*.075)-y)};
}
export function createTvFrame({canvas,onLayout,onControl,onUnavailable,onState=()=>{}}){
 let renderer;
 try{if(new URLSearchParams(location.search).has('no-webgl'))throw new Error('Fallback');renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});}catch{onUnavailable();return null;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#302c29');scene.fog=new THREE.Fog('#302c29',20,39);
 const camera=new THREE.PerspectiveCamera(42,1,.1,70),tv=createTvModel();tv.root.position.set(0,DESK_TV.y,DESK_TV.z);scene.add(tv.root);
 const key=new THREE.DirectionalLight('#ffe1ab',.45);key.position.set(-4,7,7);scene.add(key);
 const fill=new THREE.DirectionalLight('#c7d6e2',.25);fill.position.set(5,4,4);scene.add(fill);
 const environment=new THREE.Scene();environment.background=new THREE.Color('#6c705c');
 for(const [x,y,z,w,h,color]of[[-3,3,6,3,4,'#ffe3b4'],[3,4,2,3,2,'#d3dde0']]){const card=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));card.position.set(x,y,z);card.lookAt(0,0,0);environment.add(card);}
 const pmrem=new THREE.PMREMGenerator(renderer),target=pmrem.fromScene(environment,.04);scene.environment=target.texture;scene.environmentIntensity=.65;environment.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});pmrem.dispose();
 let disposed=false,frames=0,tween=null,inside=false,welcomeVisible=true;
 const motion={progress:0},reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 const welcome=document.createElement('canvas');welcome.width=1400;welcome.height=1000;const c=welcome.getContext('2d');c.fillStyle='#e8e6cf';c.fillRect(0,0,1400,1000);c.textAlign='center';c.fillStyle='#405034';c.font='24px monospace';c.fillText('KHALIL / PERSONAL CHANNEL',700,230);c.font='bold 118px Arial';c.fillText('KHALIL',700,430);c.fillText('MUSTAFA',700,555);c.font='26px Arial';c.fillText('Software, systems & a little play.',700,680);
 const welcomeTexture=new THREE.CanvasTexture(welcome);welcomeTexture.colorSpace=THREE.SRGBColorSpace;tv.setScreenTexture(welcomeTexture);
 function render(){if(!disposed){renderer.render(scene,camera);frames++;}}
 const desk=createDeskEnvironment({scene,onChange:render});
 function update(){
  if(disposed)return;const width=innerWidth,height=innerHeight,p=motion.progress,pose=deskCameraPose({width,height},p,tv.screenAnchor.position.x);
  camera.fov=pose.fov;camera.aspect=width/height;camera.position.set(pose.x,pose.y,pose.z);camera.lookAt(pose.x,pose.y,pose.targetZ);camera.updateProjectionMatrix();camera.updateMatrixWorld();
  renderer.toneMappingExposure=1.2-.15*p;const nextWelcome=p<.72;if(nextWelcome!==welcomeVisible){welcomeVisible=nextWelcome;tv.setScreenTexture(welcomeVisible?welcomeTexture:null);}
  onLayout(screenRect(tv.screenAnchor,camera,width,height),{cameraMoving:p>0&&p<1,progress:p});render();
 }
 function resize(){renderer.setSize(innerWidth,innerHeight,false);update();}
 function setEntered(value,{immediate=false}={}){inside=Boolean(value);tween?.kill();const end=inside?1:0;onState(inside,true);if(immediate||reducedMotion.matches){motion.progress=end;update();onState(inside,false);return;}tween=gsap.to(motion,{progress:end,duration:Math.max(.25,Math.abs(end-motion.progress)*1.35),ease:'power3.inOut',onUpdate:update,onComplete:()=>onState(inside,false)});}
 const raycaster=new THREE.Raycaster();function click(event){const bounds=canvas.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((event.clientX-bounds.left)/bounds.width*2-1,-(event.clientY-bounds.top)/bounds.height*2+1),camera);const hit=raycaster.intersectObject(tv.root,true)[0];if(!hit)return;const id=hit.object.userData.controlId??[...tv.controls].find(([,o])=>o===hit.object)?.[0];if(id)onControl(id);else if(!inside&&['curved-glass','phosphor-surface','screen-backing'].includes(hit.object.name))onControl('enter');}
 const preference=()=>setEntered(inside,{immediate:true});reducedMotion.addEventListener('change',preference);
 canvas.addEventListener('click',click);window.addEventListener('resize',resize);resize();
 return {setEntered,get progress(){return motion.progress;},get isEntered(){return inside;},setSelection(index){tv.setSelection(index);render();},resize,metrics:()=>({frames,triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls,desk:true,progress:motion.progress}),dispose(){disposed=true;tween?.kill();canvas.removeEventListener('click',click);window.removeEventListener('resize',resize);reducedMotion.removeEventListener('change',preference);desk.dispose();tv.dispose();welcomeTexture.dispose();target.dispose();renderer.dispose();}};
}
