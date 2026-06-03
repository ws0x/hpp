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
const dirname  = path.dirname(filename)

// DATABASE_URI in Vercel is now set to the Neon pooler endpoint directly.
// The pooler (PgBouncer) never suspends — connections complete in <100 ms
// regardless of whether Neon compute is sleeping.
// max:1 prevents connection-pool exhaustion on serverless (one conn per lambda).
const db = process.env.DATABASE_URI
  ? postgresAdapter({
      pool: {
        connectionString: process.env.DATABASE_URI,
        max: 1,
        idleTimeoutMillis:     10_000,
        connectionTimeoutMillis: 8_000, // <10 s Vercel hobby limit; pooler responds in <1 s
      },
    })
  : sqliteAdapter({ client: { url: 'file:./payload.db' } })

// All valid origins for CORS + CSRF.
// VERCEL_URL / VERCEL_BRANCH_URL are Vercel system vars injected at runtime.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3006'
const allowedOrigins = [
  siteUrl,
  'http://localhost:3000',
  'http://localhost:3006',
  ...(process.env.VERCEL_URL        ? [`https://${process.env.VERCEL_URL}`]        : []),
  ...(process.env.VERCEL_BRANCH_URL ? [`https://${process.env.VERCEL_BRANCH_URL}`] : []),
]

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
    importMap: { baseDir: path.resolve(dirname) },
  },

  collections: [
    Users, Media, Posts, Services, Testimonials,
    Certifications, Leads, Subscribers, Jobs, JobApplications, TalentProfiles,
  ],

  globals: [SiteSettings, HeroContent, AboutContent, StatsContent],

  editor: lexicalEditor({}),
  db,

  secret: process.env.PAYLOAD_SECRET || 'fallback-dev-secret-change-in-production',

  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },

  upload: { limits: { fileSize: 10_000_000 } },

  cors: allowedOrigins,
  csrf: allowedOrigins,

  onInit: async (payload) => {
    // Skip admin-user seeding during Next.js static-page generation at build time.
    // The build worker tries to render static pages; those calls trigger onInit,
    // but the DB may be cold at that point. Seeding can wait for runtime.
    if (process.env.NEXT_PHASE === 'phase-production-build') return

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
            email:    process.env.ADMIN_EMAIL    || 'admin@hplusplus.net',
            password: process.env.ADMIN_PASSWORD || 'Admin@H++2026!',
            role: 'admin',
          },
        })
        payload.logger.info('✓ Default admin user seeded.')
      }
    } catch (err) {
      payload.logger.warn({ err }, 'onInit seed skipped (non-fatal)')
    }
  },
})
