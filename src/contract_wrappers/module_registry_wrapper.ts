import { ModuleRegistryContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { ModuleRegistry } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { IModulesByTypeAndToken } from '../types';
import * as _ from 'lodash';

import { _getDefaultContractAddresses } from '../utils/contract_addresses';

import { ContractWrapper } from './contract_wrapper';

/**
 * This class includes the functionality related to interacting with the ModuleRegistry contract.
 */
export class ModuleRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = ModuleRegistry.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private moduleRegistryContractIfExists?: ModuleRegistryContract;
  /**
   * Instantiate ModuleRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param networkId Desired networkId
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this.polymathRegistry = polymathRegistry;
  }

  /**
   * Returns the list of available Module factory addresses of a particular type for a given token.
   * @return address array that contains the list of available addresses of module factory contracts.
   */
  public async getModulesByTypeAndToken(params: IModulesByTypeAndToken): Promise<string[]> {
    const ModuleRegistryContractInstance = await this._getModuleRegistryContract();
    return await ModuleRegistryContractInstance.getModulesByTypeAndToken.callAsync(
      params.moduleType,
      params.securityToken,
    );
  }

  private async _getModuleRegistryContract(): Promise<ModuleRegistryContract> {
    if (!_.isUndefined(this.moduleRegistryContractIfExists)) {
      return this.moduleRegistryContractIfExists;
    }
    const contractInstance = new ModuleRegistryContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'ModuleRegistry',
      }),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
    this.moduleRegistryContractIfExists = contractInstance;
    return this.moduleRegistryContractIfExists;
  }
}
