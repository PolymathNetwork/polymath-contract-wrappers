import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { EtherDividendCheckpointEvents, BigNumber } from '@polymathnetwork/abi-wrappers';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { bytes32ToString } from '../src/utils/convert';
import { ModuleName, ModuleType } from '../src';
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
  const myAddress = (await polymathAPI.getAccount()).toLowerCase();
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
  console.log('Ticker is:' + ticker);
  await polymathAPI.securityTokenRegistry.registerNewTicker({
    owner: myAddress,
    ticker: ticker!,
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
    tokenDetails: 'details',
    divisible: true,
    treasuryWallet: myAddress,
    protocolVersion: '0',
  });

  console.log('Security token has been generated');

  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  const moduleStringName = 'EtherDividendCheckpoint';
  const moduleName = ModuleName.EtherDividendCheckpoint;
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
  const index = resultNames.indexOf(moduleStringName);

  // Get setup cost
  const factory = await polymathAPI.moduleFactory.getModuleFactory(modules[index]);
  const setupCost = await factory.setupCostInPoly();

  // Call to add etherdividend module
  await tickerSecurityTokenInstance.addModule({
    moduleName,
    address: modules[index],
    maxCost: setupCost,
    budget: setupCost,
    archived: false,
    data: {
      wallet: '0x3333333333333333333333333333333333333333',
    },
  });

  // Get module for ether dividend checkpoint and address for module
  const etherDividendAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.EtherDividendCheckpoint,
  }))[0];
  console.log(etherDividendAddress);
  const etherDividendCheckpoint = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.EtherDividendCheckpoint,
    address: etherDividendAddress,
  });

  // Get General TM Address to whitelist transfers
  const generalTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.GeneralTransferManager,
  }))[0];
  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.GeneralTransferManager,
    address: generalTMAddress,
  });

  // Add owner address in the whitelist to allow issue tokens
  await generalTM.modifyKYCData({
    investor: myAddress,
    canSendAfter: new Date(),
    canReceiveAfter: new Date(),
    expiryTime: new Date(2020, 0),
    txData: {
      from: await polymathAPI.getAccount(),
    },
  });

  // Mint yourself some tokens and make some transfers
  await tickerSecurityTokenInstance.issue({
    investor: myAddress,
    value: new BigNumber(50),
    data: '0x00',
  });

  const randomInvestors = [
    '0x1111111111111111111111111111111111111111',
    '0x2222222222222222222222222222222222222222',
    '0x3333333333333333333333333333333333333333',
  ];

  // Add beneficiaries address to whitelist
  await generalTM.modifyKYCDataMulti({
    investors: randomInvestors,
    canSendAfter: [new Date(), new Date(), new Date()],
    canReceiveAfter: [new Date(), new Date(), new Date()],
    expiryTime: [new Date(2020, 0), new Date(2020, 0), new Date(2020, 0)],
  });

  await tickerSecurityTokenInstance.transfer({ to: randomInvestors[0], value: new BigNumber(10) });
  await tickerSecurityTokenInstance.transfer({ to: randomInvestors[1], value: new BigNumber(20) });
  await tickerSecurityTokenInstance.transfer({ to: randomInvestors[2], value: new BigNumber(20) });

  // Create Dividends
  await etherDividendCheckpoint.createDividendWithExclusions({
    name: 'MyDividend1',
    value: new BigNumber(1),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
    excluded: [randomInvestors[1], randomInvestors[2]],
  });

  // Create a checkpoint
  await tickerSecurityTokenInstance.createCheckpoint({});

  await etherDividendCheckpoint.createDividendWithCheckpointAndExclusions({
    name: 'MyDividend2',
    value: new BigNumber(1),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
    checkpointId: 1,
    excluded: [randomInvestors[0], randomInvestors[1]],
  });

  await etherDividendCheckpoint.createDividend({
    name: 'MyDividend3',
    value: new BigNumber(1),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
  });

  await etherDividendCheckpoint.createDividendWithCheckpoint({
    name: 'MyDividend4',
    value: new BigNumber(1),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
    checkpointId: 1,
  });

  console.log('4 types of ether dividends created');

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
    dividendIndex: 1,
    expiry: new Date(2038, 2),
    maturity: new Date(2037, 4),
  });

  etherDividendCheckpoint.unsubscribeAll();
});
