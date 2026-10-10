import { cn } from '@/lib/utils'

export function CrmBrandMark({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Monogram in black rounded square with lime accent shape */}
      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--ink)] overflow-hidden">
        {/* Lime accent shape — small lime corner highlight */}
        <div className="absolute bottom-0 right-0 size-4 bg-[var(--lime)] rounded-tl-[10px]" />
        <span className="relative z-10 text-sm font-bold tracking-tight text-white">
          MC
        </span>
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-[13px] font-semibold tracking-tight text-[var(--ink)] leading-tight">
          Mittal Communication
        </span>
        <span className="text-[11px] text-[var(--ink-3)] leading-tight">
          CRM workspace
        </span>
      </div>
    </div>
  )
}
