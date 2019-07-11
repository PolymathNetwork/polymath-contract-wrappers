import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { ApiConstructorParams } from '../../src/PolymathAPI';
import { PolymathAPI } from '../../src';

// Setup redundant subprovider to read and publish transactions on unlocked node
window.addEventListener('load', async () => {
  const providerEngine = new Web3ProviderEngine();
  providerEngine.addProvider(new RedundantSubprovider([new RPCSubprovider('http://127.0.0.1:8545')]));
  providerEngine.start();
  const params: ApiConstructorParams = {
    provider: providerEngine,
    polymathRegistryAddress: '<Deployed Polymath Registry Address>',
  };

  const polymathAPI = new PolymathAPI(params);
});
