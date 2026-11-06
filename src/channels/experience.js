import { escapeHtml } from '../core/dom.js';
import { experienceMilestones } from '../data/experience.js';
import { renderChannelHeader, renderChannelFooter } from '../components/channel-header.js';
import { renderTimeline } from '../components/timeline.js';
import { renderVisionDock, pulseVisionDock } from '../components/vision-dock.js';
import { prefersReducedMotion } from '../core/preferences.js';

const expandedMilestones = new Set(['contract-mena']);
const milestoneActiveTabs = new Map();
let activeExpCategory = 'all';

const EXP_FILTERS = [
  { id: 'all', label: 'ALL MILESTONES' },
  { id: 'live', label: 'SHIPPED SYSTEMS' },
  { id: 'award', label: 'EXCHANGE & HONORS' },
  { id: 'neutral', label: 'COMPETITIONS' }
];

const EXP_TIPS = [
  'Tap any milestone or numbered pill to inspect architecture & screenshots.',
  'Switch between 01 Role, 02 Architecture, and 03 Verified Proof inside any milestone.',
  'Every shipped milestone links straight to live deployments and case studies.'
];
let expTipIdx = 0;

function getFilteredMilestones() {
  if (activeExpCategory === 'all') return experienceMilestones;
  return experienceMilestones.filter((m) => m.badgeTone === activeExpCategory);
}

function renderExperienceBody() {
  const visible = getFilteredMilestones();
  const allExpanded = visible.length > 0 && visible.every((m) => expandedMilestones.has(m.id));

  return `
    <div class="timeline-toolbar">
      <div class="skill-filter-bar exp-filter-bar" role="toolbar" aria-label="Filter engineering milestones">
        ${EXP_FILTERS.map((f) => {
          const count =
            f.id === 'all'
              ? experienceMilestones.length
              : experienceMilestones.filter((m) => m.badgeTone === f.id).length;
          const isActive = activeExpCategory === f.id;
          return `
            <button
              type="button"
              class="filter-chip ${isActive ? 'is-active' : ''}"
              data-exp-filter="${escapeHtml(f.id)}"
              aria-pressed="${isActive ? 'true' : 'false'}"
            >
              ${escapeHtml(f.label)} (${count})
            </button>
          `;
        }).join('')}
      </div>
      <button type="button" class="filter-chip" data-timeline-expand-all="${allExpanded ? 'collapse' : 'expand'}">
        ${allExpanded ? '⊟ COLLAPSE ALL' : '⊞ EXPAND ALL'}
      </button>
    </div>

    ${renderTimeline(visible, expandedMilestones, milestoneActiveTabs)}
  `;
}

export function renderExperienceChannel() {
  return `
    <article class="channel-view" aria-label="Experience and engineering journey transmission">
      ${renderChannelHeader({
        eyebrow: 'CH 02 // TRANSMISSION: EXPERIENCE & JOURNEY',
        title: 'ENGINEERING IN PRACTICE',
        subtitle:
          'Contract software delivery, live event platforms, European academic exchange, and algorithmic competitions.'
      })}

      ${renderVisionDock({
        message: '5 verified milestones · tap avatar for tips',
        actions: [
          { id: 'exp-shipped', icon: 'bolt', label: 'Shipped Only' },
          { id: 'exp-proof-view', icon: 'layers', label: 'Proof Thumbnails' },
          { id: 'exp-expand-all', icon: 'spark', label: 'Open All Dossiers' }
        ]
      })}

      <div id="experience-timeline-mount">
        ${renderExperienceBody()}
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
    if (!document.getElementById('experience-timeline-mount')) return;

    if (event.target.closest('[data-dock-avatar]')) {
      expTipIdx = (expTipIdx + 1) % EXP_TIPS.length;
      pulseVisionDock(EXP_TIPS[expTipIdx]);
      return;
    }

    const dockBtn = event.target.closest('[data-dock-action]');
    if (dockBtn) {
      const act = dockBtn.getAttribute('data-dock-action');
      if (act === 'exp-shipped') {
        activeExpCategory = 'live';
        experienceMilestones
          .filter((m) => m.badgeTone === 'live')
          .forEach((m) => expandedMilestones.add(m.id));
        pulseVisionDock('Filtered to 3 live delivered web & event systems!');
      } else if (act === 'exp-proof-view') {
        activeExpCategory = 'all';
        experienceMilestones.forEach((m) => {
          expandedMilestones.add(m.id);
          milestoneActiveTabs.set(m.id, 'proof');
        });
        pulseVisionDock('Switched all milestones to 03 Verified Proof with project thumbnails!');
      } else if (act === 'exp-expand-all') {
        activeExpCategory = 'all';
        experienceMilestones.forEach((m) => {
          expandedMilestones.add(m.id);
          milestoneActiveTabs.set(m.id, 'all');
        });
        pulseVisionDock('Expanded complete engineering specs across all 5 milestones.');
      }
      const mount = document.getElementById('experience-timeline-mount');
      if (mount) mount.innerHTML = renderExperienceBody();
      return;
    }

    const filterBtn = event.target.closest('[data-exp-filter]');
    if (filterBtn) {
      activeExpCategory = filterBtn.getAttribute('data-exp-filter') || 'all';
      const visible = getFilteredMilestones();
      if (visible[0]) expandedMilestones.add(visible[0].id);
      const mount = document.getElementById('experience-timeline-mount');
      if (mount) mount.innerHTML = renderExperienceBody();
      return;
    }

    const jumpBtn = event.target.closest('[data-timeline-jump]');
    if (jumpBtn) {
      const targetId = jumpBtn.getAttribute('data-timeline-jump');
      if (!targetId) return;
      expandedMilestones.add(targetId);
      const mount = document.getElementById('experience-timeline-mount');
      if (mount) mount.innerHTML = renderExperienceBody();
      const cardEl = document.getElementById(`milestone-card-${targetId}`);
      cardEl?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      return;
    }

    const subTabBtn = event.target.closest('[data-milestone-tab]');
    if (subTabBtn) {
      const milestoneId = subTabBtn.getAttribute('data-milestone-tab');
      const tabKey = subTabBtn.getAttribute('data-tab-key') || 'overview';
      if (!milestoneId) return;
      milestoneActiveTabs.set(milestoneId, tabKey);
      expandedMilestones.add(milestoneId);
      const mount = document.getElementById('experience-timeline-mount');
      if (mount) mount.innerHTML = renderExperienceBody();
      return;
    }

    const toggleBtn = event.target.closest('[data-timeline-toggle]');
    if (toggleBtn) {
      const milestoneId = toggleBtn.getAttribute('data-timeline-toggle');
      if (!milestoneId) return;

      if (expandedMilestones.has(milestoneId)) {
        expandedMilestones.delete(milestoneId);
      } else {
        expandedMilestones.add(milestoneId);
      }

      const mount = document.getElementById('experience-timeline-mount');
      if (mount) mount.innerHTML = renderExperienceBody();
      return;
    }

    const expandAllBtn = event.target.closest('[data-timeline-expand-all]');
    if (expandAllBtn) {
      const action = expandAllBtn.getAttribute('data-timeline-expand-all');
      const visible = getFilteredMilestones();
      if (action === 'collapse') {
        visible.forEach((m) => expandedMilestones.delete(m.id));
      } else {
        visible.forEach((m) => expandedMilestones.add(m.id));
      }
      const mount = document.getElementById('experience-timeline-mount');
      if (mount) mount.innerHTML = renderExperienceBody();
    }
  });
}
