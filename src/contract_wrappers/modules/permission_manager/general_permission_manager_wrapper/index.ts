/* istanbul ignore file */
import {
  GeneralPermissionManagerEvents_3_1_0,
  GeneralPermissionManagerEvents_3_0_0,
  GeneralPermissionManagerEventArgs_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import { GeneralPermissionManager_3_0_0, isGeneralPermissionManager_3_0_0 } from './3.0.0';
import { GeneralPermissionManager_3_1_0, isGeneralPermissionManager_3_1_0 } from './3.1.0';
import Common, { isGeneralPermissionManager } from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../../types';

export const GeneralPermissionManagerEvents = {
  ...GeneralPermissionManagerEvents_3_1_0,
  ...GeneralPermissionManagerEvents_3_0_0,
};
export type GeneralPermissionManagerEvents =
  | GeneralPermissionManagerEvents_3_0_0
  | GeneralPermissionManagerEvents_3_1_0;

export type GeneralPermissionManagerEventArgs = GeneralPermissionManagerEventArgs_3_0_0;

export {
  GeneralPermissionManagerAddDelegateEventArgs_3_0_0 as GeneralPermissionManagerAddDelegateEventArgs,
  GeneralPermissionManagerChangePermissionEventArgs_3_0_0 as GeneralPermissionManagerChangePermissionEventArgs,
  GeneralPermissionManagerPauseEventArgs_3_0_0 as GeneralPermissionManagerPauseEventArgs,
  GeneralPermissionManagerUnpauseEventArgs_3_0_0 as GeneralPermissionManagerUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';

export type GeneralPermissionManager = GeneralPermissionManager_3_0_0 | GeneralPermissionManager_3_1_0;

export {
  isGeneralPermissionManager,
  GeneralPermissionManager_3_0_0,
  isGeneralPermissionManager_3_0_0,
  GeneralPermissionManager_3_1_0,
  isGeneralPermissionManager_3_1_0,
};

// for internal use
export class GeneralPermissionManagerCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
