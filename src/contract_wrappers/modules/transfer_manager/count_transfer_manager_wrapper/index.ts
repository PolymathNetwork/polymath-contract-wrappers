/* istanbul ignore file */
import { CountTransferManager_3_0_0, isCountTransferManager_3_0_0 } from './3.0.0';
import Common, { isCountTransferManager } from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export type CountTransferManager = CountTransferManager_3_0_0;

export {
  isCountTransferManager,
  CountTransferManager_3_0_0,
  isCountTransferManager_3_0_0
};

// for internal use
export class CountTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
