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
  SecurityTokenRegistryChangeTickerOwnershipEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { SecurityTokenRegistry } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import { schemas } from '@0x/json-schemas';
import { bigNumberToDate, dateToBigNumber } from '../../utils/convert';
import { TxParams, GetLogsAsyncParams, SubscribeAsyncParams, EventCallback, Subscribe, GetLogs } from '../../types';
import ContractWrapper from '../contract_wrapper';
import assert from '../../utils/assert';

const ZERO = '0x0000000000000000000000000000000000000000';

interface ChangeExpiryLimitSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeExpiryLimit;
  callback: EventCallback<SecurityTokenRegistryChangeExpiryLimitEventArgs>;
}

interface GetChangeExpiryLimitLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeExpiryLimit;
}

interface ChangeSecurityLaunchFeeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeSecurityLaunchFee;
  callback: EventCallback<SecurityTokenRegistryChangeSecurityLaunchFeeEventArgs>;
}

interface GetChangeSecurityLaunchFeeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeSecurityLaunchFee;
}

interface ChangeTickerOwnershipSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeTickerOwnership;
  callback: EventCallback<SecurityTokenRegistryChangeTickerOwnershipEventArgs>;
}

interface GetChangeTickerOwnershipLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeTickerOwnership;
}

interface ChangeTickerRegistrationFeeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeTickerRegistrationFee;
  callback: EventCallback<SecurityTokenRegistryChangeTickerRegistrationFeeEventArgs>;
}

interface GetChangeTickerRegistrationFeeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.ChangeTickerRegistrationFee;
}

interface NewSecurityTokenSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.NewSecurityToken;
  callback: EventCallback<SecurityTokenRegistryNewSecurityTokenEventArgs>;
}

interface GetNewSecurityTokenLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.NewSecurityToken;
}

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.OwnershipTransferred;
  callback: EventCallback<SecurityTokenRegistryOwnershipTransferredEventArgs>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.OwnershipTransferred;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.Pause;
  callback: EventCallback<SecurityTokenRegistryPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.Pause;
}

interface RegisterTickerSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.RegisterTicker;
  callback: EventCallback<SecurityTokenRegistryRegisterTickerEventArgs>;
}

interface GetRegisterTickerLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.RegisterTicker;
}

interface TickerRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.TickerRemoved;
  callback: EventCallback<SecurityTokenRegistryTickerRemovedEventArgs>;
}

interface GetTickerRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.TickerRemoved;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenRegistryEvents.Unpause;
  callback: EventCallback<SecurityTokenRegistryUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenRegistryEvents.Unpause;
}

