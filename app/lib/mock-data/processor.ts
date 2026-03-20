export const currentUser = {
  name: 'Agrolinking Administrator',
  email: 'admin@agrolinking.com',
  initials: 'AA',
  role: 'Processor' as const,
  walletAddress: 'GBGXM4...WWKA',
}

export const sidebarNavigation = {
  platform: [
    {
      label: 'Dashboard Overview',
      icon: 'layout-dashboard',
      href: '/processor',
    },
    { label: 'Add New Batch', icon: 'plus', href: '/processor/batches/new' },
    { label: 'Batches', icon: 'layers', href: '/processor/batches' },
    { label: 'Products', icon: 'package', href: '/processor/products' },
    { label: 'Inventory', icon: 'jar', href: '/processor/inventory' },
    { label: 'Personnel', icon: 'clipboard-list', href: '/processor/personnel' },
  ],
  operations: [
    { label: 'Materials', icon: 'box', href: '/processor/materials' },
  ],
  certification: [
    {
      label: 'Upload Processor Certification',
      icon: 'upload',
      href: '/processor/certifications/processor',
    },
    {
      label: 'Upload Product Certification',
      icon: 'upload',
      href: '/processor/certifications/product',
    },
    {
      label: 'Certification Readiness',
      icon: 'check-circle',
      href: '/processor/certifications/readiness',
    },
  ],
  finance: [
    {
      label: 'Record Purchase',
      icon: 'receipt',
      href: '/processor/finance/purchase',
    },
    {
      label: 'Receivables',
      icon: 'banknote',
      href: '/processor/finance/receivables',
    },
  ],
  reports: [
    { label: 'Settings', icon: 'settings', href: '/processor/settings' },
  ],
}

// ─── Batches Mock Data ─────────────────────────────────────────────

export interface ProcessorBatch {
  id: string
  batchId: string
  productName: string
  farmName: string | null
  farmerName: string | null
  complianceStatus: 'Pending' | 'Compliant' | 'Non-Compliant'
  status: 'Incoming' | 'WIP' | 'Completed'
}

export const mockBatches: ProcessorBatch[] = [
  {
    id: '1',
    batchId: 'PB-20260309-0014',
    productName: 'Akara',
    farmName: null,
    farmerName: null,
    complianceStatus: 'Pending',
    status: 'Incoming',
  },
  {
    id: '2',
    batchId: 'PB-20260214-0013',
    productName: 'Honey Master',
    farmName: null,
    farmerName: null,
    complianceStatus: 'Pending',
    status: 'Incoming',
  },
  {
    id: '3',
    batchId: 'PB-20260212-0012',
    productName: 'Olamide',
    farmName: null,
    farmerName: null,
    complianceStatus: 'Pending',
    status: 'Incoming',
  },
  {
    id: '4',
    batchId: 'PB-1764771714824',
    productName: 'Beans Cake (Akara Special)',
    farmName: null,
    farmerName: null,
    complianceStatus: 'Pending',
    status: 'Incoming',
  },
  {
    id: '5',
    batchId: 'PB-1764682859222',
    productName: 'Beans Cake',
    farmName: null,
    farmerName: null,
    complianceStatus: 'Pending',
    status: 'Incoming',
  },

  // Completed
  {
    id: '6',
    batchId: 'PB-20260120-0011',
    productName: 'Bera Flour',
    farmName: null,
    farmerName: null,
    complianceStatus: 'Pending',
    status: 'Completed',
  },
  {
    id: '7',
    batchId: 'PB-20251215-0010',
    productName: 'Tomatoe',
    farmName: null,
    farmerName: null,
    complianceStatus: 'Pending',
    status: 'Completed',
  },
  {
    id: '8',
    batchId: 'PB-20251211-0009',
    productName: 'Fortified Maize Flour',
    farmName: null,
    farmerName: null,
    complianceStatus: 'Compliant',
    status: 'Completed',
  },
  {
    id: '9',
    batchId: 'PB-20251211-0008',
    productName: 'Bean Flour',
    farmName: null,
    farmerName: null,
    complianceStatus: 'Compliant',
    status: 'Completed',
  },
  {
    id: '10',
    batchId: 'PB-1765021676170',
    productName: 'Tomatoe',
    farmName: null,
    farmerName: null,
    complianceStatus: 'Pending',
    status: 'Completed',
  },
]
