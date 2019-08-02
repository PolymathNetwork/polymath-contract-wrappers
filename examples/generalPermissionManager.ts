import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { GeneralPermissionManagerEvents, BigNumber } from '@polymathnetwork/abi-wrappers';
import ModuleFactoryWrapper from '../src/contract_wrappers/modules/module_factory_wrapper';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { ModuleName, ModuleType, Perm, TransferType } from '../src';

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
    ticker: ticker!,
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
  await polymathAPI.securityTokenRegistry.generateNewSecurityToken({
    name: tokenName!,
    ticker: ticker!,
    tokenDetails: 'http://',
    divisible: true,
    treasuryWallet: myAddress,
    protocolVersion: '0',
  });

  // Get permission manager factory address
  const modules = await polymathAPI.moduleRegistry.getModulesByType({
    moduleType: ModuleType.PermissionManager,
  });

  const moduleStringName = 'GeneralPermissionManager';
  const moduleName = ModuleName.GeneralPermissionManager;

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
  const index = resultNames.indexOf(moduleStringName);

  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  const factory = await polymathAPI.moduleFactory.getModuleFactory(modules[index]);
  const setupCost = await factory.setupCostInPoly();

  // Call to add module
  await tickerSecurityTokenInstance.addModule({
    moduleName,
    address: modules[index],
    maxCost: setupCost,
    budget: setupCost,
    archived: false,
  });

  const generalPMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.GeneralPermissionManager,
  }))[0];

  const generalPM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.GeneralPermissionManager,
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
    moduleName: ModuleName.GeneralTransferManager,
  }))[0];

  // Get all delegates
  const permissionChanged = await generalPM.changePermission({
    valid: true,
    perm: Perm.Admin,
    delegate: myAddress,
    module: generalTMAddress,
  });

  // Check  delegate
  console.log('Permission changed:');
  console.log(permissionChanged);

  console.log(await generalPM.checkDelegate({ delegate: myAddress }));
  console.log('Delegate has flags perm added on general transfer manager:');
  console.log(
    await generalPM.checkPermission({ delegate: myAddress, module: generalTMAddress, permission: Perm.Admin }),
  );

  // Use FLAGS permission to allow all whitelist transfers, this validates that the user can use the
  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.GeneralTransferManager,
    address: generalTMAddress,
  });

  await generalTM.modifyTransferRequirementsMulti({
    transferTypes: [TransferType.General, TransferType.Issuance, TransferType.Redemption],
    fromValidKYC: [true, false, false],
    toValidKYC: [true, false, false],
    fromRestricted: [true, false, false],
    toRestricted: [true, false, false],
  });

  // Revoking Permission
  const permissionResult = await generalPM.changePermission({
    valid: false,
    perm: Perm.Admin,
    delegate: myAddress,
    module: generalTMAddress,
  });

  console.log('Delegate perm has been revoked. Check permission result:');
  console.log(permissionResult);
  console.log(
    await generalPM.checkPermission({ delegate: myAddress, module: generalTMAddress, permission: Perm.Admin }),
  );

  // Removing Delegate
  const deleteDelegateResult = await generalPM.deleteDelegate({ delegate: myAddress });

  // Check delegate
  console.log('Delegate is removed. Check delegate result:');
  console.log(deleteDelegateResult);
  console.log(await generalPM.checkDelegate({ delegate: myAddress }));

  generalPM.unsubscribeAll();
});
