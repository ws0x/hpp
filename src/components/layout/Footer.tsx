import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { LinkedInIcon } from '@/components/ui/LinkedInIcon'

type FooterProps = {
  email?: string
  location?: string
  linkedin?: string
}

export function Footer({ email, location, linkedin }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy text-white">
      <Container>
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="text-2xl font-extrabold tracking-tight mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="text-white">H</span>
              <span className="text-orange">++</span>
            </p>
            <p className="text-sm text-white/60 max-w-xs leading-relaxed">
              Evolving Human Resources — strategic HR consulting, recruitment, and advisory for organisations that put people first.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-orange mb-4">Pages</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Insights', href: '/insights' },
                { label: 'Contact', href: '/contact' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-white/70 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-orange mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <Mail size={15} />
                    {email}
                  </a>
                </li>
              )}
              {location && (
                <li className="flex items-center gap-2 text-white/70">
                  <MapPin size={15} />
                  {location}
                </li>
              )}
              {linkedin && (
                <li>
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <LinkedInIcon size={15} />
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {year} H++ — Wessam Abdelmajeed. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
