import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { MethodologySection } from '@/components/sections/MethodologySection'
import { CtaBanner } from '@/components/sections/CtaBanner'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Methodology',
  description:
    "H++'s consulting methodology: Diagnose → Design → Deploy → Drive Results. A clear, evidence-based path from insight to measurable business impact.",
}

const phases = [
  {
    step: '01',
    title: 'Diagnose',
    body: 'We start by understanding the real challenge not the symptom. Through structured data, leadership conversations, and organizational analysis, we surface the root causes behind your people and growth challenges.',
  },
  {
    step: '02',
    title: 'Design',
    body: 'We translate insight into a practical plan. Tailored strategies, structures, and interventions are designed around your business goals, growth stage, and culture, never off-the-shelf templates.',
  },
  {
    step: '03',
    title: 'Deploy',
    body: 'Strategy only matters when it ships. We work alongside your team to implement solutions, transfer capability, and embed new ways of working so change sticks after we leave.',
  },
  {
    step: '04',
    title: 'Drive Results',
    body: 'We measure what matters, refine the approach, and keep optimising, turning one-off projects into sustained, people-powered business performance.',
  },
]

export default async function MethodologyPage() {
  let bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || '/contact'
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    if (settings?.bookingUrl) bookingUrl = settings.bookingUrl as string
  } catch { /* CMS not connected */ }

  return (
    <>
      {/* Header */}
      <section className="py-16 bg-surface-alt border-b border-border">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-3">Our Methodology</p>
            <h1 className="text-navy mb-4">A Clear Path from Insight to Impact</h1>
            <p className="text-lg text-text-muted max-w-xl">
              Every engagement follows a disciplined, evidence-based process, so you always know what
              we are doing, why, and what business outcome it drives.
            </p>
          </div>
        </Container>
      </section>

      {/* Visual 4-step */}
      <MethodologySection />

      {/* Phase detail */}
      <section className="py-16 sm:py-20 bg-surface-alt">
        <Container>
          <div className="grid md:grid-cols-2 gap-6">
            {phases.map((p) => (
              <article key={p.step} className="bg-white rounded-xl border border-border p-7">
                <p className="text-sm font-bold text-teal tracking-widest mb-2">{p.step}</p>
                <h2 className="text-xl font-bold text-navy mb-3">{p.title}</h2>
                <p className="text-text-muted leading-relaxed">{p.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner bookingUrl={bookingUrl} />
    </>
  )
}
