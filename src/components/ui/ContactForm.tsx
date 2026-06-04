'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { submitLead, type LeadFormState } from '@/app/actions/leads'

const initialState: LeadFormState = { success: false }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-orange text-white font-semibold rounded-lg hover:bg-orange-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
    >
      {pending ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Sending…
        </>
      ) : (
        'Send Message'
      )}
    </button>
  )
}

const topics = [
  { value: 'hr-consulting', label: 'HR Consulting & Advisory' },
  { value: 'recruitment', label: 'Recruitment & Talent Acquisition' },
  { value: 'training', label: 'Training & Development' },
  { value: 'general', label: 'General Inquiry' },
]

const fieldClass =
  'w-full px-4 py-3 rounded-lg border border-border bg-white text-text placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-blue-accent focus:border-transparent transition-all text-sm'

const errorClass = 'text-red-600 text-xs mt-1'

export function ContactForm({ source = 'contact' }: { source?: string }) {
  const [state, formAction] = useActionState(submitLead, initialState)

  if (state.success) {
    return (
      <div className="flex flex-col items-center text-center py-10 gap-4">
        <CheckCircle2 size={48} className="text-green-500" />
        <h3 className="text-xl font-bold text-navy">Message sent!</h3>
        <p className="text-text-muted max-w-sm">
          Thank you for reaching out. Wessam will get back to you within 24–48 hours. Check your inbox for a confirmation.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="source" value={source} />

      {state.error && (
        <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text mb-1.5">
            Full Name <span className="text-orange" aria-hidden>*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            required
            className={fieldClass}
            aria-describedby={state.fieldErrors?.name ? 'name-error' : undefined}
          />
          {state.fieldErrors?.name && (
            <p id="name-error" className={errorClass} role="alert">{state.fieldErrors.name[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
            Email Address <span className="text-orange" aria-hidden>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            className={fieldClass}
            aria-describedby={state.fieldErrors?.email ? 'email-error' : undefined}
          />
          {state.fieldErrors?.email && (
            <p id="email-error" className={errorClass} role="alert">{state.fieldErrors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-text mb-1.5">
            Company <span className="text-text-subtle font-normal">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="Your company name"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-text mb-1.5">
            Topic
          </label>
          <select id="topic" name="topic" className={fieldClass}>
            <option value="">Select a topic…</option>
            {topics.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text mb-1.5">
          Message <span className="text-orange" aria-hidden>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell me about your situation and what you're looking to achieve…"
          required
          className={`${fieldClass} resize-none`}
          aria-describedby={state.fieldErrors?.message ? 'message-error' : undefined}
        />
        {state.fieldErrors?.message && (
          <p id="message-error" className={errorClass} role="alert">{state.fieldErrors.message[0]}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  )
}
