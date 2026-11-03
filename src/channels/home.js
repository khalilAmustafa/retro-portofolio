import { escapeHtml, resolveAsset } from '../core/dom.js';
import { profile } from '../data/profile.js';
import { renderEvidenceStrip } from '../components/achievement-stat.js';

export function renderHomeChannel() {
  const { name, descriptor, positioning, ctas, highlights, companion } = profile;

  return `
    <article class="home-view" aria-label="Home transmission">
      <div class="comic-halftone-overlay" aria-hidden="true"></div>
      <div class="home-grid">
        <div class="home-left">
          <div class="home-heading-group">
            <h1 class="hero-name" aria-label="${escapeHtml(name.full)}">
              <span class="name-row name-khalil">${escapeHtml(name.first)}</span>
              <span class="name-row name-asad">${escapeHtml(name.middle)}</span>
              <span class="name-row name-mustafa">${escapeHtml(name.last)}</span>
            </h1>
            <p class="hero-subtitle">${escapeHtml(descriptor)}</p>
            <div class="hero-divider"></div>
          </div>

          <p class="hero-intro">${escapeHtml(positioning)}</p>

          <div class="hero-actions">
            <a href="${escapeHtml(ctas.primary.route)}" class="btn-retro primary" id="btn-explore" data-route="${escapeHtml(ctas.primary.route)}">
              <span class="btn-icon play-icon" aria-hidden="true">▶</span>
              <span class="btn-label">${escapeHtml(ctas.primary.label)}</span>
              <span class="btn-arrow" aria-hidden="true">→</span>
            </a>
            <a href="${escapeHtml(ctas.secondary.route)}" class="btn-retro secondary" id="btn-contact" data-route="${escapeHtml(ctas.secondary.route)}">
              <span class="btn-icon env-icon" aria-hidden="true">✉</span>
              <span class="btn-label">${escapeHtml(ctas.secondary.label)}</span>
              <span class="btn-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div class="home-right">
          <div class="companion-stage">
            <div
              class="character-interactive"
              id="character-vision"
              role="button"
              tabindex="0"
              aria-expanded="false"
              aria-label="${escapeHtml(companion.ariaLabel)}"
              title="Click for a channel note from Vision"
            >
              <div class="speech-bubble" id="speech-bubble" role="status" aria-live="polite" aria-hidden="true">
                <div class="bubble-text" id="bubble-text"><span>HEY!</span><span>I'M VISION.</span></div>
                <span class="bubble-tail"></span>
              </div>
              <div class="comic-emphasis" aria-hidden="true">
                <span class="em-mark mark-1"></span>
                <span class="em-mark mark-2"></span>
                <span class="em-mark mark-3"></span>
              </div>
              <div class="stage-frame" aria-hidden="true">
                <span class="corner tl"></span>
                <span class="corner tr"></span>
                <span class="corner bl"></span>
                <span class="corner br"></span>
              </div>
              <div class="character-viewport">
                <img
                  src="${escapeHtml(resolveAsset(companion.spriteSrc))}"
                  class="character-spritesheet"
                  alt="Vision pixel-art interactive companion"
                  draggable="false"
                >
              </div>
              <div class="character-ground" aria-hidden="true">
                <div class="ground-shadow"></div>
                <div class="ground-pedestal"></div>
              </div>
            </div>
            <div class="companion-meta">
              <span class="meta-dot" aria-hidden="true"></span>
              <span class="meta-title">${escapeHtml(companion.metaTitle)}</span>
              <span class="meta-hint">${escapeHtml(companion.metaHint)}</span>
            </div>
          </div>
        </div>
      </div>

      ${renderEvidenceStrip(highlights)}
    </article>
  `;
}
