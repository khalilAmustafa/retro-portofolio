import { escapeHtml, resolveAsset } from '../core/dom.js';
import { badgeClassForTone, renderTagCloud } from './retro-card.js';
import { renderArchitectureSchematic } from './image-gallery.js';

export function renderProjectCard(project) {
  const readyThumb = (project.media || []).find((m) => m.ready && m.type !== 'video');

  return `
    <article class="retro-card project-gallery-card" data-project-card="${escapeHtml(project.id)}">
      <a
        href="#projects/${escapeHtml(project.id)}"
        class="project-card-visual-link"
        data-route="#projects/${escapeHtml(project.id)}"
        aria-label="Open ${escapeHtml(project.title)} case study"
      >
        ${
          readyThumb
            ? `<img src="${escapeHtml(resolveAsset(readyThumb.src))}" alt="${escapeHtml(readyThumb.alt)}" loading="lazy" class="project-card-thumb">`
            : renderArchitectureSchematic(project.architecture, { compact: true })
        }
      </a>

      <div class="project-card-body">
        <div class="card-header-row">
          <h2 class="card-title">${escapeHtml(project.title)}</h2>
          <span class="${badgeClassForTone(project.statusTone)}">${escapeHtml(project.statusLabel)}</span>
        </div>

        <p class="card-desc project-card-summary">${escapeHtml(project.summary)}</p>

        ${renderTagCloud(project.tech.slice(0, 4), { accentCount: 2 })}

        <div class="card-actions project-card-actions">
          <a
            href="#projects/${escapeHtml(project.id)}"
            class="btn-card-link primary"
            data-route="#projects/${escapeHtml(project.id)}"
          >
            VIEW CASE STUDY →
          </a>
          ${(project.links || [])
            .slice(0, 1)
            .map(
              (link) => `
            <a
              href="${escapeHtml(link.href)}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-card-link secondary"
            >
              ${escapeHtml(link.label)}
            </a>
          `
            )
            .join('')}
        </div>
      </div>
    </article>
  `;
}
