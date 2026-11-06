export function bindExperienceInput({root,dial,getState,dispatch,onEscape,onHit,onDrag}) {
  const cleanups=[];
  function listen(el,type,fn,options){el.addEventListener(type,fn,options);cleanups.push(()=>el.removeEventListener(type,fn,options));}
  const surface=root.querySelector('#library-stage');
  let wheel=0,lastWheel=0,gestureUntil=0,pointer=null;
  function move(delta){const s=getState();if(s.view==='library')dispatch({type:'SELECT',index:s.selectedIndex+delta});}
  listen(surface,'wheel',e=>{
    if(getState().view!=='library')return;
    e.preventDefault();const now=performance.now();
    if(now-lastWheel>160)wheel=0;lastWheel=now;
    const raw=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
    const delta=raw*(e.deltaMode===1?16:e.deltaMode===2?surface.clientHeight:1);
    if(Math.sign(delta)!==Math.sign(wheel))wheel=0;
    wheel+=delta;
    if(now>gestureUntil&&Math.abs(wheel)>=36){move(Math.sign(wheel));wheel=0;gestureUntil=now+180;}
  },{passive:false});
  listen(surface,'pointerdown',e=>{
    if(getState().view!=='library'||e.target.closest('button,a'))return;
    pointer={id:e.pointerId,x:e.clientX,y:e.clientY,index:getState().selectedIndex,current:getState().selectedIndex,moved:false};
  });
  listen(window,'pointermove',e=>{
    if(!pointer||pointer.id!==e.pointerId)return;
    const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
    if(!pointer.moved&&Math.abs(dy)>14&&Math.abs(dy)>Math.abs(dx)){pointer=null;return;}
    if(Math.abs(dx)>12){pointer.moved=true;}
    if(pointer.moved){
      const pixels=Math.max(100,surface.getBoundingClientRect().width*.30);
      pointer.current=Math.max(0,Math.min(2,pointer.index-dx/pixels));
      onDrag?.(pointer.current);
    }
  });
  listen(window,'pointerup',e=>{
    if(!pointer||pointer.id!==e.pointerId)return;
    if(pointer.moved)dispatch({type:'SELECT',index:Math.round(pointer.current)});
    else{const index=onHit?.(e.clientX,e.clientY);if(index!=null)dispatch({type:'SELECT',index});}
    pointer=null;
  });
  listen(window,'pointercancel',()=>{if(pointer?.moved)dispatch({type:'SELECT',index:getState().selectedIndex});pointer=null;});
  listen(window,'keydown',e=>{
    if(e.key!=='Escape'||e.target.closest('video,input,textarea,select,[contenteditable="true"]'))return;
    e.preventDefault();onEscape();
  });
  listen(root,'keydown',e=>{
    if(e.target.closest('video,input,textarea,select,[contenteditable="true"]'))return;
    if(e.key==='Escape')return;
    if(getState().view!=='library')return;
    if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}
    if(e.key==='Enter'&&e.target===surface){e.preventDefault();dispatch({type:'OPEN'});}
  });
  let dialPointer=null;
  listen(dial,'pointerdown',e=>{if(getState().view!=='library')return;dialPointer={id:e.pointerId,x:e.clientX};dial.setPointerCapture(e.pointerId);});
  listen(dial,'pointermove',e=>{if(!dialPointer||dialPointer.id!==e.pointerId)return;const dx=e.clientX-dialPointer.x;if(Math.abs(dx)>22){move(dx>0?1:-1);dialPointer.x=e.clientX;}});
  listen(dial,'pointerup',()=>dialPointer=null);listen(dial,'pointercancel',()=>dialPointer=null);
  listen(dial,'keydown',e=>{if(e.key==='Home'){e.preventDefault();dispatch({type:'SELECT',index:0});}if(e.key==='End'){e.preventDefault();dispatch({type:'SELECT',index:2});}});
  return()=>cleanups.forEach(fn=>fn());
}
