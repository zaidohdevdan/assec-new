import * as React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SkipLink from "@/components/layout/SkipLink";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PWAInstallBanner } from "@/components/ui/PWAInstallBanner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <PWAInstallBanner />
    </>
  );
}
