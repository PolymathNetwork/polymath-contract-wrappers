import { USDTieredSTOEvents_3_0_0, BigNumber } from '@polymathnetwork/abi-wrappers';
import { PolymathAPI } from '../src/PolymathAPI';
import { FundRaiseType, ModuleName } from '../src';
import { USDTieredSTOData } from '../src/contract_wrappers/tokens/security_token_wrapper/common';
import { AddingModuleOpts, addModule, moduleInstancesLookup } from './modules';
import { addInvestorsToWhitelist } from './addInvestorsToWhitelist';
import { issueTokenToInvestors } from './issueTokenToInvestor';
import { ModuleRegistryEvents_3_0_0 } from '@polymathnetwork/abi-wrappers/lib/src';

/**
 * This method adds a USDTieredSTO module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param ticker Ticker symbol.
 */
export const usdTieredSTO = async (polymathAPI: PolymathAPI, ticker: string) => {
  const myAddress = await polymathAPI.getAccount();

  // Call to add usd tiered sto module
  const startTime = new Date(Date.now() + 20000);

  const usdTieredSTOData: USDTieredSTOData = {
    startTime,
    endTime: new Date(2031, 1),
    ratePerTier: [new BigNumber(10), new BigNumber(10)],
    ratePerTierDiscountPoly: [new BigNumber(8), new BigNumber(9)],
    tokensPerTierTotal: [new BigNumber(10), new BigNumber(10)],
    tokensPerTierDiscountPoly: [new BigNumber(8), new BigNumber(8)],
    nonAccreditedLimitUSD: new BigNumber(5),
    minimumInvestmentUSD: new BigNumber(5),
    fundRaiseTypes: [FundRaiseType.ETH, FundRaiseType.POLY],
    wallet: '0x3333333333333333333333333333333333333333',
    treasuryWallet: '0x5555555555555555555555555555555555555555',
    usdTokens: ['0x6666666666666666666666666666666666666666', '0x4444444444444444444444444444444444444444'],
  };
  const options: AddingModuleOpts = {
    data: usdTieredSTOData,
    archived: false,
    label: 'TM Label',
  };
  await addModule(
    polymathAPI,
    {
      ticker,
      moduleName: ModuleName.UsdTieredSTO,
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

  const usdTiered = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.UsdTieredSTO,
  }))[0];

  // Subscribe to event for setTiers
  await usdTiered.subscribeAsync({
    eventName: USDTieredSTOEvents_3_0_0.SetTiers,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('STO Tiers updated', log);
      }
    },
  });

  // Update USDTiered STO Tiers
  await usdTiered.modifyTiers({
    ratePerTier: [new BigNumber(5), new BigNumber(5)],
    ratePerTierDiscountPoly: [new BigNumber(4), new BigNumber(4)],
    tokensPerTierTotal: [new BigNumber(5), new BigNumber(5)],
    tokensPerTierDiscountPoly: [new BigNumber(4), new BigNumber(4)],
  });

  // Subscribe to event for token purchase
  await usdTiered.subscribeAsync({
    eventName: USDTieredSTOEvents_3_0_0.TokenPurchase,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Token Purchased!', log);
      }
    },
  });

  // Subscribe to event for token purchase
  await usdTiered.subscribeAsync({
    eventName: USDTieredSTOEvents_3_0_0.SetAllowBeneficialInvestments,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Changed allowBeneficialInvestments!', log);
      }
    },
  });

  const sleep = (milliseconds: number) => {
    console.log('Sleeping until the STO starts');
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  await sleep(21000);

  // We call changeAllowBeneficialInvestments here both to demo, and due to ganache limitations,
  // the time based assertions will return the right value.
  await usdTiered.changeAllowBeneficialInvestments({ allowBeneficialInvestments: true });
  // Call to buy with ETH
  await usdTiered.buyWithETH({ value: new BigNumber(1), beneficiary: myAddress });
  console.log('BuyWithETH complete');

  usdTiered.unsubscribeAll();
};
