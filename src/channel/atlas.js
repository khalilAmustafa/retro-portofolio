import { atlasPlaces,channelProjectsById } from './content.js';
import { escapeHtml as e } from '../core/dom.js';
import { createMotion,advanceSpring } from './motion.js';
import { advanceGlide,dragVelocity,releaseVelocity } from './globe-motion.js';
const radians=Math.PI/180;
export function renderAtlas({reducedMotion}){
 const root=document.createElement('section');root.className='channel-atlas';root.setAttribute('aria-label','Portfolio atlas');
 root.innerHTML=`<div class='journey-shell'><header class='journey-heading'><span>PERSONAL JOURNEY · ERASMUS+ 2026</span><h1>Amman <em>→</em> Valencia</h1></header><div class='journey-layout'><div class='journey-map'><canvas tabindex='0' aria-label='Interactive globe tracing the journey between Amman and Valencia. Drag to rotate, or select a city.'></canvas><span class='journey-map-note'>DRAG TO EXPLORE · SELECT A CITY</span></div><div class='journey-stops'><nav aria-label='Choose a city'>${atlasPlaces.map((p,i)=>`<button type='button' data-place='${e(p.id)}' aria-pressed='${i===0}'><span class='journey-stop-number'>0${i+1}</span><span class='journey-stop-text'><strong>${e(p.name)}</strong><small>${p.id==='amman'?'ASU · COMPUTER SCIENCE':'UPV · ERASMUS+ 2026'}</small></span><span aria-hidden='true'>↗</span></button>`).join('')}</nav><div class='atlas-place-copy journey-selection' aria-live='polite'></div></div></div><footer class='journey-timeline' aria-label='Journey milestones'><span><b>2023</b> ASU · AMMAN</span><i aria-hidden='true'></i><span><b>SPRING 2026</b> ERASMUS+ · VALENCIA</span><a href='#education'>ACADEMIC DETAILS ↗</a></footer></div>`;
 const canvas=root.querySelector('canvas'),context=canvas.getContext('2d'),orbit=[],copy=root.querySelector('.atlas-place-copy');
 let yaw=createMotion(-16*radians,Infinity),pitch=createMotion(22*radians,Infinity),raf=0,previous=0,drag=null,disposed=false,land=[],width=1,height=1,selected='amman',mode='idle',wheelDirection=0;
 const grid=[];
 for(let latitude=-75;latitude<=75;latitude+=15)grid.push(Array.from({length:91},(_,i)=>[-180+i*4,latitude]));
 for(let longitude=-180;longitude<180;longitude+=15)grid.push(Array.from({length:46},(_,i)=>[longitude,-90+i*4]));
 const controller=new AbortController();
 const point=(lon,lat)=>{const a=(lon*radians)+yaw.value,b=lat*radians,cb=Math.cos(b),x=Math.sin(a)*cb,y=Math.sin(b),z=Math.cos(a)*cb,cp=Math.cos(pitch.value),sp=Math.sin(pitch.value);return [x,y*cp-z*sp,y*sp+z*cp];};
 function project(lon,lat){const [x,y,z]=point(lon,lat),r=Math.min(width*.37,height*.41),perspective=1/(1-z*.17);return {x:width/2+x*r*perspective,y:height/2-y*r*perspective,z};}
 function line(coordinates,color){context.strokeStyle=color;context.beginPath();let drawing=false;for(const[lon,lat]of coordinates){const p=project(lon,lat);if(p.z<-.05){drawing=false;continue;}if(drawing)context.lineTo(p.x,p.y);else{context.moveTo(p.x,p.y);drawing=true;}}context.stroke();}
 function draw(){
  if(disposed)return;const dpr=Math.min(devicePixelRatio,1.5);context.setTransform(dpr,0,0,dpr,0,0);context.clearRect(0,0,width,height);context.lineWidth=.65;
  const r=Math.min(width*.37,height*.41);const glow=context.createRadialGradient(width/2-r*.3,height/2-r*.3,0,width/2,height/2,r);glow.addColorStop(0,'rgba(153,169,120,.08)');glow.addColorStop(1,'rgba(83,104,57,.035)');context.fillStyle=glow;context.beginPath();context.arc(width/2,height/2,r,0,Math.PI*2);context.fill();
  grid.forEach(coordinates=>line(coordinates,'rgba(94,118,66,.23)'));
  context.lineWidth=.95;land.forEach(ring=>line(ring,'rgba(73,102,47,.66)'));
  // An illustrative Amman-to-Valencia route, shown only on the visible hemisphere.
  context.save();context.strokeStyle='rgba(83,112,56,.8)';context.lineWidth=2;context.setLineDash([4,5]);
  context.beginPath();let routeDrawing=false;
  const amman=atlasPlaces.find(p=>p.id==='amman'),valencia=atlasPlaces.find(p=>p.id==='valencia');
  if(amman&&valencia){for(let i=0;i<=64;i++){const t=i/64,lat=amman.lat+(valencia.lat-amman.lat)*t+Math.sin(t*Math.PI)*2,lon=amman.lon+(valencia.lon-amman.lon)*t,p=project(lon,lat);
    if(p.z<.02){routeDrawing=false;continue;}if(routeDrawing)context.lineTo(p.x,p.y);else{context.moveTo(p.x,p.y);routeDrawing=true;}
  }}context.stroke();context.restore();
  for(const place of atlasPlaces){const p=project(place.lon,place.lat);if(p.z<0)continue;context.fillStyle=place.id===selected?'#536f36':'#9aaa78';context.beginPath();context.arc(p.x,p.y,place.id===selected?4:2.5,0,Math.PI*2);context.fill();if(place.id===selected){context.strokeStyle='rgba(89,116,57,.3)';context.beginPath();context.arc(p.x,p.y,11,0,Math.PI*2);context.stroke();context.font='11px "IBM Plex Mono",monospace';context.fillText(place.name,p.x+17,p.y+4);}}
  orbit.forEach((card,i)=>{const angle=yaw.value+i*Math.PI*2/3,z=Math.cos(angle);card.style.transform=`translate(-50%,-50%) translate(${Math.sin(angle)*width*.39}px,${Math.sin(angle*.8+i)*height*.25}px) rotateY(${-Math.sin(angle)*25}deg) rotateZ(${Math.sin(angle)*9}deg) scale(${.77+z*.18})`;card.style.opacity=z>-.3?String(.55+z*.35):'0';card.style.zIndex=String(Math.round(10+z*5));});
 }
 function tick(time){raf=0;if(disposed||document.hidden){previous=0;return;}const dt=previous?Math.max(0,(time-previous)/1000):1/60;previous=time;
  if(mode==='coast'){yaw=advanceGlide(yaw,dt);pitch=advanceGlide(pitch,dt,{min:-.9,max:.9,damping:5.2});}
  else if(mode==='spring'){yaw=advanceSpring(yaw,dt);pitch=advanceSpring(pitch,dt);}
  draw();const moving=mode==='coast'?Math.abs(yaw.velocity)+Math.abs(pitch.velocity)>.0001:mode==='spring'&&(Math.abs(yaw.value-yaw.target)>.0001||Math.abs(pitch.value-pitch.target)>.0001);
  if(moving)wake();else{if(mode!=='drag'){mode='idle';yaw.velocity=pitch.velocity=0;}previous=0;}
 }
 function wake(){if(!raf&&!disposed&&!document.hidden){if(!previous)previous=performance.now();raf=requestAnimationFrame(tick);}}
 function stop(){yaw.velocity=pitch.velocity=0;yaw.target=yaw.value;pitch.target=pitch.value;mode='idle';wheelDirection=0;}
 function select(id){const p=atlasPlaces.find(p=>p.id===id);if(!p)return;stop();drag=null;selected=id;root.querySelectorAll('[data-place]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.place===id)));const isAmman=p.id==='amman';copy.innerHTML=`<div class='journey-selected-city'><img src='assets/education/${isAmman?'asu':'upv'}.webp' alt='${isAmman?'ASU':'UPV'} university emblem'><div><span>${isAmman?'THE BEGINNING':'THE EXCHANGE'}</span><h2>${e(p.name)}<small>${e(p.country)}</small></h2></div></div><p>${isAmman?'Computer Science at ASU. Where my engineering journey began.':'Spring 2026 Erasmus+ at UPV. A semester studying and living in Valencia.'}</p><a href='${isAmman?'#projects/nasa-space-apps':'#education'}'>${isAmman?'SEE MY WORK':'EXPLORE MY STUDIES'} ↗</a>`;const angle=-p.lon*radians;yaw.target=yaw.value+Math.atan2(Math.sin(angle-yaw.value),Math.cos(angle-yaw.value));pitch.target=p.lat*radians*.75;mode='spring';if(reducedMotion.matches){yaw.value=yaw.target;pitch.value=pitch.target;mode='idle';}wake();}
 root.addEventListener('click',event=>{const button=event.target.closest('[data-place]');if(button)select(button.dataset.place);else if(event.target.closest('[data-globe-reset]'))select(selected);});
 canvas.addEventListener('pointerdown',event=>{if(event.button!==0||event.isPrimary===false)return;stop();mode='drag';drag={id:event.pointerId,x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,time:performance.now(),moved:false};canvas.setPointerCapture(event.pointerId);});
 canvas.addEventListener('pointermove',event=>{if(!drag||event.pointerId!==drag.id)return;const now=performance.now(),dx=event.clientX-drag.x,dy=event.clientY-drag.y,dt=(now-drag.time)/1000,gain=3.5/Math.max(240,width),nextPitch=Math.max(-.9,Math.min(.9,pitch.value+dy*gain*.8));
  yaw.velocity=dragVelocity(yaw.velocity,dx*gain,dt);pitch.velocity=dragVelocity(pitch.velocity,nextPitch-pitch.value,dt);yaw.value=yaw.target=yaw.value+dx*gain;pitch.value=pitch.target=nextPitch;
  drag.moved=drag.moved||Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)>4;drag.x=event.clientX;drag.y=event.clientY;drag.time=now;wake();
 });
 canvas.addEventListener('pointerup',event=>{if(!drag||event.pointerId!==drag.id)return;const release=drag;drag=null;
  if(!release.moved){stop();const b=canvas.getBoundingClientRect(),x=event.clientX-b.left,y=event.clientY-b.top,place=atlasPlaces.find(p=>{const q=project(p.lon,p.lat);return q.z>0&&Math.hypot(q.x-x,q.y-y)<18;});if(place)select(place.id);return;}
  const age=(performance.now()-release.time)/1000;yaw.velocity=reducedMotion.matches?0:releaseVelocity(yaw.velocity,age);pitch.velocity=reducedMotion.matches?0:releaseVelocity(pitch.velocity,age);mode='coast';wake();
 });
 const cancel=()=>{if(drag){drag=null;stop();wake();}};canvas.addEventListener('pointercancel',cancel);canvas.addEventListener('lostpointercapture',cancel);
 canvas.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();stop();mode='spring';yaw.target=yaw.value+(event.key==='ArrowRight'?1:-1)*.3;if(reducedMotion.matches)yaw.value=yaw.target;wake();}});
 canvas.addEventListener('wheel',event=>{if(event.ctrlKey)return;event.preventDefault();const delta=(Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY)*(event.deltaMode===1?16:event.deltaMode===2?height:1),direction=Math.sign(delta);if(mode!=='spring'||direction!==wheelDirection){stop();}wheelDirection=direction;mode='spring';yaw.target+=delta*.0015;if(reducedMotion.matches)yaw.value=yaw.target;wake();},{passive:false});
 function resize(){const bounds=canvas.getBoundingClientRect();width=bounds.width;height=bounds.height;const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);draw();}
 const observer=new ResizeObserver(resize);observer.observe(canvas);select('amman');
 fetch('assets/atlas/land.geojson',{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Optional coastlines unavailable');return r.json();}).then(data=>{if(disposed)return;for(const feature of data.features){const g=feature.geometry;if(g.type==='Polygon')land.push(...g.coordinates);else if(g.type==='MultiPolygon')g.coordinates.forEach(poly=>land.push(...poly));}draw();}).catch(()=>{});
 const visibility=()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;previous=0;drag=null;stop();}else wake();};document.addEventListener('visibilitychange',visibility);
 const motionPreference=()=>{if(reducedMotion.matches){yaw.value=yaw.target;pitch.value=pitch.target;stop();wake();}};reducedMotion.addEventListener('change',motionPreference);
 root.getMotion=()=>({yaw:yaw.value,pitch:pitch.value,yawVelocity:yaw.velocity,pitchVelocity:pitch.velocity,mode});
 root.dispose=()=>{disposed=true;controller.abort();observer.disconnect();document.removeEventListener('visibilitychange',visibility);reducedMotion.removeEventListener('change',motionPreference);if(raf)cancelAnimationFrame(raf);};
 return root;
}
