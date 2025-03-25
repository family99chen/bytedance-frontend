/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  // 添加性能优化配置
  experimental: {
    optimizeFonts: true,
    optimizeImages: true,
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig