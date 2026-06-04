import Image from 'next/image'
import { ArrowRight, CheckCircle2, Briefcase, Users, Globe2, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { LinkedInIcon } from '@/components/ui/LinkedInIcon'

const LINKEDIN_URL = 'https://www.linkedin.com/in/wessam-abd-el-majeed/'

const valueBullets = [
  '10+ years driving strategic HR transformation',
  'Trusted by 50+ organisations across the MENA region',
  'End-to-end expertise: strategy, hiring & culture',
]

// Left-column trust stats — 4 cards, desktop-only
const trustStats = [
  { icon: Briefcase,  value: '10+',  label: 'Years of HR Leadership' },
  { icon: Users,      value: '50+',  label: 'Organisations Served' },
  { icon: UserCheck,  value: '200+', label: 'Candidates Placed' },
  { icon: Globe2,     value: 'MENA', label: 'Region Coverage' },
]

const industries = [
  'Banking & Finance', 'Technology', 'Healthcare',
  'Retail & FMCG', 'Manufacturing', 'Professional Services',
]

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
    <section className="relative overflow-hidden bg-surface pt-6 pb-10 sm:pt-12 sm:pb-20 lg:pt-20 lg:pb-28">
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
          - Mobile  (flex-col):       headline/subtext → portrait → identity → CTAs
          - Desktop (2-col grid):     left = headline + SEO copy + stats + sectors
                                      right = portrait + identity + CTAs
          Both columns are desktop-calibrated to be height-equivalent.
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-5 sm:gap-8 lg:items-start">

          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <div className="animate-fade-up lg:pt-4">

            {/* Eyebrow */}
            <p className="text-sm font-semibold uppercase tracking-widest text-orange mb-3 sm:mb-4">
              HR Business Partner &amp; Talent Strategist
            </p>

            {/* H1 */}
            <h1
              className="text-navy leading-tight mb-3 sm:mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {headline}
            </h1>

            {/* Subtext */}
            {subtext && (
              <p className="text-sm sm:text-base lg:text-lg text-text-muted max-w-xl leading-relaxed">
                {subtext}
              </p>
            )}

            {/* ── SEO paragraph — desktop only, bridges subtext → proof points ── */}
            <div className="hidden lg:block mt-5">
              <p
                className="text-base font-bold text-navy mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                A People-First Approach to Organisational Excellence
              </p>
              <p className="text-sm text-text-muted leading-relaxed max-w-lg">
                Wessam partners with leadership teams across the Middle East and North Africa to
                transform HR into a strategic growth engine — building talent pipelines, redesigning
                organisational structures, and coaching leaders through high-stakes people decisions
                that deliver measurable business outcomes.
              </p>
            </div>

            {/* ── 4 Trust stat cards — desktop only ────────────────────────── */}
            <div className="hidden lg:grid grid-cols-4 gap-3 mt-6">
              {trustStats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="bg-white rounded-xl border border-border p-3.5 text-center shadow-sm"
                >
                  <Icon size={18} className="text-orange mx-auto mb-1.5" aria-hidden />
                  <p
                    className="text-xl font-extrabold text-navy leading-none"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {value}
                  </p>
                  <p className="text-xs text-text-muted mt-1 leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* ── Sectors served — desktop only ────────────────────────────── */}
            <div className="hidden lg:block mt-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-subtle mb-2.5">
                Sectors served
              </p>
              <div className="flex flex-wrap gap-2">
                {industries.map((ind) => (
                  <span
                    key={ind}
                    className="inline-block px-3 py-1 rounded-full bg-blue-light text-navy text-xs font-medium border border-blue-accent/20"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────────── */}
          <div className="flex flex-col items-center animate-fade-up delay-200">

            {/* Portrait */}
            <div
              className="relative w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-white"
              style={{ boxShadow: 'var(--shadow-card-hover)' }}
            >
              {portrait ? (
                <Image
                  src={portrait.url}
                  alt={portrait.alt || 'Wessam Abdelmajeed'}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 160px, (max-width: 1024px) 240px, 288px"
                />
              ) : (
                <Image
                  src="/images/wessam.png"
                  alt="Wessam Abdelmajeed — HR Business Partner & Talent Strategist"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 640px) 160px, (max-width: 1024px) 240px, 288px"
                />
              )}
            </div>

            {/* Identity + value proposition */}
            <div className="mt-3 sm:mt-5 text-center max-w-xs">

              {/* Name & title */}
              <p
                className="font-bold text-navy text-xl leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Wessam Abdelmajeed
              </p>
              {identityTitle && (
                <p className="text-sm font-semibold text-orange mt-1">{identityTitle}</p>
              )}

              {/* Credential bullets */}
              <ul className="mt-3 space-y-1.5 text-left" aria-label="Key credentials">
                {valueBullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm text-text-muted leading-snug">
                    <CheckCircle2 size={15} className="text-orange flex-shrink-0 mt-0.5" aria-hidden />
                    {bullet}
                  </li>
                ))}
              </ul>

              {/* LinkedIn + About links */}
              <div className="mt-3 flex items-center justify-center gap-4 flex-wrap">
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-accent hover:text-navy transition-colors"
                  aria-label="Connect with Wessam on LinkedIn"
                >
                  <LinkedInIcon size={14} />
                  LinkedIn
                </a>
                {aboutLinkLabel && (
                  <a
                    href="/about"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-accent hover:text-navy transition-colors"
                  >
                    {aboutLinkLabel.replace(/\s*[→»>]+\s*$/, '')}
                    <ArrowRight size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-3 mt-4 sm:mt-6">
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
