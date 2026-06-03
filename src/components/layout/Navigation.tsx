'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Careers', href: '/careers' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
]

export function Navigation({ bookingUrl }: { bookingUrl?: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-card border-b border-border' : 'bg-transparent'
      }`}
    >
      <Container>
        <nav className="flex items-center justify-between h-16 lg:h-18" aria-label="Main navigation">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 focus-visible:outline-none">
            <span
              className="text-2xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="text-navy">H</span>
              <span className="text-orange">++</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map(({ label, href }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'text-navy bg-blue-light'
                        : 'text-text-muted hover:text-navy hover:bg-blue-light'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              href={bookingUrl || '/contact'}
              variant="primary"
              size="sm"
              aria-label="Book a consultation call"
            >
              Book a Call
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-text-muted hover:text-navy hover:bg-blue-light transition-colors"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="md:hidden bg-white border-t border-border shadow-lg">
          <Container>
            <ul className="py-4 space-y-1" role="list">
              {navLinks.map(({ label, href }) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        active ? 'text-navy bg-blue-light' : 'text-text-muted hover:text-navy hover:bg-blue-light'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
              <li className="pt-2">
                <Button href={bookingUrl || '/contact'} variant="primary" size="sm" className="w-full">
                  Book a Call
                </Button>
              </li>
            </ul>
          </Container>
        </div>
      )}
    </header>
  )
}
