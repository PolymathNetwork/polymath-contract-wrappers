import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { BigNumber } from '@polymathnetwork/abi-wrappers';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';

// This file acts as a valid sandbox.ts file in root directory for request POLY tokens on an unlocked node (like ganache)

window.addEventListener('load', async () => {
  // Setup the redundant provider
  const providerEngine = new Web3ProviderEngine();
  providerEngine.addProvider(new RedundantSubprovider([new RPCSubprovider('http://127.0.0.1:8545')]));
  providerEngine.start();
  const params: ApiConstructorParams = {
    provider: providerEngine,
    polymathRegistryAddress: '<Deployed Polymath Registry Address>',
  };

  // Instantiate the API
  const polymathAPI = new PolymathAPI(params);

  // Get some poly tokens in your account and the security token
  const myAddress = await polymathAPI.getAccount();

  let polyBalance = await polymathAPI.polyToken.balanceOf();
  console.log('Poly Balance:', polyBalance.toNumber());

  // getPolyTokens only works on a testnet environment
  await polymathAPI.getPolyTokens({ amount: new BigNumber(1000000), address: myAddress });
  polyBalance = await polymathAPI.polyToken.balanceOf();
  console.log('Poly Balance:', polyBalance.toNumber());
});
