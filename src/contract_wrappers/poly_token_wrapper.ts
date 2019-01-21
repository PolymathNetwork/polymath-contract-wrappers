import { PolyTokenContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { SecurityTokenRegistryWrapper } from './security_token_registry_wrapper';
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
  private _securityTokenRegistryWrapper: SecurityTokenRegistryWrapper;

  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper, securityTokenRegistryWrapper: SecurityTokenRegistryWrapper) {
    super(web3Wrapper, networkId);
    this._polymathRegistry = polymathRegistry;
    this._securityTokenRegistryWrapper = securityTokenRegistryWrapper;
  }

  public async getBalanceOf(address: string): Promise<BigNumber> {
    assert.isETHAddressHex('address', address)
    const PolyTokenContractInstance = await this._getPolyTokenContract();
    return await PolyTokenContractInstance.balanceOf.callAsync(address);
  }

  public async allowance(spender: string): Promise<BigNumber> {
    assert.isString('spender', spender);
    const PolyTokenContractInstance = await this._getPolyTokenContract();
    const securityTokenRegistryAddress = await this._securityTokenRegistryWrapper.getAddress();
    return await PolyTokenContractInstance.allowance.callAsync(securityTokenRegistryAddress, spender);
  }

  public async approve(value: BigNumber, txData: Partial<TxData>): Promise<string> {
    const PolyTokenContractInstance = await this._getPolyTokenContract();
    const securityTokenRegistryAddress = await this._securityTokenRegistryWrapper.getAddress();
    return await PolyTokenContractInstance.approve.sendTransactionAsync(securityTokenRegistryAddress, value, txData);
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