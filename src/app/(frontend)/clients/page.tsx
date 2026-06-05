import type { Metadata } from 'next'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { CtaBanner } from '@/components/sections/CtaBanner'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Clients',
  description:
    'The growing businesses and organizations across the MENA region that trust H++ to build leadership, strengthen teams, and drive sustainable growth.',
}

type Logo = { id: string; name: string; website?: string; logo?: { url: string; alt?: string } | null }

const fallback: Logo[] = [
  { id: '1', name: 'Careem' }, { id: '2', name: 'B.TECH' }, { id: '3', name: 'MAGRABi' },
  { id: '4', name: 'NAQAA' }, { id: '5', name: 'maxAB' }, { id: '6', name: 'edVentures' },
]

export default async function ClientsPage() {
  let logos: Logo[] = fallback
  let bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || '/contact'

  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    if (settings?.bookingUrl) bookingUrl = settings.bookingUrl as string

    try {
      const data = await payload.find({
        collection: 'client-logos', where: { isActive: { equals: true } }, sort: 'order', limit: 100, depth: 1,
      })
      if (data.docs.length) {
        logos = data.docs.map((l) => ({
          id: l.id as string,
          name: l.name as string,
          website: l.website as string | undefined,
          logo: l.logo && typeof l.logo === 'object' && 'url' in l.logo
            ? { url: (l.logo as { url: string }).url, alt: (l.logo as { alt?: string }).alt }
            : null,
        }))
      }
    } catch { /* collection not migrated yet */ }
  } catch { /* CMS not connected */ }

  return (
    <>
      {/* Header */}
      <section className="py-16 bg-surface-alt border-b border-border">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-3">Clients</p>
            <h1 className="text-navy mb-4">Trusted by Growing Businesses</h1>
            <p className="text-lg text-text-muted max-w-xl">
              From fast-scaling startups to established regional groups, organizations across the MENA
              region partner with H++ to build people-powered growth.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {logos.map((l) => {
              const inner = l.logo?.url ? (
                <Image
                  src={l.logo.url}
                  alt={l.logo.alt || l.name}
                  width={160}
                  height={48}
                  className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-[filter]"
                />
              ) : (
                <span
                  className="text-xl font-extrabold tracking-tight text-navy/70"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {l.name}
                </span>
              )
              return (
                <div
                  key={l.id}
                  className="flex items-center justify-center h-28 rounded-xl border border-border bg-surface-alt hover:bg-white hover:shadow-card transition-all"
                >
                  {l.website ? (
                    <a href={l.website} target="_blank" rel="noopener noreferrer" aria-label={l.name}>
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      <CtaBanner bookingUrl={bookingUrl} />
    </>
  )
}
