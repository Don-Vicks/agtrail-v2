/**
 * Mock data for the Farmer dashboard.
 * Will be replaced by Orval-generated hooks once the API is connected.
 */

export const farmerStats = [
  {
    id: 'active-products',
    title: 'Active Products',
    value: '0',
    subtitle: 'Products tracked',
    description: 'Currently in production',
    icon: 'package',
    trend: 'neutral' as const,
  },
  {
    id: 'farm-operations',
    title: 'Farm Operations',
    value: '4',
    subtitle: 'Operations logged',
    description: 'Last 30 days',
    icon: 'activity',
    trend: 'up' as const,
  },
  {
    id: 'total-farms',
    title: 'Total Farms',
    value: '9',
    subtitle: 'Registered farms',
    description: 'Your farm locations',
    icon: 'map-pin',
    trend: 'neutral' as const,
  },
  {
    id: 'total-land-area',
    title: 'Total Land Area',
    value: '15111.2 ha',
    subtitle: 'Combined farmland',
    description: 'Total cultivated area',
    icon: 'maximize',
    trend: 'up' as const,
  },
  {
    id: 'blockchain-records',
    title: 'Blockchain Records',
    value: '0',
    subtitle: 'Validated on-chain',
    description: 'Verified transactions',
    icon: 'link',
    trend: 'neutral' as const,
  },
]

export const quickActions = [
  { label: 'View Products', icon: 'package', href: '/farmer/products' },
  { label: 'Manage Farms', icon: 'home', href: '/farmer/farms' },
  { label: 'Record Operation', icon: 'edit', href: '/farmer/operations/new' },
  {
    label: 'Compliance & Certification',
    icon: 'shield',
    href: '/farmer/certifications',
  },
  { label: 'Case Studies', icon: 'book-open', href: '/farmer/case-studies' },
]

export interface Farm {
  id: string
  name: string
  owner: string
  ownerInitials: string
  ownerColor: string
  location: string
  region: string
  hectares: number
}

export const farms: Farm[] = [
  {
    id: '1',
    name: 'Baba Beji Farms',
    owner: 'Olamide Olutekunbi',
    ownerInitials: 'OO',
    ownerColor: '#F57C00',
    location: '21, Yusuf Aboki Street, Abapka GRA, Oke Ado',
    region: 'Jiba',
    hectares: 0.0,
  },
  {
    id: '2',
    name: 'BABA FARM',
    owner: 'Olamide Olutekunbi',
    ownerInitials: 'OO',
    ownerColor: '#F57C00',
    location: '',
    region: 'kpsintroiointrv',
    hectares: 0.0,
  },
  {
    id: '3',
    name: 'Beta Agric Ventures',
    owner: 'Agrolinking Administrator',
    ownerInitials: 'AA',
    ownerColor: '#264d10',
    location: 'gjihjbdew',
    region: 'IITA Nigeria Office',
    hectares: 5274.7,
  },
  {
    id: '4',
    name: 'Daura Farms',
    owner: 'Agrolinking Administrator',
    ownerInitials: 'AA',
    ownerColor: '#264d10',
    location: 'Jibia, Katsina State, Nigeria',
    region: 'adbhashdasd',
    hectares: 100.9,
  },
  {
    id: '5',
    name: 'Daura Farms',
    owner: 'Agrolinking Administrator',
    ownerInitials: 'AA',
    ownerColor: '#264d10',
    location: 'Jibia, Katsina State, Nigeria',
    region: 'aijhjbdew',
    hectares: 100.5,
  },
  {
    id: '6',
    name: 'Hense Farm',
    owner: 'Agrolinking Administrator',
    ownerInitials: 'AA',
    ownerColor: '#264d10',
    location: 'sfdsgfhg,mc',
    region: 'Bagary Coconut Area',
    hectares: 7268.7,
  },
  {
    id: '7',
    name: 'IITA FCI4Afric Farm',
    owner: 'Agrolinking Administrator',
    ownerInitials: 'AA',
    ownerColor: '#264d10',
    location: 'IITA Nigeria Office',
    region: 'IITA Nigeria Office',
    hectares: 1833.5,
  },
  {
    id: '8',
    name: 'Jenny Farms and Co',
    owner: 'Agrolinking Administrator',
    ownerInitials: 'AA',
    ownerColor: '#264d10',
    location: 'Bagary Coconut Area',
    region: 'Bagary Coconut Area',
    hectares: 0.0,
  },
  {
    id: '9',
    name: 'Olamide & Co farms',
    owner: 'Olamide Olutekunbi',
    ownerInitials: 'OO',
    ownerColor: '#F57C00',
    location: 'Lagos express way',
    region: 'Lagos',
    hectares: 0.0,
  },
  {
    id: '10',
    name: 'Olamide Farms',
    owner: 'Olamide Olutekunbi',
    ownerInitials: 'OO',
    ownerColor: '#F57C00',
    location: '21, Yusuf Aboki Street, Abapka GRA,',
    region: 'Lagos',
    hectares: 0.0,
  },
  {
    id: '11',
    name: 'Olamide Farms',
    owner: 'Agrolinking Administrator',
    ownerInitials: 'AA',
    ownerColor: '#264d10',
    location: 'adbhashdasd',
    region: 'adbhashdasd',
    hectares: 4.7,
  },
  {
    id: '12',
    name: 'Olamide Farms Limited',
    owner: 'Agrolinking Administrator',
    ownerInitials: 'AA',
    ownerColor: '#264d10',
    location: 'Lagos',
    region: 'Lagos',
    hectares: 0.0,
  },
  {
    id: '13',
    name: "Shard's Farm",
    owner: 'Agrolinking Administrator',
    ownerInitials: 'AA',
    ownerColor: '#264d10',
    location: 'kpsintroiointrv',
    region: 'Jiba',
    hectares: 528.1,
  },
]

