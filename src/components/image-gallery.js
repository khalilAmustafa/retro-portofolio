import { escapeHtml, resolveAsset } from '../core/dom.js';

export function renderArchitectureSchematic(architecture, { compact = false } = {}) {
  if (!architecture || !Array.isArray(architecture.nodes) || !architecture.nodes.length) {
    return '';
  }

  if (compact) {
    return `
      <div class="arch-preview-strip" aria-hidden="true">
        <div class="arch-preview-eyebrow">SYSTEM DATAFLOW // ${escapeHtml(architecture.title)}</div>
        <div class="arch-preview-nodes">
          ${architecture.nodes
            .slice(0, 4)
            .map(
              (node, idx) => `
            <span class="arch-mini-node">
              <i class="arch-mini-step">0${idx + 1}</i>
              <span class="arch-mini-text">${escapeHtml(node.stage)}</span>
            </span>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="architecture-box">
      <div class="architecture-box-header">
        <span class="architecture-label">ARCHITECTURE // ${escapeHtml(architecture.title)}</span>
      </div>
      <ol class="architecture-flow">
        ${architecture.nodes
          .map(
            (node, idx) => `
          <li class="architecture-node">
            <span class="architecture-step">0${idx + 1}</span>
            <strong class="architecture-stage">${escapeHtml(node.stage)}</strong>
            <span class="architecture-detail">${escapeHtml(node.detail)}</span>
          </li>
        `
          )
          .join('')}
      </ol>
      ${architecture.summary ? `<p class="architecture-summary">${escapeHtml(architecture.summary)}</p>` : ''}
    </div>
  `;
}

export function renderProjectMediaSection(project) {
  const mediaItems = Array.isArray(project.media) ? project.media : [];
  const readyItems = mediaItems.filter((item) => item.ready);

  if (readyItems.length > 0) {
    return `
      <div class="media-gallery-grid">
        ${readyItems
          .map((item, idx) => {
            if (item.type === 'video') {
              return `
          <figure class="media-figure media-figure-video">
            <div class="media-video-frame">
              <video
                class="media-video-player"
                controls
                playsinline
                preload="metadata"
                ${item.poster ? `poster="${escapeHtml(resolveAsset(item.poster))}"` : ''}
                aria-label="${escapeHtml(item.alt || project.title + ' demo video')}"
              >
                <source src="${escapeHtml(resolveAsset(item.src))}" type="video/mp4">
              </video>
            </div>
            ${
              item.caption || item.creditHref
                ? `<figcaption class="media-caption">
                    ${item.caption ? escapeHtml(item.caption) : ''}
                    ${
                      item.creditHref
                        ? ` · <a href="${escapeHtml(item.creditHref)}" target="_blank" rel="noopener noreferrer" class="proof-pill-link">${escapeHtml(item.creditLabel || 'Source ↗')}</a>`
                        : ''
                    }
                  </figcaption>`
                : ''
            }
          </figure>
              `;
            }

            return `
          <figure class="media-figure">
            <button
              type="button"
              class="media-zoom-btn"
              data-lightbox-src="${escapeHtml(resolveAsset(item.src))}"
              data-lightbox-alt="${escapeHtml(item.alt)}"
              data-lightbox-caption="${escapeHtml(item.caption || item.alt)}"
              aria-label="Enlarge screenshot ${idx + 1}: ${escapeHtml(item.alt)}"
            >
              <img
                src="${escapeHtml(resolveAsset(item.src))}"
                alt="${escapeHtml(item.alt)}"
                loading="lazy"
                class="media-thumb-img${item.isPortrait ? ' is-portrait' : ''}"
              >
              <span class="media-zoom-hint">⤢ INSPECT CAPTURE</span>
            </button>
            ${item.caption ? `<figcaption class="media-caption">${escapeHtml(item.caption)}</figcaption>` : ''}
          </figure>
        `;
          })
          .join('')}
      </div>
    `;
  }

  const preparedSlot = mediaItems[0];
  return `
    <div class="media-slot-honest" role="note" aria-label="In-development artifact notice">
      <div class="media-slot-header">
        <span class="card-badge status-research">IN ACTIVE DEVELOPMENT</span>
        <span class="media-slot-status">CLI &amp; TRACE ENGINE UNDERWAY</span>
      </div>
      <p class="media-slot-copy">
        Core requirements and causal graph design are currently in progress. Real CLI execution traces will be published once Milestone 1 lands — no synthetic UI mockups are shown.
      </p>
      ${preparedSlot?.caption ? `<div class="media-slot-target">${escapeHtml(preparedSlot.caption)}</div>` : ''}
    </div>
  `;
}
