import { BigNumber } from '@0x/utils';
import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';

import { Web3Wrapper } from '@0x/web3-wrapper';
import {ApiConstructorParams, PolymathAPI} from '../src/PolymathAPI';
import {valueToWei, weiToValue} from '../src/utils/convert';
import {FundRaiseType, ModuleName, ModuleType} from '../src';


// This file acts as a valid sandbox.ts file in root directory for adding a usdtieredSTO module on an unlocked node (like ganache)

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

  // Get sto factory address
  const stoFactory = await polymathAPI.moduleRegistry.getModulesByType({ moduleType: ModuleType.STO });

  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Get some poly tokens on the security token instance
  await polymathAPI.getPolyTokens({
    amount: new BigNumber(1000000),
    address: await tickerSecurityTokenInstance.address(),
  });

  // Call to add module
  const usdTieredResult = await tickerSecurityTokenInstance.addModule({
    moduleName: ModuleName.usdTieredSTO,
    address: stoFactory[1],
    maxCost: new BigNumber(100000),
    budget: new BigNumber(100000),
    data: {
      startTime: new Date(2030, 1),
      endTime: new Date(2031, 1),
      ratePerTier: [new BigNumber(10), new BigNumber(10)],
      ratePerTierDiscountPoly: [new BigNumber(8), new BigNumber(9)],
      tokensPerTierTotal: [new BigNumber(10), new BigNumber(10)],
      tokensPerTierDiscountPoly: [new BigNumber(8), new BigNumber(8)],
      nonAccreditedLimitUSD: new BigNumber(5),
      minimumInvestmentUSD: new BigNumber(5),
      fundRaiseTypes: [FundRaiseType.ETH, FundRaiseType.POLY],
      wallet: '0x3333333333333333333333333333333333333333',
      reserveWallet: '0x5555555555555555555555555555555555555555',
      usdTokens: ['0x6666666666666666666666666666666666666666', '0x4444444444444444444444444444444444444444'],
    },
  });
  console.log(usdTieredResult);
});
