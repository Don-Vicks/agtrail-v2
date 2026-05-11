export const adminNavigation = [
  {
    title: 'Platform Control',
    items: [
      { id: 'dashboard', label: 'Admin Dashboard', icon: 'layout-dashboard', href: '/admin' },
      { id: 'users', label: 'User Management', icon: 'users', href: '/admin/users' },
      { id: 'tenants', label: 'Tenant Control', icon: 'home', href: '/admin/tenants' },
    ],
  },
  {
    title: 'Governance',
    items: [
      { id: 'compliance', label: 'Global Compliance', icon: 'shield-check', href: '/admin/compliance' },
      { id: 'audit', label: 'Audit Logs', icon: 'file-text', href: '/admin/audit' },
    ],
  },
  {
    title: 'System',
    items: [
      { id: 'settings', label: 'System Settings', icon: 'settings', href: '/admin/settings' },
    ],
  },
]
