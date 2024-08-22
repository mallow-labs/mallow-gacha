/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { PublicKey } from '@metaplex-foundation/umi';
import {
  publicKey as publicKeySerializer,
  Serializer,
  struct,
  u64,
} from '@metaplex-foundation/umi/serializers';

/**
 * Guard that restricts access to addresses that hold the specified spl-token.
 *
 * List of accounts required:
 *
 * 0. `[]` Token account holding the required amount.
 */

export type TokenGate = { amount: bigint; mint: PublicKey };

export type TokenGateArgs = { amount: number | bigint; mint: PublicKey };

export function getTokenGateSerializer(): Serializer<TokenGateArgs, TokenGate> {
  return struct<TokenGate>(
    [
      ['amount', u64()],
      ['mint', publicKeySerializer()],
    ],
    { description: 'TokenGate' }
  ) as Serializer<TokenGateArgs, TokenGate>;
}
