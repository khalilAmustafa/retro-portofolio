import { escapeHtml, resolveAsset } from '../core/dom.js';
import { evidenceById } from '../data/evidence.js';

export function renderEvidenceBadge(evidenceId) {
  if (!evidenceId) return '';
  const item = evidenceById[evidenceId];
  if (!item) return '';

  const attributionLabel =
    item.attribution === 'team'
      ? 'Team result'
      : item.attribution === 'event-scale'
        ? 'Event scale'
        : 'Personal record';

  if (item.href) {
    return `
      <a
        href="${escapeHtml(resolveAsset(item.href))}"
        target="_blank"
        rel="noopener noreferrer"
        class="evidence-chip is-linked"
        title="${escapeHtml(item.summary)}"
      >
        <span class="evidence-chip-dot" aria-hidden="true"></span>
        <span>${escapeHtml(item.title)} (${escapeHtml(attributionLabel)}) ↗</span>
      </a>
    `;
  }

  return `
    <span class="evidence-chip" title="${escapeHtml(item.verificationNote || item.summary)}">
      <span class="evidence-chip-dot" aria-hidden="true"></span>
      <span>${escapeHtml(item.issuer)} · ${escapeHtml(attributionLabel)}</span>
    </span>
  `;
}
