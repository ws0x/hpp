import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'HR insights, strategy articles, and practical advice from Wessam Abdelmajeed — covering HR strategy, recruitment, leadership, and the MENA market.',
}

const categoryLabels: Record<string, string> = {
  'hr-strategy': 'HR Strategy',
  'recruitment': 'Recruitment',
  'leadership': 'Leadership',
  'culture': 'Culture',
  'mena': 'MENA HR',
  'career-tips': 'Career Tips',
}

const ALL_CATEGORIES = Object.entries(categoryLabels).map(([value, label]) => ({ value, label }))

export default async function InsightsPage() {
  let posts: Array<{
    id: string
    title: string
    slug: string
    excerpt: string
    category: string
    publishedAt?: string
    readingTime?: number
    heroImage?: { url: string; alt?: string } | null
  }> = []

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 20,
      depth: 1,
    })

    posts = docs.map((p) => ({
      id: p.id as string,
      title: p.title as string,
      slug: p.slug as string,
      excerpt: p.excerpt as string,
      category: p.category as string,
      publishedAt: p.publishedAt as string | undefined,
      readingTime: p.readingTime as number | undefined,
      heroImage: p.heroImage && typeof p.heroImage === 'object' && 'url' in p.heroImage
        ? { url: (p.heroImage as { url: string }).url, alt: (p.heroImage as { alt?: string }).alt }
        : null,
    }))
  } catch {
    // CMS not connected
  }

  const blogListingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'H++ Insights',
    description: 'HR insights and strategic thinking from Wessam Abdelmajeed',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/insights`,
    author: {
      '@type': 'Person',
      name: 'Wessam Abdelmajeed',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListingJsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Header */}
      <section className="py-16 bg-surface-alt border-b border-border">
        <Container>
          <SectionHeader
            eyebrow="Insights"
            title="Ideas, strategy & HR thinking"
            description="Practical articles on HR strategy, talent, leadership, and the MENA market — written from the field, not a textbook."
          />
        </Container>
      </section>

      {/* Category pills */}
      <section className="py-6 bg-white border-b border-border sticky top-16 z-30">
        <Container>
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            <span className="text-xs font-semibold text-text-subtle uppercase tracking-wide mr-2 whitespace-nowrap">Filter:</span>
            {ALL_CATEGORIES.map(({ value, label }) => (
              <span
                key={value}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-alt text-text-muted border border-border hover:bg-blue-light hover:text-navy cursor-pointer whitespace-nowrap transition-colors"
              >
                {label}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Posts grid */}
      <section className="py-16 bg-white">
        <Container>
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-full bg-blue-light flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-navy/30" style={{ fontFamily: 'var(--font-display)' }}>H++</span>
              </div>
              <h2 className="text-xl font-bold text-navy mb-2">Articles coming soon</h2>
              <p className="text-text-muted">Fresh HR insights will be published here shortly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-xl overflow-hidden border border-border hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="relative h-48 overflow-hidden bg-blue-light">
                    {post.heroImage ? (
                      <Image
                        src={post.heroImage.url}
                        alt={post.heroImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-bold text-navy/15" style={{ fontFamily: 'var(--font-display)' }}>H++</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-teal text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {categoryLabels[post.category] ?? post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-text-subtle mb-3">
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                      {post.readingTime && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.readingTime} min read
                        </span>
                      )}
                    </div>
                    <h2 className="text-base font-bold text-navy mb-2 leading-snug group-hover:text-blue-accent transition-colors flex-1">
                      <Link href={`/insights/${post.slug}`} className="focus-visible:outline-none">
                        <span className="absolute inset-0" aria-hidden />
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-text-muted line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="mt-auto pt-4 border-t border-border">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-accent group-hover:text-navy transition-colors">
                        Read Article <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
