/* istanbul ignore file */
import { VolumeRestrictionTMEventArgs_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { VolumeRestrictionTransferManager_3_0_0, isVolumeRestrictionTransferManager_3_0_0 } from './3.0.0';

import Common, {
  isVolumeRestrictionTransferManager,
  HolderIndividualRestrictionParams,
  ChangeExemptWalletListParams,
  DailyRestrictionParams,
  IndividualDailyRestrictionParams,
  RestrictionParams,
  IndividualRestrictionParams,
  RemoveIndividualRestrictionMultiParams,
  IndividualDailyRestrictionMultiParams,
  IndividualRestrictionMultiParams,
} from './common';
import { ContractVersion } from '../../../../types';

export type VolumeRestrictionTMEventArgs = VolumeRestrictionTMEventArgs_3_0_0;

export {
  VolumeRestrictionTMEvents_3_0_0 as VolumeRestrictionTMEvents,
  VolumeRestrictionTMAddDefaultDailyRestrictionEventArgs_3_0_0 as VolumeRestrictionTMAddDefaultDailyRestrictionEventArgs,
  VolumeRestrictionTMAddDefaultRestrictionEventArgs_3_0_0 as VolumeRestrictionTMAddDefaultRestrictionEventArgs,
  VolumeRestrictionTMAddIndividualDailyRestrictionEventArgs_3_0_0 as VolumeRestrictionTMAddIndividualDailyRestrictionEventArgs,
  VolumeRestrictionTMAddIndividualRestrictionEventArgs_3_0_0 as VolumeRestrictionTMAddIndividualRestrictionEventArgs,
  VolumeRestrictionTMChangedExemptWalletListEventArgs_3_0_0 as VolumeRestrictionTMChangedExemptWalletListEventArgs,
  VolumeRestrictionTMDefaultDailyRestrictionRemovedEventArgs_3_0_0 as VolumeRestrictionTMDefaultDailyRestrictionRemovedEventArgs,
  VolumeRestrictionTMDefaultRestrictionRemovedEventArgs_3_0_0 as VolumeRestrictionTMDefaultRestrictionRemovedEventArgs,
  VolumeRestrictionTMIndividualDailyRestrictionRemovedEventArgs_3_0_0 as VolumeRestrictionTMIndividualDailyRestrictionRemovedEventArgs,
  VolumeRestrictionTMIndividualRestrictionRemovedEventArgs_3_0_0 as VolumeRestrictionTMIndividualRestrictionRemovedEventArgs,
  VolumeRestrictionTMModifyDefaultDailyRestrictionEventArgs_3_0_0 as VolumeRestrictionTMModifyDefaultDailyRestrictionEventArgs,
  VolumeRestrictionTMModifyDefaultRestrictionEventArgs_3_0_0 as VolumeRestrictionTMModifyDefaultRestrictionEventArgs,
  VolumeRestrictionTMModifyIndividualDailyRestrictionEventArgs_3_0_0 as VolumeRestrictionTMModifyIndividualDailyRestrictionEventArgs,
  VolumeRestrictionTMModifyIndividualRestrictionEventArgs_3_0_0 as VolumeRestrictionTMModifyIndividualRestrictionEventArgs,
  VolumeRestrictionTMPauseEventArgs_3_0_0 as VolumeRestrictionTMPauseEventArgs,
  VolumeRestrictionTMUnpauseEventArgs_3_0_0 as VolumeRestrictionTMUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';

export type VolumeRestrictionTransferManager = VolumeRestrictionTransferManager_3_0_0;

export {
  isVolumeRestrictionTransferManager,
  VolumeRestrictionTransferManager_3_0_0,
  isVolumeRestrictionTransferManager_3_0_0,
};

export namespace VolumeRestrictionTransferManagerTransactionParams {
  export interface RemoveIndividualRestriction extends HolderIndividualRestrictionParams {}
  export interface RemoveIndividualDailyRestriction extends HolderIndividualRestrictionParams {}
  export interface ChangeExemptWalletList extends ChangeExemptWalletListParams {}
  export interface AddDefaultDailyRestriction extends DailyRestrictionParams {}
  export interface ModifyDefaultDailyRestriction extends DailyRestrictionParams {}
  export interface ModifyIndividualDailyRestriction extends IndividualDailyRestrictionParams {}
  export interface AddDefaultRestriction extends RestrictionParams {}
  export interface ModifyDefaultRestriction extends RestrictionParams {}
  export interface AddIndividualDailyRestriction extends IndividualRestrictionParams {}
  export interface AddIndividualRestriction extends IndividualRestrictionParams {}
  export interface ModifyIndividualRestriction extends IndividualRestrictionParams {}
  export interface RemoveIndividualRestrictionMulti extends RemoveIndividualRestrictionMultiParams {}
  export interface RemoveIndividualDailyRestrictionMulti extends RemoveIndividualRestrictionMultiParams {}
  export interface AddIndividualDailyRestrictionMulti extends IndividualDailyRestrictionMultiParams {}
  export interface ModifyIndividualDailyRestrictionMulti extends IndividualDailyRestrictionMultiParams {}
  export interface AddIndividualRestrictionMulti extends IndividualRestrictionMultiParams {}
  export interface ModifyIndividualRestrictionMulti extends IndividualRestrictionMultiParams {}
}

// for internal use
export class VolumeRestrictionTransferManagerCommon extends Common {
  public contractVersion!: ContractVersion;
}
