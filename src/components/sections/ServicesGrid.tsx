import Link from 'next/link'
import {
  ArrowRight, Users, Search, BarChart3, Network, Briefcase,
  TrendingUp, GraduationCap, Target,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

// Icon value doubles as the solution slug → /services#<slug>.
const iconMap: Record<string, React.ElementType> = {
  'growth-readiness':   BarChart3,
  'fractional-chro':    Briefcase,
  'org-design':         Network,
  'leadership-advisory': Users,
  'executive-search':   Search,
  // Legacy fallbacks
  'hr-consulting':      BarChart3,
  'recruitment':        Search,
  'org-development':    TrendingUp,
  'training':           GraduationCap,
  'strategy':           Target,
  'people':             Users,
}

type Service = {
  id: string
  title: string
  shortDescription: string
  icon: string
}

export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <section className="py-16 sm:py-20 bg-surface-alt">
      <Container>
        <SectionHeader
          eyebrow="What We Do"
          title="Strategic Solutions for Sustainable Growth"
          description="We partner with leadership teams to solve people and organization challenges that impact performance and growth."
          align="center"
          className="mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? BarChart3
            return (
              <article
                key={service.id}
                className="group bg-white rounded-xl p-6 border border-border transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-fade-up flex flex-col"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-blue-light flex items-center justify-center mb-4 group-hover:bg-teal transition-colors duration-300">
                  <Icon
                    size={22}
                    className="text-teal group-hover:text-navy transition-colors duration-300"
                  />
                </div>
                <h3 className="text-base font-bold text-navy mb-2 leading-snug">{service.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed flex-1">{service.shortDescription}</p>
                <Link
                  href={`/services#${service.icon}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:gap-2.5 transition-all"
                  aria-label={`Learn more about ${service.title}`}
                >
                  Learn More <ArrowRight size={15} />
                </Link>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
