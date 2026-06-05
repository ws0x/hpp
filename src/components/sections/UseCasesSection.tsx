import Link from 'next/link'
import { ArrowRight, Building2, Users, Rocket } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

export type UseCase = {
  id: string
  title: string
  industry?: string
  challenge: string
  result: string
  icon?: string
}

const iconMap: Record<string, React.ElementType> = {
  scaling: Rocket,
  leadership: Users,
  structure: Building2,
}

const fallbackUseCases: UseCase[] = [
  {
    id: '1',
    title: 'Scaling a fintech from 40 to 200 people',
    industry: 'Technology',
    challenge: 'Rapid headcount growth with no scalable org structure or leadership bench.',
    result: 'Redesigned the operating model and built a leadership pipeline that cut time-to-hire 38%.',
    icon: 'scaling',
  },
  {
    id: '2',
    title: 'Turning hiring chaos into a talent engine',
    industry: 'Retail & FMCG',
    challenge: 'High attrition and reactive hiring were stalling regional expansion.',
    result: 'Implemented a talent strategy and hiring framework that lifted retention by 27%.',
    icon: 'leadership',
  },
  {
    id: '3',
    title: 'Fractional CHRO for a scaling group',
    industry: 'Professional Services',
    challenge: 'No senior HR leadership to align people strategy with aggressive growth targets.',
    result: 'Embedded executive HR leadership that governed performance and workforce planning.',
    icon: 'structure',
  },
]

export function UseCasesSection({
  useCases,
  showCta = true,
}: {
  useCases?: UseCase[]
  showCta?: boolean
}) {
  const items = useCases?.length ? useCases : fallbackUseCases

  return (
    <section className="py-16 sm:py-20 bg-white">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow="Use Cases"
            title="Where We Make the Difference"
            description="Real people-and-organization challenges we help scaling businesses solve."
          />
          {showCta && (
            <Link
              href="/success-stories"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:gap-3 transition-all whitespace-nowrap"
            >
              View success stories <ArrowRight size={16} />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((uc, i) => {
            const Icon = iconMap[uc.icon || 'structure'] ?? Building2
            return (
              <article
                key={uc.id}
                className="bg-surface-alt rounded-xl p-6 border border-border hover:shadow-card-hover transition-all duration-300 animate-fade-up flex flex-col"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-lg bg-navy flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-teal" aria-hidden />
                  </div>
                  {uc.industry && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-teal">
                      {uc.industry}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-navy mb-2 leading-snug">{uc.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed mb-3">{uc.challenge}</p>
                <p className="text-sm text-navy font-medium leading-relaxed mt-auto pt-3 border-t border-border">
                  {uc.result}
                </p>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
