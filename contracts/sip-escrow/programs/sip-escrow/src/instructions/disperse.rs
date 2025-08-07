//-------------------------------------------------------------------------------
///
/// TASK: Implement the withdraw functionality for the on-chain vault
/// 
/// Requirements:
/// - Verify that the vault is not locked
/// - Verify that the vault has enough balance to withdraw
/// - Transfer lamports from vault to vault authority
/// - Emit a withdraw event after successful transfer
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;
use crate::state::Vault;
use crate::errors::VaultError;
use crate::events::WithdrawEvent;
    
#[derive(Accounts)]
#[instruction(creator: Pubkey, campaign_id: u64)]
pub struct Disperse<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    //[b"vault", creater.key().as_ref(), campaignid.to_le_bytes().as_ref()],
    #[account(
        mut,
        seeds = [b"vault", creator.key().as_ref(), campaign_id.to_le_bytes().as_ref()],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

     /// CHECK: Top‐3 winners (just their Pubkeys)
     #[account(mut)] pub winner1: UncheckedAccount<'info>,
     /// CHECK: Top‐3 winners (just their Pubkeys)
     #[account(mut)] pub winner2: UncheckedAccount<'info>,
     /// CHECK: Top‐3 winners (just their Pubkeys)
    #[account(mut)] pub winner3: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn _withdraw(ctx: Context<Disperse>, _creator: Pubkey, _campaign_id: u64) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    require_eq!(vault.is_dispersed, false, VaultError::VaultLocked);
    require_eq!(vault.authority.key(), ctx.accounts.authority.key(), VaultError::Overflow);
    let total_amount = vault.to_account_info().lamports(); // Assuming equal distribution for simplicity
    let w1 = total_amount * 50 / 100;
let w2 = total_amount * 30 / 100;
let w3 = total_amount * 20 / 100;
**ctx.accounts.winner1.to_account_info().try_borrow_mut_lamports()? += w1;
**ctx.accounts.winner2.to_account_info().try_borrow_mut_lamports()? += w2;
**ctx.accounts.winner3.to_account_info().try_borrow_mut_lamports()? += w3;
**vault.to_account_info().try_borrow_mut_lamports()? = 0;
vault.is_dispersed = true;

    // Emit the WithdrawEvent

emit!(WithdrawEvent {
    campaign_id: _campaign_id.to_string(),
    w1,
    w2,
    w3,
    vault: vault.key()
}); 
    Ok(())
}