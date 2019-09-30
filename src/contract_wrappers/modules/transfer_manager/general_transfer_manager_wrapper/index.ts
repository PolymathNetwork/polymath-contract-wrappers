/* istanbul ignore file */
import { GeneralTransferManager_3_0_0, isGeneralTransferManager_3_0_0 } from './3.0.0';
import { GeneralTransferManager_3_1_0, isGeneralTransferManager_3_1_0 } from './3.1.0';

import Common from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export type GeneralTransferManager = GeneralTransferManager_3_0_0 | GeneralTransferManager_3_1_0;

export {
  GeneralTransferManager_3_0_0,
  isGeneralTransferManager_3_0_0,
  GeneralTransferManager_3_1_0,
  isGeneralTransferManager_3_1_0,
};

// for internal use
export class GeneralTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
