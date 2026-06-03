import type { Metadata } from 'next'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@payload-config'
import { importMap } from '../importMap.js'

// Give the serverless function enough time for Neon's free-tier cold start
// (compute resume can take up to 15 s) plus the actual page render budget.
// This mirrors the vercel.json maxDuration setting and makes it explicit.
export const maxDuration = 60

// Force dynamic rendering — the admin panel must never be statically cached.
export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

export default async function Page({ params, searchParams }: Args) {
  return RootPage({ config, importMap, params, searchParams })
}
