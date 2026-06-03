import Link from 'next/link'
import { ArrowRight, Users, Search, TrendingUp, GraduationCap, BarChart3, Target } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

const iconMap: Record<string, React.ElementType> = {
  'hr-consulting':   BarChart3,
  'recruitment':     Search,
  'org-development': TrendingUp,
  'training':        GraduationCap,
  'strategy':        Target,
  'people':          Users,
}

type Service = {
  id: string
  title: string
  shortDescription: string
  icon: string
}

export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <section className="py-20 bg-surface-alt">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow="What I Do"
            title="Core Services"
            description="Strategic HR solutions designed to build thriving organisations."
          />
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-accent hover:text-navy transition-colors whitespace-nowrap"
            aria-label="View all services"
          >
            Explore Services <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? BarChart3
            return (
              <article
                key={service.id}
                className="group bg-white rounded-xl p-6 border border-border transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-blue-light flex items-center justify-center mb-4 group-hover:bg-navy transition-colors duration-300">
                  <Icon
                    size={22}
                    className="text-blue-accent group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3 className="text-base font-bold text-navy mb-2 leading-snug">{service.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{service.shortDescription}</p>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
