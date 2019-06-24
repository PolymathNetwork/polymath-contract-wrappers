import { BigNumber } from '@0x/utils';
import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { EtherDividendCheckpointEvents } from '@polymathnetwork/abi-wrappers/lib/src';
import {ApiConstructorParams, PolymathAPI} from '../src/PolymathAPI';
import {valueToWei, weiToValue} from '../src/utils/convert';
import {ModuleName, ModuleType} from '../src';

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

  // Get sto factory address
  const dividendsFactory = await polymathAPI.moduleRegistry.getModulesByType({ moduleType: ModuleType.Dividends });

  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

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
    moduleName: ModuleName.etherDividendCheckpoint,
    address: dividendsFactory[0],
    maxCost: new BigNumber(100000),
    budget: new BigNumber(100000),
    archived: false,
    data: {
      wallet: '0x3333333333333333333333333333333333333333',
    },
  });

  const etherDividendAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.etherDividendCheckpoint,
  }))[0];
  console.log(etherDividendAddress);
  const etherDividendCheckpoint = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.etherDividendCheckpoint,
    address: etherDividendAddress,
  });

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
    eventName: EtherDividendCheckpointEvents.EtherDividendWithholdingWithdrawn,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Withholding withdrawn', log);
      }
    },
  });

  await etherDividendCheckpoint.pushDividendPayment({dividendIndex: 0, start: new Date(Date.now() + 10), iterations: 10});
  await etherDividendCheckpoint.withdrawWithholding({dividendIndex: 0});
});
