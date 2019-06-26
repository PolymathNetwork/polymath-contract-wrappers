import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { PolyTokenEvents, SecurityTokenRegistryEvents } from '@polymathnetwork/abi-wrappers';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';

// This file acts as a valid sandbox.ts file in root directory for launch a new Token on an unlocked node (like ganache)

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

  const launchToken = async () => {
    await polymathAPI.securityTokenRegistry.generateSecurityToken({
      name: tokenName,
      ticker,
      details: 'http://www.polymath.network',
      divisible: true,
    });
  };

  await polymathAPI.polyToken.subscribeAsync({
    eventName: PolyTokenEvents.Approval,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        await launchToken();
      }
    },
  });

  await polymathAPI.securityTokenRegistry.subscribeAsync({
    eventName: SecurityTokenRegistryEvents.NewSecurityToken,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('New security token!', log);
      }
    },
  });

  const securityTokenLaunchFee = await polymathAPI.securityTokenRegistry.getSecurityTokenLaunchFee();
  const polyBalance = await polymathAPI.polyToken.balanceOf();
  if (polyBalance.isGreaterThanOrEqualTo(polyBalance)) {
    const owner = await polymathAPI.getAccount();
    const spender = await polymathAPI.securityTokenRegistry.address();
    const allowance = await polymathAPI.polyToken.allowance({
      owner,
      spender,
    });
    if (allowance.isLessThan(securityTokenLaunchFee)) {
      await polymathAPI.polyToken.approve({
        spender,
        value: securityTokenLaunchFee,
      });
    } else {
      await launchToken();
    }
  }

  polymathAPI.securityTokenRegistry.unsubscribeAll();
});
