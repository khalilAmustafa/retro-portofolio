import { escapeHtml } from '../core/dom.js';
import { renderTagCloud } from './retro-card.js';
import { projectsById } from '../data/projects.js';

function stageBadgeClass(stage = '') {
  const normalized = stage.toLowerCase();
  if (normalized.includes('live') || normalized.includes('certified')) {
    return 'card-badge status-live';
  }
  if (normalized.includes('award')) {
    return 'card-badge status-award';
  }
  if (normalized.includes('r&d') || normalized.includes('development')) {
    return 'card-badge status-research';
  }
  return 'card-badge';
}

export function renderSkillExplorer(groups = [], selectedGroupId = 'all') {
  const visibleGroups =
    selectedGroupId === 'all'
      ? groups
      : groups.filter((group) => group.id === selectedGroupId);

  return `
    <div class="skill-filter-bar" role="toolbar" aria-label="Filter capabilities by domain">
      <button
        type="button"
        class="filter-chip ${selectedGroupId === 'all' ? 'is-active' : ''}"
        data-skill-filter="all"
        aria-pressed="${selectedGroupId === 'all' ? 'true' : 'false'}"
      >
        ALL DOMAINS (${groups.length})
      </button>
      ${groups
        .map(
          (group) => `
        <button
          type="button"
          class="filter-chip ${selectedGroupId === group.id ? 'is-active' : ''}"
          data-skill-filter="${escapeHtml(group.id)}"
          aria-pressed="${selectedGroupId === group.id ? 'true' : 'false'}"
        >
          ${escapeHtml(group.shortLabel.toUpperCase())}
        </button>
      `
        )
        .join('')}
    </div>

    <div class="skill-groups-stack">
      ${visibleGroups
        .map((group) => {
          const linkedProjects = (group.projectIds || [])
            .map((pid) => projectsById[pid])
            .filter(Boolean);

          return `
          <section class="retro-card skill-group-card" aria-label="${escapeHtml(group.title)}">
            <div class="card-header-row">
              <h2 class="card-title">${escapeHtml(group.title.toUpperCase())}</h2>
              <span class="card-badge">${group.capabilities.length} VERIFIED AREAS</span>
            </div>
            <p class="card-desc">${escapeHtml(group.statement)}</p>
            ${renderTagCloud(group.tools, { accentCount: 2 })}

            <div class="capability-rows">
              ${group.capabilities
                .map(
                  (cap) => `
                <div class="capability-item">
                  <div class="capability-main">
                    <div class="capability-title-line">
                      <strong class="capability-name">${escapeHtml(cap.name)}</strong>
                      <span class="${stageBadgeClass(cap.stage)}">${escapeHtml(cap.stage)}</span>
                    </div>
                    <p class="capability-detail">${escapeHtml(cap.detail)}</p>
                  </div>
                  <a
                    href="${escapeHtml(cap.proofRoute)}"
                    class="btn-card-link secondary btn-compact capability-proof-btn"
                    data-route="${escapeHtml(cap.proofRoute)}"
                  >
                    ${escapeHtml(cap.proofLabel)}
                  </a>
                </div>
              `
                )
                .join('')}
            </div>

            ${
              linkedProjects.length
                ? `
              <div class="skill-group-footer">
                <span class="skill-proof-caption">BACKED BY PROJECTS:</span>
                <div class="skill-proof-pills">
                  ${linkedProjects
                    .map(
                      (proj) =>
                        `<a href="#projects/${escapeHtml(proj.id)}" class="proof-pill-link" data-route="#projects/${escapeHtml(proj.id)}">${escapeHtml(proj.title)} ↗</a>`
                    )
                    .join('')}
                </div>
              </div>
            `
                : ''
            }
          </section>
        `;
        })
        .join('')}
    </div>
  `;
}
