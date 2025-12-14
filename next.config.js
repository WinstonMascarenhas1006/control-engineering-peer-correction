/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.prod.website-files.com'],
    unoptimized: false,
  },
}

module.exports = nextConfig

