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

export class SecurityTokenRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = SecurityTokenRegistry.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private securityTokenRegistryContractIfExists?: SecurityTokenRegistryContract;
  private factor = 1.5;

  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this.polymathRegistry = polymathRegistry;
  }

  public async getTickersByOwner(): Promise<string[]> {
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    const owner = await this._getAddress();
    const tickers = await SecurityTokenRegistryContractInstance.getTickersByOwner.callAsync(
      owner,
    );
    return tickers;
  }

  public async getTokensByOwner(ownerAddress: string): Promise<string[]> {
    assert.isETHAddressHex('ownerAddress', ownerAddress);
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    const tokens = await SecurityTokenRegistryContractInstance.getTokensByOwner.callAsync(
      ownerAddress,
    );
    return tokens;
  }

  public async getTickerDetails(tokenName: string): Promise<[string, BigNumber, BigNumber, string, boolean]> {
    assert.isString('tokenName', tokenName);
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    const tickerDetail = await SecurityTokenRegistryContractInstance.getTickerDetails.callAsync(
      tokenName,
    );
    return tickerDetail;
  }

  public async getTickerRegistrationFee(): Promise<BigNumber> {
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    return await SecurityTokenRegistryContractInstance.getTickerRegistrationFee.callAsync();
  }

  public async registerTicker(ticker: string, tokenName: string) {
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    const owner = await this._getAddress();
    const estimateGas = await await SecurityTokenRegistryContractInstance.registerTicker.estimateGasAsync(
      owner,
      ticker,
      tokenName,
      { from: owner },
    );
    const txData: TxData = {
      from: owner,
      gas: await estimateGasLimit(
        this.web3Wrapper,
        estimateGas,
        this.factor,
      ),
    };
    return () => {
      return SecurityTokenRegistryContractInstance.registerTicker.sendTransactionAsync(
        owner,
        ticker,
        tokenName,
        txData,
      );
    };
  }

  public async transferTickerOwnership(newOwner: string, ticker: string) {
    assert.isETHAddressHex('newOwner', newOwner);
    assert.isString('ticker', ticker);
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    const from = await this._getAddress();
    const estimateGas = await SecurityTokenRegistryContractInstance.transferTickerOwnership.estimateGasAsync(
      newOwner,
      ticker,
      { from },
    );
    const txData: TxData = {
      from,
      gas: await estimateGasLimit(
        this.web3Wrapper,
        estimateGas,
        1.2,
      ),
    };
    return () => {
      return SecurityTokenRegistryContractInstance.transferTickerOwnership.sendTransactionAsync(
        newOwner,
        ticker,
        txData,
      );
    };
  }

  public async generateSecurityToken(name: string, ticker: string, details: string, divisible: boolean) {
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    const from = await this._getAddress();
    const estimateGas = await SecurityTokenRegistryContractInstance.generateSecurityToken.estimateGasAsync(
      name,
      ticker,
      details,
      divisible,
      { from },
    );
    const txData: TxData = {
      from,
      gas: await estimateGasLimit(
        this.web3Wrapper,
        estimateGas,
        1.2,
      ),
    };
    return () => {
      return SecurityTokenRegistryContractInstance.generateSecurityToken.sendTransactionAsync(
        name,
        ticker,
        details,
        divisible,
        txData,
      );
    };
  }

  public async getSecurityTokenLaunchFee(): Promise<BigNumber> {
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    return await SecurityTokenRegistryContractInstance.getSecurityTokenLaunchFee.callAsync();
  }

  public async getAddress(): Promise<string> {
    return await this.polymathRegistry.getAddress('SecurityTokenRegistry');
  }

  private async _getAddress(): Promise<string> {
    const addresses = await this.web3Wrapper.getAvailableAddressesAsync();
    return addresses[0];
  }

  private async _getSecurityTokenRegistryContract(): Promise<SecurityTokenRegistryContract> {
    if (!_.isUndefined(this.securityTokenRegistryContractIfExists)) {
      return this.securityTokenRegistryContractIfExists;
    }

    const contractInstance = new SecurityTokenRegistryContract(
      this.abi,
      await this.getAddress(),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
    this.securityTokenRegistryContractIfExists = contractInstance;
    return this.securityTokenRegistryContractIfExists;
  }

}
