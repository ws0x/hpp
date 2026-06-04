import type { Metadata } from 'next'
import { Mail, MapPin, CalendarCheck } from 'lucide-react'
import { LinkedInIcon } from '@/components/ui/LinkedInIcon'
import { getPayloadClient } from '@/lib/payload'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ContactForm } from '@/components/ui/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Wessam Abdelmajeed — book a free consultation call or send a message about HR consulting, recruitment, or advisory services.',
}

export default async function ContactPage() {
  let email = 'business@hplusplus.com'
  let location = 'MENA Region'
  let linkedin: string | undefined
  let bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || '#'

  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    if (settings.email) email = settings.email as string
    if (settings.location) location = settings.location as string
    if (settings.linkedin) linkedin = settings.linkedin as string
    if (settings.bookingUrl) bookingUrl = settings.bookingUrl as string
  } catch {
    // CMS not connected
  }

  return (
    <>
      {/* Header */}
      <section className="py-16 bg-surface-alt border-b border-border">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange mb-3">Contact</p>
            <h1 className="text-navy mb-4">Let&rsquo;s Talk</h1>
            <p className="text-lg text-text-muted max-w-xl">
              Whether you&rsquo;re ready to start or just exploring, I&rsquo;d love to hear from you.
              Choose the option that works best for you.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left — contact info + booking */}
            <aside className="lg:col-span-2 space-y-8">
              {/* Book a call */}
              <div className="bg-navy rounded-2xl p-8 text-white">
                <CalendarCheck size={32} className="text-orange mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Book a Free Call</h2>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  30-minute discovery call to discuss your needs and how H++ can help. No obligation.
                </p>
                <Button
                  href={bookingUrl}
                  variant="primary"
                  size="md"
                  className="w-full"
                  target={bookingUrl.startsWith('http') ? '_blank' : undefined}
                  rel={bookingUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  Choose a Time
                </Button>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-orange">Contact Details</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href={`mailto:${email}`} className="flex items-center gap-3 text-text-muted hover:text-navy transition-colors group">
                      <span className="w-9 h-9 rounded-lg bg-blue-light flex items-center justify-center flex-shrink-0 group-hover:bg-navy transition-colors">
                        <Mail size={15} className="text-blue-accent group-hover:text-white transition-colors" />
                      </span>
                      {email}
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-text-muted">
                    <span className="w-9 h-9 rounded-lg bg-blue-light flex items-center justify-center flex-shrink-0">
                      <MapPin size={15} className="text-blue-accent" />
                    </span>
                    {location}
                  </li>
                  {linkedin && (
                    <li>
                      <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-text-muted hover:text-navy transition-colors group"
                      >
                        <span className="w-9 h-9 rounded-lg bg-blue-light flex items-center justify-center flex-shrink-0 group-hover:bg-navy transition-colors">
                          <LinkedInIcon size={15} className="text-blue-accent group-hover:text-white transition-colors" />
                        </span>
                        Connect on LinkedIn
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              {/* Response time */}
              <div className="rounded-xl border border-border p-5 bg-surface-alt">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange mb-1">Response Time</p>
                <p className="text-sm text-text-muted">All enquiries are answered within <strong className="text-text">24–48 hours</strong>.</p>
              </div>
            </aside>

            {/* Right — form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-border p-8 shadow-card">
                <h2 className="text-xl font-bold text-navy mb-1">Send a Message</h2>
                <p className="text-sm text-text-muted mb-8">Fill in the form and I&rsquo;ll get back to you promptly.</p>
                <ContactForm source="contact-page" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
