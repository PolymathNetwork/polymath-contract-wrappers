/* istanbul ignore file */
import { ManualApprovalTransferManagerEventArgs_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { ManualApprovalTransferManager_3_0_0, isManualApprovalTransferManager_3_0_0 } from './3.0.0';
import Common, {
  isManualApprovalTransferManager,
  AddManualApprovalParams,
  AddManualApprovalMultiParams,
  ModifyManualApprovalParams,
  ModifyManualApprovalMultiParams,
  RevokeManualApprovalParams,
  RevokeManualApprovalMultiParams,
} from './common';
import { ContractVersion } from '../../../../types';

export type ManualApprovalTransferManagerEventArgs = ManualApprovalTransferManagerEventArgs_3_0_0;

export {
  ManualApprovalTransferManagerEvents_3_0_0 as ManualApprovalTransferManagerEvents,
  ManualApprovalTransferManagerAddManualApprovalEventArgs_3_0_0 as ManualApprovalTransferManagerAddManualApprovalEventArgs,
  ManualApprovalTransferManagerModifyManualApprovalEventArgs_3_0_0 as ManualApprovalTransferManagerModifyManualApprovalEventArgs,
  ManualApprovalTransferManagerPauseEventArgs_3_0_0 as ManualApprovalTransferManagerPauseEventArgs,
  ManualApprovalTransferManagerRevokeManualApprovalEventArgs_3_0_0 as ManualApprovalTransferManagerRevokeManualApprovalEventArgs,
  ManualApprovalTransferManagerUnpauseEventArgs_3_0_0 as ManualApprovalTransferManagerUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';

export type ManualApprovalTransferManager = ManualApprovalTransferManager_3_0_0;

export { isManualApprovalTransferManager, ManualApprovalTransferManager_3_0_0, isManualApprovalTransferManager_3_0_0 };

export namespace ManualApprovalTransferManagerTransactionParams {
  export interface AddManualApproval extends AddManualApprovalParams {}
  export interface AddManualApprovalMulti extends AddManualApprovalMultiParams {}
  export interface ModifyManualApproval extends ModifyManualApprovalParams {}
  export interface ModifyManualApprovalMulti extends ModifyManualApprovalMultiParams {}
  export interface RevokeManualApproval extends RevokeManualApprovalParams {}
  export interface RevokeManualApprovalMulti extends RevokeManualApprovalMultiParams {}
}

// for internal use
export class ManualApprovalTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;
}
