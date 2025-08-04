import { useSolana } from "@/components/solana/solana-provider";
import { useWalletUi } from "@/components/solana/use-wallet-ui";
import { useToast } from "@/components/ui/toast-provider";
import { CreateCampaignParams } from "@/types/campaign";
import { transact, Web3MobileWallet } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import BN from "bn.js";
import { toByteArray } from "react-native-quick-base64";
import { v4 as uuidv4 } from "uuid";

const PROGRAM_ID = "7qpRXNFY5PJQfwptK4BosJ5jCnVeEYRWATFu8BBDTVcr";

// App Identity for Mobile Wallet Adapter
export const APP_IDENTITY = {
  name: 'SIP - Solana Influencer Platform',
  uri: 'https://solanamobile.com',
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
  const { connection } = useSolana();
  const { account } = useWalletUi();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Mock program interface for development - structured like real Anchor program
  const program = {
    account: {
      campaign: {
        all: async (): Promise<ProgramAccount<CampaignAccount>[]> => {
          console.log("📊 Fetching campaigns...");
          const campaigns = [
            {
              publicKey: new PublicKey("11111111111111111111111111111111"),
              account: {
                id: new BN(1),
                title: "Twitter Engagement Campaign",
                description: "Help us grow our Twitter following! Tweet about our platform using #SolanaInfluencer and gain points for engagement.",
                image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                lable: "social",
                endtime: new BN(Date.now() + 86400000 * 7), // 7 days from now
                reward: new BN(500),
                owner: new PublicKey("11111111111111111111111111111111"),
              },
            },
            {
              publicKey: new PublicKey("22222222222222222222222222222222"),
              account: {
                id: new BN(2),
                title: "NFT Collection Promotion", 
                description: "Promote our upcoming NFT collection on Instagram. Create stories and posts showcasing our unique art pieces.",
                image: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                lable: "nft",
                endtime: new BN(Date.now() + 172800000), // 2 days from now
                reward: new BN(1000),
                owner: new PublicKey("22222222222222222222222222222222"),
              },
            },
            {
              publicKey: new PublicKey("33333333333333333333333333333333"),
              account: {
                id: new BN(3),
                title: "DeFi Education Series",
                description: "Create educational content about DeFi protocols on Solana. Help newcomers understand how to get started.",
                image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                lable: "defi",
                endtime: new BN(Date.now() + 259200000), // 3 days from now
                reward: new BN(750),
                owner: new PublicKey("33333333333333333333333333333333"),
              },
            },
            {
              publicKey: new PublicKey("44444444444444444444444444444444"),
              account: {
                id: new BN(4),
                title: "Gaming Community Building",
                description: "Build a community around our Solana-based gaming platform. Engage with gamers and create compelling content.",
                image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                lable: "gaming",
                endtime: new BN(Date.now() + 345600000), // 4 days from now
                reward: new BN(1200),
                owner: new PublicKey("44444444444444444444444444444444"),
              },
            },
          ];
          console.log(`✅ Fetched ${campaigns.length} campaigns`);
          return campaigns;
            {
              publicKey: new PublicKey("11111111111111111111111111111111"),
              account: {
                id: new BN(1),
                title: "Twitter Engagement Campaign",
                description: "Help us grow our Twitter following! Tweet about our platform using #SolanaInfluencer and gain points for engagement.",
                image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                lable: "social",
                endtime: new BN(Date.now() + 86400000 * 7), // 7 days from now
                reward: new BN(500),
                owner: new PublicKey("11111111111111111111111111111111"),
              },
            },
            {
              publicKey: new PublicKey("22222222222222222222222222222222"),
              account: {
                id: new BN(2),
                title: "NFT Collection Promotion", 
                description: "Promote our upcoming NFT collection on Instagram. Create stories and posts showcasing our unique art pieces.",
                image: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                lable: "nft",
                endtime: new BN(Date.now() + 172800000), // 2 days from now
                reward: new BN(1000),
                owner: new PublicKey("22222222222222222222222222222222"),
              },
            },
            {
              publicKey: new PublicKey("33333333333333333333333333333333"),
              account: {
                id: new BN(3),
                title: "DeFi Education Series",
                description: "Create educational content about DeFi protocols on Solana. Help newcomers understand how to get started.",
                image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                lable: "defi",
                endtime: new BN(Date.now() + 259200000), // 3 days from now
                reward: new BN(750),
                owner: new PublicKey("33333333333333333333333333333333"),
              },
            },
            {
              publicKey: new PublicKey("44444444444444444444444444444444"),
              account: {
                id: new BN(4),
                title: "Gaming Community Building",
                description: "Build a community around our Solana-based gaming platform. Engage with gamers and create compelling content.",
                image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                lable: "gaming",
                endtime: new BN(Date.now() + 345600000), // 4 days from now
                reward: new BN(1200),
                owner: new PublicKey("44444444444444444444444444444444"),
              },
            },
          ];
        },
        fetch: async (accountKey: PublicKey): Promise<CampaignAccount | null> => {
          console.log("🔍 Fetching campaign:", accountKey.toString().slice(0, 8) + "...");
          return null;
        },
      },
      participent: {
        all: async (): Promise<ProgramAccount<ParticipantAccount>[]> => {
          console.log("👥 Fetching participants...");
          const participants = [
            {
              publicKey: new PublicKey("55555555555555555555555555555555"),
              account: {
                id: new BN(1), // Campaign 1
                user: new PublicKey("11111111111111111111111111111111"),
                points: new BN(150),
              },
            },
            {
              publicKey: new PublicKey("66666666666666666666666666666666"),
              account: {
                id: new BN(1), // Campaign 1
                user: new PublicKey("22222222222222222222222222222222"),
                points: new BN(200),
              },
            },
            {
              publicKey: new PublicKey("77777777777777777777777777777777"),
              account: {
                id: new BN(2), // Campaign 2
                user: new PublicKey("33333333333333333333333333333333"),
                points: new BN(100),
              },
            },
          ];
          console.log(`✅ Fetched ${participants.length} participants`);
          return participants;
        },
      },
    },
    methods: {
      createCampaign: (
        id: BN,
        title: string,
        description: string,
        image: string,
        lable: string,
        endtime: BN,
        reward: BN
      ) => ({
        rpc: async (): Promise<string> => {
          console.log("🚀 Creating campaign via MWA:", { title, reward: reward.toString() });
          
          // Use Mobile Wallet Adapter to sign and send transaction
          const signature = await transact(async (wallet: Web3MobileWallet) => {
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
                lamports: reward.toNumber(), // Use reward amount
              }),
            ];

            // Construct the transaction
            const txMessage = new TransactionMessage({
              payerKey: authorizedPubkey,
              recentBlockhash: latestBlockhash.blockhash,
              instructions,
            }).compileToV0Message();

            const transaction = new VersionedTransaction(txMessage);

            // Sign and send the transaction
            const transactionSignatures = await wallet.signAndSendTransactions({
              transactions: [transaction],
            });

            return transactionSignatures[0];
          });

          return signature;
        },
      }),
      createParticipent: (id: BN, user: PublicKey) => ({
        rpc: async (): Promise<string> => {
          console.log("Creating participant via MWA:", { id: id.toString(), user: user.toString() });
          
          const signature = await transact(async (wallet: Web3MobileWallet) => {
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

            const transactionSignatures = await wallet.signAndSendTransactions({
              transactions: [transaction],
            });

            return transactionSignatures[0];
          });

          return signature;
        },
      }),
      updatedParticipent: (id: BN, user: PublicKey, points: BN) => ({
        rpc: async (): Promise<string> => {
          console.log("Updating participant via MWA:", { 
            id: id.toString(), 
            user: user.toString(), 
            points: points.toString() 
          });
          
          const signature = await transact(async (wallet: Web3MobileWallet) => {
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
                lamports: points.toNumber(),
              }),
            ];

            const txMessage = new TransactionMessage({
              payerKey: authorizedPubkey,
              recentBlockhash: latestBlockhash.blockhash,
              instructions,
            }).compileToV0Message();

            const transaction = new VersionedTransaction(txMessage);

            const transactionSignatures = await wallet.signAndSendTransactions({
              transactions: [transaction],
            });

            return transactionSignatures[0];
          });

          return signature;
        },
      }),
    },
  };

  // Queries - matching blinks-mini exactly
  const accounts = useQuery({
    queryKey: ["dashh", "all", "devnet"],
    queryFn: () => program.account.campaign.all(),
    staleTime: 30000, // 30 seconds
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const paccounts = useQuery({
    queryKey: ["dashh-p", "all", "devnet"],
    queryFn: () => program.account.participent.all(),
    staleTime: 30000, // 30 seconds
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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

      const id = new BN(uuidv4().split("-").join("").slice(0, 8), 16);
      const endtimeAsU64 = new BN(endtime);
      const rewardAsU64 = new BN(reward);

      return await program.methods
        .createCampaign(id, title, description, image, lable, endtimeAsU64, rewardAsU64)
        .rpc();
    },
    onSuccess: () => {
      toast.show("Campaign created successfully!");
      accounts.refetch();
    },
    onError: (error) => {
      console.error("Error creating campaign:", error);
      toast.show(`Error creating campaign: ${error.message}`);
    },
  });

  const createParticipant = useMutation<string, Error, participantargs>({
    mutationKey: ["create-Participant", "create", "devnet"],
    mutationFn: async ({ id, user }) => {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      return await program.methods.createParticipent(new BN(id, 16), user).rpc();
    },
    onSuccess: () => {
      toast.show("Joined campaign successfully!");
      accounts.refetch();
    },
    onError: (error) => {
      console.error("Error creating participant:", error);
      toast.show(`Error joining campaign: ${error.message}`);
    },
  });

  const updateParticipant = useMutation<string, Error, participantargs>({
    mutationKey: ["update-participant", "update", "devnet"],
    mutationFn: async ({ id, user, points }) => {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      return await program.methods
        .updatedParticipent(new BN(id), user, new BN(points))
        .rpc();
    },
    onSuccess: () => {
      toast.show("Points updated successfully!");
      accounts.refetch();
    },
    onError: (error) => {
      console.error("Error updating participant:", error);
      toast.show(`Error updating points: ${error.message}`);
    },
  });

  return {
    program: getProgramAccount.data ? program : null,
    programId: PROGRAM_ID,
    accounts,
    paccounts,
    getProgramAccount,
    createCampaign,
    createParticipant,
    updateParticipant,
  };
}