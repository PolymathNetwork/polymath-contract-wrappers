/* istanbul ignore file */
import { AdvancedPLCRVotingCheckpoint_3_1_0, isAdvancedPLCRVotingCheckpoint_3_1_0 } from './3.1.0';

import Common, { isAdvancedPLCRVotingCheckpoint } from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../../types';

export type AdvancedPLCRVotingCheckpoint = AdvancedPLCRVotingCheckpoint_3_1_0;

export { isAdvancedPLCRVotingCheckpoint, AdvancedPLCRVotingCheckpoint_3_1_0, isAdvancedPLCRVotingCheckpoint_3_1_0 };

// for internal use
export class AdvancedPLCRVotingCheckpointCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
