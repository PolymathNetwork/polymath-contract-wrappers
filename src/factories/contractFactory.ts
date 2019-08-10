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
  VestingEscrowWalletContract,
  Web3Wrapper,
  CallData,
  Provider,
} from '@polymathnetwork/abi-wrappers';
import assert from '../utils/assert';
import getDefaultContractAddresses from '../utils/addresses';
import { PolymathContract, NetworkId } from '../types';

async function getPolymathRegistryContract(web3Wrapper: Web3Wrapper, address?: string) {
  return new PolymathRegistryContract(
    address || (await getDefaultContractAddresses((await web3Wrapper.getNetworkIdAsync()) as NetworkId)), // for optional address
    web3Wrapper.getProvider(),
    web3Wrapper.getContractDefaults(),
  );
}

export default class ContractFactory {
  private web3Wrapper: Web3Wrapper;

  private provider: Provider;

  private polymathRegistry: Promise<PolymathRegistryContract>;

  private contractDefaults: Partial<CallData> | undefined;

  public constructor(web3Wrapper: Web3Wrapper, polymathRegistryAddress?: string) {
    this.web3Wrapper = web3Wrapper;
    this.provider = web3Wrapper.getProvider() as Provider;
    this.contractDefaults = this.web3Wrapper.getContractDefaults();
    this.polymathRegistry = getPolymathRegistryContract(web3Wrapper, polymathRegistryAddress);
  }

  public async getModuleContract(address: string): Promise<ModuleContract> {
    assert.isETHAddressHex('address', address);
    return new ModuleContract(address, this.provider, this.contractDefaults);
  }

  public async getERC20DividendCheckpointContract(address: string): Promise<ERC20DividendCheckpointContract> {
    assert.isETHAddressHex('address', address);
    return new ERC20DividendCheckpointContract(address, this.provider, this.contractDefaults);
  }

  public async getPolymathRegistryContract(): Promise<PolymathRegistryContract> {
    return this.polymathRegistry;
  }

  public async getModuleFactoryContract(address: string): Promise<ModuleFactoryContract> {
    assert.isETHAddressHex('address', address);
    return new ModuleFactoryContract(address, this.provider, this.contractDefaults);
  }

  public async getEtherDividendCheckpointContract(address: string): Promise<EtherDividendCheckpointContract> {
    assert.isETHAddressHex('address', address);
    return new EtherDividendCheckpointContract(address, this.provider, this.contractDefaults);
  }

  public async getVestingEscrowWalletContract(address: string): Promise<VestingEscrowWalletContract> {
    assert.isETHAddressHex('address', address);
    return new VestingEscrowWalletContract(address, this.provider, this.contractDefaults);
  }

  public async getERC20DetailedContract(address: string): Promise<ERC20DetailedContract> {
    assert.isETHAddressHex('address', address);
    return new ERC20DetailedContract(address, this.provider, this.contractDefaults);
  }

  public async getAlternativeERC20Contract(address: string): Promise<ERC20DetailedContract> {
    assert.isETHAddressHex('address', address);
    return new ERC20DetailedContract(address, this.provider, this.contractDefaults);
  }

  public async getSecurityTokenContract(address: string): Promise<ISecurityTokenContract> {
    assert.isETHAddressHex('address', address);
    return new ISecurityTokenContract(address, this.provider, this.contractDefaults);
  }

  public async getPolyTokenFaucetContract(): Promise<PolyTokenFaucetContract> {
    return new PolyTokenFaucetContract(
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContract.PolyToken),
      this.provider,
      this.contractDefaults,
    );
  }

  public async getPolyTokenContract(): Promise<PolyTokenContract> {
    return new PolyTokenContract(
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContract.PolyToken),
      this.provider,
      this.contractDefaults,
    );
  }

  public async getGeneralPermissionManagerContract(address: string): Promise<GeneralPermissionManagerContract> {
    assert.isETHAddressHex('address', address);
    return new GeneralPermissionManagerContract(address, this.provider, this.contractDefaults);
  }

  public async getCappedSTOFactoryContract(address: string): Promise<CappedSTOFactoryContract> {
    return new CappedSTOFactoryContract(address, this.provider, this.contractDefaults);
  }

  public async getCappedSTOContract(address: string): Promise<CappedSTOContract> {
    assert.isETHAddressHex('address', address);
    return new CappedSTOContract(address, this.provider, this.contractDefaults);
  }

  public async getUSDTieredSTOFactoryContract(address: string): Promise<USDTieredSTOFactoryContract> {
    assert.isETHAddressHex('address', address);
    return new USDTieredSTOFactoryContract(address, this.provider, this.contractDefaults);
  }

  public async getUSDTieredSTOContract(address: string): Promise<USDTieredSTOContract> {
    assert.isETHAddressHex('address', address);
    return new USDTieredSTOContract(address, this.provider, this.contractDefaults);
  }

  public async getCountTransferManagerContract(address: string): Promise<CountTransferManagerContract> {
    assert.isETHAddressHex('address', address);
    return new CountTransferManagerContract(address, this.provider, this.contractDefaults);
  }

  public async getGeneralTransferManagerContract(address: string): Promise<GeneralTransferManagerContract> {
    assert.isETHAddressHex('address', address);
    return new GeneralTransferManagerContract(address, this.provider, this.contractDefaults);
  }

  public async getManualApprovalTransferManagerContract(
    address: string,
  ): Promise<ManualApprovalTransferManagerContract> {
    assert.isETHAddressHex('address', address);
    return new ManualApprovalTransferManagerContract(address, this.provider, this.contractDefaults);
  }

  public async getPercentageTransferManagerContract(address: string): Promise<PercentageTransferManagerContract> {
    assert.isETHAddressHex('address', address);
    return new PercentageTransferManagerContract(address, this.provider, this.contractDefaults);
  }

  public async getVolumeRestrictionTMContract(address: string): Promise<VolumeRestrictionTMContract> {
    assert.isETHAddressHex('address', address);
    return new VolumeRestrictionTMContract(address, this.provider, this.contractDefaults);
  }

  public async getFeatureRegistryContract(): Promise<FeatureRegistryContract> {
    return new FeatureRegistryContract(
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContract.FeatureRegistry),
      this.provider,
      this.contractDefaults,
    );
  }

  public async getModuleRegistryContract(): Promise<ModuleRegistryContract> {
    return new ModuleRegistryContract(
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContract.ModuleRegistry),
      this.provider,
      this.contractDefaults,
    );
  }

  public async getSecurityTokenRegistryContract(): Promise<ISecurityTokenRegistryContract> {
    return new ISecurityTokenRegistryContract(
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContract.SecurityTokenRegistry),
      this.provider,
      this.contractDefaults,
    );
  }
}
