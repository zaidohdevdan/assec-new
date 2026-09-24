import * as React from "react";
import Image from "next/image";

interface PlantaoJuridicoBadgeProps {
  className?: string;
}

export function PlantaoJuridicoBadge({ className = "" }: PlantaoJuridicoBadgeProps) {
  return (
    <div
      className={`relative h-16 w-16 sm:h-20 sm:w-full rounded-2xl overflow-hidden border border-white/20 bg-[#0E2B47] shadow-xl p-2 sm:p-3.5 flex items-center justify-center sm:justify-start gap-3.5 transition-all duration-300 hover:border-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:scale-105 sm:hover:scale-[1.02] shrink-0 sm:shrink group ${className}`}
    >
      {/* Escudo Oficial ASSEC */}
      <div className="relative h-full w-full sm:h-14 sm:w-14 shrink-0 flex items-center justify-center p-0.5 sm:p-1.5 rounded-xl sm:bg-[#071A2D] sm:border sm:border-[#D4AF37]/40 shadow-inner group-hover:scale-105 transition-transform">
        <Image
          src="/logo-transparent.webp"
          alt="Escudo ASSEC"
          width={48}
          height={48}
          className="h-full w-auto object-contain drop-shadow-sm"
        />
        {/* Indicador Ativo Pulsante no Mobile (canto superior direito) */}
        <div className="absolute top-0 right-0 sm:hidden flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_#34d399]" />
          <span className="absolute h-3.5 w-3.5 rounded-full bg-emerald-400/50 animate-ping" />
        </div>
      </div>

      {/* Textos Informativos (ocultos no mobile, visíveis no desktop) */}
      <div className="hidden sm:flex text-left flex-col justify-center min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          {/* Indicador Ativo Pulsante no Desktop */}
          <div className="relative flex items-center justify-center shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_#34d399]" />
            <span className="absolute h-3.5 w-3.5 rounded-full bg-emerald-400/50 animate-ping" />
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight uppercase leading-tight whitespace-nowrap group-hover:text-[#D4AF37] transition-colors">
            Plantão 24h
          </span>
        </div>
        <span className="text-[11px] sm:text-xs text-[#D4AF37] font-bold tracking-tight mt-1 truncate">
          Assessoria Jurídica
        </span>
      </div>
    </div>
  );
}
