export const transporterSidebarNavigation = [
  {
    title: 'Platform',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard Overview',
        href: '/transporter',
        icon: 'activity',
      },
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
        icon: 'git-branch',
      },
      {
        id: 'delivery',
        label: 'Delivery & Proof of Custody',
        href: '/transporter/delivery',
        icon: 'package',
      },
      {
        id: 'transfer-offers',
        label: 'Transfer Offers',
        href: '/transporter/transfer/product-transfer',
        icon: 'inbox',
      },
      {
        id: 'transfer-history',
        label: 'Transfer History',
        href: '/transporter/transfer/history',
        icon: 'history',
      },
      {
        id: 'history',
        label: 'Shipment History',
        href: '/transporter/history',
        icon: 'archive',
      },
    ],
  },
]

export const shipmentHistory = [
  {
    id: 1,
    date: 'Oct 24, 2026',
    time: '14:32 GMT',
    batchId: '#BT - 98442',
    driver: 'Marcus Chen',
    route: 'Warehouse A - Port Terminal',
    status: 'Delivered',
  },
  {
    id: 2,
    date: 'Oct 24, 2026',
    time: '14:32 GMT',
    batchId: '#BT - 98442',
    driver: 'Sarah Rogers',
    route: 'Warehouse A - Port Terminal',
    status: 'In Transit',
  },
  {
    id: 3,
    date: 'Oct 24, 2026',
    time: '14:32 GMT',
    batchId: '#BT - 98442',
    driver: 'Alex Jenkins',
    route: 'Warehouse A - Port Terminal',
    status: 'Pending',
  },
  {
    id: 4,
    date: 'Oct 24, 2026',
    time: '14:32 GMT',
    batchId: '#BT - 98442',
    driver: 'Alex Jenkins',
    route: 'Warehouse A - Port Terminal',
    status: 'Pending',
  },
  {
    id: 5,
    date: 'Oct 24, 2026',
    time: '14:32 GMT',
    batchId: '#BT - 98442',
    driver: 'Alex Jenkins',
    route: 'Warehouse A - Port Terminal',
    status: 'Pending',
  },
  {
    id: 6,
    date: 'Oct 24, 2026',
    time: '14:32 GMT',
    batchId: '#BT - 98442',
    driver: 'Alex Jenkins',
    route: 'Warehouse A - Port Terminal',
    status: 'Pending',
  },
]

export const auditTrail = [
  {
    id: 1,
    title: 'Harvest Verified',
    date: 'Oct 19, 2023',
    location: 'South Farm, Block 7',
    lot: 'Lot #9221-A',
    status: 'completed',
  },
  {
    id: 2,
    title: 'Processing Compliance Met',
    date: 'Oct 21, 2023',
    location: 'Plant 2',
    detail: 'Temp Control Log Active',
    status: 'completed',
  },
  {
    id: 3,
    title: 'Transit Initialized',
    date: 'Oct 24, 2023',
    dispatch: 'Dispatch AG-TR-9982-K',
    driver: 'Marcus Chen',
    status: 'current',
  },
]

export const shipmentDetails = {
  farmer: {
    name: 'Sipho Mthembu',
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  pickup: {
    product: 'Maize (White)',
    quantity: '2.5 Tonnes',
    packing: '50kg bags x 50',
    status: 'GPRS Active',
  },
  stats: {
    estTime: '1h 45min',
    distance: '142km',
  },
  timeline: [
    { label: 'In Transit', status: 'current', active: true },
    { label: 'Arrived', status: 'pending' },
    { label: 'Picked up', status: 'completed' },
    { label: 'In Transit', status: 'pending' },
    { label: 'Delivered', status: 'pending' },
  ]
}

export const mockFarms = [
  { id: '1', name: 'Ogun Cocoa Coop-A', location: 'Abeokuta, Ogun', region: 'South West', hectares: 12.5, lat: 7.15, lng: 3.35 },
  { id: '2', name: 'Shagamu Palm Estates', location: 'Shagamu, Ogun', region: 'South West', hectares: 48.2, lat: 6.85, lng: 3.65 },
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
