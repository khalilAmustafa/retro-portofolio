import published from './published-portfolio.json' with { type: 'json' };
import { projects } from './projects.js';
import { profile } from './profile.js';
import { experienceMilestones } from './experience.js';
import { educationData } from './education.js';
import { contactsData } from './contacts.js';
import { skillGroups } from './skills.js';
import { credentialsData } from './credentials.js';
import { evidenceRegistry } from './evidence.js';

const publishedIds=['asad-math','vision-career','vision-pulse','abyss-of-the-loss'];
const publishedById=new Map(published.projects.map((p,i)=>[publishedIds[i],p]));
const removedProjectIds=new Set(['asad-math','vision-pulse']);
const catalogProjects=projects.filter(project=>!removedProjectIds.has(project.id)).map(project=>{
 const update=publishedById.get(project.id);
 if(!update)return {...project,details:[],sources:['previous']};
 const links=[...project.links];
 for(const link of update.links){
  if(link.todo||!link.href.startsWith('https://')||links.some(l=>l.href===link.href))continue;
  links.push({label:link.label.replace(/^>\s*/,''),href:link.href,type:'showcase'});
 }
 return {...project,title:update.title,summary:update.description,details:update.details,
  tech:[...new Set([...project.tech,...update.tech])],links,sources:['previous','published']};
});

export const contentCatalog={
 sources:{previous:{label:'Previous CRT portfolio',path:'C:/Users/khali/Desktop/dist/src/data',captured:'2026-11-05'},
  published:{label:'Published portfolio',url:'https://khalils.codes/',captured:'2026-11-05',snapshot:'docs/content-sources/published-data.json'}},
 profile:{...profile,headline:'Backend & Cloud-Focused Developer',
  introduction:'I build practical software systems with a focus on backend architecture, cloud-ready deployment, authentication, database-backed workflows, and usable full-stack products.',
  supportingLine:'Computer Science in Amman. Erasmus+ at UPV Valencia. AWS Certified Cloud Practitioner.',sources:['previous','published']},
 projects:catalogProjects,
 experience:experienceMilestones.map((m,i)=>i?{...m,sources:['previous']}:{...m,title:'IT / AI Team Member',organization:'MENA ORG',
  oneLineResult:'Contributing to backend and cloud foundations, AI-powered features, and deployment workflows for organization web systems.',
  publishedDetails:published.experience,sources:['previous','published']}),
 education:{...educationData,institutions:educationData.institutions.map((i,n)=>({...i,
  academicRecord:n===0?published.education[0].details:null,
  publishedPeriod:published.education[n].period,sources:['previous','published']}))},
 skills:{publishedGroups:published.skills,evidenceGroups:skillGroups},
 credentials:{featured:credentialsData.featured,records:published.credentials.map(c=>({...c,
  evidenceHref:new URL(c.image,'https://khalils.codes/').href,source:'published'})),
  honors:credentialsData.honorsAndCompetitions},
 learningProgress:{title:'IBM Data Science Professional Certificate',completed:8,total:12,status:'in-progress',source:'published'},
 evidence:evidenceRegistry,
 contact:{...contactsData,email:{...contactsData.email,address:'khalil.asad.2005@gmail.com',mailto:'mailto:khalil.asad.2005@gmail.com'}},
 contactEmails:[{address:'khalil.asad.2005@gmail.com',source:'published'},{address:contactsData.email.address,source:'previous'}],
 conflicts:[{field:'contact.email',previous:contactsData.email.address,published:'khalil.asad.2005@gmail.com',resolution:'User selected the published email on 2026-11-05.'},
  {field:'education.exchangePeriod',previous:'Spring 2026',published:'2025 to 2026',resolution:'Use Spring 2026 for the semester; retain published academic-year range in provenance.'},
  {field:'experience.currentRole',previous:experienceMilestones[0].title,published:'IT / AI Team Member',resolution:'Use the published role title; preserve earlier project-specific contributions separately.'}]
};
export const catalogProjectsById=Object.fromEntries(catalogProjects.map(p=>[p.id,p]));
