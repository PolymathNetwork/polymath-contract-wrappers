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

/**
 * This class includes the functionality related to interacting with the SecurityTokenRegistry contract.
 */
export class SecurityTokenRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = SecurityTokenRegistry.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private securityTokenRegistryContractIfExists?: SecurityTokenRegistryContract;
  private factor = 1.5;
  /**
   * Instantiate SecurityTokenRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param networkId Desired networkId
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this.polymathRegistry = polymathRegistry;
  }

  /**
   * @returns Returns the list of tickers owned by the selected address
   */
  public async getTickersByOwner(): Promise<string[]> {
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    const owner = await this._getAddress();
    const tickers = await SecurityTokenRegistryContractInstance.getTickersByOwner.callAsync(
      owner,
    );
    return tickers;
  }

  /**
   * @param securityToken is the address of the security token.
   * @returns Returns the security token data by address
   */
  public async getSecurityTokenData(securityToken: string): Promise<[string, string, string, BigNumber]> {
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    return await SecurityTokenRegistryContractInstance.getSecurityTokenData.callAsync(securityToken);
  }

  /**
   * @param ownerAddress is the address which owns the list of tickers
   * @returns Returns the list of tokens owned by the selected address
   */
  public async getTokensByOwner(ownerAddress: string): Promise<string[]> {
    assert.isETHAddressHex('ownerAddress', ownerAddress);
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    const tokens = await SecurityTokenRegistryContractInstance.getTokensByOwner.callAsync(
      ownerAddress,
    );
    return tokens;
  }

  /**
   * @param tokenName is the ticker symbol
   * @returns Returns the owner and timestamp for a given ticker
   */
  public async getTickerDetails(tokenName: string): Promise<[string, BigNumber, BigNumber, string, boolean]> {
    assert.isString('tokenName', tokenName);
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    const tickerDetail = await SecurityTokenRegistryContractInstance.getTickerDetails.callAsync(
      tokenName,
    );
    return tickerDetail;
  }

  /**
   * @return Gets the ticker registration fee
   */
  public async getTickerRegistrationFee(): Promise<BigNumber> {
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    return await SecurityTokenRegistryContractInstance.getTickerRegistrationFee.callAsync();
  }

  /**
   * Registers the token ticker to the selected owner
   * Once the token ticker is registered to its owner then no other issuer can claim
   * its ownership. If the ticker expires and its issuer hasn't used it, then someone else can take it.
   * @param ticker is unique token ticker
   * @param tokenName is the name of the token
   */
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

  /**
   * Transfers the ownership of the ticker
   * @param newOwner is the address of the new owner of the ticker
   * @param ticker is the ticker symbol
   */
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

  /**
   * Deploys an instance of a new Security Token and records it to the registry
   * @param name is the name of the token
   * @param ticker is the ticker symbol of the security token
   * @param details is the off-chain details of the token
   * @param divisible is whether or not the token is divisible
   */
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

  /**
   * Gets the security token launch fee
   * @return Fee amount
   */
  public async getSecurityTokenLaunchFee(): Promise<BigNumber> {
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    return await SecurityTokenRegistryContractInstance.getSecurityTokenLaunchFee.callAsync();
  }

  /**
   * Gets the SecurityTokenRegistry address
   * @return Address string
   */
  public async getAddress(): Promise<string> {
    return await this.polymathRegistry.getAddress('SecurityTokenRegistry');
  }

  private async _getAddress(): Promise<string> {
    const addresses = await this.web3Wrapper.getAvailableAddressesAsync();
    return addresses[0];
  }

  /**
   * Returns the security token address by ticker symbol
   * @param ticker is the ticker of the security token
   * @return address string
   */
  private async _getSecurityTokenAddress(ticker: string): Promise<string> {
    const SecurityTokenRegistryContractInstance = await this._getSecurityTokenRegistryContract();
    return await SecurityTokenRegistryContractInstance.getSecurityTokenAddress.callAsync(
      ticker,
    );
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
