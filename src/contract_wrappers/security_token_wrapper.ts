import { SecurityTokenContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { SecurityToken } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
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

  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this.polymathRegistry = polymathRegistry;
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
