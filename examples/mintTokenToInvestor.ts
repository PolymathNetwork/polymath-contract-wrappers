import { BigNumber } from '@0x/utils';
import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { SecurityTokenEvents } from '@polymathnetwork/abi-wrappers';
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

  const ticker = 'TEST';
  const tokenAddress = await polymathAPI.securityTokenRegistry.getSecurityTokenAddress(ticker);
  const TEST = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromAddress(tokenAddress);
  const investorAddress = '<investor address>'.toLowerCase();
  const generalTMAddress = (await TEST.getModulesByName({ moduleName: ModuleName.GeneralTransferManager }))[0];

  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.GeneralTransferManager,
    address: generalTMAddress,
  });

  const listInvestors = await generalTM.getAllKYCData();
  const found = listInvestors.find(function(addr) {
    return addr.investor == investorAddress;
  });

  await TEST.subscribeAsync({
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
    await TEST.issue({
      investor: investorAddress,
      value: new BigNumber(100),
      data: '',
      txData: {
        from: '<sto owner>'.toLowerCase(),
      },
    });
  } else {
    console.log('Please make sure beneficiary address has been whitelisted');
  }

  TEST.unsubscribeAll();
});
