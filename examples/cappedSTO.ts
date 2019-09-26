import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { ModuleRegistryEvents_3_0_0, BigNumber, CappedSTOEvents_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { ModuleFactory } from '../src/contract_wrappers/modules/module_factory_wrapper';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { CappedSTOFundRaiseType, ModuleName, ModuleType } from '../src';

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

  // Get some poly tokens in your account and the security token
  const myAddress = await polymathAPI.getAccount();
  await polymathAPI.getPolyTokens({ amount: new BigNumber(1000000), address: myAddress });

  // Prompt to setup your ticker and token name
  const ticker = prompt('Ticker', '');
  const tokenName = prompt('Token Name', '');

  // Double check available
  await polymathAPI.securityTokenRegistry.tickerAvailable({
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

  const moduleName = ModuleName.CappedSTO;

  const modules = await polymathAPI.moduleRegistry.getModulesByType({
    moduleType: ModuleType.STO,
  });

  const instances: Promise<ModuleFactory>[] = [];
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

  // Get some poly tokens on the security token instance
  await polymathAPI.polyToken.transfer({
    to: await tickerSecurityTokenInstance.address(),
    value: setupCost,
  });

  await polymathAPI.moduleRegistry.subscribeAsync({
    eventName: ModuleRegistryEvents_3_0_0.ModuleRegistered,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Module added!', log);
      }
    },
  });

  // Get General Transfer Manager to whitelist an address to buy tokens
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

  const startTime = new Date(Date.now() + 10000);
  await tickerSecurityTokenInstance.addModule({
    moduleName,
    address: modules[index],
    maxCost: setupCost,
    budget: setupCost,
    archived: false,
    data: {
      startTime,
      endTime: new Date(2031, 1),
      cap: new BigNumber(10),
      rate: new BigNumber(10),
      fundRaiseType: CappedSTOFundRaiseType.ETH,
      fundsReceiver: await polymathAPI.getAccount(),
      treasuryWallet: myAddress,
    },
  });

  const cappedSTOAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.CappedSTO,
  }))[0];

  const cappedSTO = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.CappedSTO,
    address: cappedSTOAddress,
  });

  const sleep = (milliseconds: number) => {
    console.log('Sleeping until the STO starts');
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
  await sleep(10000);

  // Subscribe to event of token purchase
  await cappedSTO.subscribeAsync({
    eventName: CappedSTOEvents_3_0_0.TokenPurchase,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Token Purchased!', log);
      }
    },
  });

  await cappedSTO.buyTokens({ beneficiary: await polymathAPI.getAccount(), value: new BigNumber(1) });
  console.log('Buy Tokens has been called');

  tickerSecurityTokenInstance.unsubscribeAll();
});
