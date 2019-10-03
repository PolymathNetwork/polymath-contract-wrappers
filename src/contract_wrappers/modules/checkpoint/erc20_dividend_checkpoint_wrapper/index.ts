/* istanbul ignore file */
import { ERC20DividendCheckpointEventArgs_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { ERC20DividendCheckpoint_3_0_0, isERC20DividendCheckpoint_3_0_0 } from './3.0.0';

import Common, { isERC20DividendCheckpoint } from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export type ERC20DividendCheckpointEventArgs = ERC20DividendCheckpointEventArgs_3_0_0;

export {
  ERC20DividendCheckpointEvents_3_0_0 as ERC20DividendCheckpointEvents,
  ERC20DividendCheckpointERC20DividendDepositedEventArgs_3_0_0 as ERC20DividendCheckpointERC20DividendDepositedEventArgs,
  ERC20DividendCheckpointERC20DividendClaimedEventArgs_3_0_0 as ERC20DividendCheckpointERC20DividendClaimedEventArgs,
  ERC20DividendCheckpointERC20DividendReclaimedEventArgs_3_0_0 as ERC20DividendCheckpointERC20DividendReclaimedEventArgs,
  ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs_3_0_0 as ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs,
  ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs_3_0_0 as ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs,
  ERC20DividendCheckpointSetWithholdingEventArgs_3_0_0 as ERC20DividendCheckpointSetWithholdingEventArgs,
  ERC20DividendCheckpointSetWithholdingFixedEventArgs_3_0_0 as ERC20DividendCheckpointSetWithholdingFixedEventArgs,
  ERC20DividendCheckpointPauseEventArgs_3_0_0 as ERC20DividendCheckpointPauseEventArgs,
  ERC20DividendCheckpointSetWalletEventArgs_3_0_0 as ERC20DividendCheckpointSetWalletEventArgs,
  ERC20DividendCheckpointUnpauseEventArgs_3_0_0 as ERC20DividendCheckpointUnpauseEventArgs,
  ERC20DividendCheckpointUpdateDividendDatesEventArgs_3_0_0 as ERC20DividendCheckpointUpdateDividendDatesEventArgs,
} from '@polymathnetwork/abi-wrappers';

export type ERC20DividendCheckpoint = ERC20DividendCheckpoint_3_0_0;

export { isERC20DividendCheckpoint, ERC20DividendCheckpoint_3_0_0, isERC20DividendCheckpoint_3_0_0 };

// for internal use
export class ERC20DividendCheckpointCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