export const products = [
  {
    id: 'BATCH-8012ea66-777007408785',
    name: 'Maize',
    farm: 'IITA FCI4Afric Farm',
    status: 'planning' as const,
    hectares: 0.00036,
    createdDate: '2/13/2025',
  },
]

export const regions = [
  { name: 'Jiba', count: 2, color: '#E8F5E9' },
  { name: 'kpsintroiointrv', count: 1, color: '#E3F2FD' },
  { name: 'IITA Nigeria Office', count: 1, color: '#F3E5F5' },
  { name: 'adbhashdasd', count: 1, color: '#FFF3E0' },
  { name: 'aijhjbdew', count: 1, color: '#FCE4EC' },
  { name: 'Bagary Coconut Area', count: 1, color: '#E0F7FA' },
]

export const sidebarNavigation = {
  platform: [
    { label: 'Dashboard', icon: 'layout-dashboard', href: '/farmer' },
    { label: 'My Farms', icon: 'home', href: '/farmer/farms' },
    { label: 'Products', icon: 'package', href: '/farmer/products' },
  ],
  operations: [
    { label: 'Start Crop Cycle', icon: 'sprout', href: '/farmer/crop-cycle' },
    {
      label: 'Record Operation',
      icon: 'clipboard-list',
      href: '/farmer/operations/new',
    },
  ],
  certification: [
    {
      label: 'Upload Product Certification',
      icon: 'upload',
      href: '/farmer/certifications/product',
    },
    {
      label: 'Upload Farm Certification',
      icon: 'upload',
      href: '/farmer/certifications/farm',
    },
    {
      label: 'Certification Readiness',
      icon: 'check-circle',
      href: '/farmer/certifications/readiness',
    },
    {
      label: 'View Certifications',
      icon: 'award',
      href: '/farmer/certifications',
    },
  ],
  finance: [
    {
      label: 'Record Purchase',
      icon: 'receipt',
      href: '/farmer/purchases/new',
    },
    { label: 'Receivables', icon: 'banknote', href: '/farmer/receivables' },
  ],
  reports: [
    {
      label: 'Reports & Analytics',
      icon: 'bar-chart-3',
      href: '/farmer/reports',
    },
    { label: 'Settings', icon: 'settings', href: '/farmer/settings' },
  ],
}

