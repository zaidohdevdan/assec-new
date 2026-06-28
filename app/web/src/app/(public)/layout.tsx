import * as React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SkipLink from "@/components/layout/SkipLink";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PWAInstallBanner } from "@/components/ui/PWAInstallBanner";
import { PWASplashScreen } from "@/components/ui/PWASplashScreen";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" className="flex-1 flex flex-col w-full min-w-0 focus:outline-none" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <PWAInstallBanner />
      <PWASplashScreen />
    </>
  );
}
