import { describe,it,expect } from 'vitest';
import { deskCameraPose } from '../src/channel/desk-camera.js';
describe('One camera through the desk and screen',()=>{
 it('approaches the same television without changing its target or world height',()=>{
  const wide=deskCameraPose({width:1440,height:1000},0),close=deskCameraPose({width:1440,height:1000},1),half=deskCameraPose({width:1440,height:1000},.5);
  expect(wide.z).toBeGreaterThan(close.z);expect(half.z).toBeGreaterThan(close.z);expect(half.z).toBeLessThan(wide.z);expect(wide.y).toBe(close.y);expect(wide.targetZ).toBe(close.targetZ);
 });
 it('keeps the complete television and right controls visible on portrait',()=>{
  for(const [width,height]of[[390,844],[768,1024]]){
   const a=deskCameraPose({width,height},0),b=deskCameraPose({width,height},1),halfWidth=(b.z-b.targetZ)*Math.tan(b.fov*Math.PI/360)*width/height;
   expect(a.x).toBeCloseTo(0);expect(b.x).toBe(0);expect(a.z).toBeGreaterThan(b.z);expect(halfWidth).toBeGreaterThan(3);
  }
 });
});

