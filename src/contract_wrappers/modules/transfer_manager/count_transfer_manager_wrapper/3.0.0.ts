import { Web3Wrapper, CountTransferManagerContract_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { ContractVersion, Constructor } from '../../../../types';
import CountTransferManagerCommon from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';
import ContractFactory from '../../../../factories/contractFactory';

const CountTransferManagerBase_3_0_0 = WithModule_3_0_0((CountTransferManagerCommon as unknown) as Constructor<
  CountTransferManagerCommon
>);

export class CountTransferManager_3_0_0 extends CountTransferManagerBase_3_0_0 {
  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate CountTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<CountTransferManagerContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }
}

export function isCountTransferManager_3_0_0(
  wrapper: CountTransferManagerCommon,
): wrapper is CountTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
