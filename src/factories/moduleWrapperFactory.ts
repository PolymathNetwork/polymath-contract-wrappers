import { Web3Wrapper } from '@0x/web3-wrapper';
import CountTransferManagerWrapper from '../contract_wrappers/modules/transfer_manager/count_transfer_manager_wrapper';
import ManualApprovalTransferManagerWrapper from '../contract_wrappers/modules/transfer_manager/manual_approval_transfer_manager_wrapper';
import PercentageTransferManagerWrapper from '../contract_wrappers/modules/transfer_manager/percentage_transfer_manager_wrapper';
import VolumeRestrictionTransferManagerWrapper from '../contract_wrappers/modules/transfer_manager/volume_restriction_transfer_manager_wrapper';
import ERC20DividendCheckpointWrapper from '../contract_wrappers/modules/checkpoint/erc20_dividend_checkpoint_wrapper';
import EtherDividendCheckpointWrapper from '../contract_wrappers/modules/checkpoint/ether_dividend_checkpoint_wrapper';
import CappedSTOWrapper from '../contract_wrappers/modules/sto/capped_sto_wrapper';
import USDTieredSTOWrapper from '../contract_wrappers/modules/sto/usd_tiered_sto_wrapper';
import GeneralTransferManagerWrapper from '../contract_wrappers/modules/transfer_manager/general_transfer_manager_wrapper';
import GeneralPermissionManagerWrapper from '../contract_wrappers/modules/permission_manager/general_permission_manager_wrapper';
import ModuleFactoryWrapper from '../contract_wrappers/modules/module_factory_wrapper';
import ContractFactory from './contractFactory';
import assert from '../utils/assert';
import { ModuleName } from '../types';

interface GetModuleParams {
  address: string;
  name: ModuleName;
}

interface GetGeneralPermissionManager extends GetModuleParams {
  name: ModuleName.generalPermissionManager;
}

interface GetCountTransferManager extends GetModuleParams {
  name: ModuleName.countTransferManager;
}

interface GetGeneralTransferManager extends GetModuleParams {
  name: ModuleName.generalTransferManager;
}

interface GetManualApprovalTransferManager extends GetModuleParams {
  name: ModuleName.manualApprovalTransferManager;
}

interface GetPercentageTransferManager extends GetModuleParams {
  name: ModuleName.percentageTransferManager;
}

interface GetVolumeRestrictionTransferManager extends GetModuleParams {
  name: ModuleName.volumeRestrictionTM;
}

interface GetCappedSTO extends GetModuleParams {
  name: ModuleName.cappedSTO;
}

interface GetUSDTieredSTO extends GetModuleParams {
  name: ModuleName.usdTieredSTO;
}

interface GetERC20DividendCheckpoint extends GetModuleParams {
  name: ModuleName.erc20DividendCheckpoint;
}

interface GetEtherDividendCheckpoint extends GetModuleParams {
  name: ModuleName.etherDividendCheckpoint;
}

interface GetModuleInstance {
  (params: GetGeneralPermissionManager): Promise<GeneralPermissionManagerWrapper>;
  (params: GetCountTransferManager): Promise<CountTransferManagerWrapper>;
  (params: GetGeneralTransferManager): Promise<GeneralTransferManagerWrapper>;
  (params: GetManualApprovalTransferManager): Promise<ManualApprovalTransferManagerWrapper>;
  (params: GetPercentageTransferManager): Promise<PercentageTransferManagerWrapper>;
  (params: GetVolumeRestrictionTransferManager): Promise<VolumeRestrictionTransferManagerWrapper>;
  (params: GetCappedSTO): Promise<CappedSTOWrapper>;
  (params: GetUSDTieredSTO): Promise<USDTieredSTOWrapper>;
  (params: GetERC20DividendCheckpoint): Promise<ERC20DividendCheckpointWrapper>;
  (params: GetEtherDividendCheckpoint): Promise<EtherDividendCheckpointWrapper>;
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

  public getModuleFactory = async (address: string): Promise<ModuleFactoryWrapper> => {
    const factory = this.contractFactory.getModuleFactoryContract(address);
    return new ModuleFactoryWrapper(this.web3Wrapper, factory);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getModuleInstance: GetModuleInstance = async (params: GetModuleParams): Promise<any> => {
    assert.isETHAddressHex('address', params.address);
    switch (params.name) {
      // Permission
      case ModuleName.generalPermissionManager:
        return new GeneralPermissionManagerWrapper(
          this.web3Wrapper,
          this.contractFactory.getGeneralPermissionManagerContract(params.address),
          this.contractFactory,
        );
      // TMs
      case ModuleName.countTransferManager:
        return new CountTransferManagerWrapper(
          this.web3Wrapper,
          this.contractFactory.getCountTransferManagerContract(params.address),
          this.contractFactory,
        );
      case ModuleName.generalTransferManager:
        return new GeneralTransferManagerWrapper(
          this.web3Wrapper,
          this.contractFactory.getGeneralTransferManagerContract(params.address),
          this.contractFactory,
        );
      case ModuleName.manualApprovalTransferManager:
        return new ManualApprovalTransferManagerWrapper(
          this.web3Wrapper,
          this.contractFactory.getManualApprovalTransferManagerContract(params.address),
          this.contractFactory,
        );
      case ModuleName.percentageTransferManager:
        return new PercentageTransferManagerWrapper(
          this.web3Wrapper,
          this.contractFactory.getPercentageTransferManagerContract(params.address),
          this.contractFactory,
        );
      case ModuleName.volumeRestrictionTM:
        return new VolumeRestrictionTransferManagerWrapper(
          this.web3Wrapper,
          this.contractFactory.getVolumeRestrictionTMContract(params.address),
          this.contractFactory,
        );
      // STOs
      case ModuleName.cappedSTO:
        return new CappedSTOWrapper(
          this.web3Wrapper,
          this.contractFactory.getCappedSTOContract(params.address),
          this.contractFactory,
        );
      case ModuleName.usdTieredSTO:
        return new USDTieredSTOWrapper(
          this.web3Wrapper,
          this.contractFactory.getUSDTieredSTOContract(params.address),
          this.contractFactory,
        );
      // Checkpoint
      case ModuleName.erc20DividendCheckpoint:
        return new ERC20DividendCheckpointWrapper(
          this.web3Wrapper,
          this.contractFactory.getERC20DividendCheckpointContract(params.address),
          this.contractFactory,
        );
      case ModuleName.etherDividendCheckpoint:
        return new EtherDividendCheckpointWrapper(
          this.web3Wrapper,
          this.contractFactory.getEtherDividendCheckpointContract(params.address),
          this.contractFactory,
        );
      // Burn
      default:
        // TODO: Typed error here
        throw new Error();
    }
  };
}
