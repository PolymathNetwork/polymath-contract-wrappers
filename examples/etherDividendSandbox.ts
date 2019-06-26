import { BigNumber } from '@0x/utils';
import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { EtherDividendCheckpointEvents, ModuleFactoryContract } from '@polymathnetwork/abi-wrappers/lib/src';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { bytes32ToString, valueToWei, weiToValue } from '../src/utils/convert';
import { FULL_DECIMALS, ModuleName, ModuleType } from '../src';
import ModuleFactoryWrapper from '../src/contract_wrappers/modules/module_factory_wrapper';

// This file acts as a valid sandbox for adding a etherDividend  module on an unlocked node (like ganache)

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
  await polymathAPI.polyToken.transfer({
    to: await polymathAPI.securityTokenRegistry.address(),
    value: new BigNumber(500000),
  });

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

  const moduleStringName = 'EtherDividendCheckpoint';
  const moduleName = ModuleName.etherDividendCheckpoint;
  const modules = await polymathAPI.moduleRegistry.getModulesByType({
    moduleType: ModuleType.Dividends,
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

  // Get some poly tokens on the security token instance
  await polymathAPI.polyToken.transfer({
    to: await tickerSecurityTokenInstance.address(),
    value: new BigNumber(200000),
  });

  const factory = await polymathAPI.moduleFactory.getModuleFactory(modules[index]);
  const setupCost = await factory.getSetupCost();

  // Get some poly tokens on the security token instance
  await polymathAPI.polyToken.transfer({
    to: await tickerSecurityTokenInstance.address(),
    value: new BigNumber(200000),
  });

  // Create 2 checkpoints
  await tickerSecurityTokenInstance.createCheckpoint({});
  await tickerSecurityTokenInstance.createCheckpoint({});

  // Call to add etherdividend module
  await tickerSecurityTokenInstance.addModule({
    moduleName,
    address: modules[index],
    maxCost: setupCost,
    budget: setupCost,
    data: {
      wallet: '0x3333333333333333333333333333333333333333',
    },
  });

  // Get module for ether dividend checkpoint and address for module
  const etherDividendAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.etherDividendCheckpoint,
  }))[0];
  console.log(etherDividendAddress);
  const etherDividendCheckpoint = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.etherDividendCheckpoint,
    address: etherDividendAddress,
  });

  //Create Dividends
  await etherDividendCheckpoint.createDividendWithExclusions({
    name: 'MyDividend2',
    value: new BigNumber(1),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
    excluded: ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
  });

  await etherDividendCheckpoint.createDividendWithCheckpointAndExclusions({
    name: 'MyDividend2',
    value: new BigNumber(1),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
    checkpointId: 1,
    excluded: ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
  });

  await etherDividendCheckpoint.createDividend({
    name: 'MyDividend',
    value: new BigNumber(1),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
  });

  await etherDividendCheckpoint.createDividendWithCheckpoint({
    name: 'MyDividend2',
    value: new BigNumber(1),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
    checkpointId: 0,
  });

  // Subscribe to event of update dividend dates
  await etherDividendCheckpoint.subscribeAsync({
    eventName: EtherDividendCheckpointEvents.UpdateDividendDates,
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
  await etherDividendCheckpoint.updateDividendDates({
    dividendIndex: 0,
    expiry: new Date(2038, 2),
    maturity: new Date(2037, 4),
  });

  etherDividendCheckpoint.unsubscribeAll();
});
