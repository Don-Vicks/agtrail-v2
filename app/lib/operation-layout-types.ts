/** Shape expected by `OperationFormLayout` (mock + API-backed pages). */
export type OperationLayoutCropCycle = {
  id: string
  farmId: string
  latitude?: number | null
  longitude?: number | null
  productName: string
  variety?: string | null
  plantedDate?: string | null
  area?: number | string | null
  /** Total farm size (hectares), when available from the farm record. */
  farmSizeHectares?: number | string | null
  season?: string | null
  farmName: string
  farmLocation: string
  farmer: string
  farmerInitials: string
  farmerColor: string
  /** Crop cycle workflow status; several operation forms treat `planned` as the organic-program proxy until the API exposes an explicit flag. */
  status?: string
}
