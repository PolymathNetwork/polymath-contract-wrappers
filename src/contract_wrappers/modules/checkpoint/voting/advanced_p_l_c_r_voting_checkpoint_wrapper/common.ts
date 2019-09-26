import { AdvancedPLCRVotingCheckpointContract_3_1_0, Web3Wrapper, BigNumber } from '@polymathnetwork/abi-wrappers';
import { parsePermBytes32Value, parseTransferResult, valueToWei } from '../../../../../utils/convert';
import ContractFactory from '../../../../../factories/contractFactory';
import { ErrorCode, Perm, TxParams } from '../../../../../types';
import { ModuleCommon } from '../../../module_wrapper';
import assert from '../../../../../utils/assert';

export namespace AdvancedPLCRVotingCheckpointTransactionParams {
  // export interface xxx extends xxxParams {}
}

/**
 * This class includes the functionality related to interacting with the Advanced PLCR Voting Checkpoint contract.
 */
export default abstract class AdvancedPLCRVotingCheckpointCommon extends ModuleCommon {
  public contract: Promise<AdvancedPLCRVotingCheckpointContract_3_1_0>;

  /**
   * Instantiate AdvancedPLCRVotingCheckpointWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<AdvancedPLCRVotingCheckpointContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }
}
