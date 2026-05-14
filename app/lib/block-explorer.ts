import { StrKey } from '@stellar/stellar-sdk'

export function truncateAddress(value: string, startChars = 6, endChars = 4): string {
  const v = value.trim()
  if (v.length <= startChars + endChars + 1) return v
  return `${v.slice(0, startChars)}...${v.slice(-endChars)}`
}

export type StellarExplorerNetwork = 'public' | 'testnet' | 'futurenet'

export function getStellarExplorerNetwork(): StellarExplorerNetwork {
  const raw = String(import.meta.env.VITE_STELLAR_NETWORK ?? 'testnet').toLowerCase()
  if (raw === 'mainnet' || raw === 'public') return 'public'
  if (raw === 'futurenet') return 'futurenet'
  return 'testnet'
}

function isLikelyStellarMuxedAccountId(address: string): boolean {
  return address.length === 69 && address.startsWith('M') && /^M[A-Z2-7]{68}$/.test(address)
}

/**
 * Returns an account page URL for known address formats, or null if unsupported.
 * Stellar: stellar.expert (network from `VITE_STELLAR_NETWORK`, default testnet).
 * EVM: optional `VITE_EVM_EXPLORER_ADDRESS_URL_PREFIX` (e.g. https://etherscan.io) + `/address/`.
 */
export function getAccountExplorerUrl(address: string): string | null {
  const trimmed = address.trim()
  if (!trimmed) return null

  if (StrKey.isValidEd25519PublicKey(trimmed) || isLikelyStellarMuxedAccountId(trimmed)) {
    const net = getStellarExplorerNetwork()
    return `https://stellar.expert/explorer/${net}/account/${trimmed}`
  }

  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
    const base = (import.meta.env.VITE_EVM_EXPLORER_ADDRESS_URL_PREFIX as string | undefined)?.trim()
    if (!base) return null
    return `${base.replace(/\/$/, '')}/address/${trimmed}`
  }

  return null
}
