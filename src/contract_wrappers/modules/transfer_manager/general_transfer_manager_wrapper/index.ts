/* istanbul ignore file */
import {
  GeneralPermissionManagerEventArgs_3_0_0,
  GeneralTransferManagerEvents_3_1_0,
  GeneralTransferManagerEvents_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import { GeneralTransferManager_3_0_0, isGeneralTransferManager_3_0_0 } from './3.0.0';
import { GeneralTransferManager_3_1_0, isGeneralTransferManager_3_1_0 } from './3.1.0';

import Common, { isGeneralTransferManager } from './common';
import { ContractVersion } from '../../../../types';

export const GeneralTransferManagerEvents = {
  ...GeneralTransferManagerEvents_3_1_0,
  ...GeneralTransferManagerEvents_3_0_0,
};
export type GeneralTransferManagerEvents = GeneralTransferManagerEvents_3_0_0 | GeneralTransferManagerEvents_3_1_0;

export type GeneralTransferManagerEventArgs = GeneralPermissionManagerEventArgs_3_0_0;

export {
  GeneralTransferManagerChangeDefaultsEventArgs_3_0_0 as GeneralTransferManagerChangeDefaultsEventArgs,
  GeneralTransferManagerChangeIssuanceAddressEventArgs_3_0_0 as GeneralTransferManagerChangeIssuanceAddressEventArgs,
  GeneralTransferManagerModifyInvestorFlagEventArgs_3_0_0 as GeneralTransferManagerModifyInvestorFlagEventArgs,
  GeneralTransferManagerModifyKYCDataEventArgs_3_0_0 as GeneralTransferManagerModifyKYCDataEventArgs,
  GeneralTransferManagerModifyTransferRequirementsEventArgs_3_0_0 as GeneralTransferManagerModifyTransferRequirementsEventArgs,
  GeneralTransferManagerPauseEventArgs_3_0_0 as GeneralTransferManagerPauseEventArgs,
  GeneralTransferManagerUnpauseEventArgs_3_0_0 as GeneralTransferManagerUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';

export type GeneralTransferManager = GeneralTransferManager_3_0_0 | GeneralTransferManager_3_1_0;

export {
  isGeneralTransferManager,
  GeneralTransferManager_3_0_0,
  isGeneralTransferManager_3_0_0,
  GeneralTransferManager_3_1_0,
  isGeneralTransferManager_3_1_0,
};

// for internal use
export class GeneralTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;
}
