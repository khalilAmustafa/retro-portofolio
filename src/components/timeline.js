import { escapeHtml } from '../core/dom.js';
import { badgeClassForTone } from './retro-card.js';
import { projectsById } from '../data/projects.js';
import { renderEvidenceBadge } from './evidence-link.js';

export function renderTimeline(milestones = [], expandedIds = new Set()) {
  return `
    <div class="timeline-list" role="list">
      ${milestones
        .map((entry) => {
          const isExpanded = expandedIds.has(entry.id);
          const panelId = `timeline-panel-${entry.id}`;
          const triggerId = `timeline-btn-${entry.id}`;
          const relatedProjects = (entry.relatedProjectIds || [])
            .map((pid) => projectsById[pid])
            .filter(Boolean);

          return `
          <section class="timeline-item ${isExpanded ? 'is-expanded' : ''}" role="listitem" data-milestone-id="${escapeHtml(entry.id)}">
            <div class="timeline-rail" aria-hidden="true">
              <span class="timeline-node"></span>
              <span class="timeline-line"></span>
            </div>
            <div class="retro-card timeline-card">
              <button
                type="button"
                id="${escapeHtml(triggerId)}"
                class="timeline-toggle"
                data-timeline-toggle="${escapeHtml(entry.id)}"
                aria-expanded="${isExpanded ? 'true' : 'false'}"
                aria-controls="${escapeHtml(panelId)}"
              >
                <div class="timeline-summary-top">
                  <span class="timeline-period">${escapeHtml(entry.periodLabel)} · ${escapeHtml(entry.location)}</span>
                  <span class="${badgeClassForTone(entry.badgeTone)}">${escapeHtml(entry.badge)}</span>
                </div>
                <h2 class="card-title timeline-title">${escapeHtml(entry.title)}</h2>
                <div class="timeline-org">${escapeHtml(entry.organization)}</div>
                <p class="timeline-one-liner">${escapeHtml(entry.oneLineResult)}</p>
                <span class="timeline-expand-cue" aria-hidden="true">${isExpanded ? '▾ HIDE ENGINEERING DETAILS' : '▸ INSPECT DECISIONS & PROOF'}</span>
              </button>

              <div
                id="${escapeHtml(panelId)}"
                class="timeline-details"
                role="region"
                aria-labelledby="${escapeHtml(triggerId)}"
                ${isExpanded ? '' : 'hidden'}
              >
                <dl class="timeline-spec-grid">
                  <div class="timeline-spec-row">
                    <dt>CONTEXT</dt>
                    <dd>${escapeHtml(entry.context)}</dd>
                  </div>
                  <div class="timeline-spec-row">
                    <dt>RESPONSIBILITY</dt>
                    <dd>${escapeHtml(entry.responsibility)}</dd>
                  </div>
                  <div class="timeline-spec-row">
                    <dt>TECHNICAL DECISIONS</dt>
                    <dd>${escapeHtml(entry.technicalDecisions)}</dd>
                  </div>
                  <div class="timeline-spec-row">
                    <dt>RESULT</dt>
                    <dd>${escapeHtml(entry.result)}</dd>
                  </div>
                </dl>

                ${
                  relatedProjects.length || (entry.evidenceIds && entry.evidenceIds.length)
                    ? `
                  <div class="timeline-proof-bar">
                    <span class="timeline-proof-label">RELATED PROOF:</span>
                    <div class="timeline-proof-links">
                      ${relatedProjects
                        .map(
                          (proj) => `
                        <a href="#projects/${escapeHtml(proj.id)}" class="btn-card-link secondary btn-compact" data-route="#projects/${escapeHtml(proj.id)}">
                          ${escapeHtml(proj.title)} →
                        </a>
                      `
                        )
                        .join('')}
                      ${(entry.evidenceIds || []).map((eid) => renderEvidenceBadge(eid)).join('')}
                    </div>
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          </section>
        `;
        })
        .join('')}
    </div>
  `;
}
