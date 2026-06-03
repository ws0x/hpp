export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}) {
  const isCenter = align === 'center'
  return (
    <div className={`${isCenter ? 'text-center mx-auto' : ''} max-w-3xl ${className}`}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-orange mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-navy">{title}</h2>
      {description && (
        <p className={`mt-4 text-lg text-text-muted ${isCenter ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  )
}
