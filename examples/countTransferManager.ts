import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { CountTransferManagerEvents, BigNumber } from '@polymathnetwork/abi-wrappers';
import ModuleFactoryWrapper from '../src/contract_wrappers/modules/module_factory_wrapper';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { bytes32ToString } from '../src/utils/convert';
import { ModuleName, ModuleType } from '../src';

// This file acts as a valid sandbox for using a count transfer manager  module on an unlocked node (like ganache)
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
  const myAddress = await polymathAPI.getAccount();

  // Get some poly tokens in your account and the security token
  // Poly token faucet works on test net
  await polymathAPI.getPolyTokens({ amount: new BigNumber(1000000) });

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
    tokenDetails: 'http://',
    divisible: true,
    treasuryWallet: myAddress,
    protocolVersion: '0',
  });

  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Get sto factory address
  const moduleStringName = 'CountTransferManager';
  const moduleName = ModuleName.CountTransferManager;
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
  const index = resultNames.indexOf(moduleStringName);

  // Get setup cost
  const factory = await polymathAPI.moduleFactory.getModuleFactory(modules[index]);
  const setupCost = await factory.setupCostInPoly();

  const randomBeneficiaries = [
    '0x3444444444444444444444444444444444444444',
    '0x5544444444444444444444444444444444444444',
  ];

  // Call to add count transfer manager module with max 3 holders
  await tickerSecurityTokenInstance.addModuleWithLabel({
    moduleName,
    address: modules[index],
    maxCost: setupCost,
    budget: setupCost,
    archived: false,
    label: 'CTM Test',
    data: {
      maxHolderCount: randomBeneficiaries.length + 1,
    },
  });

  // Get Count TM address and create count transfer manager
  const countTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.CountTransferManager,
  }))[0];
  const countTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.CountTransferManager,
    address: countTMAddress,
  });

  // Get General TM Address and allow all transfers so we can test unlocked account transfers
  const generalTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.GeneralTransferManager,
  }))[0];
  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.GeneralTransferManager,
    address: generalTMAddress,
  });

  // Add owner address in the whitelist to allow mint tokens
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
    value: new BigNumber(200),
  });

  // Add beneficiaries address to whitelist
  await generalTM.modifyKYCDataMulti({
    investors: randomBeneficiaries,
    canSendAfter: [new Date(), new Date()],
    canReceiveAfter: [new Date(), new Date()],
    expiryTime: [new Date(2020, 0), new Date(2020, 0)],
  });

  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[0], value: new BigNumber(10) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[1], value: new BigNumber(20) });

  // Subscribe to event of modify holder count
  await countTM.subscribeAsync({
    eventName: CountTransferManagerEvents.ModifyHolderCount,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Modify holder count', log);
      }
    },
  });

  // We need to increase max holder account to get another transfer through (We are currently at max)
  randomBeneficiaries.push('0x6644444444444444444444444444444444444444');
  await countTM.changeHolderCount({ maxHolderCount: randomBeneficiaries.length + 1 });

  // And adding to our whitelist
  await generalTM.modifyKYCData({
    investor: randomBeneficiaries[2],
    canSendAfter: new Date(),
    canReceiveAfter: new Date(),
    expiryTime: new Date(2020, 0),
    txData: {
      from: await polymathAPI.getAccount(),
    },
  });

  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[2], value: new BigNumber(30) });

  // Show the balances of our token holders
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[0] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[1] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[2] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: myAddress }));

  console.log('Funds transferred');

  countTM.unsubscribeAll();
});
