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
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  findEventAuthorityPda,
  findGumballMachineAuthorityPda,
} from '../../hooked';
import {
  expectPublicKey,
  getAccountMetasAndSigners,
  ResolvedAccount,
  ResolvedAccountsWithIndices,
} from '../shared';

// Accounts.
export type ClaimTokensInstructionAccounts = {
  /** Anyone can settle the sale */
  payer?: Signer;
  /** Gumball machine account. */
  gumballMachine: PublicKey | Pda;
  authorityPda?: PublicKey | Pda;
  /** Gumball machine authority */
  authority?: PublicKey | Pda;
  /** Seller of the nft */
  seller: PublicKey | Pda;
  /** buyer of the nft */
  buyer: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  associatedTokenProgram?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
  rent?: PublicKey | Pda;
  mint: PublicKey | Pda;
  buyerTokenAccount: PublicKey | Pda;
  authorityPdaTokenAccount: PublicKey | Pda;
  eventAuthority?: PublicKey | Pda;
  program?: PublicKey | Pda;
};

// Data.
export type ClaimTokensInstructionData = {
  discriminator: Array<number>;
  index: number;
};

export type ClaimTokensInstructionDataArgs = { index: number };

export function getClaimTokensInstructionDataSerializer(): Serializer<
  ClaimTokensInstructionDataArgs,
  ClaimTokensInstructionData
> {
  return mapSerializer<
    ClaimTokensInstructionDataArgs,
    any,
    ClaimTokensInstructionData
  >(
    struct<ClaimTokensInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['index', u32()],
      ],
      { description: 'ClaimTokensInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [108, 216, 210, 231, 0, 212, 42, 64],
    })
  ) as Serializer<ClaimTokensInstructionDataArgs, ClaimTokensInstructionData>;
}

// Args.
export type ClaimTokensInstructionArgs = ClaimTokensInstructionDataArgs;

// Instruction.
export function claimTokens(
  context: Pick<Context, 'eddsa' | 'identity' | 'payer' | 'programs'>,
  input: ClaimTokensInstructionAccounts & ClaimTokensInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'mallowGumball',
    'MGUMqztv7MHgoHBYWbvMyL3E3NJ4UHfTwgLJUQAbKGa'
  );

  // Accounts.
  const resolvedAccounts: ResolvedAccountsWithIndices = {
    payer: { index: 0, isWritable: true, value: input.payer ?? null },
    gumballMachine: {
      index: 1,
      isWritable: true,
      value: input.gumballMachine ?? null,
    },
    authorityPda: {
      index: 2,
      isWritable: true,
      value: input.authorityPda ?? null,
    },
    authority: { index: 3, isWritable: true, value: input.authority ?? null },
    seller: { index: 4, isWritable: true, value: input.seller ?? null },
    buyer: { index: 5, isWritable: false, value: input.buyer ?? null },
    tokenProgram: {
      index: 6,
      isWritable: false,
      value: input.tokenProgram ?? null,
    },
    associatedTokenProgram: {
      index: 7,
      isWritable: false,
      value: input.associatedTokenProgram ?? null,
    },
    systemProgram: {
      index: 8,
      isWritable: false,
      value: input.systemProgram ?? null,
    },
    rent: { index: 9, isWritable: false, value: input.rent ?? null },
    mint: { index: 10, isWritable: false, value: input.mint ?? null },
    buyerTokenAccount: {
      index: 11,
      isWritable: true,
      value: input.buyerTokenAccount ?? null,
    },
    authorityPdaTokenAccount: {
      index: 12,
      isWritable: true,
      value: input.authorityPdaTokenAccount ?? null,
    },
    eventAuthority: {
      index: 13,
      isWritable: false,
      value: input.eventAuthority ?? null,
    },
    program: { index: 14, isWritable: false, value: input.program ?? null },
  };

  // Arguments.
  const resolvedArgs: ClaimTokensInstructionArgs = { ...input };

  // Default values.
  if (!resolvedAccounts.payer.value) {
    resolvedAccounts.payer.value = context.payer;
  }
  if (!resolvedAccounts.authorityPda.value) {
    resolvedAccounts.authorityPda.value = findGumballMachineAuthorityPda(
      context,
      { gumballMachine: expectPublicKey(resolvedAccounts.gumballMachine.value) }
    );
  }
  if (!resolvedAccounts.authority.value) {
    resolvedAccounts.authority.value = context.identity.publicKey;
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
  if (!resolvedAccounts.eventAuthority.value) {
    resolvedAccounts.eventAuthority.value = findEventAuthorityPda(context);
  }
  if (!resolvedAccounts.program.value) {
    resolvedAccounts.program.value = context.programs.getPublicKey(
      'mallowGumball',
      'MGUMqztv7MHgoHBYWbvMyL3E3NJ4UHfTwgLJUQAbKGa'
    );
    resolvedAccounts.program.isWritable = false;
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
  const data = getClaimTokensInstructionDataSerializer().serialize(
    resolvedArgs as ClaimTokensInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