export const currentUser = {
  name: 'Agrolinking Administrator',
  email: 'admin@agrolinking.com',
  initials: 'AA',
  role: 'Farmer' as const,
  walletAddress: '0B5UH1...IVMA',
}

// ─── Crop Cycles ──────────────────────────────────────────────────

export interface CropCycle {
  id: string
  productName: string
  variety: string
  farmId: string
  farmName: string
  farmLocation: string
  farmer: string
  farmerInitials: string
  farmerColor: string
  status: 'planning' | 'completed'
  plantedDate: string
  expectedHarvest: string
  area: number | string
  season: string
  daysToHarvest?: number
}

/** Crop cycles for a specific farm (Baba Beji Farms) */
export const farmCropCycles: CropCycle[] = [
  {
    id: 'cc-1',
    productName: 'Maize',
    variety: 'varity a',
    farmId: '1',
    farmName: 'Baba Beji Farms',
    farmLocation: '21, Yusuf Aboki Street, Abapka GRA, Oke Ado',
    farmer: 'Olamide Olutekunbi',
    farmerInitials: 'OO',
    farmerColor: '#F57C00',
    status: 'planning',
    plantedDate: '12/30/2025',
    expectedHarvest: '12/30/2025',
    area: '0.00956288156998043',
    season: 'dry_2025',
  },
  {
    id: 'cc-2',
    productName: 'Rice',
    variety: 'Local',
    farmId: '1',
    farmName: 'Baba Beji Farms',
    farmLocation: '21, Yusuf Aboki Street, Abapka GRA, Oke Ado',
    farmer: 'Olamide Olutekunbi',
    farmerInitials: 'OO',
    farmerColor: '#F57C00',
    status: 'completed',
    plantedDate: '11/25/2025',
    expectedHarvest: '11/30/2025',
    area: 2,
    season: 'dry_2025',
  },
]

