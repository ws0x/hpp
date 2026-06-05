import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import '../globals.css'

import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppWidget } from '@/components/ui/WhatsAppWidget'
import { getPayloadClient } from '@/lib/payload'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hplusplus.vercel.app'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B132B',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'H++ | Building Organizations Ready for Growth',
    template: '%s | H++',
  },
  description:
    'H++ is a strategic people consulting firm helping scaling businesses build scalable organizations, stronger leadership, and high-performing teams across the MENA region.',

  // ── Canonical / alternate ──────────────────────────────────────────────────
  alternates: {
    canonical: '/',
  },

  // ── Open Graph ─────────────────────────────────────────────────────────────
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'H++ — Strategic People Consulting',
    title: 'H++ | Building Organizations Ready for Growth',
    description:
      'Strategic people consulting — Growth Readiness Diagnostic™, Fractional CHRO™, organizational design, leadership advisory & executive search across the MENA region.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'H++ — Building Organizations Ready for Growth',
      },
    ],
  },

  // ── Twitter / X card ───────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'H++ | Building Organizations Ready for Growth',
    description: 'Strategic people consulting for scaling businesses across the MENA region.',
    images: ['/og.png'],
  },

  // ── Icons ─────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: '/favicon.ico',  sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/favicon.svg',  type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192',            type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512',            type: 'image/png' },
    ],
    shortcut:   '/favicon.ico',
    apple:      [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#00C2A8' },
    ],
  },
  manifest: '/site.webmanifest',

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  // ── App metadata ──────────────────────────────────────────────────────────
  applicationName: 'H++',
  category: 'Management Consulting',
  keywords: [
    'strategic people consulting', 'growth readiness diagnostic', 'fractional CHRO',
    'organizational design', 'leadership advisory', 'executive search MENA',
    'HR transformation', 'talent strategy', 'workforce planning', 'scaling organizations',
  ],
}

// Global JSON-LD — Organisation + Founder structured data on every page
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': `${siteUrl}/#organization`,
      name: 'H++',
      alternateName: 'H Plus Plus',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon-512.png`,
        width: 512,
        height: 512,
      },
      slogan: 'Building Organizations Ready for Growth',
      description:
        'H++ is a strategic people consulting firm helping scaling businesses build scalable organizations, stronger leadership teams, and high-performing workforces across the MENA region.',
      areaServed: 'MENA',
      knowsAbout: [
        'Growth Readiness Diagnostic',
        'Fractional CHRO',
        'Organizational Design',
        'Leadership Advisory',
        'Executive Search',
      ],
      founder: {
        '@type': 'Person',
        '@id': `${siteUrl}/#founder`,
        name: 'Wessam Abdelmajeed',
        jobTitle: 'Founder & Principal Consultant',
        sameAs: ['https://www.linkedin.com/in/wessam-abd-el-majeed/'],
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        url: `${siteUrl}/contact`,
      },
    },
  ],
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  let bookingUrl: string | undefined
  let email: string | undefined
  let location: string | undefined
  let linkedin: string | undefined
  let phone: string | undefined
  let whatsappNumber: string | undefined

  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    bookingUrl     = settings.bookingUrl as string | undefined
    email          = settings.email as string | undefined
    location       = settings.location as string | undefined
    linkedin       = settings.linkedin as string | undefined
    phone          = settings.phone as string | undefined
    whatsappNumber = settings.whatsapp as string | undefined
  } catch {
    bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL
  }

  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Navigation bookingUrl={bookingUrl} />
        <main className="flex-1 pt-16">{children}</main>
        <Footer email={email} location={location} linkedin={linkedin} phone={phone} />
        <WhatsAppWidget
          phoneNumber={whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
        />
      </body>
    </html>
  )
}
