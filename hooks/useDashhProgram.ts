import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { useToast } from '@/components/ui/toast-provider'
import { Dashh, DashhIDL } from '@/lib'
import { SipVault } from '@/lib/sip_vault'
import  Sip from '@/lib/sip_vault.json'

import { CreateCampaignParams } from '@/types/campaign'
import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import BN from 'bn.js'
import { toByteArray } from 'react-native-quick-base64'
import { v4 as uuidv4 } from 'uuid'

const PROGRAM_ID = '7qpRXNFY5PJQfwptK4BosJ5jCnVeEYRWATFu8BBDTVcr'

// App Identity for Mobile Wallet Adapter
export const APP_IDENTITY = {
  name: 'SIP - Solana Influencer Platform',
  uri: 'https://skartik.xyz',
  icon: 'favicon.ico',
}

// Additional types to match blinks-mini exactly
interface CampaignArgs {
  id: number
  title: string
  image: string
  description: string
  lable: string
  endtime: number
  reward: number
  owner: PublicKey
}

interface participantargs {
  id: string

}

interface updateArgs{
  id:string,
  points: number
}

// Type definitions for the program accounts
interface CampaignAccount {
  id: BN
  title: string
  description: string
  image: string
  lable: string
  endtime: BN
  reward: BN
  owner: PublicKey
}

interface ParticipantAccount {
  id: BN
  user: PublicKey
  points: BN
}

interface ProgramAccount<T> {
  publicKey: PublicKey
  account: T
}

interface ParticipantArgs {
  id: number
  user: PublicKey
}

