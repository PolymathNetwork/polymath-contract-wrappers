/* istanbul ignore file */
import { BlacklistTransferManager_3_0_0, isBlacklistTransferManager_3_0_0 } from './3.0.0';
import Common from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export type BlacklistTransferManager = BlacklistTransferManager_3_0_0;

export { BlacklistTransferManager_3_0_0, isBlacklistTransferManager_3_0_0 };

// for internal use
export class BlacklistTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
