import { 
  SecurityTokenRegistryContract,
  SecurityTokenRegistryEvents,
  SecurityTokenRegistryEventArgs,
  SecurityTokenRegistryChangeExpiryLimitEventArgs,
  SecurityTokenRegistryChangeSecurityLaunchFeeEventArgs,
  SecurityTokenRegistryChangeTickerRegistrationFeeEventArgs,
  SecurityTokenRegistryNewSecurityTokenEventArgs, 
  SecurityTokenRegistryOwnershipTransferredEventArgs,
  SecurityTokenRegistryPauseEventArgs,
  SecurityTokenRegistryUnpauseEventArgs,
  SecurityTokenRegistryRegisterTickerEventArgs,
  SecurityTokenRegistryTickerRemovedEventArgs,
  SecurityTokenRegistryChangeTickerOwnershipEventArgs
} from '@polymathnetwork/abi-wrappers';
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
  EventCallback,
} from '../types';
import { schemas } from '@0x/json-schemas';
import * as moment from 'moment';

interface IChangeExpiryLimitSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeExpiryLimit,
  callback: EventCallback<SecurityTokenRegistryChangeExpiryLimitEventArgs>,
}

interface IGetChangeExpiryLimitLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeExpiryLimit,
}

interface IChangeSecurityLaunchFeeSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeSecurityLaunchFee,
  callback: EventCallback<SecurityTokenRegistryChangeSecurityLaunchFeeEventArgs>,
}

interface IGetChangeSecurityLaunchFeeLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeSecurityLaunchFee,
}

interface IChangeTickerOwnershipSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeTickerOwnership,
  callback: EventCallback<SecurityTokenRegistryChangeTickerOwnershipEventArgs>,
}

interface IGetChangeTickerOwnershipLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeTickerOwnership,
}

interface IChangeTickerRegistrationFeeSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeTickerRegistrationFee,
  callback: EventCallback<SecurityTokenRegistryChangeTickerRegistrationFeeEventArgs>,
}

interface IGetChangeTickerRegistrationFeeLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeTickerRegistrationFee,
}

interface INewSecurityTokenSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.NewSecurityToken,
  callback: EventCallback<SecurityTokenRegistryNewSecurityTokenEventArgs>,
}

interface IGetNewSecurityTokenLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.NewSecurityToken,
}

interface IOwnershipTransferredSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.OwnershipTransferred,
  callback: EventCallback<SecurityTokenRegistryOwnershipTransferredEventArgs>,
}

interface IGetOwnershipTransferredLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.OwnershipTransferred,
}

interface IPauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.Pause,
  callback: EventCallback<SecurityTokenRegistryPauseEventArgs>,
}

interface IGetPauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.Pause,
}

interface IRegisterTickerSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.RegisterTicker,
  callback: EventCallback<SecurityTokenRegistryRegisterTickerEventArgs>,
}

interface IGetRegisterTickerLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.RegisterTicker,
}

interface ITickerRemovedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.TickerRemoved,
  callback: EventCallback<SecurityTokenRegistryTickerRemovedEventArgs>,
}

interface IGetTickerRemovedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.TickerRemoved,
}

interface IUnpauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.Unpause,
  callback: EventCallback<SecurityTokenRegistryUnpauseEventArgs>,
}

interface IGetUnpauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.Unpause,
}

interface ISecurityTokenRegistrySubscribeAsyncParams {
  (params: IChangeExpiryLimitSubscribeAsyncParams): Promise<string>,
  (params: IChangeSecurityLaunchFeeSubscribeAsyncParams): Promise<string>,
  (params: IChangeTickerOwnershipSubscribeAsyncParams): Promise<string>,
  (params: IChangeTickerRegistrationFeeSubscribeAsyncParams): Promise<string>,
  (params: INewSecurityTokenSubscribeAsyncParams): Promise<string>,
  (params: IOwnershipTransferredSubscribeAsyncParams): Promise<string>,
  (params: IPauseSubscribeAsyncParams): Promise<string>,
  (params: IRegisterTickerSubscribeAsyncParams): Promise<string>,
  (params: ITickerRemovedSubscribeAsyncParams): Promise<string>,
  (params: IUnpauseSubscribeAsyncParams): Promise<string>,
}

