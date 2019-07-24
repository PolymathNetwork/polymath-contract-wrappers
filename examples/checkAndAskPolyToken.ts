import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { BigNumber } from '@polymathnetwork/abi-wrappers';

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

  let polyBalance = await polymathAPI.polyToken.balanceOf();
  console.log('Poly Balance:', polyBalance.toNumber());
  if (!polyBalance.toNumber()) {
    // getPolyTokens only works on a testnet environment
    await polymathAPI.getPolyTokens({ amount: new BigNumber(500000) });
  }
  polyBalance = await polymathAPI.polyToken.balanceOf();
  console.log('Poly Balance:', polyBalance.toNumber());
});
