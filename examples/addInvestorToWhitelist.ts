import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { GeneralTransferManagerEvents, BigNumber } from '@polymathnetwork/abi-wrappers';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { ModuleName } from '../src';
import {registerTicker} from './example_components/registerTickerComponent';
import {launchToken} from './example_components/launchTokenComponent';
import {moduleInstance} from './example_components/moduleInstanceComponent';

// This file acts as a valid sandbox.ts file in root directory for adding a new address to the whitelist on an unlocked node (like ganache)

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

  // Register ticker and launch token
  await registerTicker(polymathAPI, ticker ? ticker : '', myAddress);
  await launchToken(polymathAPI, tokenName ? tokenName : '', ticker ? ticker : '', 'http://', myAddress, false);
  console.log('Ticker was registered and token was launched successfully!');

  // Get general TM module instance
  const generalTM = await moduleInstance(polymathAPI, ModuleName.GeneralTransferManager, ticker ? ticker : '');

  // Subscribe to event of modify KYC data
  await generalTM.subscribeAsync({
    eventName: GeneralTransferManagerEvents.ModifyKYCData,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Whitlist modified!', log);
      }
    },
  });

  console.log('KYC data empty', await generalTM.getAllKYCData());

  const randomBeneficiary = '0x3444444444444444444444444444444444444444';

  await generalTM.modifyKYCData({
    investor: randomBeneficiary,
    canSendAfter: new Date(2019, 7),
    canReceiveAfter: new Date(2019, 7),
    expiryTime: new Date(2020),
    txData: {
      from: await polymathAPI.getAccount(),
    },
  });

  console.log('KYC data after added an address', await generalTM.getAllKYCData());

  generalTM.unsubscribeAll();
});
