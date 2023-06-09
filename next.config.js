/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-arbitrum.reservoir.tools',
      },
      {
        protocol: 'https',
        hostname: 'api.reservoir.tools',
      },
      {
        protocol: 'https',
        hostname: 'i.seadn.io'
      }
    ],
  },
  env: {
    ACTIVE_RAFFLE_ID: process.env.ACTIVE_RAFFLE_ID
  }
}

module.exports = nextConfig
