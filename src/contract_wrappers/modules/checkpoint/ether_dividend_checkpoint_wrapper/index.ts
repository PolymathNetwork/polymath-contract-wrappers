/* istanbul ignore file */
import { EtherDividendCheckpoint_3_0_0, isEtherDividendCheckpoint_3_0_0 } from './3.0.0';

import Common, { isEtherDividendCheckpoint } from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export type EtherDividendCheckpoint = EtherDividendCheckpoint_3_0_0;

export {
  isEtherDividendCheckpoint,
  EtherDividendCheckpoint_3_0_0,
  isEtherDividendCheckpoint_3_0_0,
};

// for internal use
export class EtherDividendCheckpointCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
