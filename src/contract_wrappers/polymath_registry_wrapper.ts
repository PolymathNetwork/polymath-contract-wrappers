import { PolymathRegistryContract } from 'polymath-abi-wrappers';
import { PolymathRegistry } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { assert } from '../utils/assert';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import { IGetAddress, NetworkId } from '../types';

/**
 * This class includes the functionality related to interacting with the PolymathRegistry contract.
 */
export class PolymathRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = PolymathRegistry.abi;
  public address: string;
  private polymathRegistryContract: PolymathRegistryContract;
  /**
   * Instantiate PolymathRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param networkId Desired networkId
   * @param address The address of the PolymathRegistry contract.
   */
  constructor(web3Wrapper: Web3Wrapper, networkId: NetworkId, address: string) {
    super(web3Wrapper, networkId);
    this.address = address;
    this.polymathRegistryContract = this._getPolymathRegistryContract();
  }

  /**
   * Gets the contract address
   * @return address string
   */
  public async getAddress(params: IGetAddress): Promise<string> {
    assert.isString('contractName', params.contractName);
    const addresse = await (await this.polymathRegistryContract).getAddress.callAsync(
      params.contractName,
    );
    return addresse;
  }

  private _getPolymathRegistryContract(): PolymathRegistryContract {
    return new PolymathRegistryContract(
      this.abi,
      this.address,
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
  }
}
