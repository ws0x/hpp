import type { Metadata } from 'next'
import {
  BarChart3, Search, Network, Briefcase, Users, TrendingUp,
  GraduationCap, Target, CheckCircle2, ArrowRight, Sparkles,
} from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { Container } from '@/components/ui/Container'
import { CtaBanner } from '@/components/sections/CtaBanner'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Solutions',
  description:
    'Strategic people consulting solutions: Growth Readiness Diagnostic™, Fractional CHRO™, Organizational Design & Transformation, Leadership Advisory, and Executive Search across the MENA region.',
}

// Icon value doubles as the anchor slug (/services#<icon>).
const iconMap: Record<string, React.ElementType> = {
  'growth-readiness':    BarChart3,
  'fractional-chro':     Briefcase,
  'org-design':          Network,
  'leadership-advisory': Users,
  'executive-search':    Search,
  'hr-consulting':       BarChart3,
  'recruitment':         Search,
  'org-development':     TrendingUp,
  'training':            GraduationCap,
  'strategy':            Target,
  'people':             Users,
}

type ServiceItem = {
  id: string
  title: string
  shortDescription: string
  highlights: string[]
  deliverable?: string | null
  icon: string
}

const defaultServices: ServiceItem[] = [
  {
    id: '1',
    title: 'Growth Readiness Diagnostic™',
    shortDescription:
      "Assess your organization's ability to scale successfully. A comprehensive diagnostic that reveals strengths, risks, and growth opportunities — and gives you a clear roadmap to act on.",
    highlights: [
      'Leadership Assessment',
      'Organizational Structure Review',
      'Talent Risk Analysis',
      'Hiring Effectiveness Review',
      'Performance Evaluation',
      'Culture Assessment',
    ],
    deliverable: 'Growth Readiness Score & Strategic Roadmap',
    icon: 'growth-readiness',
  },
  {
    id: '2',
    title: 'Fractional CHRO™',
    shortDescription:
      'Executive HR leadership without the cost of a full-time CHRO. Senior, embedded people leadership that aligns your HR function with your growth strategy.',
    highlights: [
      'Strategic HR Leadership',
      'Executive Advisory',
      'Workforce Planning',
      'Leadership Development',
      'Performance Governance',
      'Organizational Design',
    ],
    deliverable: 'Embedded executive HR leadership on a flexible basis',
    icon: 'fractional-chro',
  },
  {
    id: '3',
    title: 'Organizational Design & Transformation',
    shortDescription:
      'Build scalable structures that support growth — clear roles, effective operating models, and the org architecture to scale without chaos.',
    highlights: [
      'Operating model design',
      'Role & responsibility clarity',
      'Span-and-layer optimisation',
      'Change management',
      'Workforce planning',
    ],
    deliverable: 'A scalable operating model & transformation plan',
    icon: 'org-design',
  },
  {
    id: '4',
    title: 'Leadership Advisory',
    shortDescription:
      'Develop strong leaders and aligned teams that drive performance and results — from the C-suite to emerging leadership.',
    highlights: [
      'Leadership assessment',
      'Executive coaching & advisory',
      'Team alignment',
      'Succession planning',
      'Performance governance',
    ],
    deliverable: 'A stronger, aligned leadership bench',
    icon: 'leadership-advisory',
  },
  {
    id: '5',
    title: 'Executive Search',
    shortDescription:
      'When critical leadership roles matter. We help you attract and secure exceptional leaders for the roles that define your trajectory.',
    highlights: [
      'Executive & senior hiring',
      'Market mapping',
      'Confidential search',
      'Leadership assessment',
      'Onboarding advisory',
    ],
    deliverable: 'The right leader, secured and set up to succeed',
    icon: 'executive-search',
  },
]

export default async function ServicesPage() {
  let services: ServiceItem[] = defaultServices
  let bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || '/contact'

  try {
    const payload = await getPayloadClient()
    const [servicesData, settingsData] = await Promise.all([
      payload.find({ collection: 'services', where: { isActive: { equals: true } }, sort: 'order', limit: 20, depth: 0 }),
      payload.findGlobal({ slug: 'site-settings' }),
    ])
    if (settingsData?.bookingUrl) bookingUrl = settingsData.bookingUrl as string
    if (servicesData.docs.length) {
      services = servicesData.docs.map((s) => ({
        id: s.id as string,
        title: s.title as string,
        shortDescription: s.shortDescription as string,
        highlights: ((s.highlights as Array<{ point: string }>) || []).map((h) => h.point),
        deliverable: null,
        icon: s.icon as string,
      }))
    }
  } catch {
    // CMS not connected
  }

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.shortDescription,
        provider: { '@type': 'Organization', name: 'H++' },
        areaServed: 'MENA',
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Header */}
      <section className="py-16 bg-surface-alt border-b border-border">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-3">Solutions</p>
            <h1 className="text-navy mb-4">Strategic Solutions for Sustainable Growth</h1>
            <p className="text-lg text-text-muted max-w-xl">
              Most companies think they have a hiring problem. In reality, they have growth, leadership,
              organization, and talent challenges. Here is how we help you solve them.
            </p>
          </div>
        </Container>
      </section>

      {/* Solutions */}
      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <div className="space-y-16">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] ?? BarChart3
              const isReversed = i % 2 !== 0
              return (
                <article
                  key={service.id}
                  id={service.icon}
                  className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Icon block — desktop */}
                  <div className={`hidden lg:flex justify-center ${isReversed ? 'lg:order-2' : ''}`}>
                    <div className="relative w-56 h-56 rounded-3xl bg-brand-gradient flex items-center justify-center shadow-card-hover">
                      <Icon size={80} className="text-white" strokeWidth={1.25} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={isReversed ? 'lg:order-1' : ''}>
                    <h2 className="text-2xl font-bold text-navy mb-3">{service.title}</h2>
                    <p className="text-text-muted mb-6 leading-relaxed">{service.shortDescription}</p>

                    {service.highlights.length > 0 && (
                      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-6">
                        {service.highlights.map((h, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-text">
                            <CheckCircle2 size={16} className="text-teal flex-shrink-0" aria-hidden />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}

                    {service.deliverable && (
                      <div className="flex items-start gap-2 mb-7 rounded-xl bg-blue-light border border-border p-3.5">
                        <Sparkles size={16} className="text-teal flex-shrink-0 mt-0.5" aria-hidden />
                        <p className="text-sm text-navy">
                          <span className="font-semibold">Deliverable: </span>
                          {service.deliverable}
                        </p>
                      </div>
                    )}

                    <Link
                      href={bookingUrl}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-navy/30 text-navy text-sm font-semibold bg-transparent hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 group"
                    >
                      Enquire About This Solution
                      <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </Container>
      </section>

      <CtaBanner
        title="Not sure where to start?"
        subtitle="Start with a Growth Readiness Assessment, or book a discovery call and we'll help you find the right entry point."
        primaryLabel="Book a Discovery Call"
        bookingUrl={bookingUrl}
      />
    </>
  )
}
