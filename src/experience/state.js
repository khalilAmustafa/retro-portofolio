export const PROJECT_IDS = Object.freeze(['space-day', 'rooms', 'bandup']);
export function createExperienceState() {
  return { view: 'room', selectedIndex: 1, projectId: null, channelId:null };
}
export function reduceExperience(state, action) {
  switch (action.type) {
    case 'ENTER': return { ...state, view: 'library', projectId: null, channelId:null };
    case 'EXIT': return { ...state, view: 'room', projectId: null, channelId:null };
    case 'SELECT':
      if (state.view !== 'library' || !Number.isFinite(action.index)) return state;
      return { ...state, selectedIndex: Math.min(2, Math.max(0, Math.round(action.index))) };
    case 'OPEN':
      if (state.view !== 'library') return state;
      return { ...state, view: 'project', projectId: PROJECT_IDS[state.selectedIndex] };
    case 'CLOSE': return { ...state, view: 'library', projectId: null, channelId:null };
    case 'ROUTE': {
      const index = PROJECT_IDS.indexOf(action.projectId);
      return { ...state, view: action.view, projectId: action.projectId ?? null, channelId:action.channelId??null,
        selectedIndex: index < 0 ? state.selectedIndex : index };
    }
    default: return state;
  }
}
