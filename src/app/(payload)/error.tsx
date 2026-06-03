'use client'

export default function PayloadError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h2>Admin Error</h2>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      {error.digest && <p>Digest: {error.digest}</p>}
      <button onClick={reset}>Retry</button>
    </div>
  )
}
