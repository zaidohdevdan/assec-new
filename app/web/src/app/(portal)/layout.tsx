import PortalClientLayout from "./PortalClientLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerApiBase } from "@/lib/api";

export const metadata = {
  title: "Portal ASSEC",
  description: "Portal do Associado e Painel do Administrador ASSEC",
};

// Must match the cookie name issued by the backend (auth.controller.ts)
const SESSION_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Host-assec_session"
    : "assec_session";

/**
 * The session is validated on the SERVER against the backend (`/auth/me`),
 * forwarding the HttpOnly session cookie. Nothing the browser can write or
 * forge (like the old `assec_user_profile` cookie) is trusted to authorize
 * access, and no PII is persisted in a client-readable cookie.
 * Fails closed: any problem validating the session redirects to /login.
 */
export default async function SharedPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (!session?.value) {
    redirect("/login");
  }

  let initialUser = null;
  try {
    const res = await fetch(`${getServerApiBase()}/auth/me`, {
      headers: { Cookie: `${SESSION_COOKIE}=${session.value}` },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      initialUser = await res.json();
    }
  } catch {
    // Backend unreachable: fail closed
  }

  if (!initialUser) {
    redirect("/login");
  }

  return (
    <PortalClientLayout initialUser={initialUser} initialAuthorized>
      {children}
    </PortalClientLayout>
  );
}
