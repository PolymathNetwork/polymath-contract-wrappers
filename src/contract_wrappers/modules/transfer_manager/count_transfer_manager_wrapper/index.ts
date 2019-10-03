/* istanbul ignore file */
import { CountTransferManagerEventArgs_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { CountTransferManager_3_0_0, isCountTransferManager_3_0_0 } from './3.0.0';
import Common, { isCountTransferManager } from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export type CountTransferManager = CountTransferManager_3_0_0;

export type CountTransferManagerEventArgs = CountTransferManagerEventArgs_3_0_0;

export {
  CountTransferManagerEvents_3_0_0 as CountTransferManagerEvents,
  CountTransferManagerModifyHolderCountEventArgs_3_0_0 as CountTransferManagerModifyHolderCountEventArgs,
  CountTransferManagerPauseEventArgs_3_0_0 as CountTransferManagerPauseEventArgs,
  CountTransferManagerUnpauseEventArgs_3_0_0 as CountTransferManagerUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';

export { isCountTransferManager, CountTransferManager_3_0_0, isCountTransferManager_3_0_0 };

// for internal use
export class CountTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
