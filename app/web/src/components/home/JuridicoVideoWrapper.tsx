"use client";

import * as React from "react";
import dynamic from "next/dynamic";

export const JuridicoVideoWrapper = dynamic(
  () => import("./JuridicoVideoPreview").then((mod) => mod.JuridicoVideoPreview),
  {
    ssr: false,
    loading: () => (
      <div className="my-6 flex flex-col items-center w-full animate-pulse">
        <div className="relative w-full max-w-[260px] aspect-[9/16] rounded-2xl bg-slate-900/10 border border-border" />
        <span className="text-xs text-text-secondary mt-2 text-center italic max-w-[260px] opacity-60">
          Dr. Marcílio Lélis Prata fala sobre o Suporte Técnico-Legal.
        </span>
      </div>
    ),
  }
);
