import { escapeHtml as e } from '../core/dom.js';
import { catalog,channelProjects } from './content.js';
import { smoothContentScroll } from './scroll.js';

const external=(href,label)=>`<a href="${e(href)}" target="_blank" rel="noopener noreferrer">${e(label.replace(/\s*↗$/,''))} ↗</a>`;
function mediaFigure(media,{hero=false}={}){
 if(!media)return '';
 return `<figure class="${hero?'case-hero-media':'case-capture'}">${media.type==='video'?`<video controls playsinline preload="metadata" poster="${e(media.poster)}"><source src="${e(media.src)}" type="video/mp4"></video>`:`<div class="capture-window"><img src="${e(media.src)}" alt="${e(media.alt)}" loading="${hero?'eager':'lazy'}"></div>`}<figcaption>${e(media.caption)}${media.creditHref?external(media.creditHref,media.creditLabel):''}</figcaption></figure>`;
}
export function renderCase(project,{reducedMotion}){
 const root=document.createElement('div');root.className='case-scroll channel-scroll';root.tabIndex=0;root.setAttribute('aria-label',`${project.title} case study`);root.dataset.project=project.id;
 const video=project.media.find(m=>m.type==='video'&&m.ready),images=project.media.filter(m=>m.type!=='video'&&m.ready),lead=video??images[0];
 const next=channelProjects[(channelProjects.findIndex(p=>p.id===project.id)+1)%channelProjects.length];
 root.innerHTML=`<article class="case-book"><div class="case-top"><span>Case study</span><span>PROJECT ${String(project.edition).padStart(2,'0')} / 2026</span><span>${e(project.statusLabel)}</span></div><header class="case-heading"><span>${e(project.medium)}</span><h1>${e(project.title)}</h1><p>${e(project.intro)}</p><div class="case-meta"><div><span>Contribution</span><strong>${e(project.role)}</strong></div><div><span>Result / status</span><strong>${e(project.result)}</strong></div></div><div class="case-links case-opening-links">${project.links.map(l=>external(l.href,l.label)).join('')}</div></header>
 ${lead?mediaFigure(lead,{hero:true}):`<div class="case-hero-media case-type-hero"><span>${e(project.architecture.title)}</span><strong>${project.cover.map(line=>`<span>${e(line)}</span>`).join('')}</strong><p>${e(project.line)}</p></div>`}
 <section class="case-chapter ${images[1]?'with-visual':''}">${images[1]?`<div class="case-chapter-visual">${mediaFigure(images[1])}</div>`:''}<div class="case-chapter-copy"><span>The challenge</span><h2>${e(project.decisionTitle)}</h2><p>${e(project.problem)}</p><p>${e(project.engineeringDecision.decision)}</p></div></section>
 <section class="case-system"><div><span>${project.status==='in-development'?'Planned system':'The system'}</span><h2>${e(project.architecture.title)}</h2><p>${e(project.architecture.summary)}</p></div><div class="case-system-flow">${project.architecture.nodes.map((n,i)=>`<div class="case-system-node"><span>${String(i+1).padStart(2,'0')}</span><h3>${e(n.stage)}</h3><p>${e(n.detail)}</p><i aria-hidden="true"></i></div>`).join('')}</div></section>
 ${images.length>2?`<div class="case-media-sequence">${images.slice(2).map(m=>mediaFigure(m)).join('')}</div>`:''}
 <section class="case-contribution"><span>My work</span><h2>Engineering contribution.</h2><p>${e(project.personalRole)}</p>${project.details?.length?`<div class="case-additional-details">${project.details.map(d=>`<p>${e(d)}</p>`).join('')}</div>`:''}<div class="case-tools">${project.tech.map(t=>`<span>${e(t)}</span>`).join('')}</div><details><summary>Context & attribution</summary><p>${e(project.teamOrEventContext)}</p><p>${e(project.engineeringDecision.options)}</p></details></section>
 <section class="case-outcomes"><span>The outcome</span>${project.outcomes.map(o=>{const proof=catalog.evidence.find(p=>p.id===o.evidenceId);return `<div><h2>${e(o.text)}</h2><p>${e(o.scope)}</p>${proof?.href?external(proof.href,'Supporting record'):proof?`<small>${e(proof.verificationNote)}</small>`:''}</div>`;}).join('')}</section>
 <a class="case-next" href="#projects/${next.id}"><span>Next in the collection</span><strong>${e(next.title)}</strong><span>${e(next.line)}</span><b>↗</b></a></article><div class="case-reading-progress" aria-hidden="true"><i></i></div>`;
 const progress=root.querySelector('.case-reading-progress i'),visuals=[...root.querySelectorAll('.case-chapter-visual,.case-media-sequence .case-capture')],nodes=[...root.querySelectorAll('.case-system-node')];
 const scroll=smoothContentScroll(root,{reducedMotion,onDraw:(top,max)=>{
  progress.style.transform=`scaleX(${top/max})`;
  if(reducedMotion.matches)return;
  const viewport=root.getBoundingClientRect();
  visuals.forEach(visual=>{const r=visual.getBoundingClientRect(),p=Math.max(-1,Math.min(1,(r.top-viewport.top)/Math.max(1,viewport.height)));visual.style.transform=`perspective(1200px) rotateY(${p*-5}deg) rotateZ(${p*-1.2}deg) translateY(${p*8}px)`;});
  nodes.forEach(node=>{const r=node.getBoundingClientRect();node.classList.toggle('is-reached',r.top<viewport.top+viewport.height*.8);});
 }});
 root.dispose=()=>{scroll.dispose();root.querySelectorAll('video').forEach(v=>v.pause());};
 return root;
}

