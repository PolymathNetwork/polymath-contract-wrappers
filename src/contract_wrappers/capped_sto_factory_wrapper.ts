import { CappedSTOFactoryContract } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { CappedSTOFactory } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import { BigNumber } from '@0x/utils';

/**
 * This class includes the functionality related to interacting with the CappedSTOFactory contract.
 */
export class CappedSTOFactoryWrapper extends ContractWrapper {
  public abi: ContractAbi = CappedSTOFactory.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private cappedSTOFactoryContract: Promise<CappedSTOFactoryContract>;
  /**
   * Instantiate CappedSTOFactoryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param networkId Desired networkId
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this.polymathRegistry = polymathRegistry;
    this.cappedSTOFactoryContract = this._getCappedSTOFactoryContract();
  }

  /**
   * Get the setup cost of the module
   */
  public async getSetupCost(): Promise<BigNumber> {
    return await (await this.cappedSTOFactoryContract).getSetupCost.callAsync();
  }

  private async _getCappedSTOFactoryContract(): Promise<CappedSTOFactoryContract> {
    return new CappedSTOFactoryContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'CappedSTOFactory',
      }),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
  }
}
