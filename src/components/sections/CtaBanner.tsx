import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

type CtaBannerProps = {
  title?: string
  subtitle?: string
  primaryLabel?: string
  secondaryLabel?: string
  bookingUrl?: string
}

export function CtaBanner({
  title = 'Ready to transform your HR?',
  subtitle = "Let's talk. Whether you're growing a startup or scaling a team, I can help.",
  primaryLabel = 'Book a Call',
  secondaryLabel = 'Send a Message',
  bookingUrl,
}: CtaBannerProps) {
  return (
    <section className="py-14 sm:py-20 bg-navy relative overflow-hidden">
      {/* Background accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 90% 50%, rgba(249,115,22,0.12) 0%, transparent 65%)',
        }}
      />

      <Container className="relative text-center">
        <h2 className="text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h2>
        <p className="text-white/70 text-base sm:text-lg mb-7 sm:mb-10 mx-auto max-w-2xl">
          {subtitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href={bookingUrl || '/contact'} variant="primary" size="lg">
            {primaryLabel}
          </Button>
          <Button href="/contact" variant="outline-light" size="lg">
            {secondaryLabel}
          </Button>
        </div>
      </Container>
    </section>
  )
}