interface IGetSecurityTokenRegistryLogsAsyncParams {
  (params: IGetChangeExpiryLimitLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryChangeExpiryLimitEventArgs>>>,
  (params: IGetChangeSecurityLaunchFeeLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryChangeSecurityLaunchFeeEventArgs>>>,
  (params: IGetChangeTickerOwnershipLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryChangeTickerOwnershipEventArgs>>>,
  (params: IGetChangeTickerRegistrationFeeLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryChangeTickerRegistrationFeeEventArgs>>>,
  (params: IGetNewSecurityTokenLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryRegisterTickerEventArgs>>>,
  (params: IGetOwnershipTransferredLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryOwnershipTransferredEventArgs>>>,
  (params: IGetPauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryPauseEventArgs>>>,
  (params: IGetRegisterTickerLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryNewSecurityTokenEventArgs>>>,
  (params: IGetTickerRemovedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryTickerRemovedEventArgs>>>,
  (params: IGetUnpauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryUnpauseEventArgs>>>,
}

/**
 * @param securityToken is the address of the security token.
 */
interface IGetSecurityTokenDataParams {
  securityToken: string;
}

/**
* @param ownerAddress is the address which owns the list of tickers
*/
interface IGetTickersByOwnerParams {
  owner?: string;
}

/**
* @param ownerAddress is the address which owns the list of tickers
*/
interface IGetTokensByOwnerParams {
  ownerAddress: string;
}

/**
* @param tokenName is the ticker symbol
*/
interface ITickerDetailsParams {
  tokenName: string;
}

/**
* @param ticker is unique token ticker
* @param tokenName is the name of the token
*/
interface IRegisterTickerParams extends ITxParams {
  owner?: string;
  ticker: string;
  tokenName: string;
}

/**
* @param newOwner is the address of the new owner of the ticker
* @param ticker is the ticker symbol
*/
interface ITransferTickerOwnershipParams extends ITxParams {
  newOwner: string;
  ticker: string;
}

/**
* @param name is the name of the token
* @param ticker is the ticker symbol of the security token
* @param details is the off-chain details of the token
* @param divisible is whether or not the token is divisible
*/
interface IGenerateSecurityTokenParams extends ITxParams {
  name: string;
  ticker: string;
  details: string;
  divisible: boolean;
}

/**
 * @param owner is the owner of the token
 * @param ticker is the token ticker
 * @param tokenName is the name of the token
 * @param registrationDate is the date at which ticker is registered
 * @param expiryDate is the expiry date for the ticker
 * @param status is the token deployment status
 */
interface IModifyTickerParams extends ITxParams {
  owner: string,
  ticker: string,
  tokenName: string,
  registrationDate: BigNumber,
  expiryDate: BigNumber,
  status: boolean,
}

/**
 * @param ticker is the token ticker
 */
interface IRemoveTickerParams extends ITxParams {
  ticker: string,
}

/**
 * @param newExpiry is the new expiry for newly generated tickers
 */
interface IChangeExpiryLimitParams extends ITxParams {
  newExpiry: BigNumber,
}

/**
 * @param name is the name of the token
 * @param ticker is the ticker symbol of the security token
 * @param owner is the owner of the token
 * @param securityToken is the address of the securityToken
 * @param tokenDetails is the off-chain details of the token
 * @param deployedAt is the timestamp at which the security token is deployed
 */
interface IModifySecurityTokenParams extends ITxParams {
  name: string,
  ticker: string,
  owner: string,
  securityToken: string,
  tokenDetails: string,
  deployedAt: BigNumber,
}

/**
  * @param securityToken is the address of the security token
  */
interface IIsSecurityTokenParams {
  securityToken: string,
}

/**
  * @param newOwner The address to transfer ownership to.
  */
interface ITransferOwnershipParams extends ITxParams {
  newOwner: string,
}

/**
  * @param tickerRegFee is the registration fee in POLY tokens (base 18 decimals)
  */
interface IChangeTickerRegistrationFeeParams extends ITxParams {
  tickerRegFee: BigNumber,
}

/**
  * @param _stLaunchFee is the registration fee in POLY tokens (base 18 decimals)
  */
interface IChangeSecurityLaunchFeeParams extends ITxParams {
  stLaunchFee: BigNumber,
}

/**
  * @param tokenContract is the address of the token contract
  */
interface IReclaimERC20Params extends ITxParams {
  tokenContract: string
}

/**
  * @param STFactoryAddress is the address of the proxy.
  * @param major Major version of the proxy.
  * @param minor Minor version of the proxy.
  * @param patch Patch version of the proxy
  */
interface ISetProtocolVersionParams extends ITxParams {
  STFactoryAddress: string,
  major: number|BigNumber,
  minor: number|BigNumber,
  patch: number|BigNumber,
}

/**
 * @param newAddress is the address of the polytoken.
 */
interface IUpdatePolyTokenAddressParams extends ITxParams {
  newAddress: string,
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
  public getSecurityTokenAddress = async (ticker: string): Promise<string> => {
    return await (await this.securityTokenRegistryContract).getSecurityTokenAddress.callAsync(
      ticker,
    );
  }

  private _isTickerAvailable = (registrationDate: number, expiryDate: number, isDeployed: boolean): boolean => {
    if (registrationDate == 0) {
      return true;
    } else if (!isDeployed && (expiryDate > moment().unix())) {
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
    const registrationDate = result[1].toNumber();
    const expiryDate = result[2].toNumber();
    const isDeployed = result[4];

    return this._isTickerAvailable(registrationDate, expiryDate, isDeployed);
  }

  /**
   * Knows if the ticker was registered by the user
   * @return boolean
   */
  public isTickerRegisteredByCurrentIssuer = async (params: ITickerDetailsParams): Promise<boolean> => {
    const result = await this.getTickerDetails(params);
    const tickerOwner = result[0];
    const registrationDate = result[1].toNumber();
    const expiryDate = result[2].toNumber();
    const isDeployed = result[4];

    if (this._isTickerAvailable(registrationDate, expiryDate, isDeployed)) {
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
   * Modifies the ticker details. Only Polymath has the ability to do so.
   */
  public modifyTicker = async (params: IModifyTickerParams) => {
    return async () => {
      return (await this.securityTokenRegistryContract).modifyTicker.sendTransactionAsync(
        params.owner,
        params.ticker,
        params.tokenName,
        params.registrationDate,
        params.expiryDate,
        params.status,
      );
    }
  }

  /**
   * Removes the ticker details, associated ownership & security token mapping
   */
  public removeTicker = async (params: IRemoveTickerParams) => {
    return async () => {
      return (await this.securityTokenRegistryContract).removeTicker.sendTransactionAsync(
        params.ticker,
      );
    }
  }

  /**
   * Changes the expiry time for the token ticker. Only available to Polymath.
   */
  public changeExpiryLimit = async (params: IChangeExpiryLimitParams) => {
    return async () => {
      return (await this.securityTokenRegistryContract).changeExpiryLimit.sendTransactionAsync(
        params.newExpiry,
      );
    }
  }

  /**
   * Adds a new custom Security Token and saves it to the registry. (Token should follow the ISecurityToken interface)
   */
  public modifySecurityToken = async (params: IModifySecurityTokenParams) => {
    return async () => {
      return (await this.securityTokenRegistryContract).modifySecurityToken.sendTransactionAsync(
        params.owner,
        params.ticker,
        params.owner,
        params.securityToken,
        params.tokenDetails,
        params.deployedAt,
      );
    }
  }

  /**
   * Checks that Security Token is registered
   */
  public isSecurityToken = async (params: IIsSecurityTokenParams): Promise<boolean> => {
    return await (await this.securityTokenRegistryContract).isSecurityToken.callAsync(
      params.securityToken,
    );
  }

  /**
   * Allows the current owner to transfer control of the contract to a newOwner.
   */
  public transferOwnership = async (params: ITransferOwnershipParams) => {
    return async () => {
      return (await this.securityTokenRegistryContract).transferOwnership.sendTransactionAsync(
        params.newOwner,
      );
    }
  }

  /**
   * Called by the owner to pause, triggers stopped state
   */
  public pause = async (params: ITxParams) => {
    return async () => {
      return (await this.securityTokenRegistryContract).pause.sendTransactionAsync(
        params.txData,
        params.safetyFactor,
      );
    }
  }

  /**
   * Called by the owner to unpause, returns to normal state
   */
  public unpause = async (params: ITxParams) => {
    return async () => {
      return (await this.securityTokenRegistryContract).unpause.sendTransactionAsync(
        params.txData,
        params.safetyFactor,
      );
    }
  }

  /**
   * Sets the ticker registration fee in POLY tokens. Only Polymath.
   */
  public changeTickerRegistrationFee = async (params: IChangeTickerRegistrationFeeParams) => {
    return async () => {
      return (await this.securityTokenRegistryContract).changeTickerRegistrationFee.sendTransactionAsync(
        params.tickerRegFee,
      );
    }
  }

  /**
   * Sets the ticker registration fee in POLY tokens. Only Polymath.
   */
  public changeSecurityLaunchFee = async (params: IChangeSecurityLaunchFeeParams) => {
    return async () => {
      return (await this.securityTokenRegistryContract).changeSecurityLaunchFee.sendTransactionAsync(
        params.stLaunchFee,
      );
    }
  }

  /**
   * Reclaims all ERC20Basic compatible tokens
   */
  public reclaimERC20 = async (params: IReclaimERC20Params) => {
    return async () => {
      return (await this.securityTokenRegistryContract).reclaimERC20.sendTransactionAsync(
        params.tokenContract,
      );
    }
  }

  /**
   * Changes the protocol version and the SecurityToken contract
   */
  public setProtocolVersion = async (params: ISetProtocolVersionParams) => {
    return async () => {
      return (await this.securityTokenRegistryContract).setProtocolVersion.sendTransactionAsync(
        params.STFactoryAddress,
        params.major,
        params.minor,
        params.patch,
      );
    }
  }

  /**
   * Returns the current STFactory Address
   */
  public getSTFactoryAddress = async (): Promise<string> => {
    return await (await this.securityTokenRegistryContract).getSTFactoryAddress.callAsync();
  }

  /**
   * Gets Protocol version
   */
  public getProtocolVersion = async (): Promise<BigNumber[]> => {
    return await (await this.securityTokenRegistryContract).getProtocolVersion.callAsync();
  }

  /**
   * Changes the PolyToken address. Only Polymath.
   */
  public updatePolyTokenAddress = async (params: IUpdatePolyTokenAddressParams) => {
    return async () => {
      return (await this.securityTokenRegistryContract).updatePolyTokenAddress.sendTransactionAsync(
        params.newAddress,
      );
    }
  }

  /**
   * Gets the expiry limit
   */
  public getExpiryLimit = async (): Promise<BigNumber> => {
    return await (await this.securityTokenRegistryContract).getExpiryLimit.callAsync();
  }

  /**
   * Check whether the registry is paused or not
   */
  public isPaused = async (): Promise<boolean> => {
    return await (await this.securityTokenRegistryContract).isPaused.callAsync();
  }

  /**
   * Gets the owner of the contract
   */
  public owner = async (): Promise<string> => {
    return await (await this.securityTokenRegistryContract).owner.callAsync();
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: ISecurityTokenRegistrySubscribeAsyncParams = async <ArgsType extends SecurityTokenRegistryEventArgs>(
    params: ISubscribeAsyncParams
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
  public getLogsAsync: IGetSecurityTokenRegistryLogsAsyncParams = async <ArgsType extends SecurityTokenRegistryEventArgs>(
    params: IGetLogsAsyncParams
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
