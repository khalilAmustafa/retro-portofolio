import { escapeHtml } from '../core/dom.js';

export function renderEvidenceStrip(highlights = []) {
  if (!highlights.length) return '';
  return `
    <section class="evidence-strip" aria-label="Verified engineering highlights">
      ${highlights
        .map(
          (item, idx) => `
        <a
          href="${escapeHtml(item.route)}"
          class="evidence-cell stagger-item stagger-${idx + 1}"
          data-route="${escapeHtml(item.route)}"
          aria-label="${escapeHtml(item.value)} — ${escapeHtml(item.label)} (${escapeHtml(item.scopeTag)}). Inspect details."
        >
          <div class="evidence-cell-top">
            <span class="evidence-dot" aria-hidden="true"></span>
            <span class="evidence-value">${escapeHtml(item.value)}</span>
            <span class="evidence-cta" aria-hidden="true">↗</span>
          </div>
          <span class="evidence-label">${escapeHtml(item.label)}</span>
          <span class="evidence-scope">${escapeHtml(item.scopeTag)}</span>
        </a>
      `
        )
        .join('')}
    </section>
  `;
}
