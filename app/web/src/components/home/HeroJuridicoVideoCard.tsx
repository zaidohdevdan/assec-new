"use client";

import * as React from "react";
import { Play, X, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import Image from "next/image";

export function HeroJuridicoVideoCard() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isPlayerPlaying, setIsPlayerPlaying] = React.useState(true);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const youtubeId = "-ZHInjOCktY";
  const title = "Suporte Técnico-Legal e Assessoria Jurídica: Dr. Marcílio Lélis Prata";

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setIsPlayerPlaying(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const togglePlay = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      if (isPlayerPlaying) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
          "*"
        );
        setIsPlayerPlaying(false);
      } else {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: "" }),
          "*"
        );
        setIsPlayerPlaying(true);
      }
    }
  };

  return (
    <>
      {/* Card Vertical do Vídeo */}
      <div 
        onClick={() => setIsOpen(true)}
        className="relative h-full rounded-2xl overflow-hidden border border-[#D4AF37]/50 bg-[#0E2B47] shadow-2xl cursor-pointer group flex flex-col justify-between p-4 sm:p-5 transition-all duration-300 hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
      >
        {/* Imagem de Fundo Vertical com Foto Nítida */}
        <Image
          src="/juridico-poster.webp"
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A2D] via-[#071A2D]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity pointer-events-none" />

        {/* Topo do Card: Badge de Categoria */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071A2D]/90 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold backdrop-blur-sm shadow-sm">
            <Shield className="h-3.5 w-3.5" />
            <span>Assessoria Jurídica</span>
          </div>
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#D4AF37] animate-ping" />
        </div>

        {/* Centro: Play Button Chamativo com Pulso */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center gap-2">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-[#D4AF37] text-[#071A2D] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
            <Play className="h-7 w-7 fill-[#071A2D] ml-1" />
          </div>
          <span className="text-[11px] font-bold text-white uppercase tracking-wider drop-shadow bg-[#071A2D]/70 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
            Assista ao Vídeo
          </span>
        </div>

        {/* Rodapé: Detalhes do Advogado e Dica */}
        <div className="relative z-10 text-left bg-[#071A2D]/85 p-3 rounded-xl border border-white/10 backdrop-blur-md">
          <p className="text-white text-xs font-bold leading-tight group-hover:text-[#D4AF37] transition-colors">
            Palavra do Jurídico
          </p>
          <p className="text-[10px] text-gray-300 line-clamp-1 mt-0.5">
            Dr. Marcílio Lélis Prata
          </p>
          <p className="text-[9.5px] text-[#D4AF37] font-semibold mt-1">
            Suporte e Prontidão 24h ▶
          </p>
        </div>
      </div>

      {/* Lightbox Modal com o Vídeo */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
              onClick={() => setIsOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="relative w-[min(340px,50.6vh)] h-[min(604px,90vh)] bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-colors z-50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Fechar vídeo"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Video IFrame */}
                <div className="flex-1 w-full h-full relative bg-black">
                  <iframe
                    ref={iframeRef}
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&start=1&rel=0&enablejsapi=1`}
                    title={title}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  <div 
                    onClick={togglePlay}
                    className="absolute inset-0 w-full h-full cursor-pointer z-10 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors"
                  >
                    {!isPlayerPlaying && (
                      <div className="h-16 w-16 rounded-full bg-black/60 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm">
                        <Play className="h-8 w-8 fill-white ml-1" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Title Overlay */}
                <div className="p-4 bg-slate-900 text-white border-t border-white/10 text-left">
                  <span className="text-[10px] text-accent font-bold uppercase tracking-widest block mb-1">
                    Assessoria Jurídica ASSEC
                  </span>
                  <h3 className="text-xs font-bold leading-snug">
                    {title}
                  </h3>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
