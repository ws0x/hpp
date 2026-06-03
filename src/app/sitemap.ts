import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/insights`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/careers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
  ]

  try {
    const payload = await getPayloadClient()
    const [postsData, jobsData] = await Promise.all([
      payload.find({
        collection: 'posts',
        where: { _status: { equals: 'published' } },
        sort: '-publishedAt',
        limit: 200,
        depth: 0,
      }),
      payload.find({
        collection: 'jobs',
        where: { isActive: { equals: true } },
        sort: 'order',
        limit: 200,
        depth: 0,
      }),
    ])

    const postRoutes: MetadataRoute.Sitemap = postsData.docs.map((post) => ({
      url: `${siteUrl}/insights/${post.slug}`,
      lastModified: new Date((post.updatedAt as string) || new Date()),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    const jobRoutes: MetadataRoute.Sitemap = jobsData.docs.map((job) => ({
      url: `${siteUrl}/careers/${job.slug}`,
      lastModified: new Date((job.updatedAt as string) || new Date()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticRoutes, ...postRoutes, ...jobRoutes]
  } catch {
    return staticRoutes
  }
}
