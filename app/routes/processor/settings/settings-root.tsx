import { useState } from 'react'
import { Breadcrumb } from '~/components/breadcrumb'
import type { Route } from './+types/settings-root'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Settings | Agtrail' },
    { name: 'description', content: 'Manage your account and application preferences' },
  ]
}

/* ─── Tabs Data ─── */
type TabType = 'Account' | 'Identity Verification' | 'Notifications'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('Account')

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Breadcrumb
        items={[
          {
            label: 'Dashboard',
            href: '/processor',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Settings' },
        ]}
      />
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 mb-6">Manage your account and application preferences</p>

        {/* Tabs */}
        <div className="inline-flex overflow-hidden rounded-lg bg-[#f1f4eb] p-1">
          {(['Account', 'Identity Verification', 'Notifications'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex h-9 items-center justify-center rounded-md px-4 text-sm font-semibold transition-colors ${activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {activeTab === 'Account' && <AccountSettingsTab />}
        {activeTab === 'Identity Verification' && <IdentityVerificationTab />}
        {activeTab === 'Notifications' && <NotificationsTab />}
      </div>
    </div>
  )
}

/* ─── 1. Account Settings ─── */
function AccountSettingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
        <p className="text-sm text-gray-500">Update your personal and organization details</p>
      </div>

      <form className="max-w-3xl space-y-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-900">Name</label>
          <input
            type="text"
            defaultValue="Agrolinking Administrator"
            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-900">Email</label>
          <input
            type="email"
            defaultValue="admin@agrolinking.com"
            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-900">Organization</label>
          <input
            type="text"
            defaultValue="Agrolinking Platform"
            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-900">Phone Number (Optional)</label>
          <input
            type="tel"
            placeholder="Your phone number"
            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div className="pt-2">
          <button
            type="button"
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#2e7d32] px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#1b5e20]"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

/* ─── 2. Identity Verification (KYC) ─── */
function IdentityVerificationTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Identity Verification (KYC)</h2>
        <p className="text-sm text-gray-500">Verify your identity to unlock all features and build trust with buyers</p>
      </div>

      {/* Stepper logic (visual only for mockup) */}
      <div className="flex w-full items-center justify-center pb-4 pt-2">
        <div className="flex items-center">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#2e7d32] text-sm font-bold text-white">1</div>
            <span className="mt-2 text-xs font-bold text-gray-900">Country</span>
          </div>
          {/* Line */}
          <div className="mb-6 h-px w-12 bg-gray-200"></div>

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-400">2</div>
            <span className="mt-2 text-xs font-medium text-gray-400">ID</span>
          </div>
          {/* Line */}
          <div className="mb-6 h-px w-12 bg-gray-200"></div>

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-400">3</div>
            <span className="mt-2 text-xs font-medium text-gray-400">Selfie</span>
          </div>
          {/* Line */}
          <div className="mb-6 h-px w-12 bg-gray-200"></div>

          {/* Step 4 */}
          <div className="flex flex-col items-center">
            <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-400">4</div>
            <span className="mt-2 text-xs font-medium text-gray-400">Verify</span>
          </div>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mx-auto flex max-w-sm flex-col items-center text-center">
        <div className="mb-4">
          <svg className="size-12 text-[#2e7d32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Identity Verification</h3>
        <p className="mt-1 text-sm text-gray-500">Select your country to get started</p>

        <div className="mt-6 w-full space-y-1.5 text-left">
          <label className="block text-sm font-bold text-gray-900 text-center sm:text-left">
            Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
              <option value="">Select your country</option>
              <option value="NG">Nigeria</option>
              <option value="KE">Kenya</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="size-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── 3. Notification Preferences ─── */
function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
        <p className="text-sm text-gray-500">Configure how and when you receive notifications and alerts</p>
      </div>

      {/* Notification Channels */}
      <div className="space-y-4 pt-2">
        <h3 className="font-bold text-gray-900">Notification Channels</h3>
        <div className="space-y-3">
          <ToggleCard
            title="Email Notifications"
            description="Receive notifications via email"
            defaultChecked={true}
          />
          <ToggleCard
            title="SMS Notifications"
            description="Coming soon - SMS notifications are not yet available"
            defaultChecked={false}
            disabled={true}
          />
        </div>
      </div>

      <div className="my-6 border-t border-gray-100"></div>

      {/* Alert Types */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900">Alert Types</h3>
        <div className="space-y-3">
          <ToggleCard title="Compliance Alerts" description="Get notified when products fail compliance checks" defaultChecked={true} />
          <ToggleCard title="Product Expiry Alerts" description="Get notified when products are approaching expiry" defaultChecked={true} />
          <ToggleCard title="Batch Completion Alerts" description="Get notified when processing batches are completed" defaultChecked={true} />
          <ToggleCard title="Certificate Expiry Alerts" description="Get notified when certifications are about to expire" defaultChecked={true} />
          <ToggleCard title="New Transfer Alerts" description="Get notified when you receive new product transfers" defaultChecked={true} />
          <ToggleCard title="KYC Status Alerts" description="Get notified about KYC verification status changes" defaultChecked={true} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-900">Expiry Alert Days</label>
          <input type="number" defaultValue="30" className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
          <p className="text-xs text-gray-500">Days before expiry to send alerts</p>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-900">Alert Email</label>
          <input type="email" defaultValue="admin@agrolinking.com" className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="button"
          className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#2e7d32] px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#1b5e20]"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save Notification Settings
        </button>
      </div>
    </div>
  )
}

function ToggleCard({
  title,
  description,
  defaultChecked,
  disabled = false
}: {
  title: string,
  description: string,
  defaultChecked: boolean,
  disabled?: boolean
}) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <div className={`flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${disabled ? 'opacity-60' : ''}`}>
      <div>
        <h4 className={`text-sm font-bold ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>{title}</h4>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
      {/* Toggle button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#2e7d32]' : 'bg-gray-200'
          }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'
            }`}
        />
      </button>
    </div>
  )
}
