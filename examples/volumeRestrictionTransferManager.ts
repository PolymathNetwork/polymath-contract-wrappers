import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { VolumeRestrictionTMEvents_3_0_0, BigNumber } from '@polymathnetwork/abi-wrappers';
import ModuleFactoryWrapper from '../src/contract_wrappers/modules/module_factory_wrapper';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { ModuleName, ModuleType, RestrictionType } from '../src';

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
  const moduleStringName = 'VolumeRestrictionTM';
  const moduleName = ModuleName.VolumeRestrictionTM;

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

  // Call to add count transfer manager module
  await tickerSecurityTokenInstance.addModule({
    moduleName,
    address: modules[index],
    maxCost: setupCost,
    budget: setupCost,
    archived: false,
  });

  // Get Count TM address and create count transfer manager
  const vrtmAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.VolumeRestrictionTM,
  }))[0];
  const vrtm = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.VolumeRestrictionTM,
    address: vrtmAddress,
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

  // Mint yourself some tokens and make some transfers
  await tickerSecurityTokenInstance.issue({ investor: myAddress, value: new BigNumber(1000), data: '0x00' });

  // VRTM
  const delay = 3000;

  // Subscribe to event of add individual daily restriction
  await vrtm.subscribeAsync({
    eventName: VolumeRestrictionTMEvents_3_0_0.AddIndividualRestriction,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('individual restriction added', log);
      }
    },
  });

  // Call VRTM restrictions individual daily on this caller
  await vrtm.addIndividualDailyRestriction({
    holder: myAddress,
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 1),
    rollingPeriodInDays: 1,
    restrictionType: RestrictionType.Fixed,
    allowedTokens: new BigNumber(10),
  });
  // Transfer
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[0], value: new BigNumber(10) });
  // Modify vrtm daily and try transferring again after sleeping (time pass), then remove
  await vrtm.modifyIndividualDailyRestriction({
    holder: myAddress,
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 1),
    allowedTokens: new BigNumber(50),
    restrictionType: RestrictionType.Percentage,
  });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[1], value: new BigNumber(20) });
  // Remove
  await vrtm.removeIndividualDailyRestriction({
    investor: myAddress,
  });

  // Add individual restriction
  await vrtm.addIndividualRestriction({
    holder: randomBeneficiaries[0],
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 1),
    allowedTokens: new BigNumber(20),
    restrictionType: RestrictionType.Fixed,
    rollingPeriodInDays: 2,
  });
  // Modify individual restriction
  await vrtm.modifyIndividualRestriction({
    holder: randomBeneficiaries[0],
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 2),
    allowedTokens: new BigNumber(25),
    restrictionType: RestrictionType.Fixed,
    rollingPeriodInDays: 2,
  });
  // Transfer
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[0], value: new BigNumber(15) });
  // Remove
  await vrtm.removeIndividualRestriction({
    investor: randomBeneficiaries[0],
  });

  // Add Individual Daily Restriction Multi
  await vrtm.addIndividualDailyRestrictionMulti({
    holders: [myAddress, randomBeneficiaries[1]],
    startTimes: [new Date(Date.now().valueOf() + delay), new Date(Date.now().valueOf() + delay)],
    endTimes: [new Date(2035, 1), new Date(2035, 1)],
    allowedTokens: [new BigNumber(20), new BigNumber(20)],
    restrictionTypes: [RestrictionType.Fixed, RestrictionType.Fixed],
  });
  // Transfers
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[0], value: new BigNumber(10) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[1], value: new BigNumber(10) });
  // Modify Individual Daily Restriction Multi
  await vrtm.modifyIndividualDailyRestrictionMulti({
    holders: [myAddress, randomBeneficiaries[1]],
    startTimes: [new Date(Date.now().valueOf() + delay), new Date(Date.now().valueOf() + delay)],
    endTimes: [new Date(2035, 2), new Date(2035, 2)],
    allowedTokens: [new BigNumber(30), new BigNumber(30)],
    restrictionTypes: [RestrictionType.Fixed, RestrictionType.Fixed],
  });
  // Remove Individual Daily Restriction Multi
  await vrtm.removeIndividualDailyRestrictionMulti({ holders: [myAddress, randomBeneficiaries[1]] });

  // Add individual restriction multi
  await vrtm.addIndividualRestrictionMulti({
    holders: [myAddress, randomBeneficiaries[1]],
    startTimes: [new Date(Date.now().valueOf() + delay), new Date(Date.now().valueOf() + delay)],
    endTimes: [new Date(2035, 1), new Date(2035, 1)],
    allowedTokens: [new BigNumber(20), new BigNumber(20)],
    restrictionTypes: [RestrictionType.Fixed, RestrictionType.Fixed],
    rollingPeriodInDays: [2, 3],
  });
  // Transfers
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[0], value: new BigNumber(10) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[1], value: new BigNumber(10) });
  // Modify individual restriction multi
  await vrtm.modifyIndividualRestrictionMulti({
    holders: [myAddress, randomBeneficiaries[1]],
    startTimes: [new Date(Date.now().valueOf() + delay), new Date(Date.now().valueOf() + delay)],
    endTimes: [new Date(2035, 2), new Date(2035, 2)],
    allowedTokens: [new BigNumber(30), new BigNumber(30)],
    restrictionTypes: [RestrictionType.Fixed, RestrictionType.Fixed],
    rollingPeriodInDays: [3, 4],
  });
  // Remove
  await vrtm.removeIndividualRestrictionMulti({ holders: [myAddress, randomBeneficiaries[1]] });

  // Add default restriction for all, sleep, tx and remove
  await vrtm.addDefaultRestriction({
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 1),
    allowedTokens: new BigNumber(50),
    restrictionType: RestrictionType.Percentage,
    rollingPeriodInDays: 2,
  });
  // Transfers
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[0], value: new BigNumber(5) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[1], value: new BigNumber(5) });
  // Modify Default restriction
  await vrtm.modifyDefaultRestriction({
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 2),
    allowedTokens: new BigNumber(45),
    restrictionType: RestrictionType.Percentage,
    rollingPeriodInDays: 3,
  });
  // Remove
  await vrtm.removeDefaultRestriction({});

  // Add Default daily
  await vrtm.addDefaultDailyRestriction({
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 1),
    allowedTokens: new BigNumber(80),
    restrictionType: RestrictionType.Percentage,
  });
  // Transfer
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[0], value: new BigNumber(4) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[1], value: new BigNumber(4) });
  // Modify default daily restriction
  await vrtm.modifyDefaultDailyRestriction({
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2036, 2),
    allowedTokens: new BigNumber(85),
    restrictionType: RestrictionType.Fixed,
  });
  // Remove the default daily restriction
  await vrtm.removeDefaultDailyRestriction({});

  // Add some exemptions
  // Subscribe to event change exempt wallet list
  await vrtm.subscribeAsync({
    eventName: VolumeRestrictionTMEvents_3_0_0.ChangedExemptWalletList,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('changed exempt wallet list', log);
      }
    },
  });

  await vrtm.changeExemptWalletList({ wallet: randomBeneficiaries[2], change: true });

  // BalanceOf
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[0] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[1] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[2] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: myAddress }));

  vrtm.unsubscribeAll();
});
