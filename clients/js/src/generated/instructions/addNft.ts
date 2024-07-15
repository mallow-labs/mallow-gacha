/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  findMasterEditionPda,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import {
  Context,
  none,
  Option,
  OptionOrNullable,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  array,
  bytes,
  mapSerializer,
  option,
  Serializer,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { findCandyMachineAuthorityPda } from '../../hooked';
import { findSellerHistoryPda } from '../accounts';
import {
  expectPublicKey,
  getAccountMetasAndSigners,
  ResolvedAccount,
  ResolvedAccountsWithIndices,
} from '../shared';

// Accounts.
export type AddNftInstructionAccounts = {
  /** Candy Machine account. */
  candyMachine: PublicKey | Pda;
  /** Seller history account. */
  sellerHistory?: PublicKey | Pda;
  authorityPda?: PublicKey | Pda;
  /** Seller of the nft */
  seller?: Signer;
  mint: PublicKey | Pda;
  tokenAccount?: PublicKey | Pda;
  metadata?: PublicKey | Pda;
  edition?: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  tokenMetadataProgram?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
};

// Data.
export type AddNftInstructionData = {
  discriminator: Array<number>;
  sellerProofPath: Option<Array<Uint8Array>>;
};

export type AddNftInstructionDataArgs = {
  sellerProofPath?: OptionOrNullable<Array<Uint8Array>>;
};

export function getAddNftInstructionDataSerializer(): Serializer<
  AddNftInstructionDataArgs,
  AddNftInstructionData
> {
  return mapSerializer<AddNftInstructionDataArgs, any, AddNftInstructionData>(
    struct<AddNftInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['sellerProofPath', option(array(bytes({ size: 32 })))],
      ],
      { description: 'AddNftInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [55, 57, 85, 145, 81, 134, 220, 223],
      sellerProofPath: value.sellerProofPath ?? none(),
    })
  ) as Serializer<AddNftInstructionDataArgs, AddNftInstructionData>;
}

// Args.
export type AddNftInstructionArgs = AddNftInstructionDataArgs;

// Instruction.
export function addNft(
  context: Pick<Context, 'eddsa' | 'identity' | 'programs'>,
  input: AddNftInstructionAccounts & AddNftInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplCandyMachineCore',
    'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
  );

  // Accounts.
  const resolvedAccounts: ResolvedAccountsWithIndices = {
    candyMachine: {
      index: 0,
      isWritable: true,
      value: input.candyMachine ?? null,
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
    seller: { index: 3, isWritable: true, value: input.seller ?? null },
    mint: { index: 4, isWritable: false, value: input.mint ?? null },
    tokenAccount: {
      index: 5,
      isWritable: true,
      value: input.tokenAccount ?? null,
    },
    metadata: { index: 6, isWritable: false, value: input.metadata ?? null },
    edition: { index: 7, isWritable: false, value: input.edition ?? null },
    tokenProgram: {
      index: 8,
      isWritable: false,
      value: input.tokenProgram ?? null,
    },
    tokenMetadataProgram: {
      index: 9,
      isWritable: false,
      value: input.tokenMetadataProgram ?? null,
    },
    systemProgram: {
      index: 10,
      isWritable: false,
      value: input.systemProgram ?? null,
    },
  };

  // Arguments.
  const resolvedArgs: AddNftInstructionArgs = { ...input };

  // Default values.
  if (!resolvedAccounts.seller.value) {
    resolvedAccounts.seller.value = context.identity;
  }
  if (!resolvedAccounts.sellerHistory.value) {
    resolvedAccounts.sellerHistory.value = findSellerHistoryPda(context, {
      candyMachine: expectPublicKey(resolvedAccounts.candyMachine.value),
      seller: expectPublicKey(resolvedAccounts.seller.value),
    });
  }
  if (!resolvedAccounts.authorityPda.value) {
    resolvedAccounts.authorityPda.value = findCandyMachineAuthorityPda(
      context,
      { candyMachine: expectPublicKey(resolvedAccounts.candyMachine.value) }
    );
  }
  if (!resolvedAccounts.tokenAccount.value) {
    resolvedAccounts.tokenAccount.value = findAssociatedTokenPda(context, {
      mint: expectPublicKey(resolvedAccounts.mint.value),
      owner: expectPublicKey(resolvedAccounts.seller.value),
    });
  }
  if (!resolvedAccounts.metadata.value) {
    resolvedAccounts.metadata.value = findMetadataPda(context, {
      mint: expectPublicKey(resolvedAccounts.mint.value),
    });
  }
  if (!resolvedAccounts.edition.value) {
    resolvedAccounts.edition.value = findMasterEditionPda(context, {
      mint: expectPublicKey(resolvedAccounts.mint.value),
    });
  }
  if (!resolvedAccounts.tokenProgram.value) {
    resolvedAccounts.tokenProgram.value = context.programs.getPublicKey(
      'splToken',
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    );
    resolvedAccounts.tokenProgram.isWritable = false;
  }
  if (!resolvedAccounts.tokenMetadataProgram.value) {
    resolvedAccounts.tokenMetadataProgram.value = context.programs.getPublicKey(
      'mplTokenMetadata',
      'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
    );
    resolvedAccounts.tokenMetadataProgram.isWritable = false;
  }
  if (!resolvedAccounts.systemProgram.value) {
    resolvedAccounts.systemProgram.value = context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    );
    resolvedAccounts.systemProgram.isWritable = false;
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
  const data = getAddNftInstructionDataSerializer().serialize(
    resolvedArgs as AddNftInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
