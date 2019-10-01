/* istanbul ignore file */
import { RestrictedPartialSaleTransferManager_3_1_0, isRestrictedPartialSaleTransferManager_3_1_0 } from './3.1.0';

import Common, { isRestrictedPartialSaleTransferManager } from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export type RestrictedPartialSaleTransferManager = RestrictedPartialSaleTransferManager_3_1_0;

export {
  isRestrictedPartialSaleTransferManager,
  RestrictedPartialSaleTransferManager_3_1_0,
  isRestrictedPartialSaleTransferManager_3_1_0,
};

// for internal use
export class RestrictedPartialSaleTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
