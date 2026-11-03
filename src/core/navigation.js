export const CHANNELS = Object.freeze([
  { index: 0, slug: 'home', label: 'Home' },
  { index: 1, slug: 'experience', label: 'Experience' },
  { index: 2, slug: 'education', label: 'Education' },
  { index: 3, slug: 'skills', label: 'Skills' },
  { index: 4, slug: 'projects', label: 'Projects' },
  { index: 5, slug: 'certifications', label: 'Certifications' },
  { index: 6, slug: 'contact', label: 'Contact' }
]);

const SLUG_TO_CHANNEL = Object.freeze(
  Object.fromEntries(CHANNELS.map((ch) => [ch.slug, ch]))
);

const SLUG_ALIASES = Object.freeze({
  credentials: 'certifications',
  work: 'projects',
  about: 'experience'
});

/**
 * Pure hash route parser — safe to run in Node/Vitest without DOM globals.
 */
export function parseHashRoute(rawHash = '', validProjectIds = []) {
  const validSet = validProjectIds instanceof Set ? validProjectIds : new Set(validProjectIds);
  const trimmed = String(rawHash || '').trim().replace(/^#\/?/, '').replace(/\/+$/, '');

  if (!trimmed) {
    return {
      channelIndex: 0,
      channelSlug: 'home',
      channelLabel: 'Home',
      subRoute: null,
      unknownProjectId: null,
      canonicalHash: '#home',
      isFallback: false
    };
  }

  const parts = trimmed.split('/').map((part) => decodeURIComponent(part).trim().toLowerCase());
  const rawSlug = parts[0];
  const resolvedSlug = SLUG_ALIASES[rawSlug] || rawSlug;
  const channel = SLUG_TO_CHANNEL[resolvedSlug];

  if (!channel) {
    return {
      channelIndex: 0,
      channelSlug: 'home',
      channelLabel: 'Home',
      subRoute: null,
      unknownProjectId: null,
      canonicalHash: '#home',
      isFallback: true
    };
  }

  if (channel.slug === 'projects' && parts.length > 1 && parts[1]) {
    const candidateId = parts[1];
    if (validSet.has(candidateId)) {
      return {
        channelIndex: channel.index,
        channelSlug: channel.slug,
        channelLabel: channel.label,
        subRoute: candidateId,
        unknownProjectId: null,
        canonicalHash: `#projects/${candidateId}`,
        isFallback: false
      };
    }

    return {
      channelIndex: channel.index,
      channelSlug: channel.slug,
      channelLabel: channel.label,
      subRoute: null,
      unknownProjectId: candidateId,
      canonicalHash: '#projects',
      isFallback: true
    };
  }

  return {
    channelIndex: channel.index,
    channelSlug: channel.slug,
    channelLabel: channel.label,
    subRoute: null,
    unknownProjectId: null,
    canonicalHash: `#${channel.slug}`,
    isFallback: false
  };
}

export function formatChannelHash(channelIndex) {
  const normalized = ((Number(channelIndex) % CHANNELS.length) + CHANNELS.length) % CHANNELS.length;
  return `#${CHANNELS[normalized].slug}`;
}

export function createNavigationController({
  validProjectIds,
  screenContent,
  onRouteChanged,
  onChannelSwitchEffect
}) {
  let currentRoute = null;
  let previousRoute = null;
  let projectsGalleryScrollTop = 0;
  let focusScreenAfterRender = false;

  function applyRouteFromHash(rawHash, { isInitial = false } = {}) {
    const nextRoute = parseHashRoute(rawHash, validProjectIds);

    // Save gallery scroll if transitioning from #projects gallery into #projects/<id>
    if (
      currentRoute &&
      currentRoute.channelSlug === 'projects' &&
      !currentRoute.subRoute &&
      nextRoute.channelSlug === 'projects' &&
      nextRoute.subRoute
    ) {
      projectsGalleryScrollTop = screenContent.scrollTop;
    }

    const channelChanged = !currentRoute || currentRoute.channelIndex !== nextRoute.channelIndex;
    const subRouteChanged =
      !currentRoute ||
      currentRoute.subRoute !== nextRoute.subRoute ||
      currentRoute.unknownProjectId !== nextRoute.unknownProjectId;

    if (!isInitial && !channelChanged && !subRouteChanged) {
      return;
    }

    const returningToGalleryFromDetail =
      currentRoute &&
      currentRoute.channelSlug === 'projects' &&
      Boolean(currentRoute.subRoute) &&
      nextRoute.channelSlug === 'projects' &&
      !nextRoute.subRoute;

    previousRoute = currentRoute;
    currentRoute = nextRoute;

    onRouteChanged(nextRoute, {
      isInitial,
      channelChanged,
      subRouteChanged,
      previousRoute
    });

    if (returningToGalleryFromDetail) {
      screenContent.scrollTop = projectsGalleryScrollTop;
    } else {
      if (channelChanged && nextRoute.channelSlug !== 'projects') {
        projectsGalleryScrollTop = 0;
      }
      if (channelChanged && nextRoute.channelSlug === 'projects' && !nextRoute.subRoute) {
        projectsGalleryScrollTop = 0;
      }
      screenContent.scrollTop = 0;
    }

    if (!isInitial && channelChanged) {
      onChannelSwitchEffect?.();
    }

    if (focusScreenAfterRender) {
      focusScreenAfterRender = false;
      const heading = screenContent.querySelector('h1, [data-autofocus]');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      } else {
        screenContent.focus({ preventScroll: true });
      }
    }
  }

  function navigateToHash(targetHash, { moveFocus = false } = {}) {
    if (!targetHash) return;
    const normalizedTarget = targetHash.startsWith('#') ? targetHash : `#${targetHash}`;
    const parsedTarget = parseHashRoute(normalizedTarget, validProjectIds);

    // If clicking "Back to Projects" after opening a detail from the gallery in this session, pop history cleanly
    if (
      normalizedTarget === '#projects' &&
      currentRoute?.channelSlug === 'projects' &&
      currentRoute?.subRoute &&
      previousRoute?.channelSlug === 'projects' &&
      !previousRoute?.subRoute &&
      window.history.length > 1
    ) {
      focusScreenAfterRender = moveFocus;
      window.history.back();
      return;
    }

    focusScreenAfterRender = moveFocus;

    if (window.location.hash === normalizedTarget) {
      applyRouteFromHash(normalizedTarget, { isInitial: false });
      return;
    }

    // Preserve unknown project slug once so user sees graceful fallback banner if navigating to an unknown hash
    window.location.hash = parsedTarget.unknownProjectId
      ? `#projects/${parsedTarget.unknownProjectId}`
      : parsedTarget.canonicalHash;
  }

  function selectChannel(nextIndex, { moveFocus = false } = {}) {
    const wrapped = ((Number(nextIndex) % CHANNELS.length) + CHANNELS.length) % CHANNELS.length;
    const targetHash = formatChannelHash(wrapped);
    if (
      currentRoute &&
      currentRoute.channelIndex === wrapped &&
      !currentRoute.subRoute &&
      !currentRoute.unknownProjectId
    ) {
      return;
    }
    navigateToHash(targetHash, { moveFocus });
  }

  function init() {
    window.addEventListener('hashchange', () => {
      applyRouteFromHash(window.location.hash, { isInitial: false });
    });

    // Delegated click handler for in-screen route links & legacy [data-select-channel] buttons
    screenContent.addEventListener('click', (event) => {
      const routeTrigger = event.target.closest('[data-route]');
      if (routeTrigger) {
        if (
          routeTrigger.tagName === 'A' &&
          (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
        ) {
          return;
        }
        event.preventDefault();
        const route = routeTrigger.getAttribute('data-route');
        navigateToHash(route, { moveFocus: true });
        return;
      }

      const channelBtn = event.target.closest('[data-select-channel]');
      if (channelBtn) {
        event.preventDefault();
        const targetCh = parseInt(channelBtn.getAttribute('data-select-channel'), 10);
        if (!Number.isNaN(targetCh)) {
          selectChannel(targetCh, { moveFocus: true });
        }
      }
    });

    applyRouteFromHash(window.location.hash, { isInitial: true });
  }

  return {
    init,
    selectChannel,
    navigateToHash,
    getCurrentRoute: () => currentRoute
  };
}
