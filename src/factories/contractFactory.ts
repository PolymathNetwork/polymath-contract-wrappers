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
  LockUpTransferManagerContract,
  VolumeRestrictionTMContract,
  FeatureRegistryContract,
  ModuleRegistryContract,
  ISecurityTokenRegistryContract,
  PolymathRegistryContract,
  Web3Wrapper,
  CallData,
  Provider,
  ContractAbi,
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

  private abiArray: ContractAbi[];

  private provider: Provider;

  private polymathRegistry: Promise<PolymathRegistryContract>;

  private contractDefaults: Partial<CallData> | undefined;

  public constructor(web3Wrapper: Web3Wrapper, abiArray: ContractAbi[], polymathRegistryAddress?: string) {
    this.web3Wrapper = web3Wrapper;
    this.abiArray = abiArray;
    this.provider = web3Wrapper.getProvider() as Provider;
    this.contractDefaults = this.web3Wrapper.getContractDefaults();
    this.polymathRegistry = getPolymathRegistryContract(web3Wrapper, polymathRegistryAddress);
  }

  public async getModuleContract(address: string): Promise<ModuleContract> {
    assert.isETHAddressHex('address', address);
    const contract = new ModuleContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getERC20DividendCheckpointContract(address: string): Promise<ERC20DividendCheckpointContract> {
    assert.isETHAddressHex('address', address);
    const contract = new ERC20DividendCheckpointContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getPolymathRegistryContract(): Promise<PolymathRegistryContract> {
    const contract = await this.polymathRegistry;
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getModuleFactoryContract(address: string): Promise<ModuleFactoryContract> {
    assert.isETHAddressHex('address', address);
    const contract = new ModuleFactoryContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getEtherDividendCheckpointContract(address: string): Promise<EtherDividendCheckpointContract> {
    assert.isETHAddressHex('address', address);
    const contract = new EtherDividendCheckpointContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getERC20DetailedContract(address: string): Promise<ERC20DetailedContract> {
    assert.isETHAddressHex('address', address);
    const contract = new ERC20DetailedContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getAlternativeERC20Contract(address: string): Promise<ERC20DetailedContract> {
    assert.isETHAddressHex('address', address);
    const contract = new ERC20DetailedContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getSecurityTokenContract(address: string): Promise<ISecurityTokenContract> {
    assert.isETHAddressHex('address', address);
    const contract = new ISecurityTokenContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getPolyTokenFaucetContract(): Promise<PolyTokenFaucetContract> {
    const contract = new PolyTokenFaucetContract(
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContract.PolyToken),
      this.provider,
      this.contractDefaults,
    );
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getPolyTokenContract(): Promise<PolyTokenContract> {
    const contract = new PolyTokenContract(
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContract.PolyToken),
      this.provider,
      this.contractDefaults,
    );
    this.abiArray.forEach(
      (abi): void => {
        
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getGeneralPermissionManagerContract(address: string): Promise<GeneralPermissionManagerContract> {
    assert.isETHAddressHex('address', address);
    const contract = new GeneralPermissionManagerContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getCappedSTOFactoryContract(address: string): Promise<CappedSTOFactoryContract> {
    const contract = new CappedSTOFactoryContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getCappedSTOContract(address: string): Promise<CappedSTOContract> {
    assert.isETHAddressHex('address', address);
    const contract = new CappedSTOContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getUSDTieredSTOFactoryContract(address: string): Promise<USDTieredSTOFactoryContract> {
    assert.isETHAddressHex('address', address);
    const contract = new USDTieredSTOFactoryContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getUSDTieredSTOContract(address: string): Promise<USDTieredSTOContract> {
    assert.isETHAddressHex('address', address);
    const contract = new USDTieredSTOContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getCountTransferManagerContract(address: string): Promise<CountTransferManagerContract> {
    assert.isETHAddressHex('address', address);
    const contract = new CountTransferManagerContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getGeneralTransferManagerContract(address: string): Promise<GeneralTransferManagerContract> {
    assert.isETHAddressHex('address', address);
    const contract = new GeneralTransferManagerContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getManualApprovalTransferManagerContract(
    address: string,
  ): Promise<ManualApprovalTransferManagerContract> {
    assert.isETHAddressHex('address', address);
    const contract = new ManualApprovalTransferManagerContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getPercentageTransferManagerContract(address: string): Promise<PercentageTransferManagerContract> {
    assert.isETHAddressHex('address', address);
    const contract = new PercentageTransferManagerContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getLockUpTransferManagerContract(address: string): Promise<LockUpTransferManagerContract> {
    assert.isETHAddressHex('address', address);
    return new LockUpTransferManagerContract(address, this.provider, this.contractDefaults);
  }

  public async getVolumeRestrictionTMContract(address: string): Promise<VolumeRestrictionTMContract> {
    assert.isETHAddressHex('address', address);
    const contract = new VolumeRestrictionTMContract(address, this.provider, this.contractDefaults);
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getFeatureRegistryContract(): Promise<FeatureRegistryContract> {
    const contract = new FeatureRegistryContract(
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContract.FeatureRegistry),
      this.provider,
      this.contractDefaults,
    );
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getModuleRegistryContract(): Promise<ModuleRegistryContract> {
    const contract = new ModuleRegistryContract(
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContract.ModuleRegistry),
      this.provider,
      this.contractDefaults,
    );
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }

  public async getSecurityTokenRegistryContract(): Promise<ISecurityTokenRegistryContract> {
    const contract = new ISecurityTokenRegistryContract(
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContract.SecurityTokenRegistry),
      this.provider,
      this.contractDefaults,
    );
    this.abiArray.forEach(
      (abi): void => {
        contract.addABItoDecoder(abi);
      },
    );
    return contract;
  }
}
