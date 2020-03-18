import { ISecurityTokenContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import SecurityTokenCommon from './common';
import ContractFactory from '../../../factories/contractFactory';
import { ContractVersion } from '../../../types';

/**
 * This class includes the functionality related to interacting with the SecurityToken contract.
 */
export class SecurityToken_3_0_0 extends SecurityTokenCommon {
  public contract: Promise<ISecurityTokenContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate SecurityTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<ISecurityTokenContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }
}

export function isSecurityToken_3_0_0(wrapper: SecurityTokenCommon): wrapper is SecurityToken_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
