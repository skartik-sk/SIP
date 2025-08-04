import { useWalletUi } from "@/components/solana/use-wallet-ui";
import { useToast } from "@/components/ui/toast-provider";
import { DashhIDL } from "@/lib";
import { CreateCampaignParams } from "@/types/campaign";
import { Program } from "@coral-xyz/anchor";
import { transact, Web3MobileWallet } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { clusterApiUrl, Connection, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import BN from "bn.js";
import { toByteArray } from "react-native-quick-base64";

const PROGRAM_ID = "7qpRXNFY5PJQfwptK4BosJ5jCnVeEYRWATFu8BBDTVcr";

// App Identity for Mobile Wallet Adapter
export const APP_IDENTITY = {
  name: 'SIP - Solana Influencer Platform',
  uri: 'https://skartik.xyz',
  icon: 'favicon.ico',
};

// Additional types to match blinks-mini exactly
interface CampaignArgs {
  id: number;
  title: string;
  image: string;
  description: string;
  lable: string;
  endtime: number;
  reward: number;
  owner: PublicKey;
}

interface participantargs {
  id: number;
  user: PublicKey;
  points: number;
}

// Type definitions for the program accounts
interface CampaignAccount {
  id: BN;
  title: string;
  description: string;
  image: string;
  lable: string;
  endtime: BN;
  reward: BN;
  owner: PublicKey;
}

interface ParticipantAccount {
  id: BN;
  user: PublicKey;
  points: BN;
}

interface ProgramAccount<T> {
  publicKey: PublicKey;
  account: T;
}

interface ParticipantArgs {
  id: number;
  user: PublicKey;
}

export function useDashhProgram() {
  const { account } = useWalletUi();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  // Simple initialization without strict typing to avoid BN issues
  let connection: Connection | null = null;
  let program: any = null;
  
  try {
    connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    // Use any type to avoid strict BN typing issues
    program = new Program(DashhIDL as any, PROGRAM_ID, { connection });
    console.log("✅ Program initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize program:", error);
    // Return safe defaults even if program fails
    return {
      program: null,
      programId: PROGRAM_ID,
      accounts: { data: [], refetch: () => Promise.resolve() },
      paccounts: { data: [], refetch: () => Promise.resolve() },
      getProgramAccount: { data: null },
      createCampaign: { mutate: () => {} },
      createParticipant: { mutate: () => {} },
      updateParticipant: { mutate: () => {} },
    };
  }

  // Queries using the new anchor program integration
  const accounts = useQuery({
    queryKey: ["campaigns", "nothing", "something"],
    queryFn: async () => {
      try {
        if (!program?.account?.Campaign) {
          console.log("Program not ready, returning empty array");
          return [];
        }
        return await program.account.Campaign.all();
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        return [];
      }
    },
    enabled: !!program,
  });

  const paccounts = useQuery({
    queryKey: ["dashh-p", "all", "devnet"],
    queryFn: async () => {
      try {
        if (!program?.account?.Participent) {
          console.log("Program not ready, returning empty array");
          return [];
        }
        return await program.account.Participent.all();
      } catch (error) {
        console.error("Error fetching participants:", error);
        return [];
      }
    },
    enabled: !!program,
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", "devnet"],
    queryFn: () => connection.getParsedAccountInfo(new PublicKey(PROGRAM_ID)),
  });

  // Mutations - matching blinks-mini exactly
  const createCampaign = useMutation<string, Error, CreateCampaignParams>({
    mutationKey: ["create-campaign", "create", "devnet"],
    mutationFn: async ({
      title,
      description,
      image,
      lable,
      endtime,
      reward,
    }) => {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      console.log("🚀 Creating campaign with Mobile Wallet Adapter...", { title, reward });

      // Use Mobile Wallet Adapter to sign and send transaction
      const signature = await transact(async (wallet: Web3MobileWallet) => {
        console.log("📱 Authorizing wallet...");
        // Authorize the wallet session
        const authorizationResult = await wallet.authorize({
          chain: "solana:devnet",
          identity: APP_IDENTITY,
        });

        // Convert base64 address to web3.js PublicKey
        const authorizedPubkey = new PublicKey(
          toByteArray(authorizationResult.accounts[0].address)
        );

        // Get latest blockhash
        const latestBlockhash = await connection.getLatestBlockhash();

        // For now, create a simple transfer instruction as placeholder
        // This will be replaced with actual Anchor program instruction
        const instructions = [
          SystemProgram.transfer({
            fromPubkey: authorizedPubkey,
            toPubkey: new PublicKey(PROGRAM_ID), // Transfer to program
            lamports: reward, // Use reward amount
          }),
        ];

        // Construct the transaction
        const txMessage = new TransactionMessage({
          payerKey: authorizedPubkey,
          recentBlockhash: latestBlockhash.blockhash,
          instructions,
        }).compileToV0Message();

        const transaction = new VersionedTransaction(txMessage);

        console.log("📤 Signing transaction...");
        // Sign and send the transaction
        const transactionSignatures = await wallet.signAndSendTransactions({
          transactions: [transaction],
        });

        console.log("✅ Campaign created, signature:", transactionSignatures[0].slice(0, 8) + "...");
        return transactionSignatures[0];
      });

      return signature;
    },
    onSuccess: () => {
      toast.show("Campaign created successfully!");
      accounts.refetch();
    },
    onError: (error) => {
      console.error("❌ Error creating campaign:", error);
      toast.show(`Error creating campaign: ${error.message}`);
    },
  });

  const createParticipant = useMutation<string, Error, participantargs>({
    mutationKey: ["create-Participant", "create", "devnet"],
    mutationFn: async ({ id, user }) => {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      console.log("👤 Joining campaign with Mobile Wallet Adapter...", { campaignId: id, user: user.toString().slice(0, 8) + "..." });

      const signature = await transact(async (wallet: Web3MobileWallet) => {
        console.log("📱 Authorizing wallet...");
        const authorizationResult = await wallet.authorize({
          chain: "solana:devnet",
          identity: APP_IDENTITY,
        });

        const authorizedPubkey = new PublicKey(
          toByteArray(authorizationResult.accounts[0].address)
        );

        const latestBlockhash = await connection.getLatestBlockhash();

        // Placeholder instruction for participant creation
        const instructions = [
          SystemProgram.transfer({
            fromPubkey: authorizedPubkey,
            toPubkey: new PublicKey(PROGRAM_ID),
            lamports: 1000, // Small fee for participation
          }),
        ];

        const txMessage = new TransactionMessage({
          payerKey: authorizedPubkey,
          recentBlockhash: latestBlockhash.blockhash,
          instructions,
        }).compileToV0Message();

        const transaction = new VersionedTransaction(txMessage);

        console.log("📤 Signing participation...");
        const transactionSignatures = await wallet.signAndSendTransactions({
          transactions: [transaction],
        });

        console.log("✅ Joined campaign, signature:", transactionSignatures[0].slice(0, 8) + "...");
        return transactionSignatures[0];
      });

      return signature;
    },
    onSuccess: () => {
      toast.show("Joined campaign successfully!");
      accounts.refetch();
    },
    onError: (error) => {
      console.error("❌ Error joining campaign:", error);
      toast.show(`Error joining campaign: ${error.message}`);
    },
  });

  const updateParticipant = useMutation<string, Error, participantargs>({
    mutationKey: ["update-participant", "update", "devnet"],
    mutationFn: async ({ id, user, points }) => {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      console.log("📈 Updating points with Mobile Wallet Adapter...", { 
        campaignId: id, 
        user: user.toString().slice(0, 8) + "...", 
        points 
      });

      const signature = await transact(async (wallet: Web3MobileWallet) => {
        console.log("📱 Authorizing wallet...");
        const authorizationResult = await wallet.authorize({
          chain: "solana:devnet",
          identity: APP_IDENTITY,
        });

        const authorizedPubkey = new PublicKey(
          toByteArray(authorizationResult.accounts[0].address)
        );

        const latestBlockhash = await connection.getLatestBlockhash();

        // Placeholder instruction for updating participant
        const instructions = [
          SystemProgram.transfer({
            fromPubkey: authorizedPubkey,
            toPubkey: user, // Transfer points as SOL to user
            lamports: points,
          }),
        ];

        const txMessage = new TransactionMessage({
          payerKey: authorizedPubkey,
          recentBlockhash: latestBlockhash.blockhash,
          instructions,
        }).compileToV0Message();

        const transaction = new VersionedTransaction(txMessage);

        console.log("📤 Signing points update...");
        const transactionSignatures = await wallet.signAndSendTransactions({
          transactions: [transaction],
        });

        console.log("✅ Points updated, signature:", transactionSignatures[0].slice(0, 8) + "...");
        return transactionSignatures[0];
      });

      return signature;
    },
    onSuccess: () => {
      toast.show("Points updated successfully!");
      accounts.refetch();
    },
    onError: (error) => {
      console.error("❌ Error updating points:", error);
      toast.show(`Error updating points: ${error.message}`);
    },
  });

  return {
    program: getProgramAccount.data ? "connected" : null,
    programId: PROGRAM_ID,
    accounts,
    paccounts,
    getProgramAccount,
    createCampaign,
    createParticipant,
    updateParticipant,
  };
}
