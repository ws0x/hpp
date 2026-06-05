import { ArrowRight, TrendingUp, Users, Building2, Target } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

type HeroProps = {
  headline: string
  subtext?: string
  primaryCtaLabel: string
  secondaryCtaLabel: string
  bookingUrl: string
}

// Floating glass cards inside the branded visual — convey "people, leadership,
// organization, growth" without relying on stock photography.
const floatCards = [
  { icon: TrendingUp, label: 'Growth Readiness', value: 'Score 86' },
  { icon: Users,      label: 'Leadership Bench',  value: 'Strong' },
  { icon: Building2,  label: 'Org Design',        value: 'Scalable' },
  { icon: Target,     label: 'Talent Strategy',   value: 'Aligned' },
]

export function HeroSection({
  headline,
  subtext,
  primaryCtaLabel,
  secondaryCtaLabel,
  bookingUrl,
}: HeroProps) {
  return (
    <section className="relative -mt-16 overflow-hidden bg-navy text-white">
      {/* Ambient brand glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 75% 10%, rgba(0,194,168,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 10% 90%, rgba(123,97,255,0.16) 0%, transparent 60%)',
        }}
      />

      <Container className="relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center pt-28 pb-16 sm:pt-32 sm:pb-24">

          {/* ── LEFT — message ─────────────────────────────────────────── */}
          <div className="animate-fade-up">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-teal-light mb-5">
              People. Leadership. Organization. Growth.
            </p>

            <h1
              className="text-white leading-[1.08]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {headline.includes('Ready for Growth') ? (
                <>
                  Building Organizations <span className="text-gradient">Ready for Growth</span>
                </>
              ) : (
                headline
              )}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-white/70 max-w-xl leading-relaxed">
              {subtext}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={bookingUrl} variant="primary" size="lg">
                {primaryCtaLabel}
                <ArrowRight size={18} />
              </Button>
              <Button href="/services" variant="outline-light" size="lg">
                {secondaryCtaLabel}
              </Button>
            </div>

            <p className="mt-6 text-sm text-white/45">
              Trusted by 50+ scaling businesses across the MENA region.
            </p>
          </div>

          {/* ── RIGHT — branded abstract visual ────────────────────────── */}
          <div className="relative animate-fade-up delay-200 hidden md:block">
            <div className="relative aspect-[4/3] w-full max-w-lg mx-auto lg:ml-auto">
              {/* Gradient panel */}
              <div className="absolute inset-0 rounded-3xl bg-brand-gradient shadow-2xl" />
              <div
                aria-hidden
                className="absolute inset-0 rounded-3xl opacity-40 mix-blend-overlay"
                style={{
                  background:
                    'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35) 0%, transparent 45%)',
                }}
              />
              {/* Grid texture */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-3xl opacity-[0.12]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
                  backgroundSize: '34px 34px',
                }}
              />

              {/* Floating glass cards */}
              <div className="absolute inset-0 p-6 grid grid-cols-2 grid-rows-2 gap-4">
                {floatCards.map(({ icon: Icon, label, value }, i) => (
                  <div
                    key={label}
                    className="rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 p-4 flex flex-col justify-between animate-fade-up"
                    style={{ animationDelay: `${300 + i * 120}ms` }}
                  >
                    <Icon size={22} className="text-teal-light" aria-hidden />
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-white/60">{label}</p>
                      <p className="text-lg font-bold text-white leading-tight">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
