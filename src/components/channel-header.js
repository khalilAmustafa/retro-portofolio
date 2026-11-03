import { escapeHtml } from '../core/dom.js';

export function renderChannelHeader({ eyebrow, title, subtitle }) {
  return `
    <header class="channel-header-block">
      <span class="channel-eyebrow">${escapeHtml(eyebrow)}</span>
      <h1 class="channel-main-title">${escapeHtml(title)}</h1>
      ${subtitle ? `<p class="channel-main-subtitle">${escapeHtml(subtitle)}</p>` : ''}
    </header>
  `;
}

export function renderChannelFooter({ nextRoute, nextLabel }) {
  return `
    <nav class="channel-footer-nav" aria-label="Channel pagination">
      <a href="#home" class="btn-back-home" data-route="#home">◀ Return to CH 01 (Home)</a>
      ${
        nextRoute && nextLabel
          ? `<a href="${escapeHtml(nextRoute)}" class="btn-card-link primary" data-route="${escapeHtml(nextRoute)}">${escapeHtml(nextLabel)}</a>`
          : ''
      }
    </nav>
  `;
}
