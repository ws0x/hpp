import { CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function WhySection({ points }: { points: string[] }) {
  return (
    <section className="py-16 sm:py-20 bg-surface-alt">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left text */}
          <div>
            <SectionHeader
              eyebrow="Why H++"
              title="Why Companies Work With Us"
            />
            <div className="mt-5 space-y-3 text-text-muted leading-relaxed max-w-xl">
              <p>
                Most companies think they have a hiring problem. In reality, they have
                growth, leadership, organization, and talent challenges.
              </p>
              <p className="text-navy font-medium">
                We help businesses identify and solve the root causes behind people-related
                business problems — so growth becomes repeatable, not accidental.
              </p>
            </div>
          </div>

          {/* Right checklist */}
          <ul className="space-y-4" role="list">
            {points.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-3 bg-white rounded-xl border border-border p-4 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CheckCircle2
                  size={22}
                  className="text-teal flex-shrink-0 mt-0.5"
                  aria-hidden
                />
                <span className="text-text font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
