import { escapeHtml } from '../core/dom.js';
import { projects, projectsById } from '../data/projects.js';
import { renderChannelHeader, renderChannelFooter } from '../components/channel-header.js';
import { renderProjectGallery } from '../components/project-gallery.js';
import { renderProjectDetail } from '../components/project-detail.js';
import { renderArchitectureSchematic, renderProjectMediaSection } from '../components/image-gallery.js';
import { renderVisionDock, pulseVisionDock } from '../components/vision-dock.js';

let activeProjectFilter = 'All';
let liveLinksOnly = false;
const cardFrames = new Map();
const caseMediaState = new Map();
const caseArchState = new Map();
const caseTradeoffState = new Map();
let archSimTimer = null;
let lastLightboxTrigger = null;

const PROJ_TIPS = [
  'Use the ◀ / ▶ arrows right on any project card to scrub through its real screenshots, or open a dossier to trace its architecture!',
  'Every live deployment link opens the real hosted platform in a new tab.',
  'Inside any case study, click "▶ Trace Signal Flow" to watch requests step through the pipeline!'
];
let projTipIdx = 0;

function mountGallery() {
  const mount = document.getElementById('projects-gallery-mount');
  if (mount) {
    mount.innerHTML = renderProjectGallery({
      allProjects: projects,
      activeFilter: activeProjectFilter,
      liveOnly: liveLinksOnly,
      cardFrames,
      unknownProjectId: null
    });
  }
}

export function renderProjectsChannel(route = {}) {
  clearInterval(archSimTimer);

  if (route.subRoute && projectsById[route.subRoute]) {
    const project = projectsById[route.subRoute];
    return `
      <article class="channel-view is-subview" aria-label="${escapeHtml(project.title)} case study">
        ${renderProjectDetail({
          project,
          allProjects: projects,
          activeMediaIdx: caseMediaState.has(project.id) ? caseMediaState.get(project.id) : null,
          activeArchIdx: caseArchState.get(project.id) || 0,
          activeTradeoffTab: caseTradeoffState.get(project.id) || 'all'
        })}
        ${renderLightboxMarkup()}
      </article>
    `;
  }

  return `
    <article class="channel-view" aria-label="Selected projects transmission">
      ${renderChannelHeader({
        eyebrow: 'CH 05 // TRANSMISSION: SELECTED WORK',
        title: 'SYSTEMS & CASE STUDIES',
        subtitle:
          'Shipped event platforms, hackathon winners, active systems verification tools, and applied-AI learning workflows.'
      })}

      ${renderVisionDock({
        message: PROJ_TIPS[0],
        actions: [
          { label: '🏆 Watch ROOMS Demo', route: '#projects/rooms' },
          { id: 'proj-live-only', label: '🌐 Live Links Only' },
          { id: 'proj-random', label: '🎲 Random Case Study' },
          { id: 'proj-reset', label: '↺ Show All (10)' }
        ]
      })}

      <div id="projects-gallery-mount">
        ${renderProjectGallery({
          allProjects: projects,
          activeFilter: activeProjectFilter,
          liveOnly: liveLinksOnly,
          cardFrames,
          unknownProjectId: route.unknownProjectId || null
        })}
      </div>

      ${renderChannelFooter({
        nextRoute: '#certifications',
        nextLabel: 'Next: CH 06 Certifications →'
      })}

      ${renderLightboxMarkup()}
    </article>
  `;
}

function renderLightboxMarkup() {
  return `
    <div class="retro-lightbox" id="retro-lightbox" role="dialog" aria-modal="true" aria-label="Enlarged project evidence" hidden>
      <div class="retro-lightbox-backdrop" data-lightbox-close="true"></div>
      <div class="retro-lightbox-dialog">
        <div class="retro-lightbox-bar">
          <span class="retro-lightbox-title">ARTIFACT INSPECTION</span>
          <button type="button" class="btn-back-home" id="retro-lightbox-close" data-lightbox-close="true">✕ CLOSE (ESC)</button>
        </div>
        <img src="" alt="" id="retro-lightbox-img" class="retro-lightbox-img">
        <p id="retro-lightbox-caption" class="retro-lightbox-caption"></p>
      </div>
    </div>
  `;
}

