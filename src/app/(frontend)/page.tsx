import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { HeroSection } from '@/components/sections/HeroSection'
import { StatsBar } from '@/components/sections/StatsBar'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { WhySection } from '@/components/sections/WhySection'
import { InsightsTeaser } from '@/components/sections/InsightsTeaser'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { NewsletterSection } from '@/components/sections/NewsletterSection'
import { CtaBanner } from '@/components/sections/CtaBanner'

export const metadata: Metadata = {
  title: 'H++ | Evolving Human Resources',
  description:
    'Wessam Abdelmajeed — HR Business Partner & Talent Strategist. Innovative HR consulting, recruitment, and advisory solutions across the MENA region.',
}

const defaultHero = {
  headline: 'Evolving Human Resources',
  subtext:
    'Empowering organisations to grow through people. Innovative HR solutions, tailored strategies, and real impact — all in one place.',
  primaryCtaLabel: "Let's Connect",
  secondaryCtaLabel: 'View My Services',
  identityTitle: 'HR Business Partner and Talent Strategist',
  aboutLinkLabel: 'Read More About Me',
}

const defaultWhyPoints = [
  'Human-first, business-minded',
  'Proven track record across MENA',
  'Strategic, not transactional',
  'Passionate about sustainable HR',
]

const defaultServices = [
  { id: '1', title: 'HR Consulting & Advisory',         shortDescription: 'Strategic HR frameworks that align people, culture, and business objectives.', icon: 'hr-consulting' },
  { id: '2', title: 'Recruitment & Talent Acquisition', shortDescription: 'End-to-end hiring that attracts and retains the right people at every level.',  icon: 'recruitment' },
  { id: '3', title: 'Organisational Development',       shortDescription: 'Build adaptive, high-performance structures that scale with your ambitions.',    icon: 'org-development' },
  { id: '4', title: 'Training & Employee Experience',   shortDescription: 'Learning programmes and culture initiatives that develop and retain talent.',     icon: 'training' },
]

const defaultStats = [
  { value: '10+',  label: 'Years Experience' },
  { value: '50+',  label: 'Companies Served' },
  { value: '200+', label: 'Candidates Placed' },
  { value: 'MENA', label: 'Region Coverage' },
]

export default async function HomePage() {
  let hero        = defaultHero
  let whyPoints   = defaultWhyPoints
  let services    = defaultServices
  let stats       = defaultStats
  let showStats   = true
  let testimonials: Parameters<typeof TestimonialsSection>[0]['testimonials'] = []
  let posts:        Parameters<typeof InsightsTeaser>[0]['posts']             = []
  let bookingUrl  = process.env.NEXT_PUBLIC_BOOKING_URL || '/contact'

  try {
    const payload = await getPayloadClient()

    const [heroData, aboutData, settingsData, statsData, servicesData, testimonialsData, postsData] =
      await Promise.all([
        payload.findGlobal({ slug: 'hero-content' }),
        payload.findGlobal({ slug: 'about-content' }),
        payload.findGlobal({ slug: 'site-settings' }),
        payload.findGlobal({ slug: 'stats-content' }),
        payload.find({ collection: 'services',     where: { isActive: { equals: true } }, sort: 'order',        limit: 4  }),
        payload.find({ collection: 'testimonials', where: { isActive: { equals: true } }, sort: 'order',        limit: 3  }),
        payload.find({ collection: 'posts',        where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 3, depth: 1 }),
      ])

    if (heroData) {
      hero = {
        headline:          (heroData.headline as string)          || defaultHero.headline,
        subtext:           (heroData.subtext  as string)          || defaultHero.subtext,
        primaryCtaLabel:   (heroData.primaryCtaLabel as string)   || defaultHero.primaryCtaLabel,
        secondaryCtaLabel: (heroData.secondaryCtaLabel as string) || defaultHero.secondaryCtaLabel,
        identityTitle:     (heroData.identityTitle as string)     || defaultHero.identityTitle,
        aboutLinkLabel:    (heroData.aboutLinkLabel as string)    || defaultHero.aboutLinkLabel,
      }
    }

    if (settingsData?.bookingUrl) bookingUrl = settingsData.bookingUrl as string

    if (statsData) {
      showStats = (statsData.isVisible as boolean) !== false
      const raw = statsData.stats as Array<{ value: string; label: string }> | undefined
      if (raw?.length) stats = raw
    }

    if (aboutData?.whyPoints) {
      const pts = aboutData.whyPoints as Array<{ point: string }>
      if (pts.length) whyPoints = pts.map((p) => p.point)
    }

    if (servicesData.docs.length) {
      services = servicesData.docs.map((s) => ({
        id:               s.id as string,
        title:            s.title as string,
        shortDescription: s.shortDescription as string,
        icon:             s.icon as string,
      }))
    }

    if (testimonialsData.docs.length) {
      testimonials = testimonialsData.docs.map((t) => ({
        id:         t.id as string,
        clientName: t.clientName as string,
        role:       t.role    as string | undefined,
        company:    t.company as string | undefined,
        quote:      t.quote   as string,
        photo: t.photo && typeof t.photo === 'object' && 'url' in t.photo
          ? { url: (t.photo as { url: string }).url, alt: (t.photo as { alt?: string }).alt }
          : null,
      }))
    }

    if (postsData.docs.length) {
      posts = postsData.docs.map((p) => ({
        id:          p.id        as string,
        title:       p.title     as string,
        slug:        p.slug      as string,
        excerpt:     p.excerpt   as string,
        category:    p.category  as string,
        publishedAt: p.publishedAt as string | undefined,
        readingTime: p.readingTime as number | undefined,
        heroImage: p.heroImage && typeof p.heroImage === 'object' && 'url' in p.heroImage
          ? { url: (p.heroImage as { url: string }).url, alt: (p.heroImage as { alt?: string }).alt }
          : null,
      }))
    }
  } catch {
    // CMS not connected — render with defaults
  }

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Wessam Abdelmajeed',
    jobTitle: 'HR Business Partner & Talent Strategist',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    sameAs: ['https://www.linkedin.com/in/wessam-abd-el-majeed/'],
    worksFor: {
      '@type': 'Organization',
      name: 'H++',
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
    description:
      'Senior HR Business Partner and Talent Strategist with proven track record across the MENA region.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }}
      />

      <HeroSection
        {...hero}
        portrait={{ url: '/images/wessam.png', alt: 'Wessam Abdelmajeed' }}
        bookingUrl={bookingUrl}
      />

      {showStats && <StatsBar stats={stats} />}

      <ServicesGrid services={services} />

      <WhySection points={whyPoints} />

      <InsightsTeaser posts={posts} />

      {testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}

      <NewsletterSection />

      <CtaBanner bookingUrl={bookingUrl} />
    </>
  )
}
