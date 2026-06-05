import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  publishedAt?: string
  readingTime?: number
  heroImage?: { url: string; alt?: string } | null
}

const categoryLabels: Record<string, string> = {
  'hr-strategy': 'HR Strategy',
  'recruitment': 'Recruitment',
  'leadership': 'Leadership',
  'culture': 'Culture',
  'mena': 'MENA HR',
  'career-tips': 'Career Tips',
}

export function InsightsTeaser({ posts }: { posts: Post[] }) {
  return (
    <section className="py-20 bg-surface-alt">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow="Insights"
            title="Insights Blog"
            description="Practical HR thinking from the field."
          />
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-accent hover:text-navy transition-colors whitespace-nowrap"
          >
            All Articles <ArrowRight size={16} />
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <p className="text-lg">New articles coming soon.</p>
            <p className="text-sm mt-1">Check back shortly for fresh HR insights.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <article
                key={post.id}
                className="group bg-white rounded-xl overflow-hidden border border-border hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-up flex flex-col"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Cover */}
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
                      <span className="text-4xl font-bold text-navy/20" style={{ fontFamily: 'var(--font-display)' }}>
                        H++
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-teal text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {categoryLabels[post.category] ?? post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-text-subtle mb-3">
                    {post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    )}
                    {post.readingTime && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readingTime} min read
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-navy mb-2 leading-snug group-hover:text-blue-accent transition-colors">
                    <Link href={`/insights/${post.slug}`} className="focus-visible:outline-none">
                      <span className="absolute inset-0" aria-hidden />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-text-muted line-clamp-3 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 pt-4 border-t border-border">
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
  )
}
