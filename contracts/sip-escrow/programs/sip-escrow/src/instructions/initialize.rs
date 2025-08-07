
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

use crate::state::Vault;
use crate::events::{DepositEvent, InitializeVaultEvent};
use crate::errors::VaultError;
#[derive(Accounts)]
#[instruction(campaignid:u64)]
pub struct InitializeVault<'info> {
    #[account(mut)]
    pub creater: Signer<'info>,
    #[account(
        init, 
        payer = creater, 
        // space = discriminant + account size
        space = 8 + Vault::INIT_SPACE,
        seeds = [b"vault", creater.key().as_ref(), campaignid.to_le_bytes().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

pub fn _init_vault(
    ctx: Context<InitializeVault>,
    campaignid: u64,
    deadline: u64,
    authority: Pubkey,
    amount: u64,
) -> Result<()> {

 ctx.accounts.vault.set_inner(
Vault{
    id: campaignid.to_string(),
    is_dispersed: false,
    deadline,
    authority,
    bump: ctx.bumps.vault
  }
 );



  emit!(InitializeVaultEvent {
    vault: ctx.accounts.vault.key(),
    vault_authority: ctx.accounts.vault.authority,
    locked: ctx.accounts.vault.is_dispersed,
  });
  msg!("Vault initialized with ID: {}", campaignid);
    _deposit(ctx, amount)?;

  Ok(())
}

 fn _deposit(ctx: Context<InitializeVault>, amount: u64) -> Result<()> {


    let vault = &mut ctx.accounts.vault;
    let depositer = &mut ctx.accounts.creater;
    require!(depositer.lamports() >= amount,VaultError::InsufficientBalance);
    require_eq!(vault.is_dispersed,false,VaultError::VaultLocked);
    msg!("Depositer: {:?}", depositer.key());
    let tx = Transfer{
        from:depositer.to_account_info(),
        to:vault.to_account_info()
    };
    let trasection = CpiContext::new(ctx.accounts.system_program.to_account_info(), tx);

    let res = transfer(trasection, amount);
    match res {
        Ok(_) => {
             emit!(DepositEvent{
        amount,
        user:depositer.key(),
        vault:vault.key()
    });
        },
        Err(e) => {
            msg!("Transfer failed: {:?}", e);
            return Err(VaultError::Overflow.into());
        }

    }

    Ok(())
}