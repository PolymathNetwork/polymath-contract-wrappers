import { GeneralTransferManagerContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import { ContractVersion, Constructor } from '../../../../types';
import ContractFactory from '../../../../factories/contractFactory';

import GeneralTransferManagerCommon from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';

const GeneralTransferManagerBase_3_0_0 = WithModule_3_0_0((GeneralTransferManagerCommon as unknown) as Constructor<
  GeneralTransferManagerCommon
>);

export class GeneralTransferManager_3_0_0 extends GeneralTransferManagerBase_3_0_0 {
  public contract: Promise<GeneralTransferManagerContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate GeneralTransferManager_3_0_0
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<GeneralTransferManagerContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }
}

export function isGeneralTransferManager_3_0_0(
  wrapper: GeneralTransferManagerCommon,
): wrapper is GeneralTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
