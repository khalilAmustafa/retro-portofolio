import { describe, it, expect } from 'vitest';
import { createExperienceState, reduceExperience } from '../src/experience/state.js';

describe('Experience navigation', () => {
  it('enters and exits without losing selection', () => {
    let s = reduceExperience(createExperienceState(), { type: 'ENTER' });
    s = reduceExperience(s, { type: 'SELECT', index: 2 });
    expect(s).toMatchObject({ view: 'library', selectedIndex: 2 });
    s = reduceExperience(s, { type: 'EXIT' });
    expect(s.view).toBe('room');
    expect(reduceExperience(s, { type: 'ENTER' }).selectedIndex).toBe(2);
  });
  it('does not open a project from the room', () => {
    expect(reduceExperience(createExperienceState(), { type: 'OPEN' }).view).toBe('room');
  });
  it('clamps selection and uses latest intent rather than queuing', () => {
    let s = reduceExperience(createExperienceState(), { type: 'ENTER' });
    expect(reduceExperience(s, { type: 'SELECT', index: -1 }).selectedIndex).toBe(0);
    expect(reduceExperience(s, { type: 'SELECT', index: 90 }).selectedIndex).toBe(2);
    s = reduceExperience(s, { type: 'SELECT', index: 2 });
    expect(reduceExperience(s, { type: 'SELECT', index: 0 }).selectedIndex).toBe(0);
    expect(reduceExperience(s, { type: 'SELECT', index: NaN })).toEqual(s);
  });
  it('opens current project and closes to the same selection', () => {
    let s = reduceExperience(createExperienceState(), { type: 'ENTER' });
    s = reduceExperience(s, { type: 'SELECT', index: 0 });
    s = reduceExperience(s, { type: 'OPEN' });
    expect(s).toMatchObject({ view: 'project', selectedIndex: 0, projectId: 'space-day' });
    expect(reduceExperience(s, { type: 'CLOSE' })).toMatchObject({ view: 'library', selectedIndex: 0, projectId: null });
  });
  it('opens ROOMS initially, with a cover on either side', () => {
    const s=reduceExperience(createExperienceState(),{type:'ENTER'});
    expect(s.selectedIndex).toBe(1);
    expect(reduceExperience(s,{type:'OPEN'}).projectId).toBe('rooms');
  });
  it('returns from a portfolio channel without losing the project selection',()=>{
    const before={...createExperienceState(),view:'library',selectedIndex:2};
    const channel=reduceExperience(before,{type:'ROUTE',view:'channel',channelId:'skills'});
    expect(channel).toMatchObject({view:'channel',channelId:'skills',selectedIndex:2});
    expect(reduceExperience(channel,{type:'CLOSE'})).toMatchObject({view:'library',channelId:null,selectedIndex:2});
  });
});