function closeLightbox() {
  const modal = document.getElementById('retro-lightbox');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  lastLightboxTrigger?.focus({ preventScroll: true });
  lastLightboxTrigger = null;
}

export function bindProjectsEvents(screenContent, { sound, navigateTo } = {}) {
  screenContent.addEventListener('click', (event) => {
    const galleryMount = document.getElementById('projects-gallery-mount');
    const caseView = screenContent.querySelector('[data-case-study]');

    if (galleryMount && event.target.closest('[data-dock-avatar]')) {
      projTipIdx = (projTipIdx + 1) % PROJ_TIPS.length;
      pulseVisionDock(PROJ_TIPS[projTipIdx]);
      return;
    }

    const dockBtn = galleryMount ? event.target.closest('[data-dock-action]') : null;
    if (dockBtn) {
      const act = dockBtn.getAttribute('data-dock-action');
      if (act === 'proj-live-only') {
        activeProjectFilter = 'All';
        liveLinksOnly = true;
        pulseVisionDock('Filtered to projects with verified live deployments or public repos!');
        mountGallery();
      } else if (act === 'proj-random') {
        const pick = projects[Math.floor(Math.random() * projects.length)];
        if (pick && navigateTo) {
          navigateTo(`#projects/${pick.id}`);
        }
      } else if (act === 'proj-reset') {
        activeProjectFilter = 'All';
        liveLinksOnly = false;
        pulseVisionDock('Showing all 10 featured case studies and archive builds.');
        mountGallery();
      }
      return;
    }

    const filterBtn = event.target.closest('[data-project-filter]');
    if (filterBtn) {
      activeProjectFilter = filterBtn.getAttribute('data-project-filter') || 'All';
      liveLinksOnly = false;
      mountGallery();
      const restoredBtn = document.querySelector(
        `#projects-gallery-mount [data-project-filter="${CSS.escape(activeProjectFilter)}"]`
      );
      restoredBtn?.focus({ preventScroll: true });
      return;
    }

    const liveBtn = event.target.closest('[data-project-live-only]');
    if (liveBtn) {
      liveLinksOnly = !liveLinksOnly;
      mountGallery();
      return;
    }

    // Gallery card screenshot scrubber (◀ / ▶ or dot)
    const scrubArrow = event.target.closest('[data-card-scrub-proj]');
    if (scrubArrow) {
      event.preventDefault();
      event.stopPropagation();
      const projId = scrubArrow.getAttribute('data-card-scrub-proj');
      const dir = Number(scrubArrow.getAttribute('data-card-scrub-dir') || 1);
      const proj = projectsById[projId];
      if (!proj) return;
      const readyCount = (proj.media || []).filter((m) => m.ready && m.type !== 'video').length;
      if (readyCount > 1) {
        const next = ((cardFrames.get(projId) || 0) + dir + readyCount) % readyCount;
        cardFrames.set(projId, next);
        mountGallery();
      }
      return;
    }

    const scrubDot = event.target.closest('[data-card-frame-proj]');
    if (scrubDot) {
      event.preventDefault();
      event.stopPropagation();
      const projId = scrubDot.getAttribute('data-card-frame-proj');
      const idx = Number(scrubDot.getAttribute('data-card-frame-idx') || 0);
      if (projId) {
        cardFrames.set(projId, idx);
        mountGallery();
      }
      return;
    }

    // Case study filmstrip switcher
    const filmstripBtn = event.target.closest('[data-stage-media-idx]');
    if (filmstripBtn && caseView) {
      const projId = caseView.getAttribute('data-case-study');
      const proj = projectsById[projId];
      const nextIdx = Number(filmstripBtn.getAttribute('data-stage-media-idx') || 0);
      if (proj) {
        caseMediaState.set(projId, nextIdx);
        const mediaMount = document.getElementById('case-media-mount');
        if (mediaMount) {
          mediaMount.innerHTML = `
            <div class="card-header-row">
              <h2 class="skill-category-title">01 // INTERACTIVE MEDIA &amp; LIVE ARTIFACTS</h2>
              <span class="card-badge">SELECT FRAME BELOW</span>
            </div>
            ${renderProjectMediaSection(proj, { activeMediaIdx: nextIdx })}
          `;
        }
      }
      return;
    }

    // Case study architecture stage click
    const archStepBtn = event.target.closest('[data-arch-step]');
    if (archStepBtn && caseView) {
      clearInterval(archSimTimer);
      const projId = caseView.getAttribute('data-case-study');
      const proj = projectsById[projId];
      const stepIdx = Number(archStepBtn.getAttribute('data-arch-step') || 0);
      if (proj) {
        caseArchState.set(projId, stepIdx);
        sound?.scanBeep?.(stepIdx);
        const archMount = document.getElementById('case-arch-mount');
        if (archMount) {
          archMount.innerHTML = `
            <h2 class="skill-category-title">04 // INTERACTIVE SYSTEM ARCHITECTURE</h2>
            ${renderArchitectureSchematic(proj.architecture, { compact: false, activeStepIdx: stepIdx })}
          `;
        }
      }
      return;
    }

    // Case study architecture flow simulator ("▶ TRACE SIGNAL FLOW")
    const archSimBtn = event.target.closest('[data-arch-simulate]');
    if (archSimBtn && caseView) {
      clearInterval(archSimTimer);
      const projId = caseView.getAttribute('data-case-study');
      const proj = projectsById[projId];
      const total = proj?.architecture?.nodes?.length || 0;
      if (!proj || total === 0) return;

      let step = 0;
      const updateArch = (idx) => {
        caseArchState.set(projId, idx);
        sound?.scanBeep?.(idx);
        const archMount = document.getElementById('case-arch-mount');
        if (archMount) {
          archMount.innerHTML = `
            <h2 class="skill-category-title">04 // INTERACTIVE SYSTEM ARCHITECTURE</h2>
            ${renderArchitectureSchematic(proj.architecture, { compact: false, activeStepIdx: idx })}
          `;
        }
      };

      updateArch(0);
      archSimTimer = setInterval(() => {
        step += 1;
        if (step >= total || !document.getElementById('case-arch-mount')) {
          clearInterval(archSimTimer);
          return;
        }
        updateArch(step);
      }, 460);
      return;
    }

    // Case study engineering tradeoff tabs
    const tradeoffBtn = event.target.closest('[data-tradeoff-tab]');
    if (tradeoffBtn && caseView) {
      const projId = caseView.getAttribute('data-case-study');
      const tab = tradeoffBtn.getAttribute('data-tradeoff-tab') || 'all';
      const proj = projectsById[projId];
      if (proj) {
        caseTradeoffState.set(projId, tab);
        screenContent.innerHTML = renderProjectsChannel({ channelSlug: 'projects', subRoute: projId });
      }
      return;
    }

    // Lightbox open/close
    const zoomBtn = event.target.closest('[data-lightbox-src]');
    if (zoomBtn) {
      const modal = document.getElementById('retro-lightbox');
      const img = document.getElementById('retro-lightbox-img');
      const caption = document.getElementById('retro-lightbox-caption');
      if (!modal || !img) return;

      lastLightboxTrigger = zoomBtn;
      img.src = zoomBtn.getAttribute('data-lightbox-src') || '';
      img.alt = zoomBtn.getAttribute('data-lightbox-alt') || '';
      if (caption) {
        caption.textContent = zoomBtn.getAttribute('data-lightbox-caption') || '';
      }
      modal.hidden = false;
      document.getElementById('retro-lightbox-close')?.focus({ preventScroll: true });
      return;
    }

    if (event.target.closest('[data-lightbox-close]')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
    }
  });
}
