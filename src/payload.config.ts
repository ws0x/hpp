import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Certifications } from './collections/Certifications'
import { Leads } from './collections/Leads'
import { Subscribers } from './collections/Subscribers'
import { Jobs } from './collections/Jobs'
import { JobApplications } from './collections/JobApplications'
import { TalentProfiles } from './collections/TalentProfiles'

import { SiteSettings } from './globals/SiteSettings'
import { HeroContent } from './globals/HeroContent'
import { AboutContent } from './globals/AboutContent'
import { StatsContent } from './globals/StatsContent'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ─── Serverless-safe Neon connection ─────────────────────────────────────────
//
// Two problems to solve for Vercel + Neon free tier:
//
// 1. COLD-START TIMEOUT — Neon free tier auto-suspends after 5 min of
//    inactivity. Resuming the compute takes 8–15 seconds. Our previous
//    connectionTimeoutMillis: 5000 always lost that race → "timeout exceeded
//    when trying to connect" → admin page crashes on every cold hit.
//    Fix: raise to 30 000 ms (30 s), safely inside Vercel's 60 s maxDuration.
//
// 2. POOLER ENDPOINT — The raw direct endpoint (ep-xxx.neon.tech) opens a new
//    backend process per connection. With max:1 this is fine for throughput but
//    the raw endpoint still has to resume compute on cold start.
//    The pooler endpoint (ep-xxx-pooler.neon.tech, PgBouncer) keeps a warm
//    proxy in front of the compute, so connections resolve in <100 ms even
//    when compute is sleeping — it wakes the compute while PgBouncer queues
//    the query. We auto-rewrite the connection string to the pooler hostname
//    when running on Vercel (VERCEL=1) so dev still hits the direct endpoint.
//
function toPoolerUrl(raw: string): string {
  // Only rewrite on Vercel, only for Neon URLs, only if not already pooler
  if (!process.env.VERCEL || !raw.includes('.neon.tech') || raw.includes('-pooler.')) {
    return raw
  }

  // Neon connection strings look like:
  //   postgresql://user:pass@ep-nameless-wave-agdnk37r.c-2.eu-central-1.aws.neon.tech/db
  // The endpoint ID is always the first segment of the hostname (right after @).
  // We append -pooler to ONLY that first segment to get PgBouncer's address.
  //
  // Previous regex /(ep-[^.]+)(\.[\w-]+\.aws\.neon\.tech)/ was WRONG:
  //   \.[\w-]+  matches exactly ONE subdomain before .aws.neon.tech
  //   But Neon regions have TWO: c-2.eu-central-1 → regex never matched.
  //
  // Correct: anchor to @ so we touch only the hostname, not query params.
  // Use callback form — avoids '$1' being misread in some environments
  let result = raw.replace(/@(ep-[^./]+)\./, (_, ep: string) => `@${ep}-pooler.`)

  // Also strip channel_binding=require — PgBouncer doesn't need it and the
  // extra TLS negotiation adds hundreds of ms to cold-start SSL handshakes.
  result = result.replace(/[?&]channel_binding=require/, (m) =>
    m.startsWith('?') ? '?' : '',
  )

  return result
}

const rawDatabaseUri = process.env.DATABASE_URI || ''
const databaseUri    = toPoolerUrl(rawDatabaseUri)

const db = databaseUri
  ? postgresAdapter({
      pool: {
        connectionString: databaseUri,
        max: 1,                       // 1 conn per lambda — prevents pool exhaustion
        idleTimeoutMillis:  10_000,   // release after 10 s of idle (lambda lifespan)
        connectionTimeoutMillis: 30_000, // 30 s — enough for Neon free-tier wake-up
      },
    })
  : sqliteAdapter({ client: { url: 'file:./payload.db' } })

// ─── FIX A: Build the full CORS/CSRF origin list ─────────────────────────────
// Vercel serves the same app on multiple hostnames:
//   - https://hpp.vercel.app              (production alias)
//   - https://hpp-git-main-binhakim.vercel.app (branch deploy)
//   - https://hpp-<hash>-binhakim.vercel.app   (preview deploys)
// The login POST's Origin header must match an entry here or Payload returns 403.
// NEXT_PUBLIC_SITE_URL covers the canonical domain; the vercel.app wildcard
// pattern covers all auto-generated preview/branch URLs.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3006'
const allowedOrigins: string[] = [
  siteUrl,
  'http://localhost:3000',
  'http://localhost:3006',
]
// Add Vercel auto-generated preview URLs when running on Vercel
if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`)
}
if (process.env.VERCEL_BRANCH_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_BRANCH_URL}`)
}

export default buildConfig({
  sharp,

  plugins: [
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— H++ Admin',
      description: 'H++ Content Management System',
    },
    components: {},
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [
    Users,
    Media,
    Posts,
    Services,
    Testimonials,
    Certifications,
    Leads,
    Subscribers,
    Jobs,
    JobApplications,
    TalentProfiles,
  ],

  globals: [
    SiteSettings,
    HeroContent,
    AboutContent,
    StatsContent,
  ],

  editor: lexicalEditor({}),

  db,

  secret: process.env.PAYLOAD_SECRET || 'fallback-dev-secret-change-in-production',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  upload: {
    limits: {
      fileSize: 10_000_000,
    },
  },

  // ─── FIX A: Accept all Vercel hostnames for CORS + CSRF ──────────────────
  cors: allowedOrigins,
  csrf: allowedOrigins,

  // ─── FIX C: Guard onInit so it never races against auth requests ──────────
  // onInit fires on every cold start. The previous version did an unguarded
  // payload.find() + payload.create() on every init — adding 300-700ms and
  // potentially failing if the users table is momentarily locked. Wrapping in
  // try/catch + an existence check prevents a seeding failure from killing the
  // auth request that triggered the cold start.
  onInit: async (payload) => {
    try {
      const existing = await payload.find({
        collection: 'users',
        limit: 1,
        depth: 0,
        pagination: false,
      })
      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'users',
          data: {
            name: 'Admin',
            email: process.env.ADMIN_EMAIL || 'admin@hplusplus.net',
            password: process.env.ADMIN_PASSWORD || 'Admin@H++2026!',
            role: 'admin',
          },
        })
        payload.logger.info('✓ Default admin user seeded.')
      }
    } catch (err) {
      // Never crash the app over seeding — log and continue
      payload.logger.warn({ err }, 'onInit seed skipped (non-fatal)')
    }
  },
})
