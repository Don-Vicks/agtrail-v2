export const exporterSidebarNavigation = [
  {
    title: 'Platform',
    items: [
      { id: 'dashboard', label: 'Dashboard Overview', href: '/exporter', icon: 'layout-dashboard' },
      { id: 'add-farm', label: 'Add Farm', href: '/exporter/add-farm', icon: 'plus-circle' },
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
