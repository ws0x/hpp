import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { HeroSection } from '@/components/sections/HeroSection'
import { StatsBar } from '@/components/sections/StatsBar'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { MethodologySection } from '@/components/sections/MethodologySection'
import { WhySection } from '@/components/sections/WhySection'
import { UseCasesSection, type UseCase } from '@/components/sections/UseCasesSection'
import { InsightsTeaser } from '@/components/sections/InsightsTeaser'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { ClientLogosStrip } from '@/components/sections/ClientLogosStrip'
import { CtaBanner } from '@/components/sections/CtaBanner'

export const metadata: Metadata = {
  title: 'H++ | Building Organizations Ready for Growth',
  description:
    'H++ is a strategic people consulting firm helping scaling businesses build scalable organizations, stronger leadership teams, and high-performing workforces across the MENA region.',
}

const defaultHero = {
  headline: 'Building Organizations Ready for Growth',
  subtext:
    'Strategic people consulting that helps scaling businesses unlock potential, build strong leadership, and create high-performing organizations.',
  primaryCtaLabel: 'Get Your Growth Readiness Assessment',
  secondaryCtaLabel: 'Our Solutions',
}

const defaultWhyPoints = [
  'We diagnose root causes, not just symptoms',
  'Senior advisors with deep MENA market experience',
  'Strategic partnership — not transactional hiring',
  'Solutions built to scale with your business',
]

const defaultServices = [
  { id: '1', title: 'Growth Readiness Diagnostic™',      shortDescription: "A comprehensive assessment that reveals your organization's strengths, risks, and growth opportunities.", icon: 'growth-readiness' },
  { id: '2', title: 'Fractional CHRO™',                  shortDescription: 'Executive HR leadership and strategic advisory without the cost of a full-time CHRO.',                     icon: 'fractional-chro' },
  { id: '3', title: 'Organizational Design',             shortDescription: 'Build scalable structures, clear roles, and effective operating models that support growth.',            icon: 'org-design' },
  { id: '4', title: 'Leadership Advisory',               shortDescription: 'Develop strong leaders and aligned teams that drive performance and results.',                           icon: 'leadership-advisory' },
  { id: '5', title: 'Executive Search',                  shortDescription: 'Attract and secure exceptional leaders for the roles that matter most.',                                icon: 'executive-search' },
]

const defaultStats = [
  { value: '10+',  label: 'Years of Experience' },
  { value: '50+',  label: 'Organizations Served' },
  { value: 'MENA', label: 'Regional Coverage' },
  { value: '30K+', label: 'Professional Network' },
]

export default async function HomePage() {
  let hero        = defaultHero
  let whyPoints   = defaultWhyPoints
  let services    = defaultServices
  let stats       = defaultStats
  let showStats   = true
  let testimonials: Parameters<typeof TestimonialsSection>[0]['testimonials'] = []
  let posts:        Parameters<typeof InsightsTeaser>[0]['posts']             = []
  let useCases:     UseCase[]                                                 = []
  let logos:        Parameters<typeof ClientLogosStrip>[0]['logos']           = []
  let bookingUrl  = process.env.NEXT_PUBLIC_BOOKING_URL || '/contact'

  try {
    const payload = await getPayloadClient()

    const [heroData, aboutData, settingsData, statsData, servicesData, testimonialsData, postsData] =
      await Promise.all([
        payload.findGlobal({ slug: 'hero-content' }),
        payload.findGlobal({ slug: 'about-content' }),
        payload.findGlobal({ slug: 'site-settings' }),
        payload.findGlobal({ slug: 'stats-content' }),
        payload.find({ collection: 'services',     where: { isActive: { equals: true } }, sort: 'order',        limit: 5  }),
        payload.find({ collection: 'testimonials', where: { isActive: { equals: true } }, sort: 'order',        limit: 3  }),
        payload.find({ collection: 'posts',        where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 3, depth: 1 }),
      ])

    if (heroData) {
      hero = {
        headline:          (heroData.headline as string)          || defaultHero.headline,
        subtext:           (heroData.subtext  as string)          || defaultHero.subtext,
        primaryCtaLabel:   (heroData.primaryCtaLabel as string)   || defaultHero.primaryCtaLabel,
        secondaryCtaLabel: (heroData.secondaryCtaLabel as string) || defaultHero.secondaryCtaLabel,
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

    // Optional collections — tolerate absence so the page still renders.
    try {
      const useCasesData = await payload.find({
        collection: 'use-cases', where: { isActive: { equals: true } }, sort: 'order', limit: 3,
      })
      if (useCasesData.docs.length) {
        useCases = useCasesData.docs.map((u) => ({
          id:        u.id as string,
          title:     u.title as string,
          industry:  u.industry as string | undefined,
          challenge: u.challenge as string,
          result:    u.result as string,
          icon:      u.icon as string | undefined,
        }))
      }
    } catch { /* collection not migrated yet */ }

    try {
      const logosData = await payload.find({
        collection: 'client-logos', where: { isActive: { equals: true } }, sort: 'order', limit: 12, depth: 1,
      })
      if (logosData.docs.length) {
        logos = logosData.docs.map((l) => ({
          id:   l.id as string,
          name: l.name as string,
          logo: l.logo && typeof l.logo === 'object' && 'url' in l.logo
            ? { url: (l.logo as { url: string }).url, alt: (l.logo as { alt?: string }).alt }
            : null,
        }))
      }
    } catch { /* collection not migrated yet */ }
  } catch {
    // CMS not connected — render with defaults
  }

  return (
    <>
      <HeroSection {...hero} bookingUrl={bookingUrl} />

      {showStats && <StatsBar stats={stats} />}

      <ServicesGrid services={services} />

      <MethodologySection />

      <WhySection points={whyPoints} />

      <UseCasesSection useCases={useCases} />

      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}

      <ClientLogosStrip logos={logos} />

      <InsightsTeaser posts={posts} />

      <CtaBanner bookingUrl={bookingUrl} />
    </>
  )
}
