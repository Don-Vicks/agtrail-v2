import { Link } from 'react-router'
import { ShieldCheck } from 'lucide-react'
import { cn } from '~/lib/utils'

type KycActionButtonProps = {
  href: string
  compact?: boolean
  className?: string
}

export function KycActionButton({
  href,
  compact = false,
  className,
}: KycActionButtonProps) {
  if (compact) {
    return (
      <Link
        to={href}
        className={cn(
          'mx-2 mt-2 flex min-h-10 items-center gap-2.5 rounded-md border border-brand/25 bg-brand/10 px-2.5 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
          className,
        )}
      >
        <ShieldCheck className='size-4 shrink-0' />
        <span className='truncate'>Start KYC Verification</span>
      </Link>
    )
  }

  return (
    <Link
      to={href}
      className={cn(
        'inline-flex min-h-11 items-center gap-2 rounded-md border border-brand bg-white px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
        className,
      )}
    >
      <ShieldCheck className='size-4' />
      Start KYC Verification
    </Link>
  )
}
