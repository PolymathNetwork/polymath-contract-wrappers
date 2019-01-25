import { SecurityTokenContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { SecurityToken } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';

import { _getDefaultContractAddresses } from '../utils/contract_addresses';

import { ContractWrapper } from './contract_wrapper';

/**
 * This class includes the functionality related to interacting with the SecurityToken contract.
 */
export class SecurityTokenWrapper extends ContractWrapper {
  public abi: ContractAbi = SecurityToken.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private securityTokenContractIfExists?: SecurityTokenContract;
  /**
   * Instantiate SecurityTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param networkId Desired networkId
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this.polymathRegistry = polymathRegistry;
  }

  /**
   * Returns a list of modules that match the provided module type
   * @param type type of the module
   * @return address[] list of modules with this type
   */
  public async getModulesByType(type: number): Promise<string[]> {
    const SecurityTokenContractInstance = await this._getSecurityTokenContract();
    return SecurityTokenContractInstance.getModulesByType.callAsync(
      type,
    );
  }

  /**
   * @param module address of the module
   * @return Returns the data associated to a module
   */
  public async getModule(module: string): Promise<[string, string, string, boolean, BigNumber[]]> {
    const SecurityTokenContractInstance = await this._getSecurityTokenContract();
    return SecurityTokenContractInstance.getModule.callAsync(module);
  }

  private async _getSecurityTokenContract(): Promise<SecurityTokenContract> {
    if (!_.isUndefined(this.securityTokenContractIfExists)) {
      return this.securityTokenContractIfExists;
    }
    const contractInstance = new SecurityTokenContract(
      this.abi,
      await this.polymathRegistry.getAddress('SecurityToken'),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
    this.securityTokenContractIfExists = contractInstance;
    return this.securityTokenContractIfExists;
  }
}
