/* istanbul ignore file */
import { ManualApprovalTransferManager_3_0_0, isManualApprovalTransferManager_3_0_0 } from './3.0.0';

import Common, { isManualApprovalTransferManager } from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export type ManualApprovalTransferManager = ManualApprovalTransferManager_3_0_0;

export {
  isManualApprovalTransferManager,
  ManualApprovalTransferManager_3_0_0,
  isManualApprovalTransferManager_3_0_0
};

// for internal use
export class ManualApprovalTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
