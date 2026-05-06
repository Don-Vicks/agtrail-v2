export interface AggregatorNavItem {
  id: string
  label: string
  href: string
  icon: 'layout-dashboard' | 'scan' | 'layers' | 'archive' | 'send' | 'scale' | 'truck'
}

export interface AggregatorNavGroup {
  title: string
  items: AggregatorNavItem[]
}

export const aggregatorSidebarNavigation: AggregatorNavGroup[] = [
  {
    title: 'Platform',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/aggregator',
        icon: 'layout-dashboard',
      },
      {
        id: 'batch-qr-scan',
        label: 'Batch QR Scan',
        href: '/aggregator/batch-qr-scan',
        icon: 'scan',
      },
      {
        id: 'lot-consolidation',
        label: 'Lot Consolidation',
        href: '/aggregator/lot-consolidation',
        icon: 'layers',
      },
      {
        id: 'storage-history',
        label: 'Storage History',
        href: '/aggregator/storage-history',
        icon: 'archive',
      },
    ],
  },
  {
    title: 'Transfer',
    items: [
      {
        id: 'product-transfer',
        label: 'Product Transfer',
        href: '/aggregator/transfer/product-transfer',
        icon: 'send',
      },
      {
        id: 'products-pickup',
        label: 'Products Pickup',
        href: '/aggregator/transfer/pickup',
        icon: 'truck',
      },
    ],
  },
]
