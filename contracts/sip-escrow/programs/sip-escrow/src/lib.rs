#![allow(unexpected_cfgs)]

//===============================================================================
///
/// SOLANA ON-CHAIN VAULT TASK
/// 
/// Your task is to complete the implementation of a Solana on-chain vault program.
/// The vault allows users to deposit SOL, withdraw SOL (if they're the authority),
/// and toggle the vault's lock state.
/// 
/// INSTRUCTIONS:
/// - Only modify code where you find TODO comments
/// - Follow the requirements specified in each instruction file
/// - Use the initialize instruction as a reference implementation
/// 
/// GENERAL HINTS:
/// - Use appropriate errors from errors.rs
/// - Use appropriate events from events.rs  
/// - Study account constraints in the initialize instruction
/// - Imports
/// 
/// GOOD LUCK!
/// 
///===============================================================================

use anchor_lang::prelude::*;
mod instructions;
mod state;
mod errors;
mod events;

use instructions::*;

declare_id!("JAXfUBqk3rTzyFPq1NPBv3S4HUCUfcsuo1oT5GzGXMgt");

#[program]
pub mod sip_vault {

    use super::*;

    pub fn initialize(
        ctx: Context<InitializeVault>,
        campaignid: u64,
        deadline: u64,
        authority: Pubkey,
        amount: u64
    ) -> Result<()> {
       _init_vault(ctx, campaignid, deadline, authority,amount)
        
    }

    /// 2) Disburse the SOL in the vault to the top-3 winners (50/30/20)
    pub fn disburse_rewards(
        ctx: Context<Disperse>,
        creater: Pubkey,
        campaignid: u64,

    ) -> Result<()> {
        _withdraw(ctx, creater, campaignid)
    }



}
