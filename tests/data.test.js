import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import { profile } from '../src/data/profile.js';
import { evidenceRegistry, evidenceById } from '../src/data/evidence.js';
import { experienceMilestones } from '../src/data/experience.js';
import { educationData } from '../src/data/education.js';
import { skillGroups } from '../src/data/skills.js';
import { projects, projectsById, VALID_PROJECT_STATUSES } from '../src/data/projects.js';
import { credentialsData } from '../src/data/credentials.js';
import { contactsData } from '../src/data/contacts.js';
import { parseHashRoute } from '../src/core/navigation.js';

const validProjectIdSet = new Set(projects.map((p) => p.id));

describe('Portfolio V2 Structured Data Integrity', () => {
  it('maintains unique project IDs and valid statuses', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(projects.filter((p) => p.featured).length).toBeGreaterThanOrEqual(5);

    for (const project of projects) {
      expect(VALID_PROJECT_STATUSES).toContain(project.status);
      expect(project.title.length).toBeGreaterThan(2);
      expect(project.summary.length).toBeGreaterThan(15);
      expect(project.problem.length).toBeGreaterThan(15);
      expect(project.personalRole.length).toBeGreaterThan(15);
      expect(Array.isArray(project.architecture?.nodes)).toBe(true);
      expect(project.architecture.nodes.length).toBeGreaterThanOrEqual(3);
      expect(project.engineeringDecision?.challenge.length).toBeGreaterThan(10);
      expect(project.engineeringDecision?.decision.length).toBeGreaterThan(10);

      for (const link of project.links || []) {
        expect(link.href).toMatch(/^https?:\/\//);
      }
    }
  });

  it('resolves all evidenceId references across profile, experience, education, projects, and credentials', () => {
    const evidenceIds = evidenceRegistry.map((e) => e.id);
    expect(new Set(evidenceIds).size).toBe(evidenceIds.length);

    for (const hl of profile.highlights) {
      if (hl.evidenceId) {
        expect(evidenceById[hl.evidenceId]).toBeDefined();
      }
      const parsed = parseHashRoute(hl.route, validProjectIdSet);
      expect(parsed.isFallback).toBe(false);
    }

    for (const ms of experienceMilestones) {
      for (const eid of ms.evidenceIds || []) {
        expect(evidenceById[eid]).toBeDefined();
      }
      for (const pid of ms.relatedProjectIds || []) {
        expect(projectsById[pid]).toBeDefined();
      }
    }

    for (const inst of educationData.institutions) {
      if (inst.evidenceId) expect(evidenceById[inst.evidenceId]).toBeDefined();
    }

    for (const proj of projects) {
      for (const out of proj.outcomes || []) {
        if (out.evidenceId) expect(evidenceById[out.evidenceId]).toBeDefined();
      }
    }

    expect(evidenceById[credentialsData.featured.evidenceId]).toBeDefined();
    for (const item of credentialsData.honorsAndCompetitions) {
      if (item.evidenceId) expect(evidenceById[item.evidenceId]).toBeDefined();
    }
  });

  it('links every skill capability proof route to a valid channel or project', () => {
    expect(skillGroups.length).toBeGreaterThanOrEqual(4);
    for (const group of skillGroups) {
      for (const pid of group.projectIds) {
        expect(projectsById[pid]).toBeDefined();
      }
      for (const cap of group.capabilities) {
        const parsed = parseHashRoute(cap.proofRoute, validProjectIdSet);
        expect(parsed.isFallback).toBe(false);
      }
    }
  });

  it('enforces Section 3.3 truthfulness guardrails and word budgets', () => {
    const homeWordCount = profile.positioning.trim().split(/\s+/).length;
    expect(homeWordCount).toBeGreaterThanOrEqual(30);
    expect(homeWordCount).toBeLessThanOrEqual(58);

    const serializedData = JSON.stringify({
      profile,
      evidenceRegistry,
      experienceMilestones,
      educationData,
      skillGroups,
      projects,
      credentialsData,
      contactsData
    });

    // Banned unverified claims
    expect(serializedData.toLowerCase()).not.toContain('flawless availability');
    expect(serializedData.toLowerCase()).not.toContain('zero registration downtime');
    expect(serializedData.toLowerCase()).not.toContain('zero downtime');
    expect(serializedData.toLowerCase()).not.toContain('solutions architect');
    expect(serializedData).not.toContain('2013');

    // No self-rated percentages in skills
    const serializedSkills = JSON.stringify(skillGroups);
    expect(serializedSkills).not.toMatch(/\b\d{1,3}%/);

    // Vision must be labeled an interactive companion, not autonomous AI chat
    expect(profile.companion.metaTitle.toUpperCase()).toContain('INTERACTIVE COMPANION');
  });

  it('eliminates inline style attributes across all src JavaScript modules', () => {
    const srcRoot = path.resolve(process.cwd(), 'src');
    const jsFiles = [];

    function walk(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith('.js')) jsFiles.push(full);
      }
    }
    walk(srcRoot);

    expect(jsFiles.length).toBeGreaterThanOrEqual(20);
    for (const file of jsFiles) {
      const source = fs.readFileSync(file, 'utf8');
      expect(source, `Found inline style attribute in ${file}`).not.toContain('style="');
    }
  });
});
