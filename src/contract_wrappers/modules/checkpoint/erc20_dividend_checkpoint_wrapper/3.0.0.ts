import { ERC20DividendCheckpointContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import { WithDividendCheckpoint_3_0_0 } from '../dividend_checkpoint_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import { ContractVersion, Constructor } from '../../../../types';
import ERC20DividendCheckpointCommon from './common';

const ERC20DividendCheckpointBase_3_0_0 = WithDividendCheckpoint_3_0_0(
  (ERC20DividendCheckpointCommon as unknown) as Constructor<ERC20DividendCheckpointCommon>,
);

export class ERC20DividendCheckpoint_3_0_0 extends ERC20DividendCheckpointBase_3_0_0 {
  public contract: Promise<ERC20DividendCheckpointContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate ERC20DividendCheckpointWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<ERC20DividendCheckpointContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }
}

export function isERC20DividendCheckpoint_3_0_0(
  wrapper: ERC20DividendCheckpointCommon,
): wrapper is ERC20DividendCheckpoint_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
