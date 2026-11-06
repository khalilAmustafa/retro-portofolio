import { describe,it,expect } from 'vitest';
import * as THREE from 'three';
import { createTvModel } from '../src/experience/tv-model.js';
describe('Original CRT model',()=>{
  it('places the readable screen inside the cabinet and leaves a real frame opening',()=>{
    const tv=createTvModel();tv.root.updateMatrixWorld(true);
    const bounds=new THREE.Box3().setFromObject(tv.root);
    const screen=new THREE.Box3().setFromObject(tv.screenSurface);
    expect(screen.min.x).toBeGreaterThan(bounds.min.x);
    expect(screen.max.x).toBeLessThan(bounds.max.x);
    expect(screen.min.y).toBeGreaterThan(bounds.min.y);
    expect(screen.max.y).toBeLessThan(bounds.max.y);
    expect(tv.root.getObjectByName('bezel-ring').geometry.parameters.shapes.holes.length).toBe(1);
    tv.dispose();
  });
  it('exposes seven distinct original channel controls, volume and power',()=>{
    const tv=createTvModel();
    expect(tv.controls.size).toBe(10);
    expect(new Set([...tv.controls.values()]).size).toBe(10);
    expect(tv.controls.has('power')).toBe(true);
    expect(tv.controls.has('volume')).toBe(true);
    expect(tv.controls.has('channel-projects')).toBe(true);
    tv.dispose();
  });
  it('clamps dial selection and activates the corresponding physical button',()=>{
    const tv=createTvModel();tv.setSelection(4);
    expect(tv.root.getObjectByName('led-projects').material.emissiveIntensity).toBeGreaterThan(0);
    expect(tv.root.getObjectByName('led-home').material.emissiveIntensity).toBe(0);
    const angle=tv.root.getObjectByName('channel-grip').rotation.z;
    tv.setSelection(100);expect(tv.root.getObjectByName('led-contact').material.emissiveIntensity).toBeGreaterThan(0);
    tv.setSelection(-1);expect(tv.root.getObjectByName('led-home').material.emissiveIntensity).toBeGreaterThan(0);
    expect(tv.root.getObjectByName('channel-grip').rotation.z).not.toBe(angle);tv.dispose();
  });
  it('leaves caller-owned screen textures alive on disposal',()=>{
    const tv=createTvModel(),texture=new THREE.Texture();let disposed=false;
    texture.addEventListener('dispose',()=>disposed=true);tv.setScreenTexture(texture);tv.dispose();
    expect(disposed).toBe(false);texture.dispose();
  });
});
