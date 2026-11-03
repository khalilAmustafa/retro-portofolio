import { escapeHtml, resolveAsset } from '../core/dom.js';
import { educationData } from '../data/education.js';
import { renderChannelHeader, renderChannelFooter } from '../components/channel-header.js';
import { badgeClassForTone, renderTagCloud } from '../components/retro-card.js';
import { renderEvidenceBadge } from '../components/evidence-link.js';

function renderPassportVisual(media) {
  if (media?.ready && media.src) {
    return `
      <figure class="passport-photo-frame">
        <img
          src="${escapeHtml(resolveAsset(media.src))}"
          alt="${escapeHtml(media.alt)}"
          loading="lazy"
          class="passport-photo-img"
        >
        ${media.caption ? `<figcaption class="passport-photo-caption">${escapeHtml(media.caption)}</figcaption>` : ''}
      </figure>
    `;
  }

  return `
    <div class="passport-stamp-banner" aria-label="${escapeHtml(media?.fallbackStamp || 'Academic record')}">
      <span class="passport-stamp-mark">${escapeHtml(media?.fallbackStamp || 'ACADEMIC RECORD')}</span>
      <span class="passport-photo-slot-note">Campus photo slot: <code>public/${escapeHtml(media?.src || 'assets/education/')}</code></span>
    </div>
  `;
}

export function renderEducationChannel() {
  const { intro, institutions, languages } = educationData;

  return `
    <article class="channel-view" aria-label="Education and languages transmission">
      ${renderChannelHeader({
        eyebrow: 'CH 03 // TRANSMISSION: ACADEMIC PASSPORT',
        title: 'ACADEMIC FOUNDATIONS',
        subtitle: intro
      })}

      <div class="passport-grid">
        ${institutions
          .map(
            (inst) => `
          <section class="retro-card passport-card" aria-label="${escapeHtml(inst.name)}">
            ${renderPassportVisual(inst.media)}
            <div class="passport-code">${escapeHtml(inst.code)}</div>
            <div class="card-header-row">
              <h2 class="card-title">${escapeHtml(inst.name)}</h2>
              <span class="${badgeClassForTone(inst.badgeTone)}">${escapeHtml(inst.statusBadge)}</span>
            </div>
            <div class="card-meta">${escapeHtml(inst.degreeOrProgram)} · ${escapeHtml(inst.location)} · ${escapeHtml(inst.periodLabel)}</div>
            <p class="card-desc">${escapeHtml(inst.summary)}</p>

            <div class="passport-subblock">
              <span class="passport-subhead">RELEVANT ENGINEERING COURSEWORK</span>
              ${renderTagCloud(inst.coursework, { accentCount: 2 })}
            </div>

            ${
              inst.activities && inst.activities.length
                ? `
              <ul class="card-bullets passport-bullets">
                ${inst.activities.map((act) => `<li>${escapeHtml(act)}</li>`).join('')}
              </ul>
            `
                : ''
            }

            ${inst.evidenceId ? `<div class="passport-evidence">${renderEvidenceBadge(inst.evidenceId)}</div>` : ''}
          </section>
        `
          )
          .join('')}
      </div>

      <section class="retro-card" aria-label="Spoken languages">
        <div class="card-header-row">
          <h2 class="card-title">SPOKEN LANGUAGES</h2>
          <span class="card-badge">COMMUNICATION</span>
        </div>
        <div class="language-grid">
          ${languages
            .map(
              (lang) => `
            <div class="language-tile">
              <div class="language-tile-top">
                <strong class="language-name">${escapeHtml(lang.language.toUpperCase())}</strong>
                <span class="language-level">${escapeHtml(lang.proficiency)}</span>
              </div>
              <p class="language-detail">${escapeHtml(lang.detail)}</p>
              ${lang.evidenceId ? renderEvidenceBadge(lang.evidenceId) : ''}
            </div>
          `
            )
            .join('')}
        </div>
      </section>

      ${renderChannelFooter({
        nextRoute: '#skills',
        nextLabel: 'Next: CH 04 Skills →'
      })}
    </article>
  `;
}
