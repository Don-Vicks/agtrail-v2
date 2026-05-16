export const exporterSidebarNavigation = [
  {
    title: 'Platform',
    items: [
      { id: 'dashboard', label: 'Dashboard Overview', href: '/exporter', icon: 'layout-dashboard' },
      { id: 'products', label: 'Products', href: '/exporter/products', icon: 'package' },
    ],
  },
  {
    title: 'Batches',
    items: [
      { id: 'scan-qr', label: 'Scan QR', href: '/exporter/scan-qr', icon: 'scan' },
      { id: 'batch-details', label: 'Batch Details', href: '/exporter/batch-details', icon: 'file-text' },
      { id: 'weight', label: 'Weight', href: '/exporter/weight', icon: 'scale' },
    ],
  },
  {
    title: 'Lot',
    items: [
      { id: 'lot-draft', label: 'Lot Draft', href: '/exporter/lot-draft', icon: 'file-edit' },
      { id: 'tress', label: 'Tress', href: '/exporter/tress', icon: 'git-branch' },
      { id: 'consolidation', label: 'Consolidation', href: '/exporter/consolidation', icon: 'layers' },
      { id: 'storage', label: 'Storage', href: '/exporter/storage', icon: 'database' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { id: 'record-op', label: 'Record Operation', href: '/exporter/record-operation', icon: 'clipboard' },
      { id: 'view-op', label: 'View Operation', href: '/exporter/view-operation', icon: 'eye' },
    ],
  },
  {
    title: 'Transfer',
    items: [
      { id: 'prod-transfer', label: 'Product Transfer', href: '/exporter/product-transfer', icon: 'send' },
      { id: 'prod-pickup', label: 'Product Pickup', href: '/exporter/product-pickup', icon: 'truck' },
    ],
  },
  {
    title: 'Export',
    items: [
      { id: 'draft', label: 'Draft', href: '/exporter/export/draft', icon: 'file' },
      { id: 'destination', label: 'Destination', href: '/exporter/export/destination', icon: 'map-pin' },
      { id: 'compliance', label: 'Compliance Analysis', href: '/exporter/export/compliance', icon: 'shield-check' },
      { id: 'manifest', label: 'Manifest', href: '/exporter/export/manifest', icon: 'scroll' },
      { id: 'add-docus', label: 'Add Docus', href: '/exporter/export/add-docus', icon: 'file-plus' },
      { id: 'inspection', label: 'Inspection', href: '/exporter/export/inspection', icon: 'search' },
      { id: 'passport', label: 'Passport', href: '/exporter/export/passport', icon: 'award' },
    ],
  },
]

export const exporterStats = [
  { label: 'Active Shipments', value: '42', trend: '+5%', sublabel: 'vs last month', icon: 'truck' },
  { label: 'Pending Compliance', value: '08', trend: '-2%', sublabel: 'urgent actions', icon: 'shield-check' },
  { label: 'Products Ready', value: '156', trend: '+12', sublabel: 'batches finalized', icon: 'package' },
  { label: 'Monthly Volume', value: '1.2k', trend: '+8%', sublabel: 'tons exported', icon: 'bar-chart' },
  { label: 'Delayed Shipments', value: '03', trend: '+1', sublabel: 'transit issues', icon: 'alert-circle' },
  { label: 'Total Revenue', value: '$4.8M', trend: '+15%', sublabel: 'YTD earnings', icon: 'dollar-sign' },
]

export const shipmentStatusOverview = [
  { label: 'DRAFT', value: 12, color: 'bg-gray-400' },
  { label: 'REVIEW', value: 8, color: 'bg-blue-400' },
  { label: 'READY', value: 15, color: 'bg-green-400' },
  { label: 'TRANSIT', value: 24, color: 'bg-teal-400' },
  { label: 'DELIVERED', value: 310, color: 'bg-[#1a4332]' },
  { label: 'DELAYED', value: 3, color: 'bg-red-400' },
]

export const availableShipments = [
  {
    batchId: '#BT - 98442',
    farmer: { name: 'Global Grains Co.', location: 'Rotterdam, Netherlands' },
    commodity: 'Soya Beans',
    quantity: '120 Tons',
    departure: '2024-04-04',
    status: 'In Transit',
    weight: 100,
  },
  {
    batchId: '#BT - 98442',
    farmer: { name: 'Pacific Organics', location: 'Yokohama, Japan' },
    commodity: 'Beans',
    quantity: '120 Tons',
    departure: '2024-04-02',
    status: 'Delayed',
    weight: 85,
  },
  {
    batchId: '#BT - 98442',
    farmer: { name: 'EuroFresh Ltd', location: 'Hamburg, Germany' },
    commodity: 'Cashew Nuts',
    quantity: '120 Tons',
    departure: '2024-04-10',
    status: 'In Transit',
    weight: 100,
  },
]

export const exportVolumeTrends = [
  { month: 'Nov', value: 30 },
  { month: 'Dec', value: 45 },
  { month: 'Jan', value: 60 },
  { month: 'Feb', value: 55 },
  { month: 'Mar', value: 80 },
  { month: 'Apr', value: 95 },
  { month: 'May', value: 85 },
]

export const revenueByDestination = [
  { destination: 'Netherlands', revenue: '$1.2M', percentage: 100 },
  { destination: 'China', revenue: '$950k', percentage: 80 },
  { destination: 'Japan', revenue: '$720k', percentage: 65 },
  { destination: 'Germany', revenue: '$610k', percentage: 55 },
]

export const alertCenter = [
  { id: 1, title: 'Phytosanitary Expired', description: 'ID: #C20-991 expires in 2 hours', type: 'error' },
  { id: 2, title: 'Missing Origin Cert', description: 'Batch #BT-88 requires documentation', type: 'warning' },
  { id: 3, title: 'Inspection Passed', description: 'Warehouse 4 inspection approved', type: 'success' },
]

export const recentActivity = [
  { id: 1, title: 'Shipment created', detail: 'TRD-2024-915 created by Sarah K.', time: '12 MINS AGO', icon: 'plus' },
  { id: 2, title: 'Document uploaded', detail: 'Bill of Lading added to #TRD-882', time: '45 MINS AGO', icon: 'upload' },
  { id: 3, title: 'Shipment In Transit', detail: 'TRD-2024-882 left Port Lagos', time: '2 HOURS AGO', icon: 'truck' },
  { id: 4, title: 'Compliance Flag', detail: 'Certificate renewal required for Batch A', time: '5 HOURS AGO', icon: 'alert' },
]

export const consolidationStats = [
  { label: 'Available Batches', value: '8' },
  { label: 'Lots Sealed', value: '0' },
  { label: 'Total KG Consolidated', value: '8 kg' },
  { label: 'Anomalies Flagged', value: '0' },
]

export const storageHistory = [
  { id: 'BATCH-1758814569861', product: 'Cashew', warehouse: 'Warehouse A', farm: 'Deborah Ogunyemi Farm', location: 'Zone 16, Kute, Iwo Road', date: '13 Oct, 2025 8:30am', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BATCH-1758814569861' },
  { id: 'BATCH-1758814569862', product: 'Cashew', warehouse: 'Warehouse A', farm: 'Deborah Ogunyemi Farm', location: 'Zone 16, Kute, Iwo Road', date: '13 Oct, 2025 8:30am', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BATCH-1758814569862' },
  { id: 'BATCH-1758814569863', product: 'Cashew', warehouse: 'Warehouse A', farm: 'Deborah Ogunyemi Farm', location: 'Zone 16, Kute, Iwo Road', date: '13 Oct, 2025 8:30am', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BATCH-1758814569863' },
  { id: 'BATCH-1758814569864', product: 'Cashew', warehouse: 'Warehouse A', farm: 'Deborah Ogunyemi Farm', location: 'Zone 16, Kute, Iwo Road', date: '13 Oct, 2025 8:30am', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BATCH-1758814569864' },
]

export const operationJourney = [
  { 
    stage: 'Land Preparation', 
    date: '24th September 2023', 
    time: '12:00 AM', 
    description: 'Clearing and preparing the land for farming. This cycle on Plot A began with a strong focus on soil conservation and balanced fertility.',
    details: [
      { label: 'Primary Tillage', value: 'No-Till + Zero Tillage' },
      { label: 'Conservation Structures', value: 'Contour Ploughing' },
      { label: 'Preparation Techniques', value: 'Harrowing' },
      { label: 'Clearing Method', value: 'Manual Clearing (Cutlass/Hoe)' },
      { label: 'Equipment', value: 'Tractor' },
    ]
  },
  { 
    stage: 'Planting', 
    date: '24th September 2023', 
    time: '12:00 AM', 
    description: 'Clearing and preparing the land for farming. This cycle on Plot A began with a strong focus on soil conservation and balanced fertility.',
    details: [
      { label: 'Primary Tillage', value: 'No-Till + Zero Tillage' },
      { label: 'Conservation Structures', value: 'Contour Ploughing' },
      { label: 'Preparation Techniques', value: 'Harrowing' },
      { label: 'Clearing Method', value: 'Manual Clearing (Cutlass/Hoe)' },
      { label: 'Equipment', value: 'Tractor' },
    ]
  },
  { 
    stage: 'Land Preparation (Aggregator)', 
    date: '24th September 2023', 
    time: '12:00 AM', 
    description: 'Clearing and preparing the land for farming. This cycle on Plot A began with a strong focus on soil conservation and balanced fertility.',
    details: [
      { label: 'Primary Tillage', value: 'No-Till + Zero Tillage' },
      { label: 'Conservation Structures', value: 'Contour Ploughing' },
      { label: 'Preparation Techniques', value: 'Harrowing' },
      { label: 'Clearing Method', value: 'Manual Clearing (Cutlass/Hoe)' },
      { label: 'Equipment', value: 'Tractor' },
    ]
  },
  { 
    stage: 'Certification Status', 
    date: '24th September 2023', 
    time: '12:00 AM', 
    description: 'Clearing and preparing the land for farming. This cycle on Plot A began with a strong focus on soil conservation and balanced fertility.',
    details: []
  },
]

export const exportBatchTable = [
  { batchId: '#BT - 98442', commodity: 'Cocoa Beans', quantity: '420 Unit', harvested: '2025-04-13', weight: '250.00 Kg', selected: true },
  { batchId: '#BT - 98442', commodity: 'Cashew Nuts', quantity: '500 Unit', harvested: '2025-04-13', weight: '250.00 Kg', selected: false },
  { batchId: '#BT - 98442', commodity: 'Yam', quantity: '52 Unit', harvested: '2025-04-13', weight: '250.00 Kg', selected: true },
  { batchId: '#BT - 98442', commodity: 'Beans', quantity: '300 Unit', harvested: '2025-04-13', weight: '250.00 Kg', selected: false },
  { batchId: '#BT - 98442', commodity: 'Rice', quantity: '10 Unit', harvested: '2025-04-13', weight: '250.00 Kg', selected: true },
  { batchId: '#BT - 98442', commodity: 'Cashew Nuts', quantity: '300 Unit', harvested: '2025-04-13', weight: '250.00 Kg', selected: false },
  { batchId: '#BT - 98442', commodity: 'Maize', quantity: '10 Unit', harvested: '2025-04-13', weight: '250.00 Kg', selected: true },
]

export const draftManifestBatches = [
  { id: 'BT-44890', type: 'Premium Cocoa', weight: '45 MT' },
  { id: 'BT-44895', type: 'Raw Cashew', weight: '32 MT' },
]

export const manifestSummary = {
  attachedBatches: 12,
  totalNetWeight: '24,500',
  loadPercentage: 88,
  compliance: {
    license: true,
    phytosanitary: false,
  }
}

export const availableFarmers = [
  { id: 1, batchId: '#BT - 98442', farmer: 'Sarah Greenfield', farmerId: 'F - 006', quantity: '420 Unit', harvested: '2025-04-13', weight: '250.00 Kg', selected: true },
  { id: 2, batchId: '#BT - 98442', farmer: 'Sarah Rogers', farmerId: 'F - 004', quantity: '500 Unit', harvested: '2025-04-13', weight: '250.00 Kg', selected: false },
  { id: 3, batchId: '#BT - 98442', farmer: 'Sarah Greenfield', farmerId: 'F - 006', quantity: '52 Unit', harvested: '2025-04-13', weight: '250.00 Kg', selected: true },
  { id: 4, batchId: '#BT - 98442', farmer: 'Sarah Rogers', farmerId: 'F - 008', quantity: '300 Unit', harvested: '2025-04-13', weight: '250.00 Kg', selected: false },
  { id: 5, batchId: '#BT - 98442', farmer: 'Johnathan Arable', farmerId: 'F - 007', quantity: '10 Unit', harvested: '2025-04-13', weight: '250.00 Kg', selected: true },
  { id: 6, batchId: '#BT - 98442', farmer: 'Sarah Rogers', farmerId: 'F - 008', quantity: '300 Unit', harvested: '2025-04-13', weight: '250.00 Kg', selected: false },
  { id: 7, batchId: '#BT - 98442', farmer: 'Johnathan Arable', farmerId: 'F - 007', quantity: '10 Unit', harvested: '2025-04-13', weight: '250.00 Kg', selected: true },
]

export const auditLogs = [
  { timestamp: '24 Oct 2023, 09:12 AM', action: 'Lot Composition Finalized', entity: 'LOT-2023-001', performedBy: 'Robert Miller (Manager)', status: 'COMPLETED' },
  { timestamp: '23 Oct 2023, 04:45 PM', action: 'Batch G05 Verified', entity: 'Sarah Greenfield', performedBy: 'System Autocheck', status: 'VERIFIED' },
  { timestamp: '22 Oct 2023, 11:30 AM', action: 'New Farmer Onboarding', entity: 'Jonathan Arable', performedBy: 'Alice Wong (Admin)', status: 'COMPLETED' },
]

export const lotTreeData = {
  id: 'LOT-2023-001',
  weight: '12,450 kg',
  grade: 'Arabica Grade A',
  farmers: [
    {
      name: 'Jonathan Arable',
      role: 'Source Farmer',
      contribution: '7,200 kg',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      batches: [
        { id: 'BATCH-A12', weight: '3,600 kg', date: 'Oct 12, 2023' },
        { id: 'BATCH-A15', weight: '3,600 kg', date: 'Oct 15, 2023' },
      ]
    },
    {
      name: 'Sarah Greenfield',
      role: 'Source Farmer',
      contribution: '5,250 kg',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      batches: [
        { id: 'BATCH-G02', weight: '2,625 kg', date: 'Oct 18, 2023' },
        { id: 'BATCH-G05', weight: '2,625 kg', date: 'Oct 20, 2023' },
      ]
    }
  ]
}

export const lotReviewStats = [
  { label: 'Total Batches', value: '142', sublabel: 'All Verified' },
  { label: 'Total Farmers', value: '2', sublabel: 'Direct Sourcing' },
  { label: 'Final Weight', value: '1000 kg', sublabel: '+12% vs last Mo' },
]
