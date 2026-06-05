import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { UseCasesSection, type UseCase } from '@/components/sections/UseCasesSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { CtaBanner } from '@/components/sections/CtaBanner'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Success Stories',
  description:
    'How H++ helps scaling businesses across the MENA region solve growth, leadership, and organization challenges — with measurable results.',
}

export default async function SuccessStoriesPage() {
  let useCases: UseCase[] = []
  let testimonials: Parameters<typeof TestimonialsSection>[0]['testimonials'] = []
  let bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || '/contact'

  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    if (settings?.bookingUrl) bookingUrl = settings.bookingUrl as string

    const testimonialsData = await payload.find({
      collection: 'testimonials', where: { isActive: { equals: true } }, sort: 'order', limit: 12, depth: 1,
    })
    if (testimonialsData.docs.length) {
      testimonials = testimonialsData.docs.map((t) => ({
        id: t.id as string,
        clientName: t.clientName as string,
        role: t.role as string | undefined,
        company: t.company as string | undefined,
        quote: t.quote as string,
        photo: t.photo && typeof t.photo === 'object' && 'url' in t.photo
          ? { url: (t.photo as { url: string }).url, alt: (t.photo as { alt?: string }).alt }
          : null,
      }))
    }

    try {
      const useCasesData = await payload.find({
        collection: 'use-cases', where: { isActive: { equals: true } }, sort: 'order', limit: 24,
      })
      if (useCasesData.docs.length) {
        useCases = useCasesData.docs.map((u) => ({
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
            <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-3">Success Stories</p>
            <h1 className="text-navy mb-4">Real Outcomes for Scaling Businesses</h1>
            <p className="text-lg text-text-muted max-w-xl">
              We measure success in business impact — stronger leadership, scalable structures, and
              growth that compounds. Here is a look at the kind of problems we solve.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <Link href="/recommendations" className="inline-flex items-center gap-1.5 font-semibold text-teal hover:gap-2.5 transition-all">
                Read recommendations <ArrowRight size={15} />
              </Link>
              <Link href="/clients" className="inline-flex items-center gap-1.5 font-semibold text-teal hover:gap-2.5 transition-all">
                See our clients <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <UseCasesSection useCases={useCases} showCta={false} />

      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}

      <CtaBanner bookingUrl={bookingUrl} />
    </>
  )
}
