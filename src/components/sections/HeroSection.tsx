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
    <section className="relative overflow-hidden bg-surface pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-20 lg:pb-28">
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
        {/*
          Layout:
          - Mobile (flex-col): headline/subtext → portrait → CTAs
          - Desktop (2-col grid): left = headline/subtext, right = portrait + CTAs below
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-8 lg:items-start">

          {/* ── Left — headline + subtext only ─────────────────────────── */}
          <div className="animate-fade-up lg:pt-4">
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
              <p className="text-base sm:text-lg text-text-muted max-w-xl leading-relaxed">
                {subtext}
              </p>
            )}
          </div>

          {/* ── Right — portrait → name/title → CTAs (mobile: below text, desktop: right col) ── */}
          <div className="flex flex-col items-center lg:items-center animate-fade-up delay-200">

            {/* Portrait */}
            <div
              className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-white"
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
                <Image
                  src="/images/wessam.png"
                  alt="Wessam Abdelmajeed — HR Business Partner & Talent Strategist"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 768px) 256px, 288px"
                />
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
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-accent hover:text-navy mt-2 transition-colors"
                >
                  {aboutLinkLabel.replace(/\s*[→»>]+\s*$/, '')}
                  <ArrowRight size={14} />
                </a>
              )}
            </div>

            {/* CTAs — always after the portrait on every screen size */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Button href={bookingUrl} variant="primary" size="lg">
                {primaryCtaLabel}
              </Button>
              <Button href="/services" variant="outline" size="lg">
                {secondaryCtaLabel}
              </Button>
            </div>

          </div>
        </div>
      </Container>
    </section>
  )
}
