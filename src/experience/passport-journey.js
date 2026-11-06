import gsap from 'gsap';
import { escapeHtml as e } from '../core/dom.js';
import { createPassportState,scanStation,nextStation } from './passport-state.js';
import './passport-journey.css';

export function renderPassportJourney(project){
 const article=document.createElement('article');article.className='passport-journey';article.tabIndex=-1;article.setAttribute('aria-label','Space Day interactive project journey');
 article.innerHTML=`<div class="mission-top"><button data-action="close">↙ Collection</button><span>SPACE DAY / INTERACTIVE WALKTHROUGH</span><button data-build-toggle aria-expanded="false">Behind the build ↗</button></div>
 <div class="mission-title"><span data-act-label>01 / THE MISSION</span><h1 data-act-title>A day of discovery.<br>Without the paper trail.</h1></div>
 <div class="mission-world preview-media" tabindex="0" aria-label="Interactive passport story. Scroll, drag, or use the story progress slider.">
  <div class="mission-orbits" aria-hidden="true"><i></i><i></i><i></i><span>✦</span><b>✦</b></div>
  <div class="mission-camera">
   <section class="mission-scene scene-cover" aria-label="The digital passport">
    <div class="mission-copy"><span class="mission-eyebrow">BUILT FOR LIVE EVENT OPERATIONS</span><p>One passport.<br>Every station.<br>A verified finish.</p><small>I built the bilingual workflow from student check-in to PDF certificate.</small></div>
    <div class="passport-object"><div class="passport-spine"></div><span>STUDENT EXPLORER / 2026</span><div class="passport-emblem" aria-hidden="true">✦<i></i></div><strong>SPACE<br>DAY</strong><span>DIGITAL PASSPORT</span><div class="passport-cover-bottom"><span>EN / عربي</span><span>↗</span></div></div>
   </section>
   <section class="mission-scene scene-checkin" aria-label="Bilingual student session">
    <div class="mission-copy"><span class="mission-eyebrow">01 / STUDENT SESSION</span><p>A small screen.<br>A clear beginning.</p><small>English or Arabic. The same progression, with full right-to-left support.</small></div>
    <div class="passport-open"><div class="passport-page page-identity"><span>SPACE DAY</span><strong data-welcome>Ready to explore?</strong><div class="explorer-mark" aria-hidden="true">✦</div><p data-passport-caption>Your digital passport</p><div class="passport-language"><button data-language="en" aria-pressed="true">EN</button><button data-language="ar" aria-pressed="false">عربي</button></div></div><div class="passport-page page-stations"><span data-station-heading>YOUR MISSION</span><div class="sample-stamps">${[0,1,2].map(i=>`<div data-stamp="${i}"><span>0${i+1}</span><b>✦</b><small>SAMPLE STATION</small></div>`).join('')}</div><small>Three sample stations in this walkthrough.</small></div></div>
   </section>
   <section class="mission-scene scene-scan" aria-label="Try a station approval">
    <div class="trainer-card"><div><span>TRAINER CONSOLE</span><span data-demo-station>STATION 01</span></div><div class="illustrative-qr" aria-hidden="true">${Array.from({length:169},(_,i)=>`<i class="${((i*37+i%13*7)%17)<9?'filled':''}"></i>`).join('')}<span>✦</span></div><span class="qr-label">ILLUSTRATIVE CODE / 30s WINDOW</span><div class="token-life"><i></i></div><button class="mission-scan" data-scan>Scan station →</button></div>
    <div class="scan-explanation"><span class="mission-eyebrow">02 / TRUST THE STAMP</span><p class="scan-headline" data-scan-headline>A scan is a request.<br>The server decides.</p><div class="scan-checks"><span data-check="0">01 / Signed token</span><span data-check="1">02 / Valid time window</span><span data-check="2">03 / One stamp per station</span></div><p class="scan-result" data-scan-result aria-live="polite">Try the valid code. Then test an expired code or scan the same station twice.</p><div class="scan-tools"><button data-expire aria-pressed="false">Try expired code</button><button data-next-station>Next sample station →</button></div><span class="stamp-count" data-stamp-count>0 / 3 STATIONS APPROVED</span></div>
   </section>
   <section class="mission-scene scene-certificate" aria-label="Verified completion">
    <div class="mission-copy"><span class="mission-eyebrow">03 / A VERIFIED FINISH</span><p>Completion is earned.<br>Then generated.</p><small>The server gates the bilingual PDF certificate on verified station records.</small><button class="mission-inline" data-return-scan>Finish the sample stations ↗</button></div>
    <div class="mission-certificate" data-certificate><div class="certificate-border"><span>SPACE DAY / MISSION RECORD</span><div class="certificate-seal" aria-hidden="true">✦</div><h2>Certificate<br>of exploration</h2><p data-certificate-status>Awaiting verified completions</p><div class="certificate-signature">Space Day</div><small>Illustrative certificate · no event record is created.</small></div></div>
   </section>
  </div>
 </div>
 <div class="mission-dock"><button class="mission-prev" data-story-prev aria-label="Previous scene">←</button><div class="mission-scrubber"><label for="mission-progress">SCROLL OR DRAG TO EXPLORE <span data-story-count>01 / 04</span></label><input id="mission-progress" type="range" min="0" max="3" step="0.001" value="0" aria-label="Story progress"></div><button class="mission-next" data-story-next>Begin mission ↗</button></div>
 <aside class="mission-build" hidden aria-label="Engineering notes"><button class="mission-build-close" data-build-toggle>Close ×</button><span class="mission-eyebrow">PERSONALLY ARCHITECTED & BUILT</span><h2>The experience has a backbone.</h2><div class="mission-build-path"><span>Next.js session</span><b>→</b><span>Signed QR</span><b>→</b><span>PostgreSQL</span><b>→</b><span>PDF engine</span></div><p>${e(project.personalRole)}</p><h3>What keeps it honest?</h3><p>${e(project.engineeringDecision.decision)}</p><button data-actual-toggle>Inspect actual app captures ↗</button><div class="actual-passport-captures" hidden>${project.media.filter(m=>m.ready).map(m=>`<figure><img loading="lazy" src="${e(m.src)}" alt="${e(m.alt)}"><figcaption>${e(m.caption)}</figcaption></figure>`).join('')}</div><p class="mission-source-note">Delivered for live Space Day operations. This interactive walkthrough illustrates the workflow; it is separate from the operational application.</p></aside>`;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const camera=article.querySelector('.mission-camera'),world=article.querySelector('.mission-world'),range=article.querySelector('#mission-progress');
 const progress={value:0};let state=createPassportState(),active=0,intent=0,wheelDirection=0,disposed=false,drag=null,scanTween;
 const labels=['01 / THE MISSION','02 / CHECK IN','03 / AT THE STATION','04 / THE FINISH'];
 const titles=['A day of discovery.<br>Without the paper trail.','A passport that<br>speaks your language.','Fast to scan.<br>Hard to fake.','Every stamp counts.<br>So does the finish.'];
 const nextLabels=['Begin mission ↗','Try a station scan ↗','See the finish ↗','Replay the journey ↻'];
 function draw(){
  if(disposed)return;const p=progress.value;
  gsap.set(camera,{xPercent:-p*100});range.value=p;
  const nearest=Math.round(p);active=nearest;article.dataset.scene=nearest;
  article.querySelector('[data-act-label]').textContent=labels[nearest];article.querySelector('[data-act-title]').innerHTML=titles[nearest];
  article.querySelector('[data-story-count]').textContent=`0${nearest+1} / 04`;article.querySelector('[data-story-next]').textContent=nextLabels[nearest];
  article.querySelector('[data-story-prev]').disabled=p<.02;
  article.querySelectorAll('.mission-scene').forEach((scene,i)=>{scene.inert=Math.abs(p-i)>.55;scene.setAttribute('aria-hidden',String(Math.abs(p-i)>.55));
   const distance=i-p;gsap.set(scene.querySelector('.passport-object,.passport-open,.trainer-card,.mission-certificate'),{rotation:distance*-8,scale:1-Math.min(.18,Math.abs(distance)*.12)});
  });
 }
 function seek(value,{direct=false}={}){gsap.killTweensOf(progress);const v=Math.max(0,Math.min(3,value));intent=v;if(direct||reduced.matches){progress.value=v;draw();}else gsap.to(progress,{value:v,duration:.6,ease:'power3.out',onUpdate:draw});}
 function updatePassport(){
  article.querySelectorAll('[data-stamp]').forEach(stamp=>stamp.classList.toggle('is-approved',state.stamps.includes(Number(stamp.dataset.stamp))));
  article.querySelector('[data-demo-station]').textContent=`STATION 0${state.station+1}`;article.querySelector('[data-stamp-count]').textContent=`${state.stamps.length} / 3 STATIONS APPROVED`;
  article.querySelector('[data-certificate]').classList.toggle('is-unlocked',state.complete);
  article.querySelector('[data-certificate-status]').textContent=state.complete?'All sample stations verified. Certificate unlocked.':'Awaiting verified completions';
  article.querySelector('[data-return-scan]').textContent=state.complete?'Revisit the station flow ↗':'Finish the sample stations ↗';
 }
 article.addEventListener('click',event=>{
  if(event.target.closest('[data-story-next]')){const next=Math.round(intent);seek(next===3?0:next+1);return;}
  if(event.target.closest('[data-story-prev]')){seek(Math.round(intent)-1);return;}
  if(event.target.closest('[data-return-scan]')){seek(2);return;}
  const language=event.target.closest('[data-language]');if(language){const ar=language.dataset.language==='ar';article.querySelector('.passport-open').dir=ar?'rtl':'ltr';article.querySelector('[data-welcome]').textContent=ar?'جاهز للاستكشاف؟':'Ready to explore?';article.querySelector('[data-passport-caption]').textContent=ar?'جوازك الرقمي':'Your digital passport';article.querySelector('[data-station-heading]').textContent=ar?'مهمتك':'YOUR MISSION';article.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b===language)));return;}
  if(event.target.closest('[data-build-toggle]')){const panel=article.querySelector('.mission-build'),button=article.querySelector('[data-build-toggle]');panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden){panel.querySelector('button').focus();gsap.fromTo(panel,{y:20,opacity:0},{y:0,opacity:1,duration:reduced.matches?0:.3});}else button.focus();return;}
  if(event.target.closest('[data-actual-toggle]')){const captures=article.querySelector('.actual-passport-captures');captures.hidden=!captures.hidden;return;}
  const expire=event.target.closest('[data-expire]');if(expire){state={...state,scenario:state.scenario==='expired'?'valid':'expired',result:'ready'};expire.setAttribute('aria-pressed',String(state.scenario==='expired'));expire.textContent=state.scenario==='expired'?'Use a fresh code':'Try expired code';article.querySelector('.trainer-card').classList.toggle('token-expired',state.scenario==='expired');return;}
  if(event.target.closest('[data-next-station]')){state=nextStation(state);scanTween?.kill();article.querySelector('[data-expire]').setAttribute('aria-pressed','false');article.querySelector('[data-expire]').textContent='Try expired code';article.querySelector('.trainer-card').classList.remove('token-expired');article.querySelector('[data-scan-result]').textContent='Fresh sample station. Scan to request approval.';article.querySelectorAll('[data-check]').forEach(c=>c.classList.remove('checked','rejected'));updatePassport();return;}
  if(event.target.closest('[data-scan]')){
   state=scanStation(state);updatePassport();scanTween?.kill();const checks=[...article.querySelectorAll('[data-check]')];checks.forEach(c=>c.classList.remove('checked','rejected'));
   const result=article.querySelector('[data-scan-result]');result.textContent='Checking the request…';
   scanTween=gsap.timeline();checks.forEach((check,i)=>scanTween.call(()=>{check.classList.add(state.result==='expired'&&i===1||state.result==='duplicate'&&i===2?'rejected':'checked');},null,reduced.matches?0:i*.12));
   scanTween.call(()=>{result.textContent={approved:state.complete?'Final stamp verified. Your sample certificate is unlocked.':'Station approved. The completion record is saved once.',expired:'Expired code rejected. No station completion was added.',duplicate:'Already approved. A repeat scan cannot add another stamp.'}[state.result];if(state.result==='approved')gsap.fromTo(article.querySelector('.trainer-card'),{scale:.96},{scale:1,duration:reduced.matches?0:.4,ease:'back.out(1.7)'});},null,reduced.matches?0:.4);
  }
 });
 range.addEventListener('input',()=>seek(Number(range.value),{direct:true}));range.addEventListener('change',()=>seek(Math.round(Number(range.value))));
 world.addEventListener('wheel',event=>{if(event.target.closest('input,video,select,textarea'))return;event.preventDefault();const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?world.clientHeight:1),direction=Math.sign(delta);if(direction!==wheelDirection)intent=progress.value;wheelDirection=direction;seek(intent+delta*.0025);},{passive:false});
 world.addEventListener('pointerdown',event=>{if(event.target.closest('button,input'))return;drag={id:event.pointerId,x:event.clientX,y:event.clientY,start:progress.value,moved:false};world.setPointerCapture(event.pointerId);});
 world.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)){drag.moved=true;seek(drag.start-dx/world.clientWidth,{direct:true});}});
 world.addEventListener('pointerup',()=>{if(drag?.moved)seek(Math.round(progress.value));drag=null;});world.addEventListener('pointercancel',()=>{drag=null;seek(Math.round(progress.value));});
 article.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!article.querySelector('.mission-build').hidden){event.stopPropagation();article.querySelector('.mission-build-close').click();return;}
  if(event.target.closest('button,input'))return;if(event.key==='ArrowRight'){event.preventDefault();seek(active+1);}else if(event.key==='ArrowLeft'){event.preventDefault();seek(active-1);}
 });
 article.dispose=()=>{disposed=true;scanTween?.kill();gsap.killTweensOf(progress);gsap.killTweensOf(article.querySelectorAll('*'));};
 updatePassport();draw();return article;
}

