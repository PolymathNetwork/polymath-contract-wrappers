/* istanbul ignore file */
import { VestingEscrowWallet_3_0_0, isVestingEscrowWallet_3_0_0 } from './3.0.0';
import { VestingEscrowWallet_3_1_0, isVestingEscrowWallet_3_1_0 } from './3.1.0';

export type VestingEscrowWallet = VestingEscrowWallet_3_0_0 | VestingEscrowWallet_3_1_0;

export {
  VestingEscrowWallet_3_0_0,
  isVestingEscrowWallet_3_0_0,
  VestingEscrowWallet_3_1_0,
  isVestingEscrowWallet_3_1_0,
};
export { default as VestingEscrowWalletCommon } from './common';
