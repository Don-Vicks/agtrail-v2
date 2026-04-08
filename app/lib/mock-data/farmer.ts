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
  lat: number
  lng: number
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
    lat: 13.0833,
    lng: 7.2167,
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
    lat: 12.9833,
    lng: 7.6167,
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
    lat: 7.4167,
    lng: 3.9167,
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
    lat: 13.0833,
    lng: 7.2167,
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
    lat: 13.0833,
    lng: 7.2167,
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
    lat: 12.2833,
    lng: 4.2833,
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
    lat: 7.4167,
    lng: 3.9167,
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
    lat: 12.2833,
    lng: 4.2833,
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
    lat: 6.5244,
    lng: 3.3792,
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
    lat: 6.5244,
    lng: 3.3792,
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
    lat: 9.0765,
    lng: 7.3986,
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
    lat: 6.5244,
    lng: 3.3792,
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
    lat: 13.0833,
    lng: 7.2167,
  },
]

export interface ProductJourneyNode {
  title: string
  description: string
  date: string
  time: string
  details: {
    label: string
    value: string
  }[]
}

export interface ProductTestResult {
  title: string
  description: string
  status: 'passed' | 'failed' | 'pending'
}

export interface Product {
  id: string
  batchId: string
  name: string
  farm: string
  status: 'planning' | 'active' | 'completed'
  hectares: number
  location: string
  plantedDate: string
  createdDate?: string
  image: string
  metrics: {
    sustainabilityScore: number
    carbonEquivalents: number
    litersUsed: number
    certifications: number
    qualityScore: number
    complianceRate: number
  }
  journey: ProductJourneyNode[]
  tests: ProductTestResult[]
  standards: ProductTestResult[]
}

