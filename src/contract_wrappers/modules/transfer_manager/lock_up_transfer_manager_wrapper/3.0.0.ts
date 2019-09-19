import LockUpTransferManagerCommon from './common';
import { ContractVersion } from '../../../../types';

export class LockUpTransferManager_3_0_0 extends LockUpTransferManagerCommon {}

export function isLockUpTransferManager_3_0_0(
  wrapper: LockUpTransferManagerCommon,
): wrapper is LockUpTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
