import type { Metadata } from 'next'
import Image from 'next/image'
import { Quote } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { LinkedInIcon } from '@/components/ui/LinkedInIcon'
import { CtaBanner } from '@/components/sections/CtaBanner'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Recommendations',
  description:
    'Professional recommendations for H++ — what leaders across the MENA region say about working with our strategic people consulting team.',
}

type Recommendation = {
  id: string
  name: string
  role?: string
  company?: string
  relationship?: string
  quote: string
  linkedinUrl?: string
  photo?: { url: string; alt?: string } | null
}

const fallback: Recommendation[] = [
  {
    id: '1',
    name: 'Chief Executive Officer',
    role: 'CEO',
    company: 'Scaling technology company',
    quote:
      'H++ helped us see that our hiring struggles were really an organization-design problem. The clarity and structure they brought changed how we scale.',
  },
  {
    id: '2',
    name: 'Founder',
    role: 'Founder & Managing Director',
    company: 'Regional services group',
    quote:
      'Having a Fractional CHRO from H++ gave us executive HR leadership we could not yet justify full-time. The impact on our leadership team was immediate.',
  },
  {
    id: '3',
    name: 'VP People',
    role: 'VP, People & Culture',
    company: 'High-growth retail brand',
    quote:
      'The Growth Readiness Diagnostic gave our board a clear, honest picture — and a roadmap we are still executing against today.',
  },
]

export default async function RecommendationsPage() {
  let recommendations: Recommendation[] = fallback
  let bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || '/contact'

  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    if (settings?.bookingUrl) bookingUrl = settings.bookingUrl as string

    try {
      const data = await payload.find({
        collection: 'recommendations', where: { isActive: { equals: true } }, sort: 'order', limit: 50, depth: 1,
      })
      if (data.docs.length) {
        recommendations = data.docs.map((r) => ({
          id: r.id as string,
          name: r.name as string,
          role: r.role as string | undefined,
          company: r.company as string | undefined,
          relationship: r.relationship as string | undefined,
          quote: r.quote as string,
          linkedinUrl: r.linkedinUrl as string | undefined,
          photo: r.photo && typeof r.photo === 'object' && 'url' in r.photo
            ? { url: (r.photo as { url: string }).url, alt: (r.photo as { alt?: string }).alt }
            : null,
        }))
      }
    } catch { /* collection not migrated yet */ }
  } catch { /* CMS not connected */ }

  return (
    <>
      {/* Header */}
      <section className="py-16 bg-surface-alt border-b border-border">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-3">Recommendations</p>
            <h1 className="text-navy mb-4">What Leaders Say About Working With Us</h1>
            <p className="text-lg text-text-muted max-w-xl">
              Trusted by founders, CEOs, and people leaders across the MENA region — in their words.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((r, i) => (
              <blockquote
                key={r.id}
                className="bg-surface-alt rounded-xl p-7 border border-border flex flex-col animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <Quote size={28} className="text-teal mb-4 flex-shrink-0" aria-hidden />
                <p className="text-text-muted leading-relaxed text-sm flex-1 mb-6">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <footer className="flex items-center gap-3">
                  {r.photo ? (
                    <Image
                      src={r.photo.url}
                      alt={r.photo.alt || r.name}
                      width={44}
                      height={44}
                      className="rounded-full object-cover ring-2 ring-white"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-blue-light flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-navy">{r.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-navy">{r.name}</p>
                    {(r.role || r.company) && (
                      <p className="text-xs text-text-subtle truncate">
                        {[r.role, r.company].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                  {r.linkedinUrl && (
                    <a
                      href={r.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${r.name} on LinkedIn`}
                      className="ml-auto text-text-subtle hover:text-teal transition-colors"
                    >
                      <LinkedInIcon size={16} />
                    </a>
                  )}
                </footer>
              </blockquote>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner bookingUrl={bookingUrl} />
    </>
  )
}
