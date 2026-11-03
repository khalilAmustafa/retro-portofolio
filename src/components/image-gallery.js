import { escapeHtml, resolveAsset } from '../core/dom.js';

export function renderArchitectureSchematic(
  architecture,
  { compact = false, activeStepIdx = 0 } = {}
) {
  if (!architecture || !Array.isArray(architecture.nodes)) return '';

  if (compact) {
    return `
      <div class="arch-preview-strip" aria-hidden="true">
        <div class="arch-preview-eyebrow">SYSTEM PIPELINE · ${architecture.nodes.length} STAGES</div>
        <div class="arch-preview-nodes">
          ${architecture.nodes
            .slice(0, 4)
            .map(
              (node, idx) => `
            <span class="arch-mini-node">
              <em class="arch-mini-step">0${idx + 1}</em>
              <span class="arch-mini-text">${escapeHtml(node.stage)}</span>
            </span>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  const safeIdx = Math.max(0, Math.min(architecture.nodes.length - 1, activeStepIdx));
  const activeNode = architecture.nodes[safeIdx];

  return `
    <div class="architecture-box" data-arch-box="true">
      <div class="architecture-box-header architecture-interactive-header">
        <span class="architecture-label">INTERACTIVE PIPELINE · CLICK A STAGE OR SIMULATE</span>
        <button type="button" class="btn-card-link primary btn-compact" data-arch-simulate="true">
          ▶ TRACE SIGNAL FLOW
        </button>
      </div>
      <div class="architecture-flow" role="tablist" aria-label="Interactive architecture stages">
        ${architecture.nodes
          .map(
            (node, idx) => `
          <button
            type="button"
            role="tab"
            aria-selected="${idx === safeIdx ? 'true' : 'false'}"
            class="architecture-node arch-node-interactive ${idx === safeIdx ? 'is-active-stage' : ''}"
            data-arch-step="${idx}"
          >
            <span class="architecture-step">STAGE 0${idx + 1}</span>
            <strong class="architecture-stage">${escapeHtml(node.stage)}</strong>
            <span class="architecture-detail">${escapeHtml(node.detail)}</span>
          </button>
        `
          )
          .join('')}
      </div>
      ${
        activeNode
          ? `
        <div class="arch-stage-readout" id="arch-stage-readout" aria-live="polite">
          <span class="arch-readout-badge">ACTIVE STAGE 0${safeIdx + 1} // ${escapeHtml(activeNode.stage.toUpperCase())}</span>
          <p class="arch-readout-detail">${escapeHtml(activeNode.detail)}</p>
        </div>
      `
          : ''
      }
      ${
        architecture.summary
          ? `<p class="architecture-summary">${escapeHtml(architecture.summary)}</p>`
          : ''
      }
    </div>
  `;
}

export function renderProjectMediaSection(project, { activeMediaIdx = null } = {}) {
  const mediaItems = project.media || [];
  const readyItems = mediaItems.filter((item) => item.ready);

  if (readyItems.length > 0) {
    const defaultIdx = Math.max(0, readyItems.findIndex((m) => m.type === 'video'));
    const rawIdx = activeMediaIdx === null || activeMediaIdx === undefined ? defaultIdx : activeMediaIdx;
    const safeIdx = ((rawIdx % readyItems.length) + readyItems.length) % readyItems.length;
    const currentItem = readyItems[safeIdx];

    return `
      <div class="interactive-media-showcase" data-project-media="${escapeHtml(project.id)}">
        <div class="media-stage-main">
          ${
            currentItem.type === 'video'
              ? `
            <figure class="media-figure media-figure-video">
              <div class="media-video-frame">
                <video
                  class="media-video-player"
                  controls
                  playsinline
                  preload="metadata"
                  ${currentItem.poster ? `poster="${escapeHtml(resolveAsset(currentItem.poster))}"` : ''}
                  aria-label="${escapeHtml(currentItem.alt || project.title + ' demo video')}"
                >
                  <source src="${escapeHtml(resolveAsset(currentItem.src))}" type="video/mp4">
                </video>
              </div>
              <figcaption class="media-caption media-stage-caption">
                <span>${escapeHtml(currentItem.caption || currentItem.alt || '')}</span>
                ${
                  currentItem.creditHref
                    ? `<a href="${escapeHtml(currentItem.creditHref)}" target="_blank" rel="noopener noreferrer" class="proof-pill-link">${escapeHtml(currentItem.creditLabel || 'Source ↗')}</a>`
                    : ''
                }
              </figcaption>
            </figure>
          `
              : `
            <figure class="media-figure media-stage-figure">
              <button
                type="button"
                class="media-zoom-btn media-stage-zoom"
                data-lightbox-src="${escapeHtml(resolveAsset(currentItem.src))}"
                data-lightbox-alt="${escapeHtml(currentItem.alt)}"
                data-lightbox-caption="${escapeHtml(currentItem.caption || currentItem.alt)}"
                aria-label="Enlarge screenshot: ${escapeHtml(currentItem.alt)}"
              >
                <img
                  src="${escapeHtml(resolveAsset(currentItem.src))}"
                  alt="${escapeHtml(currentItem.alt)}"
                  loading="eager"
                  class="media-stage-hero-img${currentItem.isPortrait ? ' is-portrait' : ''}"
                >
                <span class="media-zoom-hint">⤢ CLICK FOR FULLSCREEN</span>
              </button>
              ${
                currentItem.caption
                  ? `<figcaption class="media-caption media-stage-caption"><span>${escapeHtml(currentItem.caption)}</span><span>FRAME 0${safeIdx + 1} / 0${readyItems.length}</span></figcaption>`
                  : ''
              }
            </figure>
          `
          }
        </div>

        <div class="media-filmstrip" role="tablist" aria-label="Select media artifact">
          ${readyItems
            .map((item, idx) => {
              const isSelected = idx === safeIdx;
              if (item.type === 'video') {
                return `
                <button
                  type="button"
                  role="tab"
                  aria-selected="${isSelected ? 'true' : 'false'}"
                  class="filmstrip-item filmstrip-video-btn ${isSelected ? 'is-active' : ''}"
                  data-stage-media-idx="${idx}"
                >
                  ${
                    item.poster
                      ? `<img src="${escapeHtml(resolveAsset(item.poster))}" alt="${escapeHtml(item.alt || 'Gameplay video preview')}" loading="eager" class="filmstrip-poster-img">`
                      : ''
                  }
                  <span class="filmstrip-badge">▶ DEMO VIDEO</span>
                </button>
              `;
              }

              return `
                <button
                  type="button"
                  role="tab"
                  aria-selected="${isSelected ? 'true' : 'false'}"
                  class="filmstrip-item ${isSelected ? 'is-active' : ''}"
                  data-stage-media-idx="${idx}"
                  aria-label="View capture ${idx + 1}: ${escapeHtml(item.alt)}"
                >
                  <img
                    src="${escapeHtml(resolveAsset(item.src))}"
                    alt="${escapeHtml(item.alt)}"
                    loading="eager"
                    class="media-thumb-img${item.isPortrait ? ' is-portrait' : ''}"
                  >
                  <span class="filmstrip-badge">0${idx + 1}</span>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  const preparedSlot = mediaItems[0];
  return `
    <div class="media-slot-honest" role="note" aria-label="Project visual status">
      <div class="media-slot-header">
        <span class="card-badge status-research">CLI / ENGINE IN DEVELOPMENT</span>
        <span class="media-slot-status">SYSTEM ARCHITECTURE BLUEPRINT VERIFIED ABOVE</span>
      </div>
      <p class="media-slot-copy">
        ${escapeHtml(
          preparedSlot?.caption ||
            'Core verification logic and data model are currently in early CLI development prior to interactive UI capture.'
        )}
      </p>
    </div>
  `;
}
