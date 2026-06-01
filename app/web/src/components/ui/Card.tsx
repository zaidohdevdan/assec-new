import React from "react";

interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Card({ className = "", children }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}>
      {children}
    </div>
  );
}
