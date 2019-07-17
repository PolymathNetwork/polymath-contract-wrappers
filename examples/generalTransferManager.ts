import { BigNumber } from '@0x/utils';
import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { GeneralTransferManagerEvents } from '@polymathnetwork/abi-wrappers/lib/src';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { valueToWei, weiToValue } from '../src/utils/convert';
import { ModuleName } from '../src';

// This file acts as a valid sandbox for using a general transfer manager  module on an unlocked node (like ganache)

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

  // Get General TM Address
  const generalTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.generalTransferManager,
  }))[0];

  // Get general TM module instance
  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.generalTransferManager,
    address: generalTMAddress,
  });

  // Modify transfer requirements
  // Subscribe to event of modify transfer requirements
  await generalTM.subscribeAsync({
    eventName: GeneralTransferManagerEvents.ModifyTransferRequirements,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Allow all transfers', log);
      }
    },
  });
  await generalTM.changeAllowAllTransfers({ allowAllTransfers: true });
  const randomBeneficiary1 = '0x3444444444444444444444444444444444444444';
  const randomBeneficiary2 = '0x5544444444444444444444444444444444444444';

  // Mint yourself some tokens and transfer them around, check balances
  await tickerSecurityTokenInstance.issue({ investor: myAddress, value: new BigNumber(200), data: '' });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary1, value: new BigNumber(50) });
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiary1 }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: myAddress }));

  // Disallow all transfers between token holders
  await generalTM.changeAllowAllTransfers({ allowAllTransfers: false });

  // Add whitelist special users
  await generalTM.modifyWhitelistMulti({
    investors: [randomBeneficiary1, randomBeneficiary2, myAddress],
    canBuyFromSTO: [true, true, true],
    canReceiveAfters: [new Date(2018, 1), new Date(2018, 1), new Date(2018, 1)],
    canSendAfters: [new Date(), new Date(), new Date(2018, 2)],
    expiryTimes: [new Date(2035, 1), new Date(2035, 1), new Date(2035, 1)],
  });

  // Change allow all whitelist transfers
  await generalTM.changeAllowAllWhitelistTransfers({ allowAllWhitelistTransfers: true });

  // Verify we can make transfers
  console.log(
    await tickerSecurityTokenInstance.canTransferFrom({
      from: myAddress,
      to: randomBeneficiary1,
      data: '0x00',
      value: new BigNumber(10),
    }),
  );
  console.log(
    await tickerSecurityTokenInstance.canTransferFrom({
      from: myAddress,
      to: randomBeneficiary2,
      data: '0x00',
      value: new BigNumber(10),
    }),
  );

  // Make the transfers
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary1, value: new BigNumber(10) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(10) });
  console.log('Funds transferred');

  generalTM.unsubscribeAll();
});
