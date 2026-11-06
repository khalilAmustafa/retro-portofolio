/**
 * Cohesive 1.5px-stroke monochrome vector icons for the retro CRT interface.
 * Replaces platform-inconsistent Unicode emoji with crisp, cap-height-aligned SVGs.
 */
const ICON_PATHS = {
  spark: '<path d="M8 1.5L9.6 6.4L14.5 8L9.6 9.6L8 14.5L6.4 9.6L1.5 8L6.4 6.4Z"/>',
  trophy: '<path d="M4.5 2.5H11.5V6.5C11.5 8.4 9.9 10 8 10C6.1 10 4.5 8.4 4.5 6.5V2.5Z"/><path d="M4.5 4H2.5V5.5C2.5 6.9 3.4 7.8 4.6 8M11.5 4H13.5V5.5C13.5 6.9 12.6 7.8 11.4 8"/><path d="M8 10V13M5.5 13.5H10.5"/>',
  bolt: '<path d="M9 1.5L3.5 9H8L7 14.5L12.5 7H8L9 1.5Z"/>',
  mail: '<rect x="2" y="3.5" width="12" height="9" rx="1"/><path d="M2.5 4L8 8.5L13.5 4"/>',
  stamp: '<path d="M6 3.5C6 2.4 6.9 1.5 8 1.5C9.1 1.5 10 2.4 10 3.5C10 4.8 9 5.5 9 7H7C7 5.5 6 4.8 6 3.5Z"/><path d="M3 9.5H13V11.5H3Z"/><path d="M4 13.5H12"/>',
  cpu: '<rect x="4" y="4" width="8" height="8" rx="1"/><path d="M6.5 1.5V4M9.5 1.5V4M6.5 12V14.5M9.5 12V14.5M1.5 6.5H4M1.5 9.5H4M12 6.5H14.5M12 9.5H14.5"/>',
  globe: '<circle cx="8" cy="8" r="6"/><path d="M2 8H14M8 2C9.8 3.8 10.6 5.8 10.6 8C10.6 10.2 9.8 12.2 8 14C6.2 12.2 5.4 10.2 5.4 8C5.4 5.8 6.2 3.8 8 2Z"/>',
  layers: '<path d="M8 2L14 5.2L8 8.4L2 5.2L8 2Z"/><path d="M2 8.2L8 11.4L14 8.2"/><path d="M2 11.2L8 14.4L14 11.2"/>',
  reset: '<path d="M3 8C3 5.2 5.2 3 8 3C10.1 3 11.9 4.2 12.6 6"/><path d="M13 2.8V6.2H9.6"/><path d="M13 8C13 10.8 10.8 13 8 13C5.9 13 4.1 11.8 3.4 10"/>',
  shuffle: '<path d="M2 4.5H5.2L10.8 11.5H14"/><path d="M12 9.5L14 11.5L12 13.5"/><path d="M2 11.5H5.2L6.8 9.5M9.2 6.5L10.8 4.5H14"/><path d="M12 2.5L14 4.5L12 6.5"/>',
  copy: '<rect x="5.5" y="5.5" width="8" height="8" rx="1"/><path d="M3.5 10.5H2.5V2.5H10.5V3.5"/>',
  check: '<path d="M2.5 8.5L6.2 12.2L13.5 4.2"/>',
  zoom: '<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14M7 5V9M5 7H9"/>',
  play: '<path d="M4.5 3L12.5 8L4.5 13V3Z"/>',
  briefcase: '<rect x="2" y="4.5" width="12" height="8.5" rx="1"/><path d="M5.5 4.5V3C5.5 2.4 6 2 6.5 2H9.5C10 2 10.5 2.4 10.5 3V4.5M2 8.5H14"/>',
  search: '<circle cx="7" cy="7" r="4.6"/><path d="M10.5 10.5L14 14"/>',
  plane: '<path d="M2 9.5L14 4L10.5 13.5L7.8 9.8L2 9.5Z"/><path d="M7.8 9.8L14 4"/>',
  close: '<path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5"/>',
  chevronDown: '<path d="M4 6L8 10L12 6"/>',
  chevronLeft: '<path d="M10 3.5L5.5 8L10 12.5"/>',
  chevronRight: '<path d="M6 3.5L10.5 8L6 12.5"/>',
  external: '<path d="M5 11L11.5 4.5M6.5 4.5H11.5V9.5"/>',
  message: '<path d="M2.5 3.5H13.5V10.5H6L2.5 13.5V3.5Z"/>',
  database: '<ellipse cx="8" cy="3.8" rx="5" ry="1.8"/><path d="M3 3.8V12.2C3 13.2 5.2 14 8 14C10.8 14 13 13.2 13 12.2V3.8"/><path d="M3 8C3 9 5.2 9.8 8 9.8C10.8 9.8 13 9 13 8"/>'
};

export function renderIcon(name, className = '') {
  const body = ICON_PATHS[name] || ICON_PATHS.spark;
  const cls = ['ui-icon', className].filter(Boolean).join(' ');
  return `<svg class="${cls}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}
