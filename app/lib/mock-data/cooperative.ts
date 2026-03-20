export const currentUser = {
  name: 'Agrolinking Administrator',
  email: 'admin@agrolinking.com',
  initials: 'AA',
  role: 'cooperative',
}

export const sidebarNavigation = [
  {
    title: 'Platform',
    items: [
      { id: 'dashboard', label: 'Dashboard Overview', href: '/cooperative', icon: 'layout-dashboard' },
      { id: 'farmers', label: 'Farmers', href: '/cooperative/farmers', icon: 'users' },
      { id: 'farms', label: 'Farms', href: '/cooperative/farms', icon: 'map' },
      { id: 'apiaries', label: 'Apiaries', href: '/cooperative/apiaries', icon: 'hexagon' },
      { id: 'products', label: 'Products', href: '/cooperative/products', icon: 'package' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { id: 'start-crop', label: 'Start Crop Cycle', href: '/cooperative/operations/start', icon: 'refresh-cw' },
      { id: 'record-op', label: 'Record Operation', href: '/cooperative/operations/record', icon: 'file-text' },
      { id: 'honey-batches', label: 'Raw Honey Batches', href: '/cooperative/operations/honey', icon: 'archive' },
    ],
  },
  {
    title: 'Certification',
    items: [
      { id: 'cert-product', label: 'Upload Product Certification', href: '/cooperative/certifications/product', icon: 'award' },
      { id: 'cert-farm', label: 'Upload Farm Certification', href: '/cooperative/certifications/farm', icon: 'file-badge' },
      { id: 'cert-ready', label: 'Certification Readiness', href: '/cooperative/certifications/readiness', icon: 'check-circle' },
      { id: 'cert-view', label: 'View Certifications', href: '/cooperative/certifications/view', icon: 'eye' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { id: 'finance-purchase', label: 'Record Purchase', href: '/cooperative/finance/record-purchase', icon: 'dollar-sign' },
      { id: 'finance-receivables', label: 'Receivables', href: '/cooperative/finance/receivables', icon: 'credit-card' },
    ],
  },
]

export const cooperativeDashboardStats = {
  totalMembers: 2,
  totalFarms: 7,
  totalArea: 2963.6,
  trackedProducts: 7,
  totalHarvests: 9,
}

export const farmPerformanceSummary = [
  { id: 'BATCH-22440715-1763994368948', product: 'Rice', farmName: 'Baba Beji Farms', farmer: 'Olamide Olutekunbi', status: 'planting', yield: '0.00', currentYield: '0.00', hectares: 0.00160, compliance: 'Medium' },
  { id: 'BATCH-22440715-1764306013258', product: 'Rice', farmName: 'Baba Beji Farms', farmer: 'Olamide Olutekunbi', status: 'planting', yield: '0.00', currentYield: '0.00', hectares: 0.00160, compliance: 'Medium' },
  { id: 'BATCH-22440715-1764603213504', product: 'Rice', farmName: 'Baba Beji Farms', farmer: 'Olamide Olutekunbi', status: 'planting', yield: '0.00', currentYield: '0.00', hectares: 0.00160, compliance: 'Medium' },
  { id: 'BATCH-1768228411241', product: 'Ginger', farmName: 'BABA FARM', farmer: 'Olamide Olutekunbi', status: 'planting', yield: '0.00', currentYield: '0.00', hectares: 0.00000, compliance: 'Medium' },
  { id: 'BATCH-1738013823058', product: 'Sesame', farmName: 'Baba Beji Farms', farmer: 'Olamide Olutekunbi', status: 'planting', yield: '0.00', currentYield: '0.00', hectares: 0.00196, compliance: 'Medium' },
  { id: 'BATCH-1738812685837', product: 'Maize', farmName: 'Olamide Farms', farmer: 'Olamide Olutekunbi', status: 'planting', yield: '0.00', currentYield: '0.00', hectares: 0.00000, compliance: 'Medium' },
  { id: 'BATCH-1738832271815', product: 'Maize', farmName: 'Olamide Farms', farmer: 'Olamide Olutekunbi', status: 'planting', yield: '0.00', currentYield: '0.00', hectares: 0.00000, compliance: 'Medium' },
  { id: 'POTATO-2026-001', product: 'Organic Sweet Potato', farmName: 'N/A', farmer: 'Olamide Olutekunbi', status: 'planting', yield: '0.00', currentYield: '0.00', hectares: 0.00000, compliance: 'Medium' },
  { id: 'CASSAVA-2026-001', product: 'Heritage Cassava', farmName: 'N/A', farmer: 'Olamide Olutekunbi', status: 'planting', yield: '0.00', currentYield: '0.00', hectares: 0.00000, compliance: 'Medium' },
  { id: 'MAIZE-2026-001', product: 'Premium Vitamin A Maize', farmName: 'N/A', farmer: 'Olamide Olutekunbi', status: 'planting', yield: '0.00', currentYield: '0.00', hectares: 0.00000, compliance: 'Medium' },
]

export const cooperativeFarms = [
  { id: 'farm1', name: 'Baba Beji Farms', owner: 'Olamide Olutekunbi', location: '21, Yusuf Aboki Street, Abapka GRA, Oke Ado', hectares: 0.0, region: 'Zango Kataf' },
  { id: 'farm2', name: 'BABA FARM', owner: 'Olamide Olutekunbi', location: 'Zango Kataf', hectares: 0.0, region: 'Zango Kataf' },
  { id: 'farm3', name: 'Beta Agric Ventures', owner: 'Agrolinking Administrator', location: 'gjhjbdew', hectares: 5274.7, region: 'Local Govt Area' },
  { id: 'farm4', name: 'Daura Farms', owner: 'Agrolinking Administrator', location: 'Jibia, Katsina State, Nigeria', hectares: 100.9, region: 'Jibia' },
  { id: 'farm5', name: 'Daura Farms', owner: 'Agrolinking Administrator', location: 'Jibia, Katsina State, Nigeria', hectares: 100.5, region: 'Jibia' },
  { id: 'farm6', name: 'Expan Farms', owner: 'Olamide Olutekunbi', location: 'hgahdkl', hectares: 2963.5, region: 'Garki' },
  { id: 'farm7', name: 'Hense Farm', owner: 'Agrolinking Administrator', location: 'sfdsgfhg,mc', hectares: 7268.7, region: 'Sokoto' },
  { id: 'farm8', name: 'IITA FCI4Afric Farm', owner: 'Agrolinking Administrator', location: 'IITA Nigeria Office', hectares: 1833.5, region: 'Ibadan' },
  { id: 'farm9', name: 'Jenny Farms and Co', owner: 'Agrolinking Administrator', location: 'Bagary Coconut Area', hectares: 0.0, region: 'Lagos' },
  { id: 'farm10', name: 'Ola', owner: 'Olamide Olutekunbi', location: 'UYeruhrwuwair', hectares: 0.1, region: 'Zango Kataf' },
  { id: 'farm11', name: 'Olamide & Co farms', owner: 'Olamide Olutekunbi', location: 'Lagos express way', hectares: 0.0, region: 'Lagos' },
  { id: 'farm12', name: 'Olamide Farm', owner: 'Olamide Olutekunbi', location: 'Kakuri Textile Company', hectares: 0.0, region: 'Kaduna' },
]

export const cooperativeFarmers = [
  { id: 'f1', name: 'Me sef', identifier: 'adasd, MDs', phone: '+2348232313123', avatar: '/avatars/1.png' },
  { id: 'f2', name: 'Olamide Olutekunbi', identifier: '', phone: '', avatar: '/avatars/2.png' },
]

export const quickActions = [
  { id: 'tasks', label: 'Receive Harvest Batch', icon: 'package', href: '/cooperative/operations/record' },
  { id: 'record', label: 'Record Operation', icon: 'clipboard-list', href: '/cooperative/operations/record' },
  { id: 'qa', label: 'QA / QC Test', icon: 'test-tube', href: '/cooperative/operations/record' }
]

export const mapFarms = [
  { id: '1', name: 'Baba Beji Farms', location: 'Oke Ado', region: 'Zango Kataf', hectares: 0.0, lat: 9.9, lng: 8.3 },
  { id: '2', name: 'BABA FARM', location: 'Zango Kataf', region: 'Zango Kataf', hectares: 0.0, lat: 10.1, lng: 8.0 },
  { id: '3', name: 'Expan Farms', location: 'Local Area', region: 'Garki', hectares: 2963.5, lat: 9.0, lng: 7.4 },
  { id: '4', name: 'Hense Farm', location: 'Sokoto City', region: 'Sokoto', hectares: 7268.7, lat: 13.0, lng: 5.2 },
  { id: '5', name: 'IITA FCI4Afric Farm', location: 'Ibadan', region: 'Ibadan', hectares: 1833.5, lat: 7.3, lng: 3.8 },
  { id: '6', name: 'Beta Agric Ventures', location: 'Unknown', region: 'Lagos', hectares: 5274.7, lat: 6.5, lng: 3.3 },
  { id: '7', name: 'Daura Farms', location: 'Jibia', region: 'Jibia', hectares: 100.9, lat: 13.0, lng: 7.2 },
]
