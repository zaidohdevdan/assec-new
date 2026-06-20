"use client";

import * as React from "react";
import { motion } from "framer-motion";

export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ ease: "easeOut", duration: 0.35 }}
      className="flex flex-col w-full flex-1"
    >
      {children}
    </motion.div>
  );
}
