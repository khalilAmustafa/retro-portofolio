import { escapeHtml, resolveAsset } from '../core/dom.js';
import { PROJECT_FILTERS } from '../data/projects.js';
import { badgeClassForTone, renderTagCloud } from './retro-card.js';
import { renderProjectCard } from './project-card.js';

export function renderProjectGallery({
  allProjects = [],
  activeFilter = 'All',
  liveOnly = false,
  cardFrames = new Map(),
  unknownProjectId = null
}) {
  const featuredProjects = allProjects.filter((proj) => proj.featured);
  const secondaryProjects = allProjects.filter((proj) => !proj.featured);

  const matchesFilter = (proj) => {
    const catMatch = activeFilter === 'All' || (proj.categories || []).includes(activeFilter);
    const liveMatch = !liveOnly || (proj.links || []).length > 0;
    return catMatch && liveMatch;
  };

  const visibleFeatured = featuredProjects.filter(matchesFilter);
  const visibleSecondary = secondaryProjects.filter(matchesFilter);

  return `
    ${
      unknownProjectId
        ? `
      <div class="retro-alert" role="alert">
        <strong>SIGNAL NOTICE:</strong> No case study matched <code>#projects/${escapeHtml(unknownProjectId)}</code>. Showing verified project directory below.
      </div>
    `
        : ''
    }

    <div class="project-filter-bar" role="toolbar" aria-label="Filter projects by category">
      ${PROJECT_FILTERS.map((filter) => {
        const count =
          filter.id === 'All'
            ? featuredProjects.length
            : featuredProjects.filter((p) => (p.categories || []).includes(filter.id)).length;
        const isActive = activeFilter === filter.id && !liveOnly;
        return `
          <button
            type="button"
            class="filter-chip ${isActive ? 'is-active' : ''}"
            data-project-filter="${escapeHtml(filter.id)}"
            aria-pressed="${isActive ? 'true' : 'false'}"
          >
            ${escapeHtml(filter.label)} (${count})
          </button>
        `;
      }).join('')}
      <button
        type="button"
        class="filter-chip filter-chip-accent ${liveOnly ? 'is-active' : ''}"
        data-project-live-only="true"
        aria-pressed="${liveOnly ? 'true' : 'false'}"
      >
        ● WITH PUBLIC LINKS
      </button>
    </div>

    <section class="project-gallery-grid" aria-label="Featured engineering case studies">
      ${visibleFeatured
        .map((proj) => renderProjectCard(proj, cardFrames.get(proj.id) || 0))
        .join('')}
    </section>

    ${
      visibleSecondary.length
        ? `
      <section class="secondary-projects-section" aria-label="Additional builds and experiments">
        <div class="secondary-section-header">
          <h2 class="secondary-section-title">MORE BUILDS &amp; EXPERIMENTS</h2>
          <span class="card-badge">ADDITIONAL ARCHIVE (${visibleSecondary.length})</span>
        </div>
        <div class="secondary-projects-list">
          ${visibleSecondary
            .map((proj, idx) => {
              const readyImages = (proj.media || []).filter((m) => m.ready && m.type !== 'video');
              const frameIdx = readyImages.length
                ? ((cardFrames.get(proj.id) || 0) % readyImages.length + readyImages.length) %
                  readyImages.length
                : 0;
              const readyThumb = readyImages[frameIdx] || null;

              return `
            <article class="retro-card secondary-project-card stagger-item stagger-${(idx % 5) + 1}${readyThumb ? ' has-thumb' : ''}" data-project-card="${escapeHtml(proj.id)}">
              ${
                readyThumb
                  ? `
                <div class="project-card-media-shell">
                  <a href="#projects/${escapeHtml(proj.id)}" class="project-card-visual-link" data-route="#projects/${escapeHtml(proj.id)}" aria-label="Open ${escapeHtml(proj.title)} case study">
                    <img src="${escapeHtml(resolveAsset(readyThumb.src))}" alt="${escapeHtml(readyThumb.alt)}" loading="lazy" class="project-card-thumb">
                    <span class="project-card-hover-pill" aria-hidden="true">INSPECT →</span>
                  </a>
                  ${
                    readyImages.length > 1
                      ? `
                    <div class="card-frame-scrubber" role="group" aria-label="Preview ${escapeHtml(proj.title)} screenshots">
                      <button type="button" class="card-scrub-arrow" data-card-scrub-proj="${escapeHtml(proj.id)}" data-card-scrub-dir="-1" aria-label="Previous screenshot">◀</button>
                      <div class="card-scrub-dots">
                        ${readyImages
                          .map(
                            (_, dIdx) => `
                          <button type="button" class="card-scrub-dot ${dIdx === frameIdx ? 'is-active' : ''}" data-card-frame-proj="${escapeHtml(proj.id)}" data-card-frame-idx="${dIdx}" aria-label="Frame ${dIdx + 1}"></button>
                        `
                          )
                          .join('')}
                      </div>
                      <button type="button" class="card-scrub-arrow" data-card-scrub-proj="${escapeHtml(proj.id)}" data-card-scrub-dir="1" aria-label="Next screenshot">▶</button>
                    </div>
                  `
                      : ''
                  }
                </div>
              `
                  : ''
              }
              <div class="${readyThumb ? 'secondary-card-body' : ''}">
                <div class="card-header-row">
                  <h3 class="card-title">${escapeHtml(proj.title)}</h3>
                  <span class="${badgeClassForTone(proj.statusTone)}">${escapeHtml(proj.statusLabel)}</span>
                </div>
                <p class="card-desc">${escapeHtml(proj.summary)}</p>
                ${renderTagCloud(proj.tech, { accentCount: 1 })}
                <div class="card-actions">
                  <a href="#projects/${escapeHtml(proj.id)}" class="btn-card-link secondary btn-compact" data-route="#projects/${escapeHtml(proj.id)}">
                    INSPECT DETAILS →
                  </a>
                  ${(proj.links || [])
                    .map(
                      (link) => `
                    <a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer" class="btn-card-link primary btn-compact">
                      ${escapeHtml(link.label)}
                    </a>
                  `
                    )
                    .join('')}
                </div>
              </div>
            </article>
          `;
            })
            .join('')}
        </div>
      </section>
    `
        : ''
    }
  `;
}
