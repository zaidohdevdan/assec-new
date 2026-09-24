"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Shield, Play } from "lucide-react";

export const HeroJuridicoVideoWrapper = dynamic(
  () => import("./HeroJuridicoVideoCard").then((mod) => mod.HeroJuridicoVideoCard),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-full rounded-2xl overflow-hidden border border-[#D4AF37]/50 bg-[#0E2B47] shadow-2xl p-4 sm:p-5 flex flex-col justify-between animate-pulse">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071A2D]/90 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold">
            <Shield className="h-3.5 w-3.5" />
            <span>Assessoria Jurídica</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center my-auto text-center gap-2">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-[#D4AF37]/40 flex items-center justify-center">
            <Play className="h-7 w-7 fill-[#071A2D] ml-1" />
          </div>
        </div>
        <div className="text-left bg-[#071A2D]/85 p-3 rounded-xl border border-white/10">
          <p className="text-white text-xs font-bold leading-tight">
            Palavra do Jurídico
          </p>
          <p className="text-[10px] text-gray-300">
            Dr. Marcílio Lélis Prata
          </p>
        </div>
      </div>
    ),
  }
);
