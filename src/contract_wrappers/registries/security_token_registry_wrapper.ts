import {
  ISecurityTokenRegistryContract,
  ISecurityTokenRegistryEvents,
  ISecurityTokenRegistryEventArgs,
  ISecurityTokenRegistryChangeExpiryLimitEventArgs,
  ISecurityTokenRegistryChangeSecurityLaunchFeeEventArgs,
  ISecurityTokenRegistryChangeTickerRegistrationFeeEventArgs,
  ISecurityTokenRegistryNewSecurityTokenEventArgs,
  ISecurityTokenRegistryOwnershipTransferredEventArgs,
  ISecurityTokenRegistryPauseEventArgs,
  ISecurityTokenRegistryUnpauseEventArgs,
  ISecurityTokenRegistryRegisterTickerEventArgs,
  ISecurityTokenRegistryTickerRemovedEventArgs,
  ISecurityTokenRegistryChangeTickerOwnershipEventArgs,
  ISecurityTokenRegistryChangeFeeCurrencyEventArgs,
  ISecurityTokenRegistryNewSecurityTokenCreatedEventArgs,
  ISecurityTokenRegistrySecurityTokenRefreshedEventArgs,
  ISecurityTokenRegistryProtocolFactorySetEventArgs,
  ISecurityTokenRegistryLatestVersionSetEventArgs,
  ISecurityTokenRegistryProtocolFactoryRemovedEventArgs,
  ISecurityTokenContract,
  PolyTokenContract,
} from '@polymathnetwork/abi-wrappers';
import { ISecurityTokenRegistry } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { schemas } from '@0x/json-schemas';
import assert from '../../utils/assert';
import ContractWrapper from '../contract_wrapper';
import ContractFactory from '../../factories/contractFactory';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Subscribe,
  GetLogs,
  FULL_DECIMALS,
  FeeType,
} from '../../types';
import {
  bigNumberToDate,
  dateToBigNumber,
  bytes32ArrayToStringArray,
  weiToValue,
  valueToWei,
  packVersion,
  stringToBytes32,
} from '../../utils/convert';
import functionsUtils from '../../utils/functions_utils';

const BIG_NUMBER_ZERO = new BigNumber(0);

interface ChangeFeeCurrencySubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.ChangeFeeCurrency;
  callback: EventCallback<ISecurityTokenRegistryChangeFeeCurrencyEventArgs>;
}

interface GetChangeFeeCurrencyLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.ChangeFeeCurrency;
}

interface NewSecurityTokenCreatedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.NewSecurityTokenCreated;
  callback: EventCallback<ISecurityTokenRegistryNewSecurityTokenCreatedEventArgs>;
}

interface GetNewSecurityTokenCreatedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.NewSecurityTokenCreated;
}

interface SecurityTokenRefreshedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.SecurityTokenRefreshed;
  callback: EventCallback<ISecurityTokenRegistrySecurityTokenRefreshedEventArgs>;
}

interface GetSecurityTokenRefreshedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.SecurityTokenRefreshed;
}

interface ProtocolFactorySetSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.ProtocolFactorySet;
  callback: EventCallback<ISecurityTokenRegistryProtocolFactorySetEventArgs>;
}

interface GetProtocolFactorySetLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.ProtocolFactorySet;
}

interface LatestVersionSetSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.LatestVersionSet;
  callback: EventCallback<ISecurityTokenRegistryLatestVersionSetEventArgs>;
}

interface GetLatestVersionSetLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.LatestVersionSet;
}

interface ProtocolFactoryRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.ProtocolFactoryRemoved;
  callback: EventCallback<ISecurityTokenRegistryProtocolFactoryRemovedEventArgs>;
}

interface GetProtocolFactoryRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.ProtocolFactoryRemoved;
}

interface ChangeExpiryLimitSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.ChangeExpiryLimit;
  callback: EventCallback<ISecurityTokenRegistryChangeExpiryLimitEventArgs>;
}

interface GetChangeExpiryLimitLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.ChangeExpiryLimit;
}

interface ChangeSecurityLaunchFeeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.ChangeSecurityLaunchFee;
  callback: EventCallback<ISecurityTokenRegistryChangeSecurityLaunchFeeEventArgs>;
}

interface GetChangeSecurityLaunchFeeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.ChangeSecurityLaunchFee;
}

interface ChangeTickerOwnershipSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.ChangeTickerOwnership;
  callback: EventCallback<ISecurityTokenRegistryChangeTickerOwnershipEventArgs>;
}

interface GetChangeTickerOwnershipLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.ChangeTickerOwnership;
}

interface ChangeTickerRegistrationFeeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.ChangeTickerRegistrationFee;
  callback: EventCallback<ISecurityTokenRegistryChangeTickerRegistrationFeeEventArgs>;
}

interface GetChangeTickerRegistrationFeeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.ChangeTickerRegistrationFee;
}

interface NewSecurityTokenSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.NewSecurityToken;
  callback: EventCallback<ISecurityTokenRegistryNewSecurityTokenEventArgs>;
}

interface GetNewSecurityTokenLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.NewSecurityToken;
}

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.OwnershipTransferred;
  callback: EventCallback<ISecurityTokenRegistryOwnershipTransferredEventArgs>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.OwnershipTransferred;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.Pause;
  callback: EventCallback<ISecurityTokenRegistryPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.Pause;
}

interface RegisterTickerSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.RegisterTicker;
  callback: EventCallback<ISecurityTokenRegistryRegisterTickerEventArgs>;
}

interface GetRegisterTickerLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.RegisterTicker;
}

interface TickerRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.TickerRemoved;
  callback: EventCallback<ISecurityTokenRegistryTickerRemovedEventArgs>;
}

interface GetTickerRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.TickerRemoved;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ISecurityTokenRegistryEvents.Unpause;
  callback: EventCallback<ISecurityTokenRegistryUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ISecurityTokenRegistryEvents.Unpause;
}

