import { escapeHtml, resolveAsset } from '../core/dom.js';
import { profile } from '../data/profile.js';

export function renderVisionDock({ message, actions = [] }) {
  return `
    <aside class="vision-dock" aria-label="Vision channel guide">
      <button
        type="button"
        class="vision-dock-avatar-btn"
        data-dock-avatar="true"
        title="Tap Vision for another tip"
        aria-label="Vision interactive guide avatar"
      >
        <span class="vision-dock-viewport">
          <img
            src="${escapeHtml(resolveAsset(profile.companion.spriteSrc))}"
            alt=""
            class="character-spritesheet vision-dock-sprite"
            draggable="false"
          >
        </span>
      </button>
      <div class="vision-dock-body">
        <div class="vision-dock-topline">
          <span class="vision-dock-tag"><i class="meta-dot"></i> VISION // CO-PILOT</span>
          <span class="vision-dock-msg" id="vision-dock-msg">${escapeHtml(message)}</span>
        </div>
        ${
          actions.length
            ? `
          <div class="vision-dock-actions">
            ${actions
              .map((act) =>
                act.route
                  ? `<a href="${escapeHtml(act.route)}" class="dock-chip" data-route="${escapeHtml(act.route)}">${escapeHtml(act.label)}</a>`
                  : `<button type="button" class="dock-chip" data-dock-action="${escapeHtml(act.id)}">${escapeHtml(act.label)}</button>`
              )
              .join('')}
          </div>
        `
            : ''
        }
      </div>
    </aside>
  `;
}

export function pulseVisionDock(newMessage) {
  const msgEl = document.getElementById('vision-dock-msg');
  const dockEl = msgEl?.closest('.vision-dock');
  if (msgEl && newMessage) {
    msgEl.textContent = newMessage;
  }
  if (dockEl) {
    dockEl.classList.remove('is-talking');
    void dockEl.offsetWidth;
    dockEl.classList.add('is-talking');
    setTimeout(() => dockEl.classList.remove('is-talking'), 380);
  }
}
