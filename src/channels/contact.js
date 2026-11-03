import { escapeHtml, resolveAsset } from '../core/dom.js';
import { contactsData } from '../data/contacts.js';
import { renderChannelHeader } from '../components/channel-header.js';
import { renderTagCloud } from '../components/retro-card.js';
import { renderVisionDock, pulseVisionDock } from '../components/vision-dock.js';

let copyResetTimer = null;
let signalCopyTimer = null;
let activePresetId = 'internship';

const SIGNAL_PRESETS = [
  {
    id: 'internship',
    label: '💼 SWE / Cloud Internship',
    subject: 'Software Engineering / Cloud Internship Inquiry — Khalil Mustafa',
    body: "Hi Khalil,\n\nI explored your interactive CRT portfolio (especially Space Day, NASA Space Apps, and AWS CCP) and would love to connect regarding an upcoming Software / Backend / Cloud engineering opportunity.\n\nBest regards,"
  },
  {
    id: 'contract',
    label: '⚡ Web / Event Platform Build',
    subject: 'Project Inquiry — Web / Event Operations Platform',
    body: "Hi Khalil,\n\nWe need a reliable web workflow / event platform similar to your NASA Space Apps and Space Day systems. Let's schedule a quick call to discuss scope and timeline.\n\nBest regards,"
  },
  {
    id: 'ai',
    label: '🤖 Applied AI Collaboration',
    subject: 'Applied AI & Learning Workflow Collaboration',
    body: "Hi Khalil,\n\nSaw ROOMS by VISION and BandUp on your portfolio. Would love to chat about collaborating on an applied-AI product or prototype.\n\nBest regards,"
  },
  {
    id: 'hello',
    label: '👋 General Hello',
    subject: 'Hello from your Retro CRT Portfolio!',
    body: "Hi Khalil,\n\nJust tuned through your 7-channel CRT portfolio and wanted to reach out and connect!\n\nBest,"
  }
];

function formatAmmanTime() {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Amman',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(new Date());
  } catch {
    return 'GMT+3';
  }
}

function buildMailtoHref(address, subject, body) {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const qs = params.toString().replace(/\+/g, '%20');
  return `mailto:${address}${qs ? `?${qs}` : ''}`;
}

