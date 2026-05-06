export interface FieldAgentNavItem {
  id: string
  label: string
  href: string
  icon: 'layout-dashboard' | 'home' | 'clipboard-list' | 'sprout' | 'send'
}

export interface FieldAgentNavGroup {
  title: string
  items: FieldAgentNavItem[]
}

export const fieldAgentSidebarNavigation: FieldAgentNavGroup[] = [
  {
    title: 'Platform',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/field-agent',
        icon: 'layout-dashboard',
      },
      {
        id: 'farms',
        label: 'Farm Assets',
        href: '/field-agent/farms',
        icon: 'home',
      },
      {
        id: 'record-observation',
        label: 'Record Observation',
        href: '/field-agent/record-observation',
        icon: 'clipboard-list',
      },
      {
        id: 'harvest-approval',
        label: 'Harvest Approval',
        href: '/field-agent/harvest-approval',
        icon: 'shield-check',
      },
    ],
  },
]
