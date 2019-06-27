import { BigNumber } from '@0x/utils';
import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { ModuleRegistryEvents } from '@polymathnetwork/abi-wrappers';
import ModuleFactoryWrapper from '../src/contract_wrappers/modules/module_factory_wrapper';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { bytes32ToString } from '../src/utils/convert';
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
  const tokenAddress = await polymathAPI.securityTokenRegistry.getSecurityTokenAddress(ticker);
  const TEST = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromAddress(tokenAddress);

  const moduleStringName = 'CappedSTO';
  const moduleName = ModuleName.cappedSTO;

  const modules = await polymathAPI.moduleRegistry.getModulesByType({
    moduleType: ModuleType.TransferManager,
  });

  const instances: Promise<ModuleFactoryWrapper>[] = [];
  modules.map(address => {
    instances.push(polymathAPI.moduleFactory.getModuleFactory(address));
  });
  const resultInstances = await Promise.all(instances);

  const names: Promise<string>[] = [];
  resultInstances.map(instanceFactory => {
    names.push(instanceFactory.name());
  });
  const resultNames = await Promise.all(names);

  const finalNames = resultNames.map(name => {
    return bytes32ToString(name);
  });
  const index = finalNames.indexOf(moduleStringName);

  const factory = await polymathAPI.moduleFactory.getModuleFactory(modules[index]);
  const setupCost = await factory.getSetupCost();

  // Get some poly tokens on the security token instance
  await polymathAPI.polyToken.transfer({
    to: await TEST.address(),
    value: setupCost,
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

  await TEST.addModule({
    moduleName,
    address: modules[index],
    maxCost: setupCost,
    budget: setupCost,
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

  TEST.unsubscribeAll();
});
