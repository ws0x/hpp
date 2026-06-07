'use server'

import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { Resend } from 'resend'

// ─── Apply to a Job ────────────────────────────────────────────────────────

const applySchema = z.object({
  jobId: z.string().min(1),
  jobTitle: z.string().min(1),
  applicantName: z.string().min(2, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().optional(),
  linkedIn: z.string().optional(),
  coverLetter: z.string().optional(),
})

export type ApplyState = {
  success: boolean
  error?: string
}

export async function submitApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const raw = {
    jobId: formData.get('jobId'),
    jobTitle: formData.get('jobTitle'),
    applicantName: formData.get('applicantName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    linkedIn: formData.get('linkedIn'),
    coverLetter: formData.get('coverLetter'),
  }

  const parsed = applySchema.safeParse(raw)
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
    return { success: false, error: first ?? 'Please fill in all required fields.' }
  }

  const { jobId, jobTitle, applicantName, email, phone, linkedIn, coverLetter } = parsed.data

  try {
    const payload = await getPayloadClient()

    // Upload CV if provided
    let cvId: string | undefined
    const cvFile = formData.get('cv') as File | null
    if (cvFile && cvFile.size > 0) {
      try {
        const buffer = Buffer.from(await cvFile.arrayBuffer())
        const media = await payload.create({
          collection: 'media',
          data: { alt: `CV – ${applicantName}` },
          file: {
            data: buffer,
            mimetype: cvFile.type || 'application/pdf',
            name: cvFile.name,
            size: cvFile.size,
          },
          overrideAccess: true,
        })
        cvId = media.id as string
      } catch {
        // CV upload failed — proceed without it
      }
    }

    await payload.create({
      collection: 'job-applications',
      data: {
        job: jobId,
        applicantName,
        email,
        phone: phone || '',
        linkedIn: linkedIn || '',
        coverLetter: coverLetter || '',
        cv: cvId,
        status: 'new',
        appliedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const from = `${process.env.FROM_NAME || 'H++'} <${process.env.FROM_EMAIL || 'noreply@hplusplus.net'}>`
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@hplusplus.net'
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hplusplus.net'

      await Promise.allSettled([
        // Confirmation to applicant
        resend.emails.send({
          from,
          to: [email],
          subject: `Application received — ${jobTitle}`,
          html: `
            <p>Hi ${applicantName},</p>
            <p>Thank you for applying for <strong>${jobTitle}</strong> through H++. We've received your application and will review it carefully.</p>
            <p>If your profile is a strong match, a member of our team will be in touch within 5 - 7 business days.</p>
            <br>
            <p>In the meantime, feel free to explore more opportunities at <a href="${siteUrl}/careers">${siteUrl}/careers</a>.</p>
            <br>
            <p>Best regards,<br><strong>Wessam Abdelmajeed</strong><br>H++ | Evolving Human Resources</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
            <p style="font-size:12px;color:#94a3b8;">This is an automated confirmation. Please do not reply to this email.</p>
          `,
        }),
        // Notification to admin
        resend.emails.send({
          from,
          to: [adminEmail],
          subject: `New application: ${applicantName} → ${jobTitle}`,
          html: `
            <h2>New Job Application</h2>
            <table style="border-collapse:collapse;width:100%;max-width:480px">
              <tr><td style="padding:6px 12px;background:#f8fafc;font-weight:600">Position</td><td style="padding:6px 12px">${jobTitle}</td></tr>
              <tr><td style="padding:6px 12px;background:#f8fafc;font-weight:600">Applicant</td><td style="padding:6px 12px">${applicantName}</td></tr>
              <tr><td style="padding:6px 12px;background:#f8fafc;font-weight:600">Email</td><td style="padding:6px 12px"><a href="mailto:${email}">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:6px 12px;background:#f8fafc;font-weight:600">Phone</td><td style="padding:6px 12px">${phone}</td></tr>` : ''}
              ${linkedIn ? `<tr><td style="padding:6px 12px;background:#f8fafc;font-weight:600">LinkedIn</td><td style="padding:6px 12px"><a href="${linkedIn}">${linkedIn}</a></td></tr>` : ''}
            </table>
            ${coverLetter ? `<h3>Cover Letter</h3><p>${coverLetter.replace(/\n/g, '<br>')}</p>` : ''}
            <p><a href="${siteUrl}/admin/collections/job-applications" style="background:#1B2B6B;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px">View in Admin</a></p>
          `,
        }),
      ])
    }

    return { success: true }
  } catch (err) {
    console.error('Application submit error:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

// ─── Register as Talent ────────────────────────────────────────────────────

const talentSchema = z.object({
  name: z.string().min(2, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().optional(),
  headline: z.string().optional(),
  industry: z.string().optional(),
  experienceLevel: z.string().optional(),
  region: z.string().optional(),
  linkedIn: z.string().optional(),
})

export type TalentState = {
  success: boolean
  error?: string
}

export async function registerTalentProfile(
  _prev: TalentState,
  formData: FormData,
): Promise<TalentState> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    headline: formData.get('headline'),
    industry: formData.get('industry'),
    experienceLevel: formData.get('experienceLevel'),
    region: formData.get('region'),
    linkedIn: formData.get('linkedIn'),
  }

  const parsed = talentSchema.safeParse(raw)
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
    return { success: false, error: first ?? 'Please fill in all required fields.' }
  }

  const { name, email, phone, headline, industry, experienceLevel, region, linkedIn } = parsed.data

  try {
    const payload = await getPayloadClient()

    let cvId: string | undefined
    const cvFile = formData.get('cv') as File | null
    if (cvFile && cvFile.size > 0) {
      try {
        const buffer = Buffer.from(await cvFile.arrayBuffer())
        const media = await payload.create({
          collection: 'media',
          data: { alt: `CV – ${name}` },
          file: {
            data: buffer,
            mimetype: cvFile.type || 'application/pdf',
            name: cvFile.name,
            size: cvFile.size,
          },
          overrideAccess: true,
        })
        cvId = media.id as string
      } catch {
        // CV upload failed — proceed without it
      }
    }

    await payload.create({
      collection: 'talent-profiles',
      data: {
        name,
        email,
        phone: phone || '',
        headline: headline || '',
        industry: industry || undefined,
        experienceLevel: experienceLevel || undefined,
        region: region || undefined,
        linkedIn: linkedIn || '',
        cv: cvId,
        isVisible: true,
        submittedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const from = `${process.env.FROM_NAME || 'H++'} <${process.env.FROM_EMAIL || 'noreply@hplusplus.net'}>`
      await resend.emails.send({
        from,
        to: [email],
        subject: 'You\'re in the H++ talent pool',
        html: `
          <p>Hi ${name},</p>
          <p>Thanks for registering with H++! Your profile is now in our talent pool. When a role matching your background comes up, we'll reach out directly.</p>
          <p>No need to keep checking job boards, we'll come to you.</p>
          <br>
          <p>Best,<br><strong>Wessam Abdelmajeed</strong><br>H++ | Evolving Human Resources</p>
        `,
      })
    }

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : ''
    if (message.includes('unique') || message.includes('duplicate') || message.includes('UNIQUE')) {
      return { success: false, error: 'This email is already registered in our talent pool.' }
    }
    console.error('Talent register error:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
