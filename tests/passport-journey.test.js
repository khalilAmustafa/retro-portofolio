import { describe,it,expect } from 'vitest';
import { createPassportState,scanStation,nextStation } from '../src/experience/passport-state.js';
describe('Interactive passport explanation',()=>{
 it('rejects an expired illustrative token without awarding a stamp',()=>{
  const state=scanStation({...createPassportState(),scenario:'expired'});
  expect(state.stamps).toEqual([]);expect(state.result).toBe('expired');
 });
 it('makes repeat scans idempotent',()=>{
  const once=scanStation(createPassportState()),twice=scanStation(once);
  expect(twice.stamps).toEqual([0]);expect(twice.result).toBe('duplicate');
 });
 it('unlocks the illustrative certificate only when all sample stations are stamped',()=>{
  let s=createPassportState();expect(s.complete).toBe(false);
  for(let i=0;i<3;i++){s=scanStation(s);if(i<2)s=nextStation(s);}
  expect(s.complete).toBe(true);expect(s.stamps).toHaveLength(3);
  expect(scanStation(s).stamps).toHaveLength(3);
 });
});
