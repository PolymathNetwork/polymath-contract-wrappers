import { ManualApprovalTransferManagerContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import ManualApprovalTransferManagerCommon from './common';
import { ContractVersion, Constructor } from '../../../../types';
import { WithModule_3_0_0 } from '../../module_wrapper';
import ContractFactory from '../../../../factories/contractFactory';

const ManualApprovalTransferManagerBase_3_0_0 = WithModule_3_0_0(
  (ManualApprovalTransferManagerCommon as unknown) as Constructor<ManualApprovalTransferManagerCommon>,
);

export class ManualApprovalTransferManager_3_0_0 extends ManualApprovalTransferManagerBase_3_0_0 {
  public contract: Promise<ManualApprovalTransferManagerContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate ManualApprovalTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<ManualApprovalTransferManagerContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }
}

export function isManualApprovalTransferManager_3_0_0(
  wrapper: ManualApprovalTransferManagerCommon,
): wrapper is ManualApprovalTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
