import {
  generateSigner,
  publicKey,
  sol,
  some,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import test from 'ava';
import {
  CandyGuard,
  CandyMachine,
  create,
  emptyDefaultGuardSetArgs,
  fetchCandyGuard,
  fetchCandyMachine,
  findCandyGuardPda,
  GuardGroup,
  GuardSet,
} from '../src';
import { createUmi, defaultGumballSettings } from './_setup';

test('it can create a candy machine with an associated candy guard', async (t) => {
  // Given an existing collection NFT.
  const umi = await createUmi();

  // When we create a new candy machine with an associated candy guard.
  const feeAccount = generateSigner(umi).publicKey;
  const candyMachine = generateSigner(umi);
  const createInstructions = await create(umi, {
    candyMachine,
    feeConfig: some({
      feeAccount,
      feeBps: 500,
    }),
    guards: {
      botTax: some({ lamports: sol(0.01), lastInstruction: true }),
      solPayment: some({ lamports: sol(2) }),
    },
    settings: defaultGumballSettings(),
  });
  await transactionBuilder().add(createInstructions).sendAndConfirm(umi);

  // Then we created a new candy guard derived from the candy machine's address.
  const candyGuard = findCandyGuardPda(umi, { base: candyMachine.publicKey });
  const candyGuardAccount = await fetchCandyGuard(umi, candyGuard);
  t.like(candyGuardAccount, <CandyGuard>{
    publicKey: publicKey(candyGuard),
    base: publicKey(candyMachine),
    authority: publicKey(umi.identity),
    guards: {
      ...emptyDefaultGuardSetArgs,
      botTax: some({ lamports: sol(0.01), lastInstruction: true }),
      solPayment: some({ lamports: sol(2) }),
    },
    groups: [] as GuardGroup<GuardSet>[],
  });

  // And the created candy machine uses it as a mint authority.
  const candyMachineAccount = await fetchCandyMachine(
    umi,
    candyMachine.publicKey
  );
  t.like(candyMachineAccount, <CandyMachine>{
    publicKey: publicKey(candyMachine),
    authority: publicKey(umi.identity),
    mintAuthority: publicKey(candyGuard),
    marketplaceFeeConfig: some({
      feeAccount,
      feeBps: 500,
    }),
  });
});
