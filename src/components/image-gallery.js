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
          .map(
            (item, idx) => `
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
                class="media-thumb-img"
              >
              <span class="media-zoom-hint">⤢ INSPECT CAPTURE</span>
            </button>
            ${item.caption ? `<figcaption class="media-caption">${escapeHtml(item.caption)}</figcaption>` : ''}
          </figure>
        `
          )
          .join('')}
      </div>
    `;
  }

  const preparedSlot = mediaItems[0];
  return `
    <div class="media-slot-honest" role="note" aria-label="Authentic artifact slot status">
      <div class="media-slot-header">
        <span class="card-badge">AUTHENTIC ARTIFACT POLICY</span>
        <span class="media-slot-status">SCREENSHOT SLOT PREPARED</span>
      </div>
      <p class="media-slot-copy">
        No AI-generated mock UI screenshots are displayed. Drop an authorized capture into
        <code>public/${escapeHtml(preparedSlot ? preparedSlot.src : `assets/projects/${project.id}/`)}</code>
        and set <code>ready: true</code> in <code>src/data/projects.js</code> to enable zoomable evidence here.
      </p>
      ${preparedSlot?.caption ? `<div class="media-slot-target">${escapeHtml(preparedSlot.caption)}</div>` : ''}
    </div>
  `;
}
