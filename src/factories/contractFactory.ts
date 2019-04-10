import { Provider, TxData } from "ethereum-types";

import { ERC20DividendCheckpointContract,
    ModuleContract,
    ModuleFactoryContract,
    EtherDividendCheckpointContract,
    DetailedERC20Contract,
    SecurityTokenContract,
    PolyTokenContract,
    GeneralPermissionManagerContract,
    PolyTokenFaucetContract,
    CappedSTOContract,
    CappedSTOFactoryContract,
    USDTieredSTOFactoryContract,
    USDTieredSTOContract,
    CountTransferManagerContract,
    GeneralTransferManagerContract,
    ManualApprovalTransferManagerContract,
    PercentageTransferManagerContract,
    VolumeRestrictionTMContract,
    FeatureRegistryContract,
    ModuleRegistryContract,
    SecurityTokenRegistryContract} from "@polymathnetwork/abi-wrappers";

import { ERC20DividendCheckpoint,
    Module,
    ModuleFactory,
    EtherDividendCheckpoint,
    DetailedERC20,
    SecurityToken,
    PolyToken,
    GeneralPermissionManager,
    PolyTokenFaucet,
    CappedSTO,
    CappedSTOFactory,
    USDTieredSTOFactory,
    USDTieredSTO,
    CountTransferManager,
    GeneralTransferManager,
    ManualApprovalTransferManager,
    PercentageTransferManager,
    VolumeRestrictionTransferManager,
    FeatureRegistry,
    ModuleRegistry,
    SecurityTokenRegistry} from "@polymathnetwork/contract-artifacts";
import {PolymathRegistryWrapper} from '../contract_wrappers/registries/polymath_registry_wrapper';

export class ContractFactory {
  private _provider: Provider;
  private _polymathRegistry: PolymathRegistryWrapper;
  private _contractDefaults: Partial<TxData>;

  constructor(provider: Provider, contractDefaults: Partial<TxData>, polymathRegistry: PolymathRegistryWrapper) {
    this._provider = provider;
    this._polymathRegistry = polymathRegistry;
    this._contractDefaults = contractDefaults;
  }

  public async getModuleContract(address: string): Promise<ModuleContract> {
    return new ModuleContract(
      Module.abi,
      address,
      this._provider,
      this._contractDefaults,
    );
  }

  public async getERC20DividendCheckpointContract(address: string): Promise<ERC20DividendCheckpointContract> {
    return new ERC20DividendCheckpointContract(
      ERC20DividendCheckpoint.abi,
      address,
      this._provider,
      this._contractDefaults,
    );
  }

  public async getModuleFactoryContract(address: string): Promise<ModuleFactoryContract> {
    return new ModuleFactoryContract(
        ModuleFactory.abi,
        address,
        this._provider,
        this._contractDefaults,
    );
  }

  public async _getEtherDividendCheckpointContract(address: string): Promise<EtherDividendCheckpointContract> {
    return new EtherDividendCheckpointContract(
        EtherDividendCheckpoint.abi,
        address,
        this._provider,
        this._contractDefaults,
    );
  }

  public async _getDetailedERC20Contract(address: string): Promise<DetailedERC20Contract> {
    return new DetailedERC20Contract(
        DetailedERC20.abi,
        address,
        this._provider,
        this._contractDefaults,
    );
  }

  public async _getSecurityTokenContract(address: string): Promise<SecurityTokenContract> {
    return new SecurityTokenContract(
        (SecurityToken as any).abi,
        address,
        this._provider,
        this._contractDefaults,
    );
  }

  public async _getPolyTokenFaucetContract(): Promise<PolyTokenFaucetContract> {
    return new PolyTokenFaucetContract(
        PolyTokenFaucet.abi,
        await this._polymathRegistry.getPolyTokenAddress(),
        this._provider,
        this._contractDefaults,
    );
  }

  public async _getPolyTokenContract(): Promise<PolyTokenContract> {
    return new PolyTokenContract(
        PolyToken.abi,
        await this._polymathRegistry.getPolyTokenAddress(),
        this._provider,
        this._contractDefaults,
    );
  }

  public async _getGeneralPermissionManagerContract(address: string): Promise<GeneralPermissionManagerContract> {
    return new GeneralPermissionManagerContract(
        GeneralPermissionManager.abi,
        address,
        this._provider,
        this._contractDefaults,
    );
  }

  public async _getCappedSTOFactoryContract(): Promise<CappedSTOFactoryContract> {
        return new CappedSTOFactoryContract(
            CappedSTOFactory.abi,
            await this._polymathRegistry.getAddress({
                contractName: 'CappedSTOFactory',
            }),
            this._provider,
            this._contractDefaults,
        );
    }

  public async _getCappedSTOContract(address: string): Promise<CappedSTOContract> {
        return new CappedSTOContract(
            CappedSTO.abi,
            address,
            this._provider,
            this._contractDefaults,
        );
    }

  public async _getUSDTieredSTOFactoryContract(address: string): Promise<USDTieredSTOFactoryContract> {
        return new USDTieredSTOFactoryContract(
            USDTieredSTOFactory.abi,
            address,
            this._provider,
            this._contractDefaults,
        );
    }

  public async _getUSDTieredSTOContract(address: string): Promise<USDTieredSTOContract> {
        return new USDTieredSTOContract(
            (USDTieredSTO as any).abi,
            address,
            this._provider,
            this._contractDefaults,
        );
    }

    public async _getCountTransferManagerContract(address: string): Promise<CountTransferManagerContract> {
        return new CountTransferManagerContract(
            CountTransferManager.abi,
            address,
            this._provider,
            this._contractDefaults,
        );
    }

    public async _getGeneralTransferManagerContract(address: string): Promise<GeneralTransferManagerContract> {
        return new GeneralTransferManagerContract(
            GeneralTransferManager.abi,
            address,
            this._provider,
            this._contractDefaults,
        );
    }

    public async _getManualApprovalTransferManagerContract(address: string): Promise<ManualApprovalTransferManagerContract> {
        return new ManualApprovalTransferManagerContract(
            ManualApprovalTransferManager.abi,
            address,
            this._provider,
            this._contractDefaults,
        );
    }

    public async _getPercentageTransferManagerContract(address: string): Promise<PercentageTransferManagerContract> {
        return new PercentageTransferManagerContract(
            PercentageTransferManager.abi,
            address,
            this._provider,
            this._contractDefaults,
        );
    }

    public async _getVolumeRestrictionTMContract(address: string): Promise<VolumeRestrictionTMContract> {
        return new VolumeRestrictionTMContract(
            (VolumeRestrictionTransferManager as any).abi,
            address,
            this._provider,
            this._contractDefaults,
        );
    }

    public async _getFeatureRegistryContract(): Promise<FeatureRegistryContract> {
        return new FeatureRegistryContract(
            FeatureRegistry.abi,
            await this._polymathRegistry.getFeatureRegistryAddress(),
            this._provider,
            this._contractDefaults,
        );
    }

    public async _getModuleRegistryContract(): Promise<ModuleRegistryContract> {
        return new ModuleRegistryContract(
            ModuleRegistry.abi,
            await this._polymathRegistry.getModuleRegistryAddress(),
            this._provider,
            this._contractDefaults,
        );
    }

    public async _getSecurityTokenRegistryContract(): Promise<SecurityTokenRegistryContract> {
        return new SecurityTokenRegistryContract(
            (SecurityTokenRegistry as any).abi,
            await this._polymathRegistry.getSecurityTokenRegistryAddress(),
            this._provider,
            this._contractDefaults,
        );
    }
}
