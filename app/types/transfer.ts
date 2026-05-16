export type TransferStatus = 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'acknowledged' | 'cancelled' | 'rejected' | 'ready_for_pickup' | 'available';

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
  productType?: 'farm_product' | 'batch_product';
  date?: string;
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
