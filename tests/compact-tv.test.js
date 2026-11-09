import { describe,it,expect } from 'vitest';
import * as THREE from 'three';
import {createTvModel} from '../src/experience/tv-model.js';
import {deskCameraPose} from '../src/channel/desk-camera.js';
import {screenRect} from '../src/channel/frame.js';

describe('Portrait physical television',()=>{
 it.each([[390,844],[360,640]])('keeps readable content and separate touch controls at %ix%i',(width,height)=>{
  const tv=createTvModel();tv.setPortraitLayout(1);
  const pose=deskCameraPose({width,height},1),camera=new THREE.PerspectiveCamera(pose.fov,width/height,.1,70);
  tv.root.position.set(0,pose.y,.55);camera.position.set(pose.x,pose.y,pose.z);camera.lookAt(pose.x,pose.y,pose.targetZ);camera.updateMatrixWorld();tv.root.updateMatrixWorld(true);
  const rect=screenRect(tv.screenAnchor,camera,width,height);
  expect(rect.height).toBeGreaterThan(330);
  const boxes=[...tv.controls].filter(([id])=>id.startsWith('channel-')).map(([,o])=>{
   const b=new THREE.Box3().setFromObject(o),a=b.min.clone().project(camera),z=b.max.clone().project(camera);
   return {height:Math.abs(z.y-a.y)*height/2,top:(1-z.y)*height/2,bottom:(1-a.y)*height/2};
  });
  for(const b of boxes)expect(b.height).toBeGreaterThanOrEqual(44);
  for(let i=1;i<boxes.length;i++)expect(boxes[i].top).toBeGreaterThan(boxes[i-1].bottom);
  for(const id of ['power','dial']){
   const bounds=new THREE.Box3().setFromObject(tv.controls.get(id)),a=bounds.min.clone().project(camera),b=bounds.max.clone().project(camera);
   expect(Math.abs(b.x-a.x)*width/2).toBeGreaterThanOrEqual(44);
   expect(Math.abs(b.y-a.y)*height/2).toBeGreaterThanOrEqual(44);
  }
  tv.setPortraitLayout(0);expect(tv.root.scale.y).toBe(1);tv.dispose();
 });
});
