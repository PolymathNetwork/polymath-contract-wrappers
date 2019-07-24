import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { GeneralTransferManagerEvents } from '@polymathnetwork/abi-wrappers';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { ModuleName } from '../src';

// This file acts as a valid sandbox.ts file in root directory for adding a new address to the whitelist on an unlocked node (like ganache)

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

  const ticker = 'TEST';
  const tokenAddress = await polymathAPI.securityTokenRegistry.getSecurityTokenAddress(ticker);
  const TEST = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromAddress(tokenAddress);
  const generalTMAddress = (await TEST.getModulesByName({ moduleName: ModuleName.generalTransferManager }))[0];

  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.generalTransferManager,
    address: generalTMAddress,
  });

  await generalTM.subscribeAsync({
    eventName: GeneralTransferManagerEvents.ModifyWhitelist,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Whitlist modified!', log);
      }
    },
  });

  await generalTM.modifyWhitelist({
    investor: '0x72aF7849ffc7753B5ccEA5cb80F97e9Aeaf7d999',
    canSendAfter: new Date(),
    canReceiveAfter: new Date(),
    expiryTime: new Date(2020),
    canBuyFromSTO: true,
    txData: {
      from: await polymathAPI.getAccount(),
    },
  });

  generalTM.unsubscribeAll();
});
