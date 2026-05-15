import { useMutation } from '@tanstack/react-query'
import { Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { customFetch } from '~/lib/api/custom-fetch'
import { useGetWalletBalance } from '~/lib/api/generated/wallet/wallet'
import { getAccountExplorerUrl, truncateAddress } from '~/lib/block-explorer'
import { generateStellarKeypair, saveWalletLocal } from '~/lib/stellar/wallet'
import { cn } from '~/lib/utils'

export function SidebarWallet() {
  const [isWalletExpanded, setIsWalletExpanded] = useState(false)

  // Fetch Wallet Data
  const {
    data: walletResp,
    refetch: refetchWallet,
    isLoading: isLoadingWallet,
  } = useGetWalletBalance()

  const { mutate: createWallet, isPending: isCreatingWallet } = useMutation({
    mutationFn: async (payload: {
      publicKey: string
      encryptedSecretKey: string
    }) => {
      return customFetch('/wallet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    },
    onSuccess: () => {
      refetchWallet()
    },
  })

  const handleCreateWallet = async () => {
    try {
      const keyPair = generateStellarKeypair()
      saveWalletLocal(keyPair)
      createWallet({
        publicKey: keyPair.publicKey,
        encryptedSecretKey: keyPair.secretKey,
      })
    } catch (error) {
      console.error('Failed to create wallet locally', error)
    }
  }

  const walletData = walletResp?.data?.data as any
  const walletAddress =
    walletData?.id ||
    walletData?.publicKey ||
    walletData?.address ||
    walletData?.accountId

  const accountExplorerUrl =
    typeof walletAddress === 'string' ? getAccountExplorerUrl(walletAddress) : null

  const copyWalletAddress = async () => {
    if (!walletAddress || typeof walletAddress !== 'string') return
    try {
      await navigator.clipboard.writeText(walletAddress)
      toast.success('Wallet address copied')
    } catch {
      toast.error('Could not copy address')
    }
  }

  return (
    <div className='border-t border-gray-200 px-4 py-3 pb-4'>
      <div className='flex w-full items-center gap-1.5'>
        <button
          type='button'
          onClick={() => setIsWalletExpanded(!isWalletExpanded)}
          className='flex min-w-0 flex-1 items-center justify-between gap-2 text-left'
        >
          <div className='flex min-w-0 items-center gap-2'>
            <svg
              className='size-4 shrink-0 text-gray-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <rect x='2' y='4' width='20' height='16' rx='2' />
              <path d='M22 10H2' />
            </svg>
            <div className='min-w-0'>
              <div className='text-[13px] font-bold text-gray-900'>
                Wallet
              </div>
              <div className='truncate text-[10px] text-gray-500 font-mono tracking-wide'>
                {isLoadingWallet
                  ? 'Loading...'
                  : walletAddress
                    ? truncateAddress(walletAddress, 10, 4)
                    : 'No Wallet Address'}
              </div>
            </div>
          </div>
          <svg
            className={cn(
              'size-3.5 shrink-0 text-gray-500 transition-transform',
              isWalletExpanded ? 'rotate-180' : 'rotate-0',
            )}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </button>
        {!isLoadingWallet && walletAddress ? (
          <button
            type='button'
            onClick={copyWalletAddress}
            className='shrink-0 rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200/80 hover:text-gray-800'
            title='Copy address'
          >
            <Copy className='size-3.5' />
          </button>
        ) : null}
      </div>

      {isWalletExpanded && (
        <div className='mt-3'>
          <div className='mb-3 border-t border-gray-200/60' />
          <div className='space-y-2.5 px-0.5 text-[13px] font-medium'>
            {isLoadingWallet ? (
              <div className='flex justify-center py-2'>
                <span className='text-xs text-gray-500'>
                  Loading assets...
                </span>
              </div>
            ) : walletAddress ? (
              <>
                <div className='flex justify-between items-center text-gray-600'>
                  <span>{walletData?.currency || 'NGN'}</span>
                  <span className='font-mono text-gray-900 font-bold'>
                    {Number(walletData?.balance || 0).toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between items-center text-gray-600'>
                  <span>AGT</span>
                  <span className='font-mono text-gray-900 font-bold'>
                    0.00
                  </span>
                </div>
              </>
            ) : (
              <div className='flex flex-col items-center justify-center py-4 gap-3'>
                <span className='text-xs text-gray-500 text-center'>
                  No wallet found for this account.
                </span>
                <button
                  onClick={handleCreateWallet}
                  disabled={isCreatingWallet}
                  className='flex w-full items-center justify-center rounded-md bg-brand px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-black transition-colors disabled:opacity-50 gap-2 shadow-sm'
                >
                  {isCreatingWallet ? 'Creating...' : 'Create a Wallet'}
                </button>
              </div>
            )}

            <div className='flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 pb-1'>
              <button
                type='button'
                onClick={copyWalletAddress}
                disabled={!walletAddress}
                className='flex items-center gap-1.5 text-[13px] font-bold text-gray-900 transition-colors hover:text-gray-600 disabled:pointer-events-none disabled:opacity-40'
              >
                <Copy className='size-4' />
                Copy
              </button>
              {accountExplorerUrl ? (
                <a
                  href={accountExplorerUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1.5 text-[13px] font-bold text-gray-900 transition-colors hover:text-gray-600'
                >
                  <ExternalLink className='size-4' />
                  View on explorer
                </a>
              ) : null}
              <button
                onClick={() => refetchWallet()}
                className='ml-auto flex items-center justify-center text-gray-900 hover:text-gray-600 transition-colors'
                title='Refresh'
              >
                <svg
                  className={`size-4 ${isLoadingWallet ? 'animate-spin' : ''}`}
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
