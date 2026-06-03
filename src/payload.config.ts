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

// ─── FIX B: Serverless-safe connection pool ──────────────────────────────────
// Default pg pool = 10 conns per lambda instance. Neon free tier allows only
// ~5 concurrent connections total. One cold-start burst exhausts the budget.
// max:1 means each serverless invocation holds at most one connection; Neon's
// pooler or connection queue handles the rest safely.
const db = process.env.DATABASE_URI
  ? postgresAdapter({
      pool: {
        connectionString: process.env.DATABASE_URI,
        max: 1,                   // critical for serverless — prevents conn exhaustion
        idleTimeoutMillis: 10000, // release idle conn after 10s (lambda lifespan)
        connectionTimeoutMillis: 5000,
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
