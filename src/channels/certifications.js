import { escapeHtml, resolveAsset } from '../core/dom.js';
import { credentialsData } from '../data/credentials.js';
import { renderChannelHeader, renderChannelFooter } from '../components/channel-header.js';
import { badgeClassForTone, renderTagCloud } from '../components/retro-card.js';
import { renderEvidenceBadge } from '../components/evidence-link.js';

export function renderCertificationsChannel() {
  const { featured, honorsAndCompetitions, otherLearning } = credentialsData;

  return `
    <article class="channel-view" aria-label="Certifications and honors transmission">
      ${renderChannelHeader({
        eyebrow: 'CH 06 // TRANSMISSION: VERIFIED CREDENTIALS',
        title: 'CREDENTIALS & HONORS',
        subtitle:
          'Earned cloud certification, hackathon placement, European academic selection, and collegiate algorithmic contests.'
      })}

      <section class="retro-card featured-credential-card" aria-label="Featured cloud certification">
        <div class="featured-credential-grid">
          <div class="featured-credential-seal" aria-hidden="true">
            ${
              featured.badgeMedia?.ready
                ? `<img src="${escapeHtml(resolveAsset(featured.badgeMedia.src))}" alt="${escapeHtml(featured.badgeMedia.alt)}" class="credential-badge-img" loading="lazy">`
                : `<div class="credential-seal-stamp"><span>AWS</span><small>CLF-C02</small></div>`
            }
          </div>
          <div class="featured-credential-content">
            <div class="card-header-row">
              <div>
                <span class="channel-eyebrow">${escapeHtml(featured.badgeLabel)}</span>
                <h2 class="card-title featured-credential-title">${escapeHtml(featured.title)}</h2>
              </div>
              <span class="card-badge status-live">${escapeHtml(featured.dateLabel)}</span>
            </div>
            <div class="card-meta">${escapeHtml(featured.issuer)}</div>
            <p class="card-desc">${escapeHtml(featured.summary)}</p>
            ${renderEvidenceBadge(featured.evidenceId)}
          </div>
        </div>
      </section>

      <section class="credentials-list-section" aria-label="Hackathon awards, academic selection, and contests">
        <h2 class="secondary-section-title">AWARDS, ACADEMIC SELECTION &amp; CONTESTS</h2>
        <div class="credentials-stack">
          ${honorsAndCompetitions
            .map(
              (item) => `
            <div class="retro-card credential-row-card">
              <div class="card-header-row">
                <h3 class="card-title">${escapeHtml(item.title)}</h3>
                <span class="${badgeClassForTone(item.tone)}">${escapeHtml(item.categoryLabel)} · ${escapeHtml(item.dateLabel)}</span>
              </div>
              <div class="card-meta">${escapeHtml(item.issuer)}</div>
              <p class="card-desc">${escapeHtml(item.summary)}</p>
              <div class="credential-row-footer">
                ${item.evidenceId ? renderEvidenceBadge(item.evidenceId) : ''}
                ${
                  item.route && item.routeLabel
                    ? `<a href="${escapeHtml(item.route)}" class="btn-card-link secondary btn-compact" data-route="${escapeHtml(item.route)}">${escapeHtml(item.routeLabel)}</a>`
                    : ''
                }
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </section>

      <details class="retro-card other-learning-drawer">
        <summary class="other-learning-summary">
          <span>OTHER COURSEWORK &amp; CERTIFICATES (IBM · GOOGLE · META · AWS)</span>
          <span class="card-badge">EXPAND LIST</span>
        </summary>
        <div class="other-learning-body">
          ${otherLearning
            .map(
              (group) => `
            <div class="other-learning-group">
              <h3 class="other-learning-provider">${escapeHtml(group.provider)}</h3>
              ${renderTagCloud(group.items, { accentCount: 0 })}
            </div>
          `
            )
            .join('')}
        </div>
      </details>

      ${renderChannelFooter({
        nextRoute: '#contact',
        nextLabel: 'Next: CH 07 Contact →'
      })}
    </article>
  `;
}