interface SecurityTokenRegistrySubscribeAsyncParams extends Subscribe {
  (params: ChangeExpiryLimitSubscribeAsyncParams): Promise<string>;
  (params: ChangeSecurityLaunchFeeSubscribeAsyncParams): Promise<string>;
  (params: ChangeTickerOwnershipSubscribeAsyncParams): Promise<string>;
  (params: ChangeTickerRegistrationFeeSubscribeAsyncParams): Promise<string>;
  (params: NewSecurityTokenSubscribeAsyncParams): Promise<string>;
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: RegisterTickerSubscribeAsyncParams): Promise<string>;
  (params: TickerRemovedSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetSecurityTokenRegistryLogsAsyncParams extends GetLogs {
  (params: GetChangeExpiryLimitLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenRegistryChangeExpiryLimitEventArgs>[]
  >;
  (params: GetChangeSecurityLaunchFeeLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenRegistryChangeSecurityLaunchFeeEventArgs>[]
  >;
  (params: GetChangeTickerOwnershipLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenRegistryChangeTickerOwnershipEventArgs>[]
  >;
  (params: GetChangeTickerRegistrationFeeLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenRegistryChangeTickerRegistrationFeeEventArgs>[]
  >;
  (params: GetNewSecurityTokenLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenRegistryNewSecurityTokenEventArgs>[]
  >;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenRegistryOwnershipTransferredEventArgs>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenRegistryPauseEventArgs>[]>;
  (params: GetRegisterTickerLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenRegistryRegisterTickerEventArgs>[]
  >;
  (params: GetTickerRemovedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenRegistryTickerRemovedEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenRegistryUnpauseEventArgs>[]>;
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
  owner: string;
  ticker: string;
  tokenName: string;
  registrationDate: Date;
  expiryDate: Date;
  status: boolean;
}

/**
 * @param ticker is the token ticker
 */
interface RemoveTickerParams extends TxParams {
  ticker: string;
}

/**
 * @param newExpiry is the new expiry for newly generated tickers
 */
interface ChangeExpiryLimitParams extends TxParams {
  newExpiry: BigNumber;
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
  name: string;
  ticker: string;
  owner: string;
  securityToken: string;
  tokenDetails: string;
  deployedAt: Date;
}

/**
 * @param newOwner The address to transfer ownership to.
 */
interface TransferOwnershipParams extends TxParams {
  newOwner: string;
}

interface ChangeFeeParams extends TxParams {
  newFee: BigNumber;
}

/**
 * @param tokenContract is the address of the token contract
 */
interface ReclaimERC20Params extends TxParams {
  tokenContract: string;
}

/**
 * @param STFactoryAddress is the address of the proxy.
 * @param major Major version of the proxy.
 * @param minor Minor version of the proxy.
 * @param patch Patch version of the proxy
 */
interface SetProtocolVersionParams extends TxParams {
  STFactoryAddress: string;
  major: number;
  minor: number;
  patch: number;
}

/**
 * @param newAddress is the address of the polytoken.
 */
interface UpdatePolyTokenAddressParams extends TxParams {
  newAddress: string;
}

// // Return types ////
interface SecurityTokenData {
  ticker: string;
  owner: string;
  tokenDetails: string;
  deployedAt: Date;
}

interface TickerDetails {
  owner: string;
  registrationDate: Date;
  expiryDate: Date;
  tokenName: string;
  status: boolean;
}
// // End of return types ////

/**
 * This class includes the functionality related to interacting with the SecurityTokenRegistry contract.
 */
export default class SecurityTokenRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = SecurityTokenRegistry.abi;

  protected contract: Promise<SecurityTokenRegistryContract>;

  /**
   * Instantiate SecurityTokenRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<SecurityTokenRegistryContract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * @returns Returns the list of tickers owned by the selected address
   */
  public getTickersByOwner = async (params?: OwnerParams) => {
    const owner =
      !_.isUndefined(params) && !_.isUndefined(params.owner) ? params.owner : await this.getDefaultFromAddress();
    assert.isETHAddressHex('owner', owner);
    const tickers = await (await this.contract).getTickersByOwner.callAsync(owner);
    return tickers;
  };

  /**
   * @returns Returns the security token data by address
   */
  public getSecurityTokenData = async (params: SecurityTokenAddressParams) => {
    assert.isETHAddressHex('securityTokenAddress', params.securityTokenAddress);
    const result = await (await this.contract).getSecurityTokenData.callAsync(params.securityTokenAddress);
    const typedResult: SecurityTokenData = {
      ticker: result[0],
      owner: result[1],
      tokenDetails: result[2],
      deployedAt: bigNumberToDate(result[3]),
    };
    return typedResult;
  };

  /**
   * @returns Returns the list of tokens owned by the selected address
   */
  public getTokensByOwner = async (params?: OwnerParams) => {
    const owner =
      !_.isUndefined(params) && !_.isUndefined(params.owner) ? params.owner : await this.getDefaultFromAddress();
    assert.isETHAddressHex('ownerAddress', owner);
    const tokens = await (await this.contract).getTokensByOwner.callAsync(owner);
    return tokens;
  };

  /**
   * @returns Returns the owner and timestamp for a given ticker
   */
  public getTickerDetails = async (params: TokenNameParams) => {
    return this.getTickerDetailsInternal(params.tokenName);
  };

  /**
   * @return Gets the ticker registration fee
   */
  public getTickerRegistrationFee = async () => {
    return (await this.contract).getTickerRegistrationFee.callAsync();
  };

  /**
   * Registers the token ticker to the selected owner
   * Once the token ticker is registered to its owner then no other issuer can claim
   * its ownership. If the ticker expires and its issuer hasn't used it, then someone else can take it.
   */
  public registerTicker = async (params: RegisterTickerParams) => {
    const owner = !_.isUndefined(params.owner) ? params.owner : await this.getDefaultFromAddress();
    assert.isETHAddressHex('owner', owner);
    assert.assert(params.ticker.length > 0, 'Ticker is empty');
    assert.assert(params.ticker.length <= 10, 'Ticker length can not be greater than 10');
    assert.assert(
      await this.isTickerAvailable({
        tokenName: params.ticker,
      }),
      'Ticker is not available',
    );
    // TODO: Verify allowance
    return (await this.contract).registerTicker.sendTransactionAsync(
      owner,
      params.ticker,
      params.tokenName,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Transfers the ownership of the ticker
   */
  public transferTickerOwnership = async (params: TransferTickerOwnershipParams) => {
    assert.isETHAddressHex('newOwner', params.newOwner);
    assert.assert(params.newOwner !== ZERO, 'Invalid address');
    const tickerDetails = await this.getTickerDetails({
      tokenName: params.ticker,
    });
    const address = (await this.web3Wrapper.getAvailableAddressesAsync())[0];
    assert.assert(address === tickerDetails.owner, 'Not authorised');
    // TODO verify new owner match with token owner
    return (await this.contract).transferTickerOwnership.sendTransactionAsync(
      params.newOwner,
      params.ticker,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Deploys an instance of a new Security Token and records it to the registry
   */
  public generateSecurityToken = async (params: GenerateSecurityTokenParams) => {
    assert.assert(params.ticker.length > 0, 'Ticker is empty');
    assert.assert(params.name.length > 0, 'Name is empty');
    const tickerDetails = await this.getTickerDetails({
      tokenName: params.ticker,
    });
    assert.assert(!tickerDetails.status, 'Ticker already deployed');
    const address = (await this.web3Wrapper.getAvailableAddressesAsync())[0];
    assert.assert(address === tickerDetails.owner, 'Not authorised');
    assert.assert(tickerDetails.expiryDate.getTime() >= Date.now(), 'Ticker gets expired');
    return (await this.contract).generateSecurityToken.sendTransactionAsync(
      params.name,
      params.ticker,
      params.details,
      params.divisible,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Gets the security token launch fee
   * @return Fee amount
   */
  public getSecurityTokenLaunchFee = async () => {
    return (await this.contract).getSecurityTokenLaunchFee.callAsync();
  };

  /**
   * Returns the security token address by ticker symbol
   * @param ticker is the ticker of the security token
   * @return address string
   */
  public getSecurityTokenAddress = async (ticker: string) => {
    return (await this.contract).getSecurityTokenAddress.callAsync(ticker);
  };

  /**
   * Gets ticker availability
   * @return boolean
   */
  public isTickerAvailable = async (params: TokenNameParams) => {
    const result = await this.getTickerDetailsInternal(params.tokenName);
    return this.isTickerAvailableInternal(result.registrationDate, result.expiryDate, result.status);
  };

  /**
   * Knows if the ticker was registered by the user
   * @return boolean
   */
  public isTickerRegisteredByCurrentIssuer = async (params: TokenNameParams) => {
    const result = await this.getTickerDetailsInternal(params.tokenName);
    if (this.isTickerAvailableInternal(result.registrationDate, result.expiryDate, result.status)) {
      return false;
    }
    return result.owner === (await this.getDefaultFromAddress());
  };

  /**
   * Knows if the ticker was launched
   * @return boolean
   */
  public isTokenLaunched = async (params: TokenNameParams) => {
    const result = await this.getTickerDetailsInternal(params.tokenName);
    return result.status;
  };

  /**
   * Modifies the ticker details. Only Polymath has the ability to do so.
   */
  public modifyTicker = async (params: ModifyTickerParams) => {
    assert.assert(params.ticker.length > 0, 'Ticker is empty');
    assert.assert(params.ticker.length <= 10, 'Ticker length can not be greater than 10');
    assert.assert(
      params.registrationDate.getTime() <= params.expiryDate.getTime(),
      'Registration date should < expiry date',
    );
    assert.isETHAddressHex('owner', params.owner);
    if (params.status) {
      const address = await this.getSecurityTokenAddress(params.ticker);
      assert.assert(address !== ZERO, 'Token not registered');
    }
    return (await this.contract).modifyTicker.sendTransactionAsync(
      params.owner,
      params.ticker,
      params.tokenName,
      dateToBigNumber(params.registrationDate),
      dateToBigNumber(params.expiryDate),
      params.status,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Removes the ticker details, associated ownership & security token mapping
   */
  public removeTicker = async (params: RemoveTickerParams) => {
    const ticker = await this.getTickerDetails({
      tokenName: params.ticker,
    });
    assert.assert(ticker.owner !== ZERO, "Ticker doesn't exist");
    return (await this.contract).removeTicker.sendTransactionAsync(params.ticker, params.txData, params.safetyFactor);
  };

  /**
   * Changes the expiry time for the token ticker. Only available to Polymath.
   */
  public changeExpiryLimit = async (params: ChangeExpiryLimitParams) => {
    assert.assert(params.newExpiry.toNumber() >= 86400, 'Expiry should >= 1 day');
    return (await this.contract).changeExpiryLimit.sendTransactionAsync(
      params.newExpiry,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Adds a new custom Security Token and saves it to the registry. (Token should follow the ISecurityToken interface)
   */
  public modifySecurityToken = async (params: ModifySecurityTokenParams) => {
    assert.assert(params.ticker.length > 0, 'Ticker is empty');
    assert.assert(params.name.length > 0, 'Name is empty');
    assert.assert(params.ticker.length <= 10, 'Ticker length can not be greater than 10');
    assert.isETHAddressHex('owner', params.owner);
    assert.assert(params.owner !== ZERO, '0 value params not allowed');
    assert.isETHAddressHex('securityToken', params.securityToken);
    assert.assert(params.securityToken !== ZERO, 'ST address is 0x');
    return (await this.contract).modifySecurityToken.sendTransactionAsync(
      params.owner,
      params.ticker,
      params.owner,
      params.securityToken,
      params.tokenDetails,
      dateToBigNumber(params.deployedAt),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Checks that Security Token is registered
   */
  public isSecurityToken = async (params: SecurityTokenAddressParams) => {
    assert.isETHAddressHex('securityTokenAddress', params.securityTokenAddress);
    return (await this.contract).isSecurityToken.callAsync(params.securityTokenAddress);
  };

  /**
   * Allows the current owner to transfer control of the contract to a newOwner.
   */
  public transferOwnership = async (params: TransferOwnershipParams) => {
    assert.isETHAddressHex('newOwner', params.newOwner);
    assert.assert(params.newOwner !== ZERO, 'Invalid address');
    return (await this.contract).transferOwnership.sendTransactionAsync(
      params.newOwner,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Called by the owner to pause, triggers stopped state
   */
  public pause = async (params: TxParams) => {
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Called by the owner to unpause, returns to normal state
   */
  public unpause = async (params: TxParams) => {
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Sets the ticker registration fee in POLY tokens. Only Polymath.
   */
  public changeTickerRegistrationFee = async (params: ChangeFeeParams) => {
    const actualFee = await this.getTickerRegistrationFee();
    assert.assert(!actualFee.eq(params.newFee), 'Fee not changed');
    return (await this.contract).changeTickerRegistrationFee.sendTransactionAsync(
      params.newFee,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Sets the ticker registration fee in POLY tokens. Only Polymath.
   */
  public changeSecurityLaunchFee = async (params: ChangeFeeParams) => {
    const actualFee = await this.getSecurityTokenLaunchFee();
    assert.assert(!actualFee.eq(params.newFee), 'Fee not changed');
    return (await this.contract).changeSecurityLaunchFee.sendTransactionAsync(
      params.newFee,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Reclaims all ERC20Basic compatible tokens
   */
  public reclaimERC20 = async (params: ReclaimERC20Params) => {
    assert.isETHAddressHex('tokenContract', params.tokenContract);
    assert.assert(params.tokenContract !== ZERO, 'Invalid address');
    return (await this.contract).reclaimERC20.sendTransactionAsync(
      params.tokenContract,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Changes the protocol version and the SecurityToken contract
   */
  public setProtocolVersion = async (params: SetProtocolVersionParams) => {
    assert.isETHAddressHex('STFactoryAddress', params.STFactoryAddress);
    assert.assert(params.STFactoryAddress !== ZERO, '0x address is not allowed');
    return (await this.contract).setProtocolVersion.sendTransactionAsync(
      params.STFactoryAddress,
      params.major,
      params.minor,
      params.patch,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Returns the current STFactory Address
   */
  public getSTFactoryAddress = async () => {
    return (await this.contract).getSTFactoryAddress.callAsync();
  };

  /**
   * Gets Protocol version
   */
  public getProtocolVersion = async () => {
    return (await this.contract).getProtocolVersion.callAsync();
  };

  /**
   * Changes the PolyToken address. Only Polymath.
   */
  public updatePolyTokenAddress = async (params: UpdatePolyTokenAddressParams) => {
    assert.isETHAddressHex('newAddress', params.newAddress);
    assert.assert(params.newAddress !== ZERO, 'Invalid address');
    return (await this.contract).updatePolyTokenAddress.sendTransactionAsync(
      params.newAddress,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Gets the expiry limit
   */
  public getExpiryLimit = async () => {
    return (await this.contract).getExpiryLimit.callAsync();
  };

  /**
   * Check whether the registry is paused or not
   */
  public isPaused = async () => {
    return (await this.contract).isPaused.callAsync();
  };

  /**
   * Gets the owner of the contract
   */
  public owner = async () => {
    return (await this.contract).owner.callAsync();
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: SecurityTokenRegistrySubscribeAsyncParams = async <
    ArgsType extends SecurityTokenRegistryEventArgs
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenRegistryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      SecurityTokenRegistry.abi,
      params.callback,
      !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetSecurityTokenRegistryLogsAsyncParams = async <
    ArgsType extends SecurityTokenRegistryEventArgs
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenRegistryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      SecurityTokenRegistry.abi,
    );
    return logs;
  };

  private isTickerAvailableInternal = (registrationDate: Date, expiryDate: Date, isDeployed: boolean) => {
    if (registrationDate.getTime() === new Date(0).getTime()) {
      return true;
    }
    if (!isDeployed && expiryDate.getTime() > Date.now()) {
      return true;
    }
    return false;
  };

  private getTickerDetailsInternal = async (tokenName: string) => {
    const result = await (await this.contract).getTickerDetails.callAsync(tokenName);
    const typedResult: TickerDetails = {
      owner: result[0],
      registrationDate: bigNumberToDate(result[1]),
      expiryDate: bigNumberToDate(result[2]),
      tokenName: result[3],
      status: result[4],
    };
    return typedResult;
  };
}
