import '../styles/main.css';
import './experience.css';
import './content.css';
import gsap from 'gsap';
import { contentCatalog, catalogProjectsById } from '../data/content-catalog.js';
import { createSoundController } from '../core/sound.js';
import { PROJECT_IDS, createExperienceState, reduceExperience } from './state.js';
import { resolveExperienceRoute } from './routes.js';
import { createHandoff } from './handoff.js';
import { createRoom } from './room.js';
import { createLibrary } from './library.js';
import { bindExperienceInput } from './input.js';
import { renderProjectPreview } from './project-preview.js';
import { renderPortfolioChannel,portfolioChannels } from './portfolio-channels.js';

const allProjects=contentCatalog.projects;
const projects=PROJECT_IDS.map(id=>allProjects.find(p=>p.id===id));
const shortTitles=['Space Day','ROOMS','BandUp'];
const descriptions=['A digital passport for a day of discovery.','Multiplayer study challenges.','A learning path built around you.'];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const capture=new URLSearchParams(location.search).has('capture');
document.body.classList.add('experience');
const shell=document.querySelector('#tv');shell.className='television tv-crt-performance';
shell.setAttribute('aria-label','Khalil’s CRT project collection');
shell.setAttribute('aria-hidden','true');shell.inert=true;
document.querySelector('.screen-header').innerHTML=`<a href="#projects" class="screen-wordmark" data-action="library">Khalil Mustafa</a><nav aria-label="Portfolio"><button class="text-action" data-action="library">Work</button><a href="#contact">Contact ↗</a><label class="channel-picker-label"><span class="sr-only">Portfolio channel</span><select id="portfolio-channel" aria-label="Portfolio channel">${portfolioChannels.map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select></label></nav>`;
document.querySelector('.screen-footer').innerHTML=`<button class="text-action" data-action="exit">↙ Back to room</button><span class="collection-caption">A collection of things I’ve built.</span><button class="text-action" id="sound-toggle" aria-pressed="false">Sound off</button>`;
document.querySelector('.screen-progress-track').remove();
document.querySelectorAll('.channel-osd,.volume-osd,.cmd-tuner-modal,.tuning').forEach(el=>el.remove());
document.querySelector('#channel-buttons').innerHTML=projects.map((p,i)=>`<button class="channel-button" data-select="${i}" aria-pressed="${i===0}"><span class="button-led"></span><span>${shortTitles[i]}</span></button>`).join('');
document.querySelector('#dial-marks').innerHTML=[0,1,2].map((i)=>`<span class="dial-mark ${i===0?'active':''}">${i+1}</span>`).join('');
document.querySelectorAll('.dial-mark').forEach((el,i)=>el.style.setProperty('--angle',`${-60+i*60}deg`));
const dial=document.querySelector('#channel-dial');dial.setAttribute('aria-valuemin','1');dial.setAttribute('aria-valuemax','3');dial.setAttribute('aria-valuetext','ROOMS');
document.querySelector('#dial-tip').textContent='TURN TO EXPLORE';
document.querySelector('.speaker').innerHTML='<span></span>'.repeat(10);
document.querySelector('.bottom-controls').innerHTML=`<div class="power-control"><span class="engraved">POWER</span><button type="button" id="room-power" class="power" aria-label="Return to the room"><span class="power-on">I</span><span class="power-off">O</span></button><span class="power-led"></span></div>`;
document.querySelector('.brand').innerHTML='<span></span>KHALIL<span></span>';
document.querySelector('.model').textContent='PERSONAL CHANNEL';
const content=document.querySelector('#screen-content');
content.removeAttribute('tabindex');
content.innerHTML=`<div class="library-view"><div class="library-topline"><a href="#archive" class="all-work-link">All ${allProjects.length} projects ↗</a><span class="current-position">1 / 3</span></div>
  <div id="library-stage" tabindex="0" role="group" aria-label="Project covers. Use arrow keys or drag to browse."><canvas id="cover-canvas" aria-hidden="true"></canvas>
  <div class="cover-fallback" hidden>${projects.map((p,i)=>`<button data-select="${i}" aria-label="Select ${shortTitles[i]}"><img src="assets/experience/${p.id}-cover.webp" alt="Illustrated ${shortTitles[i]} project cover"></button>`).join('')}</div>
  <button class="browse-arrow previous" data-step="-1" aria-label="Previous project">←</button><button class="browse-arrow next" data-step="1" aria-label="Next project">→</button></div>
  <div class="selection-info"><div class="selection-dots" role="group" aria-label="Choose a project">${projects.map((p,i)=>`<button data-select="${i}" aria-label="Select ${shortTitles[i]}" aria-pressed="${i===0}"></button>`).join('')}</div><h1 id="selected-title">ROOMS</h1><p id="selected-description">${descriptions[0]}</p><button id="open-project" class="primary-action" data-action="open">Enter project <span>↗</span></button></div>
  <div class="library-instructions"><span>Scroll or drag to explore</span><span><kbd>←</kbd> <kbd>→</kbd> Browse <kbd>↵</kbd> Enter</span></div></div><div id="preview-mount" hidden></div>`;
