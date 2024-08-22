/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Context,
  Pda,
  PublicKey,
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
export type RemoveCoreAssetInstructionAccounts = {
  /** Gumball Machine account. */
  gumballMachine: PublicKey | Pda;
  /** Seller history account. */
  sellerHistory?: PublicKey | Pda;
  authorityPda?: PublicKey | Pda;
  /** Seller of the asset. */
  authority?: Signer;
  seller?: PublicKey | Pda;
  asset: PublicKey | Pda;
  /** Core asset's collection if it's part of one. */
  collection?: PublicKey | Pda;
  mplCoreProgram?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
};

// Data.
export type RemoveCoreAssetInstructionData = {
  discriminator: Array<number>;
  index: number;
};

export type RemoveCoreAssetInstructionDataArgs = { index: number };

export function getRemoveCoreAssetInstructionDataSerializer(): Serializer<
  RemoveCoreAssetInstructionDataArgs,
  RemoveCoreAssetInstructionData
> {
  return mapSerializer<
    RemoveCoreAssetInstructionDataArgs,
    any,
    RemoveCoreAssetInstructionData
  >(
    struct<RemoveCoreAssetInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['index', u32()],
      ],
      { description: 'RemoveCoreAssetInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [65, 17, 71, 132, 145, 88, 237, 166],
    })
  ) as Serializer<
    RemoveCoreAssetInstructionDataArgs,
    RemoveCoreAssetInstructionData
  >;
}

// Args.
export type RemoveCoreAssetInstructionArgs = RemoveCoreAssetInstructionDataArgs;

// Instruction.
export function removeCoreAsset(
  context: Pick<Context, 'eddsa' | 'identity' | 'programs'>,
  input: RemoveCoreAssetInstructionAccounts & RemoveCoreAssetInstructionArgs
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
    authority: { index: 3, isWritable: false, value: input.authority ?? null },
    seller: { index: 4, isWritable: true, value: input.seller ?? null },
    asset: { index: 5, isWritable: true, value: input.asset ?? null },
    collection: { index: 6, isWritable: true, value: input.collection ?? null },
    mplCoreProgram: {
      index: 7,
      isWritable: false,
      value: input.mplCoreProgram ?? null,
    },
    systemProgram: {
      index: 8,
      isWritable: false,
      value: input.systemProgram ?? null,
    },
  };

  // Arguments.
  const resolvedArgs: RemoveCoreAssetInstructionArgs = { ...input };

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
  if (!resolvedAccounts.mplCoreProgram.value) {
    resolvedAccounts.mplCoreProgram.value = context.programs.getPublicKey(
      'mplCoreProgram',
      'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'
    );
    resolvedAccounts.mplCoreProgram.isWritable = false;
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
  const data = getRemoveCoreAssetInstructionDataSerializer().serialize(
    resolvedArgs as RemoveCoreAssetInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
