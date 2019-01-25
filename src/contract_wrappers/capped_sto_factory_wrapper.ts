import { CappedSTOFactoryContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { CappedSTOFactory } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import * as _ from 'lodash';

import { _getDefaultContractAddresses } from '../utils/contract_addresses';

import { ContractWrapper } from './contract_wrapper';

/**
 * This class includes the functionality related to interacting with the CappedSTOFactory contract.
 */
export class CappedSTOFactoryWrapper extends ContractWrapper {
  public abi: ContractAbi = CappedSTOFactory.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private cappedSTOFactoryContractIfExists?: CappedSTOFactoryContract;
  /**
   * Instantiate CappedSTOFactoryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param networkId Desired networkId
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this.polymathRegistry = polymathRegistry;
  }

  private async _getCappedSTOFactoryContract(): Promise<CappedSTOFactoryContract> {
    if (!_.isUndefined(this.cappedSTOFactoryContractIfExists)) {
      return this.cappedSTOFactoryContractIfExists;
    }
    const contractInstance = new CappedSTOFactoryContract(
      this.abi,
      await this.polymathRegistry.getAddress('CappedSTOFactory'),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
    this.cappedSTOFactoryContractIfExists = contractInstance;
    return this.cappedSTOFactoryContractIfExists;
  }
}
