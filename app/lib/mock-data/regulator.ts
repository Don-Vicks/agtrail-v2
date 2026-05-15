export const currentUser = {
  name: 'Tunde & Co',
  email: 'tunde@agtrail.com',
  initials: 'TC',
  role: 'Regulator' as const,
}

export const sidebarNavigation = [
  {
    title: 'Platform',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: '/regulator' },
      { id: 'regional-drilldown', label: 'Regional Drilldown', icon: 'map', href: '/regulator/regional-drilldown' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { id: 'violations', label: 'Violation Tracking', icon: 'alert-triangle', href: '/regulator/violations' },
      { id: 'inspection-report', label: 'Inspection Report', icon: 'clipboard-list', href: '/regulator/inspection-report' },
      { id: 'reports', label: 'Reports', icon: 'file-text', href: '/regulator/reports' },
    ],
  },
]

export const dashboardStats = [
  { label: 'Total Active Farmers', value: '1,248,502', trend: '+12%', sublabel: 'from last month', icon: 'users' },
  { label: 'EUDR Compliance %', value: '94.2%', trend: '+0.8%', icon: 'shield-check' },
  { label: 'Field Agent Approval Rate', value: '88.5%', trend: '-1.2%', icon: 'check-circle' },
  { label: 'Finalised Digital Passports', value: '892,104', trend: '-1.2%', icon: 'file-text' },
]

export const violationSummary = [
  { 
    id: 1, 
    title: 'Upcoming Harvest Alert', 
    description: "Harvest Approaching: Your 'Maize - Plot A' is expected to be ready in ~7 days.",
    type: 'warning'
  },
  { 
    id: 2, 
    title: 'Upcoming Harvest Alert', 
    description: "Harvest Approaching: Your 'Maize - Plot A' is expected to be ready in ~7 days.",
    type: 'info'
  },
  { 
    id: 3, 
    title: 'Upcoming Harvest Alert', 
    description: "Harvest Approaching: Your 'Maize - Plot A' is expected to be ready in ~7 days.",
    type: 'success'
  }
]

export const complianceByCommodity = [
  { name: 'Maize', percentage: 98.2 },
  { name: 'Maize', percentage: 98.2 },
  { name: 'Maize', percentage: 98.2 },
]

export const auditTrail = [
  { id: 1, title: 'Batch #SOY-4219 Confirmed Compliance', time: 'Today, 14:22', user: 'Agent: Sarah Miller' },
  { id: 2, title: 'New Farmer Registration Approved', time: 'Yesterday, 17:40', user: 'Regional Office North' },
  { id: 3, title: 'Violation Flagged: Boundary Overlap', time: 'Today, 11:05', user: 'Automated Satellite Detection' },
  { id: 4, title: 'Batch #SOY-4219 Confirmed Compliance', time: 'Today, 14:22', user: 'Agent: Sarah Miller' },
]

export const violationQueue = [
  {
    id: 'NC-9021-AF',
    certification: 'NAFDAC Export Certification',
    commodity: 'Cashew Nut Kernels (Grade 1)',
    auditor: 'ID-55829',
    auditorTitle: 'Senior Field Auditor',
    findings: 'Major documentation gap discovered in secondary processing facility sourcing logs.',
    escalated: 'Auditor flag requires manual site re-validation.',
    status: 'ACTION BLOCKED: OPEN FINDINGS',
    hash: '0x82...f9a1',
    submittedAt: '2h ago',
    type: 'NAFDAC',
    grade: 'EXPORT GRADE'
  },
  {
    id: 'NC-4402-FT',
    certification: 'Dual Certification',
    commodity: 'Organic Cocoa Beans (Premium Bulk)',
    auditor: 'ID-31124',
    auditorTitle: 'Sustainability Specialist',
    findings: 'All 42 nodes in the supply chain verified via digital twin. Fair trade premiums confirmed paid to 112 farmers.',
    status: 'READY FOR ENDORSEMENT',
    hash: '0x4a...d32e',
    submittedAt: '5h ago',
    type: 'ORGANIC',
    grade: 'FAIR TRADE'
  }
]

export const mockReports = [
  { id: 1, name: 'Cocoa Export Audit', batchId: '#NG-CC-8821', region: 'South West', date: 'Oct 24, 2024', compliance: 98, status: 'Finalized' },
  { id: 2, name: 'Palm Oil Sustainability', batchId: '#NG-PO-7743', region: 'South South', date: 'Oct 22, 2024', compliance: 72, status: 'Pending' },
  { id: 3, name: 'Cashew Nut Transit', batchId: '#NG-CN-9012', region: 'North Central', date: 'Oct 20, 2024', compliance: 45, status: 'Non-compliant' },
  { id: 4, name: 'Sesame Seed Ledger', batchId: '#NG-SS-1109', region: 'North West', date: 'Oct 18, 2024', compliance: 95, status: 'Finalized' },
]

export const mockFarms = [
  { id: '1', name: 'Ogun Cocoa Coop-A', location: 'Abeokuta, Ogun', region: 'South West', hectares: 12.5, lat: 7.15, lng: 3.35 },
  { id: '2', name: 'Shagamu Palm Estates', location: 'Shagamu, Ogun', region: 'South West', hectares: 48.2, lat: 6.85, lng: 3.65 },
  { id: '3', name: 'Ilaro Smallholder Hub', location: 'Ilaro, Ogun', region: 'South West', hectares: 2.1, lat: 6.89, lng: 3.01 },
]
