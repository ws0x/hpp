import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  // Keep pino (Payload's logger) and its transport dependencies out of
  // webpack bundles entirely. They rely on Node.js built-ins (worker_threads,
  // fs, etc.) that don't exist in the browser or edge runtimes.
  serverExternalPackages: ['pino', 'pino-pretty', 'pino-abstract-transport'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Polyfill Node.js built-ins to `false` so webpack doesn't fail when
      // a transitive dep (pino-abstract-transport → worker_threads) ends up
      // in the client graph via a Payload client component import.
      config.resolve.fallback = {
        ...config.resolve.fallback,
        worker_threads: false,
        'node:worker_threads': false,
        fs: false,
        'node:fs': false,
        path: false,
        'node:path': false,
        os: false,
        'node:os': false,
        crypto: false,
        'node:crypto': false,
      }
    }
    return config
  },
}

export default withPayload(nextConfig)
