import Image from 'next/image'
import { Container } from '@/components/ui/Container'

type Logo = { id?: string; name: string; logo?: { url: string; alt?: string } | null }

const fallbackLogos: Logo[] = [
  { name: 'Careem' }, { name: 'B.TECH' }, { name: 'MAGRABi' },
  { name: 'NAQAA' }, { name: 'maxAB' }, { name: 'edVentures' },
]

export function ClientLogosStrip({ logos }: { logos?: Logo[] }) {
  const items = logos?.length ? logos : fallbackLogos

  return (
    <section className="py-12 bg-surface-alt border-y border-border" aria-label="Trusted by">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-text-subtle mb-8">
          Trusted by growing businesses
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {items.map((l, i) => (
            <div key={l.id || l.name + i} className="opacity-70 hover:opacity-100 transition-opacity">
              {l.logo?.url ? (
                <Image
                  src={l.logo.url}
                  alt={l.logo.alt || l.name}
                  width={120}
                  height={36}
                  className="h-7 sm:h-8 w-auto object-contain grayscale hover:grayscale-0 transition-[filter]"
                />
              ) : (
                <span
                  className="text-lg sm:text-xl font-extrabold tracking-tight text-navy/70"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {l.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
