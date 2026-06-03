'use client'

import { useActionState, useRef } from 'react'
import { Loader2, CheckCircle, Paperclip } from 'lucide-react'
import { registerTalentProfile, type TalentState } from '@/app/actions/careers'

const initial: TalentState = { success: false }

const INDUSTRIES = [
  { label: 'Technology', value: 'technology' },
  { label: 'Finance & Banking', value: 'finance' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Real Estate', value: 'real-estate' },
  { label: 'Retail & E-Commerce', value: 'retail' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Education', value: 'education' },
  { label: 'Hospitality & Tourism', value: 'hospitality' },
  { label: 'HR & Consulting', value: 'hr-consulting' },
  { label: 'Other', value: 'other' },
]

const EXPERIENCE_LEVELS = [
  { label: 'Entry Level (0–2 years)', value: 'entry' },
  { label: 'Mid Level (2–5 years)', value: 'mid' },
  { label: 'Senior Level (5–10 years)', value: 'senior' },
  { label: 'Executive (10+ years)', value: 'executive' },
]

const REGIONS = [
  { label: 'UAE', value: 'uae' },
  { label: 'Saudi Arabia', value: 'ksa' },
  { label: 'Egypt', value: 'egypt' },
  { label: 'Qatar', value: 'qatar' },
  { label: 'Kuwait', value: 'kuwait' },
  { label: 'Bahrain', value: 'bahrain' },
  { label: 'Jordan', value: 'jordan' },
  { label: 'Lebanon', value: 'lebanon' },
  { label: 'MENA (Any)', value: 'mena' },
  { label: 'Remote', value: 'remote' },
]

const selectClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors appearance-none'

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors'

export function TalentRegistrationForm() {
  const [state, action, pending] = useActionState(registerTalentProfile, initial)
  const fileRef = useRef<HTMLInputElement>(null)

  if (state.success) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="text-green-600" size={28} />
        </div>
        <div>
          <p className="font-bold text-navy text-lg">You're in the talent pool!</p>
          <p className="text-text-muted text-sm mt-1">
            We'll reach out when a role matching your background becomes available.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="talent-name" className="block text-sm font-semibold text-navy mb-1.5">
            Full Name <span className="text-orange">*</span>
          </label>
          <input
            id="talent-name"
            name="name"
            type="text"
            required
            placeholder="Your full name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="talent-email" className="block text-sm font-semibold text-navy mb-1.5">
            Email Address <span className="text-orange">*</span>
          </label>
          <input
            id="talent-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="talent-phone" className="block text-sm font-semibold text-navy mb-1.5">
            Phone <span className="text-text-subtle text-xs font-normal">(optional)</span>
          </label>
          <input
            id="talent-phone"
            name="phone"
            type="tel"
            placeholder="+971 50 000 0000"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="talent-linkedin" className="block text-sm font-semibold text-navy mb-1.5">
            LinkedIn <span className="text-text-subtle text-xs font-normal">(optional)</span>
          </label>
          <input
            id="talent-linkedin"
            name="linkedIn"
            type="url"
            placeholder="linkedin.com/in/yourname"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="talent-headline" className="block text-sm font-semibold text-navy mb-1.5">
          Professional Headline <span className="text-text-subtle text-xs font-normal">(optional)</span>
        </label>
        <input
          id="talent-headline"
          name="headline"
          type="text"
          placeholder="e.g. Senior HR Business Partner | 8 Years MENA Experience"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="talent-industry" className="block text-sm font-semibold text-navy mb-1.5">
            Industry
          </label>
          <select id="talent-industry" name="industry" className={selectClass}>
            <option value="">Select…</option>
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="talent-experience" className="block text-sm font-semibold text-navy mb-1.5">
            Experience Level
          </label>
          <select id="talent-experience" name="experienceLevel" className={selectClass}>
            <option value="">Select…</option>
            {EXPERIENCE_LEVELS.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="talent-region" className="block text-sm font-semibold text-navy mb-1.5">
            Preferred Region
          </label>
          <select id="talent-region" name="region" className={selectClass}>
            <option value="">Select…</option>
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-navy mb-1.5">
          CV / Resume <span className="text-text-subtle text-xs font-normal">(optional, PDF/DOC)</span>
        </label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-dashed border-border bg-surface-alt text-text-muted text-sm hover:border-navy hover:text-navy transition-colors"
        >
          <Paperclip size={15} />
          <span>Attach CV</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          name="cv"
          accept=".pdf,.doc,.docx"
          className="sr-only"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 bg-orange text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-orange-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Registering…
          </>
        ) : (
          'Join the Talent Pool'
        )}
      </button>

      <p className="text-xs text-text-subtle text-center">
        Your profile is kept private and shared with potential employers only with your consent.
      </p>
    </form>
  )
}
