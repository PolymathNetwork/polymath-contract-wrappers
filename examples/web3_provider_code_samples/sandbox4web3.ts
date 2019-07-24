import {
  PrivateKeyWalletSubprovider,
  RedundantSubprovider,
  RPCSubprovider,
  Web3ProviderEngine,
} from '@0x/subproviders';
import { ApiConstructorParams } from '../../src/PolymathAPI';
import { PolymathAPI } from '../../src';

// Setup redundant subprovider to read and privateKeyWallet subprovider to publish transactions
window.addEventListener('load', async () => {
  // Instantiate Provider Engine
  const providerEngine = new Web3ProviderEngine();
  providerEngine.addProvider(
    new PrivateKeyWalletSubprovider('<Your private key (without 0x)>'),
  );
  providerEngine.addProvider(new RedundantSubprovider([new RPCSubprovider('http://127.0.0.1:8545')]));
  providerEngine.start();

  // Setup API
  const params: ApiConstructorParams = {
    provider: providerEngine,
    polymathRegistryAddress: '<Deployed Polymath Registry Address>',
  };
  const polymathAPI = new PolymathAPI(params);
});
