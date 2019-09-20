import VolumeRestrictionTransferManagerCommon from './common';
import { ContractVersion } from '../../../../types';

export class VolumeRestrictionTransferManager_3_0_0 extends VolumeRestrictionTransferManagerCommon {}

export function isVolumeRestrictionTransferManager_3_0_0(
  wrapper: VolumeRestrictionTransferManagerCommon,
): wrapper is VolumeRestrictionTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
