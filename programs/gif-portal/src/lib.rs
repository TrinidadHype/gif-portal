use anchor_lang::prelude::*;

declare_id!("GWnfF71VZSD6teEg6qjrCycnVAaidHFg8z4VHpJpdwyr");

#[program]
pub mod gif_portal {
    use super::*;

    pub fn initialize(ctx: Context<InitGIF>) -> Result<()> {
        let gif_account = &mut ctx.accounts.gif_account;
        gif_account.num_gifs = 0;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitGIF<'info> {
    #[account(init, payer = user, space = 9000)]
    pub gif_account: Account<'info, GifAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct GifAccount {
    pub num_gifs: u64,
}
