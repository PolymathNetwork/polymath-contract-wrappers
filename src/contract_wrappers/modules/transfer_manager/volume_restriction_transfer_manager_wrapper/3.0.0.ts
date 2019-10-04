import { VolumeRestrictionTMContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import VolumeRestrictionTransferManagerCommon from './common';
import { ContractVersion, Constructor } from '../../../../types';
import { WithModule_3_0_0 } from '../../module_wrapper';
import ContractFactory from '../../../../factories/contractFactory';

const VolumeRestrictionTransferManagerBase_3_0_0 = WithModule_3_0_0(
  (VolumeRestrictionTransferManagerCommon as unknown) as Constructor<VolumeRestrictionTransferManagerCommon>,
);

export class VolumeRestrictionTransferManager_3_0_0 extends VolumeRestrictionTransferManagerBase_3_0_0 {
  public contract: Promise<VolumeRestrictionTMContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate VolumeRestrictionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<VolumeRestrictionTMContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }
}

export function isVolumeRestrictionTransferManager_3_0_0(
  wrapper: VolumeRestrictionTransferManagerCommon,
): wrapper is VolumeRestrictionTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
