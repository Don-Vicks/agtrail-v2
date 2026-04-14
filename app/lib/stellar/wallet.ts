import { Keypair } from '@stellar/stellar-sdk'

export interface StellarKeyPair {
  publicKey: string
  secretKey: string
}

/**
 * Generates a completely new Stellar keypair locally.
 * In a real-world scenario, you would securely store the secretKey
 * (e.g., in an encrypted format) and only reveal the publicKey.
 */
export function generateStellarKeypair(): StellarKeyPair {
  const keypair = Keypair.random()
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret()
  }
}

/**
 * Safely persists the user's localized non-custodial wallet details.
 */
export function saveWalletLocal(keyPair: StellarKeyPair) {
  // We use localStorage here for demonstration
  // In production, keep secrets in more secure mediums (e.g. Encrypted Vault)
  if (typeof window !== 'undefined') {
    localStorage.setItem('wallet_public', keyPair.publicKey)
    localStorage.setItem('wallet_secret', keyPair.secretKey) // HIGH RISK
  }
}

/**
 * Recovers local wallet details if available.
 */
export function getLocalWallet(): StellarKeyPair | null {
  if (typeof window === 'undefined') return null

  const pub = localStorage.getItem('wallet_public')
  const sec = localStorage.getItem('wallet_secret')
  
  if (pub && sec) {
    return { publicKey: pub, secretKey: sec }
  }
  return null
}
