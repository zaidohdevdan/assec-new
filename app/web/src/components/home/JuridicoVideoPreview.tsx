"use client";

import * as React from "react";
import { Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export function JuridicoVideoPreview() {
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
    }
  }, [isOpen]);

  // Lock body scroll when modal is active to prevent background scrolling
  React.useEffect(() => {
    if (isOpen) {
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
    <div className="my-6 flex flex-col items-center w-full">
      {/* Clickable Card for Lightbox */}
      <div 
        onClick={() => setIsOpen(true)}
        className="relative w-full max-w-[260px] aspect-[9/16] rounded-2xl overflow-hidden shadow-lg border border-border bg-black group cursor-pointer"
      >
        {/* High quality thumbnail from youtube */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Dark Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 opacity-90 transition-opacity group-hover:opacity-95" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-accent text-primary flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
            <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-primary ml-1" />
          </div>
        </div>
      </div>
      
      <span className="text-xs text-text-secondary mt-2 text-center italic max-w-[260px]">
        Dr. Marcílio Lélis Prata fala sobre o Suporte Técnico-Legal.
      </span>

      {/* Lightbox Video Modal (with React Portal and framer-motion animations) */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
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
                  className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors z-50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Fechar vídeo"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Video IFrame */}
                <div className="flex-1 w-full h-full relative bg-black">
                  <iframe
                    ref={iframeRef}
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&enablejsapi=1`}
                    title={title}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  {/* Clickable transparent overlay to capture play/pause taps */}
                  <div 
                    onClick={togglePlay}
                    className="absolute inset-0 w-full h-full cursor-pointer z-10 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors"
                  >
                    {/* If paused, show a prominent play icon */}
                    {!isPlayerPlaying && (
                      <div className="h-16 w-16 rounded-full bg-black/60 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm animate-in zoom-in-95 duration-100">
                        <Play className="h-8 w-8 fill-white ml-1" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Title Overlay at bottom of modal */}
                <div className="p-4 bg-slate-900 text-white border-t border-white/10">
                  <span className="text-[10px] text-accent font-bold uppercase tracking-widest block mb-1">
                    Assessoria Jurídica
                  </span>
                  <h3 className="text-xs font-bold leading-snug line-clamp-2 text-left">
                    {title}
                  </h3>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
