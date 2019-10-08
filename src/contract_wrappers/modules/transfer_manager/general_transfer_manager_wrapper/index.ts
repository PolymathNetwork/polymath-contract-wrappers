/* istanbul ignore file */
import {
  GeneralPermissionManagerEventArgs_3_0_0,
  GeneralTransferManagerEvents_3_1_0,
  GeneralTransferManagerEvents_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import { GeneralTransferManager_3_0_0, isGeneralTransferManager_3_0_0 } from './3.0.0';
import { GeneralTransferManager_3_1_0, isGeneralTransferManager_3_1_0 } from './3.1.0';

import Common, {
  isGeneralTransferManager,
  ChangeDefaultsParams,
  ChangeIssuanceAddressParams,
  ModifyKYCDataParams,
  ModifyKYCDataSignedParams,
  ModifyInvestorFlagParams,
  ModifyInvestorFlagMultiParams,
  ExecuteTransferParams,
  ModifyTransferRequirementsParams,
  ModifyTransferRequirementsMultiParams,
  ModifyKYCDataMultiParams,
  ModifyKYCDataSignedMultiParams,
} from './common';
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

export namespace GeneralTransferManagerTransactionParams {
  export interface ChangeDefaults extends ChangeDefaultsParams {}
  export interface ChangeIssuanceAddress extends ChangeIssuanceAddressParams {}
  export interface ModifyKYCData extends ModifyKYCDataParams {}
  export interface ModifyKYCDataSigned extends ModifyKYCDataSignedParams {}
  export interface ModifyInvestorFlag extends ModifyInvestorFlagParams {}
  export interface ModifyInvestorFlagMulti extends ModifyInvestorFlagMultiParams {}
  export interface ExecuteTransfer extends ExecuteTransferParams {}
  export interface ModifyTransferRequirements extends ModifyTransferRequirementsParams {}
  export interface ModifyTransferRequirementsMulti extends ModifyTransferRequirementsMultiParams {}
  export interface ModifyKYCDataMulti extends ModifyKYCDataMultiParams {}
  export interface ModifyKYCDataSignedMulti extends ModifyKYCDataSignedMultiParams {}
}

// for internal use
export class GeneralTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;
}
