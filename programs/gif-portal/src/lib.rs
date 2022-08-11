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

    pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> Result<()> {
        // Get a reference to the account and increment total_gifs.
        let base_account = &mut ctx.accounts.gif_account;
        let user = &mut ctx.accounts.user;

        let item = ItemStruct {
            gif_link: gif_link.to_string(),
            user_address: *user.to_account_info().key,
        };

        base_account.gif_list.push(item);
        base_account.num_gifs += 1;
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

#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub gif_account: Account<'info, GifAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct GifAccount {
    pub num_gifs: u64,
    pub gif_list: Vec<ItemStruct>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}
