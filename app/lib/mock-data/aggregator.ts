export interface AggregatorNavItem {
  id: string
  label: string
  href: string
  icon: 'layout-dashboard' | 'scan' | 'layers' | 'archive' | 'send' | 'scale'
}

export interface AggregatorNavGroup {
  title: string
  items: AggregatorNavItem[]
}

export const aggregatorSidebarNavigation: AggregatorNavGroup[] = [
  {
    title: 'Platform',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/aggregator', icon: 'layout-dashboard' },
      { id: 'batch-qr-scan', label: 'Batch QR Scan', href: '/aggregator/batch-qr-scan', icon: 'scan' },
      { id: 'lot-consolidation', label: 'Lot Consolidation', href: '/aggregator/lot-consolidation', icon: 'layers' },
      { id: 'lot-storage', label: 'Lot Storage', href: '/aggregator/lot-storage', icon: 'archive' },
      { id: 'transfer', label: 'Transfer', href: '/aggregator/transfer', icon: 'send' },
      {
        id: 'weight-reconciliation',
        label: 'Weight Reconciliation',
        href: '/aggregator/weight-reconciliation',
        icon: 'scale',
      },
    ],
  },
]
