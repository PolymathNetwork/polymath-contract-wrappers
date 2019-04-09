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
import { assert } from '../../utils/assert';
import * as _ from 'lodash';
import { ContractWrapper } from '../contract_wrapper';
import {
  TxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
  ISubscribe,
  IGetLogs
} from '../../types';
import { schemas } from '@0x/json-schemas';
import * as moment from 'moment';
import { type } from 'os';

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

interface ISecurityTokenRegistrySubscribeAsyncParams extends ISubscribe {
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

interface IGetSecurityTokenRegistryLogsAsyncParams extends IGetLogs {
  (params: IGetChangeExpiryLimitLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryChangeExpiryLimitEventArgs>>>,
  (params: IGetChangeSecurityLaunchFeeLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryChangeSecurityLaunchFeeEventArgs>>>,
  (params: IGetChangeTickerOwnershipLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryChangeTickerOwnershipEventArgs>>>,
  (params: IGetChangeTickerRegistrationFeeLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryChangeTickerRegistrationFeeEventArgs>>>,
  (params: IGetNewSecurityTokenLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryNewSecurityTokenEventArgs>>>,
  (params: IGetOwnershipTransferredLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryOwnershipTransferredEventArgs>>>,
  (params: IGetPauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryPauseEventArgs>>>,
  (params: IGetRegisterTickerLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryRegisterTickerEventArgs>>>,
  (params: IGetTickerRemovedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryTickerRemovedEventArgs>>>,
  (params: IGetUnpauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenRegistryUnpauseEventArgs>>>,
}

/**
 * @param securityToken is the address of the security token.
 */
interface SecurityTokenAddressParams {
  securityTokenAddress: string;
}

/**
* @param ownerAddress is the address which owns the list of tickers
*/
interface OwnerParams {
  owner?: string;
}

/**
* @param tokenName is the ticker symbol
*/
interface TokenNameParams {
  tokenName: string;
}

/**
* @param ticker is unique token ticker
* @param tokenName is the name of the token
*/
interface RegisterTickerParams extends TxParams {
  /** Ticker owner */
  owner?: string;
  /** Ticker symbol */
  ticker: string;
  /** Token name */
  tokenName: string;
}

/**
* @param newOwner is the address of the new owner of the ticker
* @param ticker is the ticker symbol
*/
interface TransferTickerOwnershipParams extends TxParams {
  newOwner: string;
  ticker: string;
}

/**
* @param name is the name of the token
* @param ticker is the ticker symbol of the security token
* @param details is the off-chain details of the token
* @param divisible is whether or not the token is divisible
*/
interface GenerateSecurityTokenParams extends TxParams {
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
interface ModifyTickerParams extends TxParams {
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
interface RemoveTickerParams extends TxParams {
  ticker: string,
}

/**
 * @param newExpiry is the new expiry for newly generated tickers
 */
interface ChangeExpiryLimitParams extends TxParams {
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
interface ModifySecurityTokenParams extends TxParams {
  name: string,
  ticker: string,
  owner: string,
  securityToken: string,
  tokenDetails: string,
  deployedAt: BigNumber,
}

/**
  * @param newOwner The address to transfer ownership to.
  */
interface TransferOwnershipParams extends TxParams {
  newOwner: string,
}

interface ChangeFeeParams extends TxParams {
  newFee: BigNumber,
}

/**
  * @param tokenContract is the address of the token contract
  */
interface ReclaimERC20Params extends TxParams {
  tokenContract: string
}

/**
  * @param STFactoryAddress is the address of the proxy.
  * @param major Major version of the proxy.
  * @param minor Minor version of the proxy.
  * @param patch Patch version of the proxy
  */
interface SetProtocolVersionParams extends TxParams {
  STFactoryAddress: string,
  major: number,
  minor: number,
  patch: number,
}

/**
 * @param newAddress is the address of the polytoken.
 */
interface UpdatePolyTokenAddressParams extends TxParams {
  newAddress: string,
}

//// Return types ////
interface SecurityTokenData {
  ticker: string;
  owner: string;
  tokenDetails: string;
  deployedAt: BigNumber;
}

interface TickerDetails {
    owner: string;
    registrationDate: BigNumber;
    expiryDate: BigNumber;
    tokenName: string;
    status: boolean;
}
//// End of return types ////

/**
 * This class includes the functionality related to interacting with the SecurityTokenRegistry contract.
 */
export class SecurityTokenRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = (SecurityTokenRegistry as any).abi;
  protected _contract: Promise<SecurityTokenRegistryContract>;

  /**
   * Instantiate SecurityTokenRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  constructor(web3Wrapper: Web3Wrapper, contract: Promise<SecurityTokenRegistryContract>) {
    super(web3Wrapper, contract);
    this._contract = contract;
  }

  /**
   * @returns Returns the list of tickers owned by the selected address
   */
  public getTickersByOwner = async (params?: OwnerParams) => {
    const owner = (!_.isUndefined(params) && !_.isUndefined(params.owner)) ? params.owner : await this._getDefaultFromAddress();
    const tickers = await (await this._contract).getTickersByOwner.callAsync(
      owner,
    );
    return tickers;
  }

  /**
   * @returns Returns the security token data by address
   */
  public getSecurityTokenData = async (params: SecurityTokenAddressParams) => {
    const result = await (await this._contract).getSecurityTokenData.callAsync(params.securityTokenAddress);
    const typedResult: SecurityTokenData = {
      ticker: result[0],
      owner: result[1],
      tokenDetails: result[2],
      deployedAt: result[3]
    };
    return typedResult;
  }

  /**
   * @returns Returns the list of tokens owned by the selected address
   */
  public getTokensByOwner = async (params?: OwnerParams) => {
    const owner = (!_.isUndefined(params) && !_.isUndefined(params.owner)) ? params.owner : await this._getDefaultFromAddress();
    assert.isETHAddressHex('ownerAddress', owner);
    const tokens = await (await this._contract).getTokensByOwner.callAsync(
      owner,
    );
    return tokens;
  }

  /**
   * @returns Returns the owner and timestamp for a given ticker
   */
  public getTickerDetails = async (params: TokenNameParams) => {
    assert.isString('tokenName', params.tokenName);
    return this._getTickerDetails(params.tokenName)
  }

  /**
   * @return Gets the ticker registration fee
   */
  public getTickerRegistrationFee = async () => {
    return await (await this._contract).getTickerRegistrationFee.callAsync();
  }

  /**
   * Registers the token ticker to the selected owner
   * Once the token ticker is registered to its owner then no other issuer can claim
   * its ownership. If the ticker expires and its issuer hasn't used it, then someone else can take it.
   */
  public registerTicker = async (params: RegisterTickerParams) => {
    const owner = !_.isUndefined(params.owner) ? params.owner : await this._getDefaultFromAddress();
    return (await this._contract).registerTicker.sendTransactionAsync(
      owner,
      params.ticker,
      params.tokenName,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Transfers the ownership of the ticker
   */
  public transferTickerOwnership = async (params: TransferTickerOwnershipParams) => {
    assert.isETHAddressHex('newOwner', params.newOwner);
    assert.isString('ticker', params.ticker);
    return (await this._contract).transferTickerOwnership.sendTransactionAsync(
      params.newOwner,
      params.ticker,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Deploys an instance of a new Security Token and records it to the registry
   */
  public generateSecurityToken = async (params: GenerateSecurityTokenParams) => {
    return (await this._contract).generateSecurityToken.sendTransactionAsync(
      params.name,
      params.ticker,
      params.details,
      params.divisible,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Gets the security token launch fee
   * @return Fee amount
   */
  public getSecurityTokenLaunchFee = async () => {
    return await (await this._contract).getSecurityTokenLaunchFee.callAsync();
  }

  /**
   * Returns the security token address by ticker symbol
   * @param ticker is the ticker of the security token
   * @return address string
   */
  public getSecurityTokenAddress = async (ticker: string) => {
    return await (await this._contract).getSecurityTokenAddress.callAsync(
      ticker,
    );
  }

  private _isTickerAvailable = (registrationDate: number, expiryDate: number, isDeployed: boolean) => {
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
  public isTickerAvailable = async (params: TokenNameParams) => {
    assert.isString('tokenName', params.tokenName);
    const result = await this._getTickerDetails(params.tokenName);
    return this._isTickerAvailable(result.registrationDate.toNumber(), result.expiryDate.toNumber(), result.status);
  }

  /**
   * Knows if the ticker was registered by the user
   * @return boolean
   */
  public isTickerRegisteredByCurrentIssuer = async (params: TokenNameParams) => {
    assert.isString('tokenName', params.tokenName);
    const result = await this._getTickerDetails(params.tokenName);
    if (this._isTickerAvailable(result.registrationDate.toNumber(), result.expiryDate.toNumber(), result.status)) {
      return false;
    } else {
      return (result.owner === await this._getDefaultFromAddress());
    }
  }

  /**
   * Knows if the ticker was launched
   * @return boolean
   */
  public isTokenLaunched = async (params: TokenNameParams) => {
    assert.isString('tokenName', params.tokenName);
    const result = await this._getTickerDetails(params.tokenName);
    return result.status;
  }

  /**
   * Modifies the ticker details. Only Polymath has the ability to do so.
   */
  public modifyTicker = async (params: ModifyTickerParams) => {
    return (await this._contract).modifyTicker.sendTransactionAsync(
      params.owner,
      params.ticker,
      params.tokenName,
      params.registrationDate,
      params.expiryDate,
      params.status,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Removes the ticker details, associated ownership & security token mapping
   */
  public removeTicker = async (params: RemoveTickerParams) => {
    return (await this._contract).removeTicker.sendTransactionAsync(
      params.ticker,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Changes the expiry time for the token ticker. Only available to Polymath.
   */
  public changeExpiryLimit = async (params: ChangeExpiryLimitParams) => {
    return (await this._contract).changeExpiryLimit.sendTransactionAsync(
      params.newExpiry,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Adds a new custom Security Token and saves it to the registry. (Token should follow the ISecurityToken interface)
   */
  public modifySecurityToken = async (params: ModifySecurityTokenParams) => {
    return (await this._contract).modifySecurityToken.sendTransactionAsync(
      params.owner,
      params.ticker,
      params.owner,
      params.securityToken,
      params.tokenDetails,
      params.deployedAt,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Checks that Security Token is registered
   */
  public isSecurityToken = async (params: SecurityTokenAddressParams) => {
    return await (await this._contract).isSecurityToken.callAsync(
      params.securityTokenAddress,
    );
  }

  /**
   * Allows the current owner to transfer control of the contract to a newOwner.
   */
  public transferOwnership = async (params: TransferOwnershipParams) => {
    return (await this._contract).transferOwnership.sendTransactionAsync(
      params.newOwner,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Called by the owner to pause, triggers stopped state
   */
  public pause = async (params: TxParams) => {
    return (await this._contract).pause.sendTransactionAsync(
      params.txData,
      params.safetyFactor,
    );
  }

  /**
   * Called by the owner to unpause, returns to normal state
   */
  public unpause = async (params: TxParams) => {
    return (await this._contract).unpause.sendTransactionAsync(
      params.txData,
      params.safetyFactor,
    );
  }

  /**
   * Sets the ticker registration fee in POLY tokens. Only Polymath.
   */
  public changeTickerRegistrationFee = async (params: ChangeFeeParams) => {
    return (await this._contract).changeTickerRegistrationFee.sendTransactionAsync(
      params.newFee,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Sets the ticker registration fee in POLY tokens. Only Polymath.
   */
  public changeSecurityLaunchFee = async (params: ChangeFeeParams) => {
    return (await this._contract).changeSecurityLaunchFee.sendTransactionAsync(
      params.newFee,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Reclaims all ERC20Basic compatible tokens
   */
  public reclaimERC20 = async (params: ReclaimERC20Params) => {
    return (await this._contract).reclaimERC20.sendTransactionAsync(
      params.tokenContract,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Changes the protocol version and the SecurityToken contract
   */
  public setProtocolVersion = async (params: SetProtocolVersionParams) => {
    return (await this._contract).setProtocolVersion.sendTransactionAsync(
      params.STFactoryAddress,
      params.major,
      params.minor,
      params.patch,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Returns the current STFactory Address
   */
  public getSTFactoryAddress = async () => {
    return await (await this._contract).getSTFactoryAddress.callAsync();
  }

  /**
   * Gets Protocol version
   */
  public getProtocolVersion = async () => {
    return await (await this._contract).getProtocolVersion.callAsync();
  }

  /**
   * Changes the PolyToken address. Only Polymath.
   */
  public updatePolyTokenAddress = async (params: UpdatePolyTokenAddressParams) => {
    return (await this._contract).updatePolyTokenAddress.sendTransactionAsync(
      params.newAddress,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Gets the expiry limit
   */
  public getExpiryLimit = async ()=> {
    return await (await this._contract).getExpiryLimit.callAsync();
  }

  /**
   * Check whether the registry is paused or not
   */
  public isPaused = async ()=> {
    return await (await this._contract).isPaused.callAsync();
  }

  /**
   * Gets the owner of the contract
   */
  public owner = async ()=> {
    return await (await this._contract).owner.callAsync();
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
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
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
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetSecurityTokenRegistryLogsAsyncParams = async <ArgsType extends SecurityTokenRegistryEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenRegistryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        (SecurityTokenRegistry as any).abi,
    );
    return logs;
  }

  private _getTickerDetails = async (tokenName: string) => {
    const result = await (await this._contract).getTickerDetails.callAsync(
      tokenName,
    );
    const typedResult: TickerDetails = {
      owner: result[0],
      registrationDate: result[1],
      expiryDate: result[2],
      tokenName: result[3],
      status: result[4],
    };
    return typedResult;
  }
}
