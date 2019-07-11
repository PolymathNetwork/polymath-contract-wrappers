import {Provider} from 'ethereum-types';
import { MetamaskSubprovider, RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { ApiConstructorParams } from '../../src/PolymathAPI';
import { PolymathAPI } from '../../src';


// Setup redundant subprovider to read and metamask to publish transactions
window.addEventListener('load', async () => {
  // Instantiate a provider engine
  const providerEngine = new Web3ProviderEngine();

  // Injected Provider
  const injectedProviderIfExists = await getInjectedProviderIfExists();
  if (injectedProviderIfExists) {
    providerEngine.addProvider(new MetamaskSubprovider(injectedProviderIfExists));
  }

  // Add Redundant Subprovider
  providerEngine.addProvider(new RedundantSubprovider([new RPCSubprovider('http://127.0.0.1:8545')]));
  providerEngine.start();

  // Setup API
  const params: ApiConstructorParams = {
    provider: providerEngine,
    polymathRegistryAddress: '<Deployed Polymath Registry Address>',
  };
  const polymathAPI = new PolymathAPI(params);
});

async function getInjectedProviderIfExists(): Promise<Provider> {
  // New Metamask Version
  let injectedProviderIfExists = (window as any).ethereum;
  if (injectedProviderIfExists !== undefined) {
    if (injectedProviderIfExists.enable !== undefined) {
      try {
        await injectedProviderIfExists.enable();
      } catch (err) {
        // Error with Enabling Metamask
      }
    }
  } else {
    // Legacy Metamask Version
    const injectedWeb3IfExists = (window as any).web3;
    if (injectedWeb3IfExists !== undefined && injectedWeb3IfExists.currentProvider !== undefined) {
      injectedProviderIfExists = injectedWeb3IfExists.currentProvider;
    } else {
      // Error with legacy metamask
    }
  }
  return injectedProviderIfExists;
}
