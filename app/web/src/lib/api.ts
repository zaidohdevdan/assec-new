/**
 * Secure API fetch utility — always sends credentials (HttpOnly session cookie)
 * instead of reading the JWT from localStorage (which would be XSS-vulnerable).
 *
 * Usage:
 *   import { apiFetch } from "@/lib/api";
 *   const data = await apiFetch("/users");
 *
 * The browser automatically attaches the __Host-assec_session cookie.
 * The 'Authorization: Bearer' header is NOT needed and NOT sent.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include', // Automatically sends HttpOnly cookie with every request
    headers: {
      'Content-Type': 'application/json',
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
