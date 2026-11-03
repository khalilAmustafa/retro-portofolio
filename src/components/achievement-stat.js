import { escapeHtml } from '../core/dom.js';

export function renderEvidenceStrip(highlights = []) {
  if (!highlights.length) return '';
  return `
    <section class="evidence-strip" aria-label="Verified engineering highlights">
      ${highlights
        .map(
          (item) => `
        <a
          href="${escapeHtml(item.route)}"
          class="evidence-cell"
          data-route="${escapeHtml(item.route)}"
          aria-label="${escapeHtml(item.value)} — ${escapeHtml(item.label)} (${escapeHtml(item.scopeTag)}). Inspect details."
        >
          <span class="evidence-value">${escapeHtml(item.value)}</span>
          <span class="evidence-label">${escapeHtml(item.label)}</span>
          <span class="evidence-scope">${escapeHtml(item.scopeTag)}</span>
        </a>
      `
        )
        .join('')}
    </section>
  `;
}
