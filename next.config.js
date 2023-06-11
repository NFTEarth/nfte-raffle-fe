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
    CHAIN: process.env.CHAIN,
    CHAIN_ID: process.env.CHAIN_ID,
    ACTIVE_RAFFLE_ID: process.env.ACTIVE_RAFFLE_ID,
    RAFFLE_CONTRACT_ADDRESS: process.env.RAFFLE_CONTRACT_ADDRESS
  }
}

module.exports = nextConfig
