import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { ModuleFactory } from '../src/contract_wrappers/modules/module_factory_wrapper';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { ModuleName, ModuleType } from '../src';
import { BigNumber, BlacklistTransferManagerEvents_3_0_0 } from '@polymathnetwork/abi-wrappers';

// This file acts as a valid sandbox for using a blacklist restriction transfer manager module on an unlocked node (like ganache)
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

  await polymathAPI.securityTokenRegistry.generateNewSecurityToken({
    name: tokenName!,
    ticker: ticker!,
    tokenDetails: 'details',
    divisible: true,
    treasuryWallet: myAddress,
    protocolVersion: '0',
  });

  console.log('Security Token Generated');

  const moduleName = ModuleName.BlacklistTransferManager;

  const modules = await polymathAPI.moduleRegistry.getModulesByType({
    moduleType: ModuleType.TransferManager,
  });

  const instances: Promise<ModuleFactory>[] = [];
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

  const blacklistTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.BlacklistTransferManager,
  }))[0];

  const blacklistTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.BlacklistTransferManager,
    address: blacklistTMAddress,
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

  // Subscribe to event of addblacklisttype
  await blacklistTM.subscribeAsync({
    eventName: BlacklistTransferManagerEvents_3_0_0.AddBlacklistType,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('New Lock Up added to user', log);
      }
    },
  });

  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(10) });
  console.log(' No blacklist, 10 tokens transferred to randomBeneficiary2');

  const startTime = new Date(Date.now() + 10000);
  const endTime = new Date(Date.now() + 20000);
  await blacklistTM.addInvestorToNewBlacklist({
    investor: myAddress,
    startTime,
    endTime,
    repeatPeriodTime: 1,
    blacklistName: 'ExampleBlacklist',
  });

  console.log('Blacklist starts in 10 seconds');
  const sleep = (milliseconds: number) => {
    console.log(`Sleeping ${milliseconds / 1000} seconds`);
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
  await sleep(15000);

  // Try out transfer 10 above lockup, will fail
  try {
    await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(10) });
  } catch (e) {
    console.log('Transfer of 10 tokens during blacklist period amount fails as expected');
  }

  console.log('Blacklist ends in 5 seconds');
  await sleep(10000);

  // Blacklist now over
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(10) });
  console.log('10 more tokens transferred to randomBeneficiary2');

  const newStartTime = new Date(Date.now() + 10000);
  const newEndTime = new Date(Date.now() + 3600000);
  const testBlacklistNames = ['TestBlacklist1', 'TestBlacklist2', 'TestBlacklist3'];
  await blacklistTM.addNewBlacklistTypeMulti({
    blacklistNames: testBlacklistNames,
    startTimes: [newStartTime, newStartTime, newStartTime],
    endTimes: [newEndTime, newEndTime, newEndTime],
    repeatPeriodTimes: [1, 2, 3],
  });
  console.log('Many more example blacklists created');

  await blacklistTM.addMultiInvestorToBlacklistMulti({
    blacklistNames: testBlacklistNames,
    userAddresses: [myAddress, randomBeneficiary1, randomBeneficiary2],
  });
  console.log('Multi investors added to multi blacklists');

  await sleep(15000);

  // Try out transfer 10 during blacklist, will fail
  try {
    await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(10) });
  } catch (e) {
    console.log('Transfer of 10 tokens during new blacklist period amount fails as expected');
  }

  await blacklistTM.deleteInvestorFromAllBlacklistMulti({
    investors: [myAddress, randomBeneficiary1, randomBeneficiary2],
  });
  console.log('Multi investors deleted from all blacklists they are part of');

  // Transfer out more tokens now that the investor has been removed from the new blacklist
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(10) });
  console.log('10 more tokens were successfully transferred to randomBeneficiary2');

  tickerSecurityTokenInstance.unsubscribeAll();
});
