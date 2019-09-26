import { CountTransferManagerEvents_3_0_0, BigNumber } from '@polymathnetwork/abi-wrappers';
import { PolymathAPI } from '../src/PolymathAPI';
import { CountTransferManagerData } from '../src/contract_wrappers/tokens/security_token_wrapper';
import { AddingModuleOpts, addModule, moduleInstancesLookup } from './modules';
import { ModuleName } from '../src';
import { addInvestorsToWhitelist } from './addInvestorsToWhitelist';
import { issueTokenToInvestors } from './issueTokenToInvestor';

/**
 * This method adds a CountTransferManager module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param ticker Ticker symbol.
 */
export const countTransferManager = async (polymathAPI: PolymathAPI, ticker: string) => {
  const myAddress = await polymathAPI.getAccount();
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Declare some random beneficiaries to work with later on
  const randomBeneficiaries = [
    '0x3444444444444444444444444444444444444444',
    '0x5544444444444444444444444444444444444444',
    '0x6644444444444444444444444444444444444444',
  ];

  // Add the CountTM module
  const countTransferManagerData: CountTransferManagerData = {
    maxHolderCount: randomBeneficiaries.length,
  };
  const options: AddingModuleOpts = {
    data: countTransferManagerData,
    archived: false,
    label: 'TM Label',
  };
  await addModule(
    polymathAPI,
    {
      ticker,
      moduleName: ModuleName.CountTransferManager,
    },
    options,
  );

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

  const countTM = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.CountTransferManager,
  }))[0];

  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[0], value: new BigNumber(10) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[1], value: new BigNumber(20) });

  // Subscribe to event of modify holder count
  await countTM.subscribeAsync({
    eventName: CountTransferManagerEvents_3_0_0.ModifyHolderCount,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Modify holder count', log);
      }
    },
  });

  // We need to increase max holder account to get another transfer through (We are currently at max)
  randomBeneficiaries.push('0x6644444444444444343453455345345245624577');

  try {
    await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[3], value: new BigNumber(10) });
  } catch (e) {
    console.log('Transfer of 10 tokens when countTM does not include this fails as expected');
  }

  // Add new random address to kyc
  const kycInvestorData = {
    investors: [randomBeneficiaries[3]],
    canSendAfter: [new Date()],
    canReceiveAfter: [new Date()],
    expiryTime: [new Date(2021, 10)],
    txData: {
      from: await polymathAPI.getAccount(),
    },
  };
  await addInvestorsToWhitelist(polymathAPI, ticker, kycInvestorData);

  await countTM.changeHolderCount({ maxHolderCount: randomBeneficiaries.length });

  // Tokens successfully transfer
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[3], value: new BigNumber(30) });

  // Show the balances of our token holders
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[0] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[1] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiaries[2] }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: myAddress }));

  console.log('Funds transferred');

  countTM.unsubscribeAll();
};
