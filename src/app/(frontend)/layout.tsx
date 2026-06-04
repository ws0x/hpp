import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
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

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hplusplus.vercel.app'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1B2B6B',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'H++ | Evolving Human Resources',
    template: '%s | H++',
  },
  description:
    'Wessam Abdelmajeed — HR Business Partner & Talent Strategist. Expert HR consulting, recruitment, and advisory solutions across the MENA region.',

  // ── Canonical / alternate ──────────────────────────────────────────────────
  alternates: {
    canonical: '/',
  },

  // ── Open Graph ─────────────────────────────────────────────────────────────
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'H++ — Evolving Human Resources',
    title: 'H++ | Evolving Human Resources',
    description:
      'Expert HR consulting, recruitment & advisory by Wessam Abdelmajeed across the MENA region.',
    images: [
      {
        url: '/images/wessam.png',
        width: 1200,
        height: 630,
        alt: 'Wessam Abdelmajeed — H++ Evolving Human Resources',
      },
    ],
  },

  // ── Twitter / X card ───────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'H++ | Evolving Human Resources',
    description: 'Expert HR consulting, recruitment & advisory by Wessam Abdelmajeed.',
    images: ['/images/wessam.png'],
  },

  // ── Icons ─────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },

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
  category: 'Human Resources',
  keywords: [
    'HR consulting', 'talent acquisition', 'HR business partner',
    'recruitment MENA', 'organisational development', 'Wessam Abdelmajeed',
    'HR advisory', 'HR strategy', 'employee experience',
  ],
}

// Global JSON-LD — Organisation + Person structured data on every page
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'H++',
      alternateName: 'H Plus Plus',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.ico`,
      },
      description: 'HR consulting, talent acquisition and advisory services across the MENA region.',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        url: `${siteUrl}/contact`,
      },
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Wessam Abdelmajeed',
      jobTitle: 'HR Business Partner & Talent Strategist',
      url: siteUrl,
      image: `${siteUrl}/images/wessam.png`,
      worksFor: { '@id': `${siteUrl}/#organization` },
      sameAs: ['https://linkedin.com/in/wessam-abd-el-majeed'],
    },
  ],
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  let bookingUrl: string | undefined
  let email: string | undefined
  let location: string | undefined
  let linkedin: string | undefined
  let whatsappNumber: string | undefined

  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    bookingUrl     = settings.bookingUrl as string | undefined
    email          = settings.email as string | undefined
    location       = settings.location as string | undefined
    linkedin       = settings.linkedin as string | undefined
    whatsappNumber = settings.whatsapp as string | undefined
  } catch {
    bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL
  }

  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
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
        <Footer email={email} location={location} linkedin={linkedin} />
        <WhatsAppWidget
          phoneNumber={whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
        />
      </body>
    </html>
  )
}
