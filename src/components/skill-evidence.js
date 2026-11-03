import { escapeHtml, resolveAsset } from '../core/dom.js';
import { projectsById } from '../data/projects.js';

const SPOTLIGHT_TOOLS = [
  'TypeScript',
  'PostgreSQL',
  'Drizzle ORM',
  'Java',
  'Python',
  'AWS Fundamentals',
  'LLM / Gemini API',
  'COLMAP',
  'Godot Engine'
];

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

function extractProjectFromRoute(route = '') {
  if (!route.startsWith('#projects/')) return null;
  const slug = route.replace('#projects/', '').trim();
  return projectsById[slug] || null;
}

export function renderSkillExplorer(
  groups = [],
  { selectedGroupId = 'all', activeTool = null, expandedCapKey = null, liveOnly = false } = {}
) {
  let visibleGroups =
    selectedGroupId === 'all'
      ? groups
      : groups.filter((group) => group.id === selectedGroupId);

  if (activeTool) {
    visibleGroups = visibleGroups.filter((group) =>
      (group.tools || []).some((t) => t.toLowerCase().includes(activeTool.toLowerCase()))
    );
  }

  return `
    <div class="skill-filter-bar" role="toolbar" aria-label="Filter capabilities by domain">
      <button
        type="button"
        class="filter-chip ${selectedGroupId === 'all' && !liveOnly ? 'is-active' : ''}"
        data-skill-filter="all"
        aria-pressed="${selectedGroupId === 'all' && !liveOnly ? 'true' : 'false'}"
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
      <button
        type="button"
        class="filter-chip filter-chip-accent ${liveOnly ? 'is-active' : ''}"
        data-skill-live-toggle="true"
        aria-pressed="${liveOnly ? 'true' : 'false'}"
      >
        ● LIVE &amp; CERTIFIED ONLY
      </button>
    </div>

    <div class="tool-spotlight-bar" role="toolbar" aria-label="Spotlight specific technology">
      <span class="tool-spotlight-label">SPOTLIGHT TECH:</span>
      <button
        type="button"
        class="course-pill ${!activeTool ? 'is-active' : ''}"
        data-tool-spotlight=""
        aria-pressed="${!activeTool ? 'true' : 'false'}"
      >
        All Stack
      </button>
      ${SPOTLIGHT_TOOLS.map((tool) => {
        const isSelected = activeTool === tool;
        return `
          <button
            type="button"
            class="course-pill ${isSelected ? 'is-active' : ''}"
            data-tool-spotlight="${escapeHtml(tool)}"
            aria-pressed="${isSelected ? 'true' : 'false'}"
          >
            ${escapeHtml(tool)}
          </button>
        `;
      }).join('')}
    </div>

    <div class="skill-groups-stack">
      ${visibleGroups
        .map((group, gIdx) => {
          const linkedProjects = (group.projectIds || [])
            .map((pid) => projectsById[pid])
            .filter(Boolean);

          const capabilitiesToShow = liveOnly
            ? group.capabilities.filter((c) => {
                const st = c.stage.toLowerCase();
                return st.includes('live') || st.includes('certified') || st.includes('active');
              })
            : group.capabilities;

          if (!capabilitiesToShow.length) return '';

          return `
          <section class="retro-card skill-group-card stagger-item stagger-${(gIdx % 5) + 1}" aria-label="${escapeHtml(group.title)}">
            <div class="card-header-row">
              <h2 class="card-title">${escapeHtml(group.title.toUpperCase())}</h2>
              <span class="card-badge">${capabilitiesToShow.length} VERIFIED AREAS</span>
            </div>
            <p class="card-desc">${escapeHtml(group.statement)}</p>

            <div class="tag-cloud">
              ${group.tools
                .map((tool, tIdx) => {
                  const isSpotlit =
                    activeTool && tool.toLowerCase().includes(activeTool.toLowerCase());
                  return `
                  <button
                    type="button"
                    class="tag-pill tag-pill-interactive ${tIdx < 2 || isSpotlit ? 'accent' : ''} ${isSpotlit ? 'is-spotlit' : ''}"
                    data-tool-spotlight="${escapeHtml(isSpotlit ? '' : tool)}"
                    title="Filter capabilities using ${escapeHtml(tool)}"
                  >
                    ${escapeHtml(tool)}
                  </button>
                `;
                })
                .join('')}
            </div>

            <div class="capability-rows">
              ${capabilitiesToShow
                .map((cap, cIdx) => {
                  const capKey = `${group.id}::${cIdx}`;
                  const isExpanded = expandedCapKey === capKey;
                  const proofProj = extractProjectFromRoute(cap.proofRoute);
                  const thumb = (proofProj?.media || []).find((m) => m.ready && m.type !== 'video');

                  return `
                <div class="capability-item-wrap ${isExpanded ? 'is-expanded' : ''}">
                  <div class="capability-item">
                    <button
                      type="button"
                      class="capability-preview-toggle"
                      data-cap-preview="${escapeHtml(capKey)}"
                      aria-expanded="${isExpanded ? 'true' : 'false'}"
                    >
                      <div class="capability-title-line">
                        <strong class="capability-name">${escapeHtml(cap.name)}</strong>
                        <span class="${stageBadgeClass(cap.stage)}">${escapeHtml(cap.stage)}</span>
                      </div>
                      <p class="capability-detail">${escapeHtml(cap.detail)}</p>
                      <span class="capability-peek-cue">${isExpanded ? '▾ Hide Evidence Preview' : '▸ Preview Proof Artifact'}</span>
                    </button>
                    <a
                      href="${escapeHtml(cap.proofRoute)}"
                      class="btn-card-link secondary btn-compact capability-proof-btn"
                      data-route="${escapeHtml(cap.proofRoute)}"
                    >
                      ${escapeHtml(cap.proofLabel)}
                    </a>
                  </div>

                  ${
                    isExpanded
                      ? `
                    <div class="capability-proof-drawer">
                      ${
                        proofProj
                          ? `
                        <div class="cap-drawer-grid">
                          ${
                            thumb
                              ? `<img src="${escapeHtml(resolveAsset(thumb.src))}" alt="${escapeHtml(thumb.alt)}" loading="lazy" class="cap-drawer-thumb">`
                              : `<div class="cap-drawer-blueprint">ARCHITECTURE VERIFIED // ${escapeHtml(proofProj.title)}</div>`
                          }
                          <div class="cap-drawer-info">
                            <span class="channel-eyebrow">EVIDENCE PREVIEW · ${escapeHtml(proofProj.statusLabel)}</span>
                            <strong>${escapeHtml(proofProj.title)}</strong>
                            <p>${escapeHtml(proofProj.summary)}</p>
                            <a href="${escapeHtml(cap.proofRoute)}" class="btn-card-link primary btn-compact" data-route="${escapeHtml(cap.proofRoute)}">
                              Open Full Case Study →
                            </a>
                          </div>
                        </div>
                      `
                          : `
                        <div class="cap-drawer-info">
                          <span class="channel-eyebrow">VERIFIED RECORD</span>
                          <p>${escapeHtml(cap.detail)}</p>
                          <a href="${escapeHtml(cap.proofRoute)}" class="btn-card-link primary btn-compact" data-route="${escapeHtml(cap.proofRoute)}">
                            ${escapeHtml(cap.proofLabel)}
                          </a>
                        </div>
                      `
                      }
                    </div>
                  `
                      : ''
                  }
                </div>
              `;
                })
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
