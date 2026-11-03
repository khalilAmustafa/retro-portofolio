import { escapeHtml } from '../core/dom.js';
import { badgeClassForTone, renderTagCloud } from './retro-card.js';
import { renderArchitectureSchematic, renderProjectMediaSection } from './image-gallery.js';
import { renderEvidenceBadge } from './evidence-link.js';

export function renderProjectDetail({ project, allProjects = [] }) {
  const idx = allProjects.findIndex((item) => item.id === project.id);
  const prevProject = idx > 0 ? allProjects[idx - 1] : allProjects[allProjects.length - 1];
  const nextProject = idx >= 0 && idx < allProjects.length - 1 ? allProjects[idx + 1] : allProjects[0];

  return `
    <div class="case-study-view" data-case-study="${escapeHtml(project.id)}">
      <nav class="case-study-topbar" aria-label="Case study navigation">
        <a href="#projects" class="btn-back-home" data-route="#projects">◀ Back to All Projects</a>
        <span class="case-study-crumb">CH 05 // CASE STUDY</span>
      </nav>

      <header class="retro-card case-study-hero">
        <div class="card-header-row">
          <div>
            <span class="channel-eyebrow">PROJECT DOSSIER · ${escapeHtml(project.status.toUpperCase())}</span>
            <h1 class="channel-main-title case-study-title">${escapeHtml(project.title)}</h1>
          </div>
          <span class="${badgeClassForTone(project.statusTone)}">${escapeHtml(project.statusLabel)}</span>
        </div>

        <p class="case-study-lead">${escapeHtml(project.summary)}</p>

        ${renderTagCloud(project.tech, { accentCount: 2 })}

        ${
          project.links && project.links.length
            ? `
          <div class="card-actions">
            ${project.links
              .map(
                (link, linkIdx) => `
              <a
                href="${escapeHtml(link.href)}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-card-link ${linkIdx === 0 ? 'primary' : 'secondary'}"
              >
                ${escapeHtml(link.label)}
              </a>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }
      </header>

      <div class="case-study-two-col">
        <section class="retro-card case-study-panel" aria-label="Problem statement">
          <h2 class="skill-category-title">01 // THE PROBLEM</h2>
          <p class="card-desc case-study-body">${escapeHtml(project.problem)}</p>
        </section>

        <section class="retro-card case-study-panel" aria-label="Personal engineering role">
          <h2 class="skill-category-title">02 // MY CONTRIBUTION &amp; SCOPE</h2>
          <p class="card-desc case-study-body"><strong>My Role:</strong> ${escapeHtml(project.personalRole)}</p>
          ${
            project.teamOrEventContext
              ? `<p class="card-desc case-study-note"><strong>Context / Attribution:</strong> ${escapeHtml(project.teamOrEventContext)}</p>`
              : ''
          }
        </section>
      </div>

      <section class="retro-card case-study-panel" aria-label="System architecture">
        <h2 class="skill-category-title">03 // SYSTEM ARCHITECTURE</h2>
        ${renderArchitectureSchematic(project.architecture, { compact: false })}
      </section>

      ${
        project.engineeringDecision
          ? `
        <section class="retro-card case-study-panel" aria-label="Engineering challenge and tradeoff">
          <h2 class="skill-category-title">04 // ENGINEERING CHALLENGE &amp; TRADEOFF</h2>
          <dl class="timeline-spec-grid">
            <div class="timeline-spec-row">
              <dt>CHALLENGE</dt>
              <dd>${escapeHtml(project.engineeringDecision.challenge)}</dd>
            </div>
            <div class="timeline-spec-row">
              <dt>OPTIONS</dt>
              <dd>${escapeHtml(project.engineeringDecision.options)}</dd>
            </div>
            <div class="timeline-spec-row">
              <dt>DECISION</dt>
              <dd>${escapeHtml(project.engineeringDecision.decision)}</dd>
            </div>
            <div class="timeline-spec-row">
              <dt>OUTCOME</dt>
              <dd>${escapeHtml(project.engineeringDecision.outcome)}</dd>
            </div>
          </dl>
        </section>
      `
          : ''
      }

      <section class="retro-card case-study-panel" aria-label="Results and visual artifacts">
        <h2 class="skill-category-title">05 // RESULT, EVIDENCE &amp; MEDIA</h2>
        ${(project.outcomes || [])
          .map(
            (outcome) => `
          <div class="metric-callout case-outcome-callout">
            <span class="metric-stat">${escapeHtml(outcome.scope.toUpperCase())}</span>
            <span class="metric-label">${escapeHtml(outcome.text)}</span>
          </div>
          <div class="case-evidence-row">
            ${renderEvidenceBadge(outcome.evidenceId)}
          </div>
        `
          )
          .join('')}

        ${renderProjectMediaSection(project)}
      </section>

      <nav class="channel-footer-nav case-study-bottom-nav" aria-label="Neighboring case studies">
        <a href="#projects" class="btn-back-home" data-route="#projects">◀ Back to Projects</a>
        <div class="case-study-neighbors">
          ${
            prevProject && prevProject.id !== project.id
              ? `<a href="#projects/${escapeHtml(prevProject.id)}" class="btn-card-link secondary btn-compact" data-route="#projects/${escapeHtml(prevProject.id)}">← ${escapeHtml(prevProject.title)}</a>`
              : ''
          }
          ${
            nextProject && nextProject.id !== project.id
              ? `<a href="#projects/${escapeHtml(nextProject.id)}" class="btn-card-link primary btn-compact" data-route="#projects/${escapeHtml(nextProject.id)}">Next: ${escapeHtml(nextProject.title)} →</a>`
              : ''
          }
        </div>
      </nav>
    </div>
  `;
}
