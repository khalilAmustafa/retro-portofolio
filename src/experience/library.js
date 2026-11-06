import * as THREE from 'three';
import gsap from 'gsap';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function createLibrary({canvas,projects,onUnavailable,reducedMotion}) {
  let renderer;
  try {
    if(new URLSearchParams(location.search).has('no-webgl')) throw new Error('Fallback requested');
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
  }catch{onUnavailable?.();return null;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(28,1,.1,40);
  camera.position.set(0,.12,8.3);camera.lookAt(0,-.05,0);
  scene.add(new THREE.HemisphereLight('#fff9e9','#a3936d',3.0));
  const key=new THREE.DirectionalLight('#ffffff',3);key.position.set(-3,5,5);scene.add(key);
  const fill=new THREE.DirectionalLight('#c6d6e4',1);fill.position.set(4,1,2);scene.add(fill);
  const textureLoader=new THREE.TextureLoader(),textures=[],items=[];
  const colors=['#5b643b','#273e71','#a9583f'];
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=256;shadowCanvas.height=128;
  const ctx=shadowCanvas.getContext('2d');
  const grad=ctx.createRadialGradient(128,64,0,128,64,120);grad.addColorStop(0,'rgba(44,35,17,.28)');grad.addColorStop(1,'rgba(44,35,17,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,256,128);
  const shadowTex=new THREE.CanvasTexture(shadowCanvas);textures.push(shadowTex);
  let active=false,frame=null,disposed=false,selected=0,focused=false;
  projects.forEach((project,i)=>{
    const group=new THREE.Group();scene.add(group);
    const side=new THREE.MeshStandardMaterial({color:colors[i],roughness:.42});
    const cover=new THREE.MeshStandardMaterial({color:colors[i],roughness:.68});
    const back=new THREE.MeshStandardMaterial({color:'#c5b993',roughness:.8});
    const body=new THREE.Mesh(new THREE.BoxGeometry(1.72,2.58,.18),[side,side,back,back,cover,side]);
    body.userData.index=i;group.add(body);
    const edge=new THREE.Mesh(new RoundedBoxGeometry(1.77,2.63,.14,2,.025),new THREE.MeshStandardMaterial({color:'#d5ccb2',roughness:.55}));
    edge.position.z=-.04;group.add(edge);
    textureLoader.load(`assets/experience/${project.id}-cover.webp`,tex=>{
      if(disposed){tex.dispose();return;}tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
      cover.map=tex;cover.color.set('white');cover.needsUpdate=true;textures.push(tex);render();
    },undefined,()=>{document.documentElement.dataset.coverFallback='true';});
    const spine=new THREE.Mesh(new THREE.BoxGeometry(.055,2.58,.2),side);spine.position.x=-.84;group.add(spine);
    const shadow=new THREE.Mesh(new THREE.PlaneGeometry(2.5,.65),new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false}));
    shadow.position.set(0,-1.48,-.15);group.add(shadow);
    items.push({group,body});
  });
  const position={index:0};
  function layout(){
    const narrow=canvas.clientWidth<500;
    items.forEach(({group},i)=>{
      const d=i-position.index;
      group.position.set(d*(narrow?2.08:2.13),-.10*Math.abs(d),-.72*Math.pow(Math.abs(d),1.2));
      group.rotation.y=-d*.32;group.rotation.z=-d*.018;
      const s=1.04-.09*Math.min(2,Math.abs(d));group.scale.setScalar(s);
      group.visible=Math.abs(d)<3;
    });
  }
  function render(){if(disposed)return;layout();renderer.render(scene,camera);}
  function loop(){if(disposed||!active||document.hidden){frame=null;return;}render();frame=requestAnimationFrame(loop);}
  function setActive(next){active=next;if(next&&!frame)loop();if(!next&&frame){cancelAnimationFrame(frame);frame=null;}}
  const visibility=()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=null;}else if(active&&!frame)loop();};
  document.addEventListener('visibilitychange',visibility);
  const lost=e=>{e.preventDefault();setActive(false);onUnavailable?.();};canvas.addEventListener('webglcontextlost',lost);
  const observer=new ResizeObserver(()=>resize());observer.observe(canvas);
  function resize(){
    const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
    renderer.setSize(w,h,false);camera.aspect=w/h;
    camera.position.z=w/h<1.2?6.2:6;camera.updateProjectionMatrix();render();
  }
  function select(index,{immediate=false}={}){
    selected=index;gsap.killTweensOf(position);
    gsap.to(position,{index,duration:immediate||reducedMotion?.matches?0:.48,ease:'power3.out',onUpdate:render});
  }
  function drag(index){gsap.killTweensOf(position);position.index=Math.max(0,Math.min(2,index));render();}
  const raycaster=new THREE.Raycaster();
  function hitTest(x,y){
    const r=canvas.getBoundingClientRect();
    if(!r.width||!r.height)return null;
    raycaster.setFromCamera(new THREE.Vector2((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1),camera);
    const hit=raycaster.intersectObjects(items.map(i=>i.body));
    return hit[0]?.object.userData.index??null;
  }
  function getSelectedRect(){
    const r=canvas.getBoundingClientRect();const mesh=items[selected].body;mesh.updateWorldMatrix(true,false);
    const corners=[[-.86,-1.29],[.86,-1.29],[-.86,1.29],[.86,1.29]].map(([x,y])=>{
      const v=new THREE.Vector3(x,y,.1).applyMatrix4(mesh.matrixWorld).project(camera);
      return {x:r.left+(v.x+1)/2*r.width,y:r.top+(1-v.y)/2*r.height};
    });
    const x=Math.min(...corners.map(p=>p.x)),y=Math.min(...corners.map(p=>p.y));
    return {x,y,width:Math.max(...corners.map(p=>p.x))-x,height:Math.max(...corners.map(p=>p.y))-y};
  }
  // Both entering and leaving a preview reuse this same cover scene.
  function focusProject(open){focused=open;items.forEach(({group},i)=>{
    gsap.killTweensOf(group.scale);gsap.killTweensOf(group.position);
  });canvas.style.transform=open?'scale(1.06)':'none';}
  resize();select(0,{immediate:true});
  return {select,drag,resize,setActive,hitTest,focusProject,getSelectedRect,getMetrics:()=>({calls:renderer.info.render.calls,selected,focused}),
    dispose(){disposed=true;setActive(false);gsap.killTweensOf(position);observer.disconnect();document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',lost);
      scene.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of [].concat(o.material))m.dispose();});textures.forEach(t=>t.dispose());renderer.dispose();}
  };
}
