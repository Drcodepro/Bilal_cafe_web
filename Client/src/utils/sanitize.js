/**
 * Input sanitization utilities.
 * Prevents XSS by escaping dangerous HTML characters in user inputs.
 */

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

const HTML_ESCAPE_REGEX = /[&<>"'/]/g;

/**
 * Escapes HTML special characters to prevent XSS in rendered output.
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string safe for rendering
 */
export function escapeHtml(input) {
  if (typeof input !== 'string') return '';
  return input.replace(HTML_ESCAPE_REGEX, (char) => HTML_ESCAPE_MAP[char]);
}

/**
 * Sanitizes a search query: trims whitespace, limits length, removes control chars.
 * @param {string} query - Raw search input
 * @param {number} maxLength - Maximum allowed length (default 100)
 * @returns {string} Sanitized search query
 */
export function sanitizeSearchQuery(query, maxLength = 100) {
  if (typeof query !== 'string') return '';
  return query
    .replace(/[\x00-\x1F\x7F]/g, '') // strip control characters
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitizes a text note (e.g., order instructions).
 * @param {string} note - Raw note text
 * @param {number} maxLength - Maximum allowed length (default 500)
 * @returns {string} Sanitized note
 */
export function sanitizeNote(note, maxLength = 500) {
  if (typeof note !== 'string') return '';
  return note
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim()
    .slice(0, maxLength);
}
