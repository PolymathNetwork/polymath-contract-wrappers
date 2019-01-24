import { PolyTokenContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { PolyToken } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { TxData } from 'ethereum-types';
import * as _ from 'lodash';

import { _getDefaultContractAddresses } from '../utils/contract_addresses';

import { ContractWrapper } from './contract_wrapper';

/**
 * This class includes the functionality related to interacting with the PolyToken contract.
 */
export class PolyTokenWrapper extends ContractWrapper {
  public abi: ContractAbi = PolyToken.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private polyTokenContractIfExists?: PolyTokenContract;

  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this.polymathRegistry = polymathRegistry;
  }

  public async getBalanceOf(): Promise<BigNumber> {
    const PolyTokenContractInstance = await this._getPolyTokenContract();
    const address = await this._getAddress();
    return await PolyTokenContractInstance.balanceOf.callAsync(
      address,
    );
  }

  public async allowance(owner: string): Promise<BigNumber> {
    const spender = await this._getAddress();
    const PolyTokenContractInstance = await this._getPolyTokenContract();
    return await PolyTokenContractInstance.allowance.callAsync(
      owner,
      spender,
    );
  }

  public async approve(spender: string, value: BigNumber) {
    const PolyTokenContractInstance = await this._getPolyTokenContract();
    const txData: TxData = {
      from: await this._getAddress(),
    };
    return () => {
      return PolyTokenContractInstance.approve.sendTransactionAsync(
        spender,
        value,
        txData,
      );
    };
  }

  private async _getAddress(): Promise<string> {
    const addresses = await this.web3Wrapper.getAvailableAddressesAsync();
    return addresses[0];
  }

  private async _getPolyTokenContract(): Promise<PolyTokenContract> {
    if (!_.isUndefined(this.polyTokenContractIfExists)) {
      return this.polyTokenContractIfExists;
    }
    const contractInstance = new PolyTokenContract(
      this.abi,
      await this.polymathRegistry.getAddress('PolyToken'),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
    this.polyTokenContractIfExists = contractInstance;
    return this.polyTokenContractIfExists;
  }
}
