use solana_program::program::invoke;
use spl_associated_token_account::get_associated_token_address_with_program_id;
use spl_token_2022::{
    extension::StateWithExtensions,
    state::{Account, Mint},
};

use super::*;

use crate::{
    errors::GumballGuardError,
    state::GuardType,
    utils::{assert_keys_equal, assert_owned_by, get_bps_of},
};

/// Guard that charges an amount in a specified spl-token as payment for the mint.
///
/// List of accounts required:
///
///   0. `[writable]` Token account holding the required amount.
///   1. `[writable]` Address of the ATA to receive the tokens.
///   2. `[]` Mint account.
///   3. `[]` SPL Token-2022 program account.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Token2022Payment {
    pub amount: u64,
    pub mint: Pubkey,
    pub destination_ata: Pubkey,
}

impl Guard for Token2022Payment {
    fn size() -> usize {
        8    // amount
        + 32 // token mint
        + 32 // destination ata
    }

    fn mask() -> u64 {
        GuardType::as_mask(GuardType::Token2022Payment)
    }
}

impl Condition for Token2022Payment {
    fn validate<'info>(
        &self,
        ctx: &mut EvaluationContext,
        _guard_set: &GuardSet,
        _mint_args: &[u8],
    ) -> Result<()> {
        require!(
            ctx.accounts.gumball_machine.settings.payment_mint == self.mint,
            GumballGuardError::InvalidPaymentMint
        );

        // required accounts
        let token_account_index = ctx.account_cursor;
        let token_account_info = try_get_account_info(ctx.accounts.remaining, token_account_index)?;
        let destination_ata =
            try_get_account_info(ctx.accounts.remaining, token_account_index + 1)?;
        let mint_info = try_get_account_info(ctx.accounts.remaining, token_account_index + 2)?;
        let spl_token_2022_program =
            try_get_account_info(ctx.accounts.remaining, token_account_index + 3)?;
        ctx.account_cursor += 3;

        if let Some(fee_config) = ctx.accounts.gumball_machine.marketplace_fee_config {
            if ctx.accounts.gumball_machine.version > 0 {
                ctx.account_cursor += 1;

                let fee_ata =
                    try_get_account_info(ctx.accounts.remaining, token_account_index + 4)?;
                let expected_ata = get_associated_token_address_with_program_id(
                    &fee_config.fee_account,
                    &self.mint,
                    &spl_token_2022_program.key,
                );

                assert_keys_equal(&fee_ata.key, &expected_ata)?;
            }
        }

        // destination
        assert_keys_equal(destination_ata.key, &self.destination_ata)?;
        let data = destination_ata.data.borrow();
        let ata_account = StateWithExtensions::<Account>::unpack(&data)?;
        assert_keys_equal(&ata_account.base.mint, &self.mint)?;

        // token
        assert_owned_by(token_account_info, &spl_token_2022::ID)?;
        let data = token_account_info.data.borrow();
        let token_account = StateWithExtensions::<Account>::unpack(&data)?;
        assert_keys_equal(&token_account.base.owner, ctx.accounts.buyer.key)?;
        assert_keys_equal(&token_account.base.mint, &self.mint)?;

        if token_account.base.amount < self.amount {
            return err!(GumballGuardError::NotEnoughTokens);
        }

        // mint
        assert_keys_equal(mint_info.key, &self.mint)?;

        // program
        assert_keys_equal(spl_token_2022_program.key, &spl_token_2022::ID)?;

        ctx.indices
            .insert("token2022_payment_index", token_account_index);

        Ok(())
    }

    fn pre_actions<'info>(
        &self,
        ctx: &mut EvaluationContext,
        _guard_set: &GuardSet,
        _mint_args: &[u8],
    ) -> Result<()> {
        let index = ctx.indices["token2022_payment_index"];
        // the accounts have already been validated
        let token_account_info = try_get_account_info(ctx.accounts.remaining, index)?;
        let destination_ata = try_get_account_info(ctx.accounts.remaining, index + 1)?;
        let mint_info = try_get_account_info(ctx.accounts.remaining, index + 2)?;
        let spl_token_2022_program = try_get_account_info(ctx.accounts.remaining, index + 3)?;

        let data = mint_info.data.borrow();
        let mint = StateWithExtensions::<Mint>::unpack(&data)?;

        let marketplace_fee_bps =
            if let Some(fee_confg) = ctx.accounts.gumball_machine.marketplace_fee_config {
                // Version 0 takes fee on claim, so no fee on draw
                if ctx.accounts.gumball_machine.version == 0 {
                    0
                } else {
                    fee_confg.fee_bps
                }
            } else {
                0
            };

        let marketplace_fee = get_bps_of(self.amount, marketplace_fee_bps)?;
        msg!("Marketplace fee: {}", marketplace_fee);

        if marketplace_fee > 0 {
            let fee_destination_ata = try_get_account_info(ctx.accounts.remaining, index + 4)?;

            invoke(
                &spl_token_2022::instruction::transfer_checked(
                    spl_token_2022_program.key,
                    token_account_info.key,
                    &self.mint,
                    fee_destination_ata.key,
                    ctx.accounts.buyer.key,
                    &[],
                    marketplace_fee,
                    mint.base.decimals,
                )?,
                &[
                    token_account_info.clone(),
                    fee_destination_ata.clone(),
                    ctx.accounts.buyer.clone(),
                    spl_token_2022_program.clone(),
                    mint_info.clone(),
                ],
            )?;
        }

        let price_less_fees = self
            .amount
            .checked_sub(marketplace_fee)
            .ok_or(GumballGuardError::NumericalOverflowError)?;

        invoke(
            &spl_token_2022::instruction::transfer_checked(
                spl_token_2022_program.key,
                token_account_info.key,
                &self.mint,
                destination_ata.key,
                ctx.accounts.buyer.key,
                &[],
                price_less_fees,
                mint.base.decimals,
            )?,
            &[
                token_account_info.clone(),
                destination_ata.clone(),
                ctx.accounts.buyer.clone(),
                spl_token_2022_program.clone(),
                mint_info.clone(),
            ],
        )?;

        cpi_increment_total_revenue(ctx, self.amount)?;

        Ok(())
    }
}
