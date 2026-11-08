import { describe,it,expect } from 'vitest';
import { contentCatalog } from '../src/data/content-catalog.js';
import { projects } from '../src/data/projects.js';
import { channelProjectsById as cases } from '../src/channel/content.js';
describe('Content reconciled from previous and published portfolios',()=>{
 it('keeps visible achievements scoped to their actual evidence',()=>{
  expect(cases['nasa-space-apps'].result).toMatch(/Event scale:.*85\+.*380\+/);
  expect(cases.rooms.result).toMatch(/3rd place.*\(team\)/);
  expect(cases.makan.result).toMatch(/318\/318.*0.88.*one sequence/);
 });
 it('does not present research or prototypes as shipped features',()=>{
  expect(cases.happensbefore.intro).toMatch(/in-development.*execution core is being built/);
  expect(cases.bandup.intro).toMatch(/Adaptive.*remains in research/);
  expect(cases.futureing.result).toMatch(/private prototype/);
 });
 it('keeps the active collection intentional and enriches the remaining published projects',()=>{
  const removed=['asad-math','vision-pulse'];
  expect(contentCatalog.projects.map(p=>p.id).sort()).toEqual(projects.map(p=>p.id).filter(id=>!removed.includes(id)).sort());
  expect(contentCatalog.projects.some(p=>removed.includes(p.id))).toBe(false);
  expect(contentCatalog.projects.filter(p=>p.sources.includes('published'))).toHaveLength(2);
  expect(contentCatalog.projects.find(p=>p.id==='vision-career').summary).toContain('Flutter');
 });
 it('keeps placeholders out of actionable links without dropping old working links',()=>{
  for(const p of contentCatalog.projects)for(const link of p.links){expect(link.href).toMatch(/^https:\/\//);expect(link.label).not.toMatch(/TODO|soon/i);}
  expect(contentCatalog.projects.find(p=>p.id==='vision-career').links.some(l=>l.href.includes('Vision-Career'))).toBe(true);
 });
 it('preserves team attribution, R&D status and source-backed academic details',()=>{
  expect(contentCatalog.projects.find(p=>p.id==='rooms').outcomes[0].scope).toBe('Team award');
  expect(contentCatalog.projects.find(p=>p.id==='bandup').status).toBe('r-and-d');
  expect(contentCatalog.education.institutions[0].academicRecord).toContain('87/100');
  expect(contentCatalog.education.institutions[0].academicRecord).toContain('89/132');
  expect(contentCatalog.learningProgress.completed).toBe(8);
  expect(contentCatalog.learningProgress.total).toBe(12);
 });
 it('retains both contact sources and identifies conflicting fields',()=>{
  expect(contentCatalog.conflicts.some(c=>c.field==='contact.email')).toBe(true);
  expect(contentCatalog.contactEmails).toHaveLength(2);
 });
});
