import { GeneralPermissionManagerContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import ContractFactory from '../../../../factories/contractFactory';
import { ContractVersion, Constructor } from '../../../../types';
import GeneralPermissionManagerCommon from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';

const GeneralPermissionManagerBase_3_0_0 = WithModule_3_0_0((GeneralPermissionManagerCommon as unknown) as Constructor<
  GeneralPermissionManagerCommon
>);

/**
 * This class includes the functionality related to interacting with the General Permission Manager contract.
 */
export class GeneralPermissionManager_3_0_0 extends GeneralPermissionManagerBase_3_0_0 {
  public contract: Promise<GeneralPermissionManagerContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate GeneralPermissionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<GeneralPermissionManagerContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }
}

export function isGeneralPermissionManager_3_0_0(
  wrapper: GeneralPermissionManagerCommon,
): wrapper is GeneralPermissionManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
