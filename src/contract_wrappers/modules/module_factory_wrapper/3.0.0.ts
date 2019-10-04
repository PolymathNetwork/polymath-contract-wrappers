import { ModuleFactoryContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import { ContractVersion } from '../../../types';
import ModuleFactoryCommon from './common';

/**
 * This class includes the functionality related to interacting with the ModuleFactory contract.
 */
export class ModuleFactory_3_0_0 extends ModuleFactoryCommon {
  public contract: Promise<ModuleFactoryContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate ModuleFactoryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<ModuleFactoryContract_3_0_0>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }
}

export function isModuleFactory_3_0_0(wrapper: ModuleFactoryCommon): wrapper is ModuleFactory_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
