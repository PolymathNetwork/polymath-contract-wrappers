import { FeatureRegistryContract } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { FeatureRegistry } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { IFeatureStatus } from '../types';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';

/**
 * This class includes the functionality related to interacting with the FeatureRegistry contract.
 */
export class FeatureRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = FeatureRegistry.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private featureRegistryContract: Promise<FeatureRegistryContract>;
  /**
   * Instantiate FeatureRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param networkId Desired networkId
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this.polymathRegistry = polymathRegistry;
    this.featureRegistryContract = this._getFeatureRegistryContract();
  }

  /**
   * Returns the contract address
   */
  public async getAddress(): Promise<string> {
    return (await this.featureRegistryContract).address;
  }

  /**
   * Get the status of a feature
   * @return bool
   */
  public async getFeatureStatus(params: IFeatureStatus): Promise<boolean> {
    return await (await this.featureRegistryContract).getFeatureStatus.callAsync(
        params.nameKey,
    )
  }

  private async _getFeatureRegistryContract(): Promise<FeatureRegistryContract> {
    return new FeatureRegistryContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'FeatureRegistry',
      }),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
  }
}