interface SecurityTokenRegistrySubscribeAsyncParams extends Subscribe {
  (params: ChangeFeeCurrencySubscribeAsyncParams): Promise<string>;
  (params: NewSecurityTokenCreatedSubscribeAsyncParams): Promise<string>;
  (params: SecurityTokenRefreshedSubscribeAsyncParams): Promise<string>;
  (params: ProtocolFactorySetSubscribeAsyncParams): Promise<string>;
  (params: LatestVersionSetSubscribeAsyncParams): Promise<string>;
  (params: ProtocolFactoryRemovedSubscribeAsyncParams): Promise<string>;
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

interface GetISecurityTokenRegistryLogsAsyncParams extends GetLogs {
  (params: GetChangeFeeCurrencyLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenRegistryChangeFeeCurrencyEventArgs>[]
  >;
  (params: GetNewSecurityTokenCreatedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenRegistryNewSecurityTokenCreatedEventArgs>[]
  >;
  (params: GetSecurityTokenRefreshedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenRegistrySecurityTokenRefreshedEventArgs>[]
  >;
  (params: GetProtocolFactorySetLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenRegistryProtocolFactorySetEventArgs>[]
  >;
  (params: GetLatestVersionSetLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenRegistryLatestVersionSetEventArgs>[]
  >;
  (params: GetProtocolFactoryRemovedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenRegistryProtocolFactoryRemovedEventArgs>[]
  >;
  (params: GetChangeExpiryLimitLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenRegistryChangeExpiryLimitEventArgs>[]
  >;
  (params: GetChangeSecurityLaunchFeeLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenRegistryChangeSecurityLaunchFeeEventArgs>[]
  >;
  (params: GetChangeTickerOwnershipLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenRegistryChangeTickerOwnershipEventArgs>[]
  >;
  (params: GetChangeTickerRegistrationFeeLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenRegistryChangeTickerRegistrationFeeEventArgs>[]
  >;
  (params: GetNewSecurityTokenLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenRegistryNewSecurityTokenEventArgs>[]
  >;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenRegistryOwnershipTransferredEventArgs>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<ISecurityTokenRegistryPauseEventArgs>[]>;
  (params: GetRegisterTickerLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenRegistryRegisterTickerEventArgs>[]
  >;
  (params: GetTickerRemovedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenRegistryTickerRemovedEventArgs>[]
  >;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<ISecurityTokenRegistryUnpauseEventArgs>[]>;
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
 * @param feeType Key corresponding to fee type
 */
interface GetFeesParams {
  feeType: FeeType;
}

/**
 * @param ticker Ticker whose status need to determine
 */
interface TickerParams {
  ticker: string;
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
 * @param tokenDetails is the off-chain details of the token
 * @param divisible is whether or not the token is divisible
 * @param treasuryWallet Ethereum address which will holds the STs.
 * @param protocolVersion Version of securityToken contract
 */
interface NewSecurityTokenParams extends TxParams {
  name: string;
  ticker: string;
  tokenDetails: string;
  divisible: boolean;
  treasuryWallet: string;
  protocolVersion: string;
}

/**
 * @param tickerRegFee is the ticker registration fee (base 18 decimals)
 * @param stLaunchFee is the st generation fee (base 18 decimals)
 * @param isFeeInPoly defines if the fee is in poly or usd
 */
interface ChangeFeesAmountAndCurrencyParams extends TxParams {
  tickerRegFee: BigNumber;
  stLaunchFee: BigNumber;
  isFeeInPoly: boolean;
}

/**
 * @param name is the name of the token
 * @param ticker is the ticker symbol of the security token
 * @param tokenDetails is the off-chain details of the token
 * @param divisible is whether or not the token is divisible
 */
interface RefreshSecurityTokenParams extends TxParams {
  name: string;
  ticker: string;
  tokenDetails: string;
  divisible: boolean;
  treasuryWallet: string;
}

/**
 * @param ticker is the ticker symbol of the security token
 * @param owner is the owner of the token
 * @param securityToken is the address of the securityToken
 * @param tokenDetails is the off-chain details of the token
 * @param deployedAt is the timestamp at which the security token is deployed
 */
interface ModifyExistingSecurityTokenParams extends TxParams {
  ticker: string;
  owner: string;
  securityToken: string;
  tokenDetails: string;
  deployedAt: Date;
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
 * @param version of the proxy.
 */
interface PackageVersionParams extends TxParams {
  version: string;
}

/**
 * @param owner is the owner of the token
 * @param ticker is the token ticker
 * @param registrationDate is the date at which ticker is registered
 * @param expiryDate is the expiry date for the ticker
 * @param status is the token deployment status
 */
interface ModifyExistingTickerParams extends TxParams {
  owner: string;
  ticker: string;
  registrationDate: Date;
  expiryDate: Date;
  status: boolean;
}

/**
 * @param STFactoryAddress is the address of the proxy.
 */
interface SetProtocolFactoryParams extends PackageVersionParams {
  STFactoryAddress: string;
}

/**
 * @param owner is address of the owner of the token
 * @param ticker is unique token ticker
 */
interface RegisterNewTickerParams extends TxParams {
  owner: string;
  ticker: string;
}

// // Return types ////
interface SecurityTokenData {
  ticker: string;
  owner: string;
  tokenDetails: string;
  deployedAt: Date;
  version: string;
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
 * This class includes the functionality related to interacting with the ISecurityTokenRegistry contract.
 */
export default class SecurityTokenRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = ISecurityTokenRegistry.abi;

  protected contract: Promise<ISecurityTokenRegistryContract>;

  protected contractFactory: ContractFactory;

  protected securityTokenContract = async (address: string): Promise<ISecurityTokenContract> => {
    return this.contractFactory.getSecurityTokenContract(address);
  };

  protected polyTokenContract = async (): Promise<PolyTokenContract> => {
    return this.contractFactory.getPolyTokenContract();
  };

  /**
   * Instantiate ISecurityTokenRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<ISecurityTokenRegistryContract>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract);
    this.contract = contract;
    this.contractFactory = contractFactory;
  }

  /**
   * @returns Returns the list of tickers owned by the selected address
   */
  public getTickersByOwner = async (params?: OwnerParams) => {
    const owner =
      params !== undefined && params.owner !== undefined ? params.owner : await this.getDefaultFromAddress();
    assert.isETHAddressHex('owner', owner);
    const tickers = await (await this.contract).getTickersByOwner.callAsync(owner);
    return bytes32ArrayToStringArray(tickers);
  };

  /**
   * @returns Returns the security token data by address
   */
  public getSecurityTokenData = async (params: SecurityTokenAddressParams) => {
    assert.isETHAddressHex('securityTokenAddress', params.securityTokenAddress);
    const result = await (await this.contract).getSecurityTokenData.callAsync(params.securityTokenAddress);
    const unpackVersion = result[4].map(num => {
      return num.toNumber();
    });
    const typedResult: SecurityTokenData = {
      ticker: result[0],
      owner: result[1],
      tokenDetails: result[2],
      deployedAt: bigNumberToDate(result[3]),
      version: unpackVersion.join('.'),
    };
    return typedResult;
  };

  /**
   * Gets the fee currency
   * @returns true = poly, false = usd
   */
  public getIsFeeInPoly = async () => {
    const result = await (await this.contract).getIsFeeInPoly.callAsync();
    return result;
  };

  /**
   * Sets the ticker registration and ST launch fee amount and currency
   */
  public changeFeesAmountAndCurrency = async (params: ChangeFeesAmountAndCurrencyParams) => {
    const isOldFeesInPoly = await this.getIsFeeInPoly();
    assert.assert(isOldFeesInPoly !== params.isFeeInPoly, 'Currency unchanged');
    return (await this.contract).changeFeesAmountAndCurrency.sendTransactionAsync(
      valueToWei(params.tickerRegFee, FULL_DECIMALS),
      valueToWei(params.stLaunchFee, FULL_DECIMALS),
      params.isFeeInPoly,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Deploys an instance of a new Security Token and replaces the old one in the registry
   * This can be used to upgrade from version 2.0 of ST to 3.0 or in case something goes wrong with earlier ST
   */
  public refreshSecurityToken = async (params: RefreshSecurityTokenParams) => {
    await this.checkWhenNotPausedOrOwner();
    assert.assert(params.name.length > 0, 'Name is empty');
    assert.assert(params.ticker.length > 0, 'Ticker is empty');
    assert.isNonZeroETHAddressHex('treasuryWallet', params.treasuryWallet);
    const tickerDetails = await this.getTickerDetails({
      tokenName: params.ticker,
    });
    assert.assert(tickerDetails.status, 'Not deployed');
    const isFrozen = await (await this.securityTokenContract(
      await this.getSecurityTokenAddress(params.ticker),
    )).transfersFrozen.callAsync();
    assert.assert(isFrozen, 'Transfers not frozen');
    return (await this.contract).refreshSecurityToken.sendTransactionAsync(
      params.name,
      params.ticker,
      params.tokenDetails,
      params.divisible,
      params.treasuryWallet,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Removes a STFactory
   */
  public removeProtocolFactory = async (params: PackageVersionParams) => {
    await this.checkOnlyOwner();
    const LATEST_VERSION = await this.getLatestProtocolVersion();
    assert.isValidVersion(params.version);
    const splitVersion = params.version.split('.');
    const major = new BigNumber(splitVersion[0]);
    const minor = new BigNumber(splitVersion[1]);
    const patch = new BigNumber(splitVersion[2]);
    const VERSION = [major, minor, patch];
    assert.assert(JSON.stringify(LATEST_VERSION) === JSON.stringify(VERSION), 'Cannot remove latestVersion');
    return (await this.contract).removeProtocolFactory.sendTransactionAsync(
      major,
      minor,
      patch,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Returns the list of tokens to which the delegate has some access
   */
  public getTokensByDelegate = async (delegate: string) => {
    const result = await (await this.contract).getTokensByDelegate.callAsync(delegate);
    return result;
  };

  /**
   * Returns the STFactory Address of a particular version
   */
  public getSTFactoryAddressOfVersion = async (params: PackageVersionParams) => {
    assert.isValidVersion(params.version);
    const splitVersion = params.version.split('.');
    const pack = packVersion(splitVersion[0], splitVersion[1], splitVersion[2]);
    const result = await (await this.contract).getSTFactoryAddressOfVersion.callAsync(new BigNumber(pack));
    return result;
  };

  /**
   * @returns Returns the list of tokens owned by the selected address
   */
  public getTokensByOwner = async (params?: OwnerParams) => {
    const owner =
      params !== undefined && params.owner !== undefined ? params.owner : await this.getDefaultFromAddress();
    assert.isETHAddressHex('ownerAddress', owner);
    const tokens = await (await this.contract).getTokensByOwner.callAsync(owner);
    return tokens;
  };

  public generateNewSecurityToken = async (params: NewSecurityTokenParams) => {
    assert.assert(params.ticker.length > 0, 'Ticker is empty');
    assert.assert(params.name.length > 0, 'Name is empty');
    await this.checkWhenNotPausedOrOwner();
    const tickerDetails = await this.getTickerDetails({
      tokenName: params.ticker,
    });
    assert.assert(!tickerDetails.status, 'Ticker already deployed');
    const address = (await this.web3Wrapper.getAvailableAddressesAsync())[0];
    assert.assert(functionsUtils.checksumAddressComparision(address, tickerDetails.owner), 'Not authorised');
    assert.assert(tickerDetails.expiryDate.getTime() >= Date.now(), 'Ticker gets expired');

    // Check PolyToken allowance
    const securityTokenLaunchFee = await this.getSecurityTokenLaunchFee();
    if (securityTokenLaunchFee.isGreaterThan(BIG_NUMBER_ZERO)) {
      const polyBalance = weiToValue(
          await (await this.polyTokenContract()).balanceOf.callAsync(address),
          FULL_DECIMALS,
      );
      assert.assert(polyBalance.isGreaterThanOrEqualTo(securityTokenLaunchFee), 'Insufficient Poly token allowance');
    }

    const version = params.protocolVersion;
    let protocolVersion = new BigNumber(0);
    if (version !== '0') {
      assert.isValidVersion(version);
      const v = version.split('.');
      protocolVersion = new BigNumber(packVersion(v[0], v[1], v[3]));
    }
    return (await this.contract).generateNewSecurityToken.sendTransactionAsync(
      params.name,
      params.ticker,
      params.tokenDetails,
      params.divisible,
      params.treasuryWallet,
      protocolVersion,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Registers the token ticker to the selected owner
   * Once the token ticker is registered to its owner then no other issuer can claim
   * its ownership. If the ticker expires and its issuer hasn't used it, then someone else can take it.
   */
  public registerNewTicker = async (params: RegisterNewTickerParams) => {
    await this.checkWhenNotPausedOrOwner();
    const owner = params.owner !== undefined ? params.owner : await this.getDefaultFromAddress();
    await this.checkRegisterTickerRequirements(params.ticker, owner);
    return (await this.contract).registerNewTicker.sendTransactionAsync(
      params.owner,
      params.ticker,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Modifies the ticker details. Only Polymath has the ability to do so.
   * Only allowed to modify the tickers which are not yet deployed.
   */
  public modifyExistingTicker = async (params: ModifyExistingTickerParams) => {
    await this.checkOnlyOwner();
    assert.assert(params.ticker.length > 0 && params.ticker.length <= 10, 'Bad ticker');
    assert.assert(params.expiryDate.getTime() > new Date(0).getTime(), 'Bad expiry date');
    assert.assert(params.registrationDate.getTime() > new Date(0).getTime(), 'Bad registration date');
    assert.isNonZeroETHAddressHex('owner', params.owner);
    return (await this.contract).modifyExistingTicker.sendTransactionAsync(
      params.owner,
      params.ticker,
      dateToBigNumber(params.registrationDate),
      dateToBigNumber(params.expiryDate),
      params.status,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Adds a new custom Security Token and saves it to the registry. (Token should follow the ISecurityToken interface)
   */
  public modifyExistingSecurityToken = async (params: ModifyExistingSecurityTokenParams) => {
    await this.checkOnlyOwner();
    assert.assert(params.ticker.length > 0 && params.ticker.length <= 10, 'Bad ticker');
    assert.assert(params.deployedAt.getTime() > new Date(0).getTime(), 'Bad deployed date');
    assert.isNonZeroETHAddressHex('owner', params.owner);
    return (await this.contract).modifyExistingSecurityToken.sendTransactionAsync(
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
   * @returns Returns the owner and timestamp for a given ticker
   */
  public getTickerDetails = async (params: TokenNameParams) => {
    return this.getTickerDetailsInternal(params.tokenName);
  };

  /**
   * @return Gets the ticker registration fee
   */
  public getTickerRegistrationFee = async () => {
    return weiToValue(await (await this.contract).getTickerRegistrationFee.callAsync(), FULL_DECIMALS);
  };

  /**
   * Registers the token ticker to the selected owner
   * Once the token ticker is registered to its owner then no other issuer can claim
   * its ownership. If the ticker expires and its issuer hasn't used it, then someone else can take it.
   */
  public registerTicker = async (params: RegisterTickerParams) => {
    await this.checkWhenNotPausedOrOwner();
    const owner = params.owner !== undefined ? params.owner : await this.getDefaultFromAddress();
    await this.checkRegisterTickerRequirements(params.ticker, owner);
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
    assert.isNonZeroETHAddressHex('newOwner', params.newOwner);
    await this.checkWhenNotPausedOrOwner();
    const tickerDetails = await this.getTickerDetails({
      tokenName: params.ticker,
    });
    const address = await this.getCallerAddress(params.txData);
    assert.assert(functionsUtils.checksumAddressComparision(address, tickerDetails.owner), 'Not authorised');
    if (tickerDetails.status) {
      const securityTokenOwner = await (await this.securityTokenContract(
        await this.getSecurityTokenAddress(params.ticker),
      )).owner.callAsync();
      assert.assert(securityTokenOwner === params.newOwner, 'New owner does not match token owner');
    }
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
    await this.checkWhenNotPausedOrOwner();
    const tickerDetails = await this.getTickerDetails({
      tokenName: params.ticker,
    });
    assert.assert(!tickerDetails.status, 'Ticker already deployed');
    const address = (await this.web3Wrapper.getAvailableAddressesAsync())[0];
    assert.assert(functionsUtils.checksumAddressComparision(address, tickerDetails.owner), 'Not authorised');
    assert.assert(tickerDetails.expiryDate.getTime() >= Date.now(), 'Ticker gets expired');

    // Check PolyToken allowance
    const securityTokenLaunchFee = await this.getSecurityTokenLaunchFee();
    if (securityTokenLaunchFee.isGreaterThan(BIG_NUMBER_ZERO)) {
      const polyBalance = weiToValue(
        await (await this.polyTokenContract()).balanceOf.callAsync(address),
        FULL_DECIMALS,
      );
      assert.assert(polyBalance.isGreaterThanOrEqualTo(securityTokenLaunchFee), 'Insufficient Poly token allowance');
    }

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
    return weiToValue(await (await this.contract).getSecurityTokenLaunchFee.callAsync(), FULL_DECIMALS);
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
    await this.checkOnlyOwner();
    assert.assert(
      params.registrationDate.getTime() <= params.expiryDate.getTime(),
      'Registration date should < expiry date',
    );
    assert.isETHAddressHex('owner', params.owner);
    if (params.status) {
      const address = await this.getSecurityTokenAddress(params.ticker);
      assert.isNonZeroETHAddressHex('address', address);
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
    await this.checkOnlyOwner();
    const ticker = await this.getTickerDetails({
      tokenName: params.ticker,
    });
    assert.isNonZeroETHAddressHex('owner', ticker.owner);
    return (await this.contract).removeTicker.sendTransactionAsync(params.ticker, params.txData, params.safetyFactor);
  };

  /**
   * Changes the expiry time for the token ticker. Only available to Polymath.
   */
  public changeExpiryLimit = async (params: ChangeExpiryLimitParams) => {
    await this.checkOnlyOwner();
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
    await this.checkOnlyOwner();
    assert.assert(params.ticker.length > 0, 'Ticker is empty');
    assert.assert(params.name.length > 0, 'Name is empty');
    assert.assert(params.ticker.length <= 10, 'Ticker length can not be greater than 10');
    assert.isNonZeroETHAddressHex('owner', params.owner);
    assert.isNonZeroETHAddressHex('securityToken', params.securityToken);
    return (await this.contract).modifySecurityToken.sendTransactionAsync(
      params.name,
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
    await this.checkOnlyOwner();
    assert.isNonZeroETHAddressHex('newOwner', params.newOwner);
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
    assert.assert(!(await this.isPaused()), 'Contract is paused');
    await this.checkOnlyOwner();
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Called by the owner to unpause, returns to normal state
   */
  public unpause = async (params: TxParams) => {
    assert.assert(await this.isPaused(), 'Contract is already not paused');
    await this.checkOnlyOwner();
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Sets the ticker registration fee in POLY tokens. Only Polymath.
   */
  public changeTickerRegistrationFee = async (params: ChangeFeeParams) => {
    await this.checkOnlyOwner();
    const actualFee = await this.getTickerRegistrationFee();
    assert.assert(!actualFee.eq(params.newFee), 'Fee not changed');
    return (await this.contract).changeTickerRegistrationFee.sendTransactionAsync(
      valueToWei(params.newFee, FULL_DECIMALS),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Sets the ticker registration fee in POLY tokens. Only Polymath.
   */
  public changeSecurityLaunchFee = async (params: ChangeFeeParams) => {
    await this.checkOnlyOwner();
    const actualFee = await this.getSecurityTokenLaunchFee();
    assert.assert(!actualFee.eq(params.newFee), 'Fee not changed');
    return (await this.contract).changeSecurityLaunchFee.sendTransactionAsync(
      valueToWei(params.newFee, FULL_DECIMALS),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Reclaims all ERC20Basic compatible tokens
   */
  public reclaimERC20 = async (params: ReclaimERC20Params) => {
    await this.checkOnlyOwner();
    assert.isNonZeroETHAddressHex('tokenContract', params.tokenContract);
    return (await this.contract).reclaimERC20.sendTransactionAsync(
      params.tokenContract,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Changes the protocol version and the SecurityToken contract
   */
  public setProtocolFactory = async (params: SetProtocolFactoryParams) => {
    await this.checkOnlyOwner();
    assert.isValidVersion(params.version);
    assert.isNonZeroETHAddressHex('STFactoryAddress', params.STFactoryAddress);
    const splitVersion = params.version.split('.');
    const major = new BigNumber(splitVersion[0]);
    const minor = new BigNumber(splitVersion[1]);
    const patch = new BigNumber(splitVersion[2]);
    return (await this.contract).setProtocolFactory.sendTransactionAsync(
      params.STFactoryAddress,
      major,
      minor,
      patch,
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
  public getLatestProtocolVersion = async () => {
    return (await this.contract).getLatestProtocolVersion.callAsync();
  };

  /**
   * Changes the PolyToken address. Only Polymath.
   */
  public updateFromRegistry = async (params: TxParams) => {
    await this.checkOnlyOwner();
    return (await this.contract).updateFromRegistry.sendTransactionAsync(params.txData, params.safetyFactor);
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
   * Returns the list of all tokens
   */
  public getTokens = async () => {
    return (await this.contract).getTokens.callAsync();
  };

  /**
   * Changes the default protocol version
   * Used only by Polymath to upgrade the SecurityToken contract and add more functionalities to future versions
   * Changing versions does not affect existing tokens.
   */
  public setLatestVersion = async (params: PackageVersionParams) => {
    await this.checkOnlyOwner();
    assert.isValidVersion(params.version);
    const splitVersion = params.version.split('.');
    const major = new BigNumber(splitVersion[0]);
    const minor = new BigNumber(splitVersion[1]);
    const patch = new BigNumber(splitVersion[2]);
    return (await this.contract).setLatestVersion.sendTransactionAsync(
      major,
      minor,
      patch,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Returns the usd & poly fee for a particular feetype
   */
  public getFees = async (params: GetFeesParams) => {
    let feeType = '';
    switch (params.feeType) {
      case FeeType.stLaunchFee: {
        feeType = stringToBytes32('stLaunchFee');
        break;
      }
      case FeeType.tickerRegFee: {
        feeType = stringToBytes32('tickerRegFee');
        break;
      }
      default: {
        assert.assert(false, 'Missing fee type');
        break;
      }
    }
    return (await this.contract).getFees.callAsync(feeType);
  };

  /**
   * Gets the status of the ticker
   * @return bool
   */
  public getTickerStatus = async (params: TickerParams) => {
    return (await this.contract).getTickerStatus.callAsync(params.ticker);
  };

  /**
   * Gets the owner of the ticker
   * @return address Address of the owner
   */
  public getTickerOwner = async (params: TickerParams) => {
    return (await this.contract).getTickerOwner.callAsync(params.ticker);
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: SecurityTokenRegistrySubscribeAsyncParams = async <
    ArgsType extends ISecurityTokenRegistryEventArgs
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ISecurityTokenRegistryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      ISecurityTokenRegistry.abi,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetISecurityTokenRegistryLogsAsyncParams = async <
    ArgsType extends ISecurityTokenRegistryEventArgs
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ISecurityTokenRegistryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      ISecurityTokenRegistry.abi,
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

  private checkWhenNotPausedOrOwner = async () => {
    if (
      !functionsUtils.checksumAddressComparision(
        await this.owner(),
        (await this.web3Wrapper.getAvailableAddressesAsync())[0],
      )
    ) {
      assert.assert(!(await this.isPaused()), 'Msg sender is not owner and the contract is paused');
    }
  };

  private checkOnlyOwner = async () => {
    assert.assert(
      functionsUtils.checksumAddressComparision(
        await this.owner(),
        (await this.web3Wrapper.getAvailableAddressesAsync())[0],
      ),
      'Msg sender must be owner',
    );
  };

  private checkRegisterTickerRequirements = async (ticker: string, owner: string) => {
    assert.isETHAddressHex('owner', owner);
    assert.assert(ticker.length > 0 && ticker.length <= 10, 'Bad ticker, must be 1 to 10 characters');
    assert.assert(
        await this.isTickerAvailable({
          tokenName: ticker,
        }),
        'Ticker is not available',
    );

    // Check poly token allowance
    const tickerRegistrationFee = await this.getTickerRegistrationFee();
    if (tickerRegistrationFee.isGreaterThan(BIG_NUMBER_ZERO)) {
      const polyBalance = weiToValue(await (await this.polyTokenContract()).balanceOf.callAsync(owner), FULL_DECIMALS);
      assert.assert(polyBalance.isGreaterThanOrEqualTo(tickerRegistrationFee), 'Insufficient Poly token allowance');
    }

  }
}
