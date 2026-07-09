"use client";

import * as React from "react";
import { Play, Youtube, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

import Image from "next/image";

interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  active: boolean;
}

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function VideoShortsSection() {
  const [videos, setVideos] = React.useState<VideoItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalVideo, setModalVideo] = React.useState<VideoItem | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [isPlayerPlaying, setIsPlayerPlaying] = React.useState(true);
  const [activeScrollIndex, setActiveScrollIndex] = React.useState(0);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (modalVideo) {
      setIsPlayerPlaying(true);
    }
  }, [modalVideo]);
  
  // Ref for horizontal scroll container
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    async function loadVideos() {
      try {
        const res = await apiFetch("/videos");
        if (res.ok) {
          const data: VideoItem[] = await res.json();
          setVideos(data.filter((v) => v.active));
        }
      } catch (err) {
        console.error("Erro ao carregar vídeos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  // Lock body scroll when modal is active to prevent background scrolling
  React.useEffect(() => {
    if (modalVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalVideo]);

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

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const cardWidth = clientWidth > 640 ? 280 : 240;
      const index = Math.round(scrollLeft / (cardWidth + 16)); // card width + gap
      setActiveScrollIndex(index);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth"
      });
    }
  };

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const clientWidth = scrollContainerRef.current.clientWidth;
      const cardWidth = clientWidth > 640 ? 280 : 240;
      scrollContainerRef.current.scrollTo({
        left: index * (cardWidth + 16),
        behavior: "smooth"
      });
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent-dark mx-auto" />
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null; // Oculta a seção inteira se não houver vídeos
  }

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <span className="text-accent-dark uppercase tracking-widest text-xs font-bold font-sans flex items-center gap-1.5">
              <Youtube className="h-4 w-4 text-red-600 fill-red-600" />
              ASSEC em Foco
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-primary mt-2 mb-2">
              Vídeos e Shorts Recentes
            </h2>
            <p className="text-text-secondary max-w-2xl text-xs sm:text-sm">
              Acompanhe as nossas ações, esclarecimentos jurídicos e novidades diretamente em formato de vídeo rápido.
            </p>
          </div>
          
          {/* Navigation Arrows for scroll shelf */}
          {videos.length > 1 && (
            <div className={`flex gap-2 shrink-0 self-end sm:self-auto ${videos.length <= 4 ? "md:hidden" : "md:flex"}`}>
              <button 
                onClick={() => scroll("left")}
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-text-primary hover:bg-slate-50 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Rolar vídeos para esquerda"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => scroll("right")}
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-text-primary hover:bg-slate-50 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Rolar vídeos para direita"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Outer container with indicator overlays */}
        <div className="relative">
          {/* Left edge shadow indicator */}
          <div className="absolute left-0 top-0 bottom-6 w-8 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none md:hidden" />
          
          {/* Right edge shadow indicator */}
          <div className="absolute right-0 top-0 bottom-6 w-8 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none md:hidden" />

          {/* Videos Shelf (Horizontal Scroll Container) */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: "none" }}
          >
            {videos.map((video) => {
              const youtubeId = getYouTubeId(video.youtubeUrl);
              if (!youtubeId) return null;

              return (
                <div 
                  key={video.id} 
                  className="flex-shrink-0 w-[240px] sm:w-[280px] snap-start"
                >
                  <Card className="overflow-hidden border border-border bg-slate-50 shadow-sm transition-all hover:shadow-md hover:border-accent duration-300 flex flex-col h-full rounded-2xl p-0">
                    {/* Aspect Ratio 9:16 for vertical Shorts */}
                    <div className="relative w-full aspect-[9/16] bg-black group overflow-hidden">
                      {/* High quality thumbnail from youtube */}
                      <Image
                        src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                        alt={video.title}
                        fill
                        sizes="(max-width: 640px) 240px, 280px"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Dark Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 opacity-90 transition-opacity group-hover:opacity-95" />
                      
                      {/* Play Button Overlay */}
                      <button
                        onClick={() => setModalVideo(video)}
                        className="absolute inset-0 flex flex-col items-center justify-center text-white focus:outline-none"
                        aria-label={`Reproduzir vídeo: ${video.title}`}
                      >
                        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-accent text-primary flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                          <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-primary ml-1" />
                        </div>
                      </button>

                      {/* Title text overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-left bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                        <span className="text-[10px] text-accent font-bold uppercase tracking-widest block mb-1">
                          Shorts
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-3 font-sans">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Pagination Dots */}
        {videos.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2 md:hidden">
            {videos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToCard(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeScrollIndex === idx ? "w-5 bg-accent-dark" : "w-2 bg-slate-300"
                }`}
                aria-label={`Ir para vídeo ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Video Modal (with React Portal and framer-motion animations) */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {modalVideo && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
              onClick={() => setModalVideo(null)}
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
                  onClick={() => setModalVideo(null)}
                  className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors z-50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Fechar vídeo"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Video IFrame */}
                <div className="flex-1 w-full h-full relative bg-black">
                  <iframe
                    ref={iframeRef}
                    src={`https://www.youtube.com/embed/${getYouTubeId(modalVideo.youtubeUrl)}?autoplay=1&rel=0&enablejsapi=1`}
                    title={modalVideo.title}
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
                    Shorts
                  </span>
                  <h3 className="text-xs font-bold leading-snug line-clamp-2 text-left">
                    {modalVideo.title}
                  </h3>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
