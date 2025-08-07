import * as anchor from "@coral-xyz/anchor";
import { Program, BN, Provider } from "@coral-xyz/anchor";
import { SipVault } from "../target/types/sip_vault";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { assert } from "chai";

describe("sip-escrow", () => {
  // Configure local cluster provider
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider as Provider);

  // Anchor.toml program "sip_vault" becomes camelCased workspace key
  const program = anchor.workspace.sipVault as Program<SipVault>;
  const authority = (provider.wallet as anchor.Wallet).payer;
  const depositAmount = 1 * LAMPORTS_PER_SOL;
  const now = Math.floor(Date.now() / 1000);
  const deadline = now + 60; // 1 minute from now
  const campaignId = new BN(1);

  // derive the vault PDA
  let vaultPda: PublicKey, vaultBump: number;
  before(async () => {
    [vaultPda, vaultBump] = await PublicKey.findProgramAddress(
      [
        Buffer.from("vault"),
        authority.publicKey.toBuffer(),
        Buffer.from(campaignId.toArray("le", 8)),
      ],
      program.programId
    );
  });

  it("initializes the vault and deposits SOL", async () => {
    // call initialize, which also deposits depositAmount
    const tx = await program.methods
      .initialize(campaignId, new BN(deadline), authority.publicKey, new BN(depositAmount))
      .accounts({
        creater: authority.publicKey,
        vault: vaultPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();
    console.log("initialize tx:", tx);

    // fetch vault account
    const vaultAccount = await program.account.vault.fetch(vaultPda);
    assert.ok(vaultAccount.bump === vaultBump);
    assert.ok(vaultAccount.authority.equals(authority.publicKey));
    assert.ok(vaultAccount.deadline.toNumber() === deadline);

    // vault should hold depositAmount
    const vaultLamports = await provider.connection.getBalance(vaultPda);
    const expectedLamports = depositAmount + (await provider.connection.getMinimumBalanceForRentExemption(86));
    assert.equal(vaultLamports, expectedLamports);
  });

  it("disburses 50/30/20 to three winners", async () => {
    // create 3 empty winner accounts
    const winners = [Keypair.generate(), Keypair.generate(), Keypair.generate()];
    // airdrop a bit so they can pay tx fees
    for (let w of winners) {
      await provider.connection.confirmTransaction(
        await provider.connection.requestAirdrop(w.publicKey, 0.1 * LAMPORTS_PER_SOL),
        "confirmed"
      );
    }

    // record pre‐balances
    const beforeBal = await Promise.all(
      winners.map((w) => provider.connection.getBalance(w.publicKey))
    );

    // call disburse_rewards
    const disburseTx = await program.methods
      .disburseRewards(authority.publicKey, campaignId)
      .accounts({
        authority: authority.publicKey,
        vault: vaultPda,

        winner1: winners[0].publicKey,
        winner2: winners[1].publicKey,
        winner3: winners[2].publicKey,

      }).signers([authority])
      .rpc();
    console.log("disburse tx:", disburseTx);

    // compute expected cuts
    const total = depositAmount;
    const cuts = [
      Math.floor((total * 50) / 100),
      Math.floor((total * 30) / 100),
      Math.floor((total * 20) / 100),
    ];

    // check post‐balances
    const afterBal = await Promise.all(
      winners.map((w) => provider.connection.getBalance(w.publicKey))
    );
    for (let i = 0; i < 3; i++) {
      assert.equal(afterBal[i] - beforeBal[i], cuts[i]);
    }

    // vault should be drained
    const vaultAfter = await provider.connection.getBalance(vaultPda);
    assert.equal(vaultAfter, 0);
  });
});
