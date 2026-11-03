import { escapeHtml } from '../core/dom.js';
import { CHANNELS } from '../core/navigation.js';
import { projects } from '../data/projects.js';
import { skillGroups } from '../data/skills.js';
import { credentialsData } from '../data/credentials.js';
import { educationData } from '../data/education.js';
import { renderIcon } from './icons.js';

const SCOPE_FILTERS = [
  { id: 'all', label: 'ALL SIGNALS' },
  { id: 'project', label: 'PROJECTS (10)' },
  { id: 'channel', label: 'CHANNELS (7)' },
  { id: 'proof', label: 'SKILLS & PROOF' }
];

function buildSearchCatalog() {
  const entries = [];

  CHANNELS.forEach((ch, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    entries.push({
      id: `ch-${ch.slug}`,
      scope: 'channel',
      icon: idx === 0 ? 'spark' : idx === 4 ? 'layers' : idx === 6 ? 'mail' : 'globe',
      badge: `CH ${num} · CHANNEL`,
      title: `${ch.label} Channel`,
      subtitle: `Tune directly to Channel ${num} (${ch.label})`,
      keywords: `${ch.slug} ${ch.label} ch ${num} channel ${idx + 1}`.toLowerCase(),
      route: `#${ch.slug}`
    });
  });

  projects.forEach((proj) => {
    const stackText = (proj.tech || []).join(' · ');
    entries.push({
      id: `proj-${proj.id}`,
      scope: 'project',
      icon: proj.statusTone === 'award' ? 'trophy' : proj.statusTone === 'live' ? 'bolt' : 'cpu',
      badge: `CH 05 · ${proj.statusLabel.toUpperCase()}`,
      title: proj.title,
      subtitle: `${stackText} — ${proj.summary}`,
      keywords: `${proj.id} ${proj.title} ${stackText} ${(proj.categories || []).join(' ')} ${proj.summary} ${proj.statusLabel}`.toLowerCase(),
      route: `#projects/${proj.id}`
    });
  });

  skillGroups.forEach((group) => {
    const toolsText = (group.tools || []).join(', ');
    entries.push({
      id: `skill-${group.id}`,
      scope: 'proof',
      icon: group.id === 'backend-systems' ? 'database' : 'cpu',
      badge: 'CH 04 · CAPABILITY',
      title: group.title,
      subtitle: toolsText,
      keywords: `${group.title} ${group.shortLabel} ${toolsText} ${group.statement}`.toLowerCase(),
      route: '#skills'
    });
  });

  const featuredCert = credentialsData.featured;
  if (featuredCert) {
    entries.push({
      id: 'cert-aws',
      scope: 'proof',
      icon: 'check',
      badge: 'CH 06 · CERTIFIED',
      title: featuredCert.title,
      subtitle: `${featuredCert.issuer} · Validation 4268afe835cd4e5c990d98399b7847a1`,
      keywords: `${featuredCert.title} aws cloud practitioner clf-c02 4268afe835cd4e5c990d98399b7847a1 certification`.toLowerCase(),
      route: '#certifications'
    });
  }

  (credentialsData.honorsAndCompetitions || []).forEach((item, idx) => {
    entries.push({
      id: `honor-${idx}`,
      scope: 'proof',
      icon: 'trophy',
      badge: `CH 06 · ${item.categoryLabel.toUpperCase()}`,
      title: item.title,
      subtitle: `${item.issuer} · ${item.dateLabel}`,
      keywords: `${item.title} ${item.issuer} ${item.summary} ${item.categoryLabel}`.toLowerCase(),
      route: item.route || '#certifications'
    });
  });

  (educationData.institutions || []).forEach((inst) => {
    entries.push({
      id: `edu-${inst.id}`,
      scope: 'proof',
      icon: 'stamp',
      badge: 'CH 03 · PASSPORT',
      title: inst.name,
      subtitle: `${inst.degreeOrProgram} · ${inst.location}`,
      keywords: `${inst.name} ${inst.degreeOrProgram} ${inst.location} ${(inst.coursework || []).join(' ')}`.toLowerCase(),
      route: '#education'
    });
  });

  return entries;
}

