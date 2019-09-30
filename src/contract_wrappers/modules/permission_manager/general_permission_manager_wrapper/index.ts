/* istanbul ignore file */
import { GeneralPermissionManager_3_0_0, isGeneralPermissionManager_3_0_0 } from './3.0.0';
import { GeneralPermissionManager_3_1_0, isGeneralPermissionManager_3_1_0 } from './3.1.0';
import Common from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export type GeneralPermissionManager = GeneralPermissionManager_3_0_0 | GeneralPermissionManager_3_1_0;

export {
  GeneralPermissionManager_3_0_0,
  isGeneralPermissionManager_3_0_0,
  GeneralPermissionManager_3_1_0,
  isGeneralPermissionManager_3_1_0,
};

// for internal use
export class GeneralPermissionManagerCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
