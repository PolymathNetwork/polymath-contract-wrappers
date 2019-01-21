import { SecurityTokenRegistryContract } from 'polymath-abi-wrappers';
import { SecurityTokenRegistry } from 'polymath-contract-artifacts';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, TxData } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { assert } from '../utils/assert';
import * as _ from 'lodash';
import { _getDefaultContractAddresses } from '../utils/contract_addresses';
import { ContractWrapper } from './contract_wrapper';

export class SecurityTokenRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = SecurityTokenRegistry.abi;
  private _polymathRegistry: PolymathRegistryWrapper;
  private _securityTokenRegistryContractIfExists?: SecurityTokenRegistryContract;

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

  public async getTickerDetails(tickerName: string): Promise<[string, BigNumber, BigNumber, string, boolean]> {
    assert.isString('tickerName', tickerName);
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    const tickerDetail = await SecurityTokenRegistryContractInstance.getTickerDetails.callAsync(tickerName);
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
    return () => {
      return SecurityTokenRegistryContractInstance.registerTicker.sendTransactionAsync(owner, ticker, tokenName, txData);
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