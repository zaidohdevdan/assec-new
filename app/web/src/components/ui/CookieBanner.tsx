"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "./button";
import { ShieldAlert, Settings, X } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "assec-lgpd-consent";
const POLICY_VERSION = "2026.06.001";

interface ConsentRecord {
  status: "accepted" | "rejected" | "customized";
  categories: {
    essential: true;
    analytics: boolean;
    marketing: boolean;
  };
  timestamp: string;
  policyVersion: string;
}

// ─── Helper: read/write consent ───────────────────────────────────────────────

function getStoredConsent(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentRecord;
  } catch {
    return null;
  }
}

function saveConsent(record: ConsentRecord) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("assec:consent-change", { detail: record })
    );
  }
}

// ─── Global function for reopening the banner ─────────────────────────────────

declare global {
  interface Window {
    openCookieSettings?: () => void;
  }
}

// ─── CookieBanner Component ──────────────────────────────────────────────────

export const CookieBanner = () => {
  const [visible, setVisible] = React.useState(false);
  const [showCustomize, setShowCustomize] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);

  const openBanner = React.useCallback(() => {
    const existing = getStoredConsent();
    if (existing) {
      setAnalytics(existing.categories.analytics);
      setMarketing(existing.categories.marketing);
    }
    setShowCustomize(false);
    setVisible(true);
  }, []);

  React.useEffect(() => {
    // Expose global function for the footer link
    window.openCookieSettings = openBanner;

    const stored = getStoredConsent();
    if (!stored || stored.policyVersion !== POLICY_VERSION) {
      // No consent or policy version changed → show banner
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [openBanner]);

  const handleAcceptAll = () => {
    saveConsent({
      status: "accepted",
      categories: { essential: true, analytics: true, marketing: true },
      timestamp: new Date().toISOString(),
      policyVersion: POLICY_VERSION,
    });
    setVisible(false);
  };

  const handleRejectAll = () => {
    saveConsent({
      status: "rejected",
      categories: { essential: true, analytics: false, marketing: false },
      timestamp: new Date().toISOString(),
      policyVersion: POLICY_VERSION,
    });
    setVisible(false);
  };

  const handleSaveCustom = () => {
    saveConsent({
      status: "customized",
      categories: { essential: true, analytics, marketing },
      timestamp: new Date().toISOString(),
      policyVersion: POLICY_VERSION,
    });
    setVisible(false);
    setShowCustomize(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 md:right-8 md:left-auto md:max-w-md z-50 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 font-sans animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-5">
        <div className="flex gap-3.5 items-start">
          <div className="p-2 bg-primary text-accent rounded-lg shrink-0 mt-0.5">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-serif font-bold text-sm text-accent-light">
                Privacidade e Proteção de Dados (LGPD)
              </h3>
              <button
                onClick={() => setVisible(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Fechar banner de cookies"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed mb-4">
              Utilizamos cookies para otimizar o funcionamento do site. Você pode personalizar suas preferências ou consultar a nossa{" "}
              <Link
                href="/politica-de-privacidade"
                className="text-accent underline font-semibold hover:text-accent-light"
              >
                Política de Privacidade
              </Link>.
            </p>

            {/* Customize Panel */}
            {showCustomize && (
              <div className="mb-4 space-y-3 bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                {/* Essential - always on */}
                <label className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-white block">Essenciais</span>
                    <span className="text-[10px] text-gray-400">Necessários para o funcionamento do site.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="h-4 w-4 rounded border-slate-600 text-accent cursor-not-allowed opacity-60"
                  />
                </label>
                {/* Analytics */}
                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Análise</span>
                    <span className="text-[10px] text-gray-400">Ajudam a entender como o site é utilizado.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 text-accent cursor-pointer"
                  />
                </label>
                {/* Marketing */}
                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Marketing</span>
                    <span className="text-[10px] text-gray-400">Permitem anúncios relevantes e redes sociais.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 text-accent cursor-pointer"
                  />
                </label>
                <Button
                  onClick={handleSaveCustom}
                  className="w-full bg-accent text-primary hover:bg-accent-light text-[10px] px-4 py-1.5 h-auto font-bold animate-none mt-1"
                >
                  Salvar Preferências
                </Button>
              </div>
            )}

            <div className="flex justify-end gap-2.5">
              {!showCustomize && (
                <Button
                  variant="outline"
                  onClick={() => setShowCustomize(true)}
                  className="text-[10px] px-3 py-1.5 border-slate-700 text-gray-300 hover:bg-slate-800/50 hover:text-white h-auto font-medium"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Personalizar
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="text-[10px] px-3.5 py-1.5 border-slate-700 text-gray-300 hover:bg-slate-800/50 hover:text-white h-auto font-medium"
              >
                Recusar
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="bg-accent text-primary hover:bg-accent-light text-[10px] px-4 py-1.5 h-auto font-bold animate-none"
              >
                Aceitar Todos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── CookieSettingsLink (for Footer) ──────────────────────────────────────────

export const CookieSettingsLink = () => {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.openCookieSettings) {
      window.openCookieSettings();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="hover:text-accent transition-all hover:translate-x-1 duration-200 inline-block focus-visible:outline-none focus-visible:underline text-[11px] text-left"
    >
      Gerenciar Consentimento de Cookies
    </button>
  );
};
