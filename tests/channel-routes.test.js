import { describe,it,expect } from 'vitest';
import { resolveChannelRoute } from '../src/channel/routes.js';
import { channelProjectsById } from '../src/channel/content.js';
const route=hash=>resolveChannelRoute(hash,channelProjectsById);
describe('Current CRT navigation',()=>{
 it('keeps every active case study and recovers removed or malformed routes',()=>{
  for(const id of Object.keys(channelProjectsById))expect(route(`#projects/${id}`)).toEqual({view:'case',projectId:id});
  for(const hash of ['#projects/asad-math','#projects/vision-pulse','#projects/missing','#projects/%E0%A4%A','#projects/__proto__'])expect(route(hash)).toEqual({view:'work'});
 });
 it('opens the selected academic institution without changing the original education route',()=>{
  expect(route('#education')).toEqual({view:'profile',section:'education'});
  expect(route('#education/valencia')).toEqual({view:'profile',section:'education',school:'valencia'});
  expect(route('#education/amman')).toEqual({view:'profile',section:'education',school:'amman'});
 });
 it('preserves the existing section aliases and desk routes',()=>{
  expect(route('#credentials')).toEqual({view:'profile',section:'certifications'});
  expect(route('#about')).toEqual({view:'profile',section:'experience'});
  expect(route('#atlas')).toEqual({view:'atlas'});
  expect(route('#room')).toEqual({view:'work'});
 });
});
