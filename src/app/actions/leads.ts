'use server'

import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { Resend } from 'resend'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  topic: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  source: z.string().optional(),
})

export type LeadFormState = {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function submitLead(
  _prevState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const raw = Object.fromEntries(formData)

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { name, email, company, topic, message, source } = parsed.data

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'leads',
      data: { name, email, company: company || '', topic: topic || 'general', message, source: source || '', status: 'new' },
    })

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const fromEmail = `${process.env.FROM_NAME || 'H++'} <${process.env.FROM_EMAIL || 'noreply@hplusplus.net'}>`
      const adminEmail = process.env.ADMIN_EMAIL || 'business@hplusplus.com'

      await Promise.all([
        resend.emails.send({
          from: fromEmail,
          to: [adminEmail],
          subject: `New enquiry from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            ${topic ? `<p><strong>Topic:</strong> ${topic}</p>` : ''}
            <p><strong>Message:</strong></p>
            <blockquote>${message.replace(/\n/g, '<br>')}</blockquote>
            <p><strong>Source:</strong> ${source || 'website'}</p>
          `,
        }),
        resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: "Thanks for reaching out, we'll be in touch soon",
          html: `
            <p>Hi ${name},</p>
            <p>Thank you for getting in touch with H++. We've received your message and will get back to you within 24–48 hours.</p>
            <p>In the meantime, feel free to connect with us on <a href="https://www.linkedin.com/in/wessam-abd-el-majeed/">LinkedIn</a>.</p>
            <br>
            <p>Best regards,</p>
            <p><strong>The H++ Team</strong><br>Strategic People Consulting<br>H++ | Building Organizations Ready for Growth</p>
          `,
        }),
      ])
    }

    return { success: true }
  } catch (err) {
    console.error('Lead submission error:', err)
    return { success: false, error: 'Something went wrong. Please try again or email us directly.' }
  }
}
