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
  season?: string | null
  farmName: string
  farmLocation: string
  farmer: string
  farmerInitials: string
  farmerColor: string
  status?: string
}
