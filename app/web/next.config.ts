import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Define a raiz do Turbopack para evitar que lockfiles fora do repositório
  // (como em /home/zaidoh) façam o Next.js buscar páginas no diretório incorreto.
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
    qualities: [90],
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
    ],
  },

};

export default nextConfig;
