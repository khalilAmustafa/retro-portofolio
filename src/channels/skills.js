import { skillGroups } from '../data/skills.js';
import { renderChannelHeader, renderChannelFooter } from '../components/channel-header.js';
import { renderSkillExplorer } from '../components/skill-evidence.js';
import { renderVisionDock, pulseVisionDock } from '../components/vision-dock.js';

let activeSkillFilter = 'all';
let activeToolSpotlight = null;
let expandedCapKey = 'backend-systems::0';
let liveOnlyFilter = false;

const SKILL_TIPS = [
  'Tap any Technology pill (like PostgreSQL or Java) to spotlight matching capabilities, or click a row to preview its project screenshot!',
  'Zero made-up skill percentages — every capability links directly to a real system or credential.',
  'Toggle "● Live & Certified Only" to filter straight to production-verified skills.'
];
let skillTipIdx = 0;

function mountSkills() {
  const mount = document.getElementById('skill-explorer-mount');
  if (mount) {
    mount.innerHTML = renderSkillExplorer(skillGroups, {
      selectedGroupId: activeSkillFilter,
      activeTool: activeToolSpotlight,
      expandedCapKey,
      liveOnly: liveOnlyFilter
    });
  }
}

export function renderSkillsChannel() {
  return `
    <article class="channel-view" aria-label="Technical skills and evidence transmission">
      ${renderChannelHeader({
        eyebrow: 'CH 04 // TRANSMISSION: CAPABILITY MATRIX',
        title: 'CAPABILITIES & PROOF',
        subtitle:
          'Evidence-backed engineering capabilities linked directly to shipped systems, case studies, and active prototypes — no self-rated percentages.'
      })}

      ${renderVisionDock({
        message: SKILL_TIPS[0],
        actions: [
          { id: 'skill-live', label: '⚡ Live & Certified Only' },
          { id: 'skill-backend', label: '🗄 Spotlight PostgreSQL' },
          { id: 'skill-ai', label: '🤖 Spotlight Applied AI' },
          { id: 'skill-reset', label: '↺ Reset Matrix' }
        ]
      })}

      <div id="skill-explorer-mount">
        ${renderSkillExplorer(skillGroups, {
          selectedGroupId: activeSkillFilter,
          activeTool: activeToolSpotlight,
          expandedCapKey,
          liveOnly: liveOnlyFilter
        })}
      </div>

      ${renderChannelFooter({
        nextRoute: '#projects',
        nextLabel: 'Next: CH 05 Projects →'
      })}
    </article>
  `;
}

export function bindSkillsEvents(screenContent) {
  screenContent.addEventListener('click', (event) => {
    if (!document.getElementById('skill-explorer-mount')) return;

    if (event.target.closest('[data-dock-avatar]')) {
      skillTipIdx = (skillTipIdx + 1) % SKILL_TIPS.length;
      pulseVisionDock(SKILL_TIPS[skillTipIdx]);
      return;
    }

    const dockBtn = event.target.closest('[data-dock-action]');
    if (dockBtn) {
      const act = dockBtn.getAttribute('data-dock-action');
      if (act === 'skill-live') {
        activeSkillFilter = 'all';
        activeToolSpotlight = null;
        liveOnlyFilter = true;
        pulseVisionDock('Showing only capabilities verified in live events or earned certifications!');
      } else if (act === 'skill-backend') {
        activeSkillFilter = 'all';
        liveOnlyFilter = false;
        activeToolSpotlight = 'PostgreSQL';
        expandedCapKey = 'backend-systems::0';
        pulseVisionDock('Spotlighting PostgreSQL relational workflows & Space Day proof!');
      } else if (act === 'skill-ai') {
        activeSkillFilter = 'applied-ai';
        liveOnlyFilter = false;
        activeToolSpotlight = null;
        expandedCapKey = 'applied-ai::0';
        pulseVisionDock('Focused Applied AI — structured outputs, BandUp, ROOMS, & Futureing!');
      } else if (act === 'skill-reset') {
        activeSkillFilter = 'all';
        activeToolSpotlight = null;
        liveOnlyFilter = false;
        expandedCapKey = 'backend-systems::0';
        pulseVisionDock('Reset full capability matrix across all 5 engineering domains.');
      }
      mountSkills();
      return;
    }

    const filterBtn = event.target.closest('[data-skill-filter]');
    if (filterBtn) {
      const nextFilter = filterBtn.getAttribute('data-skill-filter') || 'all';
      activeSkillFilter = nextFilter;
      if (nextFilter === 'all') liveOnlyFilter = false;
      mountSkills();
      const restoredBtn = document.querySelector(
        `#skill-explorer-mount [data-skill-filter="${CSS.escape(activeSkillFilter)}"]`
      );
      restoredBtn?.focus({ preventScroll: true });
      return;
    }

    const liveBtn = event.target.closest('[data-skill-live-toggle]');
    if (liveBtn) {
      liveOnlyFilter = !liveOnlyFilter;
      mountSkills();
      return;
    }

    const toolBtn = event.target.closest('[data-tool-spotlight]');
    if (toolBtn) {
      const toolVal = toolBtn.getAttribute('data-tool-spotlight') || '';
      activeToolSpotlight = toolVal ? toolVal : null;
      if (activeToolSpotlight) activeSkillFilter = 'all';
      mountSkills();
      return;
    }

    const capPreviewBtn = event.target.closest('[data-cap-preview]');
    if (capPreviewBtn) {
      const key = capPreviewBtn.getAttribute('data-cap-preview');
      expandedCapKey = expandedCapKey === key ? null : key;
      mountSkills();
    }
  });
}
