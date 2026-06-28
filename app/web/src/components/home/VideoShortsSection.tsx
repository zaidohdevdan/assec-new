"use client";

import * as React from "react";
import { Play, Youtube, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";

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
  const [activeVideoId, setActiveVideoId] = React.useState<string | null>(null);
  
  // Ref for horizontal scroll container
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    async function loadVideos() {
      try {
        const res = await apiFetch("/videos");
        if (res.ok) {
          setVideos(await res.json());
        }
      } catch (err) {
        console.error("Erro ao carregar vídeos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <span className="text-accent-dark uppercase tracking-widest text-xs font-bold font-sans flex items-center gap-1.5">
              <Youtube className="h-4 w-4 text-red-600 fill-red-600" />
              ASSEC em Foco
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-primary mt-2 mb-2">
              Vídeos e Shorts Recentes
            </h2>
            <p className="text-text-secondary max-w-2xl text-sm sm:text-base">
              Acompanhe as nossas ações, esclarecimentos jurídicos e novidades diretamente em formato de vídeo rápido.
            </p>
          </div>
          
          {/* Navigation Arrows for scroll shelf */}
          {videos.length > 4 && (
            <div className="flex gap-2 mt-4 md:mt-0">
              <button 
                onClick={() => scroll("left")}
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-text-primary hover:bg-slate-50 transition-colors shadow-sm"
                aria-label="Rolar vídeos para esquerda"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => scroll("right")}
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-text-primary hover:bg-slate-50 transition-colors shadow-sm"
                aria-label="Rolar vídeos para direita"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Videos Shelf (Horizontal Scroll Container) */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {videos.map((video) => {
            const youtubeId = getYouTubeId(video.youtubeUrl);
            if (!youtubeId) return null;
            
            const isPlaying = activeVideoId === video.id;

            return (
              <div 
                key={video.id} 
                className="flex-shrink-0 w-[260px] snap-start"
              >
                <Card className="overflow-hidden border border-border bg-slate-50 shadow-sm transition-all hover:shadow-md hover:border-accent duration-300 flex flex-col h-full rounded-2xl">
                  {/* Aspect Ratio 9:16 for vertical Shorts */}
                  <div className="relative w-full aspect-[9/16] bg-black group overflow-hidden">
                    {isPlaying ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                        title={video.title}
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        {/* High quality thumbnail from youtube */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Dark Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 opacity-90 transition-opacity group-hover:opacity-95" />
                        
                        {/* Play Button Overlay */}
                        <button
                          onClick={() => setActiveVideoId(video.id)}
                          className="absolute inset-0 flex flex-col items-center justify-center text-white focus:outline-none"
                          aria-label={`Reproduzir vídeo: ${video.title}`}
                        >
                          <div className="h-16 w-16 rounded-full bg-accent text-primary flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                            <Play className="h-6 w-6 fill-primary ml-1" />
                          </div>
                        </button>

                        {/* Title text overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                          <span className="text-[10px] text-accent font-bold uppercase tracking-widest block mb-1">
                            Shorts
                          </span>
                          <h3 className="text-sm font-bold text-white leading-snug line-clamp-3">
                            {video.title}
                          </h3>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