const libraryView=content.querySelector('.library-view'),previewMount=document.querySelector('#preview-mount');
const outer=document.createElement('div');outer.id='experience-root';
document.body.prepend(outer);outer.append(shell);
outer.insertAdjacentHTML('afterbegin',`<div id="room-view"><canvas id="room-canvas" aria-hidden="true"></canvas><div class="room-grain" aria-hidden="true"></div><header class="room-top"><a href="#room" class="room-name">Khalil Mustafa</a><a href="legacy.html">Full portfolio ↗</a></header><div class="room-enter-position"><button id="room-enter" aria-label="Enter the television"><span>Enter</span><span>↗</span></button></div><div class="room-caption"><p>A little room.<br>A few things I’ve built.</p><span>Make yourself at home.</span></div><div class="room-bottom"><span>Amman, Jordan</span><span>Choose a project. Stay curious.</span><button id="skip-room">Skip to the collection →</button></div></div>`);
const roomView=document.querySelector('#room-view'),roomEnter=document.querySelector('#room-enter');
let state=createExperienceState(),room,library,handoff,ready=false,projectTween,transitionImage=null,previewVersion=0;
const sound=createSoundController();
const fallback=()=>{document.body.classList.add('room-fallback');};
function revealFallback(){document.body.classList.add('library-fallback');document.querySelector('.cover-fallback').hidden=false;document.querySelector('#cover-canvas').hidden=true;}
const stage=document.querySelector('#library-stage');
if(capture){
  document.body.classList.add('capture-mode');
  shell.inert=false;shell.removeAttribute('aria-hidden');shell.style.cssText='visibility:visible;opacity:1;width:1560px;height:1000px;left:0;top:0;transform:none;';
  document.querySelectorAll('.channel-button').forEach((el,i)=>el.setAttribute('aria-pressed',String(i===1)));
  document.querySelectorAll('.dial-mark').forEach((el,i)=>el.classList.toggle('active',i===1));
  content.innerHTML=`<div class="welcome-screen"><p>Khalil’s personal channel</p><h1>KHALIL<br>MUSTAFA</h1><span class="welcome-rule"></span><div class="welcome-enter">Enter ↗</div><p class="welcome-sub">Software, systems & a little play.</p></div>`;
  document.querySelector('.screen-header').style.visibility='hidden';document.querySelector('.screen-footer').style.visibility='hidden';
  ready=true;
}else{
  room=createRoom({canvas:document.querySelector('#room-canvas'),frontTextureUrl:'assets/experience/crt-front.png',onUnavailable:fallback});
  if(!room)fallback();
  library=createLibrary({canvas:document.querySelector('#cover-canvas'),projects,onUnavailable:revealFallback,reducedMotion});
  handoff=createHandoff({room,shell,reducedMotion,onSettled:(entered)=>{
    roomView.classList.toggle('fully-entered',Boolean(entered));
    library?.setActive(Boolean(entered)&&state.view==='library');
    if(entered){(state.view==='project'||state.view==='channel'?previewMount.querySelector('article'):stage)?.focus({preventScroll:true});}
    else if(document.documentElement.dataset.wasEntered)roomEnter.focus({preventScroll:true});
  }});
  ready=true;
  const initial=resolveExperienceRoute(location.hash,allProjects.map(p=>p.id));
  if(initial.legacyHash)location.replace(`legacy.html${initial.legacyHash}`);
  else dispatch({type:'ROUTE',...initial},{history:false,immediate:true});
}

