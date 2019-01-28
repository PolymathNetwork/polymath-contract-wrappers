import { CappedSTOFactoryContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { CappedSTOFactory } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import * as _ from 'lodash';

import { _getDefaultContractAddresses } from '../utils/contract_addresses';

import { ContractWrapper } from './contract_wrapper';
import { BigNumber } from '@0x/utils';

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

  /**
   * Get the setup cost of the module
   */
  public async getSetupCost(): Promise<BigNumber> {
    const CappedSTOFactoryContractInstance = await this._getCappedSTOFactoryContract();
    return await CappedSTOFactoryContractInstance.getSetupCost.callAsync();
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
