'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Mail, CheckCircle2, Loader2 } from 'lucide-react'
import { subscribeNewsletter, type NewsletterState } from '@/app/actions/newsletter'
import { Container } from '@/components/ui/Container'

const initial: NewsletterState = { success: false }

function SubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange text-white font-semibold rounded-lg hover:bg-orange-dark transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 whitespace-nowrap"
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
      {pending ? 'Subscribing…' : 'Get HR Insights'}
    </button>
  )
}

export function NewsletterSection() {
  const [state, formAction] = useActionState(subscribeNewsletter, initial)

  return (
    <section className="py-16 bg-blue-light border-y border-border">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange/10 mb-4">
            <Mail size={22} className="text-orange" />
          </div>
          <h2 className="text-navy text-2xl font-bold mb-2">
            Get Weekly HR Insights
          </h2>
          <p className="text-text-muted text-base mb-6 mx-auto max-w-md">
            Strategic HR thinking, MENA market trends, and practical advice — delivered to your inbox every week. No spam, unsubscribe anytime.
          </p>

          {state.success ? (
            <div className="flex items-center justify-center gap-3 text-green-700 bg-green-50 border border-green-200 rounded-xl px-6 py-4">
              <CheckCircle2 size={22} className="flex-shrink-0" />
              <p className="font-medium">You&rsquo;re subscribed! Check your inbox for a welcome message.</p>
            </div>
          ) : (
            <form action={formAction} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="hidden" name="source" value="newsletter-section" />
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white text-text placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-blue-accent focus:border-transparent text-sm"
                  aria-describedby={state.error ? 'newsletter-error' : undefined}
                />
              </div>
              <SubmitBtn />
            </form>
          )}

          {state.error && (
            <p id="newsletter-error" role="alert" className="mt-3 text-sm text-red-600">
              {state.error}
            </p>
          )}

          <p className="mt-4 text-xs text-text-subtle">
            Join 500+ HR professionals across MENA. Unsubscribe anytime.
          </p>
        </div>
      </Container>
    </section>
  )
}
