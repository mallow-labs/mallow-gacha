/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import {
  Context,
  Pda,
  PublicKey,
  publicKey,
  Signer,
  TransactionBuilder,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  array,
  mapSerializer,
  Serializer,
  struct,
  u32,
  u64,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { findGumballMachineAuthorityPda } from '../../hooked';
import { findSellerHistoryPda } from '../accounts';
import {
  expectPublicKey,
  getAccountMetasAndSigners,
  ResolvedAccount,
  ResolvedAccountsWithIndices,
} from '../shared';

// Accounts.
export type RemoveTokensInstructionAccounts = {
  /** Gumball Machine account. */
  gumballMachine: PublicKey | Pda;
  /** Seller history account. */
  sellerHistory?: PublicKey | Pda;
  authorityPda?: PublicKey | Pda;
  /** Authority allowed to remove the nft (must be the gumball machine auth or the seller of the nft) */
  authority?: Signer;
  seller?: PublicKey | Pda;
  mint: PublicKey | Pda;
  tokenAccount?: PublicKey | Pda;
  authorityPdaTokenAccount?: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  associatedTokenProgram?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
  rent?: PublicKey | Pda;
};

// Data.
export type RemoveTokensInstructionData = {
  discriminator: Array<number>;
  index: number;
  amount: bigint;
};

export type RemoveTokensInstructionDataArgs = {
  index: number;
  amount: number | bigint;
};

export function getRemoveTokensInstructionDataSerializer(): Serializer<
  RemoveTokensInstructionDataArgs,
  RemoveTokensInstructionData
> {
  return mapSerializer<
    RemoveTokensInstructionDataArgs,
    any,
    RemoveTokensInstructionData
  >(
    struct<RemoveTokensInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['index', u32()],
        ['amount', u64()],
      ],
      { description: 'RemoveTokensInstructionData' }
    ),
    (value) => ({ ...value, discriminator: [44, 175, 119, 21, 25, 7, 44, 126] })
  ) as Serializer<RemoveTokensInstructionDataArgs, RemoveTokensInstructionData>;
}

// Args.
export type RemoveTokensInstructionArgs = RemoveTokensInstructionDataArgs;

// Instruction.
export function removeTokens(
  context: Pick<Context, 'eddsa' | 'identity' | 'programs'>,
  input: RemoveTokensInstructionAccounts & RemoveTokensInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'mallowGumball',
    'MGUMqztv7MHgoHBYWbvMyL3E3NJ4UHfTwgLJUQAbKGa'
  );

  // Accounts.
  const resolvedAccounts: ResolvedAccountsWithIndices = {
    gumballMachine: {
      index: 0,
      isWritable: true,
      value: input.gumballMachine ?? null,
    },
    sellerHistory: {
      index: 1,
      isWritable: true,
      value: input.sellerHistory ?? null,
    },
    authorityPda: {
      index: 2,
      isWritable: true,
      value: input.authorityPda ?? null,
    },
    authority: { index: 3, isWritable: true, value: input.authority ?? null },
    seller: { index: 4, isWritable: true, value: input.seller ?? null },
    mint: { index: 5, isWritable: false, value: input.mint ?? null },
    tokenAccount: {
      index: 6,
      isWritable: true,
      value: input.tokenAccount ?? null,
    },
    authorityPdaTokenAccount: {
      index: 7,
      isWritable: true,
      value: input.authorityPdaTokenAccount ?? null,
    },
    tokenProgram: {
      index: 8,
      isWritable: false,
      value: input.tokenProgram ?? null,
    },
    associatedTokenProgram: {
      index: 9,
      isWritable: false,
      value: input.associatedTokenProgram ?? null,
    },
    systemProgram: {
      index: 10,
      isWritable: false,
      value: input.systemProgram ?? null,
    },
    rent: { index: 11, isWritable: false, value: input.rent ?? null },
  };

  // Arguments.
  const resolvedArgs: RemoveTokensInstructionArgs = { ...input };

  // Default values.
  if (!resolvedAccounts.seller.value) {
    resolvedAccounts.seller.value = context.identity.publicKey;
  }
  if (!resolvedAccounts.sellerHistory.value) {
    resolvedAccounts.sellerHistory.value = findSellerHistoryPda(context, {
      gumballMachine: expectPublicKey(resolvedAccounts.gumballMachine.value),
      seller: expectPublicKey(resolvedAccounts.seller.value),
    });
  }
  if (!resolvedAccounts.authorityPda.value) {
    resolvedAccounts.authorityPda.value = findGumballMachineAuthorityPda(
      context,
      { gumballMachine: expectPublicKey(resolvedAccounts.gumballMachine.value) }
    );
  }
  if (!resolvedAccounts.authority.value) {
    resolvedAccounts.authority.value = context.identity;
  }
  if (!resolvedAccounts.tokenAccount.value) {
    resolvedAccounts.tokenAccount.value = findAssociatedTokenPda(context, {
      mint: expectPublicKey(resolvedAccounts.mint.value),
      owner: expectPublicKey(resolvedAccounts.seller.value),
    });
  }
  if (!resolvedAccounts.authorityPdaTokenAccount.value) {
    resolvedAccounts.authorityPdaTokenAccount.value = findAssociatedTokenPda(
      context,
      {
        mint: expectPublicKey(resolvedAccounts.mint.value),
        owner: expectPublicKey(resolvedAccounts.authorityPda.value),
      }
    );
  }
  if (!resolvedAccounts.tokenProgram.value) {
    resolvedAccounts.tokenProgram.value = context.programs.getPublicKey(
      'splToken',
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    );
    resolvedAccounts.tokenProgram.isWritable = false;
  }
  if (!resolvedAccounts.associatedTokenProgram.value) {
    resolvedAccounts.associatedTokenProgram.value =
      context.programs.getPublicKey(
        'splAssociatedToken',
        'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
      );
    resolvedAccounts.associatedTokenProgram.isWritable = false;
  }
  if (!resolvedAccounts.systemProgram.value) {
    resolvedAccounts.systemProgram.value = context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    );
    resolvedAccounts.systemProgram.isWritable = false;
  }
  if (!resolvedAccounts.rent.value) {
    resolvedAccounts.rent.value = publicKey(
      'SysvarRent111111111111111111111111111111111'
    );
  }

  // Accounts in order.
  const orderedAccounts: ResolvedAccount[] = Object.values(
    resolvedAccounts
  ).sort((a, b) => a.index - b.index);

  // Keys and Signers.
  const [keys, signers] = getAccountMetasAndSigners(
    orderedAccounts,
    'programId',
    programId
  );

  // Data.
  const data = getRemoveTokensInstructionDataSerializer().serialize(
    resolvedArgs as RemoveTokensInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
