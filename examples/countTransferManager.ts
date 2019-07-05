import { BigNumber } from '@0x/utils';
import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { CountTransferManagerEvents } from '@polymathnetwork/abi-wrappers';
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
  await polymathAPI.securityTokenRegistry.isTickerAvailable({
    tokenName: ticker!,
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
  await polymathAPI.securityTokenRegistry.generateSecurityToken({
    name: tokenName!,
    ticker: ticker!,
    details: 'http://',
    divisible: false,
  });

  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Get sto factory address
  const moduleStringName = 'CountTransferManager';
  const moduleName = ModuleName.countTransferManager;
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

  const finalNames = resultNames.map(name => {
    return bytes32ToString(name);
  });
  const index = finalNames.indexOf(moduleStringName);

  // Get setup cost
  const factory = await polymathAPI.moduleFactory.getModuleFactory(modules[index]);
  const setupCost = await factory.setupCostInPoly();

  // Call to add count transfer manager module with max 3 holders
  await tickerSecurityTokenInstance.addModule({
    moduleName,
    address: modules[index],
    maxCost: setupCost,
    budget: setupCost,
      archived: false,
    data: {
      maxHolderCount: 3,
    },
  });

  // Get Count TM address and create count transfer manager
  const countTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.countTransferManager,
  }))[0];
  console.log(countTMAddress);
  const countTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.countTransferManager,
    address: countTMAddress,
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

  const randomBeneficiary1 = '0x3444444444444444444444444444444444444444';
  const randomBeneficiary2 = '0x5544444444444444444444444444444444444444';
  const randomBeneficiary3 = '0x6644444444444444444444444444444444444444';

  // Mint yourself some tokens and make some transfers
  await tickerSecurityTokenInstance.issue({ investor: myAddress, value: new BigNumber(200), data: '' });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary1, value: new BigNumber(10) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(20) });

  // We need to increase max holder account to get another transfer through (We are currently at max)
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
  await countTM.changeHolderCount({ maxHolderCount: 4 });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary3, value: new BigNumber(30) });

  // Show the balances of our token holders
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiary1 }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiary2 }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiary3 }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: myAddress }));

  console.log('Funds transferred');

  countTM.unsubscribeAll();
});
