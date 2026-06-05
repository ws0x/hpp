import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { UseCasesSection, type UseCase } from '@/components/sections/UseCasesSection'
import { CtaBanner } from '@/components/sections/CtaBanner'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Use Cases',
  description:
    'Common growth, leadership, and organization challenges H++ helps scaling businesses solve — and the outcomes we deliver.',
}

export default async function UseCasesPage() {
  let useCases: UseCase[] = []
  let bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || '/contact'

  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    if (settings?.bookingUrl) bookingUrl = settings.bookingUrl as string

    try {
      const data = await payload.find({
        collection: 'use-cases', where: { isActive: { equals: true } }, sort: 'order', limit: 50,
      })
      if (data.docs.length) {
        useCases = data.docs.map((u) => ({
          id: u.id as string,
          title: u.title as string,
          industry: u.industry as string | undefined,
          challenge: u.challenge as string,
          result: u.result as string,
          icon: u.icon as string | undefined,
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
            <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-3">Use Cases</p>
            <h1 className="text-navy mb-4">Problems We Solve</h1>
            <p className="text-lg text-text-muted max-w-xl">
              Most people-related issues are really growth, leadership, or organization challenges in
              disguise. Here are the situations where H++ makes the biggest difference.
            </p>
          </div>
        </Container>
      </section>

      <UseCasesSection useCases={useCases} showCta={false} />

      <CtaBanner bookingUrl={bookingUrl} />
    </>
  )
}
