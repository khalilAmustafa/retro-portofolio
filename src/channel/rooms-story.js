const chapters=[
 {name:'Choose a topic',title:'Start with something worth practising.',copy:'The host chooses the study topic and round format. That input starts the question preparation flow.',image:'room-create-02.webp',alt:'ROOMS room creation and game mode selection'},
 {name:'Prepare questions',title:'Prepare first. Start the timer second.',copy:'Structured prompts prepare question and explanation payloads before the timed round. My contribution includes the prompt and feedback integration.',image:'arena-question-03.webp',alt:'ROOMS Battle Arena question presentation'},
 {name:'Play together',title:'One round. Shared progression.',copy:'Question generation and round state have different jobs. Challenge transitions and progression keep the multiplayer experience moving.',image:'gameplay-lobby-01.webp',alt:'ROOMS multiplayer gameplay'},
 {name:'Review the result',title:'Finish with a reason to keep learning.',copy:'The flow reaches ranking and targeted explanations. This is the review stage of the documented system, rather than a live multiplayer session.',image:'invite-flow-04.webp',alt:'ROOMS peer invite and room code'}
];
export function roomsStoryMarkup(){return `<section class="rooms-story" aria-label="Explore the ROOMS system"><header><span>Inside ROOMS</span><h2>Follow a study round.</h2><p>An illustrated walkthrough using project captures. Choose a stage to explore how the system fits together.</p></header><div class="rooms-story-steps" role="group" aria-label="Study round stages">${chapters.map((c,i)=>`<button type="button" data-story-step="${i}" aria-pressed="${i===0}" aria-controls="rooms-story-detail">${c.name}</button>`).join('')}</div><div id="rooms-story-detail" class="rooms-story-detail"><figure><img alt=""><figcaption></figcaption></figure><div aria-live="polite"><span data-story-count></span><h3></h3><p></p><button type="button" data-story-next>Next stage →</button></div></div></section>`;}
export function mountRoomsStory(root,project){
 const story=root.querySelector('.rooms-story');let selected=0;
 function show(index){
  selected=index;const chapter=chapters[index],media=project.media.find(m=>m.src?.endsWith(chapter.image)),image=story.querySelector('img');
  image.src=media?.src??project.media.find(m=>m.type!=='video'&&m.ready).src;image.alt=media?.alt??chapter.alt;
  story.querySelector('figcaption').textContent=media?.caption??'Project capture';
  story.querySelector('[data-story-count]').textContent=`${index+1} / ${chapters.length} · System walkthrough`;
  story.querySelector('h3').textContent=chapter.title;story.querySelector('.rooms-story-detail>div>p').textContent=chapter.copy;
  story.querySelectorAll('[data-story-step]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
  story.querySelector('[data-story-next]').textContent=index===chapters.length-1?'Back to the beginning ↺':'Next stage →';
 }
 story.addEventListener('click',event=>{const step=event.target.closest('[data-story-step]');if(step)show(Number(step.dataset.storyStep));else if(event.target.closest('[data-story-next]'))show((selected+1)%chapters.length);});
 show(0);
}
