import { TxData, Provider } from 'ethereum-types';
import {
  ERC20DividendCheckpointContract,
  ModuleContract,
  ModuleFactoryContract,
  EtherDividendCheckpointContract,
  ERC20DetailedContract,
  ISecurityTokenContract,
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
  ISecurityTokenRegistryContract,
  PolymathRegistryContract,
} from '@polymathnetwork/abi-wrappers';
import {
  ERC20DividendCheckpoint,
  Module,
  ModuleFactory,
  EtherDividendCheckpoint,
  ERC20Detailed,
  ISecurityToken,
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
  ISecurityTokenRegistry,
  PolymathRegistry,
} from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { PolymathContracts, NetworkId } from '../types';
import assert from '../utils/assert';
import getDefaultContractAddresses from '../utils/addresses';

async function getPolymathRegistryContract(web3Wrapper: Web3Wrapper, address?: string) {
  return new PolymathRegistryContract(
    PolymathRegistry.abi,
    address || (await getDefaultContractAddresses((await web3Wrapper.getNetworkIdAsync()) as NetworkId)), // for optional address
    web3Wrapper.getProvider(),
    web3Wrapper.getContractDefaults(),
  );
}

export default class ContractFactory {
  private web3Wrapper: Web3Wrapper;

  private provider: Provider;

  private polymathRegistry: Promise<PolymathRegistryContract>;

  private contractDefaults: Partial<TxData>;

  public constructor(web3Wrapper: Web3Wrapper, polymathRegistryAddress?: string) {
    this.web3Wrapper = web3Wrapper;
    this.provider = web3Wrapper.getProvider() as Provider;
    this.contractDefaults = this.web3Wrapper.getContractDefaults();
    this.polymathRegistry = getPolymathRegistryContract(web3Wrapper, polymathRegistryAddress);
  }

  public async getModuleContract(address: string): Promise<ModuleContract> {
    assert.isETHAddressHex('address', address);
    return new ModuleContract(Module.abi, address, this.provider, this.contractDefaults);
  }

  public async getERC20DividendCheckpointContract(address: string): Promise<ERC20DividendCheckpointContract> {
    assert.isETHAddressHex('address', address);
    return new ERC20DividendCheckpointContract(
      ERC20DividendCheckpoint.abi,
      address,
      this.provider,
      this.contractDefaults,
    );
  }

  public async getPolymathRegistryContract(): Promise<PolymathRegistryContract> {
    return this.polymathRegistry;
  }

  public async getModuleFactoryContract(address: string): Promise<ModuleFactoryContract> {
    assert.isETHAddressHex('address', address);
    return new ModuleFactoryContract(ModuleFactory.abi, address, this.provider, this.contractDefaults);
  }

  public async getEtherDividendCheckpointContract(address: string): Promise<EtherDividendCheckpointContract> {
    assert.isETHAddressHex('address', address);
    return new EtherDividendCheckpointContract(
      EtherDividendCheckpoint.abi,
      address,
      this.provider,
      this.contractDefaults,
    );
  }

  public async getERC20DetailedContract(address: string): Promise<ERC20DetailedContract> {
    assert.isETHAddressHex('address', address);
    return new ERC20DetailedContract(ERC20Detailed.abi, address, this.provider, this.contractDefaults);
  }

  public async getAlternativeERC20Contract(address: string): Promise<ERC20DetailedContract> {
    assert.isETHAddressHex('address', address);
    return new ERC20DetailedContract(ERC20Detailed.abi, address, this.provider, this.contractDefaults);
  }

  public async getSecurityTokenContract(address: string): Promise<ISecurityTokenContract> {
    assert.isETHAddressHex('address', address);
    return new ISecurityTokenContract(ISecurityToken.abi, address, this.provider, this.contractDefaults);
  }

