import { MetamaskSubprovider } from '@0x/subproviders';
import { ApiConstructorParams } from '../../src/PolymathAPI';
import { PolymathAPI } from '../../src';
import { Provider } from '@polymathnetwork/abi-wrappers';

// Setup metamask subprovider to read and publish transactions
window.addEventListener('load', async () => {
  const injectedProviderIfExists = await getInjectedProviderIfExists();
  // Setup API
  if (injectedProviderIfExists) {
    const params: ApiConstructorParams = {
      provider: new MetamaskSubprovider(injectedProviderIfExists),
      polymathRegistryAddress: '<Deployed Polymath Registry Address>',
    };
    const polymathAPI = new PolymathAPI(params);
  }
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
