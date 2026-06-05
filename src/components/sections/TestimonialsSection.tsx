import Image from 'next/image'
import { Quote } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

type Testimonial = {
  id: string
  clientName: string
  role?: string
  company?: string
  quote: string
  photo?: { url: string; alt?: string } | null
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null

  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionHeader
          eyebrow="Client Stories"
          title="What Clients Say"
          align="center"
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <blockquote
              key={t.id}
              className="bg-surface-alt rounded-xl p-7 border border-border relative animate-fade-up flex flex-col"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Quote
                size={28}
                className="text-teal mb-4 flex-shrink-0"
                aria-hidden
              />
              <p className="text-text-muted leading-relaxed text-sm flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="flex items-center gap-3">
                {t.photo ? (
                  <Image
                    src={t.photo.url}
                    alt={t.photo.alt || t.clientName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover ring-2 ring-white"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-light flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-navy">
                      {t.clientName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-navy">{t.clientName}</p>
                  {(t.role || t.company) && (
                    <p className="text-xs text-text-subtle">
                      {[t.role, t.company].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  )
}
