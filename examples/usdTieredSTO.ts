import { BigNumber } from '@0x/utils';
import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { USDTieredSTOEvents } from '@polymathnetwork/abi-wrappers/lib/src';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { bytes32ToString } from '../src/utils/convert';
import { FundRaiseType, ModuleName, ModuleType } from '../src';
import ModuleFactoryWrapper from '../src/contract_wrappers/modules/module_factory_wrapper';

// This file acts as a valid sandbox.ts file in root directory for adding a usdtieredSTO module on an unlocked node (like ganache)

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

  const moduleStringName = 'USDTieredSTO';
  const moduleName = ModuleName.UsdTieredSTO;
  const modules = await polymathAPI.moduleRegistry.getModulesByType({
    moduleType: ModuleType.STO,
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

  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  const factory = await polymathAPI.moduleFactory.getModuleFactory(modules[index]);
  const setupCost = await factory.setupCostInPoly();

  await polymathAPI.polyToken.transfer({
    to: await tickerSecurityTokenInstance.address(),
    value: setupCost,
  });

  // Call to add module
  const usdTieredResult = await tickerSecurityTokenInstance.addModule({
    moduleName,
    address: modules[index],
    maxCost: setupCost,
    budget: setupCost,
    archived: false,
    data: {
      startTime: new Date(2030, 1),
      endTime: new Date(2031, 1),
      ratePerTier: [new BigNumber(10), new BigNumber(10)],
      ratePerTierDiscountPoly: [new BigNumber(8), new BigNumber(9)],
      tokensPerTierTotal: [new BigNumber(10), new BigNumber(10)],
      tokensPerTierDiscountPoly: [new BigNumber(8), new BigNumber(8)],
      nonAccreditedLimitUSD: new BigNumber(5),
      minimumInvestmentUSD: new BigNumber(5),
      fundRaiseTypes: [FundRaiseType.ETH, FundRaiseType.POLY],
      wallet: '0x3333333333333333333333333333333333333333',
      treasuryWallet: '0x5555555555555555555555555555555555555555',
      usdTokens: ['0x6666666666666666666666666666666666666666', '0x4444444444444444444444444444444444444444'],
    },
  });
  console.log(usdTieredResult);

  const usdTieredAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.UsdTieredSTO,
  }))[0];
  const usdTiered = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.UsdTieredSTO,
    address: usdTieredAddress,
  });
  const buyWithETH = await usdTiered.buyWithETH({ value: new BigNumber(1), beneficiary: myAddress });
  console.log(buyWithETH);

  // Subscribe to event of update dividend dates
  await usdTiered.subscribeAsync({
    eventName: USDTieredSTOEvents.SetTiers,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Dividend Date Updated!', log);
      }
    },
  });

  // Update dividend dates
  await usdTiered.modifyTiers({
    ratePerTier: [new BigNumber(5), new BigNumber(5)],
    ratePerTierDiscountPoly: [new BigNumber(4), new BigNumber(4)],
    tokensPerTierTotal: [new BigNumber(5), new BigNumber(5)],
    tokensPerTierDiscountPoly: [new BigNumber(4), new BigNumber(4)],
  });

  usdTiered.unsubscribeAll();
});
