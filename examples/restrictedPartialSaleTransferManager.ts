import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { RestrictedPartialSaleTMEvents, BigNumber } from '@polymathnetwork/abi-wrappers';
import ModuleFactoryWrapper from '../src/contract_wrappers/modules/module_factory_wrapper';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { ModuleName, ModuleType } from '../src';

// This file acts as a valid sandbox for using a volume restriction transfer manager module on an unlocked node (like ganache)

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

  // Get sto factory address
  const moduleStringName = 'RestrictedPartialSaleTM';
  const moduleName = ModuleName.RestrictedPartialSaleTM;

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

  const factory = await polymathAPI.moduleFactory.getModuleFactory(modules[index]);
  const setupCost = await factory.setupCostInPoly();

  // Call to add restricted partial sale transfer manager module
  console.log('Adding module...');
  await tickerSecurityTokenInstance.addModule({
    moduleName,
    address: modules[index],
    maxCost: setupCost,
    budget: setupCost,
    archived: false,
    data: {
      treasuryWallet: myAddress,
    },
  });

  const restrictedPartialSaleAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.RestrictedPartialSaleTM,
  }))[0];

  const restrictedPartialSale = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.RestrictedPartialSaleTM,
    address: restrictedPartialSaleAddress,
  });

  // Get General TM Address and allow all transfers so we can test unlocked account transfers
  const generalTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.GeneralTransferManager,
  }))[0];
  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.GeneralTransferManager,
    address: generalTMAddress,
  });

  const randomBeneficiaries = [
    '0x3444444444444444444444444444444444444444',
    '0x5544444444444444444444444444444444444444',
    '0x6644444444444444444444444444444444444444',
  ];
  // Add all address in the whitelist
  await generalTM.modifyKYCDataMulti({
    investors: randomBeneficiaries.concat(myAddress),
    canSendAfter: [new Date(), new Date(), new Date(), new Date()],
    canReceiveAfter: [new Date(), new Date(), new Date(), new Date()],
    expiryTime: [new Date(2021, 10), new Date(2021, 10), new Date(2021, 10), new Date(2021, 10)],
    txData: {
      from: await polymathAPI.getAccount(),
    },
  });
  console.log('Kyc data modified');

  // Mint yourself some tokens and make some transfers
  await tickerSecurityTokenInstance.issue({ investor: myAddress, value: new BigNumber(1000) });
  console.log('1000 tokens issued to my wallet (treasury wallet)');

  // Subscribe to event change exempt wallet list
  await restrictedPartialSale.subscribeAsync({
    eventName: RestrictedPartialSaleTMEvents.ChangedExemptWalletList,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('individual restriction added', log);
      }
    },
  });

  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[2], value: new BigNumber(10) });
  console.log('Transfer worked as this is the treasury wallet address:');

  await restrictedPartialSale.changeExemptWalletList({ wallet: myAddress, exempted: false });

  // Transfers
  // Try out transfer 10 during restrictedPartialSale, will fail
  try {
    await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[2], value: new BigNumber(10) });
  } catch (e) {
    console.log('Transfer of 10 tokens when wallet is not exempted fails as expected');
  }

  // BalanceOf
  console.log('Showing beneficiaries balances');
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[0] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[1] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[2] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: myAddress }));

  restrictedPartialSale.unsubscribeAll();
});
