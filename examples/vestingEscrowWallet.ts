import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { BigNumber } from '@polymathnetwork/abi-wrappers';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { ModuleName, ModuleType } from '../src';
import ModuleFactoryWrapper from '../src/contract_wrappers/modules/module_factory_wrapper';

// This file acts as a valid sandbox.ts file in root directory for adding a new Vesting Escrow Wallet module

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
    divisible: false,
    treasuryWallet: myAddress,
    protocolVersion: '0',
  });

  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);
  console.log('ST address:', await tickerSecurityTokenInstance.address());

  // Get permission manager factory address
  const moduleName = ModuleName.VestingEscrowWallet;

  const modules = await polymathAPI.moduleRegistry.getModulesByType({
    moduleType: ModuleType.Wallet,
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

  const factory = await polymathAPI.moduleFactory.getModuleFactory(modules[index]);
  const setupCost = await factory.setupCostInPoly();

  // Call to add count transfer manager module
  await tickerSecurityTokenInstance.addModule({
    moduleName,
    address: modules[index],
    maxCost: setupCost,
    budget: setupCost,
    archived: false,
    data: {
      treasuryWallet: '0x2320351c4670a19C3DD05789d2648DD129A14669',
    },
  });

  const VEWAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.VestingEscrowWallet,
  }))[0];
  const VEW = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.VestingEscrowWallet,
    address: VEWAddress,
  });

  const VEWModuleAddress = await VEW.address();
  const numberOfTokens = 500;
  const TEMPLATE_NAME = 'Test Template';
  const beneficiary = '0x72aF7849ffc7753B5ccEA5cb80F97e9Aeaf7d999';

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
    canSendAfter: new Date(2019, 7),
    canReceiveAfter: new Date(2019, 7),
    expiryTime: new Date(2020, 1),
    txData: {
      from: await polymathAPI.getAccount(),
    },
  });

  // Mint yourself some tokens and make some transfers
  await tickerSecurityTokenInstance.issue({
    investor: myAddress,
    value: new BigNumber(100000),
  });

  // Add VEW module in the whitelist (remove this on 3.1 release)
  await generalTM.modifyKYCData({
    investor: VEWModuleAddress,
    canSendAfter: new Date(2019, 7),
    canReceiveAfter: new Date(2019, 7),
    expiryTime: new Date(2020, 1),
    txData: {
      from: await polymathAPI.getAccount(),
    },
  });

  // Add Template
  await VEW.addTemplate({
    name: TEMPLATE_NAME,
    numberOfTokens,
    duration: 100,
    frequency: 10,
  });

  await tickerSecurityTokenInstance.approve({
    spender: VEWModuleAddress,
    value: new BigNumber(numberOfTokens),
  });

  // Add Schedule
  await VEW.addScheduleFromTemplate({
    beneficiary,
    templateName: TEMPLATE_NAME,
    startTime: new Date(new Date().getTime() + 1 * 60000),
  });
});
