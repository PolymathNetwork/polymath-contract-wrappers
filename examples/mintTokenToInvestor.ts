import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { SecurityTokenEvents, BigNumber } from '@polymathnetwork/abi-wrappers';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { ModuleName } from '../src/types';

// This file acts as a valid sandbox.ts file in root directory for adding a cappedSTO module on an unlocked node (like ganache)

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

  const tokenAddress = await polymathAPI.securityTokenRegistry.getSecurityTokenAddress(ticker!);
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromAddress(tokenAddress);

  const investorAddress = '0x1111111111111111111111111111111111111111';
  const generalTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.GeneralTransferManager,
  }))[0];

  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.GeneralTransferManager,
    address: generalTMAddress,
  });

  await generalTM.modifyKYCData({
    investor: investorAddress,
    canReceiveAfter: new Date(),
    canSendAfter: new Date(),
    expiryTime: new Date(2035, 1),
  });

  const listInvestors = await generalTM.getAllKYCData();
  const found = listInvestors.find(function(addr) {
    return addr.investor == investorAddress;
  });

  await tickerSecurityTokenInstance.subscribeAsync({
    eventName: SecurityTokenEvents.Issued,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Minted', log);
      }
    },
  });

  if (found) {
    await tickerSecurityTokenInstance.issue({
      investor: investorAddress,
      value: new BigNumber(100),
      data: '0x51',
      txData: {
        from: myAddress.toLowerCase(),
      },
    });
    console.log('100 tokens issued');
  } else {
    console.log('Please make sure beneficiary address has been whitelisted');
  }
  console.log('Balance of investor:');
  console.log((await tickerSecurityTokenInstance.balanceOf({ owner: investorAddress })).toNumber());

  tickerSecurityTokenInstance.unsubscribeAll();
});
