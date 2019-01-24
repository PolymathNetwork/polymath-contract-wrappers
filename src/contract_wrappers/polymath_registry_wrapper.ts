import { PolymathRegistryContract } from 'polymath-abi-wrappers';
import { PolymathRegistry } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { assert } from '../utils/assert';
import * as _ from 'lodash';
import { _getDefaultContractAddresses } from '../utils/contract_addresses';
import { ContractWrapper } from './contract_wrapper';

/**
 * This class includes the functionality related to interacting with the PolymathRegistry contract.
 */
export class PolymathRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = PolymathRegistry.abi;
  public address: string;
  private polymathRegistryContractIfExists?: PolymathRegistryContract;

  /**
   * Instantiate PolymathRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param networkId Desired networkId
   * @param address The address of the PolymathRegistry contract. If undefined, will
   * default to the known address corresponding to the networkId.
   */
  constructor(web3Wrapper: Web3Wrapper, networkId: number, address?: string) {
    super(web3Wrapper, networkId);
    this.address = _.isUndefined(address) ? _getDefaultContractAddresses(networkId).polymathRegistry : address;
  }

  public async getAddress(contractName: string): Promise<string> {
    assert.isString('contractName', contractName);
    const PolymathRegistryContractInstance = this._getPolymathRegistryContract();
    const addresse = await PolymathRegistryContractInstance.getAddress.callAsync(
      contractName,
    );
    return addresse;
  }

  private _getPolymathRegistryContract(): PolymathRegistryContract {
    if (!_.isUndefined(this.polymathRegistryContractIfExists)) {
      return this.polymathRegistryContractIfExists;
    }
    const contractInstance = new PolymathRegistryContract(
      this.abi,
      this.address,
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
    this.polymathRegistryContractIfExists = contractInstance;
    return this.polymathRegistryContractIfExists;
  }
}
