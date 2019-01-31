import { USDTieredSTOFactoryContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { USDTieredSTOFactory } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import * as _ from 'lodash';

import { _getDefaultContractAddresses } from '../utils/contract_addresses';

import { ContractWrapper } from './contract_wrapper';
import { BigNumber } from '@0x/utils';

/**
 * This class includes the functionality related to interacting with the USDTieredSTOFactory contract.
 */
export class USDTieredSTOFactoryWrapper extends ContractWrapper {
  public abi: ContractAbi = USDTieredSTOFactory.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private usdTieredSTOFactoryContractIfExists?: USDTieredSTOFactoryContract;
  /**
   * Instantiate USDTieredSTOFactoryWrapper
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
    const USDTieredSTOFactoryContractInstance = await this._getUSDTieredSTOFactoryContract();
    return await USDTieredSTOFactoryContractInstance.getSetupCost.callAsync();
  }

  private async _getUSDTieredSTOFactoryContract(): Promise<USDTieredSTOFactoryContract> {
    if (!_.isUndefined(this.usdTieredSTOFactoryContractIfExists)) {
      return this.usdTieredSTOFactoryContractIfExists;
    }
    const contractInstance = new USDTieredSTOFactoryContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'USDTieredSTOFactory',
      }),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
    this.usdTieredSTOFactoryContractIfExists = contractInstance;
    return this.usdTieredSTOFactoryContractIfExists;
  }
}
