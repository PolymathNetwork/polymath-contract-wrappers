import { VestingEscrowWalletContract_3_0_0, Web3Wrapper, PolyResponse } from '@polymathnetwork/abi-wrappers';
import ContractFactory from '../../../../factories/contractFactory';
import { ContractVersion, Perm, ErrorCode, Constructor } from '../../../../types';
import { stringToBytes32, dateToBigNumber } from '../../../../utils/convert';
import VestingEscrowWalletCommon, { ModifyScheduleParams } from './common';
import assert from '../../../../utils/assert';
import { WithModule_3_0_0 } from '../../module_wrapper';

const VestingEscrowWalletBase_3_0_0 = WithModule_3_0_0((VestingEscrowWalletCommon as unknown) as Constructor<
  VestingEscrowWalletCommon
>);

/**
 * This class includes the functionality related to interacting with the Vesting Escrow Wallet contract.
 */
export class VestingEscrowWallet_3_0_0 extends VestingEscrowWalletBase_3_0_0 {
  public contract: Promise<VestingEscrowWalletContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate VestingEscrowWalletWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<VestingEscrowWalletContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Address of the Treasury wallet. All of the unassigned token will transfer to that address.
   * @return address
   */
  public treasuryWallet = async (): Promise<string> => {
    return (await this.contract).treasuryWallet.callAsync();
  };

  /**
   * Modifies a vesting schedule for a beneficiary address
   */
  public modifySchedule = async (params: ModifyScheduleParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.checkSchedule(params.beneficiary);
    assert.assert(params.startTime.getTime() > Date.now(), ErrorCode.TooEarly, 'Date in the past');
    return (await this.contract).modifySchedule.sendTransactionAsync(
      params.beneficiary,
      stringToBytes32(params.templateName),
      dateToBigNumber(params.startTime),
      params.txData,
      params.safetyFactor,
    );
  };
}

export function isVestingEscrowWallet_3_0_0(wrapper: VestingEscrowWalletCommon): wrapper is VestingEscrowWallet_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
