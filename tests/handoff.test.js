import { describe, it, expect } from 'vitest';
import { calculateTvFit, projectTvRect } from '../src/experience/handoff.js';

describe('CRT calibration', () => {
  for (const [width, height] of [[390,844],[768,1024],[1440,900]]) {
    it(`fits the physical set inside ${width}x${height}`, () => {
      const r = calculateTvFit({ width, height }, 1.56, 12);
      expect(r.width).toBeGreaterThan(0);
      expect(r.height).toBeGreaterThan(0);
      expect(r.x).toBeGreaterThanOrEqual(12);
      expect(r.y).toBeGreaterThanOrEqual(12);
      expect(r.x + r.width).toBeLessThanOrEqual(width - 12 + .01);
      expect(r.y + r.height).toBeLessThanOrEqual(height - 12 + .01);
      expect(r.width/r.height).toBeCloseTo(1.56, 4);
    });
  }
  it('matches the actual DOM rectangle at the settled camera distance', () => {
    const r = projectTvRect({ width:1440,height:900 }, { width:6,height:4 }, 8, 42);
    expect(r.x + r.width/2).toBeCloseTo(720);
    expect(r.y + r.height/2).toBeCloseTo(450);
    expect(r.width/r.height).toBeCloseTo(1.5);
  });
});
