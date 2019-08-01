import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import ModuleFactoryWrapper from '../src/contract_wrappers/modules/module_factory_wrapper';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { ModuleName, ModuleType } from '../src';
import { BigNumber, ModuleRegistryEvents, PercentageTransferManagerEvents } from '@polymathnetwork/abi-wrappers';

// This file acts as a valid sandbox for using a percentage restriction transfer manager module on an unlocked node (like ganache)
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

  await polymathAPI.securityTokenRegistry.generateNewSecurityToken({
    name: tokenName!,
    ticker: ticker!,
    tokenDetails: 'details',
    divisible: true,
    treasuryWallet: myAddress,
    protocolVersion: '0',
  });

  console.log('Security Token Generated');

  const moduleName = ModuleName.PercentageTransferManager;

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

  const index = resultNames.indexOf(moduleName);

  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);
  const factory = await polymathAPI.moduleFactory.getModuleFactory(modules[index]);
  const setupCost = await factory.setupCostInPoly();

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

  // Get General TM Address to whitelist transfers
  const generalTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.GeneralTransferManager,
  }))[0];
  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.GeneralTransferManager,
    address: generalTMAddress,
  });

  await generalTM.modifyKYCData({
    investor: myAddress,
    canSendAfter: new Date(),
    canReceiveAfter: new Date(),
    expiryTime: new Date(2020, 0),
    txData: {
      from: await polymathAPI.getAccount(),
    },
  });

  await tickerSecurityTokenInstance.addModule({
    moduleName,
    address: modules[index],
    data: {
      maxHolderPercentage: new BigNumber(50),
      allowPrimaryIssuance: true,
    },
    archived: false,
  });

  const percentageTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.PercentageTransferManager,
  }))[0];

  const percentageTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.PercentageTransferManager,
    address: percentageTMAddress,
  });

  // Subscribe to event of setAllowPrimaryIssuance
  await percentageTM.subscribeAsync({
    eventName: PercentageTransferManagerEvents.SetAllowPrimaryIssuance,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('AllowPrimaryIssuance has been set', log);
      }
    },
  });

  const randomBeneficiary = '0x0123456789012345678901234567890123456789';

  await generalTM.modifyKYCDataMulti({
    investors: [myAddress, randomBeneficiary],
    canReceiveAfter: [new Date(), new Date()],
    canSendAfter: [new Date(), new Date()],
    expiryTime: [new Date(2035, 1), new Date(2035, 1)],
  });

  await tickerSecurityTokenInstance.issueMulti({
    investors: [myAddress, randomBeneficiary],
    values: [new BigNumber(10), new BigNumber(10)],
  });

  await percentageTM.setAllowPrimaryIssuance({ allowPrimaryIssuance: false });
  console.log('SetAllowPrimaryIssuance has been called');

  // Issuing now invalid

  tickerSecurityTokenInstance.unsubscribeAll();
});
