import { AdvancedPLCRVotingCheckpointContract_3_1_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import { ContractVersion, Constructor } from '../../../../../types';
import ContractFactory from '../../../../../factories/contractFactory';

import AdvancedPLCRVotingCheckpointCommon from './common';
import { WithModule_3_0_0 } from '../../../module_wrapper';

// uses 3.0.0 Module contract
const AdvancedPLCRVotingCheckpointBase_3_1_0 = WithModule_3_0_0(
  (AdvancedPLCRVotingCheckpointCommon as unknown) as Constructor<AdvancedPLCRVotingCheckpointCommon>,
);

export class AdvancedPLCRVotingCheckpoint_3_1_0 extends AdvancedPLCRVotingCheckpointBase_3_1_0 {
  public contract: Promise<AdvancedPLCRVotingCheckpointContract_3_1_0>;

  public contractVersion = ContractVersion.V3_1_0;

  /**
   * Instantiate AdvancedPLCRVotingCheckpoint_3_1_0
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract Contract
   * @param contractFactory Contract factory address
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

export function isAdvancedPLCRVotingCheckpoint_3_1_0(
  wrapper: AdvancedPLCRVotingCheckpointCommon,
): wrapper is AdvancedPLCRVotingCheckpoint_3_1_0 {
  return wrapper.contractVersion === ContractVersion.V3_1_0;
}
