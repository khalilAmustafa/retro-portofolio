import { escapeHtml } from '../core/dom.js';

export function badgeClassForTone(tone) {
  switch (tone) {
    case 'live':
      return 'card-badge status-live';
    case 'award':
      return 'card-badge status-award';
    case 'research':
      return 'card-badge status-research';
    default:
      return 'card-badge';
  }
}

export function renderTagCloud(tags = [], { accentCount = 2 } = {}) {
  if (!tags.length) return '';
  return `
    <div class="tag-cloud">
      ${tags
        .map(
          (tag, idx) =>
            `<span class="tag-pill${idx < accentCount ? ' accent' : ''}">${escapeHtml(tag)}</span>`
        )
        .join('')}
    </div>
  `;
}
