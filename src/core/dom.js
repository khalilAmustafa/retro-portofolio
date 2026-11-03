const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch]);
}

export function resolveAsset(relativePath) {
  if (!relativePath) return '';
  if (/^(https?:|mailto:|data:)/i.test(relativePath)) return relativePath;
  const clean = String(relativePath).replace(/^\/+/, '');
  const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL)
    ? import.meta.env.BASE_URL
    : './';
  return `${base.endsWith('/') ? base : `${base}/`}${clean}`;
}

export function padChannel(num) {
  return String(num).padStart(2, '0');
}

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
