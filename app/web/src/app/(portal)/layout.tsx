import PortalClientLayout from "./PortalClientLayout";
import { cookies } from "next/headers";

export const metadata = {
  title: "Portal ASSEC",
  description: "Portal do Associado e Painel do Administrador ASSEC",
};

export default async function SharedPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const profileCookie = cookieStore.get("assec_user_profile");

  let initialUser = null;
  let initialAuthorized = false;

  if (profileCookie?.value) {
    try {
      initialUser = JSON.parse(decodeURIComponent(profileCookie.value));
      initialAuthorized = true;
    } catch {
      // ignore parsing errors
    }
  }

  return (
    <PortalClientLayout
      initialUser={initialUser}
      initialAuthorized={initialAuthorized}
    >
      {children}
    </PortalClientLayout>
  );
}
