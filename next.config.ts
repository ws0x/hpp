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
      // The Vercel Blob storage plugin's *client* upload handler transitively
      // imports `undici` (via payload's internal exports). `undici` is a
      // server-only HTTP client that reaches for `node:assert`, `node:net`,
      // `node:http`, etc. — schemes webpack can't resolve for the browser,
      // which breaks both `next dev` and the Vercel production build. The
      // browser already has native `fetch`, so `undici` is never needed
      // client-side: alias it (and its node: subtree) out of the client graph.
      config.resolve.alias = {
        ...config.resolve.alias,
        undici: false,
      }

      // Polyfill Node.js built-ins to `false` so webpack doesn't fail when
      // a transitive dep (pino-abstract-transport → worker_threads, undici →
      // node:assert, …) ends up in the client graph via a Payload client
      // component import.
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
        assert: false,
        'node:assert': false,
        net: false,
        'node:net': false,
        tls: false,
        'node:tls': false,
        http: false,
        'node:http': false,
        https: false,
        'node:https': false,
        zlib: false,
        'node:zlib': false,
        stream: false,
        'node:stream': false,
        util: false,
        'node:util': false,
        async_hooks: false,
        'node:async_hooks': false,
      }
    }
    return config
  },
}

export default withPayload(nextConfig)
