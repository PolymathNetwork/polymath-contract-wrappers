import { ERC20DetailedContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import AlternativeERC20Common from './common';
import { ContractVersion } from '../../../types';

/**
 * This class includes the functionality related to interacting with the AlternativeERC20 contract.
 */
export class AlternativeERC20_3_0_0 extends AlternativeERC20Common {
  public contract: Promise<ERC20DetailedContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate AlternativeERC20Wrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<ERC20DetailedContract_3_0_0>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }
}
