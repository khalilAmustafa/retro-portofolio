import { escapeHtml, resolveAsset } from '../core/dom.js';
import { badgeClassForTone } from './retro-card.js';
import { projectsById } from '../data/projects.js';
import { renderEvidenceBadge } from './evidence-link.js';

const SPEC_TABS = [
  { id: 'overview', label: '01 · ROLE & IMPACT' },
  { id: 'decisions', label: '02 · ARCHITECTURE' },
  { id: 'proof', label: '03 · VERIFIED PROOF' },
  { id: 'all', label: 'ALL SPECS' }
];

export function renderTimeline(milestones = [], expandedIds = new Set(), activeTabs = new Map()) {
  if (!milestones.length) {
    return `<div class="retro-card"><p class="card-desc">No milestones match the selected filter.</p></div>`;
  }

  return `
    <div class="timeline-stepper-rail" role="navigation" aria-label="Jump to milestone">
      ${milestones
        .map((m, idx) => {
          const isOpen = expandedIds.has(m.id);
          return `
          <button
            type="button"
            class="timeline-step-pill ${isOpen ? 'is-active' : ''}"
            data-timeline-jump="${escapeHtml(m.id)}"
          >
            <span class="step-pill-num">0${idx + 1}</span>
            <span class="step-pill-text">${escapeHtml(m.badge)}</span>
          </button>
        `;
        })
        .join('')}
    </div>

    <div class="timeline-list" role="list">
      ${milestones
        .map((entry, idx) => {
          const isExpanded = expandedIds.has(entry.id);
          const activeTab = activeTabs.get(entry.id) || 'overview';
          const panelId = `timeline-panel-${entry.id}`;
          const triggerId = `timeline-btn-${entry.id}`;
          const relatedProjects = (entry.relatedProjectIds || [])
            .map((pid) => projectsById[pid])
            .filter(Boolean);

          const showOverview = activeTab === 'overview' || activeTab === 'all';
          const showDecisions = activeTab === 'decisions' || activeTab === 'all';
          const showProof = activeTab === 'proof' || activeTab === 'all';

          return `
          <div
            class="timeline-item stagger-item stagger-${(idx % 5) + 1} ${isExpanded ? 'is-expanded' : ''}"
            role="listitem"
            id="milestone-card-${escapeHtml(entry.id)}"
            data-milestone-id="${escapeHtml(entry.id)}"
          >
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
                <span class="timeline-expand-cue" aria-hidden="true">${isExpanded ? '▾ HIDE DOSSIER' : '▸ OPEN INTERACTIVE DOSSIER'}</span>
              </button>

              <div
                id="${escapeHtml(panelId)}"
                class="timeline-collapse-wrap ${isExpanded ? 'is-open' : ''}"
                role="region"
                aria-labelledby="${escapeHtml(triggerId)}"
              >
                <div class="timeline-collapse-inner">
                  <div class="timeline-details">
                    <div class="dossier-subtabs" role="tablist" aria-label="Milestone breakdown">
                      ${SPEC_TABS.map(
                        (tab) => `
                        <button
                          type="button"
                          role="tab"
                          aria-selected="${activeTab === tab.id ? 'true' : 'false'}"
                          class="dossier-subtab ${activeTab === tab.id ? 'is-active' : ''}"
                          data-milestone-tab="${escapeHtml(entry.id)}"
                          data-tab-key="${escapeHtml(tab.id)}"
                        >
                          ${escapeHtml(tab.label)}
                        </button>
                      `
                      ).join('')}
                    </div>

                    <div class="dossier-tab-stage">
                      ${
                        showOverview
                          ? `
                        <dl class="timeline-spec-grid">
                          <div class="timeline-spec-row">
                            <dt>CONTEXT</dt>
                            <dd>${escapeHtml(entry.context)}</dd>
                          </div>
                          <div class="timeline-spec-row">
                            <dt>MY OWNERSHIP</dt>
                            <dd>${escapeHtml(entry.responsibility)}</dd>
                          </div>
                          <div class="timeline-spec-row">
                            <dt>OUTCOME</dt>
                            <dd>${escapeHtml(entry.result)}</dd>
                          </div>
                        </dl>
                      `
                          : ''
                      }

                      ${
                        showDecisions
                          ? `
                        <div class="decision-highlight-box">
                          <span class="decision-highlight-label">KEY TECHNICAL DECISION</span>
                          <p class="decision-highlight-copy">${escapeHtml(entry.technicalDecisions)}</p>
                        </div>
                      `
                          : ''
                      }

                      ${
                        showProof
                          ? `
                        <div class="timeline-proof-showcase">
                          ${
                            relatedProjects.length
                              ? `
                            <div class="timeline-mini-projects">
                              ${relatedProjects
                                .map((proj) => {
                                  const thumb = (proj.media || []).find((m) => m.ready && m.type !== 'video');
                                  return `
                                <a href="#projects/${escapeHtml(proj.id)}" class="timeline-mini-proj-card" data-route="#projects/${escapeHtml(proj.id)}">
                                  ${
                                    thumb
                                      ? `<img src="${escapeHtml(resolveAsset(thumb.src))}" alt="${escapeHtml(thumb.alt)}" loading="lazy" class="timeline-mini-thumb">`
                                      : `<span class="timeline-mini-blueprint">SYS // ${escapeHtml(proj.title)}</span>`
                                  }
                                  <div class="timeline-mini-meta">
                                    <strong>${escapeHtml(proj.title)}</strong>
                                    <span>Inspect Case Study →</span>
                                  </div>
                                </a>
                              `;
                                })
                                .join('')}
                            </div>
                          `
                              : ''
                          }
                          <div class="timeline-proof-bar">
                            <span class="timeline-proof-label">VERIFIED RECORDS:</span>
                            <div class="timeline-proof-links">
                              ${(entry.evidenceIds || []).map((eid) => renderEvidenceBadge(eid)).join('')}
                            </div>
                          </div>
                        </div>
                      `
                          : ''
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        })
        .join('')}
    </div>
  `;
}
