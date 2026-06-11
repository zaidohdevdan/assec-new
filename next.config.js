/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // 🔥 Essencial para imagem Docker de ~150MB
    compress: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
}
module.exports = nextConfig