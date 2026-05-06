export const transporterSidebarNavigation = [
  {
    title: 'Platform',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard Overview',
        href: '/transporter',
        icon: 'layout-dashboard',
      },
    ],
  },
  {
    title: 'Logistics',
    items: [
      {
        id: 'pickup',
        label: 'Pick Up Verification',
        href: '/transporter/pickup',
        icon: 'scan',
      },
      {
        id: 'transit',
        label: 'Active Transit',
        href: '/transporter/transit',
        icon: 'map',
      },
      {
        id: 'delivery',
        label: 'Delivery & Proof of Custody',
        href: '/transporter/delivery',
        icon: 'check-circle',
      },
      {
        id: 'history',
        label: 'Shipment History',
        href: '/transporter/history',
        icon: 'archive',
      },
    ],
  },
  {
    title: 'Transfer',
    items: [
      {
        id: 'product-transfer',
        label: 'Transfer Offers',
        href: '/transporter/transfer/product-transfer',
        icon: 'send',
      },
    ],
  },
]
