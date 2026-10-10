import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
      >
        MC
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold tracking-tight text-foreground">
          Mittal Communication
        </span>
        <span className="text-xs text-muted-foreground">CRM workspace</span>
      </span>
    </div>
  )
}

