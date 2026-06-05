import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { LinkedInIcon } from '@/components/ui/LinkedInIcon'

type FooterProps = {
  email?: string
  location?: string
  linkedin?: string
  phone?: string
}

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Methodology', href: '/methodology' },
  { label: 'Use Cases', href: '/use-cases' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'Recommendations', href: '/recommendations' },
  { label: 'Clients', href: '/clients' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact Us', href: '/contact' },
]

const solutionLinks = [
  { label: 'Growth Readiness Diagnostic™', href: '/services#growth-readiness' },
  { label: 'Fractional CHRO™',             href: '/services#fractional-chro' },
  { label: 'Organizational Design',        href: '/services#org-design' },
  { label: 'Leadership Advisory',          href: '/services#leadership-advisory' },
  { label: 'Executive Search',             href: '/services#executive-search' },
]

export function Footer({ email, location, linkedin, phone }: FooterProps) {
  const year = new Date().getFullYear()
  const mail = email || 'business@hplusplus.com'

  return (
    <footer className="bg-navy text-white">
      <Container>
        <div className="py-12 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-2xl font-extrabold tracking-tight mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="text-white">H</span>
              <span className="text-teal">++</span>
            </p>
            <p className="text-sm text-white/60 max-w-xs leading-relaxed">
              H++ is a strategic people consulting firm helping organizations build leadership,
              strengthen teams, and create sustainable growth.
            </p>
            {linkedin && (
              <div className="mt-5 flex items-center gap-3">
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="H++ on LinkedIn"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 text-white/80 hover:bg-teal hover:text-navy transition-colors"
                >
                  <LinkedInIcon size={16} />
                </a>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-teal mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-white/70 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-teal mb-4">Solutions</h3>
            <ul className="space-y-2.5 text-sm">
              {solutionLinks.map(({ label, href }) => (
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
            <h3 className="text-sm font-semibold uppercase tracking-widest text-teal mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-white/70">
                <MapPin size={15} className="mt-0.5 flex-shrink-0" />
                <span>{location || 'Cairo, Egypt · Dubai, UAE'}</span>
              </li>
              <li>
                <a
                  href={`mailto:${mail}`}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <Mail size={15} className="flex-shrink-0" />
                  {mail}
                </a>
              </li>
              {phone && (
                <li>
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <Phone size={15} className="flex-shrink-0" />
                    {phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-white/10 text-center text-xs text-white/40">
          <p>© {year} H++. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  )
}
