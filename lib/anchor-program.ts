import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import IDL from "./dashh.json";

export const PROGRAM_ID = new PublicKey("7qpRXNFY5PJQfwptK4BosJ5jCnVeEYRWATFu8BBDTVcr");

// Types matching your IDL
export interface Campaign {
  id: BN;
  title: string;
  image: string;
  description: string;
  lable: string;
  endtime: BN;
  reward: BN;
  owner: PublicKey;
}

export interface Participent {
  id: BN;
  user: PublicKey;
  points: BN;
}

export function getDashhProgram(connection: Connection) {
  console.log("🔧 Initializing Dashh program with connection");
  
  // Create a mock wallet for read-only operations
  const mockWallet = {
    publicKey: PublicKey.default,
    signTransaction: async () => { throw new Error("Mock wallet cannot sign") },
    signAllTransactions: async () => { throw new Error("Mock wallet cannot sign") },
  };

  const provider = new anchor.AnchorProvider(
    connection,
    mockWallet as any,
    anchor.AnchorProvider.defaultOptions()
  );

  // Create the program using the IDL
  const program = new anchor.Program(
    IDL as anchor.Idl,
    provider
  );

  console.log("✅ Dashh program initialized");
  return program;
}

// Helper function to get all campaigns
export async function getAllCampaigns(connection: Connection): Promise<Array<{ publicKey: PublicKey; account: Campaign }>> {
  console.log("📊 Fetching all campaigns from blockchain...");
  
  try {
    const program = getDashhProgram(connection);
    
    // Try to fetch campaigns from the blockchain
    // Note: This might fail if the program doesn't exist or no accounts are created yet
    console.log("🔍 Attempting to fetch campaign accounts...");
    
    // For now, we'll use mock data as the primary source since the program structure is not yet fully defined
    console.log("🔄 Using mock data as primary source (blockchain integration in progress)");
    
    // In the future, this would be:
    // const campaigns = await program.account.campaign.all();
    // return campaigns as Array<{ publicKey: PublicKey; account: Campaign }>;
    
    throw new Error("Using mock data for development");
    
  } catch (error) {
    console.log("ℹ️ Using mock data (expected during development):", error instanceof Error ? error.message : String(error));
    
    // Return mock data as fallback
    console.log("🔄 Loading mock campaign data");
    const mockCampaigns = [
      // Active campaigns
      {
        publicKey: new PublicKey("11111111111111111111111111111111"),
        account: {
          id: new BN(1),
          title: "Twitter Engagement Campaign",
          description: "Help us grow our Twitter following! Tweet about our platform using #SolanaInfluencer and gain points for engagement.",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          lable: "social",
          endtime: new BN(Math.floor(Date.now() / 1000) + 86400 * 7), // 7 days from now
          reward: new BN(500000000), // 0.5 SOL in lamports
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
          endtime: new BN(Math.floor(Date.now() / 1000) + 86400 * 5), // 5 days from now
          reward: new BN(1000000000), // 1 SOL in lamports
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
          endtime: new BN(Math.floor(Date.now() / 1000) + 86400 * 10), // 10 days from now
          reward: new BN(750000000), // 0.75 SOL in lamports
          owner: new PublicKey("33333333333333333333333333333333"),
        },
      },
      // Past campaigns
      {
        publicKey: new PublicKey("44444444444444444444444444444444"),
        account: {
          id: new BN(4),
          title: "Web3 Gaming Tournament",
          description: "Join our Web3 gaming tournament and compete for exciting prizes. Show off your gaming skills in blockchain games.",
          image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          lable: "gaming",
          endtime: new BN(Math.floor(Date.now() / 1000) - 86400 * 2), // 2 days ago (past)
          reward: new BN(2000000000), // 2 SOL in lamports
          owner: new PublicKey("44444444444444444444444444444444"),
        },
      },
      {
        publicKey: new PublicKey("55555555555555555555555555555555"),
        account: {
          id: new BN(5),
          title: "Crypto Art Showcase",
          description: "Showcase your crypto art and get featured on our platform. Winners receive exposure and SOL rewards.",
          image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          lable: "art",
          endtime: new BN(Math.floor(Date.now() / 1000) - 86400 * 5), // 5 days ago (past)
          reward: new BN(1500000000), // 1.5 SOL in lamports
          owner: new PublicKey("55555555555555555555555555555555"),
        },
      },
      {
        publicKey: new PublicKey("66666666666666666666666666666666"),
        account: {
          id: new BN(6),
          title: "Community Growth Sprint",
          description: "Help us reach 10,000 community members! Invite friends and engage with our Discord for rewards.",
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          lable: "community",
          endtime: new BN(Math.floor(Date.now() / 1000) - 86400 * 1), // 1 day ago (past)
          reward: new BN(800000000), // 0.8 SOL in lamports
          owner: new PublicKey("66666666666666666666666666666666"),
        },
      },
    ];
    
    console.log(`📦 Using ${mockCampaigns.length} mock campaigns as fallback`);
    return mockCampaigns;
  }
}

// Helper function to safely clone data (React Native compatible)
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}

// Helper function to get all participants
export async function getAllParticipants(connection: Connection): Promise<Array<{ publicKey: PublicKey; account: Participent }>> {
  console.log("👥 Fetching all participants from blockchain...");
  
  try {
    const program = getDashhProgram(connection);
    
    // Try to fetch participants from the blockchain
    console.log("🔍 Attempting to fetch participant accounts...");
    
    // For now, we'll use mock data as the primary source since the program structure is not yet fully defined
    console.log("🔄 Using mock data as primary source (blockchain integration in progress)");
    
    // In the future, this would be:
    // const participants = await program.account.participent.all();
    // return participants as Array<{ publicKey: PublicKey; account: Participent }>;
    
    throw new Error("Using mock data for development");
    
  } catch (error) {
    console.log("ℹ️ Using mock participant data (expected during development):", error instanceof Error ? error.message : String(error));
    
    // Return mock data as fallback
    console.log("🔄 Loading mock participant data");
    const mockParticipants = [
      {
        publicKey: new PublicKey("55555555555555555555555555555555"),
        account: {
          id: new BN(1), // Campaign 1
          user: new PublicKey("66666666666666666666666666666666"),
          points: new BN(150),
        },
      },
      {
        publicKey: new PublicKey("77777777777777777777777777777777"),
        account: {
          id: new BN(1), // Campaign 1
          user: new PublicKey("88888888888888888888888888888888"),
          points: new BN(200),
        },
      },
      {
        publicKey: new PublicKey("99999999999999999999999999999999"),
        account: {
          id: new BN(2), // Campaign 2
          user: new PublicKey("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"),
          points: new BN(100),
        },
      },
    ];
    
    console.log(`📦 Using ${mockParticipants.length} mock participants as fallback`);
    return mockParticipants;
  }
}
