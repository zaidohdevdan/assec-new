"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const SESSION_STORAGE_KEY = "assec_anon_sid";

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
  const lastTrackedRef = React.useRef<{ path: string; time: number } | null>(null);

  React.useEffect(() => {
    if (!pathname) return;

    // Debounce duplicate hits on same path within 3 seconds
    const now = Date.now();
    if (
      lastTrackedRef.current &&
      lastTrackedRef.current.path === pathname &&
      now - lastTrackedRef.current.time < 3000
    ) {
      return;
    }
    lastTrackedRef.current = { path: pathname, time: now };

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
  }, [pathname]);

  return null;
}
