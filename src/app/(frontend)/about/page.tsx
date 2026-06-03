import type { Metadata } from 'next'
import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { CtaBanner } from '@/components/sections/CtaBanner'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Wessam Abdelmajeed — HR Business Partner and Talent Strategist with a proven track record across the MENA region.',
}

export default async function AboutPage() {
  let bioHtml: string | null = null
  let missionStatement: string | null = null
  let values: Array<{ title: string; description?: string }> = []
  let whyPoints: string[] = []
  let certifications: Array<{
    id: string
    name: string
    issuer: string
    year?: number
    badgeImage?: { url: string; alt?: string } | null
    verifyUrl?: string
  }> = []
  let bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || '/contact'

  try {
    const payload = await getPayloadClient()

    const [aboutData, settingsData, certsData] = await Promise.all([
      payload.findGlobal({ slug: 'about-content' }),
      payload.findGlobal({ slug: 'site-settings' }),
      payload.find({ collection: 'certifications', where: { isActive: { equals: true } }, sort: 'order', limit: 20 }),
    ])

    if (settingsData?.bookingUrl) bookingUrl = settingsData.bookingUrl as string

    if (aboutData) {
      missionStatement = (aboutData.missionStatement as string) || null
      values = (aboutData.values as Array<{ title: string; description?: string }>) || []
      whyPoints = ((aboutData.whyPoints as Array<{ point: string }>) || []).map((p) => p.point)
    }

    if (certsData.docs.length) {
      certifications = certsData.docs.map((c) => ({
        id: c.id as string,
        name: c.name as string,
        issuer: c.issuer as string,
        year: c.year as number | undefined,
        verifyUrl: c.verifyUrl as string | undefined,
        badgeImage: c.badgeImage && typeof c.badgeImage === 'object' && 'url' in c.badgeImage
          ? { url: (c.badgeImage as { url: string }).url, alt: (c.badgeImage as { alt?: string }).alt }
          : null,
      }))
    }
  } catch {
    // CMS not connected
  }

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Wessam Abdelmajeed',
    jobTitle: 'HR Business Partner & Talent Strategist',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    sameAs: ['https://linkedin.com/in/wessam-abd-el-majeed'],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Page header */}
      <section className="py-16 bg-surface-alt border-b border-border">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange mb-3">About</p>
            <h1 className="text-navy mb-4">About Wessam</h1>
            <p className="text-lg text-text-muted max-w-xl">
              HR Business Partner & Talent Strategist — helping organisations build and sustain great people culture.
            </p>
          </div>
        </Container>
      </section>

      {/* Bio + portrait */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Portrait */}
            <div className="lg:col-span-2 flex justify-center lg:justify-start">
              <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-2xl overflow-hidden bg-blue-light shadow-card-hover">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl font-bold text-navy/30" style={{ fontFamily: 'var(--font-display)' }}>
                    WA
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-3">
              {missionStatement && (
                <blockquote className="border-l-4 border-orange pl-5 mb-8">
                  <p className="text-xl font-semibold text-navy italic leading-relaxed">
                    &ldquo;{missionStatement}&rdquo;
                  </p>
                </blockquote>
              )}

              {bioHtml ? (
                <div
                  className="rich-text"
                  dangerouslySetInnerHTML={{ __html: bioHtml }}
                />
              ) : (
                <div className="space-y-4 text-text-muted leading-relaxed">
                  <p>
                    Wessam Abdelmajeed is a senior HR Business Partner and Talent Strategist with deep expertise across the MENA region. With a career spanning multiple industries and organisations, Wessam brings a rare combination of strategic vision and operational excellence to every engagement.
                  </p>
                  <p>
                    His philosophy is simple: great organisations are built by great people, and great people thrive when supported by thoughtful HR systems. Whether restructuring a talent acquisition function, building a learning & development programme from scratch, or advising C-suite leaders on people strategy, Wessam delivers real, measurable impact.
                  </p>
                  <p>
                    Through H++, he offers independent consulting, advisory, and training services to companies that want to evolve their HR from administrative overhead into a genuine competitive advantage.
                  </p>
                </div>
              )}

              <div className="mt-8">
                <Button href={bookingUrl} variant="primary" size="md">
                  Request a Service
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      {values.length > 0 && (
        <section className="py-20 bg-surface-alt">
          <Container>
            <SectionHeader eyebrow="Guiding Principles" title="Mission & Values" className="mb-12" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 border border-border animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <h3 className="text-base font-bold text-navy mb-2">{v.title}</h3>
                  {v.description && <p className="text-sm text-text-muted">{v.description}</p>}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Why H++ */}
      {whyPoints.length > 0 && (
        <section className="py-20 bg-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <SectionHeader eyebrow="The Difference" title="Why Work With Wessam" />
              <ul className="space-y-4">
                {whyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                    <CheckCircle2 size={22} className="text-orange flex-shrink-0 mt-0.5" aria-hidden />
                    <span className="text-text font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="py-20 bg-surface-alt">
          <Container>
            <SectionHeader
              eyebrow="Credentials"
              title="Certifications & Expertise"
              align="center"
              className="mb-12"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-xl p-5 border border-border text-center hover:shadow-card-hover transition-all duration-300"
                >
                  {cert.badgeImage && (
                    <Image
                      src={cert.badgeImage.url}
                      alt={cert.badgeImage.alt || cert.name}
                      width={64}
                      height={64}
                      className="mx-auto mb-3 object-contain"
                    />
                  )}
                  <p className="text-xs font-bold text-navy leading-tight">{cert.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{cert.issuer}</p>
                  {cert.year && <p className="text-xs text-text-subtle mt-1">{cert.year}</p>}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBanner bookingUrl={bookingUrl} />
    </>
  )
}
