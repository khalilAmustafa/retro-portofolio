import { experienceMilestones } from '../data/experience.js';
import { renderChannelHeader, renderChannelFooter } from '../components/channel-header.js';
import { renderTimeline } from '../components/timeline.js';

const expandedMilestones = new Set(['contract-mena', 'space-day-workflow']);

export function renderExperienceChannel() {
  const allExpanded = expandedMilestones.size === experienceMilestones.length;

  return `
    <article class="channel-view" aria-label="Experience and engineering journey transmission">
      ${renderChannelHeader({
        eyebrow: 'CH 02 // TRANSMISSION: EXPERIENCE & JOURNEY',
        title: 'ENGINEERING IN PRACTICE',
        subtitle:
          'Contract software delivery, live event platforms, European academic exchange, and algorithmic competitions.'
      })}

      <div class="timeline-toolbar">
        <span class="timeline-toolbar-hint">SELECT ANY MILESTONE TO INSPECT CONTEXT, DECISIONS &amp; EVIDENCE</span>
        <button type="button" class="filter-chip" data-timeline-expand-all="${allExpanded ? 'collapse' : 'expand'}">
          ${allExpanded ? 'COLLAPSE ALL' : 'EXPAND ALL'}
        </button>
      </div>

      <div id="experience-timeline-mount">
        ${renderTimeline(experienceMilestones, expandedMilestones)}
      </div>

      ${renderChannelFooter({
        nextRoute: '#education',
        nextLabel: 'Next: CH 03 Education →'
      })}
    </article>
  `;
}

export function bindExperienceEvents(screenContent) {
  screenContent.addEventListener('click', (event) => {
    const toggleBtn = event.target.closest('[data-timeline-toggle]');
    if (toggleBtn) {
      const milestoneId = toggleBtn.getAttribute('data-timeline-toggle');
      if (!milestoneId) return;

      const isNowExpanded = !expandedMilestones.has(milestoneId);
      if (isNowExpanded) {
        expandedMilestones.add(milestoneId);
      } else {
        expandedMilestones.delete(milestoneId);
      }

      const itemEl = toggleBtn.closest('.timeline-item');
      const panelEl = document.getElementById(`timeline-panel-${milestoneId}`);
      const cueEl = toggleBtn.querySelector('.timeline-expand-cue');
      toggleBtn.setAttribute('aria-expanded', String(isNowExpanded));
      itemEl?.classList.toggle('is-expanded', isNowExpanded);
      if (panelEl) panelEl.hidden = !isNowExpanded;
      if (cueEl) {
        cueEl.textContent = isNowExpanded
          ? '▾ HIDE ENGINEERING DETAILS'
          : '▸ INSPECT DECISIONS & PROOF';
      }

      const expandAllBtn = screenContent.querySelector('[data-timeline-expand-all]');
      if (expandAllBtn) {
        const allOpen = expandedMilestones.size === experienceMilestones.length;
        expandAllBtn.setAttribute('data-timeline-expand-all', allOpen ? 'collapse' : 'expand');
        expandAllBtn.textContent = allOpen ? 'COLLAPSE ALL' : 'EXPAND ALL';
      }
      return;
    }

    const expandAllBtn = event.target.closest('[data-timeline-expand-all]');
    if (expandAllBtn) {
      const action = expandAllBtn.getAttribute('data-timeline-expand-all');
      if (action === 'collapse') {
        expandedMilestones.clear();
      } else {
        experienceMilestones.forEach((m) => expandedMilestones.add(m.id));
      }
      const mount = document.getElementById('experience-timeline-mount');
      if (mount) {
        mount.innerHTML = renderTimeline(experienceMilestones, expandedMilestones);
      }
      const allOpen = expandedMilestones.size === experienceMilestones.length;
      expandAllBtn.setAttribute('data-timeline-expand-all', allOpen ? 'collapse' : 'expand');
      expandAllBtn.textContent = allOpen ? 'COLLAPSE ALL' : 'EXPAND ALL';
    }
  });
}
