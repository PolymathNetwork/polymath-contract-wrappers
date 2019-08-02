import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { GeneralTransferManagerEvents, BigNumber } from '@polymathnetwork/abi-wrappers';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { ModuleName, TransferType } from '../src';

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

  // Get General TM Address
  const generalTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.GeneralTransferManager,
  }))[0];

  // Get general TM module instance
  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.GeneralTransferManager,
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

  const randomBeneficiary1 = '0x3444444444444444444444444444444444444444';
  const randomBeneficiary2 = '0x5544444444444444444444444444444444444444';

  // Add beneficiaries in the whitelist with distant dates to send and receive
  const delay = 10000000000;

  await generalTM.modifyKYCDataMulti({
    investors: [randomBeneficiary1, randomBeneficiary2],
    canSendAfter: [new Date(Date.now().valueOf() + delay), new Date(Date.now().valueOf() + delay)],
    canReceiveAfter: [new Date(Date.now().valueOf() + delay), new Date(Date.now().valueOf() + delay)],
    expiryTime: [new Date(Date.now().valueOf() + delay), new Date(Date.now().valueOf() + delay)],
  });

  // Mint yourself some tokens
  await tickerSecurityTokenInstance.issue({ investor: myAddress, value: new BigNumber(200), data: '0x00' });

  // No one can receive tokens
  console.log(
    await tickerSecurityTokenInstance.canTransfer({
      to: randomBeneficiary1,
      data: '0x00',
      value: new BigNumber(10),
    }),
  );

  // Allow all transfers between token holders
  await generalTM.modifyTransferRequirementsMulti({
    transferTypes: [TransferType.General, TransferType.Issuance, TransferType.Redemption],
    fromValidKYC: [false, false, false],
    toValidKYC: [false, false, false],
    fromRestricted: [false, false, false],
    toRestricted: [false, false, false],
  });

  // Now we can transfer to all
  console.log(
    await tickerSecurityTokenInstance.canTransfer({
      to: randomBeneficiary1,
      data: '0x00',
      value: new BigNumber(10),
    }),
  );

  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary1, value: new BigNumber(50) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(10) });
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: myAddress }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiary1 }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiary2 }));
  console.log('Funds transferred');

  generalTM.unsubscribeAll();
});