export const products: Product[] = [
  {
    id: 'p-1',
    batchId: 'BATCH-8022dd4d-1770974808765',
    name: 'Maize',
    farm: 'IITA FCI4Afric Farm',
    location: 'IITA Nigeria Office',
    status: 'completed',
    hectares: 0.00036,
    plantedDate: '3rd, January 2020',
    // Using a placeholder that will be styled appropriately
    image: 'tomatoes',
    metrics: {
      sustainabilityScore: 56,
      carbonEquivalents: 0.0,
      litersUsed: 0,
      certifications: 2,
      qualityScore: 56,
      complianceRate: 56,
    },
    journey: [
      {
        title: 'Land Preparation',
        description: 'Clearing and preparing the land for farming',
        date: '20th September 2024',
        time: '10:00 AM',
        details: [
          { label: 'Primary Tillage', value: 'Not applicable' },
          { label: 'Conservation Structures', value: 'Contour Ploughing' },
          { label: 'Preparation Techniques', value: 'Harrowing' },
          { label: 'Clearing Method', value: 'Manual Clearing' },
          { label: 'Equipment', value: 'Tractor' },
        ],
      },
      {
        title: 'Planting',
        description: 'Clearing and preparing the land for farming',
        date: '20th September 2024',
        time: '10:00 AM',
        details: [
          { label: 'Primary Tillage', value: 'Not applicable' },
          { label: 'Conservation Structures', value: 'Contour Ploughing' },
          { label: 'Preparation Techniques', value: 'Harrowing' },
          { label: 'Clearing Method', value: 'Manual Clearing' },
          { label: 'Equipment', value: 'Tractor' },
        ],
      },
      {
        title: 'Certification Status',
        description: 'Clearing and preparing the land for farming',
        date: '20th September 2024',
        time: '10:00 AM',
        details: [
          { label: 'Primary Tillage', value: 'Not applicable' },
          { label: 'Conservation Structures', value: 'Contour Ploughing' },
          { label: 'Preparation Techniques', value: 'Harrowing' },
          { label: 'Clearing Method', value: 'Manual Clearing' },
          { label: 'Equipment', value: 'Tractor' },
        ],
      },
    ],
    tests: [
      {
        title: 'Water Quality Test',
        description: 'Carbon, water, biodiversity, and soil health',
        status: 'passed',
      },
      {
        title: 'Soil Health Test',
        description: 'Carbon, water, biodiversity, and soil health',
        status: 'passed',
      },
      {
        title: 'Pesticide Residue Test',
        description: 'Carbon, water, biodiversity, and soil health',
        status: 'passed',
      },
    ],
    standards: [
      {
        title: 'Water Quality Test',
        description: 'Carbon, water, biodiversity, and soil health',
        status: 'passed',
      },
      {
        title: 'Soil Health Test',
        description: 'Carbon, water, biodiversity, and soil health',
        status: 'passed',
      },
      {
        title: 'Pesticide Residue Test',
        description: 'Carbon, water, biodiversity, and soil health',
        status: 'passed',
      },
    ],
  },
  {
    id: 'p-2',
    batchId: 'BATCH-224ef719-1765304456948',
    name: 'Rice',
    farm: 'Baba Beji Farms',
    location: '21, Yusuf Aboki Street, Abapka GRA, Oke Ado',
    status: 'active',
    hectares: 12.4,
    plantedDate: '15th, March 2024',
    image: 'rice',
    metrics: {
      sustainabilityScore: 78,
      carbonEquivalents: 12.4,
      litersUsed: 4500,
      certifications: 1,
      qualityScore: 82,
      complianceRate: 90,
    },
    journey: [],
    tests: [],
    standards: [],
  },
  {
    id: 'p-3',
    batchId: 'BATCH-224ef719-1764306610258',
    name: 'Rice',
    farm: 'Baba Beji Farms',
    location: '21, Yusuf Aboki Street, Abapka GRA, Oke Ado',
    status: 'completed',
    hectares: 14.1,
    plantedDate: '10th, February 2024',
    image: 'rice',
    metrics: {
      sustainabilityScore: 81,
      carbonEquivalents: 11.2,
      litersUsed: 4200,
      certifications: 2,
      qualityScore: 85,
      complianceRate: 95,
    },
    journey: [],
    tests: [],
    standards: [],
  },
  {
    id: 'p-4',
    batchId: 'BATCH-224ef719-1764062213694',
    name: 'Rice',
    farm: 'Baba Beji Farms',
    location: '21, Yusuf Aboki Street, Abapka GRA, Oke Ado',
    status: 'completed',
    hectares: 10.5,
    plantedDate: '5th, January 2024',
    image: 'rice',
    metrics: {
      sustainabilityScore: 75,
      carbonEquivalents: 15.0,
      litersUsed: 5000,
      certifications: 1,
      qualityScore: 79,
      complianceRate: 88,
    },
    journey: [],
    tests: [],
    standards: [],
  },
  {
    id: 'p-5',
    batchId: 'BATCH-1762339741241',
    name: 'Ginger',
    farm: 'BABA FARM',
    location: 'Zango Kataf',
    status: 'active',
    hectares: 5.2,
    plantedDate: '22nd, April 2024',
    image: 'ginger',
    metrics: {
      sustainabilityScore: 68,
      carbonEquivalents: 5.5,
      litersUsed: 1200,
      certifications: 0,
      qualityScore: 72,
      complianceRate: 80,
    },
    journey: [],
    tests: [],
    standards: [],
  },
  {
    id: 'p-6',
    batchId: 'BATCH-1759875835858',
    name: 'Sesame',
    farm: 'Baba Beji Farms',
    location: '21, Yusuf Aboki Street, Abapka GRA, Oke Ado',
    status: 'active',
    hectares: 8.0,
    plantedDate: '18th, May 2024',
    image: 'sesame',
    metrics: {
      sustainabilityScore: 85,
      carbonEquivalents: 4.2,
      litersUsed: 800,
      certifications: 1,
      qualityScore: 88,
      complianceRate: 92,
    },
    journey: [],
    tests: [],
    standards: [],
  },
  {
    id: 'p-7',
    batchId: 'BATCH-1756815685637',
    name: 'Maize',
    farm: 'Olamide Farms',
    location: '21, Yusuf Aboki Street, Abapka GRA,',
    status: 'completed',
    hectares: 22.5,
    plantedDate: '10th, June 2023',
    image: 'maize',
    metrics: {
      sustainabilityScore: 72,
      carbonEquivalents: 20.1,
      litersUsed: 6000,
      certifications: 1,
      qualityScore: 75,
      complianceRate: 85,
    },
    journey: [],
    tests: [],
    standards: [],
  },
  {
    id: 'p-8',
    batchId: 'BATCH-1754932211915',
    name: 'Maize',
    farm: 'Olamide Farms',
    location: '21, Yusuf Aboki Street, Abapka GRA,',
    status: 'completed',
    hectares: 25.0,
    plantedDate: '15th, May 2023',
    image: 'maize',
    metrics: {
      sustainabilityScore: 70,
      carbonEquivalents: 22.5,
      litersUsed: 6500,
      certifications: 1,
      qualityScore: 73,
      complianceRate: 82,
    },
    journey: [],
    tests: [],
    standards: [],
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
    { label: 'Inventory', icon: 'jar', href: '/farmer/inventory' },
    { label: 'Personnel', icon: 'clipboard-list', href: '/farmer/personnel' },
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
      label: 'Product Certification',
      icon: 'upload',
      href: '/farmer/certifications/product',
    },
    {
      label: 'Farm Certification',
      icon: 'upload',
      href: '/farmer/certifications/farm',
    },
    // {
    //   label: 'Certification Readiness',
    //   icon: 'check-circle',
    //   href: '/farmer/certifications/readiness',
    // },
    {
      label: 'View Certifications',
      icon: 'award',
      href: '/farmer/certifications/view',
    },
  ],
  finance: [
    {
      label: 'Record Purchase',
      icon: 'receipt',
      href: '/farmer/finance/record-purchase',
    },
    {
      label: 'Receivables',
      icon: 'banknote',
      href: '/farmer/finance/receivables',
    },
  ],
  reports: [
    {
      label: 'Reports & Analytics',
      icon: 'bar-chart-3',
      href: '/farmer/reports',
    },
    {
      label: 'Compliance Analysis',
      icon: 'shield-check',
      href: '/farmer/compliance',
    },
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
    id: 'cc-20',
    productName: 'Ginger',
    variety: 'mmmf',
    farmId: '1',
    farmName: 'Baba Beji Farms',
    farmLocation: 'Location not specified',
    farmer: 'Olamide Olutekunbi',
    farmerInitials: 'OO',
    farmerColor: '#F57C00',
    status: 'planning',
    plantedDate: '3/5/2026',
    expectedHarvest: '',
    area: '0.00956288156998043',
    season: '',
    daysToHarvest: 26,
  },
  {
    id: 'cc-21',
    productName: 'Cassava',
    variety: '419',
    farmId: '10',
    farmName: 'Titilayo Farm',
    farmLocation: 'Location not specified',
    farmer: 'Agrolinking Administrator',
    farmerInitials: 'AA',
    farmerColor: '#264d10',
    status: 'planning',
    plantedDate: '3/2/2026',
    expectedHarvest: '',
    area: 123.67,
    season: '',
    daysToHarvest: 301,
  },
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
  category: 'pre-harvest' | 'post-harvest'
}

