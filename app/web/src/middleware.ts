import { NextResponse, type NextRequest } from "next/server";

// Must match the cookie name issued by the backend (auth.controller.ts)
const SESSION_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Host-assec_session"
    : "assec_session";

/**
 * Cheap first gate for authenticated areas: no session cookie, no page.
 * This only checks that the cookie EXISTS (the Edge runtime cannot validate
 * the JWT against the database). Real authorization happens in
 * `(portal)/layout.tsx` (server-side /auth/me) and in the backend guards.
 */
export function middleware(request: NextRequest) {
  if (!request.cookies.get(SESSION_COOKIE)?.value) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/portal/:path*", "/campanhas/:path*"],
};

