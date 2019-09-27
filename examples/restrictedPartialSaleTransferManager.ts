import { BigNumber } from '@polymathnetwork/abi-wrappers';
import { PolymathAPI } from '../src/PolymathAPI';
import { ModuleName } from '../src';
import { AddingModuleOpts, addModule, moduleInstancesLookup } from './modules';
import { addInvestorsToWhitelist } from './addInvestorsToWhitelist';
import { issueTokenToInvestors } from './issueTokenToInvestor';
import { RestrictedPartialSaleTransferManagerData } from '../src/contract_wrappers/tokens/security_token_wrapper/common';

/**
 * This method adds a RPSTM module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param ticker Ticker symbol.
 */
export const restrictedPartialSaleTransferManager = async (polymathAPI: PolymathAPI, ticker: string) => {
  const myAddress = await polymathAPI.getAccount();
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
      ticker,
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
  await addInvestorsToWhitelist(polymathAPI, ticker, kycInvestorMultiData);

  // Issue tokens to the investors
  const issueMultiParams = {
    investors: [myAddress],
    values: [new BigNumber(1000)],
  };
  await issueTokenToInvestors(polymathAPI, ticker, issueMultiParams);

  const restrictedPartialSale = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.RestrictedPartialSaleTM,
  }))[0];

  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiaries[2], value: new BigNumber(10) });
  console.log('Transfer worked as this is the treasury wallet address:');
  await restrictedPartialSale.changeExemptWalletList({ wallet: myAddress, change: false });

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
};
