'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  CheckIcon,
  PlusIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  Trash2Icon,
  SearchIcon,
  AlertCircleIcon,
} from 'lucide-react'
import { CrmBrandMark } from '@/components/shell/crm-brand-mark'
import { formatINR } from '@/lib/mock/analytics'

export default function DesignSystemPage() {
  const [segmentedInk, setSegmentedInk] = useState('Month')
  const [segmentedSoft, setSegmentedSoft] = useState('Line')

  const colors = [
    { token: '--canvas', hex: '#EEF1EA', label: 'Canvas Page' },
    { token: '--surface', hex: '#FFFFFF', label: 'Surface Card' },
    { token: '--surface-2', hex: '#F7F8F4', label: 'Surface-2 Inputs' },
    { token: '--surface-3', hex: '#EFF1EA', label: 'Surface-3 Hover' },
    { token: '--line', hex: '#E4E7DF', label: 'Hairline Dividers' },
    { token: '--ink', hex: '#121410', label: 'Primary Ink Text' },
    { token: '--lime', hex: '#D5F65A', label: 'Lime Accent Primary' },
    { token: '--lime-strong', hex: '#B9E52F', label: 'Lime Strong Hover' },
    { token: '--lime-soft', hex: '#EEFAC4', label: 'Lime Soft Wash' },
    { token: '--olive', hex: '#8FA336', label: 'Comparison Olive' },
    { token: '--indigo-crm', hex: '#2E3B8F', label: 'Indigo Sparklines' },
    { token: '--pos', hex: '#1F8A3B', label: 'Positive Delta' },
    { token: '--neg', hex: '#C23B22', label: 'Negative / Cancelled' },
    { token: '--amber-crm', hex: '#D99A0B', label: 'Amber / Paper Bill' },
  ]

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-6 sm:p-12 text-[var(--ink)]">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-6">
          <div className="flex items-center gap-4">
            <CrmBrandMark />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Design System &amp; Tokens</h1>
              <p className="text-xs text-[var(--ink-3)]">
                Mittal Communication CRM visual language &amp; component state gallery
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-semibold hover:bg-[var(--surface-2)]"
          >
            <ArrowLeftIcon className="size-3.5" />
            <span>Return to CRM</span>
          </Link>
        </div>

        {/* 1. Color Palette Tokens */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-3)]">
            1. Color Token Hierarchy
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {colors.map((c) => (
              <div
                key={c.token}
                className="rounded-[18px] bg-white p-3 border border-[var(--line)] shadow-xs flex flex-col gap-2"
              >
                <div
                  className="h-12 w-full rounded-xl border border-[var(--line)]"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] font-bold">{c.token}</span>
                  <span className="font-mono text-[10px] text-[var(--ink-4)]">{c.hex}</span>
                  <span className="text-[11px] font-medium text-[var(--ink-2)] mt-0.5">{c.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Indian Currency & Numbering Spec */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-3)]">
            2. Typography &amp; Indian Rupee Formatting (Tabular Nums)
          </h2>
          <div className="rounded-[24px] bg-white p-6 border border-[var(--line)] shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="text-xs text-[var(--ink-3)]">Hero Amount (Large Rupee + Muted Paise):</span>
              <div className="text-4xl font-bold tabular-nums mt-1">
                ₹1,23,456<span className="hero-paise text-xl">.78</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-[var(--ink-3)]">Table Value Representation:</span>
              <div className="text-xl font-bold tabular-nums mt-1 text-[var(--ink-2)]">
                {formatINR(428900.5)}
              </div>
            </div>
            <div>
              <span className="text-xs text-[var(--ink-3)]">Compact Lakh / Crore Form:</span>
              <div className="text-xl font-bold tabular-nums mt-1 text-[var(--ink-2)]">
                ₹7.84L · ₹1.24Cr
              </div>
            </div>
          </div>
        </section>

        {/* 3. Button Variants */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-3)]">
            3. Interactive Button Controls
          </h2>
          <div className="rounded-[24px] bg-white p-6 border border-[var(--line)] shadow-xs flex flex-wrap gap-4 items-center">
            {/* Primary Lime */}
            <button
              type="button"
              className="h-11 rounded-full bg-[var(--lime)] px-6 text-xs font-bold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-all shadow-xs"
            >
              Primary Button (Lime Fill + Ink Text)
            </button>

            {/* Counter Confirm Button 56px */}
            <button
              type="button"
              className="h-14 rounded-full bg-[var(--lime)] px-8 text-sm font-bold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-all shadow-md"
            >
              Confirm Sale · ₹11,210
            </button>

            {/* Secondary White */}
            <button
              type="button"
              className="h-11 rounded-full border border-[var(--line)] bg-white px-5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors shadow-xs"
            >
              Secondary White Button
            </button>

            {/* Ink Button */}
            <button
              type="button"
              className="h-11 rounded-full bg-[var(--ink)] px-5 text-xs font-bold text-white hover:bg-black transition-colors"
            >
              Solid Ink Button
            </button>

            {/* Destructive */}
            <button
              type="button"
              className="h-11 rounded-full border border-[var(--neg)] bg-white px-5 text-xs font-semibold text-[var(--neg)] hover:bg-[var(--neg-bg)] transition-colors"
            >
              Destructive Outline
            </button>

            {/* Disabled */}
            <button
              type="button"
              disabled
              className="h-11 rounded-full bg-[var(--surface-3)] px-5 text-xs font-semibold text-[var(--ink-4)] cursor-not-allowed"
            >
              Disabled Control
            </button>
          </div>
        </section>

        {/* 4. Segmented Controls */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-3)]">
            4. Segmented Controls &amp; Status Chips
          </h2>
          <div className="rounded-[24px] bg-white p-6 border border-[var(--line)] shadow-xs flex flex-wrap gap-6 items-center">
            {/* Ink Segmented (Bond CRM Style) */}
            <div className="inline-flex rounded-full bg-[var(--surface-2)] p-1 border border-[var(--line)]">
              {['7D', 'Month', '6M', 'Year'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSegmentedInk(s)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    segmentedInk === s ? 'bg-[var(--ink)] text-white shadow-xs' : 'text-[var(--ink-3)]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Soft Segmented (Line / Bar) */}
            <div className="inline-flex rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-0.5">
              {['Line', 'Bar'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSegmentedSoft(m)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                    segmentedSoft === m ? 'bg-white text-[var(--ink)] shadow-xs' : 'text-[var(--ink-3)]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Delta Chips */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--pos-bg)] px-2.5 py-0.5 text-xs font-bold text-[var(--pos)]">
                <ArrowUpRightIcon className="size-3.5 stroke-[2.5]" />
                +18.6%
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--neg-bg)] px-2.5 py-0.5 text-xs font-bold text-[var(--neg)]">
                <ArrowDownRightIcon className="size-3.5 stroke-[2.5]" />
                -4.2%
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--amber-bg)] px-2.5 py-0.5 text-xs font-bold text-[var(--amber-crm)]">
                From Paper Bill
              </span>
            </div>
          </div>
        </section>

        {/* 5. Hatched Pattern Textures */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-3)]">
            5. Texture Patterns (Hatched Bars from ref-03)
          </h2>
          <div className="rounded-[24px] bg-white p-6 border border-[var(--line)] shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold">Lime Hatched (Top Metric)</span>
              <div className="h-10 w-full rounded-lg hatch-lime bg-[var(--lime-soft)] border border-[var(--line)]" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold">Amber Hatched (Cash)</span>
              <div className="h-10 w-full rounded-lg hatch-amber bg-[var(--amber-bg)] border border-[var(--line)]" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold">Orange Hatched (Card)</span>
              <div className="h-10 w-full rounded-lg hatch-orange bg-orange-50 border border-[var(--line)]" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold">Neutral Hatched (Other)</span>
              <div className="h-10 w-full rounded-lg hatch-grey bg-[var(--surface-3)] border border-[var(--line)]" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
