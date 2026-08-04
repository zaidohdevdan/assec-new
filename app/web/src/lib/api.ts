const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * Reads the CSRF token from the assec_csrf cookie.
 * Returns empty string if not found (e.g., server-side rendering).
 */
function getCsrfToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|;\s*)assec_csrf=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const method = (options.method ?? 'GET').toUpperCase();
  const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  return fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include', // Automatically sends HttpOnly cookie with every request
    headers: {
      'Content-Type': 'application/json',
      // Include CSRF token for state-changing requests (double-submit cookie pattern)
      ...(isStateChanging ? { 'X-CSRF-Token': getCsrfToken() } : {}),
      ...(options.headers ?? {}),
    },
  });
}

/**
 * Convenience wrapper — throws if the response is not OK.
 */
export async function apiFetchJson<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await apiFetch(path, options);
  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const body = await res.json();
      message = body?.message ?? message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}
