import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { PolyTokenEvents, SecurityTokenRegistryEvents } from '@polymathnetwork/abi-wrappers';
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

  const ticker = 'TEST';
  const tokenName = 'TEST TOKEN';

  const registerTicker = async () => {
    await polymathAPI.securityTokenRegistry.registerTicker({
      ticker,
      tokenName,
    });
  };

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

  const tickerAvailable = await polymathAPI.securityTokenRegistry.isTickerAvailable({
    tokenName: ticker,
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

  polymathAPI.polyToken.unsubscribeAll();
});
