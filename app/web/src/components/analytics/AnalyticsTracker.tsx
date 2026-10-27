"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const SESSION_STORAGE_KEY = "assec_anon_sid";
const LAST_VISIT_TIME_KEY = "assec_last_visit_time";
const LAST_VISIT_PATH_KEY = "assec_last_visit_path";
const LGPD_STORAGE_KEY = "assec-lgpd-consent";
const DEBOUNCE_COOLDOWN_MS = 5000; // 5 segundos de cooldown para recarregamentos na mesma rota

function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(LGPD_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.categories?.analytics === true;
  } catch {
    return false;
  }
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sid = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sid) {
      sid = "s_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
      sessionStorage.setItem(SESSION_STORAGE_KEY, sid);
    }
    return sid;
  } catch {
    return "";
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const [consentGranted, setConsentGranted] = React.useState(false);

  React.useEffect(() => {
    setConsentGranted(hasAnalyticsConsent());

    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ categories?: { analytics?: boolean } }>;
      setConsentGranted(customEvent.detail?.categories?.analytics === true);
    };

    window.addEventListener("assec:consent-change", handleConsentChange);
    return () => {
      window.removeEventListener("assec:consent-change", handleConsentChange);
    };
  }, []);

  React.useEffect(() => {
    if (!consentGranted || !pathname || typeof window === "undefined") return;

    const now = Date.now();
    try {
      const lastPath = sessionStorage.getItem(LAST_VISIT_PATH_KEY);
      const lastTimeStr = sessionStorage.getItem(LAST_VISIT_TIME_KEY);
      const lastTime = lastTimeStr ? parseInt(lastTimeStr, 10) : 0;

      // Ignore duplicate hits on same path within 5 seconds (prevents F5 / reload inflation)
      if (lastPath === pathname && now - lastTime < DEBOUNCE_COOLDOWN_MS) {
        return;
      }

      sessionStorage.setItem(LAST_VISIT_PATH_KEY, pathname);
      sessionStorage.setItem(LAST_VISIT_TIME_KEY, now.toString());
    } catch {
      // ignore storage access errors
    }

    const payload = JSON.stringify({
      path: pathname,
      sessionId: getOrCreateSessionId(),
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });

    const endpoint = `${API_BASE}/analytics/visit`;

    // 1. Try non-blocking navigator.sendBeacon
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      const sent = navigator.sendBeacon(endpoint, blob);
      if (sent) return;
    }

    // 2. Fallback to fetch with keepalive
    fetch(endpoint, {
      method: "POST",
      body: payload,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Sends HttpOnly session cookie so backend detects if logged in
      keepalive: true,
    }).catch(() => {
      // Fire-and-forget; ignore telemetry network failures silently
    });
  }, [pathname, consentGranted]);

  return null;
}
