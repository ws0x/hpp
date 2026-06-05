import { Container } from '@/components/ui/Container'

type Stat = { value: string; label: string }

const defaultStats: Stat[] = [
  { value: '10+',   label: 'Years of Experience' },
  { value: '50+',   label: 'Organizations Served' },
  { value: 'MENA',  label: 'Regional Coverage' },
  { value: '30K+',  label: 'Professional Network' },
]

export function StatsBar({ stats = defaultStats }: { stats?: Stat[] }) {
  return (
    <section className="bg-white border-b border-border" aria-label="Key statistics">
      <Container>
        <dl className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-border lg:divide-y-0 lg:divide-x">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center py-8 lg:py-10 px-4 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <dt
                className="text-3xl sm:text-4xl font-extrabold text-teal mb-1 leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {stat.value}
              </dt>
              <dd className="text-xs sm:text-sm font-medium text-text-muted uppercase tracking-wider">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
