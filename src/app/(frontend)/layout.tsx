import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppWidget } from '@/components/ui/WhatsAppWidget'
import { getPayloadClient } from '@/lib/payload'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  let bookingUrl: string | undefined
  let email: string | undefined
  let location: string | undefined
  let linkedin: string | undefined
  let whatsappNumber: string | undefined

  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    bookingUrl    = settings.bookingUrl as string | undefined
    email         = settings.email as string | undefined
    location      = settings.location as string | undefined
    linkedin      = settings.linkedin as string | undefined
    whatsappNumber = settings.whatsapp as string | undefined
  } catch {
    bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL
  }

  return (
    <>
      <Navigation bookingUrl={bookingUrl} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer email={email} location={location} linkedin={linkedin} />
      <WhatsAppWidget
        phoneNumber={whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
      />
    </>
  )
}
