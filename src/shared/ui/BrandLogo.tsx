interface BrandLogoProps {
  variant?: 'logo' | 'symbol' | 'wordmark'
  tone?: 'color' | 'white'
  size?: number
  className?: string
  decorative?: boolean
}

/** Approved concept 09. All surfaces use the same vector masters. */
export function BrandLogo({ variant = 'logo', tone = 'color', size = 48, className, decorative = false }: BrandLogoProps) {
  const ratio = variant === 'logo' ? 3 : variant === 'wordmark' ? 2061 / 656 : 1
  return (
    <img
      src={`/brand/${variant}${tone === 'white' ? '-white' : ''}.svg`}
      alt={decorative ? '' : 'رژیم من'}
      width={size * ratio}
      height={size}
      className={['diet-brand', className].filter(Boolean).join(' ')}
      style={{ display: 'block', width: `calc(var(--diet-brand-height, ${size}px) * ${ratio})`, height: `var(--diet-brand-height, ${size}px)`, maxWidth: '100%', objectFit: 'contain', flexShrink: 0 }}
      draggable={false}
    />
  )
}