export function useDashhProgram() {

  const authority = new PublicKey('3Ydp1ttTsfpWJ4ri4hyfWDq52423ULREchvQVoF31u7L')
  const { account,signAndSendTransaction } = useWalletUi()
  const toast = useToast()
  const queryClient = useQueryClient()

  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
  const program: Program<Dashh> = new Program(DashhIDL as Dashh, { connection })
  const program_valt: Program<SipVault> = new Program(Sip as SipVault, { connection })

  // Queries using the new anchor program integration
  const accounts = useQuery({
    queryKey: ['campaigns', 'nothing', 'somthing'],
    queryFn: () => program.account.campaign.all(),
  })

  const paccounts = useQuery({
    queryKey: ['dashh-p', 'all', 'devnet'],
    queryFn: () => program.account.participent.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', 'devnet'],
    queryFn: () => connection.getParsedAccountInfo(new PublicKey(PROGRAM_ID)),
  })

  // Mutations - matching blinks-mini exactly
  const createCampaign = useMutation<string, Error, CreateCampaignParams>({
    mutationKey: ['create-campaign', 'create', 'devnet'],
    mutationFn: async ({ title, description, image, lable, endtime, reward }) => {
      if (!account) {
        throw new Error('Wallet not connected')
      }

      console.log('🚀 Creating campaign with Mobile Wallet Adapter...', {
        title,
        reward,
        endtime,
        rewardType: typeof reward,
        endtimeType: typeof endtime,
      })

      // Generate a unique ID for the campaign using a simpler approach
      // ...
      const campaignId = new anchor.BN(
        BigInt('0x' + uuidv4().replace(/-/g, '').slice(0, 16))
      )

      // Convert endtime and reward to BN properly
      // If endtime is in milliseconds (from date picker), convert to seconds

      const endtimeAsU64 = new anchor.BN(endtime)
      
      // Convert reward from SOL to lamports if needed

      const rewardAsU64 = new anchor.BN(reward)

      console.log('📊 Campaign data converted:', {
        id: campaignId.toString(),
        title,
        description,
        image,
        lable,
        endtime: endtimeAsU64.toString(),
        reward: rewardAsU64.toString(),
        endtimeOriginal: endtime,

        rewardOriginal: reward,
      })

      const blockhash = await connection.getLatestBlockhash()

        const instructions = await program.methods
          .createCampaign(campaignId, title, description, image, lable, endtimeAsU64, rewardAsU64)
          .accounts({
            signer: account.publicKey,
          })
          .instruction()


          const instructions2 = await program_valt.methods
          .initialize(campaignId, new BN(endtime), authority, new BN(reward * LAMPORTS_PER_SOL))
      .accounts({
        creater: account.publicKey,
      })
   
        .instruction()

        // Construct the Versioned message and transaction.
        const txMessage = new TransactionMessage({
          payerKey: account.publicKey,
          recentBlockhash: blockhash.blockhash,
          instructions: [instructions, instructions2],
        }).compileToV0Message()

        const transferTx = new VersionedTransaction(txMessage)

       const txSignature = await signAndSendTransaction(transferTx,1)
   const confirmationResult = await connection.confirmTransaction(
  txSignature,
  "confirmed"
);
      if (confirmationResult.value.err) {
        throw new Error(JSON.stringify(confirmationResult.value.err))
      } else {
        console.log('Transaction successfully submitted!')
        return txSignature
      }
    },
    onSuccess: () => {
      toast.show('Campaign created successfully!')
      accounts.refetch()
    },
    onError: (error) => {
      console.error('❌ Error creating campaign:', error)
      toast.show(`Error creating campaign: ${error.message}`)
    },
  })

  const createParticipant = useMutation<string, Error, participantargs>({
    mutationKey: ['create-Participant', 'create', 'devnet'],
    mutationFn: async ({ id }) => {
      if (!account) {
        throw new Error('Wallet not connected')
      }

      console.log('👤 Joining campaign with Mobile Wallet Adapter...', {
        campaignId: id,
        user: account.publicKey.toString().slice(0, 8) + '...',
      })

      const blockhash = await connection.getLatestBlockhash()

        const instructions = await program.methods
              .createParticipent(
                new anchor.BN(id),
                account.publicKey
              )
              .accounts({
            signer: account.publicKey,
          })
          .instruction()

        // Construct the Versioned message and transaction.
        const txMessage = new TransactionMessage({
          payerKey: account.publicKey,
          recentBlockhash: blockhash.blockhash,
          instructions: [instructions],
        }).compileToV0Message()

        const transferTx = new VersionedTransaction(txMessage)

       const txSignature = await signAndSendTransaction(transferTx,1)
   const confirmationResult = await connection.confirmTransaction(
  txSignature,
  "confirmed"
);
      if (confirmationResult.value.err) {
        throw new Error(JSON.stringify(confirmationResult.value.err))
      } else {
        console.log('Transaction successfully submitted!')
        return txSignature
      }},
    onSuccess: () => {
      toast.show('Joined campaign successfully!')
      accounts.refetch()
    },
    onError: (error) => {
      console.error('❌ Error joining campaign:', error)
      toast.show(`Error joining campaign: ${error.message}`)
    },
  })

  const updateParticipant = useMutation<string, Error, updateArgs>({
    mutationKey: ['update-participant', 'update', 'devnet'],
    mutationFn: async ({ id, points }) => {
      if (!account) {
        throw new Error('Wallet not connected')
      }

      console.log('📈 Updating points with Mobile Wallet Adapter...', {
        campaignId: id,
        user: account.publicKey.toString().slice(0, 8) + '...',
        points,
      })

      const blockhash = await connection.getLatestBlockhash()

        const instructions = await program.methods
              .updatedParticipent(
                new anchor.BN(id),
                account.publicKey,
                new anchor.BN(points)
              )
              .accounts({
            signer: account.publicKey,
          })
          .instruction()

        // Construct the Versioned message and transaction.
        const txMessage = new TransactionMessage({
          payerKey: account.publicKey,
          recentBlockhash: blockhash.blockhash,
          instructions: [instructions],
        }).compileToV0Message()

        const transferTx = new VersionedTransaction(txMessage)

       const txSignature = await signAndSendTransaction(transferTx,1)
   const confirmationResult = await connection.confirmTransaction(
  txSignature,
  "confirmed"
);
      if (confirmationResult.value.err) {
        throw new Error(JSON.stringify(confirmationResult.value.err))
      } else {
        console.log('Transaction successfully submitted!')
        return txSignature
      }},

    onSuccess: () => {
      toast.show('Points updated successfully!')
      accounts.refetch()
    },
    onError: (error) => {
      console.error('❌ Error updating points:', error)
      toast.show(`Error updating points: ${error.message}`)
    },
  })

  return {
    program: getProgramAccount.data ? 'connected' : null,
    programId: PROGRAM_ID,
    accounts,
    paccounts,
    getProgramAccount,
    createCampaign,
    createParticipant,
    updateParticipant,
  }
}
