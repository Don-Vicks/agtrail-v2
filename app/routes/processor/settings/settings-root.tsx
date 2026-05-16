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
import { usePostUpload } from '~/lib/api/generated/upload/upload'
import { getKycStatusFromUsersProfileBody, isVerifiedKycStatus } from '~/lib/kyc'
import type { Route } from './+types/settings-root'

export function meta({ }: Route.MetaArgs) {
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
            href: '/processor',
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
        <h1 className='text-3xl font-bold text-gray-900'>Settings</h1>
        <p className='mt-1 text-sm text-gray-500 mb-6'>
          Manage your account and application preferences
        </p>

        {/* Tabs */}
        <div className='inline-flex overflow-hidden rounded-md bg-[#f1f4eb] p-1'>
          {(
            ['Account', 'Identity Verification', 'Notifications'] as TabType[]
          ).map((tab) => (
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
      <div className='rounded-md border border-gray-200 bg-white p-6 shadow-sm'>
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

  const kycStatus = getKycStatusFromUsersProfileBody(profileResp?.data)
  const isKycVerified = isVerifiedKycStatus(kycStatus)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isKycVerified) return

    const formData = new FormData(e.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const phoneNumber = String(formData.get('phoneNumber') ?? '').trim()
    const orgName = String(formData.get('organization') ?? '').trim()

    if (!name) {
      toast.error('Name is required.')
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
        <h2 className='text-xl font-bold text-gray-900'>Account Settings</h2>
        <p className='text-sm text-gray-500'>
          Update your personal and organization details
        </p>
        {isKycVerified && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-bold uppercase tracking-tight">
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25-2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Profile locked due to verified KYC status
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className='max-w-3xl space-y-5'>
        <div className='space-y-1.5'>
          <label className='block text-sm font-bold text-gray-900'>Name</label>
          <input
            type='text'
            name='name'
            defaultValue={profile?.name || ''}
            className={`h-10 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand ${isKycVerified ? 'bg-gray-50 cursor-not-allowed opacity-70' : 'bg-white'}`}
            required
            disabled={isKycVerified}
          />
        </div>

        <div className='space-y-1.5 opacity-60'>
          <label className='block text-sm font-bold text-gray-900'>Email</label>
          <input
            type='email'
            defaultValue={profile?.email || user?.email || ''}
            readOnly
            className='h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 focus:outline-none cursor-not-allowed'
          />
        </div>

        <div className='space-y-1.5'>
          <label className='block text-sm font-bold text-gray-900'>
            Organization
          </label>
          <input
            type='text'
            name='organization'
            defaultValue={org?.name || ''}
            className={`h-10 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand ${isKycVerified ? 'bg-gray-50 cursor-not-allowed opacity-70' : 'bg-white'}`}
            disabled={isKycVerified}
          />
        </div>

        <div className='space-y-1.5'>
          <label className='block text-sm font-bold text-gray-900'>
            Phone Number (Optional)
          </label>
          <input
            type='tel'
            name='phoneNumber'
            defaultValue={profile?.phoneNumber || ''}
            className={`h-10 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand ${isKycVerified ? 'bg-gray-50 cursor-not-allowed opacity-70' : 'bg-white'}`}
            disabled={isKycVerified}
          />
        </div>

        <div className='pt-2'>
          <button
            type='submit'
            disabled={isUpdatingProfile || isUpdatingOrg || isKycVerified}
            className='flex h-10 items-center justify-center gap-2 rounded-md bg-[#2e7d32] px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#1b5e20] disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isUpdatingProfile || isUpdatingOrg ? 'Saving...' : 'Save Changes'}
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
  const [isDeviceGuardBlocked, setIsDeviceGuardBlocked] = useState(false)
  const [activeSessionRef, setActiveSessionRef] = useState('')

  const { mutate: linkKyc } = usePostUsersKyc({
    mutation: {
      onSuccess: () => {
        toast.success('KYC synced successfully.')
      },
      onError: () => {
        toast.error('Failed to sync KYC status.')
      },
    },
  })

  const { mutateAsync: uploadFile } = usePostUpload()

  const syncKyc = async (dojahData: any) => {
    setShouldLaunchKyc(false)
    const dojahImgUrl = dojahData?.id_url || dojahData?.data?.id?.data?.id_url || dojahData?.selfie_url

    let finalDocUrl = ''
    if (dojahImgUrl) {
      try {
        const response = await fetch(dojahImgUrl)
        const blob = await response.blob()
        const file = new File([blob], 'kyc_document.jpg', { type: blob.type || 'image/jpeg' })
        const uploadRes = await uploadFile({ data: { kycDocument: file } })
        finalDocUrl = uploadRes?.data?.urls?.[0] || dojahImgUrl
      } catch (err) {
        console.error('Failed to upload KYC document:', err)
        finalDocUrl = dojahImgUrl
      }
    }

    linkKyc({
      data: {
        bvnVerified: true,
        ninVerified: true,
        documentUrl: finalDocUrl,
      },
    })
  }

  const response = (type: string, data: any) => {
    if (type === 'success') {
      syncKyc(data)
    } else if (type === 'error') {
      setShouldLaunchKyc(false)
      toast.error(data?.message || 'Verification failed')
    } else if (type === 'close') {
      setShouldLaunchKyc(false)
    }
  }

  const appID = import.meta.env.VITE_DOJAH_APP_ID
  const publicKey = import.meta.env.VITE_DOJAH_PUBLIC_KEY
  const hasDojahConfig = Boolean(appID && publicKey)

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-xl font-bold text-gray-900'>Identity Verification (KYC)</h2>
        <p className='text-sm text-gray-500'>Verify your identity to unlock all features</p>
      </div>

      <div className='mx-auto flex max-w-sm flex-col items-center text-center py-6'>
        <div className='mb-4'>
          <svg className='size-16 text-[#2e7d32]' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
          </svg>
        </div>
        <h3 className='text-lg font-bold text-gray-900'>Secure KYC Flow</h3>
        <p className='mt-1 mb-6 text-sm text-gray-500'>Start your identity verification securely via Dojah.</p>

        {hasDojahConfig ? (
          <div className='w-full'>
            <button
              type='button'
              disabled={shouldLaunchKyc}
              onClick={() => {
                setKycLaunchCount((v) => v + 1)
                setShouldLaunchKyc(true)
              }}
              className='inline-flex h-11 items-center justify-center gap-2 rounded-md border border-brand bg-white px-4 text-sm font-semibold text-brand transition-colors hover:bg-brand-surface disabled:opacity-50'
            >
              {shouldLaunchKyc ? 'Running...' : 'Start KYC Flow'}
            </button>
            {shouldLaunchKyc && (
              <DojahWidget
                key={kycLaunchCount}
                response={response}
                appID={appID}
                publicKey={publicKey}
                type='identification'
                config={{ debug: true, reference_id: `kyc-${user?.id}-${Date.now()}` }}
                userData={{ email: user?.email || '', first_name: user?.name || '' }}
              />
            )}
          </div>
        ) : (
          <p className='text-xs text-amber-600'>KYC setup required in environment.</p>
        )}
      </div>
    </div>
  )
}

/* ─── 3. Notification Preferences ─── */
function NotificationsTab() {
  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-bold text-gray-900'>Notification Preferences</h2>
      <div className='space-y-3'>
        <ToggleCard title='Email Notifications' description='Receive notifications via email' defaultChecked={true} />
        <ToggleCard title='Compliance Alerts' description='Get notified when products fail compliance checks' defaultChecked={true} />
      </div>
    </div>
  )
}

function ToggleCard({ title, description, defaultChecked, disabled = false }: any) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div className={`flex items-center justify-between rounded-md border border-gray-200 bg-white p-4 shadow-sm ${disabled ? 'opacity-60' : ''}`}>
      <div>
        <h4 className='text-sm font-bold text-gray-900'>{title}</h4>
        <p className='mt-0.5 text-xs text-gray-500'>{description}</p>
      </div>
      <button
        type='button'
        disabled={disabled}
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${checked ? 'bg-[#2e7d32]' : 'bg-gray-200'}`}
      >
        <span className={`inline-block size-5 transform rounded-full bg-white transition ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}
