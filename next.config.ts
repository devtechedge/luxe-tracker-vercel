import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Vercel-only deployment: no Prisma, no Supabase, no external API.
  // Data is generated in-memory at module load and queried synchronously.
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
