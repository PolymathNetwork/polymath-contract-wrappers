import { BigNumber } from '@polymathnetwork/abi-wrappers';
import { ModuleName } from '../src/types';
import { PolymathAPI } from '../src/PolymathAPI';
import { VestingEscrowWalletData } from '../src/contract_wrappers/tokens/security_token_wrapper/common';
import { AddingModuleOpts, addModule, moduleInstancesLookup } from './modules';
import { addInvestorsToWhitelist } from './addInvestorsToWhitelist';
import { issueTokenToInvestors } from './issueTokenToInvestor';

/**
 * This method adds a VestingEscrowWallet module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param ticker Ticker symbol.
 */
export const vestingEscrowWallet = async (polymathAPI: PolymathAPI, ticker: string) => {
  const myAddress = await polymathAPI.getAccount();

  // Call to add VEW module
  const vestingEscrowWalletData: VestingEscrowWalletData = {
    treasuryWallet: '0x5555555555555555555555555555555555555555',
  };
  const options: AddingModuleOpts = {
    data: vestingEscrowWalletData,
    archived: false,
    label: 'TM Label',
  };
  await addModule(
    polymathAPI,
    {
      ticker,
      moduleName: ModuleName.VestingEscrowWallet,
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
  };
  await addInvestorsToWhitelist(polymathAPI, ticker, kycInvestorMultiData);

  // Issue tokens to the investors
  const issueMultiParams = {
    investors: [myAddress],
    values: [new BigNumber(1000)],
  };
  await issueTokenToInvestors(polymathAPI, ticker, issueMultiParams);

  const VEW = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.VestingEscrowWallet,
  }))[0];

  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  const VEWModuleAddress = await VEW.address();
  const numberOfTokens = 500;
  const TEMPLATE_NAME = 'Test Template';
  const beneficiary = '0x72aF7849ffc7753B5ccEA5cb80F97e9Aeaf7d999';

  const generalTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.GeneralTransferManager,
  }))[0];

  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.GeneralTransferManager,
    address: generalTMAddress,
  });

  // Add owner address in the whitelist to allow mint tokens
  await generalTM.modifyKYCData({
    investor: myAddress,
    canSendAfter: new Date(2019, 7),
    canReceiveAfter: new Date(2019, 7),
    expiryTime: new Date(2020, 1),
  });

  // Mint yourself some tokens and make some transfers
  await tickerSecurityTokenInstance.issue({
    investor: myAddress,
    value: new BigNumber(100000),
  });

  // Add VEW module in the whitelist (remove this on 3.1 release)
  await generalTM.modifyKYCData({
    investor: VEWModuleAddress,
    canSendAfter: new Date(2019, 7),
    canReceiveAfter: new Date(2019, 7),
    expiryTime: new Date(2020, 1),
  });

  // Add Template
  await VEW.addTemplate({
    name: TEMPLATE_NAME,
    numberOfTokens: new BigNumber(numberOfTokens),
    duration: 100,
    frequency: 10,
  });

  await tickerSecurityTokenInstance.approve({
    spender: VEWModuleAddress,
    value: new BigNumber(numberOfTokens),
  });

  // Add Schedule
  await VEW.addScheduleFromTemplate({
    beneficiary,
    templateName: TEMPLATE_NAME,
    startTime: new Date(new Date().getTime() + 60000),
  });

  console.log('VEW schedule added correctly from template.');
};
