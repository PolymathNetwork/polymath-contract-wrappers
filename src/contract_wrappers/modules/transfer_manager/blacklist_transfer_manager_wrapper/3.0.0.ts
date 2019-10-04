import { BlacklistTransferManagerContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import { ContractVersion, Constructor } from '../../../../types';

import BlacklistTransferManagerCommon from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';
import ContractFactory from '../../../../factories/contractFactory';

const BlacklistTransferManagerBase_3_0_0 = WithModule_3_0_0((BlacklistTransferManagerCommon as unknown) as Constructor<
  BlacklistTransferManagerCommon
>);

export class BlacklistTransferManager_3_0_0 extends BlacklistTransferManagerBase_3_0_0 {
  public contract: Promise<BlacklistTransferManagerContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate BlacklistTransferManager
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<BlacklistTransferManagerContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }
}

export function isBlacklistTransferManager_3_0_0(
  wrapper: BlacklistTransferManagerCommon,
): wrapper is BlacklistTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
