import { describe,it,expect } from 'vitest';
import { profileContent } from '../src/channel/profile.js';

const channels=['skills','experience','education','certifications','contact'];
describe('Separate physical-channel content',()=>{
 for(const section of channels)it(`${section} mounts only its own content`,()=>{
  const html=profileContent(section);
  expect([...html.matchAll(/id="profile-(skills|experience|education|certifications|contact)"/g)].map(m=>m[1])).toEqual([section]);
  expect(html).not.toContain('class="profile-intro"');
  expect(html.match(/<h1>/g)).toHaveLength(1);
 });
 it('Home contains only the introduction',()=>{
  const html=profileContent();
  expect(html).toContain('class="profile-intro"');
  expect(html).not.toMatch(/id="profile-(skills|experience|education|certifications|contact)"/);
  expect(html).not.toContain('profile-email');
 });
 it('offers a keyboard-addressable skills explorer with linked project evidence',()=>{
  const html=profileContent('skills');
  expect(html).toContain('role="tablist"');
  expect(html.match(/role="tab"/g)).toHaveLength(3);
  expect(html.match(/role="tabpanel"/g)).toHaveLength(3);
  expect(html).toContain('aria-controls="skill-panel-systems"');
  expect(html).toContain('href="#projects/space-day"');
 });
 it('provides searchable supporting records and an email copy action',()=>{
  expect(profileContent('certifications')).toContain('type="search"');
  expect(profileContent('contact')).toContain('data-copy-email');
 });
});
