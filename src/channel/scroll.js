import { createMotion,advanceSpring } from './motion.js';
export function smoothContentScroll(element,{reducedMotion,onDraw=()=>{}}){
 let motion=createMotion(element.scrollTop,0),raf=0,previous=0,disposed=false,direction=0;
 function measure(){motion.max=Math.max(0,element.scrollHeight-element.clientHeight);motion.target=Math.min(motion.target,motion.max);}
 function draw(){onDraw(element.scrollTop,Math.max(1,element.scrollHeight-element.clientHeight));}
 function stop(){if(raf)cancelAnimationFrame(raf);raf=0;motion={...motion,value:element.scrollTop,target:element.scrollTop,velocity:0};}
 function tick(time){raf=0;if(disposed)return;measure();const dt=previous?(time-previous)/1000:1/60;previous=time;motion=advanceSpring(motion,dt);element.scrollTop=motion.value;draw();if(Math.abs(motion.target-motion.value)>.3||Math.abs(motion.velocity)>1)raf=requestAnimationFrame(tick);}
 function wheel(event){if(reducedMotion.matches||event.ctrlKey||event.target.closest('input,select,textarea,video'))return;if(Math.abs(event.deltaX)>Math.abs(event.deltaY))return;measure();if(!motion.max)return;event.preventDefault();const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?element.clientHeight:1),nextDirection=Math.sign(delta);motion.value=element.scrollTop;if(direction!==nextDirection){motion.target=motion.value;motion.velocity=0;}direction=nextDirection;motion.target=Math.max(0,Math.min(motion.max,motion.target+delta));if(!raf){previous=performance.now();raf=requestAnimationFrame(tick);}}
 const scroll=()=>{if(!raf&&Math.abs(element.scrollTop-motion.value)>1)motion={...motion,value:element.scrollTop,target:element.scrollTop,velocity:0};draw();};
 element.addEventListener('wheel',wheel,{passive:false});element.addEventListener('scroll',scroll,{passive:true});element.addEventListener('pointerdown',stop,{passive:true});element.addEventListener('keydown',stop);
 const observer=new ResizeObserver(()=>{measure();draw();});observer.observe(element);if(element.firstElementChild)observer.observe(element.firstElementChild);
 return {to(value){measure();motion.value=element.scrollTop;motion.target=Math.max(0,Math.min(motion.max,value));if(reducedMotion.matches){element.scrollTop=motion.target;draw();}else if(!raf){previous=performance.now();raf=requestAnimationFrame(tick);}},dispose(){disposed=true;stop();observer.disconnect();element.removeEventListener('wheel',wheel);element.removeEventListener('scroll',scroll);element.removeEventListener('pointerdown',stop);element.removeEventListener('keydown',stop);}};
}

