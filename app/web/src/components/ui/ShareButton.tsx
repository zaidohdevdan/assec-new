"use client";

import * as React from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton() {
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg border shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        copied
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 focus-visible:ring-emerald-500"
          : "bg-white text-primary border-slate-200 hover:bg-slate-50 hover:text-accent-dark focus-visible:ring-accent"
      }`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          <span>Link Copiado!</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          <span>Copiar link</span>
        </>
      )}
    </button>
  );
}
