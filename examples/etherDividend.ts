import { EtherDividendCheckpointEvents_3_0_0, BigNumber } from '@polymathnetwork/abi-wrappers';
import { PolymathAPI, ModuleName } from '../src/';
import {DividendCheckpointData} from '../src/contract_wrappers/tokens/security_token_wrapper/common';
import {AddingModuleOpts, addModule, moduleInstancesLookup} from './modules';
import {addInvestorsToWhitelist} from './addInvestorsToWhitelist';
import {issueTokenToInvestors} from './issueTokenToInvestor';

/**
 * This method adds a EtherDividendCheckpoint module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param ticker Ticker symbol.
 */
export const etherDividendCheckpoint = async (polymathAPI: PolymathAPI, ticker: string) => {
  const myAddress = await polymathAPI.getAccount();
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Declare some random investors to work with later on
  const randomInvestors = [
    '0x3444444444444444444444444444444444444444',
    '0x5544444444444444444444444444444444444444',
    '0x6644444444444444444444444444444444444444',
  ];

  // Add the EtherDividendCheckpoint module
  const etherDividendData: DividendCheckpointData = {
    wallet: '0x3333333333333333333333333333333333333333',
  };
  const options: AddingModuleOpts = {
    data: etherDividendData,
    archived: false,
    label: 'TM Label',
  };
  await addModule(
      polymathAPI,
      {
        ticker,
        moduleName: ModuleName.EtherDividendCheckpoint,
      },
      options,
  );

  // Add all address in the whitelist including myAddress
  const kycInvestorMultiData = {
    investors: randomInvestors.concat(myAddress),
    canSendAfter: [new Date(), new Date(), new Date(), new Date()],
    canReceiveAfter: [new Date(), new Date(), new Date(), new Date()],
    expiryTime: [new Date(2021, 10), new Date(2021, 10), new Date(2021, 10), new Date(2021, 10)],
    txData: {
      from: await polymathAPI.getAccount(),
    },
  };
  await addInvestorsToWhitelist(polymathAPI, ticker, kycInvestorMultiData);

  // Issue tokens to the investors
  const issueMultiParams = {
    investors: randomInvestors.concat(myAddress),
    values: [new BigNumber(10), new BigNumber(20), new BigNumber(20), new BigNumber(1000)],
  };
  await issueTokenToInvestors(polymathAPI, ticker, issueMultiParams);

  const etherDividendCheckpoint = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.EtherDividendCheckpoint,
  }))[0];

  // Create Dividends
  // A checkpoint is created behind the scenes.
  await etherDividendCheckpoint.createDividendWithExclusions({
    name: 'MyDividend1',
    value: new BigNumber(1),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
    excluded: [randomInvestors[1], randomInvestors[2]],
  });

  // Create another checkpoint
  await tickerSecurityTokenInstance.createCheckpoint({});

  // Using the most recent checkpoint
  await etherDividendCheckpoint.createDividendWithCheckpointAndExclusions({
    name: 'MyDividend2',
    value: new BigNumber(1),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
    checkpointId: 2,
    excluded: [randomInvestors[0], randomInvestors[1]],
  });

  await etherDividendCheckpoint.createDividend({
    name: 'MyDividend3',
    value: new BigNumber(1),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
  });

  // Another checkpoint was created behind the scenes.
  await etherDividendCheckpoint.createDividendWithCheckpoint({
    name: 'MyDividend4',
    value: new BigNumber(1),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
    checkpointId: 3,
  });

  console.log('4 types of ether dividends created');

  // Subscribe to event of update dividend dates
  await etherDividendCheckpoint.subscribeAsync({
    eventName: EtherDividendCheckpointEvents_3_0_0.UpdateDividendDates,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Dividend Date Updated!', log);
      }
    },
  });

  // Update dividend dates
  await etherDividendCheckpoint.updateDividendDates({
    dividendIndex: 1,
    expiry: new Date(2038, 2),
    maturity: new Date(2037, 4),
  });

  etherDividendCheckpoint.unsubscribeAll();
};
