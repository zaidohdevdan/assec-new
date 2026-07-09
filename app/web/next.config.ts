import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Define a raiz do Turbopack para evitar que lockfiles fora do repositório
  // (como em /home/zaidoh) façam o Next.js buscar páginas no diretório incorreto.
  turbopack: {
    root: path.resolve(__dirname),
  },
  // outputFileTracingRoot é necessário apenas no build Docker (standalone).
  // Em dev (Turbopack), aponta para o root do monorepo onde existe outro
  // next.config.js, o que confunde o servidor e causa 404 em todas as rotas.
  // ...(isProd && { outputFileTracingRoot: path.join(__dirname, "../../") }),
  ...(isProd && { output: "standalone" }),
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85, 90],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assecce.com.br",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    // Content-Security-Policy directives
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://assecce.com.br https://img.youtube.com https://picsum.photos https://api.qrserver.com http://localhost:3001",
      "connect-src 'self' https://assecce.com.br http://localhost:3001",
      "frame-src 'self' https://www.youtube.com https://youtube.com",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    return [
      {
        // Security headers for all routes
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspDirectives,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        // Long cache for static assets (immutable, 1 year)
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Medium cache for optimized images (1 day + stale-while-revalidate 1 week)
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
