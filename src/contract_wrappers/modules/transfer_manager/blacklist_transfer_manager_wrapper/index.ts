/* istanbul ignore file */
import { BlacklistTransferManagerEventArgs_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { BlacklistTransferManager_3_0_0, isBlacklistTransferManager_3_0_0 } from './3.0.0';
import Common, { isBlacklistTransferManager } from './common';
import { ContractVersion } from '../../../../types';

export type BlacklistTransferManagerEventArgs = BlacklistTransferManagerEventArgs_3_0_0;

export {
  BlacklistTransferManagerEvents_3_0_0 as BlacklistTransferManagerEvents,
  BlacklistTransferManagerAddBlacklistTypeEventArgs_3_0_0 as BlacklistTransferManagerAddBlacklistTypeEventArgs,
  BlacklistTransferManagerAddInvestorToBlacklistEventArgs_3_0_0 as BlacklistTransferManagerAddInvestorToBlacklistEventArgs,
  BlacklistTransferManagerDeleteBlacklistTypeEventArgs_3_0_0 as BlacklistTransferManagerDeleteBlacklistTypeEventArgs,
  BlacklistTransferManagerDeleteInvestorFromBlacklistEventArgs_3_0_0 as BlacklistTransferManagerDeleteInvestorFromBlacklistEventArgs,
  BlacklistTransferManagerModifyBlacklistTypeEventArgs_3_0_0 as BlacklistTransferManagerModifyBlacklistTypeEventArgs,
  BlacklistTransferManagerPauseEventArgs_3_0_0 as BlacklistTransferManagerPauseEventArgs,
  BlacklistTransferManagerUnpauseEventArgs_3_0_0 as BlacklistTransferManagerUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';

export type BlacklistTransferManager = BlacklistTransferManager_3_0_0;

export { isBlacklistTransferManager, BlacklistTransferManager_3_0_0, isBlacklistTransferManager_3_0_0 };

// for internal use
export class BlacklistTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;
}
