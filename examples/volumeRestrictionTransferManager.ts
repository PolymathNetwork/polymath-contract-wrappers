import { BigNumber } from '@0x/utils';
import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ModuleFactoryContract } from '@polymathnetwork/abi-wrappers';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { valueToWei, weiToValue, bytes32ToString } from '../src/utils/convert';
import { ModuleName, ModuleType, RestrictionTypes } from '../src';

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

  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Get sto factory address
  const moduleStringName = 'VolumeRestrictionTransferManager';
  const moduleName = ModuleName.volumeRestrictionTM;

  const modules = await polymathAPI.moduleRegistry.getModulesByType({
    moduleType: ModuleType.TransferManager,
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

  // Call to add count transfer manager module with max 3 holders
  await tickerSecurityTokenInstance.addModule({
    moduleName,
    address: modules[index],
    maxCost: new BigNumber(100000),
    budget: new BigNumber(100000),
  });

  // Get Count TM address and create count transfer manager
  const vrtmAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.volumeRestrictionTM,
  }))[0];
  const vrtm = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.volumeRestrictionTM,
    address: vrtmAddress,
  });

  // Get General TM Address and allow all transfers so we can test unlocked account transfers
  const generalTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.generalTransferManager,
  }))[0];
  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.generalTransferManager,
    address: generalTMAddress,
  });
  await generalTM.changeAllowAllTransfers({ allowAllTransfers: true });

  // Mint yourself some tokens and make some transfers
  await tickerSecurityTokenInstance.mint({ investor: address[0], value: new BigNumber(100) });

  // VRTM
  const delay = 2000;
  const randomBeneficiary1 = '0x3444444444444444444444444444444444444444';
  const randomBeneficiary2 = '0x5544444444444444444444444444444444444444';
  const randomBeneficiary3 = '0x6644444444444444444444444444444444444444';
  const now = Date.now();
  function sleepy() {
    while (Date.now() < now + delay) {
      // Do nothing for dev purposes
    }
  }

  // Call VRTM restrictions individual daily on this caller
  await vrtm.addIndividualDailyRestriction({
    holder: address[0],
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 1),
    rollingPeriodInDays: 1,
    restrictionType: RestrictionTypes.Fixed,
    allowedTokens: new BigNumber(10),
  });
  sleepy();
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary1, value: new BigNumber(10) });

  // Modify vrtm daily and try transferring again after sleeping (time pass), then remove
  await vrtm.modifyIndividualDailyRestriction({
    holder: address[0],
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 1),
    allowedTokens: new BigNumber(50),
    restrictionType: RestrictionTypes.Percentage,
  });
  sleepy();
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(20) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary3, value: new BigNumber(30) });
  await vrtm.removeIndividualDailyRestriction({
    holder: address[0],
  });

  // Modify vrtm individual restrictions and multi and try transferring again after sleeping (time pass)
  await vrtm.addIndividualRestriction({
    holder: randomBeneficiary1,
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 1),
    allowedTokens: new BigNumber(20),
    restrictionType: RestrictionTypes.Fixed,
    rollingPeriodInDays: 2,
  });
  await vrtm.addIndividualRestrictionMulti({
    holders: [address[0], randomBeneficiary2],
    startTimes: [new Date(Date.now().valueOf() + delay), new Date(Date.now().valueOf() + delay)],
    endTimes: [new Date(2035, 1), new Date(2035, 1)],
    allowedTokens: [new BigNumber(20), new BigNumber(20)],
    restrictionTypes: [RestrictionTypes.Fixed, RestrictionTypes.Fixed],
    rollingPeriodInDays: [2, 3],
  });
  sleepy();
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary1, value: new BigNumber(10) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(10) });
  await vrtm.removeIndividualRestriction({
    holder: address[0],
  });

  // Add default restriction for all, sleep, tx and remove
  await vrtm.addDefaultRestriction({
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 1),
    allowedTokens: new BigNumber(50),
    restrictionType: RestrictionTypes.Percentage,
    rollingPeriodInDays: 2,
  });
  sleepy();
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary1, value: new BigNumber(5) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(5) });
  await vrtm.removeDefaultRestriction({});

  // Default daily and try to transfer after sleep
  await vrtm.addDefaultDailyRestriction({
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 1),
    allowedTokens: new BigNumber(80),
    restrictionType: RestrictionTypes.Percentage,
  });
  sleepy();
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary1, value: new BigNumber(4) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(4) });

  // BalanceOf
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiary1 }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiary2 }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiary3 }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: address[0] }));
});
