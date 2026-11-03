import { escapeHtml } from '../core/dom.js';
import { projects, projectsById } from '../data/projects.js';
import { renderChannelHeader, renderChannelFooter } from '../components/channel-header.js';
import { renderProjectGallery } from '../components/project-gallery.js';
import { renderProjectDetail } from '../components/project-detail.js';

let activeProjectFilter = 'All';
let lastLightboxTrigger = null;

export function renderProjectsChannel(route = {}) {
  if (route.subRoute && projectsById[route.subRoute]) {
    const project = projectsById[route.subRoute];
    return `
      <article class="channel-view is-subview" aria-label="${escapeHtml(project.title)} case study">
        ${renderProjectDetail({ project, allProjects: projects })}
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

      <div id="projects-gallery-mount">
        ${renderProjectGallery({
          allProjects: projects,
          activeFilter: activeProjectFilter,
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

export function bindProjectsEvents(screenContent) {
  screenContent.addEventListener('click', (event) => {
    const filterBtn = event.target.closest('[data-project-filter]');
    if (filterBtn) {
      const nextFilter = filterBtn.getAttribute('data-project-filter') || 'All';
      activeProjectFilter = nextFilter;

      const mount = document.getElementById('projects-gallery-mount');
      if (mount) {
        mount.innerHTML = renderProjectGallery({
          allProjects: projects,
          activeFilter: activeProjectFilter,
          unknownProjectId: null
        });
        const restoredBtn = mount.querySelector(
          `[data-project-filter="${CSS.escape(activeProjectFilter)}"]`
        );
        restoredBtn?.focus({ preventScroll: true });
      }
      return;
    }

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
