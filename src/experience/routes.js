import { PROJECT_IDS } from './state.js';
export function resolveExperienceRoute(hash, validProjectIds = []) {
  let route;
  try { route = decodeURIComponent(String(hash).replace(/^#\/?/, '')).replace(/\/+$/, ''); }
  catch { return { view: 'library', projectId: null, legacyHash: null }; }
  if (!route || route === 'room' || route === 'home') return { view: 'room', projectId: null, legacyHash: null };
  if (route === 'projects' || route === 'work') return { view: 'library', projectId: null, legacyHash: null };
  if (route.startsWith('projects/')) {
    const id = route.split('/')[1];
    if (PROJECT_IDS.includes(id)) return { view: 'project', projectId: id, legacyHash: null };
    if (validProjectIds.includes(id)) return { view: 'project', projectId: id, legacyHash: null };
    return { view: 'library', projectId: null, legacyHash: null };
  }
  const channels = ['archive','experience','education','skills','certifications','contact'];
  const channelId=({about:'experience',credentials:'certifications'})[route]??route;
  if(channels.includes(channelId))return {view:'channel',channelId,projectId:null,legacyHash:null};
  return { view: 'library', projectId: null, legacyHash: null };
}
