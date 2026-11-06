import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { projectTvRect } from './handoff.js';

const TV = { width: 6, height: 6/1.56, y: 3.12, z: .95 };
const FOV = 42;

function proceduralTexture(kind) {
  const c = document.createElement('canvas'); c.width=1024; c.height=512;
  const x=c.getContext('2d');
  let seed=518;
  const random=()=>{ seed=(seed*16807)%2147483647; return seed/2147483647; };
  x.fillStyle=kind==='wood'?'#62422c':'#746757'; x.fillRect(0,0,1024,512);
  if(kind==='wood') {
    for(let i=0;i<1700;i++) {
      x.strokeStyle=`rgba(${random()>.5?'24,13,7':'198,148,96'},${random()*.14})`;
      x.lineWidth=random()*2+.4; x.beginPath();
      const y=random()*512; x.moveTo(0,y);
      x.bezierCurveTo(340,y+random()*9,700,y-random()*9,1024,y); x.stroke();
    }
    for(let i=1;i<6;i++){x.fillStyle='#25170d55';x.fillRect(0,i*85,1024,2);}
  } else {
    for(let i=0;i<100000;i++) {
      x.fillStyle=`rgba(${random()>.5?'255,236,207':'17,14,11'},${random()*.09})`;
      x.fillRect(random()*1024,random()*512,1,1);
    }
  }
  const tex=new THREE.CanvasTexture(c); tex.colorSpace=THREE.SRGBColorSpace;
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping; tex.repeat.set(kind==='wood'?2:3,2);
  return tex;
}

