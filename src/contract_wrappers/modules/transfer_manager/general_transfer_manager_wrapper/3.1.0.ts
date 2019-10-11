import { GeneralTransferManagerContract_3_1_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import { ContractVersion, Constructor } from '../../../../types';
import ContractFactory from '../../../../factories/contractFactory';

import GeneralTransferManagerCommon from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';

// uses 3.0.0 Module contract
const GeneralTransferManagerBase_3_1_0 = WithModule_3_0_0((GeneralTransferManagerCommon as unknown) as Constructor<
  GeneralTransferManagerCommon
>);

export class GeneralTransferManager_3_1_0 extends GeneralTransferManagerBase_3_1_0 {
  public contract: Promise<GeneralTransferManagerContract_3_1_0>;

  public contractVersion = ContractVersion.V3_1_0;

  /**
   * Instantiate GeneralTransferManager_3_1_0
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract Contract
   * @param contractFactory Contract factory address
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<GeneralTransferManagerContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Get whitelist module
   * @return whitelist module number
   */
  public whitelistModule = async (): Promise<number> => {
    const result = await (await this.contract).WHITELISTMODULE.callAsync();
    return result.toNumber();
  };
}

export function isGeneralTransferManager_3_1_0(
  wrapper: GeneralTransferManagerCommon,
): wrapper is GeneralTransferManager_3_1_0 {
  return wrapper.contractVersion === ContractVersion.V3_1_0;
}
