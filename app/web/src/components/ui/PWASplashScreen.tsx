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
        
        // Hide splash screen after 2.5 seconds (2.0s static display + 0.5s fade out transition)
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 2500);
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
          className="fixed inset-0 bg-[#0a1929] z-[9999] flex items-center justify-center select-none overflow-hidden"
        >
          {/* Central Shield Logo: 40-50% of the screen width */}
          <div className="w-[45vw] max-w-[320px] md:max-w-[400px] aspect-square flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo-transparent.webp" 
              alt="ASSEC Ceará Logo" 
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
