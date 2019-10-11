/* istanbul ignore file */
import {
  CappedSTOEvents_3_0_0,
  CappedSTOEvents_3_1_0,
  CappedSTOEventArgs_3_0_0,
  CappedSTOAllowPreMintFlagEventArgs_3_1_0,
  CappedSTORevokePreMintFlagEventArgs_3_1_0,
  CappedSTOReserveTokenMintEventArgs_3_1_0,
  CappedSTOReserveTokenTransferEventArgs_3_1_0,
} from '@polymathnetwork/abi-wrappers';
import { CappedSTO_3_0_0, isCappedSTO_3_0_0 } from './3.0.0';
import { CappedSTO_3_1_0, isCappedSTO_3_1_0 } from './3.1.0';
import Common, {
  isCappedSTO,
  ChangeAllowBeneficialInvestmentsParams,
  BuyTokensParams,
  BuyTokensWithPolyParams,
} from './common';
import { ContractVersion } from '../../../../types';

export const CappedSTOEvents = {
  ...CappedSTOEvents_3_1_0,
  ...CappedSTOEvents_3_0_0,
};
export type CappedSTOEvents = CappedSTOEvents_3_0_0 | CappedSTOEvents_3_1_0;

export type CappedSTOEventArgs =
  | CappedSTOEventArgs_3_0_0
  | CappedSTOAllowPreMintFlagEventArgs_3_1_0
  | CappedSTORevokePreMintFlagEventArgs_3_1_0
  | CappedSTOReserveTokenMintEventArgs_3_1_0
  | CappedSTOReserveTokenTransferEventArgs_3_1_0;

export type CappedSTO = CappedSTO_3_0_0 | CappedSTO_3_1_0;

export {
  CappedSTOPauseEventArgs_3_0_0 as CappedSTOPauseEventArgs,
  CappedSTOUnpauseEventArgs_3_0_0 as CappedSTOUnpauseEventArgs,
  CappedSTOSetAllowBeneficialInvestmentsEventArgs_3_0_0 as CappedSTOSetAllowBeneficialInvestmentsEventArgs,
  CappedSTOTokenPurchaseEventArgs_3_0_0 as CappedSTOTokenPurchaseEventArgs,
  CappedSTOSetFundRaiseTypesEventArgs_3_0_0 as CappedSTOSetFundRaiseTypesEventArgs,
  CappedSTOAllowPreMintFlagEventArgs_3_1_0 as CappedSTOAllowPreMintFlagEventArgs,
  CappedSTOReserveTokenMintEventArgs_3_1_0 as CappedSTOReserveTokenMintEventArgs,
  CappedSTORevokePreMintFlagEventArgs_3_1_0 as CappedSTORevokePreMintFlagEventArgs,
  CappedSTOReserveTokenTransferEventArgs_3_1_0 as CappedSTOReserveTokenTransferEventArgs,
} from '@polymathnetwork/abi-wrappers';

export { isCappedSTO, CappedSTO_3_0_0, isCappedSTO_3_0_0, CappedSTO_3_1_0, isCappedSTO_3_1_0 };

export namespace CappedSTOTransactionParams {
  export interface ChangeAllowBeneficialInvestments extends ChangeAllowBeneficialInvestmentsParams {}
  export interface BuyTokens extends BuyTokensParams {}
  export interface BuyTokensWithPoly extends BuyTokensWithPolyParams {}
}

// for internal use
export class CappedSTOCommon extends Common {
  public contractVersion!: ContractVersion;
}
