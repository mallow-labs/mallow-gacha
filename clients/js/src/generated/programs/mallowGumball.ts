/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  ClusterFilter,
  Context,
  Program,
  PublicKey,
} from '@metaplex-foundation/umi';
import {
  getMallowGumballErrorFromCode,
  getMallowGumballErrorFromName,
} from '../errors';

export const MALLOW_GUMBALL_PROGRAM_ID =
  'MGUMqztv7MHgoHBYWbvMyL3E3NJ4UHfTwgLJUQAbKGa' as PublicKey<'MGUMqztv7MHgoHBYWbvMyL3E3NJ4UHfTwgLJUQAbKGa'>;

export function createMallowGumballProgram(): Program {
  return {
    name: 'mallowGumball',
    publicKey: MALLOW_GUMBALL_PROGRAM_ID,
    getErrorFromCode(code: number, cause?: Error) {
      return getMallowGumballErrorFromCode(code, this, cause);
    },
    getErrorFromName(name: string, cause?: Error) {
      return getMallowGumballErrorFromName(name, this, cause);
    },
    isOnCluster() {
      return true;
    },
  };
}

export function getMallowGumballProgram<T extends Program = Program>(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): T {
  return context.programs.get<T>('mallowGumball', clusterFilter);
}

export function getMallowGumballProgramId(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): PublicKey {
  return context.programs.getPublicKey(
    'mallowGumball',
    MALLOW_GUMBALL_PROGRAM_ID,
    clusterFilter
  );
}
