'use client'

import { useState, useMemo } from 'react'
import {
  SearchIcon,
  PlusIcon,
  CheckIcon,
  XIcon,
  PackageIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  ArrowRightIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_PRODUCTS, type MockProduct } from '@/lib/mock/products'
import { formatINR } from '@/lib/mock/analytics'

export function ProductsPage() {
  const [products, setProducts] = useState<MockProduct[]>(MOCK_PRODUCTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Drawer form state
  const [newName, setNewName] = useState('')
  const [newBrand, setNewBrand] = useState('')
  const [newCategory, setNewCategory] = useState<MockProduct['category']>('Phones')
  const [newHsn, setNewHsn] = useState('85171200')
  const [newGstRate, setNewGstRate] = useState<12 | 18 | 28>(18)
  const [newRequiresImei, setNewRequiresImei] = useState(true)
  const [newPrice, setNewPrice] = useState<string>('')
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null)

  const categories = ['All', 'Phones', 'Chargers', 'Covers & Glass', 'Earphones', 'Cables']

  // Handle category prefill on drawer select
  const handleCategoryChange = (cat: MockProduct['category']) => {
    setNewCategory(cat)
    if (cat === 'Phones') {
      setNewHsn('85171200')
      setNewGstRate(18)
      setNewRequiresImei(true)
    } else if (cat === 'Chargers') {
      setNewHsn('85044030')
      setNewGstRate(18)
      setNewRequiresImei(false)
    } else if (cat === 'Covers & Glass') {
      setNewHsn('39269099')
      setNewGstRate(18)
      setNewRequiresImei(false)
    } else if (cat === 'Earphones') {
      setNewHsn('85183000')
      setNewGstRate(18)
      setNewRequiresImei(false)
    } else {
      setNewHsn('85444299')
      setNewGstRate(18)
      setNewRequiresImei(false)
    }
  }

  // Duplicate name check
  const handleNameChange = (val: string) => {
    setNewName(val)
    if (val.trim()) {
      const existing = products.find(
        (p) => p.name.toLowerCase() === val.trim().toLowerCase()
      )
      if (existing) {
        setDuplicateWarning(`A product named '${existing.name}' already exists in your catalog.`)
      } else {
        setDuplicateWarning(null)
      }
    } else {
      setDuplicateWarning(null)
    }
  }

  // Save new product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newBrand.trim()) return

    const product: MockProduct = {
      id: `p-${Date.now()}`,
      name: newName.trim(),
      brand: newBrand.trim(),
      category: newCategory,
      hsn: newHsn.trim(),
      gst_rate: newGstRate,
      requires_imei: newRequiresImei,
      default_price: newPrice ? parseFloat(newPrice) : null,
      active: true,
    }

    setProducts((prev) => [product, ...prev])
    setDrawerOpen(false)
    setNewName('')
    setNewBrand('')
    setNewPrice('')
  }

  // Toggle active status
  const toggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    )
  }

  // Filtering
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = p.name.toLowerCase().includes(q)
        const matchesBrand = p.brand.toLowerCase().includes(q)
        const matchesHsn = p.hsn.includes(q)
        if (!matchesName && !matchesBrand && !matchesHsn) return false
      }
      return true
    })
  }, [products, selectedCategory, searchQuery])

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
              Product Catalog
            </h1>
            <span className="rounded-full bg-[var(--surface-3)] px-2.5 py-0.5 text-xs font-bold text-[var(--ink)]">
              {products.length} Products
            </span>
          </div>
          <p className="text-xs text-[var(--ink-3)] mt-0.5">
            GST tax definitions, HSN codes, default pre-tax pricing &amp; IMEI serialization settings
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex h-10 items-center gap-2 rounded-full bg-[var(--lime)] px-5 text-xs font-bold text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-all shadow-xs self-start sm:self-auto"
        >
          <PlusIcon className="size-4 stroke-[2.5]" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Category Bar */}
      <div className="flex flex-col gap-3 rounded-[20px] bg-[var(--surface-1)] p-4 border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-4)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name, brand, HSN code…"
              className="h-10 w-full rounded-full bg-[var(--surface-2)] pl-9.5 pr-4 text-xs font-medium text-[var(--ink)] placeholder:text-[var(--ink-4)] border border-[var(--line)] focus:border-[var(--ink)] outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-4)] hover:text-[var(--ink)]"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--surface-2)]">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold transition-all',
                selectedCategory === cat
                  ? 'bg-[var(--ink)] text-white shadow-xs'
                  : 'bg-[var(--surface-2)] text-[var(--ink-3)] hover:text-[var(--ink)]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Table */}
      <div className="rounded-[20px] bg-[var(--surface-1)] border border-[var(--line)] shadow-[0_12px_32px_-16px_rgba(18,20,16,0.10)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--surface-2)] border-b border-[var(--line)] text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wider">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-3">Brand</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">HSN Code</th>
                <th className="py-3 px-3 text-center">GST Rate</th>
                <th className="py-3 px-3 text-center">Requires IMEI</th>
                <th className="py-3 px-4 text-right">Default Rate (Excl. GST)</th>
                <th className="py-3 px-4 text-center">Active Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-2)]">
              {filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  className={cn(
                    'h-14 hover:bg-[var(--surface-2)] transition-colors',
                    !p.active && 'opacity-50 bg-[var(--surface-2)]'
                  )}
                >
                  <td className="py-3 px-4 font-bold text-[var(--ink)]">
                    {p.name}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[var(--ink-2)]">
                    {p.brand}
                  </td>
                  <td className="py-3 px-3">
                    <span className="rounded-full bg-[var(--surface-3)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--ink)]">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[var(--ink-3)]">
                    {p.hsn}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-[var(--ink)]">
                    {p.gst_rate}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    {p.requires_imei ? (
                      <span className="inline-flex size-5 items-center justify-center rounded-full bg-[var(--pos-bg)] text-[var(--pos)]">
                        <CheckIcon className="size-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="text-[var(--ink-4)]">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[var(--ink)] tabular-nums">
                    {p.default_price ? formatINR(p.default_price) : '—'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleActive(p.id)}
                      className={cn(
                        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                        p.active ? 'bg-[var(--ink)]' : 'bg-[var(--surface-3)]'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block size-4 transform rounded-full bg-[var(--surface-1)] shadow-lg ring-0 transition duration-200 ease-in-out',
                          p.active ? 'translate-x-4' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Slide-Over Add Product Drawer (DESIGN.md Section 10) ───── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[var(--surface-1)] rounded-l-[28px] p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto">
              <form onSubmit={handleSaveProduct} className="flex flex-col gap-5">
                {/* Drawer header */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--ink)]">Add Product</h2>
                    <p className="text-xs text-[var(--ink-3)]">Create catalog item for counter POS billing</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="size-8 flex items-center justify-center rounded-full hover:bg-[var(--surface-2)] text-[var(--ink-3)]"
                  >
                    <XIcon className="size-5" />
                  </button>
                </div>

                {/* Duplicate warning */}
                {duplicateWarning && (
                  <div className="rounded-xl bg-[var(--amber-bg)] p-3 text-xs text-[var(--amber-crm)] font-medium flex items-start gap-2 border border-[var(--amber-crm)]/30">
                    <AlertCircleIcon className="size-4 shrink-0 mt-0.5" />
                    <span>{duplicateWarning}</span>
                  </div>
                )}

                {/* Field: Product Name */}
                <div>
                  <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                    Product Name (Mandatory)
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. OnePlus Nord CE 4"
                    className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs font-semibold text-[var(--ink)] border border-[var(--line)] focus:border-[var(--ink)] outline-none"
                  />
                </div>

                {/* Field: Brand */}
                <div>
                  <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                    Brand / Manufacturer (Mandatory)
                  </label>
                  <input
                    type="text"
                    required
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g. OnePlus, Samsung, boAt"
                    className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs font-semibold text-[var(--ink)] border border-[var(--line)] focus:border-[var(--ink)] outline-none"
                  />
                </div>

                {/* Field: Category */}
                <div>
                  <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                    Category (Auto-sets HSN &amp; Tax)
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => handleCategoryChange(e.target.value as any)}
                    className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs font-semibold text-[var(--ink)] border border-[var(--line)] outline-none"
                  >
                    <option value="Phones">Phones</option>
                    <option value="Chargers">Chargers</option>
                    <option value="Covers & Glass">Covers & Glass</option>
                    <option value="Earphones">Earphones</option>
                    <option value="Cables">Cables</option>
                    <option value="Power Banks">Power Banks</option>
                  </select>
                </div>

                {/* Grid: HSN + GST Rate */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                      HSN Code
                    </label>
                    <input
                      type="text"
                      value={newHsn}
                      onChange={(e) => setNewHsn(e.target.value)}
                      className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 font-mono text-xs font-semibold text-[var(--ink)] border border-[var(--line)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                      GST Rate (%)
                    </label>
                    <select
                      value={newGstRate}
                      onChange={(e) => setNewGstRate(Number(e.target.value) as any)}
                      className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs font-semibold text-[var(--ink)] border border-[var(--line)] outline-none"
                    >
                      <option value={12}>12% GST</option>
                      <option value={18}>18% GST (Standard)</option>
                      <option value={28}>28% GST</option>
                    </select>
                  </div>
                </div>

                {/* Field: Default Price */}
                <div>
                  <label className="text-[11px] font-semibold text-[var(--ink-3)] uppercase tracking-wide block mb-1">
                    Default Selling Price Excl. GST (Optional)
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="₹ 0.00"
                    className="h-10 w-full rounded-xl bg-[var(--surface-2)] px-3 text-xs font-bold tabular-nums text-[var(--ink)] border border-[var(--line)] outline-none"
                  />
                </div>

                {/* Requires IMEI Switch */}
                <div className="pt-2 border-t border-[var(--surface-2)]">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-semibold text-[var(--ink)]">
                      Requires IMEI Serial Capture at Checkout
                    </span>
                    <input
                      type="checkbox"
                      checked={newRequiresImei}
                      onChange={(e) => setNewRequiresImei(e.target.checked)}
                      className="rounded size-4 text-[var(--ink)] focus:ring-[var(--lime)]"
                    />
                  </label>
                  <p className="text-[11px] text-[var(--ink-3)] mt-1">
                    Enabling enforces 15-digit IMEI check digit verification during counter billing.
                  </p>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-[var(--line)] flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 h-11 rounded-full bg-[var(--lime)] font-bold text-xs text-[var(--ink)] hover:bg-[var(--lime-strong)] transition-colors"
                  >
                    Save Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="h-11 rounded-full px-5 border border-[var(--line)] text-xs font-semibold text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
