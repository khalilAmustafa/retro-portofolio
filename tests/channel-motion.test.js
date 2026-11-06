import { describe,it,expect } from 'vitest';
import { advanceSpring,createMotion,moveWheel,dragMotion,snapMotion } from '../src/channel/motion.js';
describe('Spatial content motion',()=>{
 it('settles consistently at 60 and 144Hz',()=>{
  const simulate=rate=>{let s={...createMotion(0,10),target:7};for(let i=0;i<rate;i++)s=advanceSpring(s,1/rate);return s.value;};
  expect(simulate(60)).toBeCloseTo(7,3);expect(simulate(144)).toBeCloseTo(simulate(60),5);
 });
 it('accumulates wheel intent and reverses immediately from the visible position',()=>{
  let s=createMotion(5,10);s=moveWheel(s,100);s=moveWheel(s,100);expect(s.target).toBeGreaterThan(5.4);
  s={...s,value:5.1};s=moveWheel(s,-100);expect(s.target).toBeLessThan(s.value);
 });
 it('moves in the new wheel direction on the very next frame',()=>{
  let s={...createMotion(4.3035,10),target:5,velocity:5.696,direction:1};
  s=moveWheel(s,-10);expect(advanceSpring(s,1/60).value).toBeLessThan(s.value);
 });
 it('tracks drags directly, clamps and snaps to a valid entry',()=>{
  let s=dragMotion(createMotion(0,10),3.7);expect(s.value).toBe(3.7);expect(s.velocity).toBe(0);
  expect(snapMotion(s).target).toBe(4);expect(dragMotion(s,99).value).toBe(10);
 });
});
