import { BigNumber } from '@polymathnetwork/abi-wrappers';
import { PolymathAPI } from '../src';

/**
 * This method adds a CappedSTO module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param amount Amount of tokens to ask for (Max 1000000)
 */
export const getPolyTokens = async (polymathAPI: PolymathAPI, amount: BigNumber) => {
  if (amount.isZero()) {
    return;
  }
  if (amount.isGreaterThan(new BigNumber(1000000))) {
    console.log('1000000 is the max number of tokens you can ask for right now.');
  }
  // Get some poly tokens in your account and the security token
  const myAddress = await polymathAPI.getAccount();
  let polyBalance = await polymathAPI.polyToken.balanceOf();
  console.log('Current Poly Balance:', polyBalance.toNumber());
  // getPolyTokens only works on a testnet environment
  await polymathAPI.getPolyTokens({ amount, address: myAddress });
  polyBalance = await polymathAPI.polyToken.balanceOf();
  console.log('New Poly Balance:', polyBalance.toNumber());
};
