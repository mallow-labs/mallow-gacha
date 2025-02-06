use crate::{
    constants::{AUTHORITY_SEED, SELLER_HISTORY_SEED},
    processors,
    state::GumballMachine,
    AssociatedToken, GumballError, SellerHistory, Token,
};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};
use utils::transfer_spl;

/// Add nft to a gumball machine.
#[derive(Accounts)]
pub struct RemoveTokens<'info> {
    /// Gumball Machine account.
    #[account(
        mut,
        constraint = gumball_machine.can_edit_items() @ GumballError::InvalidState,
    )]
    gumball_machine: Account<'info, GumballMachine>,

    /// Seller history account.
    #[account(
		mut,
		seeds = [
			SELLER_HISTORY_SEED.as_bytes(),
			gumball_machine.key().as_ref(),
            seller.key().as_ref(),
		],
		bump,
        has_one = gumball_machine,
        has_one = seller,
	)]
    seller_history: Box<Account<'info, SellerHistory>>,

    /// CHECK: Safe due to seeds constraint
    #[account(
        mut,
        seeds = [AUTHORITY_SEED.as_bytes(), gumball_machine.to_account_info().key.as_ref()],
        bump
    )]
    authority_pda: UncheckedAccount<'info>,

    /// Authority allowed to remove the nft (must be the gumball machine auth or the seller of the nft)
    authority: Signer<'info>,

    /// CHECK: Safe due to item seller check
    #[account(mut)]
    seller: UncheckedAccount<'info>,

    mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        constraint = token_account.mint == mint.key(),
        constraint = token_account.owner == seller.key(),
    )]
    token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = authority_pda_token_account.mint == mint.key(),
        constraint = authority_pda_token_account.owner == authority_pda.key(),
    )]
    authority_pda_token_account: Box<Account<'info, TokenAccount>>,

    token_program: Program<'info, Token>,
    associated_token_program: Program<'info, AssociatedToken>,
    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
}

pub fn remove_tokens(ctx: Context<RemoveTokens>, index: u32, amount: u64) -> Result<()> {
    let system_program = &ctx.accounts.system_program.to_account_info();
    let rent = &ctx.accounts.rent.to_account_info();
    let token_program = &ctx.accounts.token_program.to_account_info();
    let associated_token_program = &ctx.accounts.associated_token_program.to_account_info();
    let authority_pda_token_account = &ctx.accounts.authority_pda_token_account.to_account_info();
    let seller_token_account = &ctx.accounts.token_account.to_account_info();
    let authority_pda = &ctx.accounts.authority_pda.to_account_info();
    let authority = &ctx.accounts.authority.to_account_info();
    let mint = &ctx.accounts.mint.to_account_info();
    let seller = &ctx.accounts.seller.to_account_info();
    let gumball_machine = &mut ctx.accounts.gumball_machine;
    let seller_history = &mut ctx.accounts.seller_history;

    processors::remove_item(
        gumball_machine,
        authority.key(),
        mint.key(),
        seller.key(),
        index,
        amount,
    )?;

    let auth_seeds = [
        AUTHORITY_SEED.as_bytes(),
        ctx.accounts.gumball_machine.to_account_info().key.as_ref(),
        &[ctx.bumps.authority_pda],
    ];

    transfer_spl(
        authority_pda,
        seller,
        authority_pda_token_account,
        seller_token_account,
        mint,
        authority,
        associated_token_program,
        token_program,
        system_program,
        rent,
        Some(authority_pda),
        Some(&auth_seeds),
        None,
        amount,
    )?;

    seller_history.item_count -= 1;

    if seller_history.item_count == 0 {
        seller_history.close(seller.to_account_info())?;
    }

    Ok(())
}
