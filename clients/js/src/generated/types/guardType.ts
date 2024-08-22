/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { scalarEnum, Serializer } from '@metaplex-foundation/umi/serializers';

/** Available guard types. */
export enum GuardType {
  BotTax,
  StartDate,
  SolPayment,
  TokenPayment,
  ThirdPartySigner,
  TokenGate,
  Gatekeeper,
  EndDate,
  AllowList,
  MintLimit,
  RedeemedAmount,
  AddressGate,
  NftGate,
  NftBurn,
  TokenBurn,
  ProgramGate,
  Allocation,
  Token2022Payment,
}

export type GuardTypeArgs = GuardType;

export function getGuardTypeSerializer(): Serializer<GuardTypeArgs, GuardType> {
  return scalarEnum<GuardType>(GuardType, {
    description: 'GuardType',
  }) as Serializer<GuardTypeArgs, GuardType>;
}
