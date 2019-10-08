/* istanbul ignore file */
import {
  VestingEscrowWalletEvents_3_1_0,
  VestingEscrowWalletEvents_3_0_0,
  VestingEscrowWalletEventArgs_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import { VestingEscrowWallet_3_0_0, isVestingEscrowWallet_3_0_0 } from './3.0.0';
import { VestingEscrowWallet_3_1_0, isVestingEscrowWallet_3_1_0 } from './3.1.0';

import Common, {
  isVestingEscrowWallet,
  ChangeTreasuryWalletParams,
  DepositTokensParams,
  SendToTreasuryParams,
  PushAvailableTokensParams,
  AddTemplateParams,
  RemoveTemplateParams,
  AddScheduleParams,
  AddScheduleFromTemplateParams,
  RevokeScheduleParams,
  RevokeAllSchedulesParams,
  PushAvailableTokensMultiParams,
  AddScheduleMultiParams,
  AddScheduleFromTemplateMultiParams,
  RevokeSchedulesMultiParams,
  ModifyScheduleMultiParams,
  ModifyScheduleParams,
} from './common';
import { ContractVersion } from '../../../../types';

export const VestingEscrowWalletEvents = {
  ...VestingEscrowWalletEvents_3_1_0,
  ...VestingEscrowWalletEvents_3_0_0,
};
export type VestingEscrowWalletEvents = VestingEscrowWalletEvents_3_0_0 | VestingEscrowWalletEvents_3_1_0;

export type VestingEscrowWalletEventArgs = VestingEscrowWalletEventArgs_3_0_0;

export type VestingEscrowWallet = VestingEscrowWallet_3_0_0 | VestingEscrowWallet_3_1_0;

export {
  VestingEscrowWalletPauseEventArgs_3_0_0 as VestingEscrowWalletPauseEventArgs,
  VestingEscrowWalletUnpauseEventArgs_3_0_0 as VestingEscrowWalletUnpauseEventArgs,
  VestingEscrowWalletAddScheduleEventArgs_3_0_0 as VestingEscrowWalletAddScheduleEventArgs,
  VestingEscrowWalletModifyScheduleEventArgs_3_0_0 as VestingEscrowWalletModifyScheduleEventArgs,
  VestingEscrowWalletRevokeAllSchedulesEventArgs_3_0_0 as VestingEscrowWalletRevokeAllSchedulesEventArgs,
  VestingEscrowWalletRevokeScheduleEventArgs_3_0_0 as VestingEscrowWalletRevokeScheduleEventArgs,
  VestingEscrowWalletDepositTokensEventArgs_3_0_0 as VestingEscrowWalletDepositTokensEventArgs,
  VestingEscrowWalletSendToTreasuryEventArgs_3_0_0 as VestingEscrowWalletSendToTreasuryEventArgs,
  VestingEscrowWalletSendTokensEventArgs_3_0_0 as VestingEscrowWalletSendTokensEventArgs,
  VestingEscrowWalletAddTemplateEventArgs_3_0_0 as VestingEscrowWalletAddTemplateEventArgs,
  VestingEscrowWalletRemoveTemplateEventArgs_3_0_0 as VestingEscrowWalletRemoveTemplateEventArgs,
  VestingEscrowWalletTreasuryWalletChangedEventArgs_3_0_0 as VestingEscrowWalletTreasuryWalletChangedEventArgs,
} from '@polymathnetwork/abi-wrappers';

export {
  isVestingEscrowWallet,
  VestingEscrowWallet_3_0_0,
  isVestingEscrowWallet_3_0_0,
  VestingEscrowWallet_3_1_0,
  isVestingEscrowWallet_3_1_0,
};

export namespace VestingEscrowWalletTransactionParams {
  export interface ChangeTreasuryWallet extends ChangeTreasuryWalletParams {}
  export interface DepositTokens extends DepositTokensParams {}
  export interface SendToTreasury extends SendToTreasuryParams {}
  export interface PushAvailableTokens extends PushAvailableTokensParams {}
  export interface AddTemplate extends AddTemplateParams {}
  export interface RemoveTemplate extends RemoveTemplateParams {}
  export interface AddSchedule extends AddScheduleParams {}
  export interface AddScheduleFromTemplate extends AddScheduleFromTemplateParams {}
  export interface RevokeSchedule extends RevokeScheduleParams {}
  export interface RevokeAllSchedules extends RevokeAllSchedulesParams {}
  export interface PushAvailableTokensMulti extends PushAvailableTokensMultiParams {}
  export interface AddScheduleMulti extends AddScheduleMultiParams {}
  export interface AddScheduleFromTemplateMulti extends AddScheduleFromTemplateMultiParams {}
  export interface RevokeSchedulesMulti extends RevokeSchedulesMultiParams {}
  export interface ModifyScheduleMulti extends ModifyScheduleMultiParams {}
  export interface ModifySchedule extends ModifyScheduleParams {}
}

// for internal use
export class VestingEscrowWalletCommon extends Common {
  public contractVersion!: ContractVersion;
}
