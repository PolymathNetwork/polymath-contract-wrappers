/* istanbul ignore file */
import {
  VestingEscrowWalletEvents_3_1_0,
  VestingEscrowWalletEvents_3_0_0,
  VestingEscrowWalletEventArgs_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import { VestingEscrowWallet_3_0_0, isVestingEscrowWallet_3_0_0 } from './3.0.0';
import { VestingEscrowWallet_3_1_0, isVestingEscrowWallet_3_1_0 } from './3.1.0';

import Common, { isVestingEscrowWallet } from './common';
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

// for internal use
export class VestingEscrowWalletCommon extends Common {
  public contractVersion!: ContractVersion;
}
