import { PolymathAPI } from '../src/PolymathAPI';
import { ModuleName } from '../src';
import { BigNumber, BlacklistTransferManagerEvents_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { AddingModuleOpts, addModule, moduleInstancesLookup } from './modules';
import { addInvestorsToWhitelist } from './addInvestorsToWhitelist';
import { issueTokenToInvestors } from './issueTokenToInvestor';

/**
 * This method adds a BlacklistTM module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param ticker Ticker symbol.
 */
export const blacklistTransferManager = async (polymathAPI: PolymathAPI, ticker: string) => {
  const myAddress = await polymathAPI.getAccount();

  const options: AddingModuleOpts = {
    archived: false,
    label: 'TM Label',
  };
  await addModule(
    polymathAPI,
    {
      ticker,
      moduleName: ModuleName.BlacklistTransferManager,
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
  await addInvestorsToWhitelist(polymathAPI, ticker, kycInvestorMultiData);

  // Issue tokens to the investors
  const issueMultiParams = {
    investors: [myAddress],
    values: [new BigNumber(1000)],
  };
  await issueTokenToInvestors(polymathAPI, ticker, issueMultiParams);

  const blacklistTM = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.BlacklistTransferManager,
  }))[0];

  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Subscribe to event of addblacklisttype
  await blacklistTM.subscribeAsync({
    eventName: BlacklistTransferManagerEvents_3_0_0.AddBlacklistType,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('New Lock Up added to user', log);
      }
    },
  });

  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[2], value: new BigNumber(10) });
  console.log(' No blacklist, 10 tokens transferred to randomBeneficiary2');

  const startTime = new Date(Date.now() + 10000);
  const endTime = new Date(Date.now() + 20000);
  await blacklistTM.addInvestorToNewBlacklist({
    investor: myAddress,
    startTime,
    endTime,
    repeatPeriodTime: 1,
    blacklistName: 'ExampleBlacklist',
  });

  console.log('Blacklist starts in 10 seconds');
  const sleep = (milliseconds: number) => {
    console.log(`Sleeping ${milliseconds / 1000} seconds`);
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
  await sleep(15000);

  // Try out transfer 10 above lockup, will fail
  try {
    await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[2], value: new BigNumber(10) });
  } catch (e) {
    console.log('Transfer of 10 tokens during blacklist period amount fails as expected');
  }

  console.log('Blacklist ends in 5 seconds');
  await sleep(10000);

  // Blacklist now over
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[2], value: new BigNumber(10) });
  console.log('10 more tokens transferred to randomBeneficiary2');

  const newStartTime = new Date(Date.now() + 10000);
  const newEndTime = new Date(Date.now() + 3600000);
  const testBlacklistNames = ['TestBlacklist1', 'TestBlacklist2', 'TestBlacklist3'];
  await blacklistTM.addNewBlacklistTypeMulti({
    blacklistNames: testBlacklistNames,
    startTimes: [newStartTime, newStartTime, newStartTime],
    endTimes: [newEndTime, newEndTime, newEndTime],
    repeatPeriodTimes: [1, 2, 3],
  });
  console.log('Many more example blacklists created');

  await blacklistTM.addMultiInvestorToBlacklistMulti({
    blacklistNames: testBlacklistNames,
    userAddresses: [myAddress, randomBeneficiaries[1], randomBeneficiaries[2]],
  });
  console.log('Multi investors added to multi blacklists');

  await sleep(15000);

  // Try out transfer 10 during blacklist, will fail
  try {
    await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[2], value: new BigNumber(10) });
  } catch (e) {
    console.log('Transfer of 10 tokens during new blacklist period amount fails as expected');
  }

  await blacklistTM.deleteInvestorFromAllBlacklistMulti({
    investors: [myAddress, randomBeneficiaries[1], randomBeneficiaries[2]],
  });
  console.log('Multi investors deleted from all blacklists they are part of');

  // Transfer out more tokens now that the investor has been removed from the new blacklist
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[2], value: new BigNumber(10) });
  console.log('10 more tokens were successfully transferred to randomBeneficiary2');

  tickerSecurityTokenInstance.unsubscribeAll();
};
