/* istanbul ignore file */
import { PercentageTransferManagerEventArgs_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { PercentageTransferManager_3_0_0, isPercentageTransferManager_3_0_0 } from './3.0.0';

import Common, {
  isPercentageTransferManager,
  ChangeHolderPercentageParams,
  ModifyWhitelistParams,
  ModifyWhitelistMultiParams,
  SetAllowPrimaryIssuanceParams,
} from './common';
import { ContractVersion } from '../../../../types';

export type PercentageTransferManagerEventArgs = PercentageTransferManagerEventArgs_3_0_0;

export {
  PercentageTransferManagerEvents_3_0_0 as PercentageTransferManagerEvents,
  PercentageTransferManagerModifyHolderPercentageEventArgs_3_0_0 as PercentageTransferManagerModifyHolderPercentageEventArgs,
  PercentageTransferManagerModifyWhitelistEventArgs_3_0_0 as PercentageTransferManagerModifyWhitelistEventArgs,
  PercentageTransferManagerPauseEventArgs_3_0_0 as PercentageTransferManagerPauseEventArgs,
  PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs_3_0_0 as PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs,
  PercentageTransferManagerUnpauseEventArgs_3_0_0 as PercentageTransferManagerUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';

export type PercentageTransferManager = PercentageTransferManager_3_0_0;

export { isPercentageTransferManager, PercentageTransferManager_3_0_0, isPercentageTransferManager_3_0_0 };

export namespace PercentageTransferManagerTransactionParams {
  export interface ChangeHolderPercentage extends ChangeHolderPercentageParams {}
  export interface ModifyWhitelist extends ModifyWhitelistParams {}
  export interface ModifyWhitelistMulti extends ModifyWhitelistMultiParams {}
  export interface SetAllowPrimaryIssuance extends SetAllowPrimaryIssuanceParams {}
}

// for internal use
export class PercentageTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;
}
