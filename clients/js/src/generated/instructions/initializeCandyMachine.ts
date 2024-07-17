/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

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
  mapSerializer,
  option,
  Serializer,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  getAccountMetasAndSigners,
  ResolvedAccount,
  ResolvedAccountsWithIndices,
} from '../shared';
import {
  FeeConfig,
  FeeConfigArgs,
  getFeeConfigSerializer,
  getGumballSettingsSerializer,
  GumballSettings,
  GumballSettingsArgs,
} from '../types';

// Accounts.
export type InitializeCandyMachineInstructionAccounts = {
  /**
   * Candy Machine account. The account space must be allocated to allow accounts larger
   * than 10kb.
   *
   */

  candyMachine: PublicKey | Pda;
  /**
   * Candy Machine authority. This is the address that controls the upate of the candy machine.
   *
   */

  authority?: PublicKey | Pda;
  /** Payer of the transaction. */
  payer?: Signer;
};

// Data.
export type InitializeCandyMachineInstructionData = {
  discriminator: Array<number>;
  settings: GumballSettings;
  feeConfig: Option<FeeConfig>;
};

export type InitializeCandyMachineInstructionDataArgs = {
  settings: GumballSettingsArgs;
  feeConfig?: OptionOrNullable<FeeConfigArgs>;
};

export function getInitializeCandyMachineInstructionDataSerializer(): Serializer<
  InitializeCandyMachineInstructionDataArgs,
  InitializeCandyMachineInstructionData
> {
  return mapSerializer<
    InitializeCandyMachineInstructionDataArgs,
    any,
    InitializeCandyMachineInstructionData
  >(
    struct<InitializeCandyMachineInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['settings', getGumballSettingsSerializer()],
        ['feeConfig', option(getFeeConfigSerializer())],
      ],
      { description: 'InitializeCandyMachineInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      feeConfig: value.feeConfig ?? none(),
    })
  ) as Serializer<
    InitializeCandyMachineInstructionDataArgs,
    InitializeCandyMachineInstructionData
  >;
}

// Args.
export type InitializeCandyMachineInstructionArgs =
  InitializeCandyMachineInstructionDataArgs;

// Instruction.
export function initializeCandyMachine(
  context: Pick<Context, 'identity' | 'payer' | 'programs'>,
  input: InitializeCandyMachineInstructionAccounts &
    InitializeCandyMachineInstructionArgs
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
    authority: { index: 1, isWritable: false, value: input.authority ?? null },
    payer: { index: 2, isWritable: true, value: input.payer ?? null },
  };

  // Arguments.
  const resolvedArgs: InitializeCandyMachineInstructionArgs = { ...input };

  // Default values.
  if (!resolvedAccounts.authority.value) {
    resolvedAccounts.authority.value = context.identity.publicKey;
  }
  if (!resolvedAccounts.payer.value) {
    resolvedAccounts.payer.value = context.payer;
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
  const data = getInitializeCandyMachineInstructionDataSerializer().serialize(
    resolvedArgs as InitializeCandyMachineInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
