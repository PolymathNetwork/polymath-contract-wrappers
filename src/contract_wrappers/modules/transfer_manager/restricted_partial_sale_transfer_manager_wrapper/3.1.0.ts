import { RestrictedPartialSaleTMContract_3_1_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import { ContractVersion, Constructor } from '../../../../types';
import ContractFactory from '../../../../factories/contractFactory';

import RestrictedPartialSaleTransferManagerCommon from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';

// uses 3.0.0 Module contract
const RestrictedPartialSaleTransferManagerBase_3_1_0 = WithModule_3_0_0(
  (RestrictedPartialSaleTransferManagerCommon as unknown) as Constructor<RestrictedPartialSaleTransferManagerCommon>,
);

export class RestrictedPartialSaleTransferManager_3_1_0 extends RestrictedPartialSaleTransferManagerBase_3_1_0 {
  public contract: Promise<RestrictedPartialSaleTMContract_3_1_0>;

  public contractVersion = ContractVersion.V3_1_0;

  /**
   * Instantiate RestrictedPartialSaleTransferManager_3_1_0
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract Contract
   * @param contractFactory Contract factory address
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<RestrictedPartialSaleTMContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }
}

export function isRestrictedPartialSaleTransferManager_3_1_0(
  wrapper: RestrictedPartialSaleTransferManagerCommon,
): wrapper is RestrictedPartialSaleTransferManager_3_1_0 {
  return wrapper.contractVersion === ContractVersion.V3_1_0;
}