/** All crop cycles (for the Record Operation listing page) */
export const allCropCycles: CropCycle[] = [
  {
    id: 'cc-10',
    productName: 'Maize',
    variety: 'Yellow Maize',
    farmId: '8',
    farmName: 'Jenny Farms and Co',
    farmLocation: 'Location not specified',
    farmer: 'Agrolinking Administrator',
    farmerInitials: 'AA',
    farmerColor: '#264d10',
    status: 'planning',
    plantedDate: '2/20/2026',
    expectedHarvest: '',
    area: '',
    season: '',
    daysToHarvest: 7,
  },
  {
    id: 'cc-11',
    productName: 'Maize',
    variety: 'ascv',
    farmId: '13',
    farmName: "Shard's Farm",
    farmLocation: 'Location not specified',
    farmer: 'Agrolinking Administrator',
    farmerInitials: 'AA',
    farmerColor: '#264d10',
    status: 'planning',
    plantedDate: '',
    expectedHarvest: '',
    area: '',
    season: '',
    daysToHarvest: 6,
  },
  {
    id: 'cc-12',
    productName: 'Bean',
    variety: 'Brown Beans',
    farmId: '7',
    farmName: 'IITA FCI4Afric Farm',
    farmLocation: 'Location not specified',
    farmer: 'Agrolinking Administrator',
    farmerInitials: 'AA',
    farmerColor: '#264d10',
    status: 'planning',
    plantedDate: '2/13/2026',
    expectedHarvest: '',
    area: 78.09,
    season: '',
    daysToHarvest: 147,
  },
  {
    id: 'cc-13',
    productName: 'Maize',
    variety: 'Vitamin A',
    farmId: '7',
    farmName: 'IITA FCI4Afric Farm',
    farmLocation: 'Location not specified',
    farmer: 'Agrolinking Administrator',
    farmerInitials: 'AA',
    farmerColor: '#264d10',
    status: 'completed',
    plantedDate: '',
    expectedHarvest: '',
    area: '',
    season: '',
  },
  {
    id: 'cc-14',
    productName: 'Tomatoes',
    variety: 'varity a',
    farmId: '3',
    farmName: 'Beta Agric Ventures',
    farmLocation: 'Location not specified',
    farmer: 'Agrolinking Administrator',
    farmerInitials: 'AA',
    farmerColor: '#264d10',
    status: 'planning',
    plantedDate: '1/20/2026',
    expectedHarvest: '',
    area: 229.82,
    season: '',
    daysToHarvest: 33,
  },
  {
    id: 'cc-15',
    productName: 'Beans',
    variety: 'varity a',
    farmId: '6',
    farmName: 'Hense Farm',
    farmLocation: 'Location not specified',
    farmer: 'Agrolinking Administrator',
    farmerInitials: 'AA',
    farmerColor: '#264d10',
    status: 'planning',
    plantedDate: '1/12/2026',
    expectedHarvest: '',
    area: 304.89,
    season: '',
  },
  {
    id: 'cc-16',
    productName: 'Maize',
    variety: 'Yellow Maize',
    farmId: '8',
    farmName: 'Jenny Farms and Co',
    farmLocation: 'Location not specified',
    farmer: 'Agrolinking Administrator',
    farmerInitials: 'AA',
    farmerColor: '#264d10',
    status: 'planning',
    plantedDate: '',
    expectedHarvest: '',
    area: '',
    season: '',
  },
  {
    id: 'cc-17',
    productName: 'Tomatoes',
    variety: 'Variety A1',
    farmId: '9',
    farmName: 'Olamide & Co farms',
    farmLocation: 'Location not specified',
    farmer: 'Olamide Olutekunbi',
    farmerInitials: 'OO',
    farmerColor: '#F57C00',
    status: 'planning',
    plantedDate: '12/6/2025',
    expectedHarvest: '',
    area: 1.87,
    season: '',
  },
  {
    id: 'cc-18',
    productName: 'Maize',
    variety: 'Variety A1',
    farmId: '2',
    farmName: 'BABA FARM',
    farmLocation: 'Location not specified',
    farmer: 'Olamide Olutekunbi',
    farmerInitials: 'OO',
    farmerColor: '#F57C00',
    status: 'planning',
    plantedDate: '12/2/2025',
    expectedHarvest: '',
    area: 0.2,
    season: '',
    daysToHarvest: 7,
  },
  ...farmCropCycles.map((c) => ({ ...c })),
]

// ─── Operation Types ──────────────────────────────────────────────

export interface OperationType {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

export const operationTypes: OperationType[] = [
  {
    id: 'land-prep',
    name: 'Land Preparation',
    description: 'Tillage, plowing, and soil preparation',
    icon: 'tractor',
    color: '#FFF3E0',
  },
  {
    id: 'planting',
    name: 'Planting',
    description: 'Seed sowing and transplanting',
    icon: 'sprout',
    color: '#E8F5E9',
  },
  {
    id: 'fertilizer',
    name: 'Fertilizer Application',
    description: 'Apply fertilizers and soil amendments',
    icon: 'flask-conical',
    color: '#FCE4EC',
  },
  {
    id: 'irrigation',
    name: 'Irrigation',
    description: 'Water application to crops',
    icon: 'droplets',
    color: '#E3F2FD',
  },
  {
    id: 'weeding',
    name: 'Weeding',
    description: 'Remove unwanted vegetation',
    icon: 'leaf',
    color: '#E8F5E9',
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    description: 'Pest and disease management',
    icon: 'bug-off',
    color: '#FFEBEE',
  },
  {
    id: 'pruning',
    name: 'Pruning',
    description: 'Trim and shape plants',
    icon: 'scissors',
    color: '#F3E5F5',
  },
  {
    id: 'harvesting',
    name: 'Harvesting',
    description: 'Crop collection and post-harvest',
    icon: 'wheat',
    color: '#FFF8E1',
  },
]
