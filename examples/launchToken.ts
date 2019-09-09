import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { PolyTokenEvents, SecurityTokenRegistryEvents } from '@polymathnetwork/abi-wrappers';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { launchToken } from './example_components/launchTokenComponent';
import BigNumber from 'bignumber.js';
import { registerTicker } from './example_components/registerTickerComponent';

// This file acts as a valid sandbox.ts file in root directory for launch a new Token on an unlocked node (like ganache)

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
  await polymathAPI.getPolyTokens({ amount: new BigNumber(1000000), address: myAddress });

  // Prompt to setup your ticker and token name
  const ticker = prompt('Ticker', '');
  const tokenName = prompt('Token Name', '');

  await polymathAPI.polyToken.subscribeAsync({
    eventName: PolyTokenEvents.Approval,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Tokens approved');
      }
    },
  });

  await polymathAPI.securityTokenRegistry.subscribeAsync({
    eventName: SecurityTokenRegistryEvents.NewSecurityToken,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('New security token!', log);
      }
    },
  });

  // Register ticker and launch token
  await registerTicker(polymathAPI, ticker ? ticker : '', myAddress);
  await launchToken(polymathAPI, tokenName ? tokenName : '', ticker ? ticker : '', 'http://', myAddress, false);
  console.log('Ticker was registered and token was launched successfully!');

  polymathAPI.securityTokenRegistry.unsubscribeAll();
});