  public async getPolyTokenFaucetContract(): Promise<PolyTokenFaucetContract> {
    return new PolyTokenFaucetContract(
      PolyTokenFaucet.abi,
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContracts.polyToken),
      this.provider,
      this.contractDefaults,
    );
  }

  public async getPolyTokenContract(): Promise<PolyTokenContract> {
    return new PolyTokenContract(
      PolyToken.abi,
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContracts.polyToken),
      this.provider,
      this.contractDefaults,
    );
  }

  public async getGeneralPermissionManagerContract(address: string): Promise<GeneralPermissionManagerContract> {
    assert.isETHAddressHex('address', address);
    return new GeneralPermissionManagerContract(
      GeneralPermissionManager.abi,
      address,
      this.provider,
      this.contractDefaults,
    );
  }

  public async getCappedSTOFactoryContract(address: string): Promise<CappedSTOFactoryContract> {
    return new CappedSTOFactoryContract(CappedSTOFactory.abi, address, this.provider, this.contractDefaults);
  }

  public async getCappedSTOContract(address: string): Promise<CappedSTOContract> {
    assert.isETHAddressHex('address', address);
    return new CappedSTOContract(CappedSTO.abi, address, this.provider, this.contractDefaults);
  }

  public async getUSDTieredSTOFactoryContract(address: string): Promise<USDTieredSTOFactoryContract> {
    assert.isETHAddressHex('address', address);
    return new USDTieredSTOFactoryContract(USDTieredSTOFactory.abi, address, this.provider, this.contractDefaults);
  }

  public async getUSDTieredSTOContract(address: string): Promise<USDTieredSTOContract> {
    assert.isETHAddressHex('address', address);
    return new USDTieredSTOContract(USDTieredSTO.abi, address, this.provider, this.contractDefaults);
  }

  public async getCountTransferManagerContract(address: string): Promise<CountTransferManagerContract> {
    assert.isETHAddressHex('address', address);
    return new CountTransferManagerContract(CountTransferManager.abi, address, this.provider, this.contractDefaults);
  }

  public async getGeneralTransferManagerContract(address: string): Promise<GeneralTransferManagerContract> {
    assert.isETHAddressHex('address', address);
    return new GeneralTransferManagerContract(
      GeneralTransferManager.abi,
      address,
      this.provider,
      this.contractDefaults,
    );
  }

  public async getManualApprovalTransferManagerContract(
    address: string,
  ): Promise<ManualApprovalTransferManagerContract> {
    assert.isETHAddressHex('address', address);
    return new ManualApprovalTransferManagerContract(
      ManualApprovalTransferManager.abi,
      address,
      this.provider,
      this.contractDefaults,
    );
  }

  public async getPercentageTransferManagerContract(address: string): Promise<PercentageTransferManagerContract> {
    assert.isETHAddressHex('address', address);
    return new PercentageTransferManagerContract(
      PercentageTransferManager.abi,
      address,
      this.provider,
      this.contractDefaults,
    );
  }

  public async getVolumeRestrictionTMContract(address: string): Promise<VolumeRestrictionTMContract> {
    assert.isETHAddressHex('address', address);
    return new VolumeRestrictionTMContract(
      VolumeRestrictionTransferManager.abi,
      address,
      this.provider,
      this.contractDefaults,
    );
  }

  public async getFeatureRegistryContract(): Promise<FeatureRegistryContract> {
    return new FeatureRegistryContract(
      FeatureRegistry.abi,
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContracts.featureRegistry),
      this.provider,
      this.contractDefaults,
    );
  }

  public async getModuleRegistryContract(): Promise<ModuleRegistryContract> {
    return new ModuleRegistryContract(
      ModuleRegistry.abi,
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContracts.moduleRegistry),
      this.provider,
      this.contractDefaults,
    );
  }

  public async getSecurityTokenRegistryContract(): Promise<ISecurityTokenRegistryContract> {
    return new ISecurityTokenRegistryContract(
      ISecurityTokenRegistry.abi,
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContracts.securityTokenRegistry),
      this.provider,
      this.contractDefaults,
    );
  }
}
