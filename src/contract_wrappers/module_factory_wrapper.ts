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
   * @param networkId Desired networkId
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this.polymathRegistry = polymathRegistry;
    this.moduleFactoryContract = this._getModuleFactoryContract();
  }

  /**
   * Get the name of the Module
   */
  public async getName(): Promise<string> {
    return await (await this.moduleFactoryContract).name.callAsync();
  }

  private async _getModuleFactoryContract(): Promise<ModuleFactoryContract> {
    return new ModuleFactoryContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'ModuleFactory',
      }),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
  }
}
