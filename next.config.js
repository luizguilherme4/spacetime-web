/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', '192.168.3.111'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
