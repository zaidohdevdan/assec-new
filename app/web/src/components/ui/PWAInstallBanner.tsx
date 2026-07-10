"use client";

import * as React from "react";
import { Download, X, Share, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = React.useState(false);
  const [showHelpModal, setShowHelpModal] = React.useState(false);
  const [isIOS, setIsIOS] = React.useState(false);
  const [isStandalone, setIsStandalone] = React.useState(false);

  React.useEffect(() => {
    // 1. Register Service Worker
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "development") {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().then((success) => {
              if (success) {
                console.log("Service Worker desregistrado para desenvolvimento");
              }
            });
          }
        });
      } else {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("Service Worker registrado com sucesso:", reg.scope))
          .catch((err) => console.error("Erro ao registrar Service Worker:", err));
      }
    }

    // 2. Check if already installed (standalone mode)
    const isStandaloneMode = 
      window.matchMedia("(display-mode: standalone)").matches || 
      ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true);
    
    setIsStandalone(isStandaloneMode);

    // 3. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const detectIOS = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(detectIOS);

    // 4. Check if banner was dismissed recently (last 7 days)
    const dismissedTime = localStorage.getItem("pwa-banner-dismissed");
    const now = Date.now();
    const dismissedRecently = dismissedTime && now - parseInt(dismissedTime) < 7 * 24 * 60 * 60 * 1000;

    // 5. Handle prompt event for Chrome/Android
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isStandaloneMode && !dismissedRecently) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // 6. Show iOS banner if eligible (iOS Safari, not standalone, not dismissed recently)
    if (detectIOS && !isStandaloneMode && !dismissedRecently) {
      // Small timeout to not clutter page load instantly
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA Installation outcome: ${outcome}`);
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-banner-dismissed", Date.now().toString());
    setShowBanner(false);
  };

  if (isStandalone || !showBanner) return null;

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[380px] bg-primary/95 border border-accent/20 rounded-2xl shadow-2xl backdrop-blur-md p-5 z-[9990] text-white flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-black border border-accent/30 flex items-center justify-center shrink-0 shadow-inner overflow-hidden p-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-transparent.webp" alt="ASSEC" className="h-full w-full object-contain" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm tracking-wide text-white">Instalar Portal ASSEC</h4>
                  <p className="text-[11px] text-text-secondary">Tenha acesso rápido e offline às notícias e carteira.</p>
                </div>
              </div>
              <button 
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors focus:outline-none"
                aria-label="Dispensar aviso de instalação"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5">
              {isIOS ? (
                <Button
                  onClick={() => setShowHelpModal(true)}
                  className="flex-1 bg-accent text-primary hover:bg-accent-light text-xs font-bold uppercase tracking-widest py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow"
                >
                  <Info className="h-4 w-4" />
                  Como Instalar
                </Button>
              ) : (
                <Button
                  onClick={handleInstallClick}
                  className="flex-1 bg-accent text-primary hover:bg-accent-light text-xs font-bold uppercase tracking-widest py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow"
                >
                  <Download className="h-4 w-4" />
                  Instalar App
                </Button>
              )}
              <button 
                onClick={handleDismiss}
                className="px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-bold uppercase tracking-widest text-gray-300 transition-colors"
              >
                Agora Não
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Step-by-Step Installation Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setShowHelpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-sm bg-primary border border-accent/25 rounded-2xl p-6 shadow-2xl text-white flex flex-col gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="font-serif font-bold text-base text-accent">Instalar no iPhone / iPad</h3>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors focus:outline-none"
                  aria-label="Fechar guia de ajuda"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Steps Description */}
              <div className="flex flex-col gap-4 font-sans text-sm leading-relaxed text-gray-200">
                <p className="text-xs text-text-secondary mb-1">
                  Siga estas etapas fáceis no navegador Safari para adicionar o app à sua tela de início:
                </p>
                
                {/* Step 1 */}
                <div className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0 font-bold text-accent text-xs">1</div>
                  <div>
                    <span>Toque no botão de <strong>Compartilhar</strong> na barra inferior do Safari.</span>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-accent-light/90">
                      <Share className="h-4 w-4 stroke-[2.5]" />
                      <span>(Ícone de quadrado com seta para cima)</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0 font-bold text-accent text-xs">2</div>
                  <div>
                    <span>Role o menu de opções para baixo e selecione a opção <strong>&quot;Adicionar à Tela de Início&quot;</strong>.</span>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-accent-light/90">
                      <div className="h-4 w-4 border border-accent-light/40 rounded flex items-center justify-center font-bold font-serif text-[10px]">+</div>
                      <span>(Pode estar representado por um ícone de +)</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0 font-bold text-accent text-xs">3</div>
                  <div>
                    <span>Confirme clicando em <strong>&quot;Adicionar&quot;</strong> no canto superior direito.</span>
                  </div>
                </div>
              </div>

              {/* Close Button Action */}
              <Button
                onClick={() => {
                  setShowHelpModal(false);
                  setShowBanner(false);
                  localStorage.setItem("pwa-banner-dismissed", Date.now().toString());
                }}
                className="w-full bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest py-3 rounded-xl shadow"
              >
                Entendi
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
