import { skillGroups } from '../data/skills.js';
import { renderChannelHeader, renderChannelFooter } from '../components/channel-header.js';
import { renderSkillExplorer } from '../components/skill-evidence.js';

let activeSkillFilter = 'all';

export function renderSkillsChannel() {
  return `
    <article class="channel-view" aria-label="Technical skills and evidence transmission">
      ${renderChannelHeader({
        eyebrow: 'CH 04 // TRANSMISSION: CAPABILITY MATRIX',
        title: 'CAPABILITIES & PROOF',
        subtitle:
          'Evidence-backed engineering capabilities linked directly to shipped systems, case studies, and active prototypes — no self-rated percentages.'
      })}

      <div id="skill-explorer-mount">
        ${renderSkillExplorer(skillGroups, activeSkillFilter)}
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
    const filterBtn = event.target.closest('[data-skill-filter]');
    if (!filterBtn) return;

    const nextFilter = filterBtn.getAttribute('data-skill-filter') || 'all';
    activeSkillFilter = nextFilter;

    const mount = document.getElementById('skill-explorer-mount');
    if (mount) {
      mount.innerHTML = renderSkillExplorer(skillGroups, activeSkillFilter);
      const restoredBtn = mount.querySelector(`[data-skill-filter="${CSS.escape(activeSkillFilter)}"]`);
      restoredBtn?.focus({ preventScroll: true });
    }
  });
}
