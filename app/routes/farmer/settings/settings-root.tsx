import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { DojahWidget } from '~/components/dojah-widget'
import { PageHeader } from '~/components/page-header'
import { useAuth } from '~/context/auth-context'
import {
  useGetOrganizationsSettings,
  usePutOrganizationsSettings,
} from '~/lib/api/generated/organizations-settings/organizations-settings'
import {
  useGetUsersProfile,
  usePostUsersKyc,
  usePutUsersProfile,
} from '~/lib/api/generated/users/users'
import type { Route } from './+types/settings-root'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Settings | Agtrail' },
    {
      name: 'description',
      content: 'Manage your account and application preferences',
    },
  ]
}

/* ─── Tabs Data ─── */
type TabType = 'Account' | 'Identity Verification' | 'Notifications'

export default function SettingsPage() {
  const [searchParams] = useSearchParams()

  const tabFromQuery = useMemo<TabType>(() => {
    const tab = (searchParams.get('tab') || '').toLowerCase()
    if (tab === 'kyc' || tab === 'identity' || tab === 'verification') {
      return 'Identity Verification'
    }
    if (tab === 'notifications') {
      return 'Notifications'
    }
    return 'Account'
  }, [searchParams])

  const [activeTab, setActiveTab] = useState<TabType>(tabFromQuery)

  useEffect(() => {
    setActiveTab(tabFromQuery)
  }, [tabFromQuery])

  return (
    <div className='space-y-6 pb-10'>
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/farmer',
            icon: (
              <svg
                className='size-4 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={1.5}
              >
                <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
                <line x1='9' y1='3' x2='9' y2='21' />
              </svg>
            ),
          },
          { label: 'Settings' },
        ]}
      />
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-[#2e7d32]'>Settings</h1>
        <p className='mt-1 text-sm text-gray-500 mb-6'>
          Manage your account and application preferences
        </p>

        {/* Tabs */}
        <div className='inline-flex overflow-hidden rounded-lg bg-[#f1f4eb] p-1'>
          {(
            ['Account', 'Identity Verification', 'Notifications'] as TabType[]
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex h-9 items-center justify-center rounded-md px-4 text-sm font-semibold transition-colors ${
                activeTab === tab
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
      <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
        {activeTab === 'Account' && <AccountSettingsTab />}
        {activeTab === 'Identity Verification' && <IdentityVerificationTab />}
        {activeTab === 'Notifications' && <NotificationsTab />}
      </div>
    </div>
  )
}

/* ─── 1. Account Settings ─── */
function AccountSettingsTab() {
  const { user } = useAuth()
  const {
    data: profileResp,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useGetUsersProfile()
  const {
    data: orgResp,
    isLoading: isLoadingOrg,
    refetch: refetchOrg,
  } = useGetOrganizationsSettings()

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    usePutUsersProfile({
      mutation: {
        onSuccess: () => {
          toast.success('Profile updated successfully')
          refetchProfile()
        },
        onError: (err: unknown) => {
          toast.error('Failed to update profile')
          console.error(err)
        },
      },
    })

  const { mutate: updateOrg, isPending: isUpdatingOrg } =
    usePutOrganizationsSettings({
      mutation: {
        onSuccess: () => {
          toast.success('Organization updated successfully')
          refetchOrg()
        },
        onError: (err: unknown) => {
          toast.error('Failed to update organization')
          console.error(err)
        },
      },
    })

  const profile = profileResp?.data?.user as any
  const org = orgResp?.data?.data as any

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const name = String(formData.get('name') ?? '').trim()
    const phoneNumber = String(formData.get('phoneNumber') ?? '').trim()
    const orgName = String(formData.get('organization') ?? '').trim()

    if (!name) {
      toast.error('Name is required.')
      return
    }
    const phoneDigits = phoneNumber.replace(/\D/g, '')
    if (phoneNumber && phoneDigits.length < 7) {
      toast.error('Phone number looks too short.')
      return
    }

    updateProfile({ data: { name, phoneNumber: phoneNumber || undefined } })
    updateOrg({ data: { name: orgName } })
  }

  if (isLoadingProfile || isLoadingOrg) {
    return (
      <div className='py-10 text-center text-sm text-gray-500'>
        Loading settings...
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-bold text-[#2e7d32]'>Account Settings</h2>
        <p className='text-sm text-gray-500'>
          Update your personal and organization details
        </p>
      </div>

      <form onSubmit={handleSubmit} className='max-w-3xl space-y-5'>
        <div className='space-y-1.5'>
          <label className='block text-sm font-bold text-gray-900'>Name</label>
          <input
            type='text'
            name='name'
            defaultValue={profile?.name || ''}
            className='h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
            required
          />
        </div>

        <div className='space-y-1.5 opacity-60'>
          <label className='block text-sm font-bold text-gray-900'>Email</label>
          <input
            type='email'
            defaultValue={profile?.email || org?.email || user?.email || ''}
            readOnly
            className='h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 focus:outline-none cursor-not-allowed'
          />
          <p className='text-[10px] text-gray-500'>
            Email cannot be changed directly due to security policies.
          </p>
        </div>

        <div className='space-y-1.5'>
          <label className='block text-sm font-bold text-gray-900'>
            Organization
          </label>
          <input
            type='text'
            name='organization'
            defaultValue={org?.name || ''}
            className='h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
          />
        </div>

        <div className='space-y-1.5'>
          <label className='block text-sm font-bold text-gray-900'>
            Phone Number (Optional)
          </label>
          <input
            type='tel'
            name='phoneNumber'
            placeholder='Your phone number'
            defaultValue={profile?.phoneNumber || ''}
            className='h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
          />
        </div>

        <div className='pt-2'>
          <button
            type='submit'
            disabled={isUpdatingProfile || isUpdatingOrg}
            className='flex h-10 items-center justify-center gap-2 rounded-lg bg-[#2e7d32] px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#1b5e20] disabled:opacity-50'
          >
            {isUpdatingProfile || isUpdatingOrg ? (
              'Saving...'
            ) : (
              <>
                <svg
                  className='size-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4'
                  />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ─── 2. Identity Verification (KYC) ─── */
function IdentityVerificationTab() {
  const { user } = useAuth()
  const [shouldLaunchKyc, setShouldLaunchKyc] = useState(false)
  const [kycLaunchCount, setKycLaunchCount] = useState(0)
  const { data: profileResp } = useGetUsersProfile()
  const profileUser = profileResp?.data?.user as any
  const [kycErrorDetail, setKycErrorDetail] = useState<string>('')

  const { mutate: linkKyc } = usePostUsersKyc({
    mutation: {
      onSuccess: () => {
        toast.success('KYC safely recorded and synced to our backbone.')
      },
      onError: () => {
        toast.error('Failed to sync KYC status globally.')
      },
    },
  })

  const syncKyc = (data: any) => {
    setShouldLaunchKyc(false)
    toast.success('Identity verified successfully by Dojah!')
    linkKyc({
      data: {
        bvnVerified: true,
        ninVerified: true,
        documentUrl: data?.result?.document?.url || '',
      },
    })
  }

  const response = (type: string, data: any) => {
    console.log('Dojah event:', type, data)
    if (type === 'success') {
      setKycErrorDetail('')
      syncKyc(data)
      return
    }

    if (type === 'error') {
      setShouldLaunchKyc(false)
      const reason =
        data?.message ||
        data?.response?.message ||
        data?.error?.message ||
        data?.reason ||
        'Identity verification failed. Please try again.'
      const deviceInfo = data?.deviceInfo
      const looksLikeDeviceGuardBlock =
        typeof reason === 'string' && reason.toLowerCase().includes('verification failed')
      if (looksLikeDeviceGuardBlock) {
        const detail = deviceInfo
          ? `Dojah DeviceGuard blocked this session. Complete KYC on one device/browser only. Device info: ${deviceInfo}`
          : 'Dojah DeviceGuard blocked this session. Complete KYC on one device/browser only.'
        setKycErrorDetail(detail)
        toast.error('Verification blocked by Dojah security checks. Use same device/browser and retry.')
      } else {
        setKycErrorDetail(String(reason))
        toast.error(reason)
      }
      return
    }

    if (type === 'close') {
      // Some Dojah flows close the widget after a completed check.
      if (data?.status === 'success' || data?.verification_status === 'success') {
        setKycErrorDetail('')
        syncKyc(data)
        return
      }
      setShouldLaunchKyc(false)
      console.log('Dojah widget closed.')
    }
  }

  // Note: These must be populated in production .env
  const appID = import.meta.env.VITE_DOJAH_APP_ID
  const publicKey = import.meta.env.VITE_DOJAH_PUBLIC_KEY
  const sandboxMode =
    String(import.meta.env.VITE_DOJAH_SANDBOX || '').toLowerCase() === 'true'
  const dojahEnv = sandboxMode ? 'sandbox' : undefined
  const hasDojahConfig = Boolean(appID && publicKey)

  const config = {
    debug: import.meta.env.DEV || sandboxMode,
    pages: [
      {
        page: 'government-data',
        config: {
          bvn: true,
          nin: true,
          dl: false,
          mobile: false,
          otp: false,
          selfie: true,
        },
      },
    ],
  }

  const userData = {
    first_name: user?.name ? user.name.split(' ')[0] : '',
    last_name:
      user?.name && user.name.split(' ').length > 1
        ? user.name.split(' ')[1]
        : '',
    email: user?.email || profileUser?.email || '',
    phone_number: profileUser?.phoneNumber || '',
  }

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-xl font-bold text-[#2e7d32]'>
          Identity Verification (KYC)
        </h2>
        <p className='text-sm text-gray-500'>
          Verify your identity to unlock all features and build trust with
          buyers
        </p>
      </div>

      <div className='mx-auto flex max-w-sm flex-col items-center text-center py-6'>
        <div className='mb-4'>
          <svg
            className='size-16 text-[#2e7d32]'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={1.5}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-bold text-gray-900'>Secure KYC Flow</h3>
        <p className='mt-1 mb-6 text-sm text-gray-500'>
          Click the button below to start your identity verification securely
          via Dojah.
        </p>

        {hasDojahConfig ? (
          <div className='w-full space-y-3'>
            <button
              type='button'
              onClick={() => {
                setKycLaunchCount((v) => v + 1)
                setShouldLaunchKyc(true)
              }}
              className='inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-brand bg-white px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'
            >
              <svg
                className='size-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                />
              </svg>
              Start KYC Flow
            </button>
            {shouldLaunchKyc ? (
              <DojahWidget
                key={kycLaunchCount}
                response={response}
                appID={appID}
                publicKey={publicKey}
                type='custom'
                env={dojahEnv}
                config={config}
                userData={userData}
                metadata={{ user_id: user?.id || 'unknown' }}
              />
            ) : null}
            {kycErrorDetail ? (
              <div className='rounded-lg border border-amber-200 bg-amber-50 p-3 text-left'>
                <p className='text-xs font-semibold uppercase tracking-widest text-amber-800'>
                  Verification issue
                </p>
                <p className='mt-1 text-xs text-amber-700'>{kycErrorDetail}</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className='w-full rounded-lg border border-amber-200 bg-amber-50 p-4 text-left'>
            <p className='text-sm font-semibold text-amber-800'>
              KYC setup required
            </p>
            <p className='mt-1 text-xs text-amber-700'>
              Dojah is not configured. Set <code>VITE_DOJAH_APP_ID</code>,{' '}
              <code>VITE_DOJAH_PUBLIC_KEY</code>, and optionally{' '}
              <code>VITE_DOJAH_SANDBOX=true</code> in your environment to enable
              verification.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── 3. Notification Preferences ─── */
function NotificationsTab() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-bold text-[#2e7d32]'>
          Notification Preferences
        </h2>
        <p className='text-sm text-gray-500'>
          Configure how and when you receive notifications and alerts
        </p>
      </div>

      {/* Notification Channels */}
      <div className='space-y-4 pt-2'>
        <h3 className='font-bold text-gray-900'>Notification Channels</h3>
        <div className='space-y-3'>
          <ToggleCard
            title='Email Notifications'
            description='Receive notifications via email'
            defaultChecked={true}
          />
          <ToggleCard
            title='SMS Notifications'
            description='Coming soon - SMS notifications are not yet available'
            defaultChecked={false}
            disabled={true}
          />
        </div>
      </div>

      <div className='my-6 border-t border-gray-100'></div>

      {/* Alert Types */}
      <div className='space-y-4'>
        <h3 className='font-bold text-gray-900'>Alert Types</h3>
        <div className='space-y-3'>
          <ToggleCard
            title='Compliance Alerts'
            description='Get notified when products fail compliance checks'
            defaultChecked={true}
          />
          <ToggleCard
            title='Product Expiry Alerts'
            description='Get notified when products are approaching expiry'
            defaultChecked={true}
          />
          <ToggleCard
            title='Batch Completion Alerts'
            description='Get notified when processing batches are completed'
            defaultChecked={true}
          />
          <ToggleCard
            title='Certificate Expiry Alerts'
            description='Get notified when certifications are about to expire'
            defaultChecked={true}
          />
          <ToggleCard
            title='New Transfer Alerts'
            description='Get notified when you receive new product transfers'
            defaultChecked={true}
          />
          <ToggleCard
            title='KYC Status Alerts'
            description='Get notified about KYC verification status changes'
            defaultChecked={true}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 pt-6 md:grid-cols-2'>
        <div className='space-y-1.5'>
          <label className='block text-sm font-bold text-gray-900'>
            Expiry Alert Days
          </label>
          <input
            type='number'
            defaultValue='30'
            className='h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
          />
          <p className='text-xs text-gray-500'>
            Days before expiry to send alerts
          </p>
        </div>
        <div className='space-y-1.5'>
          <label className='block text-sm font-bold text-gray-900'>
            Alert Email
          </label>
          <input
            type='email'
            defaultValue='admin@agrolinking.com'
            className='h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
          />
        </div>
      </div>

      <div className='pt-4'>
        <button
          type='button'
          className='flex h-10 items-center justify-center gap-2 rounded-lg bg-[#2e7d32] px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#1b5e20]'
        >
          <svg
            className='size-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4'
            />
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
  disabled = false,
}: {
  title: string
  description: string
  defaultChecked: boolean
  disabled?: boolean
}) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <div
      className={`flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${disabled ? 'opacity-60' : ''}`}
    >
      <div>
        <h4
          className={`text-sm font-bold ${disabled ? 'text-gray-400' : 'text-gray-900'}`}
        >
          {title}
        </h4>
        <p className='mt-0.5 text-xs text-gray-500'>{description}</p>
      </div>
      {/* Toggle button */}
      <button
        type='button'
        disabled={disabled}
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-[#2e7d32]' : 'bg-gray-200'
        }`}
        role='switch'
        aria-checked={checked}
      >
        <span
          className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
