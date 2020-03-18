import {
  ChangeWalletParams,
  SetDefaultExcludedParams,
  SetWithholdingParams,
  SetWithholdingFixedParams,
  PushDividendPaymentToAddressesParams,
  PushDividendPaymentParams,
  DividendIndexTxParams,
  UpdateDividendDatesParams,
} from './common';

/* istanbul ignore file */
export { WithDividendCheckpoint_3_0_0 } from './3.0.0';
export { default as DividendCheckpointCommon } from './common';

export namespace DividendCheckpointTransactionParams {
  export interface ChangeWallet extends ChangeWalletParams {}
  export interface SetDefaultExcluded extends SetDefaultExcludedParams {}
  export interface SetWithholding extends SetWithholdingParams {}
  export interface SetWithholdingFixed extends SetWithholdingFixedParams {}
  export interface PushDividendPaymentToAddresses extends PushDividendPaymentToAddressesParams {}
  export interface PushDividendPayment extends PushDividendPaymentParams {}
  export interface PullDividendPayment extends DividendIndexTxParams {}
  export interface ReclaimDividend extends DividendIndexTxParams {}
  export interface WithdrawWithholding extends DividendIndexTxParams {}
  export interface UpdateDividendDates extends UpdateDividendDatesParams {}
}
