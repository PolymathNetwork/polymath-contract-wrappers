import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import ModuleFactoryWrapper from '../src/contract_wrappers/modules/module_factory_wrapper';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { ModuleName, ModuleType } from '../src';
import { BigNumber, ModuleRegistryEvents, LockUpTransferManagerEvents } from '@polymathnetwork/abi-wrappers';

// This file acts as a valid sandbox for using a lockup restriction transfer manager module on an unlocked node (like ganache)
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

  await polymathAPI.securityTokenRegistry.generateNewSecurityToken({
    name: tokenName!,
    ticker: ticker!,
    tokenDetails: 'details',
    divisible: true,
    treasuryWallet: myAddress,
    protocolVersion: '0',
  });

  console.log('Security Token Generated');

  const moduleName = ModuleName.LockUpTransferManager;

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

  const index = resultNames.indexOf(moduleName);

  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Get General TM Address to whitelist transfers
  const generalTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.GeneralTransferManager,
  }))[0];
  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.GeneralTransferManager,
    address: generalTMAddress,
  });

  await tickerSecurityTokenInstance.addModule({
    moduleName,
    address: modules[index],
    archived: false,
  });

  const lockUpTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.LockUpTransferManager,
  }))[0];

  const lockUpTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.LockUpTransferManager,
    address: lockUpTMAddress,
  });

  const randomBeneficiary1 = '0x2222222222222222222222222222222222222222';
  const randomBeneficiary2 = '0x3333333333333333333333333333333333333333';

  await generalTM.modifyKYCDataMulti({
    investors: [myAddress, randomBeneficiary1, randomBeneficiary2],
    canReceiveAfter: [new Date(), new Date(), new Date()],
    canSendAfter: [new Date(), new Date(), new Date()],
    expiryTime: [new Date(2035, 1), new Date(2035, 1), new Date(2035, 1)],
  });

  await tickerSecurityTokenInstance.issueMulti({
    investors: [myAddress, randomBeneficiary1, randomBeneficiary2],
    values: [new BigNumber(100), new BigNumber(100), new BigNumber(100)],
  });

  // Subscribe to event of addLockUpToUser
  await lockUpTM.subscribeAsync({
    eventName: LockUpTransferManagerEvents.AddLockUpToUser,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('New Lock Up added to user', log);
      }
    },
  });

  // Add new lock up to user multi
  const startTime = new Date(Date.now() + 10000);

  await lockUpTM.addNewLockUpToUserMulti({
    userAddresses: [myAddress, randomBeneficiary1, randomBeneficiary2],
    startTimes: [startTime, startTime, startTime],
    lockUpPeriodSeconds: [new BigNumber(5), new BigNumber(5), new BigNumber(5)],
    releaseFrequenciesSeconds: [new BigNumber(1), new BigNumber(1), new BigNumber(1)],
    lockupAmounts: [new BigNumber(20), new BigNumber(10), new BigNumber(10)],
    lockupNames: ['Lockup1', 'Lockup2', 'Lockup3'],
  });

  // Try to transfer 50, it is below lockup and will pass
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(50) });
  console.log('50 tokens transferred to randomBeneficiary2');

  // Try out transfer above lockup, will fail
  try {
    await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(31) });
  } catch (e) {
    console.log('Transfer above lockup amount fails as expected');
  }

  const sleep = (milliseconds: number) => {
    console.log(`Sleeping ${milliseconds / 1000} seconds`);
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
  await sleep(10000);

  // Time has passed, try out same transfer 1 above lockup, will pass
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(31) });
  console.log('31 more tokens transferred to randomBeneficiary2');

  // Try out transfer 10 above lockup, will fail
  try {
    await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(10) });
  } catch (e) {
    console.log('Transfer above lockup amount fails as expected');
  }

  await sleep(10000);

  // Transfer out the rest of tokens now that lockup is over
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(19) });
  console.log('19 last tokens transferred to randomBeneficiary2');

  tickerSecurityTokenInstance.unsubscribeAll();
});
