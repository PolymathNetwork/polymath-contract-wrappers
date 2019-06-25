import { BigNumber } from '@0x/utils';
import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import {EtherDividendCheckpointEvents, ModuleFactoryContract} from '@polymathnetwork/abi-wrappers/lib/src';
import {ApiConstructorParams, PolymathAPI} from '../src/PolymathAPI';
import {bytes32ToString, valueToWei, weiToValue} from '../src/utils/convert';
import {FULL_DECIMALS, ModuleName, ModuleType} from '../src';

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
  const web3Wrapper = new Web3Wrapper(params.provider, {
    gasPrice: params.defaultGasPrice,
  });
  const address = await web3Wrapper.getAvailableAddressesAsync();
  await polymathAPI.getPolyTokens({ amount: new BigNumber(1000000), address: address[0] });
  await polymathAPI.getPolyTokens({
    amount: new BigNumber(1000000),
    address: await polymathAPI.securityTokenRegistry.address(),
  });

  // Prompt to setup your ticker and token name
  const ticker = prompt('Ticker', '');
  const tokenName = prompt('Token Name', '');

  // Double check available
  await polymathAPI.securityTokenRegistry.isTickerAvailable({
    tokenName: ticker!,
  });

  // Get the st launch fee and approve the security token registry to spend
  const getSecurityTokenLaunchFee = await polymathAPI.securityTokenRegistry.getSecurityTokenLaunchFee();
  await polymathAPI.polyToken.approve({
    spender: await polymathAPI.securityTokenRegistry.address(),
    value: weiToValue(getSecurityTokenLaunchFee, new BigNumber(18)),
  });

  // Get the ticker fee and approve the security token registry to spend
  const tickerFee = await polymathAPI.securityTokenRegistry.getTickerRegistrationFee();
  await polymathAPI.polyToken.approve({
    spender: await polymathAPI.securityTokenRegistry.address(),
    value: valueToWei(tickerFee, new BigNumber(18)),
  });

  // Register a ticker
  await polymathAPI.securityTokenRegistry.registerTicker({
    ticker: ticker!,
    tokenName: tokenName!,
  });

  // Generate a security token
  await polymathAPI.securityTokenRegistry.generateSecurityToken({
    name: tokenName!,
    ticker: ticker!,
    details: 'http://',
    divisible: false,
  });

  const moduleStringName = 'ERC20DividendCheckpoint';
  const moduleName = ModuleName.erc20DividendCheckpoint;
  const modules = await polymathAPI.moduleRegistry.getModulesByType({
    moduleType: ModuleType.Dividends,
  });

  const instances: Promise<ModuleFactoryContract>[] = [];
  modules.map(address => {
    instances.push(polymathAPI.moduleFactory.getModuleFactory(address));
  });
  const resultInstances = await Promise.all(instances);

  const names: Promise<string>[] = [];
  resultInstances.map(instanceFactory => {
    names.push(instanceFactory.name.callAsync());
  });
  const resultNames = await Promise.all(names);

  const finalNames = resultNames.map(name => {
    return bytes32ToString(name);
  });
  const index = finalNames.indexOf(moduleStringName);


  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Get some poly tokens on the security token instance
  await polymathAPI.getPolyTokens({
    amount: new BigNumber(1000000),
    address: await tickerSecurityTokenInstance.address(),
  });
  const factory = await polymathAPI.moduleFactory.getModuleFactory(modules[index]);
  const setupCost = weiToValue(await factory.getSetupCost.callAsync(), FULL_DECIMALS);

  // Get some poly tokens on the security token instance
  await polymathAPI.getPolyTokens({
    amount: new BigNumber(1000000),
    address: await tickerSecurityTokenInstance.address(),
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
  const erc20DividendAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.erc20DividendCheckpoint,
  }))[0];

  const erc20DividendCheckpoint = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.erc20DividendCheckpoint,
    address: erc20DividendAddress,
  });
  const erc20Dividend = (await tickerSecurityTokenInstance.getModulesByName({moduleName: ModuleName.erc20DividendCheckpoint}))[0];
  await polymathAPI.getPolyTokens({ amount: new BigNumber(5), address: erc20Dividend});
  await polymathAPI.polyToken.approve({
    spender: erc20Dividend,
    value: new BigNumber(5),
  });

  //Create Dividends
  await erc20DividendCheckpoint.createDividendWithExclusions({
    name: 'MyDividend2',
    amount: new BigNumber(1),
    token: await polymathAPI.polyToken.address(),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
    excluded: ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
  });

  await erc20DividendCheckpoint.createDividendWithCheckpointAndExclusions({
    name: 'MyDividend2',
    amount: new BigNumber(1),
    token: await polymathAPI.polyToken.address(),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
    checkpointId: 1,
    excluded: ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
  });

  await erc20DividendCheckpoint.createDividend({
    name: 'MyDividend',
    amount: new BigNumber(1),
    token: await polymathAPI.polyToken.address(),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
  });

  await erc20DividendCheckpoint.createDividendWithCheckpoint({
    name: 'MyDividend2',
    amount: new BigNumber(1),
    token: await polymathAPI.polyToken.address(),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
    checkpointId: 0,
  });

  // Subscribe to event of update dividend dates
  await erc20DividendCheckpoint.subscribeAsync({
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
  await erc20DividendCheckpoint.updateDividendDates({
    dividendIndex: 0,
    expiry: new Date(2038, 2),
    maturity: new Date(2037, 4),
  });

  erc20DividendCheckpoint.unsubscribeAll();
});
