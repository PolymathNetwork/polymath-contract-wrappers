import { BigNumber } from '@0x/utils';
import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { ModuleRegistryEvents } from '@polymathnetwork/abi-wrappers';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { FundRaiseType, ModuleName, ModuleType } from '../src';

// This file acts as a valid sandbox.ts file in root directory for adding a cappedSTO module on an unlocked node (like ganache)

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
  const amount = new BigNumber(20000);
  const tokenAddress = await polymathAPI.securityTokenRegistry.getSecurityTokenAddress(ticker);
  const TEST = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromAddress(tokenAddress);

  await polymathAPI.getPolyTokens({
    amount,
    address: await TEST.address(),
  });

  await TEST.addModule({
    moduleName: ModuleName.cappedSTO,
    address: (await polymathAPI.moduleRegistry.getModulesByType({ moduleType: ModuleType.STO }))[0],
    maxCost: new BigNumber(25000),
    budget: new BigNumber(26000),
    archived: false,
    data: {
      startTime: new Date(),
      endTime: new Date(2019, 8),
      cap: new BigNumber(10),
      rate: new BigNumber(10),
      fundRaiseTypes: [FundRaiseType.ETH],
      fundsReceiver: await polymathAPI.getAccount(),
    },
  });

  await polymathAPI.moduleRegistry.subscribeAsync({
    eventName: ModuleRegistryEvents.ModuleRegistered,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Module added!', log);
      }
    },
  });
});
