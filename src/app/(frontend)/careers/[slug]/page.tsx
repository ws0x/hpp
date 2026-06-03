import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Briefcase, Clock, ChevronLeft, DollarSign, BarChart2 } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { Container } from '@/components/ui/Container'
import { ApplyForm } from '@/components/careers/ApplyForm'

type Props = { params: Promise<{ slug: string }> }

const employmentTypeLabels: Record<string, string> = {
  'full-time': 'Full-Time',
  'part-time': 'Part-Time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
}

// Map Payload employmentType values → schema.org employmentType
const employmentTypeSchema: Record<string, string> = {
  'full-time': 'FULL_TIME',
  'part-time': 'PART_TIME',
  contract: 'CONTRACTOR',
  freelance: 'OTHER',
  internship: 'INTERN',
}

const industryLabels: Record<string, string> = {
  technology: 'Technology',
  finance: 'Finance & Banking',
  healthcare: 'Healthcare',
  'real-estate': 'Real Estate',
  retail: 'Retail & E-Commerce',
  manufacturing: 'Manufacturing',
  education: 'Education',
  hospitality: 'Hospitality & Tourism',
  'hr-consulting': 'HR & Consulting',
  other: 'Other',
}

const experienceLevelLabels: Record<string, string> = {
  entry: 'Entry Level (0–2 years)',
  mid: 'Mid Level (2–5 years)',
  senior: 'Senior Level (5–10 years)',
  executive: 'Executive (10+ years)',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'jobs',
      where: { slug: { equals: slug }, isActive: { equals: true } },
      limit: 1,
      depth: 0,
    })
    const job = docs[0]
    if (!job) return { title: 'Job Not Found' }

    const title = (job.seo as { metaTitle?: string } | undefined)?.metaTitle || `${job.title as string} at ${(job.company as string) || 'H++'}`
    const description =
      (job.seo as { metaDescription?: string } | undefined)?.metaDescription ||
      `${job.title as string} — ${employmentTypeLabels[job.employmentType as string] ?? ''} role in ${job.location as string ?? 'MENA'}. Apply through H++.`

    return { title, description }
  } catch {
    return { title: 'Careers' }
  }
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params

  let job: Record<string, unknown> | null = null
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'jobs',
      where: { slug: { equals: slug }, isActive: { equals: true } },
      limit: 1,
      depth: 0,
    })
    job = docs[0] as Record<string, unknown> | undefined ?? null
  } catch {
    // CMS not connected
  }

  if (!job) notFound()

  // Extract typed fields once — avoids 'unknown' errors in JSX
  const jobId = job.id as string
  const jobTitle = job.title as string
  const jobCompany = (job.company as string) || 'H++ Talent'
  const jobLocation = job.location as string | undefined
  const jobEmploymentType = job.employmentType as string
  const jobIndustry = job.industry as string
  const jobExperienceLevel = job.experienceLevel as string
  const jobSalaryRange = job.salaryRange as string | undefined
  const jobDescription = job.description
  const jobRequirements = job.requirements
  const jobBenefits = job.benefits

  const deadline = job.applicationDeadline
    ? new Date(job.applicationDeadline as string)
    : null

  const jobPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: jobTitle,
    description: `${jobTitle} at ${jobCompany}. ${jobLocation ? `Location: ${jobLocation}.` : ''} Apply via H++.`,
    hiringOrganization: {
      '@type': 'Organization',
      name: jobCompany,
      sameAs: process.env.NEXT_PUBLIC_SITE_URL,
    },
    jobLocation: jobLocation
      ? {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: jobLocation.split(',')[0]?.trim(),
            addressCountry: 'AE',
          },
        }
      : undefined,
    employmentType: employmentTypeSchema[jobEmploymentType] ?? 'OTHER',
    datePosted: new Date().toISOString().split('T')[0],
    validThrough: deadline ? deadline.toISOString().split('T')[0] : undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/careers/${slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-surface-alt">
        <Container>
          <div className="flex items-center gap-2 text-sm text-text-muted py-3">
            <Link href="/" className="hover:text-navy transition-colors">Home</Link>
            <span>/</span>
            <Link href="/careers" className="hover:text-navy transition-colors">Careers</Link>
            <span>/</span>
            <span className="text-navy font-medium truncate max-w-xs">{jobTitle}</span>
          </div>
        </Container>
      </div>

      <section className="py-12 bg-white">
        <Container>
          <Link
            href="/careers"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-navy transition-colors mb-8"
          >
            <ChevronLeft size={16} />
            Back to all jobs
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ── Left: Job details ── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs font-semibold bg-blue-light text-navy px-2.5 py-1 rounded-full">
                    {employmentTypeLabels[jobEmploymentType] ?? jobEmploymentType}
                  </span>
                  <span className="text-xs font-medium bg-surface-alt text-text-muted border border-border px-2.5 py-1 rounded-full">
                    {industryLabels[jobIndustry] ?? jobIndustry}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-navy mb-2">{jobTitle}</h1>

                <div className="flex flex-wrap items-center gap-5 text-sm text-text-muted mt-4">
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={15} />
                    {jobCompany}
                  </span>
                  {jobLocation && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={15} />
                      {jobLocation}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <BarChart2 size={15} />
                    {experienceLevelLabels[jobExperienceLevel] ?? jobExperienceLevel}
                  </span>
                  {jobSalaryRange && (
                    <span className="flex items-center gap-1.5 text-green-700 font-semibold">
                      <DollarSign size={15} />
                      {jobSalaryRange}
                    </span>
                  )}
                  {deadline && (
                    <span className="flex items-center gap-1.5">
                      <Clock size={15} />
                      Apply by{' '}
                      {deadline.toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Description — Payload richText returns an object; render placeholder until richtext renderer is wired up */}
              {!!jobDescription && (
                <div>
                  <h2 className="text-xl font-bold text-navy mb-4">About the Role</h2>
                  <div className="rich-text text-text-muted leading-relaxed">
                    <p className="text-text-subtle italic">Full role description available — add a rich text renderer to display formatted content.</p>
                  </div>
                </div>
              )}

              {!!jobRequirements && (
                <div>
                  <h2 className="text-xl font-bold text-navy mb-4">Requirements</h2>
                  <div className="rich-text text-text-muted leading-relaxed">
                    <p className="text-text-subtle italic">Requirements available — add a rich text renderer to display formatted content.</p>
                  </div>
                </div>
              )}

              {!!jobBenefits && (
                <div>
                  <h2 className="text-xl font-bold text-navy mb-4">Benefits</h2>
                  <div className="rich-text text-text-muted leading-relaxed">
                    <p className="text-text-subtle italic">Benefits available — add a rich text renderer to display formatted content.</p>
                  </div>
                </div>
              )}

              {/* About H++ */}
              <div className="bg-blue-light rounded-xl p-6 border border-blue-light">
                <h3 className="font-bold text-navy mb-2">About H++</h3>
                <p className="text-sm text-text-muted">
                  H++ is the practice of Wessam Abdelmajeed, an HR Business Partner & Talent Strategist with 10+ years placing talent across MENA. Every position listed here is personally vetted — no job-board noise.
                </p>
              </div>
            </div>

            {/* ── Right: Apply form (sticky on desktop) ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl border border-border shadow-card p-6">
                <h2 className="text-lg font-bold text-navy mb-1">Apply for this role</h2>
                <p className="text-sm text-text-muted mb-6">
                  Fill in your details and we'll be in touch if you're a strong match.
                </p>
                <ApplyForm jobId={jobId} jobTitle={jobTitle} />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
