import { escapeHtml, resolveAsset } from '../core/dom.js';
import { PROJECT_FILTERS } from '../data/projects.js';
import { badgeClassForTone, renderTagCloud } from './retro-card.js';
import { renderProjectCard } from './project-card.js';

export function renderProjectGallery({
  allProjects = [],
  activeFilter = 'All',
  unknownProjectId = null
}) {
  const featuredProjects = allProjects.filter((proj) => proj.featured);
  const secondaryProjects = allProjects.filter((proj) => !proj.featured);

  const matchesFilter = (proj) =>
    activeFilter === 'All' || (proj.categories || []).includes(activeFilter);

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
        const isActive = activeFilter === filter.id;
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
    </div>

    <section class="project-gallery-grid" aria-label="Featured engineering case studies">
      ${visibleFeatured.map((proj) => renderProjectCard(proj)).join('')}
    </section>

    ${
      visibleSecondary.length
        ? `
      <section class="secondary-projects-section" aria-label="Additional builds and experiments">
        <div class="secondary-section-header">
          <h2 class="secondary-section-title">MORE BUILDS &amp; EXPERIMENTS</h2>
          <span class="card-badge">ADDITIONAL ARCHIVE</span>
        </div>
        <div class="secondary-projects-list">
          ${visibleSecondary
            .map((proj) => {
              const readyThumb = (proj.media || []).find((m) => m.ready && m.type !== 'video');
              return `
            <article class="retro-card secondary-project-card${readyThumb ? ' has-thumb' : ''}">
              ${
                readyThumb
                  ? `<a href="#projects/${escapeHtml(proj.id)}" class="project-card-visual-link" data-route="#projects/${escapeHtml(proj.id)}" aria-label="Open ${escapeHtml(proj.title)} case study">
                      <img src="${escapeHtml(resolveAsset(readyThumb.src))}" alt="${escapeHtml(readyThumb.alt)}" loading="lazy" class="project-card-thumb">
                    </a>`
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
