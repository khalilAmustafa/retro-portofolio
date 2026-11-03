import { escapeHtml, resolveAsset } from '../core/dom.js';
import { credentialsData } from '../data/credentials.js';
import { renderChannelHeader, renderChannelFooter } from '../components/channel-header.js';
import { badgeClassForTone, renderTagCloud } from '../components/retro-card.js';
import { renderEvidenceBadge } from '../components/evidence-link.js';
import { renderVisionDock, pulseVisionDock } from '../components/vision-dock.js';

const AWS_VALIDATION_ID = '4268afe835cd4e5c990d98399b7847a1';
let activeHonorFilter = 'all';
let activeCourseProviderIdx = 0;
let validationCopied = false;
let copyTimer = null;

const CERT_TIPS = [
  'Click the AWS Credential card to inspect it full-size, or copy the AWS Validation ID in one click!',
  'Filter between Hackathon Awards, Academic Exchange, and 24-hour Competitive Programming contests.',
  'Switch Coursework tabs below to browse 11 completed IBM, Google, Meta, & AWS certificates.'
];
let certTipIdx = 0;

function renderCertificationsBody() {
  const { featured, honorsAndCompetitions, otherLearning } = credentialsData;

  const visibleHonors =
    activeHonorFilter === 'all'
      ? honorsAndCompetitions
      : honorsAndCompetitions.filter((item) =>
          activeHonorFilter === 'award' ? item.tone === 'award' : item.tone !== 'award'
        );

  const totalCourseCount = otherLearning.reduce((acc, g) => acc + g.items.length, 0);

  return `
    <section class="retro-card featured-credential-card stagger-item stagger-1" aria-label="Featured cloud certification">
      <div class="featured-credential-grid">
        <div class="featured-credential-seal">
          ${
            featured.badgeMedia?.ready
              ? `
              <button
                type="button"
                class="credential-zoom-trigger"
                data-cert-zoom-src="${escapeHtml(resolveAsset(featured.badgeMedia.src))}"
                data-cert-zoom-alt="${escapeHtml(featured.badgeMedia.alt)}"
                title="Click to enlarge official AWS credential card"
              >
                <img src="${escapeHtml(resolveAsset(featured.badgeMedia.src))}" alt="${escapeHtml(featured.badgeMedia.alt)}" class="credential-badge-img" loading="lazy">
                <span class="credential-zoom-label">⤢ INSPECT</span>
              </button>
            `
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
          <div class="credential-actions-bar">
            ${renderEvidenceBadge(featured.evidenceId)}
            <button
              type="button"
              class="btn-card-link secondary btn-compact ${validationCopied ? 'is-copied' : ''}"
              data-copy-validation="${AWS_VALIDATION_ID}"
            >
              ${validationCopied ? '✓ COPIED VALIDATION ID' : '⧉ COPY VALIDATION ID'}
            </button>
            <a
              href="https://aws.amazon.com/verification"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-card-link primary btn-compact"
            >
              VERIFY AT AWS ↗
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="credentials-list-section" aria-label="Hackathon awards, academic selection, and contests">
      <div class="card-header-row">
        <h2 class="secondary-section-title">AWARDS, ACADEMIC SELECTION &amp; CONTESTS</h2>
        <div class="skill-filter-bar cert-filter-bar" role="toolbar" aria-label="Filter honors and competitions">
          <button type="button" class="filter-chip ${activeHonorFilter === 'all' ? 'is-active' : ''}" data-honor-filter="all" aria-pressed="${activeHonorFilter === 'all' ? 'true' : 'false'}">
            ALL (${honorsAndCompetitions.length})
          </button>
          <button type="button" class="filter-chip ${activeHonorFilter === 'award' ? 'is-active' : ''}" data-honor-filter="award" aria-pressed="${activeHonorFilter === 'award' ? 'true' : 'false'}">
            AWARDS &amp; EXCHANGE
          </button>
          <button type="button" class="filter-chip ${activeHonorFilter === 'contest' ? 'is-active' : ''}" data-honor-filter="contest" aria-pressed="${activeHonorFilter === 'contest' ? 'true' : 'false'}">
            CONTESTS &amp; SPRINTS
          </button>
        </div>
      </div>

      <div class="credentials-stack">
        ${visibleHonors
          .map(
            (item, idx) => `
          <div class="retro-card credential-row-card stagger-item stagger-${(idx % 4) + 1}">
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

    <section class="retro-card coursework-explorer-card" aria-label="Completed coursework and certificates">
      <div class="card-header-row">
        <div>
          <h2 class="card-title">COMPLETED COURSEWORK &amp; CERTIFICATES (${totalCourseCount})</h2>
          <div class="card-meta">IBM · Google · Meta · AWS foundational tracks</div>
        </div>
        <span class="card-badge">INTERACTIVE INDEX</span>
      </div>

      <div class="dossier-subtabs coursework-tabs" role="tablist" aria-label="Select coursework provider">
        <button
          type="button"
          role="tab"
          aria-selected="${activeCourseProviderIdx === -1 ? 'true' : 'false'}"
          class="dossier-subtab ${activeCourseProviderIdx === -1 ? 'is-active' : ''}"
          data-course-provider="-1"
        >
          ALL (${totalCourseCount})
        </button>
        ${otherLearning
          .map(
            (group, idx) => `
          <button
            type="button"
            role="tab"
            aria-selected="${activeCourseProviderIdx === idx ? 'true' : 'false'}"
            class="dossier-subtab ${activeCourseProviderIdx === idx ? 'is-active' : ''}"
            data-course-provider="${idx}"
          >
            ${escapeHtml(group.provider.split('—')[0].trim().toUpperCase())} (${group.items.length})
          </button>
        `
          )
          .join('')}
      </div>

      <div class="other-learning-body">
        ${(activeCourseProviderIdx === -1 ? otherLearning : [otherLearning[activeCourseProviderIdx]].filter(Boolean))
          .map(
            (group) => `
          <div class="other-learning-group">
            <h3 class="other-learning-provider">${escapeHtml(group.provider)}</h3>
            ${renderTagCloud(group.items, { accentCount: 2 })}
          </div>
        `
          )
          .join('')}
      </div>
    </section>

    <div class="retro-lightbox" id="cert-lightbox" role="dialog" aria-modal="true" aria-label="Enlarged credential card" hidden>
      <div class="retro-lightbox-backdrop" data-cert-lightbox-close="true"></div>
      <div class="retro-lightbox-dialog">
        <div class="retro-lightbox-bar">
          <span class="retro-lightbox-title">VERIFIED CREDENTIAL INSPECTION</span>
          <button type="button" class="btn-back-home" id="cert-lightbox-close" data-cert-lightbox-close="true">✕ CLOSE (ESC)</button>
        </div>
        <img src="" alt="" id="cert-lightbox-img" class="retro-lightbox-img">
      </div>
    </div>
  `;
}

export function renderCertificationsChannel() {
  return `
    <article class="channel-view" aria-label="Certifications and honors transmission">
      ${renderChannelHeader({
        eyebrow: 'CH 06 // TRANSMISSION: VERIFIED CREDENTIALS',
        title: 'CREDENTIALS & HONORS',
        subtitle:
          'Earned cloud certification, hackathon placement, European academic selection, and collegiate algorithmic contests.'
      })}

      ${renderVisionDock({
        message: CERT_TIPS[0],
        actions: [
          { id: 'cert-copy-id', label: '⧉ Copy AWS Validation ID' },
          { id: 'cert-awards', label: '🏆 Awards & Erasmus+' },
          { id: 'cert-all-courses', label: '📚 Show All 11 Courses' }
        ]
      })}

      <div id="certifications-interactive-mount">
        ${renderCertificationsBody()}
      </div>

      ${renderChannelFooter({
        nextRoute: '#contact',
        nextLabel: 'Next: CH 07 Contact →'
      })}
    </article>
  `;
}

async function writeClip(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.className = 'sr-only';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

export function bindCertificationsEvents(screenContent, { sound } = {}) {
  screenContent.addEventListener('click', async (event) => {
    const mount = document.getElementById('certifications-interactive-mount');
    if (!mount) return;

    if (event.target.closest('[data-dock-avatar]')) {
      certTipIdx = (certTipIdx + 1) % CERT_TIPS.length;
      pulseVisionDock(CERT_TIPS[certTipIdx]);
      return;
    }

    const dockBtn = event.target.closest('[data-dock-action]');
    if (dockBtn) {
      const act = dockBtn.getAttribute('data-dock-action');
      if (act === 'cert-copy-id') {
        try {
          await writeClip(AWS_VALIDATION_ID);
          validationCopied = true;
          sound?.successChime?.();
          pulseVisionDock(`Copied AWS Validation ID (${AWS_VALIDATION_ID}) to clipboard!`);
          mount.innerHTML = renderCertificationsBody();
          clearTimeout(copyTimer);
          copyTimer = setTimeout(() => {
            validationCopied = false;
            const liveMount = document.getElementById('certifications-interactive-mount');
            if (liveMount) liveMount.innerHTML = renderCertificationsBody();
          }, 2600);
        } catch {
          pulseVisionDock(`Validation ID: ${AWS_VALIDATION_ID}`);
        }
      } else if (act === 'cert-awards') {
        activeHonorFilter = 'award';
        pulseVisionDock('Filtered to Replit AI 3rd Place & EU Erasmus+ UPV Selection!');
        mount.innerHTML = renderCertificationsBody();
      } else if (act === 'cert-all-courses') {
        activeCourseProviderIdx = -1;
        pulseVisionDock('Expanded all 11 completed IBM, Google, Meta, & AWS certificates below!');
        mount.innerHTML = renderCertificationsBody();
      }
      return;
    }

    const copyValBtn = event.target.closest('[data-copy-validation]');
    if (copyValBtn) {
      const val = copyValBtn.getAttribute('data-copy-validation') || AWS_VALIDATION_ID;
      try {
        await writeClip(val);
        validationCopied = true;
        sound?.successChime?.();
        mount.innerHTML = renderCertificationsBody();
        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => {
          validationCopied = false;
          const liveMount = document.getElementById('certifications-interactive-mount');
          if (liveMount) liveMount.innerHTML = renderCertificationsBody();
        }, 2600);
      } catch {
        // Ignore clipboard denial
      }
      return;
    }

    const honorBtn = event.target.closest('[data-honor-filter]');
    if (honorBtn) {
      activeHonorFilter = honorBtn.getAttribute('data-honor-filter') || 'all';
      mount.innerHTML = renderCertificationsBody();
      return;
    }

    const providerBtn = event.target.closest('[data-course-provider]');
    if (providerBtn) {
      activeCourseProviderIdx = Number(providerBtn.getAttribute('data-course-provider') || 0);
      mount.innerHTML = renderCertificationsBody();
      return;
    }

    const zoomTrigger = event.target.closest('[data-cert-zoom-src]');
    if (zoomTrigger) {
      const modal = document.getElementById('cert-lightbox');
      const img = document.getElementById('cert-lightbox-img');
      if (modal && img) {
        img.src = zoomTrigger.getAttribute('data-cert-zoom-src') || '';
        img.alt = zoomTrigger.getAttribute('data-cert-zoom-alt') || '';
        modal.hidden = false;
        document.getElementById('cert-lightbox-close')?.focus({ preventScroll: true });
      }
      return;
    }

    if (event.target.closest('[data-cert-lightbox-close]')) {
      const modal = document.getElementById('cert-lightbox');
      if (modal) modal.hidden = true;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const modal = document.getElementById('cert-lightbox');
      if (modal && !modal.hidden) modal.hidden = true;
    }
  });
}
