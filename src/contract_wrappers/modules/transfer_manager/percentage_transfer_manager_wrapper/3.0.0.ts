import { PercentageTransferManagerContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import { ContractVersion, Constructor } from '../../../../types';
import PercentageTransferManagerCommon from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';
import ContractFactory from '../../../../factories/contractFactory';

const PercentageTransferManagerBase_3_0_0 = WithModule_3_0_0(
  (PercentageTransferManagerCommon as unknown) as Constructor<PercentageTransferManagerCommon>,
);

export class PercentageTransferManager_3_0_0 extends PercentageTransferManagerBase_3_0_0 {
  public contract: Promise<PercentageTransferManagerContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate PercentageTransferManagerWrapper
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
