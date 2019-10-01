/* istanbul ignore file */
import { CappedSTO_3_0_0, isCappedSTO_3_0_0 } from './3.0.0';
import { CappedSTO_3_1_0, isCappedSTO_3_1_0 } from './3.1.0';
import Common, { isCappedSTO } from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export type CappedSTO = CappedSTO_3_0_0 | CappedSTO_3_1_0;

export {
  isCappedSTO,
  CappedSTO_3_0_0,
  isCappedSTO_3_0_0,
  CappedSTO_3_1_0,
  isCappedSTO_3_1_0
};

// for internal use
export class CappedSTOCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
