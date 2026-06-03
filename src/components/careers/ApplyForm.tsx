'use client'

import { useActionState, useRef } from 'react'
import { Loader2, CheckCircle, Paperclip } from 'lucide-react'
import { submitApplication, type ApplyState } from '@/app/actions/careers'

const initial: ApplyState = { success: false }

export function ApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [state, action, pending] = useActionState(submitApplication, initial)
  const fileRef = useRef<HTMLInputElement>(null)

  if (state.success) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="text-green-600" size={28} />
        </div>
        <div>
          <p className="font-bold text-navy text-lg">Application submitted!</p>
          <p className="text-text-muted text-sm mt-1">
            We'll review your profile and be in touch within 5–7 business days.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="jobTitle" value={jobTitle} />

      <div>
        <label htmlFor="applicantName" className="block text-sm font-semibold text-navy mb-1.5">
          Full Name <span className="text-orange">*</span>
        </label>
        <input
          id="applicantName"
          name="applicantName"
          type="text"
          required
          placeholder="Your full name"
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-navy mb-1.5">
          Email Address <span className="text-orange">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-navy mb-1.5">
          Phone Number <span className="text-text-subtle text-xs font-normal">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+971 50 000 0000"
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
        />
      </div>

      <div>
        <label htmlFor="linkedIn" className="block text-sm font-semibold text-navy mb-1.5">
          LinkedIn Profile <span className="text-text-subtle text-xs font-normal">(optional)</span>
        </label>
        <input
          id="linkedIn"
          name="linkedIn"
          type="url"
          placeholder="https://linkedin.com/in/yourname"
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
        />
      </div>

      <div>
        <label htmlFor="coverLetter" className="block text-sm font-semibold text-navy mb-1.5">
          Cover Letter <span className="text-text-subtle text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          rows={4}
          placeholder="Why are you a great fit for this role?"
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors resize-none"
        />
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
        className="w-full flex items-center justify-center gap-2 bg-navy text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-navy-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Submitting…
          </>
        ) : (
          'Submit Application'
        )}
      </button>

      <p className="text-xs text-text-subtle text-center">
        Your information is kept confidential and used only for recruitment purposes.
      </p>
    </form>
  )
}
