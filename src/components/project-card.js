import { escapeHtml, resolveAsset } from '../core/dom.js';
import { badgeClassForTone, renderTagCloud } from './retro-card.js';
import { renderArchitectureSchematic } from './image-gallery.js';

export function renderProjectCard(project, activeFrameIdx = 0) {
  const readyImages = (project.media || []).filter((m) => m.ready && m.type !== 'video');
  const hasVideo = (project.media || []).some((m) => m.ready && m.type === 'video');
  const safeIdx = readyImages.length ? ((activeFrameIdx % readyImages.length) + readyImages.length) % readyImages.length : 0;
  const activeThumb = readyImages[safeIdx] || null;

  return `
    <article class="retro-card project-gallery-card" data-project-card="${escapeHtml(project.id)}">
      <div class="project-card-media-shell">
        <a
          href="#projects/${escapeHtml(project.id)}"
          class="project-card-visual-link"
          data-route="#projects/${escapeHtml(project.id)}"
          aria-label="Open ${escapeHtml(project.title)} case study"
        >
          ${
            activeThumb
              ? `
              <img
                src="${escapeHtml(resolveAsset(activeThumb.src))}"
                alt="${escapeHtml(activeThumb.alt)}"
                loading="lazy"
                class="project-card-thumb"
              >
              <span class="project-card-hover-pill" aria-hidden="true">
                ${hasVideo ? '▶ VIDEO + CASE STUDY →' : 'INSPECT CASE STUDY →'}
              </span>
            `
              : renderArchitectureSchematic(project.architecture, { compact: true })
          }
        </a>

        ${
          readyImages.length > 1
            ? `
          <div class="card-frame-scrubber" role="group" aria-label="Preview ${escapeHtml(project.title)} screenshots">
            <button
              type="button"
              class="card-scrub-arrow"
              data-card-scrub-proj="${escapeHtml(project.id)}"
              data-card-scrub-dir="-1"
              aria-label="Previous screenshot"
            >◀</button>
            <div class="card-scrub-dots">
              ${readyImages
                .map(
                  (_, dotIdx) => `
                <button
                  type="button"
                  class="card-scrub-dot ${dotIdx === safeIdx ? 'is-active' : ''}"
                  data-card-frame-proj="${escapeHtml(project.id)}"
                  data-card-frame-idx="${dotIdx}"
                  aria-label="Preview frame ${dotIdx + 1} of ${readyImages.length}"
                ></button>
              `
                )
                .join('')}
            </div>
            <button
              type="button"
              class="card-scrub-arrow"
              data-card-scrub-proj="${escapeHtml(project.id)}"
              data-card-scrub-dir="1"
              aria-label="Next screenshot"
            >▶</button>
          </div>
        `
            : ''
        }
      </div>

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
