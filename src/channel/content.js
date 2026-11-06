import { contentCatalog,catalogProjectsById } from '../data/content-catalog.js';
export const catalog=contentCatalog;
const editions={
 rooms:{cover:['ROOMS'],line:'Study becomes something you do together.',intro:'A shared study room where structured AI questions become multiplayer rounds.',decisionTitle:'Prepare the questions. Protect the rhythm.',role:'Challenge states & AI integration',medium:'Multiplayer / AI'},
 'space-day':{cover:['SPACE','DAY'],line:'One passport. Every station. A verified finish.',intro:'A bilingual digital passport connecting students, station trainers, and completion records.',decisionTitle:'A scan requests approval. The server decides.',role:'End-to-end architecture & build',medium:'Operational software'},
 bandup:{cover:['BAND','UP'],line:'A learning path with somewhere to go.',intro:'IELTS lessons and guided practice today, with a more adaptive learning graph under research.',decisionTitle:'Ship the lesson flow before the adaptive layer.',role:'Independent creator & developer',medium:'Learning platform / R&D'},
 'vision-career':{cover:['MASAR'],line:'Turn a career question into a path forward.',intro:'A Flutter application connecting specialization choices to prerequisite-based learning paths.',decisionTitle:'Advice needs a path, and a path needs checkpoints.',role:'Mobile application development',medium:'Flutter / Applied AI'},
 futureing:{cover:['FUTURE','ING'],line:'An assistant that proposes, acts, and can undo.',intro:'A local-first mobile prototype exploring a shared action layer for the interface and its assistant.',decisionTitle:'Give the assistant the same controlled actions as the UI.',role:'Private prototype development',medium:'Mobile / Local-first'},
 'nasa-space-apps':{cover:['SPACE','APPS'],line:'A public doorway into a regional hackathon.',intro:'The event platform and registration workflow for NASA Space Apps Jordan, alongside the MENA Space web hub.',decisionTitle:'Make registration dependable on a phone.',role:'Event site development & deployment',medium:'Event platform'},
 makan:{cover:['MAKAN'],line:'Ordinary phone footage. A different point of view.',intro:'An experiment in recovering camera poses and building navigable interiors from smartphone video.',decisionTitle:'Better frames before more frames.',role:'Computer vision pipeline & research',medium:'Spatial computing / Experiment'},
 happensbefore:{cover:['HAPPENS','BEFORE'],line:'Make the order of concurrent events visible.',intro:'A systems project exploring execution traces, causal ordering, and invariant checks.',decisionTitle:'Reason about the trace as a partial order.',role:'Concurrency-verification development',medium:'Systems / In development'},
 'abyss-of-the-loss':{cover:['ABYSS','OF THE LOSS'],line:'A small world with something wrong in it.',intro:'A Godot horror game built from movement states, interactive rooms, and environmental cues.',decisionTitle:'Let the scenes carry the tension.',role:'Godot gameplay & scene development',medium:'Playable game'},
};
export const projectIds=Object.keys(editions);
export const channelProjects=projectIds.map(id=>({...catalogProjectsById[id],...editions[id],edition:projectIds.indexOf(id)+1}));
export const channelProjectsById=Object.fromEntries(channelProjects.map(p=>[p.id,p]));
export const atlasPlaces=[
 {id:'amman',name:'Amman',country:'Jordan',lat:31.95,lon:35.93,kind:'Home',copy:'Computer Science at ASU in Jordan.',projects:['space-day','nasa-space-apps','rooms']},
 {id:'valencia',name:'Valencia',country:'Spain',lat:39.47,lon:-.38,kind:'Erasmus+ Exchange',copy:'Spring 2026 at UPV Valencia.',route:'#education'}
];
