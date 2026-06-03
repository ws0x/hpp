import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import Link from 'next/link'

type BaseProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-light' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

type ButtonProps = ButtonAsButton | ButtonAsLink

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 no-underline'

const variants = {
  primary:
    'bg-orange !text-white hover:bg-orange-dark active:scale-[0.98] shadow-sm',
  secondary:
    'bg-navy !text-white hover:bg-navy-dark active:scale-[0.98] shadow-sm',
  outline:
    'border-2 border-navy !text-navy bg-transparent hover:bg-navy hover:!text-white active:scale-[0.98]',
  // Use on dark/navy backgrounds — text stays white regardless of bg
  'outline-light':
    'border-2 border-white/40 !text-white bg-transparent hover:bg-white/10 hover:!text-white active:scale-[0.98]',
  ghost:
    '!text-navy bg-transparent hover:bg-blue-light active:scale-[0.98]',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-7 py-3.5 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  href,
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
