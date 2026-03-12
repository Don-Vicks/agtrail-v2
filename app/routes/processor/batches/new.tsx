import React from 'react';
import { Link } from 'react-router';

function Breadcrumb() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
      <Link to="/processor" className="flex items-center gap-1 hover:text-gray-900 transition-colors">
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Dashboard
      </Link>
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      <Link to="/processor/batches" className="hover:text-gray-900 transition-colors">Batches</Link>
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      <span className="text-gray-900 font-medium">Create New Batch</span>
    </div>
  )
}

function SectionCard({ title, subtitle, icon, action, children }: { title: string; subtitle: string; icon: React.ReactNode; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-100 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-gray-800">{icon}</div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function InputField({ label, placeholder, required = false, type = 'text', children }: { label: string; placeholder?: string; required?: boolean; type?: string; children?: React.ReactNode }) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-semibold text-gray-900">
        {label} {required && <span className="text-gray-900">*</span>}
      </label>
      {children ? children : (
        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      )}
    </div>
  )
}

export default function CreateNewBatch() {
  return (
    <div className="max-w-[1000px] mx-auto pb-10">
      <Breadcrumb />

      {/* Page Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="text-brand bg-brand/10 p-2 rounded-lg shrink-0">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l4-4 4 4 4-4 6 6M3 10.5V21h18V10.5M3 10.5l4-4 4 4 4-4 6 6" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand tracking-tight">Enhanced Batch Creation</h1>
          <p className="text-sm text-gray-500 mt-1">Create batches with platform and external materials, auto-generate traceable products</p>
        </div>
      </div>

      {/* Section 1: Batch Information */}
      <SectionCard
        title="Batch Information"
        subtitle="Define the output product and processing details"
        icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Output Product Name" placeholder="e.g. Premium Fortified Maize Flour" required />
          <InputField label="Product Type" required>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
                <option>Select product type</option>
              </select>
              <svg className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </InputField>
          <InputField label="Processing Facility">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <select className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
                  <option>Select facility</option>
                </select>
                <svg className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
              <button className="inline-flex items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/20">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Facility
              </button>
            </div>
          </InputField>
          <InputField label="Shelf Life (Days)" placeholder="e.g. 365" />
        </div>
      </SectionCard>

      {/* Section 2: Input Materials Selection */}
      <SectionCard
        title="Input Materials Selection"
        subtitle="Select materials from platform transfers and external suppliers"
        icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        action={
          <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Material
          </button>
        }
      >
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="mb-4 text-[#8ea79d]">
            <svg className="size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-900">No Materials Selected</h3>
          <p className="mt-1 text-sm text-gray-500">Click "Add Material" to select materials for this batch.</p>
        </div>
      </SectionCard>

      {/* Section 3: Auto-Generated Product Settings */}
      <SectionCard
        title="Auto-Generated Product Settings"
        subtitle="Configure the product that will be automatically created when this batch is completed"
        icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <InputField label="Product Category" required>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
                <option>Select category</option>
              </select>
              <svg className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </InputField>
          <InputField label="Expected Quantity" placeholder="0" required />
          <InputField label="Unit" required>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
                <option>kg</option>
                <option>g</option>
                <option>tonnes</option>
              </select>
              <svg className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </InputField>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Product Visual</h3>
          <p className="text-sm text-gray-500 mb-4">Upload a photo of the final processed product or its packaging.</p>

          <div className="flex flex-col mb-4">
            <span className="text-sm font-semibold text-gray-900 mb-2">Product Photo</span>
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center transition-colors hover:bg-gray-50 flex flex-col items-center justify-center max-w-[400px]">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#1b4332]/10 text-brand">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-900">Click to select or drag and drop</p>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG or WEBP (Max 5MB)</p>

              <button className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/20">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Choose File
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="pt-2">
        <Link to="/processor/batches" className="inline-flex h-10 items-center justify-center rounded-lg bg-[#1b4332] hover:bg-[#0f2e20] px-6 text-sm font-semibold text-white shadow-sm transition-colors">
          Create Enhanced Batch
        </Link>
      </div>

    </div>
  )
}
