import { Package, Plus, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { EmptyState } from '~/components/empty-state';
import { PageHeader } from '~/components/page-header';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { DatePicker } from '~/components/ui/date-picker';
import { getClientOrganizationId, getOrganizationHeaders } from '~/lib/organization-context';
import type { CreateBatchRequest } from '~/lib/api/generated/models';
import { useGetFacilities } from '~/lib/api/generated/facilities/facilities';
import { usePostProcessorsBatches } from '~/lib/api/generated/processors-batches/processors-batches';
import { usePostProcessorsBatchesIdInputMaterials } from '~/lib/api/generated/processors-materials/processors-materials';
import { BatchMaterialSelectorModal } from '~/components/processor/batch-material-selector-modal';

function SectionCard({ title, subtitle, icon, action, children }: { title: string; subtitle: string; icon: React.ReactNode; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden mb-6">
      <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-brand shrink-0">{icon}</div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-tight">{title}</h2>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 font-medium">{subtitle}</p>
          </div>
        </div>
        {action && <div className="w-full sm:w-auto">{action}</div>}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  )
}

function InputField({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

export default function CreateNewBatch() {
  const navigate = useNavigate();
  const organizationId = getClientOrganizationId()
  const organizationHeaders = getOrganizationHeaders()

  const { data: facilitiesResponse } = useGetFacilities({
    request: { headers: organizationHeaders },
    query: { enabled: Boolean(organizationId) },
  })

  const operationalFacilities = useMemo(
    () => (facilitiesResponse?.data?.data ?? []).filter((f) => f.status === 'operational'),
    [facilitiesResponse?.data?.data],
  )
  
  const { mutateAsync: createBatch, isPending: isCreatingBatch } = usePostProcessorsBatches({
    mutation: { networkMode: 'always' },
    request: { headers: organizationId ? { 'X-Organization-Id': organizationId } : {} },
  });

  const { mutateAsync: addMaterial, isPending: isAddingMaterial } = usePostProcessorsBatchesIdInputMaterials({
    mutation: { networkMode: 'always' },
    request: { headers: organizationId ? { 'X-Organization-Id': organizationId } : {} },
  });

  // Form state
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [formData, setFormData] = useState({
    outputProductName: '',
    outputProductType: '',
    packagingDate: '',
    shelfLifeDays: '',
    storageConditions: '',
    expectedQuantity: '',
    expectedUnit: 'kg',
    productCategory: '',
  });

  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([]);
  const [isSelectorModalOpen, setIsSelectorModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organizationId) {
      toast.error('Missing organization context.');
      return;
    }

    if (!formData.outputProductName.trim() || !formData.outputProductType) {
      toast.error('Please fill in output product name and product type.');
      return;
    }

    if (operationalFacilities.length > 0 && !selectedFacilityId) {
      toast.error('Select an operational processing facility for this batch.');
      return;
    }

    try {
      const payload: CreateBatchRequest = {
        outputProductName: formData.outputProductName.trim(),
        outputProductType: formData.outputProductType,
      };

      if (selectedFacilityId) {
        payload.facilityId = selectedFacilityId;
      }
      // TODO(backend): expectedQuantity / expectedUnit / productCategory from this form are not yet in CreateBatchRequest — align OpenAPI and persist when available.
      if (formData.packagingDate) payload.packagingDate = formData.packagingDate.includes('T')
        ? formData.packagingDate
        : `${formData.packagingDate}T00:00:00.000Z`;
      if (formData.shelfLifeDays.trim()) payload.shelfLifeDays = parseInt(formData.shelfLifeDays, 10);
      if (formData.storageConditions.trim()) {
        payload.storageConditions = { notes: formData.storageConditions.trim() };
      }

      const batchResponse = await createBatch({ data: payload });
      const batchId = (batchResponse as any)?.data?.data?.id;

      if (!batchId) {
        throw new Error('Failed to retrieve batch ID from response');
      }

      // Add materials
      if (selectedMaterials.length > 0) {
        toast.info(`Adding ${selectedMaterials.length} materials...`);
        for (const material of selectedMaterials) {
          // Explicitly map to AddInputMaterialRequest to ensure schema compliance
          const materialPayload: any = {
            materialType: material.materialType,
            quantityUsed: material.quantityUsed,
            unit: material.unit,
            notes: material.notes,
          };

          // Only attach relevant IDs/Fields based on materialType
          if (material.materialType === 'farm_product' && material.sourceFarmProductId) {
            materialPayload.sourceFarmProductId = material.sourceFarmProductId;
          } else if (material.materialType === 'batch_product' && material.sourceBatchProductId) {
            materialPayload.sourceBatchProductId = material.sourceBatchProductId;
          } else if (material.materialType === 'inventory_item' && material.inventoryItemId) {
            materialPayload.inventoryItemId = material.inventoryItemId;
          } else if (material.materialType === 'external_material') {
            if (material.externalMaterialName) materialPayload.externalMaterialName = material.externalMaterialName;
            if (material.externalSupplierName) materialPayload.externalSupplierName = material.externalSupplierName;
            if (material.lotNumber) materialPayload.lotNumber = material.lotNumber;
          }

          await addMaterial({ id: batchId, data: materialPayload });
        }
      }

      toast.success('Batch and materials created successfully!');
      navigate('/processor/batches');
    } catch (error) {
      console.error('Failed to create batch flow:', error);
      toast.error('Failed to complete batch creation. Please try again.');
    }
  };

  const removeMaterial = (index: number) => {
    setSelectedMaterials(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="pb-10">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/processor',
          },
          { label: 'Batches', href: '/processor/batches' },
          { label: 'Create New Batch' },
        ]}
      />

      {!organizationId && (
        <EmptyState
          className="rounded-md border border-dashed border-amber-200 bg-amber-50/40 py-8 mb-6"
          icon={<Package className="size-8 text-amber-700" />}
          title="Organization context is missing"
          description="Batch creation requires `X-Organization-Id`."
        />
      )}

      <div className="flex items-start gap-4 mb-8 text-left">
        <div className="text-brand bg-brand/10 p-2 rounded-md shrink-0">
          <Package className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand tracking-tight uppercase">Create Processing Batch</h1>
          <p className="text-sm text-gray-500 mt-1">Configure batch details, select input materials, and define output products</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* Section 1: Batch Information */}
        <SectionCard
          title="Batch Information"
          subtitle="Define the output product and processing details"
          icon={<Package className="size-5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Output Product Name" required>
              <input
                type="text"
                name="outputProductName"
                value={formData.outputProductName}
                onChange={handleInputChange}
                placeholder="e.g. Premium Fortified Maize Flour"
                required
                className="w-full h-11 rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </InputField>
            <InputField label="Product Type" required>
              <div className="relative">
                <select
                  name="outputProductType"
                  value={formData.outputProductType}
                  onChange={handleInputChange}
                  required
                  className="w-full h-11 appearance-none rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="">Select product type</option>
                  <option value="flour">Flour</option>
                  <option value="oil">Oil</option>
                  <option value="canned">Canned Goods</option>
                  <option value="dried">Dried Products</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </InputField>
            {operationalFacilities.length === 0 ? (
              <div className="md:col-span-2 rounded-md border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm text-amber-950">
                <p className="font-semibold text-amber-900">No operational facilities on file</p>
                <p className="mt-1 text-xs text-amber-800/90">
                  Add an operational processing facility before assigning this batch to a plant, or continue without linking one if your workflow allows it.
                </p>
                <Link
                  to="/processor/facilities"
                  className="mt-3 inline-flex text-xs font-bold uppercase tracking-widest text-brand underline-offset-4 hover:underline"
                >
                  Go to facilities
                </Link>
              </div>
            ) : (
              <>
                <InputField label="Processing facility" required>
                  <div className="relative">
                    <select
                      value={selectedFacilityId}
                      onChange={(e) => setSelectedFacilityId(e.target.value)}
                      required
                      className="w-full h-11 appearance-none rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    >
                      <option value="">Select facility</option>
                      {operationalFacilities.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </InputField>
                <InputField label="Facility location">
                  <input
                    type="text"
                    readOnly
                    value={
                      operationalFacilities.find((f) => f.id === selectedFacilityId)?.location?.trim() ||
                      '—'
                    }
                    className="w-full h-11 cursor-not-allowed rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700"
                  />
                </InputField>
              </>
            )}
            <InputField label="Packaging date">
              <DatePicker
                value={formData.packagingDate}
                onChange={(dateStr) => setFormData((prev) => ({ ...prev, packagingDate: dateStr }))}
                placeholder="Select packaging date"
              />
            </InputField>
            <InputField label="Shelf Life (Days)">
              <input
                type="number"
                name="shelfLifeDays"
                value={formData.shelfLifeDays}
                onChange={handleInputChange}
                placeholder="e.g. 365"
                className="w-full h-11 rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </InputField>
          </div>

          <div className="mt-6">
            <InputField label="Storage Conditions">
              <textarea
                name="storageConditions"
                value={formData.storageConditions}
                onChange={handleInputChange}
                placeholder="e.g. Store in cool, dry place away from direct sunlight"
                rows={3}
                className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand resize-none"
              />
            </InputField>
          </div>
        </SectionCard>

        {/* Section 2: Input Materials Selection */}
        <SectionCard
          title="Input Materials Selection"
          subtitle="Select materials from platform transfers and external suppliers"
          icon={<Package className="size-5" />}
          action={
            <button
              type="button"
              onClick={() => setIsSelectorModalOpen(true)}
              className="inline-flex w-full sm:w-auto h-9 items-center justify-center gap-1.5 rounded-md border border-brand bg-brand px-4 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-black active:scale-95"
            >
              <Plus className="size-4" />
              Select Material
            </button>
          }
        >
          {selectedMaterials.length === 0 ? (
            <EmptyState
              className="py-12"
              icon={<Package className="size-8 text-gray-300" />}
              title="No materials selected"
              description="Click 'Select Material' to include raw inputs for this batch."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Material</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Source Type</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Quantity</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedMaterials.map((mat, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 group">
                      <td className="px-4 py-4">
                        <div className="font-bold text-gray-900 group-hover:text-brand transition-colors">
                          {mat.externalMaterialName || mat.notes?.split(': ')[1] || 'Platform Material'}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{mat.lotNumber || 'Direct Transfer'}</div>
                      </td>
                      <td className="px-4 py-4 capitalize">
                        <Badge variant="outline" className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-gray-50">
                          {mat.materialType?.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-gray-900 font-black tracking-tight">{mat.quantityUsed} {mat.unit}</td>
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => removeMaterial(idx)}
                          className="text-red-500 hover:text-red-700 text-[10px] font-bold uppercase tracking-widest"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        {/* Section 3: Auto-Generated Product Settings */}
        <SectionCard
          title="Auto-Generated Product Settings"
          subtitle="Configure the product that will be automatically created when this batch is completed"
          icon={<Package className="size-5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <InputField label="Product Category" required>
              <div className="relative">
                <select
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleInputChange}
                  className="w-full h-11 appearance-none rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="">Select category</option>
                  <option value="finished_good">Finished Good</option>
                  <option value="intermediate">Intermediate Product</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </InputField>
            <InputField label="Expected Quantity" required>
              <input
                type="number"
                name="expectedQuantity"
                value={formData.expectedQuantity}
                onChange={handleInputChange}
                placeholder="0"
                required
                className="w-full h-11 rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </InputField>
            <InputField label="Unit" required>
              <div className="relative">
                <select
                  name="expectedUnit"
                  value={formData.expectedUnit}
                  onChange={handleInputChange}
                  required
                  className="w-full h-11 appearance-none rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="tonnes">tonnes</option>
                  <option value="units">units</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </InputField>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Product Visual</h3>
            <p className="text-sm text-gray-500 mb-4">Upload a photo of the final processed product or its packaging.</p>

            <div className="rounded-md border border-dashed border-gray-200 bg-gray-50/30 p-6 sm:p-10 text-center transition-all hover:bg-white hover:border-brand/40 flex flex-col items-center justify-center w-full sm:max-w-[440px] group cursor-pointer">
              <div className="mb-4 flex size-12 sm:size-14 items-center justify-center rounded-full bg-brand/5 text-brand group-hover:scale-110 transition-transform">
                <Package className="size-6 sm:size-7" />
              </div>
              <p className="text-sm font-bold text-gray-900">Click to select or drag and drop</p>
              <p className="mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">PNG, JPG or WEBP (Max 5MB)</p>

              <button type="button" className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-6 text-[10px] font-bold uppercase tracking-widest text-gray-900 shadow-sm transition-all hover:bg-gray-50 hover:shadow active:scale-95">
                Choose File
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Global Action Bar */}
        <div className="sticky bottom-4 sm:bottom-6 z-10 flex flex-col sm:flex-row items-center justify-end gap-3 rounded-md border border-gray-200 bg-white/90 p-4 shadow-xl backdrop-blur-md">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/processor/batches')}
            className="w-full sm:w-auto h-11 px-8 font-bold uppercase tracking-widest text-[10px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isCreatingBatch || isAddingMaterial}
            className="w-full sm:w-auto h-11 px-10 bg-[#1b4332] hover:bg-black text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-brand/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {(isCreatingBatch || isAddingMaterial) ? (
              <>
                <span className="size-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              'Save & Create Batch'
            )}
          </Button>
        </div>
      </form>

      <BatchMaterialSelectorModal
        isOpen={isSelectorModalOpen}
        onClose={() => setIsSelectorModalOpen(false)}
        onAdd={(material) => {
          setSelectedMaterials(prev => [...prev, material]);
        }}
      />
    </div>
  )
}


