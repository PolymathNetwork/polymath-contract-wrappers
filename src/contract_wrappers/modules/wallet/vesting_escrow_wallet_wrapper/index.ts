/* istanbul ignore file */
import { VestingEscrowWallet_3_0_0, isVestingEscrowWallet_3_0_0 } from './3.0.0';
import { VestingEscrowWallet_3_1_0, isVestingEscrowWallet_3_1_0 } from './3.1.0';

import Common from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export type VestingEscrowWallet = VestingEscrowWallet_3_0_0 | VestingEscrowWallet_3_1_0;

export {
  VestingEscrowWallet_3_0_0,
  isVestingEscrowWallet_3_0_0,
  VestingEscrowWallet_3_1_0,
  isVestingEscrowWallet_3_1_0,
};

// for internal use
export class VestingEscrowWalletCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
