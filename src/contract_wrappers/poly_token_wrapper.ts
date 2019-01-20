import { PolyTokenContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { PolyToken } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { assert } from '../utils/assert';
import { TxData } from 'ethereum-types';
import * as _ from 'lodash';

import { _getDefaultContractAddresses } from '../utils/contract_addresses';

import { ContractWrapper } from './contract_wrapper';

export class PolyTokenWrapper extends ContractWrapper {
  public abi: ContractAbi = PolyToken.abi;
  private _polymathRegistry: PolymathRegistryWrapper;
  private _polyTokenContractIfExists?: PolyTokenContract;

  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this._polymathRegistry = polymathRegistry;
  }

  public async getBalanceOf(address: string): Promise<BigNumber> {
    assert.isETHAddressHex('address', address)
    const PolyTokenContractInstance = await this._getPolyTokenContract();
    return await PolyTokenContractInstance.balanceOf.callAsync(address);
  }

  public async allowance(owner: string, spender: string): Promise<BigNumber> {
    assert.isString('owner', owner);
    assert.isString('spender', spender);
    const PolyTokenContractInstance = await this._getPolyTokenContract();
    return await PolyTokenContractInstance.allowance.callAsync(owner, spender);
  }

  public async approve(spender: string, value: BigNumber, txData: Partial<TxData>): Promise<string> {
    const PolyTokenContractInstance = await this._getPolyTokenContract();
    return await PolyTokenContractInstance.approve.sendTransactionAsync(spender, value, txData);
  }

  private async _getPolyTokenContract(): Promise<PolyTokenContract> {
    if (!_.isUndefined(this._polyTokenContractIfExists)) {
      return this._polyTokenContractIfExists;
    }
    const contractInstance = new PolyTokenContract(
      this.abi,
      await this._polymathRegistry.getAddress("PolyToken"),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
    this._polyTokenContractIfExists = contractInstance;
    return this._polyTokenContractIfExists;
  }
}