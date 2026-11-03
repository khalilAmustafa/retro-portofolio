import { escapeHtml } from './dom.js';
import { profile } from '../data/profile.js';
import { prefersReducedMotion } from './preferences.js';

export const VISION_HOME_PROMPTS = [
  {
    id: 'tour',
    label: '★ Quick Tour',
    bubble: "START AT CH 05!\nREAL VIDEOS & LIVE SITES.",
    detail: 'CH 05 has live playable demos, ROOMS gameplay video, and architecture simulators.',
    actionLabel: 'Open CH 05 Projects →',
    actionRoute: '#projects'
  },
  {
    id: 'award',
    label: '🏆 Hackathon Win',
    bubble: "3RD PLACE REPLIT AI!\nWATCH ROOMS IN ACTION →",
    detail: 'ROOMS by VISION placed 3rd in the Replit AI Hackathon with multiplayer study arenas.',
    actionLabel: 'Watch ROOMS Demo →',
    actionRoute: '#projects/rooms'
  },
  {
    id: 'systems',
    label: '⚡ Live Systems',
    bubble: "380+ PARTICIPANTS!\nNASA SPACE APPS + BANDUP.",
    detail: 'Delivered NASA Space Apps Jordan, Space Day Digital Passport, and BandUp IELTS.',
    actionLabel: 'Inspect NASA Case Study →',
    actionRoute: '#projects/nasa-space-apps'
  },
  {
    id: 'hire',
    label: '📬 Open to Roles',
    bubble: "BACKEND · CLOUD · AI!\nAMMAN (UTC+3) & REMOTE.",
    detail: 'Available for software engineering internships, junior backend/cloud roles, and contract builds.',
    actionLabel: 'Compose Signal (CH 07) →',
    actionRoute: '#contact'
  }
];

export function createVisionController({ screenContent, isPowered, sound }) {
  const quotes = profile.companion.quotesByChannel.home;
  let currentQuoteIdx = 0;
  let bubbleTimer = null;
  let reactTimer = null;
  let typeTimer = null;
  let introTimer = null;
  let initialIntroShown = false;
  let reactionCount = 0;

  function renderBubbleLines(bubbleText, rawQuote, animate = true) {
    clearInterval(typeTimer);
    const lines = String(rawQuote).split('\n');
    if (!animate || prefersReducedMotion()) {
      bubbleText.innerHTML = lines.map((line) => `<span>${escapeHtml(line)}</span>`).join('');
      return;
    }

    const spans = lines.map(() => {
      const s = document.createElement('span');
      s.textContent = '';
      return s;
    });
    bubbleText.replaceChildren(...spans);

    let lineIdx = 0;
    let charIdx = 0;
    typeTimer = setInterval(() => {
      if (!bubbleText.isConnected || lineIdx >= lines.length) {
        clearInterval(typeTimer);
        return;
      }
      const targetLine = lines[lineIdx];
      spans[lineIdx].textContent = targetLine.slice(0, charIdx + 1);
      charIdx += 1;
      if (charIdx >= targetLine.length) {
        lineIdx += 1;
        charIdx = 0;
      }
    }, 10);
  }

  function showQuote(customText = null, duration = 5200, { playAudio = true } = {}) {
    clearTimeout(introTimer);
    const bubble = document.getElementById('speech-bubble');
    const bubbleText = document.getElementById('bubble-text');
    const character = document.getElementById('character-vision');
    if (!bubble || !bubbleText) return;

    const quote = customText || quotes[(currentQuoteIdx = (currentQuoteIdx + 1) % quotes.length)];
    renderBubbleLines(bubbleText, quote, true);

    bubble.classList.remove('is-active');
    void bubble.offsetWidth;
    bubble.classList.add('is-active');
    bubble.setAttribute('aria-hidden', 'false');
    character?.setAttribute('aria-expanded', 'true');

    character?.classList.remove('is-reacting');
    void character?.offsetWidth;
    character?.classList.add('is-reacting');
    clearTimeout(reactTimer);
    reactTimer = setTimeout(() => character?.classList.remove('is-reacting'), 340);

    if (playAudio) sound?.visionTalk?.();
    reactionCount += 1;

    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => {
      hideQuote();
    }, duration);
  }

  function activatePrompt(promptId) {
    const item = VISION_HOME_PROMPTS.find((p) => p.id === promptId);
    if (!item) return;

    showQuote(item.bubble, 6200, { playAudio: true });

    screenContent.querySelectorAll('[data-vision-prompt]').forEach((btn) => {
      const active = btn.getAttribute('data-vision-prompt') === promptId;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    const slot = document.getElementById('vision-action-slot');
    if (slot) {
      slot.innerHTML = `
        <div class="vision-callout-card">
          <p class="vision-callout-text">${escapeHtml(item.detail)}</p>
          <a href="${escapeHtml(item.actionRoute)}" class="btn-card-link primary btn-compact" data-route="${escapeHtml(item.actionRoute)}">
            ${escapeHtml(item.actionLabel)}
          </a>
        </div>
      `;
    }
  }

  function hideQuote() {
    const bubble = document.getElementById('speech-bubble');
    const character = document.getElementById('character-vision');
    clearTimeout(bubbleTimer);
    clearInterval(typeTimer);
    if (!bubble) return;
    bubble.classList.remove('is-active');
    bubble.setAttribute('aria-hidden', 'true');
    character?.setAttribute('aria-expanded', 'false');
  }

  function onChannelRendered(channelSlug) {
    if (channelSlug !== 'home') {
      hideQuote();
      return;
    }

    if (!initialIntroShown && isPowered()) {
      initialIntroShown = true;
      introTimer = setTimeout(() => {
        if (reactionCount === 0 && document.getElementById('character-vision') && isPowered()) {
          showQuote("HEY! I'M VISION.\nTAP A PROMPT BELOW!", 4600, { playAudio: false });
        }
      }, 320);
    }
  }

  function init() {
    // Single delegated listener set installed once — prevents listener leaks across Home re-renders
    screenContent.addEventListener('click', (event) => {
      const promptBtn = event.target.closest('[data-vision-prompt]');
      if (promptBtn) {
        event.stopPropagation();
        activatePrompt(promptBtn.getAttribute('data-vision-prompt'));
        return;
      }

      const charTarget = event.target.closest('#character-vision');
      const bubbleTarget = event.target.closest('#speech-bubble');

      if (bubbleTarget) {
        event.stopPropagation();
        hideQuote();
        return;
      }

      if (charTarget) {
        event.stopPropagation();
        showQuote();
        return;
      }

      if (!event.target.closest('#vision-action-slot')) {
        hideQuote();
      }
    });

    screenContent.addEventListener('keydown', (event) => {
      const charTarget = event.target.closest('#character-vision');
      if (!charTarget) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showQuote();
      } else if (event.key === 'Escape') {
        hideQuote();
      }
    });
  }

  return {
    init,
    showQuote,
    hideQuote,
    activatePrompt,
    onChannelRendered,
    getReactionCount: () => reactionCount
  };
}
