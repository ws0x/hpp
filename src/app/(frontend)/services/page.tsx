import type { Metadata } from 'next'
import { BarChart3, Search, TrendingUp, GraduationCap, Target, Users, CheckCircle2 } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { CtaBanner } from '@/components/sections/CtaBanner'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'HR consulting, recruitment, organisational development, and training services across the MENA region. Strategic HR that delivers real results.',
}

const iconMap: Record<string, React.ElementType> = {
  'hr-consulting':   BarChart3,
  'recruitment':     Search,
  'org-development': TrendingUp,
  'training':        GraduationCap,
  'strategy':        Target,
  'people':          Users,
}

const defaultServices = [
  {
    id: '1',
    title: 'HR Consulting & Advisory',
    shortDescription: 'Strategic HR frameworks that align people, culture, and business objectives.',
    description: null as null,
    highlights: ['HR audit and diagnostic', 'Policy design and implementation', 'HR roadmap development', 'Change management advisory'],
    icon: 'hr-consulting',
  },
  {
    id: '2',
    title: 'Recruitment & Talent Acquisition',
    shortDescription: 'End-to-end hiring that attracts and retains the right people at every level.',
    description: null as null,
    highlights: ['Executive and mid-level hiring', 'Employer branding strategy', 'Interview frameworks and tools', 'Talent pipeline building'],
    icon: 'recruitment',
  },
  {
    id: '3',
    title: 'Organisational Development',
    shortDescription: 'Build adaptive, high-performance structures that scale with your ambitions.',
    description: null as null,
    highlights: ['Org design and restructuring', 'Culture diagnostics', 'Performance management systems', 'Succession planning'],
    icon: 'org-development',
  },
  {
    id: '4',
    title: 'Training & Employee Experience',
    shortDescription: 'Learning programmes and culture initiatives that develop and retain talent.',
    description: null as null,
    highlights: ['Leadership development programmes', 'Onboarding redesign', 'Employee engagement surveys', 'HR team capability building'],
    icon: 'training',
  },
]

export default async function ServicesPage() {
  let services = defaultServices
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
        description: null,
        highlights: ((s.highlights as Array<{ point: string }>) || []).map((h) => h.point),
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
        provider: {
          '@type': 'Person',
          name: 'Wessam Abdelmajeed',
        },
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
            <p className="text-sm font-semibold uppercase tracking-widest text-orange mb-3">Services</p>
            <h1 className="text-navy mb-4">What I Offer</h1>
            <p className="text-lg text-text-muted max-w-xl">
              Tailored HR consulting and advisory services designed to solve real business challenges — from strategy to execution.
            </p>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <Container>
          <div className="space-y-12">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] ?? BarChart3
              const isReversed = i % 2 !== 0
              return (
                <article
                  key={service.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Icon block */}
                  <div className={`flex justify-center ${isReversed ? 'lg:order-2' : ''}`}>
                    <div className="w-48 h-48 rounded-2xl bg-blue-light flex items-center justify-center shadow-card">
                      <Icon size={72} className="text-blue-accent" strokeWidth={1.25} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={isReversed ? 'lg:order-1' : ''}>
                    <h2 className="text-2xl font-bold text-navy mb-3">{service.title}</h2>
                    <p className="text-text-muted mb-6 leading-relaxed">{service.shortDescription}</p>

                    {service.highlights.length > 0 && (
                      <ul className="space-y-2 mb-8">
                        {service.highlights.map((h, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-text">
                            <CheckCircle2 size={16} className="text-orange flex-shrink-0" aria-hidden />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}

                    <Button href={bookingUrl} variant="primary" size="md">
                      Enquire About This Service
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        </Container>
      </section>

      <CtaBanner
        title="Not sure where to start?"
        subtitle="Book a free 30-minute discovery call and let's explore how H++ can help your organisation."
        primaryLabel="Book a Free Call"
        bookingUrl={bookingUrl}
      />
    </>
  )
}