export function createRoom({ canvas, frontTextureUrl, onUnavailable }) {
  let renderer;
  try {
    if(new URLSearchParams(location.search).has('no-webgl')) throw new Error('Fallback requested');
    renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  } catch { onUnavailable?.(); return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.2;
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene(); scene.background=new THREE.Color('#302c29');
  scene.fog=new THREE.Fog('#302c29',20,39);
  const camera=new THREE.PerspectiveCamera(FOV,1,.1,70);
  let active=true, progress=0, targetRect, frame, disposed=false;
  const textures=[];
  const material=(color,roughness=.7,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
  const woodTex=proceduralTexture('wood'),wallTex=proceduralTexture('wall');
  textures.push(woodTex,wallTex);
  const wood=new THREE.MeshStandardMaterial({map:woodTex,roughness:.64});
  const wall=new THREE.MeshStandardMaterial({map:wallTex,roughness:1});
  const cream=material('#cfc2a2',.48), black=material('#272923',.6), olive=material('#4d5638');
  function box(w,h,d,mat,x,y,z,r=0) {
    const m=new THREE.Mesh(r?new RoundedBoxGeometry(w,h,d,2,r):new THREE.BoxGeometry(w,h,d),mat);
    m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;
  }
  function cylinder(radius,height,mat,x,y,z) {
    const m=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,height,32),mat);
    m.position.set(x,y,z);m.castShadow=true;scene.add(m);return m;
  }
  box(27,18,.2,wall,0,6,-2.1);
  box(18,.26,7.3,wood,0,1.0,.8,.06);
  box(.32,3.4,.4,black,-7,-.8,1.7);box(.32,3.4,.4,black,7,-.8,1.7);
  box(TV.width,TV.height,1.7,cream,0,TV.y,.05,.18);
  box(1,.1,.55,black,-1.9,1.13,.15,.035);box(1,.1,.55,black,1.9,1.13,.15,.035);
  const frontMat=new THREE.MeshBasicMaterial({color:'#e9dfc3',toneMapped:false});
  const front=new THREE.Mesh(new THREE.PlaneGeometry(TV.width,TV.height),frontMat);
  front.position.set(0,TV.y,TV.z+.001);scene.add(front);
  new THREE.TextureLoader().load(frontTextureUrl,tex=>{
    if(disposed){tex.dispose();return;}
    tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
    frontMat.map=tex;frontMat.color.set('white');frontMat.needsUpdate=true;textures.push(tex);render();
  },undefined,()=>{ document.documentElement.dataset.frontFallback='true'; });

  // Window: dusk beyond a deep wooden frame, rather than a flat room photograph.
  const windowGroup=new THREE.Group();scene.add(windowGroup);windowGroup.position.set(-7,4.0,-1.9);
  const skyCanvas=document.createElement('canvas');skyCanvas.width=256;skyCanvas.height=512;
  const sx=skyCanvas.getContext('2d');const grad=sx.createLinearGradient(0,0,0,512);
  grad.addColorStop(0,'#233b64');grad.addColorStop(.7,'#536780');grad.addColorStop(1,'#b09079');
  sx.fillStyle=grad;sx.fillRect(0,0,256,512);
  sx.fillStyle='#1e2a34';for(let i=0;i<14;i++)sx.fillRect(i*22,340+Math.sin(i*15)*55,24,180);
  sx.fillStyle='#e9ba73';for(let i=0;i<18;i++)sx.fillRect((i*41)%255,380+(i*19)%100,3,4);
  const skyTex=new THREE.CanvasTexture(skyCanvas);skyTex.colorSpace=THREE.SRGBColorSpace;textures.push(skyTex);
  const sky=new THREE.Mesh(new THREE.PlaneGeometry(3.2,5.8),new THREE.MeshBasicMaterial({map:skyTex}));
  windowGroup.add(sky);
  for(const [x,y,w,h] of [[-1.7,0,.22,6.1],[1.7,0,.22,6.1],[0,3,3.6,.22],[0,-3,3.6,.22],[0,0,.10,6]]) {
    const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,.25),wood);b.position.set(x,y,.1);windowGroup.add(b);
  }
  box(4,.2,.9,wood,-7,1.1,-1.4,.03);
  scene.add(new THREE.HemisphereLight('#c5d7eb','#493520',1.15));
  const key=new THREE.SpotLight('#ffcc8b',68,19,.8,.85,1.5);
  key.position.set(-4.3,5,1.2);key.target.position.set(-1,1,1);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.001;key.shadow.normalBias=.03;
  scene.add(key,key.target);
  const windowLight=new THREE.DirectionalLight('#9ab8df',.8);windowLight.position.set(-7,5,2);scene.add(windowLight);
  const wallGlow=new THREE.SpotLight('#ffbd73',85,18,1.05,1,1.6);
  wallGlow.position.set(-4.2,4.2,1.2);wallGlow.target.position.set(-2.8,3.3,-2);scene.add(wallGlow,wallGlow.target);
  const deskGlow=new THREE.PointLight('#ffcf8b',13,7,1.6);deskGlow.position.set(-3.8,3.4,1.7);scene.add(deskGlow);

  // An articulated desk lamp built from simple, inexpensive geometry.
  cylinder(.6,.1,black,-4.6,1.2,.3);
  function rod(a,b,r=.045,mat=black) {
    const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),dir=end.clone().sub(start);
    const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,dir.length(),12),mat);
    m.position.copy(start.add(end).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());
    m.castShadow=true;scene.add(m);return m;
  }
  rod([-4.6,1.2,.3],[-5.2,3.15,.2],.055);rod([-5.2,3.15,.2],[-4.4,4.65,.2],.055);
  for(const [x,y,z]of[[-4.6,1.3,.3],[-5.2,3.15,.2],[-4.4,4.65,.2]])cylinder(.13,.16,black,x,y,z);
  const shade=new THREE.Mesh(new THREE.ConeGeometry(.53,.7,40,1,true),black);
  shade.rotation.z=.28;shade.position.set(-4.22,4.5,.25);shade.castShadow=true;scene.add(shade);
  const bulb=new THREE.Mesh(new THREE.CircleGeometry(.42,32),new THREE.MeshBasicMaterial({color:'#ffe5ac'}));
  bulb.rotation.x=-Math.PI/2;bulb.position.set(-4.2,4.17,.25);scene.add(bulb);
  // A simple unbranded disc console, notebook and closed laptop.
  box(2.1,.34,1.45,material('#8c887b'),-4.2,1.33,1.55,.1);
  const disc=cylinder(.64,.014,material('#66685e'),-4.2,1.51,1.5);disc.receiveShadow=true;
  box(.16,.04,.07,material('#252921'),-3.55,1.52,2.03,.015);
  const led=new THREE.Mesh(new THREE.SphereGeometry(.035,8,8),new THREE.MeshBasicMaterial({color:'#c4f68b'}));led.position.set(-3.52,1.33,2.29);scene.add(led);
  box(2.4,.15,1.6,black,4.75,1.24,.35,.06);
  box(1.7,.06,1.3,material('#e5d7b8'),4.5,1.2,2.1,.015);
  box(.025,.008,1.24,material('#b7a68a'),4.5,1.236,2.1);
  rod([4.95,1.29,1.64],[5.2,1.29,2.6],.018,material('#b87c35'));
  for(let i=0;i<3;i++) box(1.75,.17,1.18,[olive,cream,material('#aa5c40')][i],3.6,1.22+i*.18,-.22,.025);
  cylinder(.3,.6,material('#c7b896'),6.5,1.45,1.0);
  const handle=new THREE.Mesh(new THREE.TorusGeometry(.2,.055,10,24),cream);
  handle.position.set(6.8,1.5,1.0);scene.add(handle);
  // Simple controller fallback is visible immediately; a free model can replace it.
  const controller=new THREE.Group();scene.add(controller);controller.position.set(-3.5,1.25,3.1);
  const pad=new THREE.Mesh(new RoundedBoxGeometry(1.4,.2,.6,3,.15),material('#b9b4a3'));controller.add(pad);
  const crossMat=material('#343b31');
  for(const [w,d]of[[.32,.10],[.1,.32]]){const q=new THREE.Mesh(new THREE.BoxGeometry(w,.045,d),crossMat);q.position.set(-.4,.13,0);controller.add(q);}
  for(const[x,z]of[[.38,-.1],[.52,0],[.38,.1],[.24,0]]){
    const q=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,.04,12),olive);q.position.set(x,.13,z);controller.add(q);
  }
  const cableCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(-4,1.2,2.2),new THREE.Vector3(-4.7,1.16,3.1),new THREE.Vector3(-4.0,1.16,3.7),new THREE.Vector3(-3.5,1.25,3.3)]);
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(cableCurve,32,.025,8,false),black));

  // Verified CC0 model; retain the immediate geometric pad if its download fails.
  document.documentElement.dataset.optionalProp='loading';
  const propUrl=new URLSearchParams(location.search).has('fail-prop')?'assets/experience/missing-gamepad.gltf':'assets/experience/gamepad/model.gltf';
  new GLTFLoader().load(propUrl,gltf=>{
    if(disposed){gltf.scene.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of [].concat(o.material))m.dispose();});return;}
    const prop=gltf.scene;
    const bounds=new THREE.Box3().setFromObject(prop),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
    const scale=2/Math.max(size.x,size.z);prop.scale.setScalar(scale);
    prop.position.set(-3.5-center.x*scale,1.17-bounds.min.y*scale,3.05-center.z*scale);
    prop.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
    scene.add(prop);controller.visible=false;document.documentElement.dataset.optionalProp='loaded';render();
  },undefined,()=>{document.documentElement.dataset.optionalProp='fallback';});

  // A small pinned sketch closes the otherwise empty wall on the right.
  const sketch=document.createElement('canvas');sketch.width=512;sketch.height=384;
  const sc=sketch.getContext('2d');sc.fillStyle='#bca889';sc.fillRect(0,0,512,384);
  sc.strokeStyle='#4d5140';sc.lineWidth=2;
  for(const[x,y,w,h]of[[190,50,130,60],[60,180,120,65],[320,180,120,65],[195,290,120,55]])sc.strokeRect(x,y,w,h);
  sc.beginPath();sc.moveTo(255,110);sc.lineTo(255,145);sc.lineTo(120,145);sc.lineTo(120,180);sc.moveTo(255,145);sc.lineTo(380,145);sc.lineTo(380,180);sc.moveTo(120,245);sc.lineTo(120,267);sc.lineTo(255,267);sc.lineTo(255,290);sc.moveTo(380,245);sc.lineTo(380,267);sc.lineTo(255,267);sc.stroke();
  const sketchTex=new THREE.CanvasTexture(sketch);sketchTex.colorSpace=THREE.SRGBColorSpace;textures.push(sketchTex);
  const paper=new THREE.Mesh(new THREE.PlaneGeometry(1.7,1.28),new THREE.MeshStandardMaterial({map:sketchTex,roughness:1}));paper.position.set(4.8,4.6,-1.97);paper.rotation.z=.04;scene.add(paper);

  function render(){if(!disposed)renderer.render(scene,camera);}
  function positionCamera() {
    const endDistance=TV.height/(2*Math.tan(FOV*Math.PI/360)) * innerHeight/targetRect.height;
    const startDistance=innerWidth<650?17:12.2;
    const distance=THREE.MathUtils.lerp(startDistance,endDistance,progress);
    camera.position.set(0,TV.y,TV.z+distance);
    camera.lookAt(0,TV.y,TV.z);camera.updateMatrixWorld();
    const rect=projectTvRect({width:innerWidth,height:innerHeight},TV,distance,FOV);
    // Expose geometry to position the real Enter target exactly over the TV.
    document.documentElement.style.setProperty('--room-tv-left',`${rect.x}px`);
    document.documentElement.style.setProperty('--room-tv-top',`${rect.y}px`);
    document.documentElement.style.setProperty('--room-tv-width',`${rect.width}px`);
    document.documentElement.style.setProperty('--room-tv-height',`${rect.height}px`);
    document.querySelector('#room-enter')?.style.setProperty('--tv-scale',rect.width/1560);
  }
  function loop(){if(disposed||!active||document.hidden){frame=null;return;}render();frame=requestAnimationFrame(loop);}
  function setActive(next){active=next;if(next&&!frame)loop();if(!next&&frame){cancelAnimationFrame(frame);frame=null;}}
  const visibility=()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=null;}else if(active&&!frame)loop();};
  document.addEventListener('visibilitychange',visibility);
  const lost=e=>{e.preventDefault();setActive(false);onUnavailable?.();};canvas.addEventListener('webglcontextlost',lost);
  function resize(rect){targetRect=rect;renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();positionCamera();render();}
  resize({height:innerHeight-40});loop();
  return {setProgress(p){progress=p;positionCamera();render();},resize,setActive,
    getMetrics:()=>({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles}),
    dispose(){disposed=true;if(frame)cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',lost);
      scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of [].concat(o.material))m.dispose();}});textures.forEach(t=>t.dispose());renderer.dispose();} };
}
