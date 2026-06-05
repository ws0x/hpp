import { Search, PenTool, Rocket, LineChart } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

const steps = [
  {
    icon: Search,
    title: 'Diagnose',
    description:
      'We uncover the real challenges and opportunities through data, conversations, and analysis — not assumptions.',
  },
  {
    icon: PenTool,
    title: 'Design',
    description:
      'We create tailored strategies and practical solutions aligned with your business goals and growth stage.',
  },
  {
    icon: Rocket,
    title: 'Deploy',
    description:
      'We work alongside your team to implement solutions and build the internal capabilities to sustain them.',
  },
  {
    icon: LineChart,
    title: 'Drive Results',
    description:
      'We measure impact, refine strategies, and help you sustain long-term, people-powered growth.',
  },
]

export function MethodologySection() {
  return (
    <section className="py-16 sm:py-20 bg-white" id="methodology">
      <Container>
        <SectionHeader
          eyebrow="Our Methodology"
          title="A Clear Path from Insight to Impact"
          align="center"
          className="mb-14"
        />

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
          {/* Connecting line (desktop) */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-teal/30 via-teal/50 to-teal/30"
          />

          {steps.map(({ icon: Icon, title, description }, i) => {
            const isTeal = i % 2 === 1
            return (
              <div key={title} className="relative text-center animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div
                  className={`relative z-10 mx-auto w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                    isTeal ? 'bg-teal text-navy' : 'bg-navy text-white'
                  }`}
                >
                  <Icon size={24} aria-hidden />
                </div>
                <p className="mt-4 text-sm font-bold text-teal tracking-widest">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="text-lg font-bold text-navy mt-1 mb-2">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed max-w-xs mx-auto">{description}</p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
