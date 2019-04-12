import { Web3Wrapper } from '@0x/web3-wrapper';
import CappedSTOWrapper from '../contract_wrappers/modules/sto/capped_sto_wrapper';
import USDTieredSTOWrapper from '../contract_wrappers/modules/sto/usd_tiered_sto_wrapper';
import GeneralTransferManagerWrapper from '../contract_wrappers/modules/transfer_manager/general_transfer_manager_wrapper';
import GeneralPermissionManagerWrapper from '../contract_wrappers/modules/permission_manager/general_permission_manager_wrapper';
import ContractFactory from './contractFactory';

interface GetModuleParams {
  address: string;
  name: string;
}

interface GetGeneralPermissionManager extends GetModuleParams {
  name: 'GeneralPermissionManager';
}

interface GetGeneralTransferManager extends GetModuleParams {
  name: 'GeneralTransferManager';
}

interface GetCappedSTO extends GetModuleParams {
  name: 'CappedSTO';
}

interface GetUSDTieredSTO extends GetModuleParams {
  name: 'USDTieredSTO';
}

interface GetModuleInstance {
  (params: GetGeneralPermissionManager): Promise<GeneralPermissionManagerWrapper>;
  (params: GetGeneralTransferManager): Promise<GeneralTransferManagerWrapper>;
  (params: GetCappedSTO): Promise<CappedSTOWrapper>;
  (params: GetUSDTieredSTO): Promise<USDTieredSTOWrapper>;
}

/**
 * The ModuleWrapperFactory class is a factory to get instances from modules attached to a SecurityToken.
 */
export default class ModuleWrapperFactory {
  private readonly web3Wrapper: Web3Wrapper;

  private contractFactory: ContractFactory;

  public constructor(web3Wrapper: Web3Wrapper, contractFactory: ContractFactory) {
    this.web3Wrapper = web3Wrapper;
    this.contractFactory = contractFactory;
  }

  public getModuleInstance: GetModuleInstance = async (params: GetModuleParams): Promise<any> => {
    switch (params.name) {
      // Permission
      case 'GeneralPermissionManager':
        return new GeneralPermissionManagerWrapper(
          this.web3Wrapper,
          this.contractFactory.getGeneralPermissionManagerContract(params.address),
        );
      // TMs
      case 'GeneralTransferManager':
        return new GeneralTransferManagerWrapper(
          this.web3Wrapper,
          this.contractFactory.getGeneralTransferManagerContract(params.address),
        );
      // STOs
      case 'CappedSTO':
        return new CappedSTOWrapper(this.web3Wrapper, this.contractFactory.getCappedSTOContract(params.address));
      case 'USDTieredSTO':
        return new USDTieredSTOWrapper(this.web3Wrapper, this.contractFactory.getUSDTieredSTOContract(params.address));
      // Checkpoint
      // Burn
      default:
        // TODO: Typed error here
        throw new Error();
    }
  };
}
