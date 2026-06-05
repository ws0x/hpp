import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

type Props = { params: Promise<{ slug: string }> }

const categoryLabels: Record<string, string> = {
  'hr-strategy': 'HR Strategy',
  'recruitment': 'Recruitment',
  'leadership': 'Leadership',
  'culture': 'Culture',
  'mena': 'MENA HR',
  'career-tips': 'Career Tips',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      limit: 1,
      depth: 1,
    })
    const post = docs[0]
    if (!post) return { title: 'Post Not Found' }

    const seo = post.seo as Record<string, string> | undefined
    const ogImage = post.heroImage && typeof post.heroImage === 'object' && 'url' in post.heroImage
      ? (post.heroImage as { url: string }).url
      : undefined

    return {
      title: seo?.metaTitle || (post.title as string),
      description: seo?.metaDescription || (post.excerpt as string),
      openGraph: {
        title: seo?.metaTitle || (post.title as string),
        description: seo?.metaDescription || (post.excerpt as string),
        type: 'article',
        publishedTime: post.publishedAt as string | undefined,
        authors: ['Wessam Abdelmajeed'],
        ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
      },
      robots: seo?.noIndex ? { index: false } : undefined,
    }
  } catch {
    return { title: 'Article' }
  }
}

export default async function InsightPost({ params }: Props) {
  const { slug } = await params

  let post: {
    title: string
    slug: string
    excerpt: string
    category: string
    publishedAt?: string
    readingTime?: number
    heroImage?: { url: string; alt?: string } | null
    content: Record<string, unknown> | null
  } | null = null

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      limit: 1,
      depth: 2,
    })
    const raw = docs[0]
    if (!raw) notFound()

    post = {
      title: raw.title as string,
      slug: raw.slug as string,
      excerpt: raw.excerpt as string,
      category: raw.category as string,
      publishedAt: raw.publishedAt as string | undefined,
      readingTime: raw.readingTime as number | undefined,
      heroImage: raw.heroImage && typeof raw.heroImage === 'object' && 'url' in raw.heroImage
        ? { url: (raw.heroImage as { url: string }).url, alt: (raw.heroImage as { alt?: string }).alt }
        : null,
      content: raw.content as Record<string, unknown> | null,
    }
  } catch {
    notFound()
  }

  if (!post) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: 'Wessam Abdelmajeed',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'H++',
      url: siteUrl,
    },
    datePublished: post.publishedAt,
    url: `${siteUrl}/insights/${post.slug}`,
    ...(post.heroImage && { image: post.heroImage.url }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Cover */}
      {post.heroImage && (
        <div className="relative h-64 md:h-80 lg:h-96 w-full bg-blue-light">
          <Image
            src={post.heroImage.url}
            alt={post.heroImage.alt || post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-navy/30" />
        </div>
      )}

      {/* Article */}
      <article className="py-12">
        <Container className="max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-navy transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Insights
            </Link>
          </nav>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-subtle mb-4">
            <span className="bg-teal text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {categoryLabels[post.category] ?? post.category}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
            {post.readingTime && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {post.readingTime} min read
              </span>
            )}
          </div>

          <h1 className="text-navy mb-4">{post.title}</h1>
          <p className="text-lg text-text-muted mb-8 border-b border-border pb-8">{post.excerpt}</p>

          {/* Rich text content */}
          {post.content ? (
            <div className="rich-text text-text-muted leading-relaxed">
              <p className="text-text-muted italic">
                (Full article content will render here via the Lexical renderer once the CMS is connected.)
              </p>
            </div>
          ) : (
            <p className="text-text-muted">Content not available.</p>
          )}

          {/* Author + CTA */}
          <div className="mt-12 pt-10 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-light flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-navy text-lg" style={{ fontFamily: 'var(--font-display)' }}>WA</span>
              </div>
              <div>
                <p className="font-bold text-navy">Wessam Abdelmajeed</p>
                <p className="text-sm text-text-muted">HR Business Partner & Talent Strategist</p>
              </div>
            </div>
            <div className="flex gap-3 justify-start md:justify-end">
              <Button href="/contact" variant="primary" size="sm">
                Work with Wessam <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </Container>
      </article>
    </>
  )
}
