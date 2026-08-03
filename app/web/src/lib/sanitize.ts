import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u',
  'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'a', 'img', 'figure', 'figcaption',
  'iframe',
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'blockquote', 'pre', 'code',
  'span', 'div', 'hr', 'sub', 'sup',
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'class', 'target', 'rel',
  'width', 'height', 'allowfullscreen', 'style',
];

/**
 * Sanitizes HTML content using DOMPurify.
 *
 * Replaces the previous regex-based sanitizer which was vulnerable to
 * multiple XSS bypass vectors (javascript: URIs, unquoted event handlers,
 * SVG/onload, data: URIs, etc.).
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}
