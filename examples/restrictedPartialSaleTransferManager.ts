import { RedundantSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import {
  RestrictedPartialSaleTMEvents_3_1_0,
  ISecurityTokenRegistryEvents_3_0_0,
  PolyTokenEvents_3_0_0,
  BigNumber,
} from '@polymathnetwork/abi-wrappers';
import ModuleFactoryWrapper from '../src/contract_wrappers/modules/module_factory_wrapper';
import { ApiConstructorParams, PolymathAPI } from '../src/PolymathAPI';
import { ModuleName, ModuleType } from '../src';
import { registerTicker } from './registerTicker';
import { launchToken } from './launchToken';
import {AddingModuleOpts, addModule, moduleInstancesLookup} from './modules';
import { addInvestorsToWhitelist } from './addInvestorsToWhitelist';
import { issueTokenToInvestors } from './issueTokenToInvestor';
import {RestrictedPartialSaleTransferManagerData} from '../src/contract_wrappers/tokens/security_token_wrapper';

// This file acts as a valid sandbox for using a volume restriction transfer manager module on an unlocked node (like ganache)

window.addEventListener('load', async () => {
  // Setup the redundant provider
  const providerEngine = new Web3ProviderEngine();
  providerEngine.addProvider(new RedundantSubprovider([new RPCSubprovider('http://127.0.0.1:8545')]));
  providerEngine.start();
  const params: ApiConstructorParams = {
    provider: providerEngine,
    polymathRegistryAddress: '<Deployed Polymath Registry address>',
  };

  // Instantiate the API
  const polymathAPI = new PolymathAPI(params);

  // Get some poly tokens in your account and the security token
  const myAddress = await polymathAPI.getAccount();
  await polymathAPI.getPolyTokens({ amount: new BigNumber(1000000), address: myAddress });

  // Prompt to setup your ticker and token name
  const ticker = prompt('Ticker', '');
  const tokenName = prompt('Token Name', '');

  const myTicker = ticker ? ticker : '';

  // Register the ticker
  await registerTicker(polymathAPI, myTicker, myAddress);

  // Generate a new Security Token
  await launchToken(polymathAPI, tokenName ? tokenName : '', myTicker, 'http://', myAddress, false);
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Add the RPSTM module
  const restrictedPartialSaleData: RestrictedPartialSaleTransferManagerData = {
    treasuryWallet: myAddress,
  };
  const options: AddingModuleOpts = {
    data: restrictedPartialSaleData,
    archived: false,
    label: 'TM Label',
  };
  await addModule(
      polymathAPI,
      {
        ticker: myTicker,
        moduleName: ModuleName.RestrictedPartialSaleTM,
      },
      options,
  );

  // Declare some random beneficiaries to work with later on
  const randomBeneficiaries = [
    '0x3444444444444444444444444444444444444444',
    '0x5544444444444444444444444444444444444444',
    '0x6644444444444444444444444444444444444444',
  ];

  // Add all address in the whitelist including myAddress
  const kycInvestorMultiData = {
    investors: randomBeneficiaries.concat(myAddress),
    canSendAfter: [new Date(), new Date(), new Date(), new Date()],
    canReceiveAfter: [new Date(), new Date(), new Date(), new Date()],
    expiryTime: [new Date(2021, 10), new Date(2021, 10), new Date(2021, 10), new Date(2021, 10)],
    txData: {
      from: await polymathAPI.getAccount(),
    },
  };
  await addInvestorsToWhitelist(polymathAPI, myTicker, kycInvestorMultiData);

  // Issue tokens to the investors
  const issueMultiParams = {
    investors: [myAddress],
    values: [new BigNumber(1000)],
  };
  await issueTokenToInvestors(polymathAPI, myTicker, issueMultiParams);

  const restrictedPartialSale = (await moduleInstancesLookup(polymathAPI, {
    ticker: myTicker,
    moduleName: ModuleName.RestrictedPartialSaleTM,
  }))[0];
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[2], value: new BigNumber(10) });
  console.log('Transfer worked as this is the treasury wallet address:');
  await restrictedPartialSale.changeExemptWalletList({ wallet: myAddress, exempted: false });

  // Transfers
  // Try out transfer 10 during restrictedPartialSale, will fail
  try {
    await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[2], value: new BigNumber(10) });
  } catch (e) {
    console.log('Transfer of 10 tokens when wallet is not exempted fails as expected');
  }

  // BalanceOf
  console.log('Showing beneficiaries balances');
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[0] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[1] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[2] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: myAddress }));

  restrictedPartialSale.unsubscribeAll();
});
