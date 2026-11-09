import './fonts.css';
import './style.css';
import gsap from 'gsap';
import { channelProjects,channelProjectsById,catalog } from './content.js';
import { createTvFrame } from './frame.js';
import { TV_SPEC } from '../experience/tv-spec.js';
import { createGallery,tapeMarkup } from './gallery.js';
import { renderCase } from './case.js';
import { renderProfile } from './profile.js';
import { resolveChannelRoute } from './routes.js';
import { renderAtlas } from './atlas.js';
import { createProjectIndex } from './project-index.js';

document.body.className='personal-channel';
document.body.innerHTML=`<a class="channel-skip" href="#channel-main">Skip to content</a><canvas id="physical-crt" aria-label="The original cream and olive 3D television"></canvas><main id="channel-screen" aria-label="Khalil Mustafa’s personal channel"><div id="channel-main" tabindex="-1"><section id="channel-collection" aria-label="Selected project collection"></section><div id="channel-pages" hidden></div></div><footer class="channel-footer"><span>Amman <time id="channel-clock"></time></span><span id="channel-context">Personal Channel / 2026</span><a href="mailto:${catalog.contact.email.address}">Email ↗</a></footer><div class="channel-glass" aria-hidden="true"></div><div id="channel-announcement" class="channel-sr" role="status" aria-live="polite"></div></main>`;
document.body.insertAdjacentHTML('beforeend',`<section id="desk-view" aria-label="Khalil’s retro desk"><header><span>Khalil Mustafa</span><a href="#work" id="desk-skip">Skip to the collection ↗</a></header><div class="desk-caption"><p>A little room.<br>A few things I’ve built.</p><span>Software developer / Backend, mobile & applied AI.</span></div><div id="desk-enter-anchor"><button id="desk-enter">Enter ↗</button></div><footer><span>Amman, Jordan</span><span>Click the television to enter.</span></footer></section><button id="desk-return" hidden>↙ Back to desk</button>`);
document.body.dataset.desk='wide';
const screen=document.querySelector('#channel-screen'),collection=document.querySelector('#channel-collection'),pages=document.querySelector('#channel-pages'),canvas=document.querySelector('#physical-crt'),reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const deskView=document.querySelector('#desk-view'),deskEnter=document.querySelector('#desk-enter'),deskAnchor=document.querySelector('#desk-enter-anchor'),deskReturn=document.querySelector('#desk-return');
const physicalControls=document.createElement('nav');physicalControls.id='physical-controls';physicalControls.setAttribute('aria-label','Television controls');
for(const[id,label]of[...TV_SPEC.channels.map((id,i)=>['channel-'+id,TV_SPEC.labels[i]]),['dial','Next channel'],['power','Television power']]){const button=document.createElement('button');button.type='button';button.dataset.physicalControl=id;button.setAttribute('aria-label',label);button.title=label;button.textContent=label;physicalControls.append(button);}document.body.append(physicalControls);
physicalControls.addEventListener('click',event=>{const button=event.target.closest('[data-physical-control]');if(button)hardware(button.dataset.physicalControl);});
const readingPositions=new Map();
let frame,gallery,projectIndex,page=null,view='work',projectId=null,selectedIndex=0,transition=null,ghost=null,disposed=false,ready=false,routeVersion=0,appliedHash=null,deskMoving=false,currentSection=null;
function cancelTransition(){transition?.kill();transition=null;ghost?.remove();ghost=null;gsap.set(pages,{clearProps:'opacity'});gsap.set(collection,{clearProps:'opacity'});screen.removeAttribute('data-transition');}
function focusPage(){if(frame&&frame.progress<.999)return;const target=view==='work'?collection.querySelector('.collection-stage'):page?.focusTarget??page?.querySelector('h1')??page;if(target){if(view!=='work')target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}}
function layout(rect,{cameraMoving=false,progress=1,controls=[]}={}){const interrupted=!cameraMoving&&Boolean(transition),version=routeVersion;if(!cameraMoving)cancelTransition();for(const c of controls){const button=physicalControls.querySelector(`[data-physical-control="${c.id}"]`);if(button)Object.assign(button.style,{left:`${c.x}px`,top:`${c.y}px`,width:`${c.width}px`,height:`${c.height}px`});}const placement={left:`${rect.x}px`,top:`${rect.y}px`,width:`${rect.width}px`,height:`${rect.height}px`};Object.assign(screen.style,placement,{opacity:String(Math.max(0,Math.min(1,(progress-.78)/.22))),visibility:progress>.78?'visible':'hidden'});Object.assign(deskAnchor.style,placement);deskView.style.opacity=String(1-Math.min(1,progress*3));screen.dataset.compact=String(innerWidth<900);if(interrupted)queueMicrotask(()=>{if(version===routeVersion&&!disposed)focusPage();});}
function deskState(inside,moving){deskMoving=moving;document.body.dataset.desk=moving?(inside?'entering':'leaving'):(inside?'inside':'wide');deskView.inert=inside||moving;screen.inert=!inside||moving;physicalControls.inert=!inside||moving||Boolean(projectIndex?.isOpen);deskReturn.hidden=!inside&&!moving;gallery?.setActive(inside&&!moving&&view==='work'&&!projectIndex?.isOpen);if(ready&&!moving){if(inside)focusPage();else deskEnter.focus({preventScroll:true});}}
function fallback(){document.body.classList.add('channel-fallback');canvas.hidden=true;deskState(true,false);const resize=()=>layout({x:12,y:18,width:Math.max(180,innerWidth-144),height:innerHeight-36});resize();window.addEventListener('resize',resize);deskReturn.hidden=true;}
function hardware(id){
 if(id==='enter'){navigate('#work');return;}
 const channels=['home','experience','education','skills','projects','credentials','contact'];
 if(id==='dial'){const current=view==='work'||view==='case'?'projects':view==='atlas'?'education':currentSection==='certifications'?'credentials':currentSection??'home';return hardware(`channel-${channels[(channels.indexOf(current)+1)%channels.length]}`);}
 if(id==='power'){navigate(frame?.isEntered?'#room':'#work');return;}
 const action=id.replace('channel-','');const hash=({home:'#profile',projects:'#work',experience:'#experience',education:'#atlas',skills:'#skills',credentials:'#certifications',contact:'#contact'})[action];if(hash)navigate(hash);
}
frame=createTvFrame({canvas,onLayout:layout,onControl:hardware,onUnavailable:fallback,onState:deskState});
gallery=createGallery({mount:collection,projects:channelProjects,reducedMotion,onSelect:index=>{selectedIndex=index;const p=channelProjects[index];document.querySelector('#channel-context').textContent=p.medium;if(ready&&view==='work'){window.history.replaceState({...window.history.state,selectedIndex:index},'',location.href);document.querySelector('#channel-announcement').textContent=`${p.title}, project ${index+1} of ${channelProjects.length}`;}},onOpen:(id,card)=>navigate(`#projects/${id}`,{origin:card}),onIndex:trigger=>{cancelTransition();projectIndex.open(trigger);}});
gallery.select(1,{immediate:true});
projectIndex=createProjectIndex({host:document.querySelector('#channel-main'),backgrounds:[physicalControls,collection,pages,document.querySelector('.channel-footer'),canvas,deskReturn],projects:channelProjects,canOpen:()=>view==='work'&&(!frame||(frame.isEntered&&frame.progress===1)),onVisibility:open=>{if(open)gallery.select(gallery.getSelected(),{immediate:true});gallery.setActive(!open&&view==='work'&&(!frame||(frame.isEntered&&frame.progress===1)));},onOpen:id=>{const index=channelProjects.findIndex(p=>p.id===id);gallery.select(index,{immediate:true});navigate(`#projects/${id}`,{origin:gallery.getCard(index)});}});
function makeGhost(project,rect){const bounds=screen.getBoundingClientRect(),element=document.createElement('div');element.className='project-tape tape-ghost';element.dataset.project=project.id;element.innerHTML=tapeMarkup(project);element.setAttribute('aria-hidden','true');element.style.setProperty('--tape-width',`${rect.width}px`);Object.assign(element.style,{left:`${rect.left-bounds.left}px`,top:`${rect.top-bounds.top}px`,width:`${rect.width}px`,height:`${rect.height}px`});screen.append(element);ghost=element;return element;}
const resolve=hash=>resolveChannelRoute(hash,channelProjectsById);
function navigate(hash,{history=true,origin=null,immediate=false}={}){
 if(page&&appliedHash)readingPositions.set(appliedHash,page.scrollTop);
 const restoreTop=!history?readingPositions.get(hash):undefined;
 const route=resolve(hash),previous=view,previousProject=projectId,version=++routeVersion;appliedHash=hash;projectIndex?.close({restoreFocus:false});
 const closing=route.view==='work'&&previous==='case';
 const closeRect=closing?page?.querySelector('.case-hero-media')?.getBoundingClientRect():null;
 const originRect=origin?.getBoundingClientRect();cancelTransition();page?.dispose?.();page=null;view=route.view;currentSection=route.section??null;projectId=route.projectId??null;
 const wantsInside=Boolean(hash)&&!['#room','#home'].includes(hash);if(frame&&(frame.isEntered!==wantsInside||immediate))frame.setEntered(wantsInside,{immediate});
 if(history&&location.hash!==hash)window.history.pushState({selectedIndex},'',hash);
 collection.hidden=view!=='work';pages.hidden=view==='work';gallery.setActive(view==='work'&&(!frame||(frame.isEntered&&frame.progress===1)));pages.replaceChildren();
 if(view==='case'){
  const project=channelProjectsById[projectId],index=channelProjects.findIndex(p=>p.id===projectId);gallery.select(index,{immediate:true});page=renderCase(project,{reducedMotion});pages.append(page);document.title=`${project.title} — Khalil Mustafa`;document.querySelector('#channel-context').textContent=project.medium;
 }else if(view==='profile'){page=renderProfile({reducedMotion,section:route.section,school:route.school});pages.append(page);const label=({experience:'Experience',education:'Education',skills:'Skills',certifications:'Certifications',contact:'Contact'})[route.section]??'Profile';document.title=`${label} — Khalil Mustafa`;document.querySelector('#channel-context').textContent='Software / Amman ↔ Valencia';}
 else if(view==='atlas'){page=renderAtlas({reducedMotion});pages.append(page);document.title='Amman to Valencia — Khalil Mustafa';document.querySelector('#channel-context').textContent='Amman → Valencia · Erasmus+ 2026';}
 else{gallery.select(selectedIndex,{immediate:true});document.title='Khalil Mustafa — Personal Channel';document.querySelector('#channel-context').textContent=channelProjects[selectedIndex].medium;}
 document.querySelectorAll('[data-physical-control^="channel-"]').forEach(button=>button.setAttribute('aria-pressed','false'));
 const selection=view==='case'||view==='work'?4:view==='atlas'||route.section==='education'?2:route.section==='skills'?3:route.section==='certifications'?5:route.section==='contact'?6:route.section==='experience'?1:0;frame?.setSelection(selection);physicalControls.querySelector(`[data-physical-control="channel-${TV_SPEC.channels[selection]}"]`).setAttribute('aria-pressed','true');physicalControls.querySelector('[data-physical-control="channel-projects"]').toggleAttribute('data-return-collection',view==='case');
 const projectControl=physicalControls.querySelector('[data-physical-control=channel-projects]');
 const projectLabel=view==='case'?'Back to projects':'Projects';projectControl.textContent=view==='case'?'← Projects':'Projects';projectControl.setAttribute('aria-label',projectLabel);projectControl.title=projectLabel;
 if(view==='case')document.querySelector('#channel-context').textContent='Scroll to explore ↓';
 if(restoreTop!==undefined&&page){const restore=()=>{if(version===routeVersion&&page)page.scrollTop=restoreTop;};requestAnimationFrame(()=>{restore();requestAnimationFrame(restore);});}
 document.querySelector('#channel-announcement').textContent=view==='case'?`${channelProjectsById[projectId].title} opened`:view==='work'?'Project collection':view==='atlas'?'Amman to Valencia journey':'Profile';
 const focus=()=>{if(version!==routeVersion)return;if(page?.contains(document.activeElement)&&document.activeElement.matches('a,button,input,textarea,select,summary'))return;focusPage();};
 if(!immediate&&!reducedMotion.matches&&view==='case'&&originRect?.width){
  const project=channelProjectsById[projectId],element=makeGhost(project,originRect),bounds=screen.getBoundingClientRect(),destination=page.querySelector('.case-hero-media').getBoundingClientRect();screen.dataset.transition='opening';
  transition=gsap.timeline({onComplete:()=>{cancelTransition();focus();}}).set(pages,{opacity:0}).to(element,{left:destination.left-bounds.left,top:destination.top-bounds.top,width:destination.width,height:destination.height,duration:.7,ease:'power3.inOut'}).to(pages,{opacity:1,duration:.3},.38).to(element,{opacity:0,duration:.25},.48);
 }else if(!immediate&&!reducedMotion.matches&&closing&&closeRect?.width&&closeRect.bottom>screen.getBoundingClientRect().top&&closeRect.top<screen.getBoundingClientRect().bottom){
  const project=channelProjectsById[previousProject],destination=gallery.getCard(selectedIndex).getBoundingClientRect(),element=makeGhost(project,closeRect),bounds=screen.getBoundingClientRect();screen.dataset.transition='closing';
  transition=gsap.timeline({onComplete:()=>{cancelTransition();focus();}}).fromTo(collection,{opacity:0},{opacity:1,duration:.55}).to(element,{left:destination.left-bounds.left,top:destination.top-bounds.top,width:destination.width,height:destination.height,duration:.62,ease:'power3.inOut'},0).to(element,{opacity:0,duration:.2},.42);
 }else if(!immediate&&!reducedMotion.matches){transition=gsap.fromTo(view==='work'?collection:pages,{opacity:0},{opacity:1,duration:.32,ease:'power1.out',onComplete:()=>{cancelTransition();focus();}});}else if(!immediate)focus();
}
screen.addEventListener('click',event=>{const anchor=event.target.closest('a[href^="#"]');if(!anchor||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();navigate(anchor.getAttribute('href'));});
window.addEventListener('popstate',event=>{if(Number.isInteger(event.state?.selectedIndex)&&event.state.selectedIndex>=0&&event.state.selectedIndex<channelProjects.length)selectedIndex=event.state.selectedIndex;navigate(location.hash,{history:false});});window.addEventListener('hashchange',()=>{if(location.hash!==appliedHash)navigate(location.hash,{history:false});});
deskEnter.addEventListener('click',()=>navigate('#work'));document.querySelector('#desk-skip').addEventListener('click',event=>{event.preventDefault();navigate('#work',{immediate:true});});deskReturn.addEventListener('click',()=>navigate('#room'));
window.addEventListener('keydown',event=>{if(event.key!=='Escape'||event.target.closest('video,input,textarea,select'))return;if(frame&&(deskMoving||view==='work')&&frame.progress>0){event.preventDefault();navigate('#room');}else if(view!=='work'){event.preventDefault();navigate('#work');}});
function clock(){document.querySelector('#channel-clock').textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Amman'}).format(new Date());}clock();const clockTimer=setInterval(clock,1000);
const motionPreference=()=>{cancelTransition();gallery.select(gallery.getSelected(),{immediate:true});};reducedMotion.addEventListener('change',motionPreference);
navigate(location.hash||'#room',{history:false,immediate:true});ready=true;if(!frame||frame.isEntered)focusPage();window.history.replaceState({...window.history.state,selectedIndex},'',location.href);
window.__personalChannel={get ready(){return ready;},get view(){return view;},get projectId(){return projectId;},get selectedIndex(){return selectedIndex;},get motion(){return gallery.getMotion();},get desk(){return {progress:frame?.progress??1,inside:frame?.isEntered??true,moving:deskMoving};},get frame(){return frame?.metrics()??{fallback:true};}};
window.addEventListener('pagehide',event=>{if(event.persisted||disposed)return;disposed=true;cancelTransition();projectIndex.dispose();page?.dispose?.();gallery.dispose();frame?.dispose();clearInterval(clockTimer);reducedMotion.removeEventListener('change',motionPreference);});


