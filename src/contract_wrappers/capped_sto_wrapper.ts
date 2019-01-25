import { CappedSTOContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { CappedSTO } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import * as _ from 'lodash';

import { _getDefaultContractAddresses } from '../utils/contract_addresses';

import { ContractWrapper } from './contract_wrapper';

/**
 * This class includes the functionality related to interacting with the CappedSTO contract.
 */
export class CappedSTOWrapper extends ContractWrapper {
  public abi: ContractAbi = CappedSTO.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private cappedSTOContractIfExists?: CappedSTOContract;
  /**
   * Instantiate CappedSTOWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param networkId Desired networkId
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this.polymathRegistry = polymathRegistry;
  }

  private async _getCappedSTOContract(): Promise<CappedSTOContract> {
    if (!_.isUndefined(this.cappedSTOContractIfExists)) {
      return this.cappedSTOContractIfExists;
    }
    const contractInstance = new CappedSTOContract(
      this.abi,
      await this.polymathRegistry.getAddress('CappedSTO'),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
    this.cappedSTOContractIfExists = contractInstance;
    return this.cappedSTOContractIfExists;
  }
}
