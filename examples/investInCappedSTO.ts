import { BigNumber } from '@0x/utils';
import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { CappedSTOEvents } from '@polymathnetwork/abi-wrappers';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { ModuleName } from '../src';

// This file acts as a valid sandbox.ts file in root directory for invest in a capped STO token on an unlocked node (like ganache)

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
  const tokenAddress = await polymathAPI.securityTokenRegistry.getSecurityTokenAddress(ticker);
  const TEST = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromAddress(tokenAddress);

  const cappedSTOAddress = (await TEST.getModulesByName({ moduleName: ModuleName.CappedSTO }))[0];
  const cappedSTO = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.CappedSTO,
    address: cappedSTOAddress,
  });

  const generalTMAddress = (await TEST.getModulesByName({ moduleName: ModuleName.GeneralTransferManager }))[0];
  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.GeneralTransferManager,
    address: generalTMAddress,
  });

  const investorAddress = await polymathAPI.getAccount();
  const whitelist = await generalTM.whitelist({
    investorAddress,
  });

  await cappedSTO.subscribeAsync({
    eventName: CappedSTOEvents.TokenPurchase,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Token purchased!', log);
      }
    },
  });

  const investIn = async () => {
    const whitelist = await generalTM.whitelist({
      investorAddress,
    });
    if (whitelist.canBuyFromSTO) {
      await cappedSTO.buyTokens({
        beneficiary: investorAddress,
        value: new BigNumber(2),
        txData: {
          from: investorAddress,
        },
      });
    }
  };

  if (whitelist.canBuyFromSTO) {
    await investIn();
  } else {
    console.log('Your address is not approved to participate in this token sale.');
  }

  cappedSTO.unsubscribeAll();
});
