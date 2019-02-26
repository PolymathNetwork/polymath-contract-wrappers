import { ModuleFactoryContract } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { ModuleFactory } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';

/**
 * This class includes the functionality related to interacting with the ModuleFactory contract.
 */
export class ModuleFactoryWrapper extends ContractWrapper {
  public abi: ContractAbi = ModuleFactory.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private moduleFactoryContract: Promise<ModuleFactoryContract>;
  /**
   * Instantiate ModuleFactoryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this.polymathRegistry = polymathRegistry;
    this.moduleFactoryContract = this._getModuleFactoryContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.moduleFactoryContract).address;
  }

  /**
   * Get the name of the Module
   */
  public getName = async (): Promise<string> => {
    return await (await this.moduleFactoryContract).name.callAsync();
  }

  private async _getModuleFactoryContract(): Promise<ModuleFactoryContract> {
    return new ModuleFactoryContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'ModuleFactory',
      }),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
