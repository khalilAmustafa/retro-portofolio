import { describe, it, expect } from 'vitest';
import { resolveExperienceRoute } from '../src/experience/routes.js';
const ids = ['rooms','space-day','bandup','happensbefore'];
describe('Experience routes', () => {
  it('bypasses entry for project deep links', () => {
    expect(resolveExperienceRoute('#projects/bandup', ids)).toMatchObject({view:'project',projectId:'bandup'});
    expect(resolveExperienceRoute('#projects', ids)).toMatchObject({view:'library'});
    expect(resolveExperienceRoute('', ids)).toMatchObject({view:'room'});
  });
  it('recovers unknown and malformed project IDs', () => {
    expect(resolveExperienceRoute('#projects/%E0%A4%A', ids).view).toBe('library');
    expect(resolveExperienceRoute('#projects/missing', ids).view).toBe('library');
  });
  it('opens original channels and every known project inside the CRT', () => {
    expect(resolveExperienceRoute('#education',ids)).toMatchObject({view:'channel',channelId:'education',legacyHash:null});
    expect(resolveExperienceRoute('#projects/happensbefore',ids)).toMatchObject({view:'project',projectId:'happensbefore',legacyHash:null});
    expect(resolveExperienceRoute('#about',ids)).toMatchObject({view:'channel',channelId:'experience'});
  });
});
