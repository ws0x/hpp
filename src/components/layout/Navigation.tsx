'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

const solutions = [
  { label: 'Growth Readiness Diagnostic™', href: '/services#growth-readiness' },
  { label: 'Fractional CHRO™',             href: '/services#fractional-chro' },
  { label: 'Organizational Design',        href: '/services#org-design' },
  { label: 'Leadership Advisory',          href: '/services#leadership-advisory' },
  { label: 'Executive Search',             href: '/services#executive-search' },
]

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Methodology', href: '/methodology' },
  { label: 'Insights', href: '/insights' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'Contact', href: '/contact' },
]

export function Navigation({ bookingUrl }: { bookingUrl?: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setSolutionsOpen(false)
  }, [pathname])

  // Close the Solutions dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSolutionsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Only the home page has a dark hero behind the transparent nav; elsewhere the
  // page top is light, so light nav text would be unreadable. Scope it to home.
  const onDark = pathname === '/' && !scrolled
  const linkBase = onDark
    ? 'text-white/80 hover:text-white hover:bg-white/10'
    : 'text-text-muted hover:text-navy hover:bg-blue-light'
  const linkActive = onDark ? 'text-white bg-white/10' : 'text-navy bg-blue-light'

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

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
              <span className={onDark ? 'text-white' : 'text-navy'}>H</span>
              <span className="text-teal">++</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-0.5" role="list">
            {/* Home + About */}
            {navLinks.slice(0, 2).map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(href) ? linkActive : linkBase
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Solutions dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setSolutionsOpen((v) => !v)}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/services') ? linkActive : linkBase
                }`}
                aria-expanded={solutionsOpen}
                aria-haspopup="true"
              >
                Solutions
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${solutionsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`absolute left-0 top-full mt-2 w-72 rounded-xl bg-white shadow-card-hover border border-border p-2 transition-all duration-200 origin-top ${
                  solutionsOpen
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
                role="menu"
              >
                {solutions.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    role="menuitem"
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-navy hover:bg-blue-light transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
                <Link
                  href="/services"
                  role="menuitem"
                  className="block px-3 py-2.5 mt-1 rounded-lg text-sm font-semibold text-teal hover:bg-blue-light transition-colors border-t border-border-light"
                >
                  View all solutions →
                </Link>
              </div>
            </li>

            {/* Methodology, Insights, Success Stories, Contact */}
            {navLinks.slice(2).map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(href) ? linkActive : linkBase
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              href={bookingUrl || '/contact'}
              variant="primary"
              size="sm"
              aria-label="Book a discovery call"
            >
              Book a Discovery Call
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              onDark ? 'text-white hover:bg-white/10' : 'text-text-muted hover:text-navy hover:bg-blue-light'
            }`}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </Container>

      {/* Mobile menu — animated slide-down */}
      <div
        id="mobile-menu"
        className={`lg:hidden bg-white border-t border-border shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-[640px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <Container>
          <ul className="py-4 space-y-1" role="list">
            {navLinks.slice(0, 2).map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(href) ? 'text-navy bg-blue-light' : 'text-text-muted hover:text-navy hover:bg-blue-light'
                  }`}
                  tabIndex={open ? 0 : -1}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Solutions group */}
            <li className="pt-1">
              <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-widest text-text-subtle">
                Solutions
              </p>
              {solutions.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-navy hover:bg-blue-light transition-colors"
                  tabIndex={open ? 0 : -1}
                >
                  {s.label}
                </Link>
              ))}
            </li>

            {navLinks.slice(2).map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(href) ? 'text-navy bg-blue-light' : 'text-text-muted hover:text-navy hover:bg-blue-light'
                  }`}
                  tabIndex={open ? 0 : -1}
                >
                  {label}
                </Link>
              </li>
            ))}

            <li className="pt-2 pb-2">
              <Button href={bookingUrl || '/contact'} variant="primary" size="sm" className="w-full justify-center">
                Book a Discovery Call
              </Button>
            </li>
          </ul>
        </Container>
      </div>
    </header>
  )
}
