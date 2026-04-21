import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PageHeader } from '~/components/page-header';
import { EmptyState } from '~/components/empty-state';
import { Package } from 'lucide-react';
import type { CreateBatchRequest } from '~/lib/api/generated/models';
import { usePostProcessorsBatches } from '~/lib/api/generated/processors-batches/processors-batches';
import { getClientOrganizationId } from '~/lib/organization-context';

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
  const navigate = useNavigate();
  const organizationId = getClientOrganizationId()
  const { mutate: createBatch, isPending } = usePostProcessorsBatches({
    mutation: { networkMode: 'always' },
    request: { headers: organizationId ? { 'X-Organization-Id': organizationId } : {} },
  });

  // Form state
  const [outputProductName, setOutputProductName] = useState('');
  const [outputProductType, setOutputProductType] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [facilityLocation, setFacilityLocation] = useState('');
  const [packagingDate, setPackagingDate] = useState('');
  const [shelfLifeDays, setShelfLifeDays] = useState('');
  const [storageConditions, setStorageConditions] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organizationId) {
      toast.error('Missing organization context. Set VITE_DEFAULT_ORGANIZATION_ID or select an organization.');
      return;
    }

    const trimmedProductName = outputProductName.trim();
    if (!trimmedProductName || !outputProductType) {
      toast.error('Please fill in output product name and product type.');
      return;
    }

    if (shelfLifeDays.trim()) {
      const days = parseInt(shelfLifeDays, 10);
      if (!Number.isFinite(days) || days < 1) {
        toast.error('Shelf life must be a positive whole number of days.');
        return;
      }
    }

    const payload: CreateBatchRequest = {
      outputProductName: trimmedProductName,
      outputProductType,
    };

    // Add optional fields if provided
    if (facilityName.trim()) payload.facilityName = facilityName.trim();
    if (facilityLocation.trim()) payload.facilityLocation = facilityLocation.trim();
    if (packagingDate) payload.packagingDate = packagingDate;
    if (shelfLifeDays.trim()) payload.shelfLifeDays = parseInt(shelfLifeDays, 10);
    if (storageConditions.trim()) payload.storageConditions = storageConditions.trim();

    createBatch(
      { data: payload },
      {
        onSuccess: (response) => {
          const queuedOffline = (response as any)?.status === 202 || (response as any)?.data?.offlineQueued
          if (queuedOffline) {
            toast.success('Batch saved offline and queued for sync.')
            setOutputProductName('')
            setOutputProductType('')
            setFacilityName('')
            setFacilityLocation('')
            setPackagingDate('')
            setShelfLifeDays('')
            setStorageConditions('')
            return
          }

          toast.success('Batch created successfully!')
          navigate('/processor/batches');
        },
        onError: (error) => {
          console.error('Failed to create batch:', error);
          const message =
            (error as any)?.response?.data?.message ||
            (error as any)?.message ||
            'Failed to create batch. Please try again.'
          toast.error(message);
        },
      }
    );
  };
  return (
    <div className="pb-10">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/processor',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Batches', href: '/processor/batches' },
          { label: 'Create New Batch' },
        ]}
      />

      {/* Page Header */}
      {!organizationId ? (
        <EmptyState
          className="rounded-xl border border-dashed border-amber-200 bg-amber-50/40 py-8 mb-6"
          icon={<Package className="size-8 text-amber-700" />}
          title="Organization context is missing"
          description="Batch creation requires `X-Organization-Id`. Set `VITE_DEFAULT_ORGANIZATION_ID` and restart dev server."
        />
      ) : null}
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Output Product Name" placeholder="e.g. Premium Fortified Maize Flour" required>
              <input
                type="text"
                value={outputProductName}
                onChange={(e) => setOutputProductName(e.target.value)}
                placeholder="e.g. Premium Fortified Maize Flour"
                required
                className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </InputField>
            <InputField label="Product Type" required>
              <div className="relative">
                <select
                  value={outputProductType}
                  onChange={(e) => setOutputProductType(e.target.value)}
                  required
                  className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="">Select product type</option>
                  <option value="flour">Flour</option>
                  <option value="oil">Oil</option>
                  <option value="canned">Canned Goods</option>
                  <option value="dried">Dried Products</option>
                  <option value="other">Other</option>
                </select>
                <svg className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </InputField>
            <InputField label="Processing Facility">
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                placeholder="e.g. Main Processing Plant"
                className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </InputField>
            <InputField label="Facility Location">
              <input
                type="text"
                value={facilityLocation}
                onChange={(e) => setFacilityLocation(e.target.value)}
                placeholder="e.g. Lagos, Nigeria"
                className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </InputField>
            <InputField label="Packaging Date">
              <input
                type="date"
                value={packagingDate}
                onChange={(e) => setPackagingDate(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </InputField>
            <InputField label="Shelf Life (Days)">
              <input
                type="number"
                value={shelfLifeDays}
                onChange={(e) => setShelfLifeDays(e.target.value)}
                placeholder="e.g. 365"
                className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </InputField>
          </div>

          <InputField label="Storage Conditions">
            <textarea
              value={storageConditions}
              onChange={(e) => setStorageConditions(e.target.value)}
              placeholder="e.g. Store in cool, dry place away from direct sunlight"
              rows={3}
              className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand resize-none"
            />
          </InputField>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1b4332] hover:bg-[#0f2e20] px-6 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Creating Batch...' : 'Create Batch'}
            </button>
          </div>
        </form>
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
        <EmptyState
          className="py-12"
          icon={<Package className="size-8 text-[#8ea79d]" />}
          title="No materials selected"
          description='Use "Add Material" to select inputs for this batch.'
        />
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

    </div>
  )
}
