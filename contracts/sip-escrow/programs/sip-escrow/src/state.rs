use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Vault {
    #[max_len(32)]
    pub id: String,
    pub is_dispersed: bool,
    pub deadline: u64,
    pub authority: Pubkey,
    pub bump: u8,
}

// 4+32+1+8+32+1 = 78 bytes
