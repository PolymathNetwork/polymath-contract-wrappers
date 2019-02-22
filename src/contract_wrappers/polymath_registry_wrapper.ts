import { PolymathRegistryContract } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistry } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { assert } from '../utils/assert';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import { IGetAddress, IContractAddresses, NetworkId } from '../types';
import { _getDefaultContractAddresses } from '../addresses';

enum Contracts {
  PolyToken = "PolyToken",
  ModuleRegistry = "ModuleRegistry",
  FeatureRegistry = "FeatureRegistry",
  SecurityTokenRegistry = "SecurityTokenRegistry",
  PolyUsdOracle = "PolyUsdOracle",
  EthUsdOracle = "EthUsdOracle"
}

/**
 * This class includes the functionality related to interacting with the PolymathRegistry contract.
 */
export class PolymathRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = PolymathRegistry.abi;
  public address?: IContractAddresses;
  private polymathRegistryContract: Promise<PolymathRegistryContract>;

  /**
   * Instantiate PolymathRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param address The address of the PolymathRegistry contract.
   */
  constructor(web3Wrapper: Web3Wrapper, registryAddress?: IContractAddresses/*, address: string*/) {
    super(web3Wrapper);
    this.address = registryAddress;
    this.polymathRegistryContract = this._getPolymathRegistryContract();
  }

  /**
   * Gets the contract address
   * @return address string
   */
  public async getAddress(params: IGetAddress): Promise<string> {
    assert.isString('contractName', params.contractName);
    const address = await (await this.polymathRegistryContract).getAddress.callAsync(
      params.contractName,
    );
    return address;
  }

  /**
   * Gets the PolyToken contract address
   * @return address string
   */
  public async getPolyTokenAddress(): Promise<string> {
    return await this.getAddress({
      contractName: Contracts.PolyToken,
    });
  }

  /**
   * Gets the ModuleRegistry contract address
   * @return address string
   */
  public async getModuleRegistryAddress(): Promise<string> {
    return await this.getAddress({
      contractName: Contracts.ModuleRegistry,
    });
  }

  /**
   * Gets the FeatureRegistry contract address
   * @return address string
   */
  public async getFeatureRegistryAddress(): Promise<string> {
    return await this.getAddress({
      contractName: Contracts.FeatureRegistry,
    });
  }

  /**
   * Gets the SecurityTokenRegistry contract address
   * @return address string
   */
  public async getSecurityTokenRegistryAddress(): Promise<string> {
    return await this.getAddress({
      contractName: Contracts.SecurityTokenRegistry,
    });
  }

  /**
   * Gets the PolyUsdOracle contract address
   * @return address string
   */
  public async getPolyUsdOracleAddress(): Promise<string> {
    return await this.getAddress({
      contractName: Contracts.PolyUsdOracle,
    });
  }

  /**
   * Gets the EthUsdOracle contract address
   * @return address string
   */
  public async getEthUsdOracleAddress(): Promise<string> {
    return await this.getAddress({
      contractName: Contracts.EthUsdOracle,
    });
  }

  /**
   * Get the id of the underlying ethereum network your provider is connected to.
   */
  public async getNetworkId(): Promise<Number> {
    return Number(await this.web3Wrapper.getNetworkIdAsync());
  }

  private async _addressResolver(): Promise<IContractAddresses> {
    const networkId: NetworkId = <NetworkId> await this.getNetworkId();
    return  _.isUndefined(this.address)
    ? _getDefaultContractAddresses(networkId)
    : this.address;
  }

  private async _getPolymathRegistryContract(): Promise<PolymathRegistryContract> {
    return new PolymathRegistryContract(
      this.abi,
      (await this._addressResolver()).polymathRegistry,
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
  }
}
