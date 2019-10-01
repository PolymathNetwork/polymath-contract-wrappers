import { ERC20DividendCheckpointEvents_3_0_0, BigNumber } from '@polymathnetwork/abi-wrappers';
import { PolymathAPI, ModuleName } from '../src';
import { DividendCheckpointData } from '../src/contract_wrappers/tokens/security_token_wrapper/common';
import { AddingModuleOpts, addModule, moduleInstancesLookup } from './modules';
import { addInvestorsToWhitelist } from './addInvestorsToWhitelist';
import { issueTokenToInvestors } from './issueTokenToInvestor';

/**
 * This method adds a ERC20DividendCheckpoint module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param ticker Ticker symbol.
 */
export const erc20DividendCheckpoint = async (polymathAPI: PolymathAPI, ticker: string) => {
  const myAddress = await polymathAPI.getAccount();
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Declare some random investors to work with later on
  const randomInvestors = [
    '0x3444444444444444444444444444444444444444',
    '0x5544444444444444444444444444444444444444',
    '0x6644444444444444444444444444444444444444',
  ];

  // Add the ERC20Dividend module
  const erc20DividendData: DividendCheckpointData = {
    wallet: '0x3333333333333333333333333333333333333333',
  };
  const options: AddingModuleOpts = {
    data: erc20DividendData,
    archived: false,
    label: 'TM Label',
  };
  await addModule(
    polymathAPI,
    {
      ticker,
      moduleName: ModuleName.ERC20DividendCheckpoint,
    },
    options,
  );

  // Add all address in the whitelist including myAddress
  const kycInvestorMultiData = {
    investors: randomInvestors.concat(myAddress),
    canSendAfter: [new Date(), new Date(), new Date(), new Date()],
    canReceiveAfter: [new Date(), new Date(), new Date(), new Date()],
    expiryTime: [new Date(2021, 10), new Date(2021, 10), new Date(2021, 10), new Date(2021, 10)],
  };
  await addInvestorsToWhitelist(polymathAPI, ticker, kycInvestorMultiData);

  // Issue tokens to the investors
  const issueMultiParams = {
    investors: randomInvestors.concat(myAddress),
    values: [new BigNumber(10), new BigNumber(20), new BigNumber(20), new BigNumber(1000)],
  };
  await issueTokenToInvestors(polymathAPI, ticker, issueMultiParams);

  const erc20DividendCheckpoint = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.ERC20DividendCheckpoint,
  }))[0];

  await polymathAPI.polyToken.approve({
    spender: await erc20DividendCheckpoint.address(),
    value: new BigNumber(4),
  });

  // Create Dividends
  // A checkpoint is created behind the scenes
  await erc20DividendCheckpoint.createDividendWithExclusions({
    name: 'MyDividend1',
    amount: new BigNumber(1),
    token: await polymathAPI.polyToken.address(),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
    excluded: [randomInvestors[1], randomInvestors[2]],
  });

  // Create another checkpoint
  await tickerSecurityTokenInstance.createCheckpoint({});

  // Using the most recent checkpoint
  await erc20DividendCheckpoint.createDividendWithCheckpointAndExclusions({
    name: 'MyDividend2',
    amount: new BigNumber(1),
    token: await polymathAPI.polyToken.address(),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
    checkpointId: 2,
    excluded: [randomInvestors[0], randomInvestors[1]],
  });

  await erc20DividendCheckpoint.createDividend({
    name: 'MyDividend3',
    amount: new BigNumber(1),
    token: await polymathAPI.polyToken.address(),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
  });

  // Another checkpoint was created behind the scenes
  await erc20DividendCheckpoint.createDividendWithCheckpoint({
    name: 'MyDividend4',
    amount: new BigNumber(1),
    token: await polymathAPI.polyToken.address(),
    expiry: new Date(2035, 2),
    maturity: new Date(2018, 1),
    checkpointId: 3,
  });

  console.log('4 types of erc20 dividends created');

  // Subscribe to event of update dividend dates
  await erc20DividendCheckpoint.subscribeAsync({
    eventName: ERC20DividendCheckpointEvents_3_0_0.UpdateDividendDates,
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
  await erc20DividendCheckpoint.updateDividendDates({
    dividendIndex: 1,
    expiry: new Date(2038, 2),
    maturity: new Date(2037, 4),
  });
  erc20DividendCheckpoint.unsubscribeAll();
};
