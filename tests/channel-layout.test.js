import { describe,it,expect } from 'vitest';
import * as THREE from 'three';
import { screenRect } from '../src/channel/frame.js';
describe('Content stays within the projected screen and viewport',()=>{
 for(const [width,height]of[[1440,1000],[768,1024],[390,844]])it(`fits ${width}×${height}`,()=>{
  const anchor=new THREE.Object3D();anchor.position.set(-.53,0,.4);anchor.userData.aperture={width:4.3,height:3.2};
  const camera=new THREE.PerspectiveCamera(33,width/height,.1,60);camera.position.set(width<900?-.53:0,0,7.4);camera.lookAt(width<900?-.53:0,0,.4);camera.updateProjectionMatrix();
  const r=screenRect(anchor,camera,width,height);expect(r.x).toBeGreaterThanOrEqual(12);expect(r.y).toBeGreaterThanOrEqual(12);expect(r.x+r.width).toBeLessThanOrEqual(width-11);expect(r.y+r.height).toBeLessThanOrEqual(height-11);expect(r.width).toBeGreaterThan(200);expect(r.height).toBeGreaterThan(200);
 });
});
