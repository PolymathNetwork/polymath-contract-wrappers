/* istanbul ignore file */
import { VolumeRestrictionTransferManager_3_0_0, isVolumeRestrictionTransferManager_3_0_0 } from './3.0.0';

import Common, { isVolumeRestrictionTransferManager } from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export type VolumeRestrictionTransferManager = VolumeRestrictionTransferManager_3_0_0;

export {
  isVolumeRestrictionTransferManager,
  VolumeRestrictionTransferManager_3_0_0,
  isVolumeRestrictionTransferManager_3_0_0
};

// for internal use
export class VolumeRestrictionTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