function routeFor(s){return s.view==='room'?'#room':s.view==='project'?`#projects/${s.projectId}`:s.view==='channel'?`#${s.channelId}`:'#projects';}
function setSelection(index){
  library?.select(index);
  document.querySelector('#selected-title').textContent=shortTitles[index];
  document.querySelector('#selected-description').textContent=descriptions[index];
  document.querySelector('.current-position').textContent=`${index+1} / 3`;
  dial.setAttribute('aria-valuenow',index+1);dial.setAttribute('aria-valuetext',shortTitles[index]);
  dial.style.transform=`rotate(${-60+index*60}deg)`;
  document.querySelectorAll('[data-select]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.select)===index)));
  document.querySelectorAll('.dial-mark').forEach((el,i)=>el.classList.toggle('active',i===index));
  document.querySelector('.previous').disabled=index===0;document.querySelector('.next').disabled=index===2;
  document.querySelectorAll('.cover-fallback button').forEach((el,i)=>el.classList.toggle('is-selected',i===index));
  document.querySelector('#status').textContent=`${shortTitles[index]} selected`;
}
function stopPreview(){previewMount.querySelectorAll('video').forEach(v=>v.pause());}
function selectedRect(){
  return library?.getSelectedRect()??document.querySelector(`.cover-fallback [data-select="${state.selectedIndex}"]`).getBoundingClientRect();
}
function makeTransitionImage(rect){
  const image=new Image();image.src=`assets/experience/${projects[state.selectedIndex].id}-cover.webp`;image.alt='';
  image.className='project-transition-art';
  Object.assign(image.style,{position:'fixed',left:`${rect.x}px`,top:`${rect.y}px`,width:`${rect.width}px`,height:`${rect.height}px`,objectFit:'cover',zIndex:30,pointerEvents:'none',transformOrigin:'center'});
  const clip=document.createElement('div');clip.className='project-transition-clip';
  const glass=document.querySelector('.glass').getBoundingClientRect();
  Object.assign(clip.style,{position:'fixed',inset:'0',zIndex:30,pointerEvents:'none',clipPath:`inset(${glass.top}px ${innerWidth-glass.right}px ${innerHeight-glass.bottom}px ${glass.left}px round 24px)`});
  clip.append(image);document.body.append(clip);transitionImage=clip;return image;
}
function showProject(next,previous,immediate){
  previewVersion++;
  const version=previewVersion;
  projectTween?.kill();transitionImage?.remove();transitionImage=null;
  gsap.set(previewMount,{clearProps:'all'});gsap.set(libraryView,{clearProps:'all'});
  if(next.view==='project'||next.view==='channel'){
    const origin=!immediate&&previous?.view==='library'&&next.view==='project'&&PROJECT_IDS.includes(next.projectId)?selectedRect():null;
    stopPreview();previewMount.querySelector('article')?.dispose?.();previewMount.replaceChildren(next.view==='channel'?renderPortfolioChannel(next.channelId):renderProjectPreview(catalogProjectsById[next.projectId]));
    previewMount.hidden=false;libraryView.hidden=true;library?.setActive(false);content.scrollTop=0;
    projectTween=gsap.timeline({onComplete:()=>{
      if(version===previewVersion)previewMount.querySelector('article')?.focus({preventScroll:true});
    }});
    if(origin?.width&&!reducedMotion.matches){
      const image=makeTransitionImage(origin),destination=previewMount.querySelector('.preview-media').getBoundingClientRect();
      projectTween.set(previewMount,{opacity:0})
        .to(image,{left:destination.x,top:destination.y,width:destination.width,height:destination.height,duration:.52,ease:'power3.inOut'})
        .to(previewMount,{opacity:1,duration:.22},.35)
        .to(image,{opacity:0,duration:.18,onComplete:()=>{image.parentElement?.remove();transitionImage=null;}},.45);
    }else projectTween.fromTo(previewMount,{opacity:0},{opacity:1,duration:reducedMotion.matches||immediate?0:.25});
  }else{
    const origin=previous?.view==='project'?previewMount.querySelector('.preview-media')?.getBoundingClientRect():null;
    stopPreview();previewMount.querySelector('article')?.dispose?.();previewMount.hidden=true;previewMount.replaceChildren();libraryView.hidden=false;
    library?.setActive(next.view==='library'&&handoff?.getProgress()>.99);library?.resize();
    if(previous?.view==='project'||previous?.view==='channel'){
      library?.select(next.selectedIndex,{immediate:true});
      const destination=selectedRect();
      projectTween=gsap.timeline();
      if(origin?.width&&destination.width&&!reducedMotion.matches&&next.view==='library'){
        const image=makeTransitionImage(origin);
        projectTween.fromTo(image,{opacity:.7},{opacity:1,duration:.1})
          .fromTo(libraryView,{opacity:0},{opacity:1,duration:.4},0)
          .to(image,{left:destination.x,top:destination.y,width:destination.width,height:destination.height,duration:.46,ease:'power3.inOut'},0)
          .to(image,{opacity:0,duration:.12,onComplete:()=>{image.parentElement?.remove();transitionImage=null;}},.4);
      }
      document.querySelector('#open-project').focus({preventScroll:true});
    }
  }
}
function dispatch(action,{history:writeHistory=true,immediate=false}={}){
  const previous=state;state=reduceExperience(state,action);
  if(!ready)return;
  document.documentElement.dataset.view=state.view;
  if(action.type!=='SELECT'){
    const inside=state.view!=='room';
    if(inside)document.documentElement.dataset.wasEntered='true';
    roomView.classList.toggle('is-entering',inside);roomView.inert=inside;
    roomView.setAttribute('aria-hidden',String(inside));
    if((previous.view!=='room')!==inside||action.type==='ROUTE')handoff?.setTarget(inside?1:0,immediate);
    if(writeHistory&&routeFor(previous)!==routeFor(state))window.history.pushState({selectedIndex:state.selectedIndex},'',routeFor(state));
  }else{
    // Update the library's existing history entry, never add entries per gesture.
    window.history.replaceState({selectedIndex:state.selectedIndex},'',location.href);
  }
  setSelection(state.selectedIndex);
  document.querySelector('#portfolio-channel').value=state.view==='channel'?state.channelId:'projects';
  if(previous.view!==state.view||previous.projectId!==state.projectId||previous.channelId!==state.channelId||action.type==='ROUTE')showProject(state,previous,immediate);
  sound.uiTap();
}
function escape(){if(state.view==='project'||state.view==='channel')dispatch({type:'CLOSE'});else if(state.view==='library')dispatch({type:'EXIT'});}
if(!capture){
  document.querySelector('#portfolio-channel').addEventListener('change',event=>{const route=resolveExperienceRoute(`#${event.target.value}`,allProjects.map(p=>p.id));dispatch({type:'ROUTE',...route});});
  previewMount.addEventListener('chapterchange',()=>{content.scrollTop=0;});
  roomEnter.addEventListener('click',()=>dispatch({type:'ENTER'}));
  document.querySelector('#skip-room').addEventListener('click',()=>dispatch({type:'ENTER'},{immediate:true}));
  outer.addEventListener('click',e=>{
    const select=e.target.closest('[data-select]');if(select){dispatch({type:'SELECT',index:Number(select.dataset.select)});return;}
    const step=e.target.closest('[data-step]');if(step){dispatch({type:'SELECT',index:state.selectedIndex+Number(step.dataset.step)});return;}
    const button=e.target.closest('[data-action]');if(!button)return;
    e.preventDefault();const type={open:'OPEN',close:'CLOSE',exit:'EXIT',library:'ENTER'}[button.dataset.action];if(type)dispatch({type});
  });
  document.querySelector('#room-power').addEventListener('click',()=>dispatch({type:'EXIT'}));
  document.querySelector('#sound-toggle').addEventListener('click',e=>{
    const on=sound.getVolume()===0;sound.setVolume(on?25:0);e.currentTarget.textContent=on?'Sound on':'Sound off';e.currentTarget.setAttribute('aria-pressed',on);sound.clickSound();
  });
  bindExperienceInput({root:outer,dial,getState:()=>state,dispatch,onEscape:escape,onHit:(x,y)=>library?.hitTest(x,y),onDrag:index=>library?.drag(index)});
  window.addEventListener('popstate',e=>{
    const route=resolveExperienceRoute(location.hash,allProjects.map(p=>p.id));
    if(route.legacyHash){location.href=`legacy.html${route.legacyHash}`;return;}
    if(route.view==='library'&&Number.isFinite(e.state?.selectedIndex))state={...state,selectedIndex:e.state.selectedIndex};
    dispatch({type:'ROUTE',...route},{history:false});
  });
  window.addEventListener('hashchange',()=>{
    if(routeFor(state)===location.hash)return;
    const route=resolveExperienceRoute(location.hash,allProjects.map(p=>p.id));
    if(route.legacyHash){location.href=`legacy.html${route.legacyHash}`;return;}
    dispatch({type:'ROUTE',...route},{history:false});
  });
}

// Read-only diagnostics support production QA, without controlling the interface.
window.__crtExperience={get state(){return {...state};},get progress(){return handoff?.getProgress()??0;},get ready(){return ready;},
  metrics:()=>({room:room?.getMetrics(),library:library?.getMetrics()}),
};
