import { ModuleRegistryEvents_3_0_0, BigNumber, CappedSTOEvents_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { PolymathAPI } from '../src/PolymathAPI';
import { CappedSTOFundRaiseType, ModuleName } from '../src';
import { AddingModuleOpts, addModule, moduleInstancesLookup } from './modules';
import { addInvestorsToWhitelist } from './addInvestorsToWhitelist';
import { issueTokenToInvestors } from './issueTokenToInvestor';
import { CappedSTOData } from '../src/contract_wrappers/tokens/security_token_wrapper/common';

/**
 * This method adds a CappedSTO module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param ticker Ticker symbol.
 */
export const cappedSTO = async (polymathAPI: PolymathAPI, ticker: string) => {
  const myAddress = await polymathAPI.getAccount();
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Add the CappedSTO module
  const startTime = new Date(Date.now() + 10000);
  const cappedSTOData: CappedSTOData = {
    startTime,
    endTime: new Date(2031, 1),
    cap: new BigNumber(10),
    rate: new BigNumber(10),
    fundRaiseType: CappedSTOFundRaiseType.ETH,
    fundsReceiver: await polymathAPI.getAccount(),
    treasuryWallet: myAddress,
  };
  const options: AddingModuleOpts = {
    data: cappedSTOData,
    archived: false,
    label: 'TM Label',
  };
  await addModule(
    polymathAPI,
    {
      ticker,
      moduleName: ModuleName.CappedSTO,
    },
    options,
  );

  await polymathAPI.moduleRegistry.subscribeAsync({
    eventName: ModuleRegistryEvents_3_0_0.ModuleRegistered,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Module added!', log);
      }
    },
  });

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
  };
  await addInvestorsToWhitelist(polymathAPI, ticker, kycInvestorMultiData);

  // Issue tokens to the investors
  const issueMultiParams = {
    investors: [myAddress],
    values: [new BigNumber(1000)],
  };
  await issueTokenToInvestors(polymathAPI, ticker, issueMultiParams);

  const cappedSTO = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.CappedSTO,
  }))[0];

  const sleep = (milliseconds: number) => {
    console.log('Sleeping until the STO starts');
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
  await sleep(10000);

  // Subscribe to event of token purchase
  await cappedSTO.subscribeAsync({
    eventName: CappedSTOEvents_3_0_0.TokenPurchase,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Token Purchased!', log);
      }
    },
  });

  await cappedSTO.buyTokens({ beneficiary: await polymathAPI.getAccount(), value: new BigNumber(1) });
  console.log('Buy Tokens has been called');

  tickerSecurityTokenInstance.unsubscribeAll();
};
