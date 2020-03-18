/* istanbul ignore file */
import { RestrictedPartialSaleTMEventArgs_3_1_0 } from '@polymathnetwork/abi-wrappers';
import { RestrictedPartialSaleTransferManager_3_1_0, isRestrictedPartialSaleTransferManager_3_1_0 } from './3.1.0';
import Common, {
  isRestrictedPartialSaleTransferManager,
  ChangeExemptWalletListMultiParams,
  ChangeExemptWalletListParams,
} from './common';
import { ContractVersion } from '../../../../types';

export type RestrictedPartialSaleTransferManagerEventArgs = RestrictedPartialSaleTMEventArgs_3_1_0;

export {
  RestrictedPartialSaleTMEvents_3_1_0 as RestrictedPartialSaleTransferManagerEvents,
  RestrictedPartialSaleTMChangedExemptWalletListEventArgs_3_1_0 as RestrictedPartialSaleTMChangedExemptWalletListEventArgs,
  RestrictedPartialSaleTMPauseEventArgs_3_1_0 as RestrictedPartialSaleTMPauseEventArgs,
  RestrictedPartialSaleTMUnpauseEventArgs_3_1_0 as RestrictedPartialSaleTMUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';

export type RestrictedPartialSaleTransferManager = RestrictedPartialSaleTransferManager_3_1_0;

export {
  isRestrictedPartialSaleTransferManager,
  RestrictedPartialSaleTransferManager_3_1_0,
  isRestrictedPartialSaleTransferManager_3_1_0,
};

export namespace RestrictedPartialSaleTransferManagerTransactionParams {
  export interface ChangeExemptWalletList extends ChangeExemptWalletListParams {}
  export interface ChangeExemptWalletListMulti extends ChangeExemptWalletListMultiParams {}
}

// for internal use
export class RestrictedPartialSaleTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;
}
