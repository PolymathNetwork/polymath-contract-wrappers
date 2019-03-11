import { SecurityTokenRegistryContract, SecurityTokenRegistryEvents, SecurityTokenRegistryEventArgs } from '@polymathnetwork/abi-wrappers';
import { SecurityTokenRegistry } from '@polymathnetwork/contract-artifacts';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { assert } from '../utils/assert';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import {
  ITxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
} from '../types';
import { schemas } from '@0x/json-schemas';
import * as moment from 'moment';

/**
 * @param securityToken is the address of the security token.
 */
export interface IGetSecurityTokenDataParams {
  securityToken: string;
}

/**
* @param ownerAddress is the address which owns the list of tickers
*/
export interface IGetTickersByOwnerParams {
  owner?: string;
}

/**
* @param ownerAddress is the address which owns the list of tickers
*/
export interface IGetTokensByOwnerParams {
  ownerAddress: string;
}

/**
* @param tokenName is the ticker symbol
*/
export interface ITickerDetailsParams {
  tokenName: string;
}

/**
* @param ticker is unique token ticker
* @param tokenName is the name of the token
*/
export interface IRegisterTickerParams extends ITxParams {
  owner?: string;
  ticker: string;
  tokenName: string;
}

/**
* @param newOwner is the address of the new owner of the ticker
* @param ticker is the ticker symbol
*/
export interface ITransferTickerOwnershipParams extends ITxParams {
  newOwner: string;
  ticker: string;
}

/**
* @param name is the name of the token
* @param ticker is the ticker symbol of the security token
* @param details is the off-chain details of the token
* @param divisible is whether or not the token is divisible
*/
export interface IGenerateSecurityTokenParams extends ITxParams {
  name: string;
  ticker: string;
  details: string;
  divisible: boolean;
}

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
  public getTickersByOwner = async (params: IGetTickersByOwnerParams): Promise<string[]> => {
    const owner = !_.isUndefined(params.owner) ? params.owner : await this._getDefaultFromAddress();
    const tickers = await (await this.securityTokenRegistryContract).getTickersByOwner.callAsync(
      owner,
    );
    return tickers;
  }

  /**
   * @returns Returns the security token data by address
   */
  public getSecurityTokenData = async (params: IGetSecurityTokenDataParams): Promise<[string, string, string, BigNumber]> => {
    return await (await this.securityTokenRegistryContract).getSecurityTokenData.callAsync(params.securityToken);
  }

  /**
   * @returns Returns the list of tokens owned by the selected address
   */
  public getTokensByOwner = async (params: IGetTokensByOwnerParams): Promise<string[]> => {
    assert.isETHAddressHex('ownerAddress', params.ownerAddress);
    const tokens = await (await this.securityTokenRegistryContract).getTokensByOwner.callAsync(
      params.ownerAddress,
    );
    return tokens;
  }

  /**
   * @returns Returns the owner and timestamp for a given ticker
   */
  public getTickerDetails = async (params: ITickerDetailsParams): Promise<[string, BigNumber, BigNumber, string, boolean]> => {
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
  public registerTicker = async (params: IRegisterTickerParams) => {
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
  public transferTickerOwnership = async (params: ITransferTickerOwnershipParams) => {
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
  public generateSecurityToken = async (params: IGenerateSecurityTokenParams) => {
    return async () => {
      return (await this.securityTokenRegistryContract).generateSecurityToken.sendTransactionAsync(
        params.name,
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

  private _availableConditions = (tickerRegistrationDate: number, tokenDeployed: boolean, expiredDate: number): boolean => {
    if (tickerRegistrationDate == 0) {
      return true;
    } else if (!tokenDeployed && (expiredDate > moment().unix())) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Gets ticker availability
   * @return boolean
   */
  public isTickerAvailable = async (params: ITickerDetailsParams): Promise<boolean> => {
    const result = await this.getTickerDetails(params);
    const tickerRegistrationDate = result[1].toNumber();
    const expiredDate = result[2].toNumber();
    const tokenDeployed = result[4];

    return this._availableConditions(tickerRegistrationDate, tokenDeployed, expiredDate);
  }

  /**
   * Knows if the ticker was registered by the user
   * @return boolean
   */
  public isTickerRegisteredByCurrentIssuer = async (params: ITickerDetailsParams): Promise<boolean> => {
    const result = await this.getTickerDetails(params);
    const tickerOwner = result[0];
    const tickerRegistrationDate = result[1].toNumber();
    const expiredDate = result[2].toNumber();
    const tokenDeployed = result[4];

    if (this._availableConditions(tickerRegistrationDate, tokenDeployed, expiredDate)) {
      return false;
    } else {
      return (tickerOwner === await this._getDefaultFromAddress());
    }
  }

  /**
   * Knows if the ticker was launched
   * @return boolean
   */
  public isTokenLaunched = async (params: ITickerDetailsParams): Promise<boolean> => {
    const result = await this.getTickerDetails(params);
    const tokenDeployed = result[4];
    return tokenDeployed;
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync = async <ArgsType extends SecurityTokenRegistryEventArgs>(
    params: ISubscribeAsyncParams<SecurityTokenRegistryEvents, ArgsType>
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenRegistryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.securityTokenRegistryContract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        (SecurityTokenRegistry as any).abi,
        params.callback,
        !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Cancel a subscription
   * @param subscriptionToken Subscription token returned by `subscribe()`
   */
  public unsubscribe = (subscriptionToken: string): void => {
    assert.isValidSubscriptionToken('subscriptionToken', subscriptionToken);
    this._unsubscribe(subscriptionToken);
  }

  /**
   * Cancels all existing subscriptions
   */
  public unsubscribeAll = (): void => {
    super._unsubscribeAll();
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync = async <ArgsType extends SecurityTokenRegistryEventArgs>(
    params: IGetLogsAsyncParams<SecurityTokenRegistryEvents>
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenRegistryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.securityTokenRegistryContract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        (SecurityTokenRegistry as any).abi,
    );
    return logs;
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
