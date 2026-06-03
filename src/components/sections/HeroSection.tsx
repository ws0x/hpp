import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

type HeroProps = {
  headline: string
  subtext?: string
  primaryCtaLabel: string
  secondaryCtaLabel: string
  bookingUrl: string
  portrait?: { url: string; alt?: string } | null
  identityTitle?: string
  aboutLinkLabel?: string
}

export function HeroSection({
  headline,
  subtext,
  primaryCtaLabel,
  secondaryCtaLabel,
  bookingUrl,
  portrait,
  identityTitle,
  aboutLinkLabel,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-surface pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Subtle background gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 60% -10%, rgba(37,99,235,0.06) 0%, transparent 70%)',
        }}
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left — copy */}
          <div className="animate-fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange mb-4">
              HR Business Partner &amp; Talent Strategist
            </p>
            <h1
              className="text-navy leading-tight mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {headline}
            </h1>
            {subtext && (
              <p className="text-lg text-text-muted mb-8 max-w-xl leading-relaxed">
                {subtext}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button href={bookingUrl} variant="primary" size="lg">
                {primaryCtaLabel}
              </Button>
              <Button href="/services" variant="outline" size="lg">
                {secondaryCtaLabel}
              </Button>
            </div>
          </div>

          {/* Right — portrait card */}
          <div className="flex justify-center lg:justify-end animate-fade-up delay-200">
            <div className="relative">
              {/* Portrait */}
              <div
                className="relative w-64 h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-white mx-auto"
                style={{ boxShadow: 'var(--shadow-card-hover)' }}
              >
                {portrait ? (
                  <Image
                    src={portrait.url}
                    alt={portrait.alt || 'Wessam Abdelmajeed'}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 256px, 288px"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-light flex items-center justify-center">
                    <span className="text-5xl font-bold text-navy" style={{ fontFamily: 'var(--font-display)' }}>
                      WA
                    </span>
                  </div>
                )}
              </div>

              {/* Identity card */}
              <div className="mt-4 text-center">
                <p
                  className="font-bold text-navy text-lg"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Wessam Abdelmajeed
                </p>
                {identityTitle && (
                  <p className="text-sm text-text-muted mt-0.5">{identityTitle}</p>
                )}
                {aboutLinkLabel && (
                  <a
                    href="/about"
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-accent hover:text-navy mt-2 transition-colors"
                  >
                    {aboutLinkLabel}
                    <ArrowRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
