import { describe,it,expect } from 'vitest';
import { deskCameraPose } from '../src/channel/desk-camera.js';
describe('One camera through the desk and screen',()=>{
 it('approaches the same television without changing its target or world height',()=>{
  const wide=deskCameraPose({width:1440,height:1000},0),close=deskCameraPose({width:1440,height:1000},1),half=deskCameraPose({width:1440,height:1000},.5);
  expect(wide.z).toBeGreaterThan(close.z);expect(half.z).toBeGreaterThan(close.z);expect(half.z).toBeLessThan(wide.z);expect(wide.y).toBe(close.y);expect(wide.targetZ).toBe(close.targetZ);
 });
 it('crops toward the actual screen on portrait without stretching hardware',()=>{
  const a=deskCameraPose({width:390,height:844},0),b=deskCameraPose({width:390,height:844},1);expect(a.x).toBeCloseTo(0);expect(b.x).toBe(-.53);expect(a.z).toBeGreaterThan(b.z);
 });
});

