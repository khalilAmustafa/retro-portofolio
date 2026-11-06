import { describe,it,expect } from 'vitest';
import { advanceGlide,dragVelocity,releaseVelocity } from '../src/channel/globe-motion.js';
describe('Globe momentum',()=>{
 it('continues in the release direction and slows naturally',()=>{
  const start={value:0,velocity:2};const after=advanceGlide(start,.1);expect(after.value).toBeGreaterThan(0);expect(after.velocity).toBeGreaterThan(0);expect(after.velocity).toBeLessThan(2);
  let state=start;for(let i=0;i<180;i++)state=advanceGlide(state,1/60);expect(state.velocity).toBe(0);expect(state.value).toBeLessThan(.6);
 });
 it('travels the same distance at 60 and 144Hz',()=>{
  const simulate=rate=>{let s={value:0,velocity:3};for(let i=0;i<rate;i++)s=advanceGlide(s,1/rate);return s.value;};expect(simulate(60)).toBeCloseTo(simulate(144),5);
 });
 it('uses recent drag speed, and a held release does not launch stale momentum',()=>{
  expect(dragVelocity(0,.1,.02)).toBeGreaterThan(1);expect(releaseVelocity(3,.01)).toBeGreaterThan(1);expect(releaseVelocity(3,.2)).toBe(0);
 });
 it('stops vertical momentum at a pitch limit',()=>{
  const state=advanceGlide({value:.89,velocity:3},.1,{min:-.9,max:.9});expect(state.value).toBe(.9);expect(state.velocity).toBe(0);
 });
});
