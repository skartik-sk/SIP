use anchor_lang::prelude::*;

#[event]
pub struct InitializeVaultEvent {
    pub vault: Pubkey,
    pub vault_authority: Pubkey,
    pub locked: bool,
}

#[event]
pub struct DepositEvent {
    pub amount: u64,
    pub user: Pubkey,
    pub vault: Pubkey,
}

#[event]
pub struct WithdrawEvent {
    pub campaign_id: String,
    pub w1: u64,
    pub w2: u64,
    pub w3: u64,
    pub vault: Pubkey,
}

#[event]
pub struct ToggleLockEvent {
    pub vault: Pubkey,
    pub vault_authority: Pubkey,
    pub locked: bool,
}