"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PWASplashScreen() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // 1. Detect if running in standalone mode (PWA)
    const isPWA = 
      window.matchMedia("(display-mode: standalone)").matches || 
      ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true);

    // 2. Only show once per browser session to maintain good usability on page refreshes
    if (isPWA) {
      const hasSeenSplash = sessionStorage.getItem("pwa-splash-seen");
      if (!hasSeenSplash) {
        setIsVisible(true);
        sessionStorage.setItem("pwa-splash-seen", "true");
        
        // Hide splash screen after 2.8 seconds (2.3s animation + 0.5s fadeout buffer)
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 2800);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-[#071A2D] z-[9999] flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Subtle Ambient Background Light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

          {/* Animated Banner Image Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: [0.9, 1.02, 1],
              opacity: 1,
            }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ 
              duration: 2.2,
              ease: [0.25, 1, 0.5, 1], // Custom cubic-bezier for a premium native app spring feel
            }}
            className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[843/1264] rounded-2xl overflow-hidden shadow-2xl border border-accent/20 flex items-center justify-center bg-[#071A2D]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/banner-assec.jpg" 
              alt="ASSEC Ceará" 
              className="w-full h-full object-cover"
              draggable={false}
            />

            {/* Glowing metallic sweep effect over the banner */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                delay: 0.4,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
            />
          </motion.div>

          {/* Subtle pulsing loading status at the bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{
              delay: 0.8,
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-12 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] text-accent font-sans font-bold uppercase tracking-[0.25em]">
              Carregando Portal
            </span>
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
