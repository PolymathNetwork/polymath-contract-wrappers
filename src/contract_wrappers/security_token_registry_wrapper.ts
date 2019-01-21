import { SecurityTokenRegistryContract } from 'polymath-abi-wrappers';
import { SecurityTokenRegistry } from 'polymath-contract-artifacts';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, TxData } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { assert } from '../utils/assert';
import { estimateGasLimit } from '../utils/transactions';
import * as _ from 'lodash';
import { _getDefaultContractAddresses } from '../utils/contract_addresses';
import { ContractWrapper } from './contract_wrapper';
import { string } from 'prop-types';

export class SecurityTokenRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = SecurityTokenRegistry.abi;
  private _polymathRegistry: PolymathRegistryWrapper;
  private _securityTokenRegistryContractIfExists?: SecurityTokenRegistryContract;
  private _factor = 1.5;

  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this._polymathRegistry = polymathRegistry;
  }

  public async getTickersByOwner(ownerAddress: string): Promise<string[]> {
    assert.isETHAddressHex('ownerAddress', ownerAddress);
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    const tickers = await SecurityTokenRegistryContractInstance.getTickersByOwner.callAsync(ownerAddress);
    return tickers;
  }

  public async getTokensByOwner(ownerAddress: string): Promise<string[]> {
    assert.isETHAddressHex('ownerAddress', ownerAddress);
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    const tokens = await SecurityTokenRegistryContractInstance.getTokensByOwner.callAsync(ownerAddress);
    return tokens;
  }

  public async getTickerDetails(tokenName: string): Promise<[string, BigNumber, BigNumber, string, boolean]> {
    assert.isString('tokenName', tokenName);
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    const tickerDetail = await SecurityTokenRegistryContractInstance.getTickerDetails.callAsync(tokenName);
    return tickerDetail;
  }

  public async getTickerRegistrationFee(): Promise<BigNumber> {
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    return await SecurityTokenRegistryContractInstance.getTickerRegistrationFee.callAsync();
  }

  public async registerTickerEGas(owner: string, ticker: string, tokenName: string): Promise<number> {
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    return await SecurityTokenRegistryContractInstance.registerTicker.estimateGasAsync(owner, ticker, tokenName, { from: owner });
  }

  public async registerTicker(owner: string, ticker: string, tokenName: string, txData: Partial<TxData>) {
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    const estimateGas = await SecurityTokenRegistryContractInstance.registerTicker.estimateGasAsync(owner, ticker, tokenName, txData);
    txData['gas'] = await estimateGasLimit(this._web3Wrapper, estimateGas, this._factor);
    return () => {
      return SecurityTokenRegistryContractInstance.registerTicker.sendTransactionAsync(owner, ticker, tokenName, txData);
    }
  }

  public async transferTickerOwnership(newOwner: string, ticker: string, txData: Partial<TxData>) {
    assert.isETHAddressHex('newOwner', newOwner);
    assert.isString('ticker', ticker);
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    const estimateGas = await SecurityTokenRegistryContractInstance.transferTickerOwnership.estimateGasAsync(newOwner, ticker, txData);
    txData['gas'] = await estimateGasLimit(this._web3Wrapper, estimateGas, this._factor);
    return () => {
      return SecurityTokenRegistryContractInstance.transferTickerOwnership.sendTransactionAsync(newOwner, ticker, txData);
    }
  }

  public async getAddress(): Promise<string> {
    return await this._polymathRegistry.getAddress("SecurityTokenRegistry");
  }

  private async _getSecurityTokenRegistryContract(): Promise<SecurityTokenRegistryContract> {
    if (!_.isUndefined(this._securityTokenRegistryContractIfExists)) {
      return this._securityTokenRegistryContractIfExists;
    }

    const contractInstance = new SecurityTokenRegistryContract(
      this.abi,
      await this.getAddress(),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
    this._securityTokenRegistryContractIfExists = contractInstance;
    return this._securityTokenRegistryContractIfExists;
  }

}