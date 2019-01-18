import { SecurityTokenContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { SecurityToken } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { assert } from '../utils/assert';
import * as _ from 'lodash';

import { _getDefaultContractAddresses } from '../utils/contract_addresses';

import { ContractWrapper } from './contract_wrapper';

export class SecurityTokenWrapper extends ContractWrapper {
  public abi: ContractAbi = SecurityToken.abi;
  private _polymathRegistry: PolymathRegistryWrapper;
  private _securityTokenContractIfExists?: SecurityTokenContract;

  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this._polymathRegistry = polymathRegistry;
  }

  private async _getSecurityTokenContract(): Promise<SecurityTokenContract> {
    if (!_.isUndefined(this._securityTokenContractIfExists)) {
      return this._securityTokenContractIfExists;
    }
    const contractInstance = new SecurityTokenContract(
      this.abi,
      await this._polymathRegistry.getAddress("SecurityToken"),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
    this._securityTokenContractIfExists = contractInstance;
    return this._securityTokenContractIfExists;
  }
}