export function createCommandTunerController({ navigateTo, sound, isPowered }) {
  const modal = document.getElementById('cmd-tuner-modal');
  const triggerBtn = document.getElementById('cmd-tuner-trigger');
  const tvElement = document.getElementById('tv');
  if (!modal) {
    return { init() {}, close() {}, open() {}, isOpen: () => false };
  }

  const catalog = buildSearchCatalog();
  let query = '';
  let activeScope = 'all';
  let activeIdx = 0;
  let lastFocusedEl = null;

  function getFilteredItems() {
    const q = query.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

    const matched = catalog.filter((entry) => {
      if (activeScope !== 'all' && entry.scope !== activeScope) return false;
      if (!tokens.length) return true;
      return tokens.every((tok) => entry.keywords.includes(tok));
    });

    if (tokens.length) {
      matched.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(q) ? 0 : 1;
        const bTitle = b.title.toLowerCase().includes(q) ? 0 : 1;
        return aTitle - bTitle;
      });
    }

    return matched.slice(0, 12);
  }

  function renderResultsList() {
    const listMount = document.getElementById('cmd-tuner-results');
    const countMount = document.getElementById('cmd-tuner-count');
    if (!listMount) return;

    const results = getFilteredItems();
    if (activeIdx >= results.length) activeIdx = 0;

    if (countMount) {
      countMount.textContent = `${results.length} ${results.length === 1 ? 'SIGNAL' : 'SIGNALS'}`;
    }

    if (!results.length) {
      listMount.innerHTML = `
        <div class="cmd-empty-state">
          <strong>NO MATCHING FREQUENCY</strong>
          <span>Try searching PostgreSQL, ROOMS, NASA, AWS, Java, COLMAP, or UPV.</span>
        </div>
      `;
      return;
    }

    listMount.innerHTML = results
      .map(
        (item, idx) => `
        <button
          type="button"
          class="cmd-result-row ${idx === activeIdx ? 'is-active' : ''}"
          data-cmd-route="${escapeHtml(item.route)}"
          data-cmd-idx="${idx}"
        >
          <span class="cmd-result-icon">${renderIcon(item.icon)}</span>
          <span class="cmd-result-body">
            <span class="cmd-result-top">
              <strong class="cmd-result-title">${escapeHtml(item.title)}</strong>
              <span class="cmd-result-badge">${escapeHtml(item.badge)}</span>
            </span>
            <span class="cmd-result-sub">${escapeHtml(item.subtitle)}</span>
          </span>
          <span class="cmd-result-enter" aria-hidden="true">↵</span>
        </button>
      `
      )
      .join('');
  }

  function renderModalShell() {
    modal.innerHTML = `
      <div class="cmd-tuner-backdrop" data-cmd-close="true"></div>
      <div class="cmd-tuner-dialog">
        <div class="cmd-tuner-searchbar">
          <span class="cmd-search-lead" aria-hidden="true">${renderIcon('search')}</span>
          <input
            type="search"
            id="cmd-tuner-input"
            class="cmd-tuner-input"
            placeholder="Tune to channel, project, or stack (PostgreSQL, ROOMS, AWS, Java...)"
            value="${escapeHtml(query)}"
            autocomplete="off"
            spellcheck="false"
            aria-label="Search channels, projects, and skills"
          >
          <button type="button" class="btn-back-home cmd-close-btn" data-cmd-close="true">
            ${renderIcon('close')} ESC
          </button>
        </div>

        <div class="cmd-scope-bar" role="toolbar" aria-label="Filter search category">
          ${SCOPE_FILTERS.map(
            (f) => `
            <button
              type="button"
              class="course-pill ${activeScope === f.id ? 'is-active' : ''}"
              data-cmd-scope="${escapeHtml(f.id)}"
              aria-pressed="${activeScope === f.id ? 'true' : 'false'}"
            >
              ${escapeHtml(f.label)}
            </button>
          `
          ).join('')}
          <span class="cmd-result-count" id="cmd-tuner-count" aria-live="polite"></span>
        </div>

        <div class="cmd-tuner-results" id="cmd-tuner-results" role="region" aria-label="Matching broadcast frequencies"></div>

        <div class="cmd-tuner-footer">
          <span>↑↓ SELECT FREQUENCY · ↵ TUNE · ESC CLOSE</span>
          <span>SHORTCUT: / OR CTRL+K</span>
        </div>
      </div>
    `;
    renderResultsList();
  }

  function isOpen() {
    return !modal.hidden;
  }

  function open() {
    if (!isPowered() || tvElement?.classList.contains('is-blank')) return;
    if (isOpen()) {
      document.getElementById('cmd-tuner-input')?.focus();
      return;
    }

    lastFocusedEl = document.activeElement;
    query = '';
    activeScope = 'all';
    activeIdx = 0;
    renderModalShell();
    document.getElementById('channel-osd')?.classList.remove('visible');
    modal.hidden = false;
    triggerBtn?.setAttribute('aria-expanded', 'true');
    sound?.uiTap?.();
    requestAnimationFrame(() => {
      document.getElementById('cmd-tuner-input')?.focus({ preventScroll: true });
    });
  }

  function close({ restoreFocus = true } = {}) {
    if (!isOpen()) return;
    modal.hidden = true;
    triggerBtn?.setAttribute('aria-expanded', 'false');
    if (restoreFocus && lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus({ preventScroll: true });
    }
    lastFocusedEl = null;
  }

  function selectResult(route) {
    if (!route) return;
    sound?.scanBeep?.(activeIdx);
    close({ restoreFocus: false });
    navigateTo(route);
  }

  function init() {
    triggerBtn?.addEventListener('click', () => {
      if (isOpen()) close();
      else open();
    });

    modal.addEventListener('input', (event) => {
      if (event.target.id === 'cmd-tuner-input') {
        query = event.target.value || '';
        activeIdx = 0;
        renderResultsList();
      }
    });

    modal.addEventListener('click', (event) => {
      if (event.target.closest('[data-cmd-close]')) {
        close();
        return;
      }

      const scopeBtn = event.target.closest('[data-cmd-scope]');
      if (scopeBtn) {
        activeScope = scopeBtn.getAttribute('data-cmd-scope') || 'all';
        activeIdx = 0;
        sound?.uiTap?.();
        modal.querySelectorAll('[data-cmd-scope]').forEach((btn) => {
          const active = btn.getAttribute('data-cmd-scope') === activeScope;
          btn.classList.toggle('is-active', active);
          btn.setAttribute('aria-pressed', String(active));
        });
        renderResultsList();
        document.getElementById('cmd-tuner-input')?.focus({ preventScroll: true });
        return;
      }

      const rowBtn = event.target.closest('[data-cmd-route]');
      if (rowBtn) {
        activeIdx = Number(rowBtn.getAttribute('data-cmd-idx') || 0);
        selectResult(rowBtn.getAttribute('data-cmd-route'));
      }
    });

    document.addEventListener('keydown', (event) => {
      if (isOpen()) {
        if (event.key === 'Escape') {
          event.preventDefault();
          close();
          return;
        }
        const results = getFilteredItems();
        if (event.key === 'ArrowDown' && results.length) {
          event.preventDefault();
          activeIdx = (activeIdx + 1) % results.length;
          sound?.uiTap?.();
          renderResultsList();
          modal.querySelector('.cmd-result-row.is-active')?.scrollIntoView({ block: 'nearest' });
          return;
        }
        if (event.key === 'ArrowUp' && results.length) {
          event.preventDefault();
          activeIdx = (activeIdx - 1 + results.length) % results.length;
          sound?.uiTap?.();
          renderResultsList();
          modal.querySelector('.cmd-result-row.is-active')?.scrollIntoView({ block: 'nearest' });
          return;
        }
        if (event.key === 'Enter' && results[activeIdx]) {
          const focusedRouteBtn = event.target.closest?.('[data-cmd-route]');
          if (focusedRouteBtn) return;
          event.preventDefault();
          selectResult(results[activeIdx].route);
          return;
        }
        return;
      }

      const isModK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
      const tag = event.target?.tagName?.toLowerCase();
      const inEditable = tag === 'input' || tag === 'textarea' || tag === 'select' || event.target?.isContentEditable;

      if (isModK) {
        event.preventDefault();
        open();
        return;
      }

      if (event.key === '/' && !inEditable && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const lightboxOpen =
          !document.getElementById('retro-lightbox')?.hidden &&
          Boolean(document.getElementById('retro-lightbox'));
        if (lightboxOpen) return;
        event.preventDefault();
        open();
      }
    });
  }

  return { init, open, close, isOpen };
}
