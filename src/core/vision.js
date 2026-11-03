import { escapeHtml } from './dom.js';
import { profile } from '../data/profile.js';

export function createVisionController({ screenContent, isPowered }) {
  const quotes = profile.companion.quotesByChannel.home;
  let currentQuoteIdx = 0;
  let bubbleTimer = null;
  let reactTimer = null;
  let initialIntroShown = false;
  let reactionCount = 0;

  function showQuote(customText = null, duration = 4200) {
    const bubble = document.getElementById('speech-bubble');
    const bubbleText = document.getElementById('bubble-text');
    const character = document.getElementById('character-vision');
    if (!bubble || !bubbleText) return;

    const quote = customText || quotes[(currentQuoteIdx = (currentQuoteIdx + 1) % quotes.length)];
    const lines = String(quote).split('\n');
    bubbleText.innerHTML = lines.map((line) => `<span>${escapeHtml(line)}</span>`).join('');

    bubble.classList.remove('is-active');
    void bubble.offsetWidth;
    bubble.classList.add('is-active');
    bubble.setAttribute('aria-hidden', 'false');
    character?.setAttribute('aria-expanded', 'true');

    character?.classList.remove('is-reacting');
    void character?.offsetWidth;
    character?.classList.add('is-reacting');
    clearTimeout(reactTimer);
    reactTimer = setTimeout(() => character?.classList.remove('is-reacting'), 320);

    reactionCount += 1;

    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => {
      hideQuote();
    }, duration);
  }

  function hideQuote() {
    const bubble = document.getElementById('speech-bubble');
    const character = document.getElementById('character-vision');
    clearTimeout(bubbleTimer);
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
      setTimeout(() => {
        if (document.getElementById('character-vision') && isPowered()) {
          showQuote(profile.companion.defaultGreeting, 4000);
        }
      }, 500);
    }
  }

  function init() {
    // Single delegated listener set installed once — prevents listener leaks across Home re-renders
    screenContent.addEventListener('click', (event) => {
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

      hideQuote();
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
    onChannelRendered,
    getReactionCount: () => reactionCount
  };
}
