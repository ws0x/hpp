import { CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function WhySection({ points }: { points: string[] }) {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left text */}
          <div>
            <SectionHeader
              eyebrow="The Difference"
              title="Why H++"
              description="Not every HR partner is built the same. Here's what sets this practice apart."
            />
          </div>

          {/* Right checklist */}
          <ul className="space-y-4" role="list">
            {points.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-3 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CheckCircle2
                  size={22}
                  className="text-orange flex-shrink-0 mt-0.5"
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
