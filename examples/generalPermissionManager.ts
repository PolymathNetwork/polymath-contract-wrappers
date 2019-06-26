import { BigNumber } from '@0x/utils';
import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { GeneralPermissionManagerEvents } from '@polymathnetwork/abi-wrappers';
import ModuleFactoryWrapper from '../src/contract_wrappers/modules/module_factory_wrapper';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { valueToWei, weiToValue, bytes32ToString } from '../src/utils/convert';
import { ModuleName, ModuleType } from '../src';

// This file acts as a valid sandbox for adding a permission manager  module on an unlocked node (like ganache)

window.addEventListener('load', async () => {
  // Setup the redundant provider
  const providerEngine = new Web3ProviderEngine();
  providerEngine.addProvider(new RedundantSubprovider([new RPCSubprovider('http://127.0.0.1:8545')]));
  providerEngine.start();
  const params: ApiConstructorParams = {
    provider: providerEngine,
    polymathRegistryAddress: '<Deployed Polymath Registry address>',
  };

  // Instantiate the API
  const polymathAPI = new PolymathAPI(params);

  // Get some poly tokens in your account and the security token
  const myAddress = await polymathAPI.getAccount();
  await polymathAPI.getPolyTokens({ amount: new BigNumber(1000000), address: myAddress });

  // Prompt to setup your ticker and token name
  const ticker = prompt('Ticker', '');
  const tokenName = prompt('Token Name', '');

  // Double check available
  await polymathAPI.securityTokenRegistry.isTickerAvailable({
    tokenName: ticker!,
  });

  // Get the ticker fee and approve the security token registry to spend
  const tickerFee = await polymathAPI.securityTokenRegistry.getTickerRegistrationFee();
  await polymathAPI.polyToken.approve({
    spender: await polymathAPI.securityTokenRegistry.address(),
    value: tickerFee,
  });

  // Register a ticker
  await polymathAPI.securityTokenRegistry.registerTicker({
    ticker: ticker!,
    tokenName: tokenName!,
  });

  // Get the st launch fee and approve the security token registry to spend
  const securityTokenLaunchFee = await polymathAPI.securityTokenRegistry.getSecurityTokenLaunchFee();
  await polymathAPI.polyToken.approve({
    spender: await polymathAPI.securityTokenRegistry.address(),
    value: securityTokenLaunchFee,
  });

  // Generate a security token
  await polymathAPI.securityTokenRegistry.generateSecurityToken({
    name: tokenName!,
    ticker: ticker!,
    details: 'http://',
    divisible: false,
  });

  // Get permission manager factory address
  const modules = await polymathAPI.moduleRegistry.getModulesByType({
    moduleType: ModuleType.PermissionManager,
  });

  const moduleStringName = 'GeneralPermissionManager';
  const moduleName = ModuleName.generalPermissionManager;

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

  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  const factory = await polymathAPI.moduleFactory.getModuleFactory(modules[index]);
  const setupCost = await factory.getSetupCost();

  // Call to add module
  await tickerSecurityTokenInstance.addModule({
    moduleName,
    address: modules[index],
    maxCost: setupCost,
    budget: setupCost,
  });

  const generalPMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.generalPermissionManager,
  }))[0];

  const generalPM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.generalPermissionManager,
    address: generalPMAddress,
  });

  // Subscribe to event of add delegate
  await generalPM.subscribeAsync({
    eventName: GeneralPermissionManagerEvents.AddDelegate,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Add delegate', log);
      }
    },
  });

  // Add a delegate which can have permissions in different modules
  await generalPM.addDelegate({ delegate: myAddress, details: 'details' });

  const generalTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.generalTransferManager,
  }))[0];

  // Get all delegates
  await generalPM.changePermission({ valid: true, perm: 'FLAGS', delegate: myAddress, module: generalTMAddress });

  // Check  delegate
  console.log('Delegate is added:');
  console.log(await generalPM.checkDelegate({ delegate: myAddress }));
  console.log('Delegate has flags perm added on general transfer manager:');
  console.log(await generalPM.checkPermission({ delegate: myAddress, module: generalTMAddress, permission: 'FLAGS' }));

  // Use FLAGS permission to allow all whitelist transfers, this validates that the user can use the
  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.generalTransferManager,
    address: generalTMAddress,
  });
  await generalTM.changeAllowAllWhitelistTransfers({ allowAllWhitelistTransfers: true });

  // Revoking Permission
  await generalPM.changePermission({ valid: false, perm: 'FLAGS', delegate: myAddress, module: generalTMAddress });

  console.log('Delegate perm has been revoked. Check permission result: ');
  console.log(await generalPM.checkPermission({ delegate: myAddress, module: generalTMAddress, permission: 'FLAGS' }));

  // Removing Delegate
  await generalPM.deleteDelegate({ delegate: myAddress });

  // Check delegate
  console.log('Delegate is removed. Check delegate result:');
  console.log(await generalPM.checkDelegate({ delegate: myAddress }));

  generalPM.unsubscribeAll();
});