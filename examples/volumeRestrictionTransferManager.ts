import { VolumeRestrictionTMEvents_3_0_0, BigNumber } from '@polymathnetwork/abi-wrappers';
import { PolymathAPI } from '../src/PolymathAPI';
import { ModuleName, RestrictionType } from '../src';
import { AddingModuleOpts, addModule, moduleInstancesLookup } from './modules';
import { addInvestorsToWhitelist } from './addInvestorsToWhitelist';
import { issueTokenToInvestors } from './issueTokenToInvestor';

/**
 * This method adds a VRTM module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param ticker Ticker symbol.
 */
export const volumeRestrictionTransferManager = async (polymathAPI: PolymathAPI, ticker: string) => {
  const myAddress = await polymathAPI.getAccount();
  // Add the VRTM module
  const options: AddingModuleOpts = {
    archived: false,
    label: 'TM Label',
  };
  await addModule(
      polymathAPI,
      {
        ticker,
        moduleName: ModuleName.VolumeRestrictionTM,
      },
      options,
  );

  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  const vrtm = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.VolumeRestrictionTM,
  }))[0];

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

  // VRTM
  const delay = 10000;

  // Subscribe to event of add individual daily restriction
  await vrtm.subscribeAsync({
    eventName: VolumeRestrictionTMEvents_3_0_0.AddIndividualRestriction,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('individual restriction added', log);
      }
    },
  });

  // Call VRTM restrictions individual daily on this caller
  await vrtm.addIndividualDailyRestriction({
    holder: myAddress,
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 1),
    rollingPeriodInDays: 1,
    restrictionType: RestrictionType.Fixed,
    allowedTokens: new BigNumber(10),
  });
  // Transfer
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[0], value: new BigNumber(10) });
  // Modify vrtm daily and try transferring again after sleeping (time pass), then remove
  await vrtm.modifyIndividualDailyRestriction({
    holder: myAddress,
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 1),
    allowedTokens: new BigNumber(50),
    restrictionType: RestrictionType.Percentage,
  });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[1], value: new BigNumber(20) });
  // Remove
  await vrtm.removeIndividualDailyRestriction({
    investor: myAddress,
  });

  // Add individual restriction
  await vrtm.addIndividualRestriction({
    holder: randomBeneficiaries[0],
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 1),
    allowedTokens: new BigNumber(20),
    restrictionType: RestrictionType.Fixed,
    rollingPeriodInDays: 2,
  });
  // Modify individual restriction
  await vrtm.modifyIndividualRestriction({
    holder: randomBeneficiaries[0],
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 2),
    allowedTokens: new BigNumber(25),
    restrictionType: RestrictionType.Fixed,
    rollingPeriodInDays: 2,
  });
  // Transfer
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[0], value: new BigNumber(15) });
  // Remove
  await vrtm.removeIndividualRestriction({
    investor: randomBeneficiaries[0],
  });

  // Add Individual Daily Restriction Multi
  await vrtm.addIndividualDailyRestrictionMulti({
    holders: [myAddress, randomBeneficiaries[1]],
    startTimes: [new Date(Date.now().valueOf() + delay), new Date(Date.now().valueOf() + delay)],
    endTimes: [new Date(2035, 1), new Date(2035, 1)],
    allowedTokens: [new BigNumber(20), new BigNumber(20)],
    restrictionTypes: [RestrictionType.Fixed, RestrictionType.Fixed],
  });
  // Transfers
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[0], value: new BigNumber(10) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[1], value: new BigNumber(10) });
  // Modify Individual Daily Restriction Multi
  await vrtm.modifyIndividualDailyRestrictionMulti({
    holders: [myAddress, randomBeneficiaries[1]],
    startTimes: [new Date(Date.now().valueOf() + delay), new Date(Date.now().valueOf() + delay)],
    endTimes: [new Date(2035, 2), new Date(2035, 2)],
    allowedTokens: [new BigNumber(30), new BigNumber(30)],
    restrictionTypes: [RestrictionType.Fixed, RestrictionType.Fixed],
  });
  // Remove Individual Daily Restriction Multi
  await vrtm.removeIndividualDailyRestrictionMulti({ holders: [myAddress, randomBeneficiaries[1]] });

  // Add individual restriction multi
  await vrtm.addIndividualRestrictionMulti({
    holders: [myAddress, randomBeneficiaries[1]],
    startTimes: [new Date(Date.now().valueOf() + delay), new Date(Date.now().valueOf() + delay)],
    endTimes: [new Date(2035, 1), new Date(2035, 1)],
    allowedTokens: [new BigNumber(20), new BigNumber(20)],
    restrictionTypes: [RestrictionType.Fixed, RestrictionType.Fixed],
    rollingPeriodInDays: [2, 3],
  });
  // Transfers
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[0], value: new BigNumber(10) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[1], value: new BigNumber(10) });
  // Modify individual restriction multi
  await vrtm.modifyIndividualRestrictionMulti({
    holders: [myAddress, randomBeneficiaries[1]],
    startTimes: [new Date(Date.now().valueOf() + delay), new Date(Date.now().valueOf() + delay)],
    endTimes: [new Date(2035, 2), new Date(2035, 2)],
    allowedTokens: [new BigNumber(30), new BigNumber(30)],
    restrictionTypes: [RestrictionType.Fixed, RestrictionType.Fixed],
    rollingPeriodInDays: [3, 4],
  });
  // Remove
  await vrtm.removeIndividualRestrictionMulti({ holders: [myAddress, randomBeneficiaries[1]] });

  // Add default restriction for all, sleep, tx and remove
  await vrtm.addDefaultRestriction({
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 1),
    allowedTokens: new BigNumber(50),
    restrictionType: RestrictionType.Percentage,
    rollingPeriodInDays: 2,
  });
  // Transfers
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[0], value: new BigNumber(5) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[1], value: new BigNumber(5) });
  // Modify Default restriction
  await vrtm.modifyDefaultRestriction({
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 2),
    allowedTokens: new BigNumber(45),
    restrictionType: RestrictionType.Percentage,
    rollingPeriodInDays: 3,
  });
  // Remove
  await vrtm.removeDefaultRestriction({});

  // Add Default daily
  await vrtm.addDefaultDailyRestriction({
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2035, 1),
    allowedTokens: new BigNumber(80),
    restrictionType: RestrictionType.Percentage,
  });
  // Transfer
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[0], value: new BigNumber(4) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[1], value: new BigNumber(4) });
  // Modify default daily restriction
  await vrtm.modifyDefaultDailyRestriction({
    startTime: new Date(Date.now().valueOf() + delay),
    endTime: new Date(2036, 2),
    allowedTokens: new BigNumber(85),
    restrictionType: RestrictionType.Fixed,
  });
  // Remove the default daily restriction
  await vrtm.removeDefaultDailyRestriction({});

  // Add some exemptions
  // Subscribe to event change exempt wallet list
  await vrtm.subscribeAsync({
    eventName: VolumeRestrictionTMEvents_3_0_0.ChangedExemptWalletList,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('changed exempt wallet list', log);
      }
    },
  });

  await vrtm.changeExemptWalletList({ wallet: randomBeneficiaries[2], change: true });

  // BalanceOf
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[0] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[1] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[2] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: myAddress }));

  vrtm.unsubscribeAll();
};
