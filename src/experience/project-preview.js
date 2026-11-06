import { escapeHtml as e } from '../core/dom.js';
import { evidenceById } from '../data/evidence.js';
import { renderPassportJourney } from './passport-journey.js';
import { renderLearningJourney } from './learning-journeys.js';

const chapters=['See it','Explore the system','My contribution','Results'];
function link(href,label){return `<a href="${e(href)}" target="_blank" rel="noopener noreferrer">${e(label)} ↗</a>`;}
function proof(id){const p=evidenceById[id];return !p?'':p.href?link(p.href,'View supporting record'):`<p class="record-note">${e(p.verificationNote)}</p>`;}

export function renderProjectPreview(project){
 if(project.id==='space-day')return renderPassportJourney(project);
 if(project.id==='rooms'||project.id==='bandup')return renderLearningJourney(project);
 const article=document.createElement('article');article.className='project-preview chapter-experience';article.tabIndex=-1;
 article.setAttribute('aria-label',`${project.title} project experience`);
 const video=project.media.find(m=>m.type==='video'&&m.ready);
 const images=project.media.filter(m=>m.type!=='video'&&m.ready);
 const lead=video?`<video controls playsinline preload="metadata" poster="${e(video.poster)}"><source src="${e(video.src)}" type="video/mp4"></video>`:
  images[0]?`<img class="preview-main-image" src="${e(images[0].src)}" alt="${e(images[0].alt)}">`:
  `<div class="project-no-recording"><span>PROJECT FILE</span><h2>${e(project.title)}</h2><p>${e(project.tagline)}</p><span>Explore the architecture and source below.</span></div>`;
 const nodes=project.architecture.nodes;
 article.innerHTML=`<div class="preview-nav"><button class="text-action" data-action="close">← Collection</button><span class="project-status">${e(project.statusLabel)}</span></div>
  <header class="preview-heading"><p class="chapter-kicker">${e(project.categories.join(' / '))}</p><h1>${e(project.title)}</h1><p>${e(project.tagline)}</p></header>
  <div class="chapter-tabs" role="tablist" aria-label="Project chapters">${chapters.map((c,i)=>`<button role="tab" id="chapter-${project.id}-${i}" aria-controls="chapter-panel-${project.id}-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-chapter="${i}"><span>0${i+1}</span>${c}</button>`).join('')}</div>
  <section class="chapter-panel" role="tabpanel" id="chapter-panel-${project.id}-0" aria-labelledby="chapter-${project.id}-0" tabindex="0">
   <div class="preview-media">${lead}</div>
   ${video||images[0]?`<p class="media-caption">${e((video||images[0]).caption)} ${video?.creditHref?link(video.creditHref,video.creditLabel.replace(/\s*↗$/,'')):''}</p>`:''}
   <p class="project-intro">${e(project.summary)}</p>
   <div class="project-problem"><span>THE PROBLEM</span><p>${e(project.problem)}</p></div>
   ${images.length>1?`<div class="capture-strip" aria-label="Project captures">${images.map((m,i)=>`<button data-capture="${i}" aria-pressed="${!video&&i===0}"><img loading="lazy" src="${e(m.src)}" alt="${e(m.alt)}"><span>${e(m.caption)}</span></button>`).join('')}</div>`:''}
   <button class="chapter-next text-action" data-next-chapter="1">Explore what happens behind the screen →</button>
  </section>
  <section class="chapter-panel" role="tabpanel" id="chapter-panel-${project.id}-1" aria-labelledby="chapter-${project.id}-1" tabindex="0" hidden>
   <div class="system-intro"><span class="chapter-kicker">ILLUSTRATED SYSTEM FLOW</span><h2>${e(project.architecture.title)}</h2><p>${e(project.architecture.summary)}</p></div>
   <div class="system-path" aria-label="Explore each stage">${nodes.map((n,i)=>`<button data-stage="${i}" aria-pressed="${i===0}"><span class="stage-number">0${i+1}</span><strong>${e(n.stage)}</strong><span>${i===nodes.length-1?'↙':'→'}</span></button>`).join('')}</div>
   <div class="stage-inspector" aria-live="polite"><span class="chapter-kicker">STAGE <span data-stage-position>01</span></span><h3 data-stage-title>${e(nodes[0].stage)}</h3><p data-stage-detail>${e(nodes[0].detail)}</p></div>
   ${project.id==='space-day'?`<div class="edge-case-lab"><h3>What if the scan goes wrong?</h3><div class="scenario-controls"><button data-scenario="valid" aria-pressed="true">Valid scan</button><button data-scenario="expired" aria-pressed="false">Expired code</button><button data-scenario="repeat" aria-pressed="false">Repeat scan</button></div><p data-scenario-result aria-live="polite">The server checks the signature, the 30-second window, and trainer enablement before recording the station approval.</p></div>`:''}
   ${project.id==='bandup'?`<div class="research-note"><strong>LIVE PLATFORM / PROPOSED R&D</strong><p>Guided IELTS lessons and practice are live. Dynamic misconception-graph branching is ongoing R&D.</p><button class="text-action" data-research-toggle aria-expanded="false">Explore the proposed prerequisite detour +</button><div class="research-detour" hidden><span>Target skill</span><span>Prerequisite gap</span><span>Focused practice</span><span>Return to target</span><p>Proposed Learning Graph · this diagram explains the research direction.</p></div></div>`:''}
   <div class="decision-note"><span class="chapter-kicker">THE ENGINEERING CHOICE</span><h3>${e(project.engineeringDecision.challenge)}</h3><p>${e(project.engineeringDecision.decision)}</p><details><summary>Compare the approaches</summary><p>${e(project.engineeringDecision.options)}</p></details></div>
   <button class="chapter-next text-action" data-next-chapter="2">See what I owned →</button>
  </section>
  <section class="chapter-panel" role="tabpanel" id="chapter-panel-${project.id}-2" aria-labelledby="chapter-${project.id}-2" tabindex="0" hidden>
   <span class="chapter-kicker">MY CONTRIBUTION</span><h2>The work behind the experience.</h2><p class="project-intro">${e(project.personalRole)}</p>
   ${project.details?.length?`<ul class="contribution-list">${project.details.map(d=>`<li>${e(d)}</li>`).join('')}</ul>`:''}
   <div class="ownership-note"><span>CONTEXT & ATTRIBUTION</span><p>${e(project.teamOrEventContext)}</p></div>
   <h3>Tools used in this project</h3><ul class="project-tools">${project.tech.map(t=>`<li>${e(t)}</li>`).join('')}</ul>
   <button class="chapter-next text-action" data-next-chapter="3">View the outcome and evidence →</button>
  </section>
  <section class="chapter-panel" role="tabpanel" id="chapter-panel-${project.id}-3" aria-labelledby="chapter-${project.id}-3" tabindex="0" hidden>
   <span class="chapter-kicker">RESULTS & RECORDS</span><h2>What came out of it.</h2>
   <div class="outcome-list">${project.outcomes.map(o=>`<section><span>${e(o.scope)}</span><p>${e(o.text)}</p>${proof(o.evidenceId)}</section>`).join('')}</div>
   <p class="result-reflection">${e(project.engineeringDecision.outcome)}</p>
   ${project.links.length?`<div class="preview-links">${project.links.map(l=>link(l.href,l.label.replace(/\s*↗$/,''))).join('')}</div>`:''}
   <button class="primary-action preview-return" data-action="close">Back to the collection ←</button>
  </section>`;
 let activeChapter=0;
 function selectChapter(index,{focus=false}={}){
  activeChapter=index;article.dataset.chapter=String(index);
  article.querySelectorAll('[role=tab]').forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;if(focus&&i===index)tab.focus();});
  article.querySelectorAll('[role=tabpanel]').forEach((panel,i)=>panel.hidden=i!==index);
  if(index!==0)article.querySelectorAll('video').forEach(v=>v.pause());
  article.dispatchEvent(new CustomEvent('chapterchange',{bubbles:true}));
 }
 article.addEventListener('click',event=>{
  const tab=event.target.closest('button[data-chapter]');if(tab){selectChapter(Number(tab.dataset.chapter));return;}
  const next=event.target.closest('[data-next-chapter]');if(next){selectChapter(Number(next.dataset.nextChapter),{focus:true});return;}
  const stage=event.target.closest('[data-stage]');if(stage){const i=Number(stage.dataset.stage);article.querySelectorAll('[data-stage]').forEach(b=>b.setAttribute('aria-pressed',String(b===stage)));article.querySelector('[data-stage-position]').textContent=String(i+1).padStart(2,'0');article.querySelector('[data-stage-title]').textContent=nodes[i].stage;article.querySelector('[data-stage-detail]').textContent=nodes[i].detail;return;}
  const scenario=event.target.closest('[data-scenario]');if(scenario){article.querySelectorAll('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b===scenario)));article.querySelector('[data-scenario-result]').textContent={valid:'The server checks the signature, the 30-second window, and trainer enablement before recording the station approval.',expired:'The generation window has expired. The server rejects the code; it does not add a station completion.',repeat:'The participant–station record is already present. The database uniqueness constraint prevents a second stamp.'}[scenario.dataset.scenario];return;}
  const research=event.target.closest('[data-research-toggle]');if(research){const open=research.getAttribute('aria-expanded')!=='true';research.setAttribute('aria-expanded',String(open));article.querySelector('.research-detour').hidden=!open;return;}
  const capture=event.target.closest('[data-capture]');if(capture){article.querySelectorAll('video').forEach(v=>v.pause());const m=images[Number(capture.dataset.capture)];const media=article.querySelector('.preview-media');let img=media.querySelector('.capture-main');if(!img){img=new Image();img.className='preview-main-image capture-main';media.append(img);}media.querySelectorAll('video,img:not(.capture-main),.project-no-recording').forEach(el=>el.hidden=true);img.src=m.src;img.alt=m.alt;img.hidden=false;article.querySelector('.media-caption').textContent=m.caption;article.querySelectorAll('[data-capture]').forEach(b=>b.setAttribute('aria-pressed',String(b===capture)));}
 });
 article.addEventListener('keydown',event=>{
  if(event.target.getAttribute('role')!=='tab')return;
  let next=activeChapter;if(event.key==='ArrowRight')next=(activeChapter+1)%4;else if(event.key==='ArrowLeft')next=(activeChapter+3)%4;else if(event.key==='Home')next=0;else if(event.key==='End')next=3;else return;
  event.preventDefault();selectChapter(next,{focus:true});
 });
 return article;
}
