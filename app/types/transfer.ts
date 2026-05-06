export type TransferStatus = 'available' | 'pending' | 'ready_for_pickup' | 'in_transit' | 'completed';

export interface ProductTransfer {
  id: string;
  batchId: string;
  productName: string;
  farmerName: string;
  farmName: string;
  location: string;
  quantity: number;
  unit: string;
  status: TransferStatus;
  qrCode?: string;
  image?: string;
}

export interface TransferOffer {
  id: string;
  transporterName: string;
  location: string;
  phone: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'accepted' | 'rejected';
  avatar?: string;
}
