import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { PolyTokenEvents, SecurityTokenRegistryEvents, BigNumber } from '@polymathnetwork/abi-wrappers';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';

// This file acts as a valid sandbox.ts file in root directory for register a new Ticker on an unlocked node (like ganache)

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

  await polymathAPI.polyToken.subscribeAsync({
    eventName: PolyTokenEvents.Approval,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        await registerTicker();
      }
    },
  });

  await polymathAPI.securityTokenRegistry.subscribeAsync({
    eventName: SecurityTokenRegistryEvents.RegisterTicker,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Ticker registered!', log);
      }
    },
  });

  const registerTicker = async () => {
    await polymathAPI.securityTokenRegistry.registerTicker({
      ticker: ticker!,
      tokenName: tokenName!,
    });
  };

  const tickerAvailable = await polymathAPI.securityTokenRegistry.tickerAvailable({
    ticker: ticker!,
  });

  if (tickerAvailable) {
    const tickerFee = await polymathAPI.securityTokenRegistry.getTickerRegistrationFee();
    const polyBalance = await polymathAPI.polyToken.balanceOf();
    if (polyBalance.isGreaterThanOrEqualTo(tickerFee)) {
      const owner = await polymathAPI.getAccount();
      const spender = await polymathAPI.securityTokenRegistry.address();
      const allowance = await polymathAPI.polyToken.allowance({
        owner,
        spender,
      });
      if (allowance.isLessThan(tickerFee)) {
        await polymathAPI.polyToken.approve({
          spender,
          value: tickerFee,
        });
      } else {
        await registerTicker();
      }
    }
  }

  await polymathAPI.polyToken.unsubscribeAll();
  await polymathAPI.securityTokenRegistry.unsubscribeAll();
});
