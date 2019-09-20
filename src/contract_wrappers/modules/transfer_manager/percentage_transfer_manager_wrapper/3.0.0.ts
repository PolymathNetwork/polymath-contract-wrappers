import { PercentageTransferManagerContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import { ContractVersion } from '../../../../types';
import ContractFactory from '../../../../factories/contractFactory';

import PercentageTransferManagerCommon from './common';

export class PercentageTransferManager_3_0_0 extends PercentageTransferManagerCommon {
  public contract: Promise<PercentageTransferManagerContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate PercentageTransferManager_3_0_0
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<PercentageTransferManagerContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }
}

export function isPercentageTransferManager_3_0_0(
  wrapper: PercentageTransferManagerCommon,
): wrapper is PercentageTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
