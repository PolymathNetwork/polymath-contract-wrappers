/* istanbul ignore file */
import { ERC20DividendCheckpoint_3_0_0, isERC20DividendCheckpoint_3_0_0 } from './3.0.0';

import Common from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export type ERC20DividendCheckpoint = ERC20DividendCheckpoint_3_0_0;

export {
  ERC20DividendCheckpoint_3_0_0,
  isERC20DividendCheckpoint_3_0_0,
};

// for internal use
export class ERC20DividendCheckpointCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
