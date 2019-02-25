import { FeatureRegistryContract } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { FeatureRegistry } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { IGetFeatureStatus, ISetFeatureStatus } from '../types';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';

enum Features {
  CustomModulesAllowed = "CustomModulesAllowed",
  FreezeMintingAllowed = "FreezeMintingAllowed",
}

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
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this.polymathRegistry = polymathRegistry;
    this.featureRegistryContract = this._getFeatureRegistryContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.featureRegistryContract).address;
  }

  /**
   * Get the status of a feature
   * @return bool
   */
  public getFeatureStatus = async (params: IGetFeatureStatus): Promise<boolean> => {
    return await (await this.featureRegistryContract).getFeatureStatus.callAsync(
        params.nameKey,
    )
  }

  /**
   * Change a feature status
   */
  public setFeatureStatus = async (params: ISetFeatureStatus) => {
    return (await this.featureRegistryContract).setFeatureStatus.sendTransactionAsync(
      params.nameKey,
      params.newStatus,
      {
        from: await this._getOwnerAddress(),
      },
    );
  }

  /**
   * Get the CustomModulesAllowed status
   * @return bool
   */
  public getCustomModulesAllowedStatus = async (): Promise<boolean> => {
    return await (await this.featureRegistryContract).getFeatureStatus.callAsync(
        Features.CustomModulesAllowed,
    )
  }

  /**
   * Get the FreezeMintingAllowed status
   * @return bool
   */
  public getFreezeMintingAllowedStatus = async (): Promise<boolean> => {
    return await (await this.featureRegistryContract).getFeatureStatus.callAsync(
      Features.FreezeMintingAllowed,
    )
  }

  private async _getOwnerAddress(): Promise<string> {
    const addresses = await this.web3Wrapper.getAvailableAddressesAsync();
    return addresses[0];
  }

  private async _getFeatureRegistryContract(): Promise<FeatureRegistryContract> {
    return new FeatureRegistryContract(
      this.abi,
      await this.polymathRegistry.getFeatureRegistryAddress(),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
  }
}
