import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import {
  BigNumber,
} from '@polymathnetwork/abi-wrappers';
import { ApiConstructorParams, PolymathAPI } from './src/PolymathAPI';
import { registerTicker } from './examples/registerTicker';
import { launchToken } from './examples/launchToken';
import { restrictedPartialSaleTransferManager } from './examples/restrictedPartialSaleTransferManager';

// This file acts as a valid sandbox.ts file in root directory for launching a new Token on an unlocked node, adding a module and using it.

window.addEventListener('load', async () => {
  // Setup the redundant provider
  const providerEngine = new Web3ProviderEngine();
  providerEngine.addProvider(new RedundantSubprovider([new RPCSubprovider('http://127.0.0.1:8545')]));
  providerEngine.start();
  const params: ApiConstructorParams = {
    provider: providerEngine,
    polymathRegistryAddress: '0x9FBDa871d559710256a2502A2517b794B482Db40'.toLowerCase(),
  };

  // Instantiate the API
  const polymathAPI = new PolymathAPI(params);

  // Get some poly tokens in your account and the security token
  const myAddress = await polymathAPI.getAccount();
  await polymathAPI.getPolyTokens({ amount: new BigNumber(1000000), address: myAddress });

  // Prompt to setup your ticker and token name
  const ticker = prompt('Ticker', '');
  const tokenName = prompt('Token Name', '');

  const myTicker = ticker ? ticker : '';

  // Register the ticker
  await registerTicker(polymathAPI, myTicker, myAddress);

  // Generate a new Security Token
  await launchToken(polymathAPI, tokenName ? tokenName : '', myTicker, 'http://', myAddress, false);

  // Add the restricted partial sale TM module and do things with it
  await restrictedPartialSaleTransferManager(polymathAPI, myTicker);
});
