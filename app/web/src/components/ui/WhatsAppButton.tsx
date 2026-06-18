"use client";

import * as React from "react";

export function WhatsAppButton() {
  const phoneNumber = "5585999411411"; // Formatted (85) 99941-1411
  const message = encodeURIComponent(
    "Olá! Gostaria de tirar dúvidas sobre a associação à ASSEC."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20BA56] hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 group"
    >
      {/* Tooltip visible on hover */}
      <span className="absolute right-16 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none border border-slate-800">
        Fale Conosco
      </span>

      {/* SVG Icon for WhatsApp */}
      <svg
        className="w-7 h-7 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.66.986 3.298 1.448 5.355 1.449 5.483 0 9.944-4.461 9.947-9.948.002-2.657-1.026-5.155-2.896-7.028-1.87-1.872-4.363-2.902-7.027-2.903-5.485 0-9.947 4.461-9.95 9.948-.002 2.085.546 4.12 1.587 5.922l-.992 3.626 3.725-.976zm11.39-4.908c-.302-.15-1.787-.882-2.063-.982-.277-.1-.478-.15-.68.15-.201.3-.778.982-.953 1.183-.176.2-.352.226-.654.076-.301-.15-1.274-.47-2.426-1.498-.896-.8-1.501-1.787-1.678-2.088-.176-.302-.019-.465.132-.615.136-.135.302-.35.453-.526.15-.175.201-.3.301-.5.101-.2.05-.376-.025-.526-.075-.15-.68-1.637-.932-2.24-.246-.59-.497-.51-.68-.52-.176-.008-.377-.01-.578-.01-.201 0-.528.075-.804.376-.277.302-1.056 1.03-1.056 2.512 0 1.48 1.077 2.913 1.228 3.114.15.2 2.119 3.235 5.133 4.537.717.31 1.277.495 1.713.633.72.23 1.375.197 1.892.12.576-.087 1.787-.73 2.039-1.432.251-.703.251-1.304.176-1.432-.076-.127-.277-.201-.578-.352z" />
      </svg>
    </a>
  );
}