export const operationTypes: OperationType[] = [
  // --- Pre-Harvest ---
  {
    id: 'land-prep',
    name: 'Land Preparation',
    description: 'Tillage, plowing, and soil preparation',
    icon: 'tractor',
    color: '#FFF3E0',
    category: 'pre-harvest',
  },
  {
    id: 'planting',
    name: 'Planting',
    description: 'Seed sowing and transplanting',
    icon: 'sprout',
    color: '#E8F5E9',
    category: 'pre-harvest',
  },
  {
    id: 'fertilizer',
    name: 'Fertilizer Application',
    description: 'Apply fertilizers and soil amendments',
    icon: 'flask-conical',
    color: '#FCE4EC',
    category: 'pre-harvest',
  },
  {
    id: 'irrigation',
    name: 'Irrigation',
    description: 'Water application to crops',
    icon: 'droplets',
    color: '#E3F2FD',
    category: 'pre-harvest',
  },
  {
    id: 'weeding',
    name: 'Weeding',
    description: 'Remove unwanted vegetation',
    icon: 'leaf',
    color: '#E8F5E9',
    category: 'pre-harvest',
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    description: 'Pest and disease management',
    icon: 'bug-off',
    color: '#FFEBEE',
    category: 'pre-harvest',
  },
  {
    id: 'pruning',
    name: 'Pruning',
    description: 'Trim and shape plants',
    icon: 'scissors',
    color: '#F3E5F5',
    category: 'pre-harvest',
  },
  {
    id: 'harvesting',
    name: 'Harvesting',
    description: 'Crop collection and post-harvest',
    icon: 'wheat',
    color: '#FFF8E1',
    category: 'pre-harvest',
  },
  // --- Post-Harvest ---
  {
    id: 'sorting',
    name: 'Sorting & Grading',
    description: 'Separating crop by quality and size',
    icon: 'filter',
    color: '#E3F2FD',
    category: 'post-harvest',
  },
  {
    id: 'drying',
    name: 'Cleaning & Drying',
    description: 'Washing crop and removing moisture',
    icon: 'sun',
    color: '#FFF3E0',
    category: 'post-harvest',
  },
  {
    id: 'processing',
    name: 'Processing',
    description: 'Milling, threshing, or secondary processing',
    icon: 'factory',
    color: '#FCE4EC',
    category: 'post-harvest',
  },
  {
    id: 'packaging',
    name: 'Packaging',
    description: 'Bagging, sealing, and labeling',
    icon: 'package',
    color: '#E8F5E9',
    category: 'post-harvest',
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Moving packed produce to inventory',
    icon: 'warehouse',
    color: '#F3E5F5',
    category: 'post-harvest',
  },
]
