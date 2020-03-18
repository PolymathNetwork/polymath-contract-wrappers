import { BigNumber } from '@polymathnetwork/abi-wrappers';
import { PolymathAPI } from '../src';

/**
 * This method will transfer a given amount of poly tokens from the token faucet to the current user's address
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
