import { Container } from '@/components/ui/Container'

type Stat = { value: string; label: string }

const defaultStats: Stat[] = [
  { value: '10+', label: 'Years Experience' },
  { value: '50+', label: 'Companies Served' },
  { value: '200+', label: 'Candidates Placed' },
  { value: 'MENA', label: 'Region Coverage' },
]

export function StatsBar({ stats = defaultStats }: { stats?: Stat[] }) {
  return (
    <section
      className="bg-navy py-10"
      aria-label="Key statistics"
    >
      <Container>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <dt
                className="text-3xl sm:text-4xl font-extrabold text-orange mb-1 leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {stat.value}
              </dt>
              <dd className="text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
