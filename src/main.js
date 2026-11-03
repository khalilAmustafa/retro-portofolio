import './styles/main.css';

import { projects, projectsById } from './data/projects.js';
import { createSoundController } from './core/sound.js';
import { createCrtController } from './core/crt.js';
import { createVisionController } from './core/vision.js';
import { createTvController } from './core/tv-controller.js';
import { createNavigationController } from './core/navigation.js';

import { renderHomeChannel } from './channels/home.js';
import { renderExperienceChannel, bindExperienceEvents } from './channels/experience.js';
import { renderEducationChannel, bindEducationEvents } from './channels/education.js';
import { renderSkillsChannel, bindSkillsEvents } from './channels/skills.js';
import { renderProjectsChannel, bindProjectsEvents } from './channels/projects.js';
import { renderCertificationsChannel, bindCertificationsEvents } from './channels/certifications.js';
import { renderContactChannel, bindContactEvents } from './channels/contact.js';

const CHANNEL_RENDERERS = {
  home: (route) => renderHomeChannel(route),
  experience: (route) => renderExperienceChannel(route),
  education: (route) => renderEducationChannel(route),
  skills: (route) => renderSkillsChannel(route),
  projects: (route) => renderProjectsChannel(route),
  certifications: (route) => renderCertificationsChannel(route),
  contact: (route) => renderContactChannel(route)
};

function bootstrapPortfolio() {
  const tvElement = document.getElementById('tv');
  const screenContent = document.getElementById('screen-content');
  if (!tvElement || !screenContent) return;

  const validProjectIds = new Set(projects.map((proj) => proj.id));
  const sound = createSoundController();

  let nav = null;

  const tv = createTvController({
    sound,
    onSelectChannel: (nextIndex) => {
      nav?.selectChannel(nextIndex);
    }
  });

  const crt = createCrtController({
    tvElement,
    onToggleSound: () => sound.clickSound(false)
  });

  const vision = createVisionController({
    screenContent,
    isPowered: () => tv.isPowered(),
    sound
  });

  nav = createNavigationController({
    validProjectIds,
    screenContent,
    onRouteChanged: (route) => {
      const renderFn = CHANNEL_RENDERERS[route.channelSlug] || CHANNEL_RENDERERS.home;
      screenContent.innerHTML = renderFn(route);

      const subTitle =
        route.channelSlug === 'projects' && route.subRoute && projectsById[route.subRoute]
          ? projectsById[route.subRoute].title
          : null;

      tv.syncShellState(route.channelIndex, subTitle);
      vision.onChannelRendered(route.channelSlug);
    },
    onChannelSwitchEffect: () => {
      tv.triggerTuningEffect();
    }
  });

  // Bind delegated interaction listeners once at boot (zero per-render listener leaks)
  tv.init();
  crt.init();
  vision.init();
  bindExperienceEvents(screenContent);
  bindEducationEvents(screenContent, { sound });
  bindSkillsEvents(screenContent);
  bindProjectsEvents(screenContent, {
    sound,
    navigateTo: (hash) => nav.navigateToHash(hash)
  });
  bindCertificationsEvents(screenContent, { sound });
  bindContactEvents(screenContent, { sound });
  nav.init();

  // Preserve V1 console helper compatibility + expose read-only QA hooks
  window.select = (channelIndex) => nav.selectChannel(channelIndex);
  window.__retroPortfolio = Object.freeze({
    getRoute: () => nav.getCurrentRoute(),
    navigateTo: (hash) => nav.navigateToHash(hash),
    getVisionReactionCount: () => vision.getReactionCount(),
    getCrtPreset: () => crt.getPreset()
  });
}

bootstrapPortfolio();
