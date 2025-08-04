import { transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import { PublicKey } from '@solana/web3.js'
import React, { createContext, ReactNode, useContext } from 'react'
import { toByteArray } from 'react-native-quick-base64'

interface MobileWalletContextType {
  connectWallet: () => Promise<PublicKey | null>
  signTransaction: (transaction: any) => Promise<any>
  signAndSendTransaction: (transaction: any) => Promise<string>
}

const MobileWalletContext = createContext<MobileWalletContextType | null>(null)

export function useMobileWalletAdapter() {
  const context = useContext(MobileWalletContext)
  if (!context) {
    throw new Error('useMobileWalletAdapter must be used within MobileWalletProvider')
  }
  return context
}

interface MobileWalletProviderProps {
  children: ReactNode
}

export function MobileWalletProvider({ children }: MobileWalletProviderProps) {
  const connectWallet = async (): Promise<PublicKey | null> => {
    try {
      const result = await transact(async (wallet: Web3MobileWallet) => {
        const authorizationResult = await wallet.authorize({
          chain: 'solana:devnet',
          identity: {
            name: 'DASHH - Solana Influencer Platform',
            uri: 'https://solanamobile.com',
            icon: 'favicon.ico',
          },
        })

        // Convert base64 address to PublicKey
        const address = toByteArray(authorizationResult.accounts[0].address)
        return new PublicKey(address)
      })

      return result
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      return null
    }
  }

  const signTransaction = async (transaction: any) => {
    return await transact(async (wallet: Web3MobileWallet) => {
      await wallet.authorize({
        chain: 'solana:devnet',
        identity: {
          name: 'DASHH - Solana Influencer Platform',
          uri: 'https://solanamobile.com',
          icon: 'favicon.ico',
        },
      })

      const signedTransactions = await wallet.signTransactions({
        transactions: [transaction],
      })

      return signedTransactions[0]
    })
  }

  const signAndSendTransaction = async (transaction: any): Promise<string> => {
    return await transact(async (wallet: Web3MobileWallet) => {
      await wallet.authorize({
        chain: 'solana:devnet',
        identity: {
          name: 'DASHH - Solana Influencer Platform',
          uri: 'https://solanamobile.com',
          icon: 'favicon.ico',
        },
      })

      const signatures = await wallet.signAndSendTransactions({
        transactions: [transaction],
      })

      return signatures[0]
    })
  }

  const value: MobileWalletContextType = {
    connectWallet,
    signTransaction,
    signAndSendTransaction,
  }

  return (
    <MobileWalletContext.Provider value={value}>
      {children}
    </MobileWalletContext.Provider>
  )
}
