import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Briefcase, Clock, ArrowRight, Users } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TalentRegistrationForm } from '@/components/careers/TalentRegistrationForm'

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Explore open positions across the MENA region curated by H++. Apply directly or register to be discovered by top employers.',
}

const employmentTypeLabels: Record<string, string> = {
  'full-time': 'Full-Time',
  'part-time': 'Part-Time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
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
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior Level',
  executive: 'Executive',
}

const typeColors: Record<string, string> = {
  'full-time': 'bg-blue-light text-navy',
  'part-time': 'bg-orange/10 text-orange-dark',
  contract: 'bg-purple-50 text-purple-700',
  freelance: 'bg-teal-50 text-teal-700',
  internship: 'bg-green-50 text-green-700',
}

type Job = {
  id: string
  title: string
  slug: string
  company: string
  location?: string
  employmentType: string
  industry: string
  experienceLevel: string
  salaryRange?: string
  applicationDeadline?: string
}

export default async function CareersPage() {
  let jobs: Job[] = []

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'jobs',
      where: { isActive: { equals: true } },
      sort: 'order',
      limit: 50,
      depth: 0,
    })

    jobs = docs.map((j) => ({
      id: j.id as string,
      title: j.title as string,
      slug: j.slug as string,
      company: (j.company as string) || 'H++ Talent',
      location: j.location as string | undefined,
      employmentType: j.employmentType as string,
      industry: j.industry as string,
      experienceLevel: j.experienceLevel as string,
      salaryRange: j.salaryRange as string | undefined,
      applicationDeadline: j.applicationDeadline as string | undefined,
    }))
  } catch {
    // CMS not connected
  }

  const jobBoardJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'H++ Open Positions',
    description: 'Current job openings curated by H++ across the MENA region',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/careers`,
    numberOfItems: jobs.length,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobBoardJsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Header */}
      <section className="py-16 bg-surface-alt border-b border-border">
        <Container>
          <SectionHeader
            eyebrow="Careers"
            title="Find your next role"
            description="Curated opportunities across the MENA region — vetted by an HR professional who understands what good looks like."
          />
        </Container>
      </section>

      {/* Jobs section */}
      <section className="py-16 bg-white">
        <Container>
          {jobs.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-blue-light flex items-center justify-center mx-auto mb-6">
                <Briefcase size={32} className="text-navy/30" />
              </div>
              <h2 className="text-xl font-bold text-navy mb-2">No open positions right now</h2>
              <p className="text-text-muted mb-6 max-w-md mx-auto">
                New roles are added regularly. Register below to be the first to know when something matching your profile opens up.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job, i) => {
                const deadline = job.applicationDeadline
                  ? new Date(job.applicationDeadline)
                  : null
                const isExpiringSoon =
                  deadline &&
                  deadline.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 &&
                  deadline > new Date()

                return (
                  <article
                    key={job.id}
                    className="group bg-white rounded-xl border border-border hover:shadow-card-hover hover:border-navy/20 transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <Link
                      href={`/careers/${job.slug}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 focus-visible:outline-none"
                      aria-label={`${job.title} at ${job.company}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[job.employmentType] ?? 'bg-surface-alt text-text-muted'}`}
                          >
                            {employmentTypeLabels[job.employmentType] ?? job.employmentType}
                          </span>
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface-alt text-text-muted border border-border">
                            {industryLabels[job.industry] ?? job.industry}
                          </span>
                          <span className="text-xs text-text-subtle">
                            {experienceLevelLabels[job.experienceLevel] ?? job.experienceLevel}
                          </span>
                          {isExpiringSoon && (
                            <span className="text-xs font-semibold text-orange bg-orange/10 px-2.5 py-1 rounded-full">
                              Closing soon
                            </span>
                          )}
                        </div>

                        <h2 className="text-lg font-bold text-navy group-hover:text-blue-accent transition-colors truncate">
                          {job.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-muted">
                          <span className="flex items-center gap-1.5">
                            <Briefcase size={13} />
                            {job.company}
                          </span>
                          {job.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin size={13} />
                              {job.location}
                            </span>
                          )}
                          {job.salaryRange && (
                            <span className="flex items-center gap-1.5 text-green-700 font-medium">
                              {job.salaryRange}
                            </span>
                          )}
                          {deadline && (
                            <span className="flex items-center gap-1.5">
                              <Clock size={13} />
                              Apply by{' '}
                              {deadline.toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-semibold text-blue-accent group-hover:text-navy transition-colors shrink-0">
                        View & Apply
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          )}
        </Container>
      </section>

      {/* Be Found — Talent Registration */}
      <section className="py-20 bg-navy">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <Users size={13} />
                Talent Pool
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Ready to be found?
              </h2>
              <p className="text-white/70 max-w-xl mx-auto">
                Register your profile and let the right opportunities come to you. Wessam works directly with hiring companies across MENA and proactively places top talent — no job board scrolling required.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <TalentRegistrationForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
