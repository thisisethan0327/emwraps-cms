import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Standalone output for Docker deployments (smaller image, no node_modules needed)
  output: 'standalone',
  // Disable Turbopack for builds to reduce memory usage
  turbopack: undefined,
  // Allow images from Supabase Storage and other origins
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Note: CORS is handled by Payload's built-in `cors` config in payload.config.ts.
  // Do NOT add custom Access-Control-Allow-Origin headers here as they
  // will override Payload's multi-origin CORS support.
}

export default withPayload(nextConfig)

