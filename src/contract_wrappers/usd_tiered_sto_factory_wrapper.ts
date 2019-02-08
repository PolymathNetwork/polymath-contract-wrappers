import { USDTieredSTOFactoryContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { USDTieredSTOFactory } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import { BigNumber } from '@0x/utils';

/**
 * This class includes the functionality related to interacting with the USDTieredSTOFactory contract.
 */
export class USDTieredSTOFactoryWrapper extends ContractWrapper {
  public abi: ContractAbi = USDTieredSTOFactory.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private usdTieredSTOFactoryContract: Promise<USDTieredSTOFactoryContract>;
  /**
   * Instantiate USDTieredSTOFactoryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param networkId Desired networkId
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this.polymathRegistry = polymathRegistry;
    this.usdTieredSTOFactoryContract = this._getUSDTieredSTOFactoryContract();
  }

  /**
   * Get the setup cost of the module
   */
  public async getSetupCost(): Promise<BigNumber> {
    return await (await this.usdTieredSTOFactoryContract).getSetupCost.callAsync();
  }

  private async _getUSDTieredSTOFactoryContract(): Promise<USDTieredSTOFactoryContract> {
    return new USDTieredSTOFactoryContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'USDTieredSTOFactory',
      }),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
  }
}