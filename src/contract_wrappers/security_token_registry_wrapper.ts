import { SecurityTokenRegistryContract } from '@polymathnetwork/abi-wrappers';
import { SecurityTokenRegistry } from '@polymathnetwork/contract-artifacts';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { assert } from '../utils/assert';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import {
  ISecurityTokenData,
  ITokensByOwner,
  ITickerDetails,
  IRegisterTicker,
  ITransferTickerOwnership,
  IGenerateSecurityToken,
  ITickersByOwner,
} from '../types';

/**
 * This class includes the functionality related to interacting with the SecurityTokenRegistry contract.
 */
export class SecurityTokenRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = (SecurityTokenRegistry as any).abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private securityTokenRegistryContract: Promise<SecurityTokenRegistryContract>;
  /**
   * Instantiate SecurityTokenRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this.polymathRegistry = polymathRegistry;
    this.securityTokenRegistryContract = this._getSecurityTokenRegistryContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.securityTokenRegistryContract).address;
  }

  /**
   * @returns Returns the list of tickers owned by the selected address
   */
  public getTickersByOwner = async (params: ITickersByOwner): Promise<string[]> => {
    const owner = !_.isUndefined(params.owner) ? params.owner : await this._getDefaultFromAddress();
    const tickers = await (await this.securityTokenRegistryContract).getTickersByOwner.callAsync(
      owner,
    );
    return tickers;
  }

  /**
   * @returns Returns the security token data by address
   */
  public getSecurityTokenData = async (params: ISecurityTokenData): Promise<[string, string, string, BigNumber]> => {
    return await (await this.securityTokenRegistryContract).getSecurityTokenData.callAsync(params.securityToken);
  }

  /**
   * @returns Returns the list of tokens owned by the selected address
   */
  public getTokensByOwner = async (params: ITokensByOwner): Promise<string[]> => {
    assert.isETHAddressHex('ownerAddress', params.ownerAddress);
    const tokens = await (await this.securityTokenRegistryContract).getTokensByOwner.callAsync(
      params.ownerAddress,
    );
    return tokens;
  }

  /**
   * @returns Returns the owner and timestamp for a given ticker
   */
  public getTickerDetails = async (params: ITickerDetails): Promise<[string, BigNumber, BigNumber, string, boolean]> => {
    assert.isString('tokenName', params.tokenName);
    const tickerDetail = await (await this.securityTokenRegistryContract).getTickerDetails.callAsync(
      params.tokenName,
    );
    return tickerDetail;
  }

  /**
   * @return Gets the ticker registration fee
   */
  public getTickerRegistrationFee = async (): Promise<BigNumber> => {
    return await (await this.securityTokenRegistryContract).getTickerRegistrationFee.callAsync();
  }

  /**
   * Registers the token ticker to the selected owner
   * Once the token ticker is registered to its owner then no other issuer can claim
   * its ownership. If the ticker expires and its issuer hasn't used it, then someone else can take it.
   */
  public registerTicker = async (params: IRegisterTicker) => {
    const owner = !_.isUndefined(params.owner) ? params.owner : await this._getDefaultFromAddress();
    return async () => {
      return (await this.securityTokenRegistryContract).registerTicker.sendTransactionAsync(
        owner,
        params.ticker,
        params.tokenName
      );
    }
  }

  /**
   * Transfers the ownership of the ticker
   */
  public transferTickerOwnership = async (params: ITransferTickerOwnership) => {
    assert.isETHAddressHex('newOwner', params.newOwner);
    assert.isString('ticker', params.ticker);
    return async () => {
      return (await this.securityTokenRegistryContract).transferTickerOwnership.sendTransactionAsync(
        params.newOwner,
        params.ticker
      );
    }
  }

  /**
   * Deploys an instance of a new Security Token and records it to the registry
   */
  public generateSecurityToken = async (params: IGenerateSecurityToken) => {
    return async () => {
      return (await this.securityTokenRegistryContract).generateSecurityToken.sendTransactionAsync(
        name,
        params.ticker,
        params.details,
        params.divisible
      );
    }
  }

  /**
   * Gets the security token launch fee
   * @return Fee amount
   */
  public getSecurityTokenLaunchFee = async (): Promise<BigNumber> => {
    return await (await this.securityTokenRegistryContract).getSecurityTokenLaunchFee.callAsync();
  }

  /**
   * Returns the security token address by ticker symbol
   * @param ticker is the ticker of the security token
   * @return address string
   */
  private async _getSecurityTokenAddress(ticker: string): Promise<string> {
    return await (await this.securityTokenRegistryContract).getSecurityTokenAddress.callAsync(
      ticker,
    );
  }

  private async _getSecurityTokenRegistryContract(): Promise<SecurityTokenRegistryContract> {
    return new SecurityTokenRegistryContract(
      this.abi,
      await this.polymathRegistry.getSecurityTokenRegistryAddress(),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }

}
