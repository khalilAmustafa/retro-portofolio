import { escapeHtml, resolveAsset } from '../core/dom.js';
import { contactsData } from '../data/contacts.js';
import { renderChannelHeader } from '../components/channel-header.js';
import { renderTagCloud } from '../components/retro-card.js';

let copyResetTimer = null;

export function renderContactChannel() {
  const { headline, subheadline, availability, email, links, cv, signoff } = contactsData;

  return `
    <article class="channel-view" aria-label="Direct contact transmission">
      ${renderChannelHeader({
        eyebrow: 'CH 07 // TRANSMISSION: DIRECT CONTACT',
        title: headline,
        subtitle: subheadline
      })}

      <section class="retro-card" aria-label="Availability and focus areas">
        <div class="card-header-row">
          <h2 class="card-title">AVAILABILITY &amp; FOCUS</h2>
          <span class="card-badge status-live">${escapeHtml(availability.statusLabel)}</span>
        </div>
        <p class="card-desc">${escapeHtml(availability.summary)}</p>
        ${renderTagCloud(availability.focusAreas, { accentCount: 3 })}
      </section>

      <div class="contact-grid">
        <div class="contact-tile contact-email-tile">
          <span class="contact-tile-label">${escapeHtml(email.label)}</span>
          <span class="contact-tile-val" id="contact-email-value">${escapeHtml(email.address)}</span>
          <div class="contact-email-actions">
            <a href="${escapeHtml(email.mailto)}" class="btn-card-link primary btn-compact">
              ✉ Open Mail ↗
            </a>
            <button
              type="button"
              class="btn-card-link secondary btn-compact"
              data-copy-email="${escapeHtml(email.address)}"
              aria-live="polite"
            >
              ⧉ Copy Email
            </button>
          </div>
        </div>

        ${links
          .map(
            (link) => `
          <a
            href="${escapeHtml(link.href)}"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-tile"
          >
            <span class="contact-tile-label">${escapeHtml(link.label)}</span>
            <span class="contact-tile-val">${escapeHtml(link.value)}</span>
            <span class="contact-tile-action">${escapeHtml(link.actionText)}</span>
          </a>
        `
          )
          .join('')}

        <div class="contact-tile contact-static-tile">
          <span class="contact-tile-label">LOCATION, TIMEZONE &amp; CV</span>
          <span class="contact-tile-val">${escapeHtml(availability.location)} · ${escapeHtml(availability.timezone)}</span>
          ${
            cv.available
              ? `<a href="${escapeHtml(resolveAsset(cv.href))}" target="_blank" rel="noopener noreferrer" class="btn-card-link primary btn-compact">${escapeHtml(cv.label)} ↗</a>`
              : `<span class="contact-cv-note">${escapeHtml(cv.unavailableNote)}</span>`
          }
        </div>
      </div>

      <div class="retro-card contact-signoff-card">
        <div class="contact-signoff-name">${escapeHtml(signoff.name)}</div>
        <div class="contact-signoff-tagline">${escapeHtml(signoff.tagline)}</div>
      </div>

      <nav class="channel-footer-nav" aria-label="Channel pagination">
        <a href="#home" class="btn-back-home" data-route="#home">◀ Return to CH 01 (Home)</a>
        <a href="#projects" class="btn-card-link secondary" data-route="#projects">Review Case Studies (CH 05) →</a>
      </nav>
    </article>
  `;
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const fallbackArea = document.createElement('textarea');
  fallbackArea.value = text;
  fallbackArea.setAttribute('readonly', 'true');
  fallbackArea.className = 'sr-only';
  document.body.appendChild(fallbackArea);
  fallbackArea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(fallbackArea);
  return copied;
}

export function bindContactEvents(screenContent) {
  screenContent.addEventListener('click', async (event) => {
    const copyBtn = event.target.closest('[data-copy-email]');
    if (!copyBtn) return;

    const address = copyBtn.getAttribute('data-copy-email') || '';
    if (!address) return;

    try {
      await copyTextToClipboard(address);
      copyBtn.textContent = '✓ COPIED EMAIL';
      copyBtn.classList.add('is-copied');
      const statusRegion = document.getElementById('status');
      if (statusRegion) {
        statusRegion.textContent = `Copied email address ${address}`;
      }
    } catch {
      copyBtn.textContent = 'SELECT & COPY ABOVE';
    }

    clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      if (copyBtn.isConnected) {
        copyBtn.textContent = '⧉ Copy Email';
        copyBtn.classList.remove('is-copied');
      }
    }, 2400);
  });
}