export function renderContactChannel() {
  const { headline, subheadline, availability, email, links, cv, signoff } = contactsData;
  const currentPreset = SIGNAL_PRESETS.find((p) => p.id === activePresetId) || SIGNAL_PRESETS[0];
  const initialMailto = buildMailtoHref(email.address, currentPreset.subject, currentPreset.body);

  return `
    <article class="channel-view" aria-label="Direct contact transmission">
      ${renderChannelHeader({
        eyebrow: 'CH 07 // TRANSMISSION: DIRECT CONTACT',
        title: headline,
        subtitle: subheadline
      })}

      ${renderVisionDock({
        message: 'Pick an opportunity topic below to pre-fill a message, or copy Khalil’s email in one click!',
        actions: [
          { id: 'contact-preset-intern', label: '💼 Internship Draft' },
          { id: 'contact-preset-build', label: '⚡ Contract Build Draft' },
          { id: 'contact-quick-copy', label: '⧉ Copy Email Fast' }
        ]
      })}

      <section class="retro-card stagger-item stagger-1" aria-label="Availability and focus areas">
        <div class="card-header-row">
          <h2 class="card-title">AVAILABILITY &amp; LIVE TIMEZONE</h2>
          <span class="card-badge status-live"><i class="signal-dot"></i> ${escapeHtml(availability.statusLabel)} · AMMAN ${escapeHtml(formatAmmanTime())}</span>
        </div>
        <p class="card-desc">${escapeHtml(availability.summary)}</p>
        ${renderTagCloud(availability.focusAreas, { accentCount: 3 })}
      </section>

      <section class="retro-card signal-composer-card stagger-item stagger-2" aria-label="Interactive message composer">
        <div class="card-header-row">
          <div>
            <span class="channel-eyebrow">INTERACTIVE DISPATCH TERMINAL</span>
            <h2 class="card-title">QUICK SIGNAL COMPOSER</h2>
          </div>
          <span class="card-badge">1-CLICK MAILTO OR COPY</span>
        </div>

        <div class="signal-preset-bar" role="group" aria-label="Choose message template">
          ${SIGNAL_PRESETS.map(
            (preset) => `
            <button
              type="button"
              class="course-pill ${preset.id === currentPreset.id ? 'is-active' : ''}"
              data-signal-preset="${escapeHtml(preset.id)}"
              aria-pressed="${preset.id === currentPreset.id ? 'true' : 'false'}"
            >
              ${escapeHtml(preset.label)}
            </button>
          `
          ).join('')}
        </div>

        <div class="signal-fields">
          <label class="signal-field-label" for="signal-subject-input">SUBJECT LINE</label>
          <input
            type="text"
            id="signal-subject-input"
            class="signal-input"
            value="${escapeHtml(currentPreset.subject)}"
          >

          <label class="signal-field-label" for="signal-body-input">MESSAGE PREVIEW (EDITABLE)</label>
          <textarea
            id="signal-body-input"
            class="signal-textarea"
            rows="4"
          >${escapeHtml(currentPreset.body)}</textarea>
        </div>

        <div class="card-actions">
          <a
            href="${escapeHtml(initialMailto)}"
            id="signal-mailto-link"
            class="btn-card-link primary"
          >
            ✉ LAUNCH IN MAIL APP ↗
          </a>
          <button
            type="button"
            class="btn-card-link secondary"
            id="signal-copy-draft-btn"
            data-copy-signal="true"
          >
            📋 COPY MESSAGE + EMAIL
          </button>
        </div>
      </section>

      <div class="contact-grid stagger-item stagger-3">
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

function syncComposerMailto() {
  const subjEl = document.getElementById('signal-subject-input');
  const bodyEl = document.getElementById('signal-body-input');
  const linkEl = document.getElementById('signal-mailto-link');
  if (!subjEl || !bodyEl || !linkEl) return;
  linkEl.href = buildMailtoHref(contactsData.email.address, subjEl.value, bodyEl.value);
}

export function bindContactEvents(screenContent, { sound } = {}) {
  screenContent.addEventListener('input', (event) => {
    if (event.target.id === 'signal-subject-input' || event.target.id === 'signal-body-input') {
      syncComposerMailto();
    }
  });

  screenContent.addEventListener('click', async (event) => {
    if (!document.getElementById('contact-email-value')) return;

    const applyPreset = (presetId) => {
      const preset = SIGNAL_PRESETS.find((p) => p.id === presetId);
      if (!preset) return;
      activePresetId = preset.id;
      const subjEl = document.getElementById('signal-subject-input');
      const bodyEl = document.getElementById('signal-body-input');
      if (subjEl) subjEl.value = preset.subject;
      if (bodyEl) bodyEl.value = preset.body;
      screenContent.querySelectorAll('[data-signal-preset]').forEach((btn) => {
        const active = btn.getAttribute('data-signal-preset') === preset.id;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      syncComposerMailto();
    };

    const dockBtn = event.target.closest('[data-dock-action]');
    if (dockBtn) {
      const act = dockBtn.getAttribute('data-dock-action');
      if (act === 'contact-preset-intern') {
        applyPreset('internship');
        pulseVisionDock('Loaded SWE / Cloud Internship template — ready to send or edit!');
      } else if (act === 'contact-preset-build') {
        applyPreset('contract');
        pulseVisionDock('Loaded Contract Web / Event System template!');
      } else if (act === 'contact-quick-copy') {
        await copyTextToClipboard(contactsData.email.address);
        sound?.successChime?.();
        pulseVisionDock(`Copied ${contactsData.email.address} to your clipboard!`);
      }
      return;
    }

    const presetBtn = event.target.closest('[data-signal-preset]');
    if (presetBtn) {
      applyPreset(presetBtn.getAttribute('data-signal-preset'));
      return;
    }

    const copyDraftBtn = event.target.closest('[data-copy-signal]');
    if (copyDraftBtn) {
      const subjEl = document.getElementById('signal-subject-input');
      const bodyEl = document.getElementById('signal-body-input');
      const payload = `To: ${contactsData.email.address}\nSubject: ${subjEl?.value || ''}\n\n${bodyEl?.value || ''}`;
      try {
        await copyTextToClipboard(payload);
        sound?.successChime?.();
        copyDraftBtn.textContent = '✓ TRANSMISSION COPIED!';
        copyDraftBtn.classList.add('is-copied');
        clearTimeout(signalCopyTimer);
        signalCopyTimer = setTimeout(() => {
          if (copyDraftBtn.isConnected) {
            copyDraftBtn.textContent = '📋 COPY MESSAGE + EMAIL';
            copyDraftBtn.classList.remove('is-copied');
          }
        }, 2500);
      } catch {
        copyDraftBtn.textContent = 'SELECT TEXT ABOVE';
      }
      return;
    }

    const copyBtn = event.target.closest('[data-copy-email]');
    if (!copyBtn) return;

    const address = copyBtn.getAttribute('data-copy-email') || '';
    if (!address) return;

    try {
      await copyTextToClipboard(address);
      sound?.successChime?.();
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
