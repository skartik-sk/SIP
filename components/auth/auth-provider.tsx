import { Account, useAuthorization } from '@/components/solana/use-authorization'
import { useMobileWallet } from '@/components/solana/use-mobile-wallet'
import { AppConfig } from '@/constants/app-config'
import { PublicKey } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { createContext, type PropsWithChildren, use, useMemo } from 'react'

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  publicKey: PublicKey | null
  signIn: () => Promise<Account>
  signOut: () => Promise<void>
  disconnect: () => Promise<void>
}

const Context = createContext<AuthState>({} as AuthState)

export function useAuth() {
  const value = use(Context)
  if (!value) {
    throw new Error('useAuth must be wrapped in a <AuthProvider />')
  }

  return value
}

function useSignInMutation() {
  const { signIn } = useMobileWallet()

  return useMutation({
    mutationFn: async () =>
      await signIn({
        uri: AppConfig.uri,
      }),
  })
}

export function AuthProvider({ children }: PropsWithChildren) {
  const { disconnect } = useMobileWallet()
  const { accounts, isLoading } = useAuthorization()
  const signInMutation = useSignInMutation()

  const value: AuthState = useMemo(
    () => ({
      signIn: async () => await signInMutation.mutateAsync(),
      signOut: async () => await disconnect(),
      disconnect: async () => await disconnect(),
      isAuthenticated: (accounts?.length ?? 0) > 0,
      isLoading: signInMutation.isPending || isLoading,
      publicKey: accounts && accounts.length > 0 ? accounts[0].publicKey : null,
    }),
    [accounts, disconnect, signInMutation, isLoading],
  )

  return <Context value={value}>{children}</Context>
}
