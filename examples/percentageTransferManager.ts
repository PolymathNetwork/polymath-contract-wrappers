import {
  BigNumber,
  ModuleRegistryEvents_3_0_0,
  PercentageTransferManagerEvents_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import { PolymathAPI } from '../src/PolymathAPI';
import { ModuleName } from '../src';
import { AddingModuleOpts, addModule, moduleInstancesLookup } from './modules';
import { addInvestorsToWhitelist } from './addInvestorsToWhitelist';
import { issueTokenToInvestors } from './issueTokenToInvestor';
import {
  PercentageTransferManagerData,
} from '../src/contract_wrappers/tokens/security_token_wrapper';

/**
 * This method adds a percentageTransferManager module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param ticker Ticker symbol.
 */
export const percentageTransferManager = async (polymathAPI: PolymathAPI, ticker: string) => {
  const myAddress = await polymathAPI.getAccount();

  // Add the PercentageTM module
  const percentageTMData: PercentageTransferManagerData = {
    maxHolderPercentage: new BigNumber(25),
    allowPrimaryIssuance: true,
  };
  const options: AddingModuleOpts = {
    archived: false,
    data: percentageTMData,
    label: 'TM Label',
  };
  await addModule(
    polymathAPI,
    {
      ticker,
      moduleName: ModuleName.PercentageTransferManager,
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

  const randomBeneficiary1 = '0x0123456789012345678901234567890123456789';
  const randomBeneficiary2 = '0x9123456789012345678901234567890123456789';

  // Add all address in the whitelist including myAddress
  const kycInvestorMultiData = {
    investors: [randomBeneficiary1, randomBeneficiary2, myAddress],
    canReceiveAfter: [new Date(), new Date(), new Date()],
    canSendAfter: [new Date(), new Date(), new Date()],
    expiryTime: [new Date(2035, 1), new Date(2035, 1), new Date(2035, 1)],
    txData: {
      from: await polymathAPI.getAccount(),
    },
  };
  await addInvestorsToWhitelist(polymathAPI, ticker, kycInvestorMultiData);

  const percentageTM = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.PercentageTransferManager,
  }))[0];

  // Subscribe to event of setAllowPrimaryIssuance
  await percentageTM.subscribeAsync({
    eventName: PercentageTransferManagerEvents_3_0_0.SetAllowPrimaryIssuance,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('AllowPrimaryIssuance has been set', log);
      }
    },
  });

  // Issue tokens to the investors
  const issueMultiParams = {
    investors: [myAddress, randomBeneficiary1],
    values: [new BigNumber(10), new BigNumber(10)],
  };
  await issueTokenToInvestors(polymathAPI, ticker, issueMultiParams);

  await percentageTM.setAllowPrimaryIssuance({ allowPrimaryIssuance: false });
  console.log('SetAllowPrimaryIssuance has been called');

  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Primary Issuance now invalid
  // Percentage transfer manager whitelist beneficiary 1 so they can receive more tokens
  await percentageTM.modifyWhitelist({ investor: randomBeneficiary1, valid: true });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary1, value: new BigNumber(1) });

  // Try out transfer above 25% to beneficiary 2, should fail
  try {
    await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(6) });
  } catch (e) {
    console.log('Transfer above 25% to non-whitelisted address fails as expected');
  }

  // Try out transfer below 25% to beneficiary 2, should pass
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(5) });

  console.log('Tokens transferred to beneficiaries');

  tickerSecurityTokenInstance.unsubscribeAll();
};
