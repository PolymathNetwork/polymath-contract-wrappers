import { BigNumber, LockUpTransferManagerEvents_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { PolymathAPI } from '../src/PolymathAPI';
import { ModuleName } from '../src';
import {AddingModuleOpts, addModule, moduleInstancesLookup} from './modules';
import {addInvestorsToWhitelist} from './addInvestorsToWhitelist';
import {issueTokenToInvestors} from './issueTokenToInvestor';

/**
 * This method adds a lockUpTransferManager module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param ticker Ticker symbol.
 */
export const lockUpTransferManager = async (polymathAPI: PolymathAPI, ticker: string) => {
  const myAddress = await polymathAPI.getAccount();

  // Add the LockUpTM module
  const options: AddingModuleOpts = {
    archived: false,
    label: 'TM Label',
  };
  await addModule(
      polymathAPI,
      {
        ticker,
        moduleName: ModuleName.LockUpTransferManager,
      },
      options,
  );

  // Declare some random beneficiaries to work with later on

  const randomBeneficiary1 = '0x2222222222222222222222222222222222222222';
  const randomBeneficiary2 = '0x3333333333333333333333333333333333333333';
  const randomBeneficiary3 = '0x3333333333333333333333333333333333333333';

  // Add all address in the whitelist including myAddress
  const kycInvestorMultiData = {
    investors: [randomBeneficiary1, randomBeneficiary2, randomBeneficiary3, myAddress],
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
    investors: [myAddress, randomBeneficiary1, randomBeneficiary2],
    values: [new BigNumber(100), new BigNumber(100), new BigNumber(100)],
  };
  await issueTokenToInvestors(polymathAPI, ticker, issueMultiParams);

  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  const lockUpTM = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.LockUpTransferManager,
  }))[0];

  const firstLockUpName = 'Lockup1';
  const secondLockUpName = 'Lockup2';
  const thirdLockUpName = 'Lockup3';

  // Subscribe to event of addLockUpToUser
  await lockUpTM.subscribeAsync({
    eventName: LockUpTransferManagerEvents_3_0_0.AddLockUpToUser,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('New Lock Up added to user', log);
      }
    },
  });

  // Add new lock up to user multi, so we can test the lockup
  await lockUpTM.addNewLockUpToUserMulti({
    userAddresses: [myAddress, randomBeneficiary1, randomBeneficiary2],
    startTimes: [new Date(2030, 1, 1), new Date(2030, 1, 1), new Date(2030, 1, 1)],
    lockUpPeriodSeconds: [5, 5, 5],
    releaseFrequenciesSeconds: [1, 1, 1],
    lockupAmounts: [new BigNumber(100), new BigNumber(100), new BigNumber(100)],
    lockupNames: [firstLockUpName, secondLockUpName, thirdLockUpName],
  });

  // Try out transfer above lockup, will fail
  try {
    await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(1) });
  } catch (e) {
    console.log('Transfer above lockup amount fails as expected');
  }

  // Subscribe to event of modify lock up type
  await lockUpTM.subscribeAsync({
    eventName: LockUpTransferManagerEvents_3_0_0.ModifyLockUpType,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Modify Lock Up Type', log);
      }
    },
  });

  const startTime = new Date(Date.now() + 10000);
  // Modify the lockup types so that we can test in real time
  await lockUpTM.modifyLockUpTypeMulti({
    startTimes: [startTime, startTime, startTime],
    lockUpPeriodSeconds: [5, 5, 5],
    releaseFrequenciesSeconds: [1, 1, 1],
    lockupAmounts: [new BigNumber(20), new BigNumber(10), new BigNumber(10)],
    lockupNames: [firstLockUpName, secondLockUpName, thirdLockUpName],
  });

  // Subscribe to event of remove lockup from user
  await lockUpTM.subscribeAsync({
    eventName: LockUpTransferManagerEvents_3_0_0.RemoveLockUpFromUser,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Remove lockup from user', log);
      }
    },
  });
  // Example removing lockup from beneficiary 2 and removing lockup type
  await lockUpTM.removeLockUpFromUser({ userAddress: randomBeneficiary2, lockupName: thirdLockUpName });
  await lockUpTM.removeLockupType({ lockupName: thirdLockUpName });

  // Try to transfer 50, it is below lockup and will pass
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(50) });
  console.log('50 tokens transferred to randomBeneficiary2');

  // Try out transfer above lockup, will fail
  try {
    await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(31) });
  } catch (e) {
    console.log('Transfer above lockup amount fails as expected');
  }

  const sleep = (milliseconds: number) => {
    console.log(`Sleeping ${milliseconds / 1000} seconds`);
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
  await sleep(10000);

  // Time has passed, try out same transfer 1 above lockup, will pass
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(31) });
  console.log('31 more tokens transferred to randomBeneficiary2');

  await sleep(10000);

  // Transfer out the rest of tokens now that lockup is over
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(19) });
  console.log('19 more tokens transferred to randomBeneficiary2');

  tickerSecurityTokenInstance.unsubscribeAll();
};
