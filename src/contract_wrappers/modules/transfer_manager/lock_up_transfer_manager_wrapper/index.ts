/* istanbul ignore file */
import { LockUpTransferManagerEventArgs_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { LockUpTransferManager_3_0_0, isLockUpTransferManager_3_0_0 } from './3.0.0';

import Common, { isLockUpTransferManager } from './common';
import { ContractVersion } from '../../../../types';

export type LockUpTansferManagerEventArgs = LockUpTransferManagerEventArgs_3_0_0;

export {
  LockUpTransferManagerEvents_3_0_0 as LockUpTransferManagerEvents,
  LockUpTransferManagerAddLockUpToUserEventArgs_3_0_0 as LockUpTransferManagerAddLockUpToUserEventArgs,
  LockUpTransferManagerAddNewLockUpTypeEventArgs_3_0_0 as LockUpTransferManagerAddNewLockUpTypeEventArgs,
  LockUpTransferManagerModifyLockUpTypeEventArgs_3_0_0 as LockUpTransferManagerModifyLockUpTypeEventArgs,
  LockUpTransferManagerPauseEventArgs_3_0_0 as LockUpTransferManagerPauseEventArgs,
  LockUpTransferManagerRemoveLockUpFromUserEventArgs_3_0_0 as LockUpTransferManagerRemoveLockUpFromUserEventArgs,
  LockUpTransferManagerRemoveLockUpTypeEventArgs_3_0_0 as LockUpTransferManagerRemoveLockUpTypeEventArgs,
  LockUpTransferManagerUnpauseEventArgs_3_0_0 as LockUpTransferManagerUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';

export type LockUpTransferManager = LockUpTransferManager_3_0_0;

export { isLockUpTransferManager, LockUpTransferManager_3_0_0, isLockUpTransferManager_3_0_0 };

// for internal use
export class LockupTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;
}
