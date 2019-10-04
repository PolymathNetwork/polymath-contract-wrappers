import { LockUpTransferManagerContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import LockUpTransferManagerCommon from './common';
import { ContractVersion, Constructor } from '../../../../types';
import ContractFactory from '../../../../factories/contractFactory';
import { WithModule_3_0_0 } from '../../module_wrapper';

const LockUpTransferManagerBase_3_0_0 = WithModule_3_0_0((LockUpTransferManagerCommon as unknown) as Constructor<
  LockUpTransferManagerCommon
>);

export class LockUpTransferManager_3_0_0 extends LockUpTransferManagerBase_3_0_0 {
  public contract: Promise<LockUpTransferManagerContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate LockUpTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<LockUpTransferManagerContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }
}

export function isLockUpTransferManager_3_0_0(
  wrapper: LockUpTransferManagerCommon,
): wrapper is LockUpTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
