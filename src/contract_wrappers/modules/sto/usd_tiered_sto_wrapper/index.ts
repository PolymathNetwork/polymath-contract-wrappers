/* istanbul ignore file */
import {
  USDTieredSTOEvents_3_1_0,
  USDTieredSTOEvents_3_0_0,
  USDTieredSTOEventArgs_3_0_0,
  USDTieredSTOAllowPreMintFlagEventArgs_3_1_0,
  USDTieredSTORevokePreMintFlagEventArgs_3_1_0,
  USDTieredSTOReserveTokenTransferEventArgs_3_1_0,
} from '@polymathnetwork/abi-wrappers';
import { USDTieredSTO_3_0_0, isUSDTieredSTO_3_0_0 } from './3.0.0';
import { USDTieredSTO_3_1_0, isUSDTieredSTO_3_1_0 } from './3.1.0';
import Common, {
  isUSDTieredSTO,
  ChangeNonAccreditedLimitParams,
  ModifyTimesParams,
  ModifyLimitsParams,
  ModifyOracleParams,
  ModifyFundingParams,
  ModifyAddressesParams,
  ModifyTiersParams,
  ChangeAllowBeneficialInvestmentsParams,
  BuyWithETHParams,
  BuyWithETHRateLimitedParams,
  BuyWithPOLYParams,
  BuyWithPOLYRateLimitedParams,
  BuyWithUSDParams,
  BuyWithUSDRateLimitedParams,
} from './common';
import { ContractVersion } from '../../../../types';

export const USDTieredSTOEvents = {
  ...USDTieredSTOEvents_3_1_0,
  ...USDTieredSTOEvents_3_0_0,
};
export type USDTieredSTOEvents = USDTieredSTOEvents_3_0_0 | USDTieredSTOEvents_3_1_0;

export type USDTieredSTOEventArgs =
  | USDTieredSTOEventArgs_3_0_0
  | USDTieredSTOAllowPreMintFlagEventArgs_3_1_0
  | USDTieredSTORevokePreMintFlagEventArgs_3_1_0
  | USDTieredSTOReserveTokenTransferEventArgs_3_1_0;

export {
  USDTieredSTOFundsReceivedEventArgs_3_0_0 as USDTieredSTOFundsReceivedEventArgs,
  USDTieredSTOPauseEventArgs_3_0_0 as USDTieredSTOPauseEventArgs,
  USDTieredSTOReserveTokenMintEventArgs_3_0_0 as USDTieredSTOReserveTokenMintEventArgs,
  USDTieredSTOSetAddressesEventArgs_3_0_0 as USDTieredSTOSetAddressesEventArgs,
  USDTieredSTOSetAllowBeneficialInvestmentsEventArgs_3_0_0 as USDTieredSTOSetAllowBeneficialInvestmentsEventArgs,
  USDTieredSTOSetFundRaiseTypesEventArgs_3_0_0 as USDTieredSTOSetFundRaiseTypesEventArgs,
  USDTieredSTOSetLimitsEventArgs_3_0_0 as USDTieredSTOSetLimitsEventArgs,
  USDTieredSTOUnpauseEventArgs_3_0_0 as USDTieredSTOUnpauseEventArgs,
  USDTieredSTOSetNonAccreditedLimitEventArgs_3_0_0 as USDTieredSTOSetNonAccreditedLimitEventArgs,
  USDTieredSTOSetTiersEventArgs_3_0_0 as USDTieredSTOSetTiersEventArgs,
  USDTieredSTOTokenPurchaseEventArgs_3_0_0 as USDTieredSTOTokenPurchaseEventArgs,
  USDTieredSTOSetTreasuryWalletEventArgs_3_0_0 as USDTieredSTOSetTreasuryWalletEventArgs,
  USDTieredSTOSetTimesEventArgs_3_0_0 as USDTieredSTOSetTimesEventArgs,
  USDTieredSTOAllowPreMintFlagEventArgs_3_1_0 as USDTieredSTOAllowPreMintFlagEventArgs,
  USDTieredSTORevokePreMintFlagEventArgs_3_1_0 as USDTieredSTORevokePreMintFlagEventArgs,
  USDTieredSTOReserveTokenTransferEventArgs_3_1_0 as USDTieredSTOReserveTokenTransferEventArgs,
} from '@polymathnetwork/abi-wrappers';

export type USDTieredSTO = USDTieredSTO_3_0_0 | USDTieredSTO_3_1_0;

export { isUSDTieredSTO, USDTieredSTO_3_0_0, isUSDTieredSTO_3_0_0, USDTieredSTO_3_1_0, isUSDTieredSTO_3_1_0 };

export namespace USDTieredSTOTransactionParams {
  export interface ChangeNonAccreditedLimit extends ChangeNonAccreditedLimitParams {}
  export interface ModifyTimes extends ModifyTimesParams {}
  export interface ModifyLimits extends ModifyLimitsParams {}
  export interface ModifyOracle extends ModifyOracleParams {}
  export interface ModifyFunding extends ModifyFundingParams {}
  export interface ModifyAddresses extends ModifyAddressesParams {}
  export interface ModifyTiers extends ModifyTiersParams {}
  export interface ChangeAllowBeneficialInvestments extends ChangeAllowBeneficialInvestmentsParams {}
  export interface BuyWithETH extends BuyWithETHParams {}
  export interface BuyWithETHRateLimited extends BuyWithETHRateLimitedParams {}
  export interface BuyWithPOLY extends BuyWithPOLYParams {}
  export interface BuyWithPOLYRateLimited extends BuyWithPOLYRateLimitedParams {}
  export interface BuyWithUSD extends BuyWithUSDParams {}
  export interface BuyWithUSDRateLimited extends BuyWithUSDRateLimitedParams {}
}

// for internal use
export class USDTieredSTOCommon extends Common {
  public contractVersion!: ContractVersion;
}
