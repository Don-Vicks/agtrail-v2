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

export const BATCHES = [
  {
    id: '#BT - 98442',
    origin: 'Akure, Nigeria',
    commodity: 'Feed Corn',
    weight: '300 Kg',
    status: 'Available',
  },
  {
    id: '#BT - 98443',
    origin: 'Abeokuta, Nigeria',
    commodity: 'Premium Wheat',
    weight: '300 Kg',
    status: 'Available',
  },
  {
    id: '#BT - 98444',
    origin: 'Abeokuta, Nigeria',
    commodity: 'Grain',
    weight: '300 Kg',
    status: 'Available',
  },
]

export const VERIFIED_EVENTS = [
  {
    id: 1,
    location: 'Chicago Central Silo',
    verifiedBy: 'Mark K.',
    time: '24m AGO',
  },
  {
    id: 2,
    location: 'Denver Processing',
    verifiedBy: 'Sarah J.',
    time: '1.5h AGO',
  },
  {
    id: 3,
    location: 'Denver Processing',
    verifiedBy: 'Sarah J.',
    time: '1.5h AGO',
  },
]

export const SHIPMENTS = [
  {
    id: 1,
    driver: 'Marcus Thorne',
    vessel: 'Vessel #4420-B',
    path: 'NE Farm - Chicago',
    progress: 75,
    status: 'Operational',
    eta: '14:45',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
  },
  {
    id: 2,
    driver: 'Elena Rodriguez',
    vessel: 'Vessel #5512-C',
    path: 'South Silo - Port Mobile',
    progress: 45,
    status: 'Stationary',
    eta: '19:20',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
  },
  {
    id: 3,
    driver: 'Julian Vose',
    vessel: 'Vessel #8891-A',
    path: 'Valley Ranch - Denver',
    progress: 90,
    status: 'Final Approach',
    eta: '09:15',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian',
  },
  {
    id: 4,
    driver: 'Sarah McEnery',
    vessel: 'Vessel #1042-X',
    path: 'Agro Park - Chicago',
    progress: 60,
    status: 'Congestion',
    eta: '11:55',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
]
