import { escapeHtml, resolveAsset } from '../core/dom.js';
import { profile } from '../data/profile.js';
import { renderIcon } from './icons.js';

export function renderVisionDock({ message, actions = [] }) {
  return `
    <div class="vision-dock" role="region" aria-label="Channel quick actions">
      <button
        type="button"
        class="vision-dock-avatar-btn"
        data-dock-avatar="true"
        title="Tap Vision for channel tip"
        aria-label="Vision interactive guide avatar"
      >
        <span class="vision-dock-viewport">
          <img
            src="${escapeHtml(resolveAsset(profile.companion.spriteSrc))}"
            alt=""
            class="character-spritesheet vision-dock-sprite"
            decoding="async"
            draggable="false"
          >
        </span>
      </button>
      <span class="vision-dock-tag"><i class="meta-dot"></i> VISION</span>
      ${
        actions.length
          ? `
        <div class="vision-dock-actions">
          ${actions
            .map((act) => {
              const iconSvg = act.icon ? renderIcon(act.icon, 'dock-chip-icon') : '';
              return act.route
                ? `<a href="${escapeHtml(act.route)}" class="dock-chip" data-route="${escapeHtml(act.route)}">${iconSvg}<span>${escapeHtml(act.label)}</span></a>`
                : `<button type="button" class="dock-chip" data-dock-action="${escapeHtml(act.id)}">${iconSvg}<span>${escapeHtml(act.label)}</span></button>`;
            })
            .join('')}
        </div>
      `
          : ''
      }
      <span class="vision-dock-msg" id="vision-dock-msg" aria-live="polite">${escapeHtml(message)}</span>
    </div>
  `;
}

export function pulseVisionDock(newMessage) {
  const msgEl = document.getElementById('vision-dock-msg');
  const dockEl = msgEl?.closest('.vision-dock');
  if (msgEl && newMessage) {
    msgEl.textContent = newMessage;
  }
  if (dockEl) {
    dockEl.classList.add('has-pulsed');
    dockEl.classList.remove('is-talking');
    void dockEl.offsetWidth;
    dockEl.classList.add('is-talking');
    setTimeout(() => dockEl.classList.remove('is-talking'), 380);
  }
}
