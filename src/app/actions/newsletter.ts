'use server'

import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { Resend } from 'resend'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional(),
  source: z.string().optional(),
})

export type NewsletterState = {
  success: boolean
  error?: string
}

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors.email?.[0] ?? 'Invalid email.' }
  }

  const { email, name, source } = parsed.data

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'subscribers',
      data: { email, name: name || '', status: 'active', source: source || 'website' },
    })

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const from = `${process.env.FROM_NAME || 'H++'} <${process.env.FROM_EMAIL || 'noreply@hplusplus.net'}>`
      await resend.emails.send({
        from,
        to: [email],
        subject: 'Welcome to H++ Insights',
        html: `
          <p>Hi${name ? ` ${name}` : ''},</p>
          <p>Welcome to the H++ Insights newsletter! You'll receive weekly HR strategy, MENA market trends, and practical advice straight from the field.</p>
          <p>If you ever want to chat about your HR challenges directly, you can <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact">reach out here</a>.</p>
          <br>
          <p>Best,<br><strong>Wessam Abdelmajeed</strong><br>H++ | Evolving Human Resources</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
          <p style="font-size:12px;color:#94a3b8;">You can unsubscribe at any time by replying "unsubscribe" to this email.</p>
        `,
      })
    }

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : ''
    if (message.includes('unique') || message.includes('duplicate') || message.includes('UNIQUE')) {
      return { success: false, error: 'This email is already subscribed.' }
    }
    console.error('Newsletter subscribe error:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
