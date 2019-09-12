import { Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import {
  GeneralTransferManager_3_0_0,
  GeneralTransferManager_3_1_0,
} from '../contract_wrappers/modules/transfer_manager/general_transfer_manager_wrapper';
import CountTransferManagerWrapper from '../contract_wrappers/modules/transfer_manager/count_transfer_manager_wrapper';
import ManualApprovalTransferManagerWrapper from '../contract_wrappers/modules/transfer_manager/manual_approval_transfer_manager_wrapper';
import PercentageTransferManagerWrapper from '../contract_wrappers/modules/transfer_manager/percentage_transfer_manager_wrapper';
import LockUpTransferManagerWrapper from '../contract_wrappers/modules/transfer_manager/lock_up_transfer_manager_wrapper';
import BlacklistTransferManagerWrapper from '../contract_wrappers/modules/transfer_manager/blacklist_transfer_manager_wrapper';
import VolumeRestrictionTransferManagerWrapper from '../contract_wrappers/modules/transfer_manager/volume_restriction_transfer_manager_wrapper';
import ERC20DividendCheckpointWrapper from '../contract_wrappers/modules/checkpoint/erc20_dividend_checkpoint_wrapper';
import EtherDividendCheckpointWrapper from '../contract_wrappers/modules/checkpoint/ether_dividend_checkpoint_wrapper';
import { CappedSTO_3_0_0, CappedSTO_3_1_0 } from '../contract_wrappers/modules/sto/capped_sto_wrapper';
import { USDTieredSTO_3_0_0, USDTieredSTO_3_1_0 } from '../contract_wrappers/modules/sto/usd_tiered_sto_wrapper';
import GeneralPermissionManagerWrapper from '../contract_wrappers/modules/permission_manager/general_permission_manager_wrapper';
import ModuleFactoryWrapper from '../contract_wrappers/modules/module_factory_wrapper';
import VestingEscrowWalletWrapper from '../contract_wrappers/modules/wallet/vesting_escrow_wallet_wrapper';
import ContractFactory from './contractFactory';
import assert from '../utils/assert';
import { ModuleName, ErrorCode, ContractVersion } from '../types';
import { PolymathError } from '../PolymathError';

interface GetModuleParams {
  address: string;
  name: ModuleName;
}

interface GetVestingEscrowWallet extends GetModuleParams {
  name: ModuleName.VestingEscrowWallet;
}

interface GetGeneralPermissionManager extends GetModuleParams {
  name: ModuleName.GeneralPermissionManager;
}

interface GetCountTransferManager extends GetModuleParams {
  name: ModuleName.CountTransferManager;
}

interface GetGeneralTransferManager extends GetModuleParams {
  name: ModuleName.GeneralTransferManager;
}

interface GetManualApprovalTransferManager extends GetModuleParams {
  name: ModuleName.ManualApprovalTransferManager;
}

interface GetPercentageTransferManager extends GetModuleParams {
  name: ModuleName.PercentageTransferManager;
}

interface GetLockUpTransferManager extends GetModuleParams {
  name: ModuleName.LockUpTransferManager;
}

interface GetBlacklistTransferManager extends GetModuleParams {
  name: ModuleName.BlacklistTransferManager;
}

interface GetVolumeRestrictionTransferManager extends GetModuleParams {
  name: ModuleName.VolumeRestrictionTM;
}

interface GetCappedSTO extends GetModuleParams {
  name: ModuleName.CappedSTO;
}

interface GetUSDTieredSTO extends GetModuleParams {
  name: ModuleName.UsdTieredSTO;
}

interface GetERC20DividendCheckpoint extends GetModuleParams {
  name: ModuleName.ERC20DividendCheckpoint;
}

interface GetEtherDividendCheckpoint extends GetModuleParams {
  name: ModuleName.EtherDividendCheckpoint;
}

interface GetModuleInstance {
  (params: GetGeneralPermissionManager): Promise<GeneralPermissionManagerWrapper>;
  (params: GetCountTransferManager): Promise<CountTransferManagerWrapper>;
  (params: GetGeneralTransferManager): Promise<GeneralTransferManager_3_0_0 | GeneralTransferManager_3_1_0>;
  (params: GetManualApprovalTransferManager): Promise<ManualApprovalTransferManagerWrapper>;
  (params: GetPercentageTransferManager): Promise<PercentageTransferManagerWrapper>;
  (params: GetLockUpTransferManager): Promise<LockUpTransferManagerWrapper>;
  (params: GetBlacklistTransferManager): Promise<BlacklistTransferManagerWrapper>;
  (params: GetVolumeRestrictionTransferManager): Promise<VolumeRestrictionTransferManagerWrapper>;
  (params: GetCappedSTO): Promise<CappedSTO_3_0_0 | CappedSTO_3_1_0>;
  (params: GetUSDTieredSTO): Promise<USDTieredSTO_3_0_0 | USDTieredSTO_3_1_0>;
  (params: GetERC20DividendCheckpoint): Promise<ERC20DividendCheckpointWrapper>;
  (params: GetEtherDividendCheckpoint): Promise<EtherDividendCheckpointWrapper>;
  (params: GetVestingEscrowWallet): Promise<VestingEscrowWalletWrapper>;
}

/**
 * The ModuleWrapperFactory class is a factory to get instances from modules attached to a SecurityToken.
 */
export default class ModuleWrapperFactory {
  public readonly web3Wrapper: Web3Wrapper;

  public contractFactory: ContractFactory;

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
    let moduleWrapper;
    const version = await this.contractFactory.getModuleVersion(params.address);

    switch (params.name) {
      // Permission
      case ModuleName.GeneralPermissionManager:
        moduleWrapper = new GeneralPermissionManagerWrapper(
          this.web3Wrapper,
          this.contractFactory.getGeneralPermissionManagerContract(params.address),
          this.contractFactory,
        );
        break;
      // TMs
      case ModuleName.CountTransferManager:
        moduleWrapper = new CountTransferManagerWrapper(
          this.web3Wrapper,
          this.contractFactory.getCountTransferManagerContract(params.address),
          this.contractFactory,
        );
        break;
      case ModuleName.GeneralTransferManager:
        if (version === ContractVersion.V3_0_0) {
          moduleWrapper = new GeneralTransferManager_3_0_0(
            this.web3Wrapper,
            this.contractFactory.getGeneralTransferManagerContract(params.address, version),
            this.contractFactory,
          );
        } else {
          moduleWrapper = new GeneralTransferManager_3_1_0(
            this.web3Wrapper,
            this.contractFactory.getGeneralTransferManagerContract(params.address, version),
            this.contractFactory,
          );
        }
        break;
      case ModuleName.ManualApprovalTransferManager:
        moduleWrapper = new ManualApprovalTransferManagerWrapper(
          this.web3Wrapper,
          this.contractFactory.getManualApprovalTransferManagerContract(params.address),
          this.contractFactory,
        );
        break;
      case ModuleName.PercentageTransferManager:
        moduleWrapper = new PercentageTransferManagerWrapper(
          this.web3Wrapper,
          this.contractFactory.getPercentageTransferManagerContract(params.address),
          this.contractFactory,
        );
        break;
      case ModuleName.LockUpTransferManager:
        moduleWrapper = new LockUpTransferManagerWrapper(
          this.web3Wrapper,
          this.contractFactory.getLockUpTransferManagerContract(params.address),
          this.contractFactory,
        );
        break;
      case ModuleName.BlacklistTransferManager:
        moduleWrapper = new BlacklistTransferManagerWrapper(
          this.web3Wrapper,
          this.contractFactory.getBlacklistTransferManagerContract(params.address),
          this.contractFactory,
        );
        break;
      case ModuleName.VolumeRestrictionTM:
        moduleWrapper = new VolumeRestrictionTransferManagerWrapper(
          this.web3Wrapper,
          this.contractFactory.getVolumeRestrictionTMContract(params.address),
          this.contractFactory,
        );
        break;
      // STOs
      case ModuleName.CappedSTO: {
        if (version === ContractVersion.V3_0_0) {
          moduleWrapper = new CappedSTO_3_0_0(
            this.web3Wrapper,
            this.contractFactory.getCappedSTOContract(params.address, version),
            this.contractFactory,
          );
        } else {
          moduleWrapper = new CappedSTO_3_1_0(
            this.web3Wrapper,
            this.contractFactory.getCappedSTOContract(params.address, version),
            this.contractFactory,
          );
        }
        break;
      }
      case ModuleName.UsdTieredSTO: {
        if (version === ContractVersion.V3_0_0) {
          moduleWrapper = new USDTieredSTO_3_0_0(
            this.web3Wrapper,
            this.contractFactory.getUSDTieredSTOContract(params.address, version),
            this.contractFactory,
          );
        } else {
          moduleWrapper = new USDTieredSTO_3_1_0(
            this.web3Wrapper,
            this.contractFactory.getUSDTieredSTOContract(params.address, version),
            this.contractFactory,
          );
        }        
        break;
      }
      // Checkpoint
      case ModuleName.ERC20DividendCheckpoint:
        moduleWrapper = new ERC20DividendCheckpointWrapper(
          this.web3Wrapper,
          this.contractFactory.getERC20DividendCheckpointContract(params.address),
          this.contractFactory,
        );
        break;
      case ModuleName.EtherDividendCheckpoint:
        moduleWrapper = new EtherDividendCheckpointWrapper(
          this.web3Wrapper,
          this.contractFactory.getEtherDividendCheckpointContract(params.address),
          this.contractFactory,
        );
        break;
      // Wallet
      case ModuleName.VestingEscrowWallet:
        moduleWrapper = new VestingEscrowWalletWrapper(
          this.web3Wrapper,
          this.contractFactory.getVestingEscrowWalletContract(params.address),
          this.contractFactory,
        );
        break;
      // Burn
      default:
        // TODO: Typed error here
        throw new PolymathError({ code: ErrorCode.NotFound });
    }

    // validate module
    if (await moduleWrapper.isValidModule()) {
      return moduleWrapper;
    }

    // TODO: Typed error here
    throw new PolymathError({ code: ErrorCode.InvalidData, message: 'Invalid module' });
  };
}
