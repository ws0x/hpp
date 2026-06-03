import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

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

const db = process.env.DATABASE_URI
  ? postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } })
  : sqliteAdapter({ client: { url: 'file:./payload.db' } })

export default buildConfig({
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

  cors: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3006'],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3006'],

  onInit: async (payload) => {
    const existing = await payload.find({ collection: 'users', limit: 1 })
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
      payload.logger.info('✓ Default admin user created. Change the password after first login.')
    }
  },
})
