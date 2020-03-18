/* istanbul ignore file */
import { EtherDividendCheckpointEventArgs_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { EtherDividendCheckpoint_3_0_0, isEtherDividendCheckpoint_3_0_0 } from './3.0.0';
import Common, {
  isEtherDividendCheckpoint,
  CreateDividendParams,
  CreateDividendWithCheckpointParams,
  CreateDividendWithExclusionsParams,
  CreateDividendWithCheckpointAndExclusionsParams,
} from './common';
import { ContractVersion } from '../../../../types';

export type EtherDividendCheckpointEventArgs = EtherDividendCheckpointEventArgs_3_0_0;
export {
  EtherDividendCheckpointEvents_3_0_0 as EtherDividendCheckpointEvents,
  EtherDividendCheckpointEtherDividendClaimFailedEventArgs_3_0_0 as EtherDividendCheckpointEtherDividendClaimFailedEventArgs,
  EtherDividendCheckpointEtherDividendClaimedEventArgs_3_0_0 as EtherDividendCheckpointEtherDividendClaimedEventArgs,
  EtherDividendCheckpointEtherDividendDepositedEventArgs_3_0_0 as EtherDividendCheckpointEtherDividendDepositedEventArgs,
  EtherDividendCheckpointEtherDividendReclaimedEventArgs_3_0_0 as EtherDividendCheckpointEtherDividendReclaimedEventArgs,
  EtherDividendCheckpointEtherDividendWithholdingWithdrawnEventArgs_3_0_0 as EtherDividendCheckpointEtherDividendWithholdingWithdrawnEventArgs,
  EtherDividendCheckpointPauseEventArgs_3_0_0 as EtherDividendCheckpointPauseEventArgs,
  EtherDividendCheckpointSetDefaultExcludedAddressesEventArgs_3_0_0 as EtherDividendCheckpointSetDefaultExcludedAddressesEventArgs,
  EtherDividendCheckpointSetWalletEventArgs_3_0_0 as EtherDividendCheckpointSetWalletEventArgs,
  EtherDividendCheckpointSetWithholdingEventArgs_3_0_0 as EtherDividendCheckpointSetWithholdingEventArgs,
  EtherDividendCheckpointSetWithholdingFixedEventArgs_3_0_0 as EtherDividendCheckpointSetWithholdingFixedEventArgs,
  EtherDividendCheckpointUnpauseEventArgs_3_0_0 as EtherDividendCheckpointUnpauseEventArgs,
  EtherDividendCheckpointUpdateDividendDatesEventArgs_3_0_0 as EtherDividendCheckpointUpdateDividendDatesEventArgs,
} from '@polymathnetwork/abi-wrappers';

export type EtherDividendCheckpoint = EtherDividendCheckpoint_3_0_0;

export { isEtherDividendCheckpoint, EtherDividendCheckpoint_3_0_0, isEtherDividendCheckpoint_3_0_0 };

export namespace EtherDividendCheckpointTransactionParams {
  export interface CreateDividend extends CreateDividendParams {}
  export interface CreateDividendWithCheckpoint extends CreateDividendWithCheckpointParams {}
  export interface CreateDividendWithExclusions extends CreateDividendWithExclusionsParams {}
  export interface CreateDividendWithCheckpointAndExclusions extends CreateDividendWithCheckpointAndExclusionsParams {}
}

// for internal use
export class EtherDividendCheckpointCommon extends Common {
  public contractVersion!: ContractVersion;
}
