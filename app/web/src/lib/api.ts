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

  // If making a state-changing request and CSRF token cookie is missing, fetch it first
  if (
    isStateChanging &&
    typeof window !== 'undefined' &&
    !getCsrfToken() &&
    path !== '/auth/csrf'
  ) {
    try {
      await fetch(`${API_BASE}/auth/csrf`, { credentials: 'include' });
    } catch {
      // ignore network errors on CSRF pre-fetch
    }
  }

  let token = getCsrfToken();
  let res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include', // Automatically sends HttpOnly cookie with every request
    headers: {
      'Content-Type': 'application/json',
      // Include CSRF token for state-changing requests (double-submit cookie pattern)
      ...(isStateChanging && token ? { 'X-CSRF-Token': token } : {}),
      ...(options.headers ?? {}),
    },
  });

  // Automatic 1-retry on 403 CSRF error: fetch a fresh token and retry the state-changing request
  if (res.status === 403 && isStateChanging && path !== '/auth/csrf') {
    try {
      const csrfRes = await fetch(`${API_BASE}/auth/csrf`, { credentials: 'include' });
      if (csrfRes.ok) {
        token = getCsrfToken();
        res = await fetch(`${API_BASE}${path}`, {
          ...options,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'X-CSRF-Token': token } : {}),
            ...(options.headers ?? {}),
          },
        });
      }
    } catch {
      // return original response if retry fails
    }
  }

  return res;
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
