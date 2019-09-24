/* istanbul ignore file */
import { LockUpTransferManager_3_0_0, isLockUpTransferManager_3_0_0 } from './3.0.0';

import Common from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export type LockUpTransferManager = LockUpTransferManager_3_0_0;

export { LockUpTransferManager_3_0_0, isLockUpTransferManager_3_0_0 };

// for internal use
export class LockupTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
