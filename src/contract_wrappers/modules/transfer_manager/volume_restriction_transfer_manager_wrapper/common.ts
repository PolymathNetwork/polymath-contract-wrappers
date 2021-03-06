import {
  VolumeRestrictionTMContract_3_0_0,
  VolumeRestrictionTMEvents_3_0_0,
  VolumeRestrictionTMEventArgs_3_0_0,
  VolumeRestrictionTMChangedExemptWalletListEventArgs_3_0_0,
  VolumeRestrictionTMAddIndividualRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMAddIndividualDailyRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMModifyIndividualRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMModifyIndividualDailyRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMAddDefaultRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMAddDefaultDailyRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMModifyDefaultRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMModifyDefaultDailyRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMIndividualRestrictionRemovedEventArgs_3_0_0,
  VolumeRestrictionTMIndividualDailyRestrictionRemovedEventArgs_3_0_0,
  VolumeRestrictionTMDefaultRestrictionRemovedEventArgs_3_0_0,
  VolumeRestrictionTMDefaultDailyRestrictionRemovedEventArgs_3_0_0,
  VolumeRestrictionTMPauseEventArgs_3_0_0,
  VolumeRestrictionTMUnpauseEventArgs_3_0_0,
  LogWithDecodedArgs,
  Web3Wrapper,
  BigNumber,
  PolyResponse,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../../utils/assert';
import { ModuleCommon } from '../../module_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import {
  bigNumberToDate,
  dateArrayToBigNumberArray,
  dateToBigNumber,
  numberArrayToBigNumberArray,
  numberToBigNumber,
  parseTransferResult,
  valueToWei,
  weiToValue,
} from '../../../../utils/convert';
import {
  TxParams,
  Perm,
  RestrictionType,
  PERCENTAGE_DECIMALS,
  ErrorCode,
  TransferResult,
  EventCallback,
  SubscribeAsyncParams,
  GetLogsAsyncParams,
  Subscribe,
  GetLogs,
} from '../../../../types';
import ContractWrapper from '../../../contract_wrapper';

interface ChangedExemptWalletListSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.ChangedExemptWalletList;
  callback: EventCallback<VolumeRestrictionTMChangedExemptWalletListEventArgs_3_0_0>;
}

interface GetChangedExemptWalletListLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.ChangedExemptWalletList;
}

interface AddIndividualRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.AddIndividualRestriction;
  callback: EventCallback<VolumeRestrictionTMAddIndividualRestrictionEventArgs_3_0_0>;
}

interface GetAddIndividualRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.AddIndividualRestriction;
}

interface AddIndividualDailyRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.AddIndividualDailyRestriction;
  callback: EventCallback<VolumeRestrictionTMAddIndividualDailyRestrictionEventArgs_3_0_0>;
}

interface GetAddIndividualDailyRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.AddIndividualDailyRestriction;
}

interface ModifyIndividualRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.ModifyIndividualRestriction;
  callback: EventCallback<VolumeRestrictionTMModifyIndividualRestrictionEventArgs_3_0_0>;
}

interface GetModifyIndividualRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.ModifyIndividualRestriction;
}

interface ModifyIndividualDailyRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.ModifyIndividualDailyRestriction;
  callback: EventCallback<VolumeRestrictionTMModifyIndividualDailyRestrictionEventArgs_3_0_0>;
}

interface GetModifyIndividualDailyRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.ModifyIndividualDailyRestriction;
}

interface AddDefaultRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.AddDefaultRestriction;
  callback: EventCallback<VolumeRestrictionTMAddDefaultRestrictionEventArgs_3_0_0>;
}

interface GetAddDefaultRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.AddDefaultRestriction;
}

interface AddDefaultDailyRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.AddDefaultDailyRestriction;
  callback: EventCallback<VolumeRestrictionTMAddDefaultDailyRestrictionEventArgs_3_0_0>;
}

interface GetAddDefaultDailyRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.AddDefaultDailyRestriction;
}

interface ModifyDefaultRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.ModifyDefaultRestriction;
  callback: EventCallback<VolumeRestrictionTMModifyDefaultRestrictionEventArgs_3_0_0>;
}

interface GetModifyDefaultRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.ModifyDefaultRestriction;
}

interface ModifyDefaultDailyRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.ModifyDefaultDailyRestriction;
  callback: EventCallback<VolumeRestrictionTMModifyDefaultDailyRestrictionEventArgs_3_0_0>;
}

interface GetModifyDefaultDailyRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.ModifyDefaultDailyRestriction;
}

interface IndividualRestrictionRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.IndividualRestrictionRemoved;
  callback: EventCallback<VolumeRestrictionTMIndividualRestrictionRemovedEventArgs_3_0_0>;
}

interface GetIndividualRestrictionRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.IndividualRestrictionRemoved;
}

interface IndividualDailyRestrictionRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.IndividualDailyRestrictionRemoved;
  callback: EventCallback<VolumeRestrictionTMIndividualDailyRestrictionRemovedEventArgs_3_0_0>;
}

interface GetIndividualDailyRestrictionRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.IndividualDailyRestrictionRemoved;
}

interface DefaultRestrictionRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.DefaultRestrictionRemoved;
  callback: EventCallback<VolumeRestrictionTMDefaultRestrictionRemovedEventArgs_3_0_0>;
}

interface GetDefaultRestrictionRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.DefaultRestrictionRemoved;
}

interface DefaultDailyRestrictionRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.DefaultDailyRestrictionRemoved;
  callback: EventCallback<VolumeRestrictionTMDefaultDailyRestrictionRemovedEventArgs_3_0_0>;
}

interface GetDefaultDailyRestrictionRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.DefaultDailyRestrictionRemoved;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.Pause;
  callback: EventCallback<VolumeRestrictionTMPauseEventArgs_3_0_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.Unpause;
  callback: EventCallback<VolumeRestrictionTMUnpauseEventArgs_3_0_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents_3_0_0.Unpause;
}

export interface VolumeRestrictionTransferManagerSubscribeAsyncParams extends Subscribe {
  (params: ChangedExemptWalletListSubscribeAsyncParams): Promise<string>;
  (params: AddIndividualRestrictionSubscribeAsyncParams): Promise<string>;
  (params: AddIndividualDailyRestrictionSubscribeAsyncParams): Promise<string>;
  (params: ModifyIndividualRestrictionSubscribeAsyncParams): Promise<string>;
  (params: ModifyIndividualDailyRestrictionSubscribeAsyncParams): Promise<string>;
  (params: AddDefaultRestrictionSubscribeAsyncParams): Promise<string>;
  (params: AddDefaultDailyRestrictionSubscribeAsyncParams): Promise<string>;
  (params: ModifyDefaultRestrictionSubscribeAsyncParams): Promise<string>;
  (params: ModifyDefaultDailyRestrictionSubscribeAsyncParams): Promise<string>;
  (params: IndividualRestrictionRemovedSubscribeAsyncParams): Promise<string>;
  (params: IndividualDailyRestrictionRemovedSubscribeAsyncParams): Promise<string>;
  (params: DefaultRestrictionRemovedSubscribeAsyncParams): Promise<string>;
  (params: DefaultDailyRestrictionRemovedSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

export interface GetVolumeRestrictionTransferManagerLogsAsyncParams extends GetLogs {
  (params: GetChangedExemptWalletListLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMChangedExemptWalletListEventArgs_3_0_0>[]
  >;
  (params: GetAddIndividualRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMAddIndividualRestrictionEventArgs_3_0_0>[]
  >;
  (params: GetAddIndividualDailyRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMAddIndividualDailyRestrictionEventArgs_3_0_0>[]
  >;
  (params: GetModifyIndividualRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMModifyIndividualRestrictionEventArgs_3_0_0>[]
  >;
  (params: GetModifyIndividualDailyRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMModifyIndividualDailyRestrictionEventArgs_3_0_0>[]
  >;
  (params: GetAddDefaultRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMAddDefaultRestrictionEventArgs_3_0_0>[]
  >;
  (params: GetAddDefaultDailyRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMAddDefaultDailyRestrictionEventArgs_3_0_0>[]
  >;
  (params: GetModifyDefaultRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMModifyDefaultRestrictionEventArgs_3_0_0>[]
  >;
  (params: GetModifyDefaultDailyRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMModifyDefaultDailyRestrictionEventArgs_3_0_0>[]
  >;
  (params: GetIndividualRestrictionRemovedLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMIndividualRestrictionRemovedEventArgs_3_0_0>[]
  >;
  (params: GetIndividualDailyRestrictionRemovedLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMIndividualDailyRestrictionRemovedEventArgs_3_0_0>[]
  >;
  (params: GetDefaultRestrictionRemovedLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMDefaultRestrictionRemovedEventArgs_3_0_0>[]
  >;
  (params: GetDefaultDailyRestrictionRemovedLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMDefaultDailyRestrictionRemovedEventArgs_3_0_0>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<VolumeRestrictionTMPauseEventArgs_3_0_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<VolumeRestrictionTMUnpauseEventArgs_3_0_0>[]>;
}

/**
 * @param from Address of the sender
 * @param to Address of the receiver
 * @param amount
 * @param data
 */
interface VerifyTransferParams {
  from: string;
  to: string;
  amount: BigNumber;
  data: string;
}

/**
 * @param investor Address of the user
 */
export interface HolderIndividualRestrictionParams extends TxParams {
  investor: string;
}

/**
 * @param wallet Ethereum wallet/contract address that need to be exempted
 * @param exempted Boolean value used to add (i.e true) or remove (i.e false) from the list
 */
export interface ChangeExemptWalletListParams extends TxParams {
  wallet: string;
  change: boolean;
}

/**
 * @param allowedTokens Amount of tokens allowed to be traded for all token holder.
 * @param startTime Unix timestamp at which restriction get into effect
 * @param endTime Unix timestamp at which restriction effects will gets end.
 * @param restrictionType Whether it will be `Fixed` (fixed no. of tokens allowed to transact)
 * or `Percentage` (tokens are calculated as per the totalSupply in the fly).
 */
export interface DailyRestrictionParams extends TxParams {
  allowedTokens: BigNumber;
  startTime: Date;
  endTime: Date;
  restrictionType: RestrictionType;
}

/**
 * @param holder Address of the token holder, whom restriction will be implied
 */
export interface IndividualDailyRestrictionParams extends DailyRestrictionParams {
  holder: string;
}

/**
 * @param rollingPeriodInDays Rolling period in days (Minimum value should be 1 day)
 */
export interface RestrictionParams extends DailyRestrictionParams {
  rollingPeriodInDays: number;
}

/**
 * @param holders Array of address of the token holders, whom restriction will be implied
 * @param allowedTokens Array of amount of tokens allowed to be trade for a given address.
 * @param startTimes Array of unix timestamps at which restrictions get into effect
 * @param rollingPeriodInDays Array of rolling period in days (Minimum value should be 1 day)
 * @param endTimes Array of unix timestamps at which restriction effects will gets end.
 * @param restrictionTypes Array of restriction types value whether it will be `Fixed` (fixed no. of tokens allowed to transact)
 * or `Percentage` (tokens are calculated as per the totalSupply in the fly).
 */
export interface IndividualRestrictionParams extends RestrictionParams {
  holder: string;
}

/**
 * @param holders Array of address of the user
 */
export interface RemoveIndividualRestrictionMultiParams extends TxParams {
  holders: string[];
}

/**
 * @param holders Array of address of the token holders, whom restriction will be implied
 * @param allowedTokens Array of amount of tokens allowed to be trade for a given address.
 * @param startTimes Array of unix timestamps at which restrictions get into effect
 * @param endTimes Array of unix timestamps at which restriction effects will gets end.
 * @param restrictionTypes Array of restriction types value whether it will be `Fixed` (fixed no. of tokens allowed to transact)
 * or `Percentage` (tokens are calculated as per the totalSupply in the fly).
 */
export interface IndividualDailyRestrictionMultiParams extends TxParams {
  holders: string[];
  allowedTokens: BigNumber[];
  startTimes: Date[];
  endTimes: Date[];
  restrictionTypes: RestrictionType[];
}

/**
 * @param rollingPeriodInDays Array of rolling period in days (Minimum value should be 1 day)
 */
export interface IndividualRestrictionMultiParams extends IndividualDailyRestrictionMultiParams {
  rollingPeriodInDays: number[];
}

/**
 * @param user Address of the token holder for whom the bucket details has queried
 */
export interface GetIndividualBucketDetailsToUserParams {
  user: string;
}

/**
 * @param user Address of the token holder
 * @param at Timestamp
 */
interface GetTotalTradedByUserParams {
  user: string;
  at: Date;
}

// // Return Types ////

interface GetRestrictedData {
  allAddresses: string;
  allowedTokens: BigNumber;
  startTime: Date;
  rollingPeriodInDays: number;
  endTime: Date;
  typeOfRestriction: BigNumber;
}

interface GetIndividualBucketDetails {
  lastTradedDayTime: Date;
  sumOfLastPeriod: BigNumber;
  daysCovered: number;
  dailyLastTradedDayTime: Date;
  lastTradedTimestamp: Date;
}

interface IndividualRestriction {
  allowedTokens: BigNumber;
  startTime: Date;
  rollingPeriodInDays: number;
  endTime: Date;
  restrictionType: RestrictionType;
}

/**
 * @param transferResult
 * @param address
 */
interface VerifyTransfer {
  transferResult: TransferResult;
  address: string;
}

// // End of return types ////

/**
 * This class includes the functionality related to interacting with the Volume Restriction Transfer Manager contract.
 */
export default abstract class VolumeRestrictionTransferManagerCommon extends ModuleCommon {
  public contract: Promise<VolumeRestrictionTMContract_3_0_0>;

  /**
   * Instantiate VolumeRestrictionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<VolumeRestrictionTMContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Used to verify the transfer transaction (View)
   * @return boolean transfer result, address
   */
  public verifyTransfer = async (params: VerifyTransferParams): Promise<VerifyTransfer> => {
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const result = await (await this.contract).verifyTransfer.callAsync(
      params.from,
      params.to,
      valueToWei(params.amount, decimals),
      params.data,
    );
    const transferResult = parseTransferResult(result[0]);
    return {
      transferResult,
      address: result[1],
    };
  };

  /**
   * Gets individual restriction for investor
   * @return allowedTokens, startTime, rollingPeriodInDays, endTime, restrictionType
   */
  public getIndividualRestriction = async (
    params: HolderIndividualRestrictionParams,
  ): Promise<IndividualRestriction> => {
    const result = await (await this.contract).getIndividualRestriction.callAsync(params.investor);
    const restrictionType =
      new BigNumber(result[4]).toNumber() === 0 ? RestrictionType.Fixed : RestrictionType.Percentage;
    const decimals = await this.decimalsByRestrictionType(restrictionType);
    const typedResult: IndividualRestriction = {
      allowedTokens: weiToValue(result[0], decimals),
      startTime: bigNumberToDate(result[1]),
      rollingPeriodInDays: new BigNumber(result[2]).toNumber(),
      endTime: bigNumberToDate(result[3]),
      restrictionType,
    };
    return typedResult;
  };

  /**
   * Gets default restriction value
   * @return allowedTokens, startTime, rollingPeriodInDays, endTime, restrictionType
   */
  public getDefaultRestriction = async (): Promise<IndividualRestriction> => {
    const result = await (await this.contract).getDefaultRestriction.callAsync();
    const restrictionType =
      new BigNumber(result[4]).toNumber() === 0 ? RestrictionType.Fixed : RestrictionType.Percentage;
    const decimals = await this.decimalsByRestrictionType(restrictionType);
    const typedResult: IndividualRestriction = {
      allowedTokens: weiToValue(result[0], decimals),
      startTime: bigNumberToDate(result[1]),
      rollingPeriodInDays: new BigNumber(result[2]).toNumber(),
      endTime: bigNumberToDate(result[3]),
      restrictionType,
    };
    return typedResult;
  };

  /**
   * Gets default daily restriction value
   * @return allowedTokens, startTime, rollingPeriodInDays, endTime, restrictionType
   */
  public getDefaultDailyRestriction = async (): Promise<IndividualRestriction> => {
    const result = await (await this.contract).getDefaultDailyRestriction.callAsync();
    const restrictionType =
      new BigNumber(result[4]).toNumber() === 0 ? RestrictionType.Fixed : RestrictionType.Percentage;
    const decimals = await this.decimalsByRestrictionType(restrictionType);
    const typedResult: IndividualRestriction = {
      allowedTokens: weiToValue(result[0], decimals),
      startTime: bigNumberToDate(result[1]),
      rollingPeriodInDays: new BigNumber(result[2]).toNumber(),
      endTime: bigNumberToDate(result[3]),
      restrictionType,
    };
    return typedResult;
  };

  /**
   * Use to return the list of exempted addresses
   */
  public getExemptAddress = async (): Promise<string[]> => {
    return (await this.contract).getExemptAddress.callAsync();
  };

  /**
   * Gets individual daily restriction value
   * @return allowedTokens, startTime, rollingPeriodInDays, endTime, restrictionType
   */
  public getIndividualDailyRestriction = async (
    params: HolderIndividualRestrictionParams,
  ): Promise<IndividualRestriction> => {
    const result = await (await this.contract).getIndividualDailyRestriction.callAsync(params.investor);
    const restrictionType =
      new BigNumber(result[4]).toNumber() === 0 ? RestrictionType.Fixed : RestrictionType.Percentage;
    const decimals = await this.decimalsByRestrictionType(restrictionType);
    const typedResult: IndividualRestriction = {
      allowedTokens: weiToValue(result[0], decimals),
      startTime: bigNumberToDate(result[1]),
      rollingPeriodInDays: new BigNumber(result[2]).toNumber(),
      endTime: bigNumberToDate(result[3]),
      restrictionType,
    };
    return typedResult;
  };

  /**
   * Add/Remove wallet address from the exempt list
   */
  public changeExemptWalletList = async (params: ChangeExemptWalletListParams): Promise<PolyResponse> => {
    assert.isNonZeroETHAddressHex('wallet', params.wallet);
    assert.assert(
      !(await this.getExemptAddress()).includes(params.wallet) === params.change,
      ErrorCode.PreconditionRequired,
      'There will be no change to exempt list',
    );
    return (await this.contract).changeExemptWalletList.sendTransactionAsync(
      params.wallet,
      params.change,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to add the new individual restriction for multiple token holders
   */
  public addIndividualRestriction = async (params: IndividualRestrictionParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isNonZeroETHAddressHex('holder', params.holder);
    assert.assert(
      !(await this.getExemptAddress()).includes(params.holder),
      ErrorCode.PreconditionRequired,
      'Holder is exempt from restriction',
    );
    this.checkRestrictionInputParams(
      params.startTime,
      params.endTime,
      params.allowedTokens,
      params.restrictionType,
      params.rollingPeriodInDays,
    );
    const decimals = await this.decimalsByRestrictionType(params.restrictionType);
    return (await this.contract).addIndividualRestriction.sendTransactionAsync(
      params.holder,
      valueToWei(params.allowedTokens, decimals),
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.rollingPeriodInDays),
      dateToBigNumber(params.endTime),
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to add the new individual daily restriction for all token holder
   */
  public addIndividualDailyRestriction = async (params: IndividualRestrictionParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isNonZeroETHAddressHex('holder', params.holder);
    this.checkRestrictionInputParams(params.startTime, params.endTime, params.allowedTokens, params.restrictionType, 1);
    const decimals = await this.decimalsByRestrictionType(params.restrictionType);
    return (await this.contract).addIndividualDailyRestriction.sendTransactionAsync(
      params.holder,
      valueToWei(params.allowedTokens, decimals),
      dateToBigNumber(params.startTime),
      dateToBigNumber(params.endTime),
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to add the new individual daily restriction for multiple token holders
   */
  public addIndividualDailyRestrictionMulti = async (
    params: IndividualDailyRestrictionMultiParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    params.holders.forEach(address => assert.isNonZeroETHAddressHex('holders', address));
    assert.assert(
      params.startTimes.length === params.allowedTokens.length &&
        params.startTimes.length === params.restrictionTypes.length &&
        params.startTimes.length === params.holders.length &&
        params.startTimes.length === params.endTimes.length,
      ErrorCode.MismatchedArrayLength,
      'Array lengths mismatch',
    );
    let restrictions = [];
    for (let i = 0; i < params.startTimes.length; i += 1) {
      this.checkRestrictionInputParams(
        params.startTimes[i],
        params.endTimes[i],
        params.allowedTokens[i],
        params.restrictionTypes[i],
        1,
      );
      restrictions.push(this.decimalsByRestrictionType(params.restrictionTypes[i]));
    }
    restrictions = await Promise.all(restrictions);
    const allowedTokens = [];
    for (let i = 0; i < restrictions.length; i += 1) {
      allowedTokens.push(valueToWei(params.allowedTokens[i], restrictions[i]));
    }
    return (await this.contract).addIndividualDailyRestrictionMulti.sendTransactionAsync(
      params.holders,
      allowedTokens,
      dateArrayToBigNumberArray(params.startTimes),
      dateArrayToBigNumberArray(params.endTimes),
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to add the new individual restriction for multiple token holders
   */
  public addIndividualRestrictionMulti = async (params: IndividualRestrictionMultiParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    params.holders.forEach(address => assert.isNonZeroETHAddressHex('holders', address));
    const exemptAddress = await this.getExemptAddress();
    assert.assert(
      !exemptAddress.some(address => params.holders.includes(address)),
      ErrorCode.PreconditionRequired,
      'Holder is exempt from restriction',
    );
    assert.assert(
      params.startTimes.length === params.allowedTokens.length &&
        params.startTimes.length === params.restrictionTypes.length &&
        params.startTimes.length === params.rollingPeriodInDays.length &&
        params.startTimes.length === params.holders.length &&
        params.startTimes.length === params.endTimes.length,
      ErrorCode.MismatchedArrayLength,
      'Array lengths mismatch',
    );
    let restrictions = [];
    for (let i = 0; i < params.startTimes.length; i += 1) {
      this.checkRestrictionInputParams(
        params.startTimes[i],
        params.endTimes[i],
        params.allowedTokens[i],
        params.restrictionTypes[i],
        params.rollingPeriodInDays[i],
      );
      restrictions.push(this.decimalsByRestrictionType(params.restrictionTypes[i]));
    }
    restrictions = await Promise.all(restrictions);
    const allowedTokens = [];
    for (let i = 0; i < restrictions.length; i += 1) {
      allowedTokens.push(valueToWei(params.allowedTokens[i], restrictions[i]));
    }
    return (await this.contract).addIndividualRestrictionMulti.sendTransactionAsync(
      params.holders,
      allowedTokens,
      dateArrayToBigNumberArray(params.startTimes),
      numberArrayToBigNumberArray(params.rollingPeriodInDays),
      dateArrayToBigNumberArray(params.endTimes),
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to add the new default restriction for all token holder
   */
  public addDefaultRestriction = async (params: RestrictionParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.checkRestrictionInputParams(
      params.startTime,
      params.endTime,
      params.allowedTokens,
      params.restrictionType,
      params.rollingPeriodInDays,
    );
    const decimals = await this.decimalsByRestrictionType(params.restrictionType);
    return (await this.contract).addDefaultRestriction.sendTransactionAsync(
      valueToWei(params.allowedTokens, decimals),
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.rollingPeriodInDays),
      dateToBigNumber(params.endTime),
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to add the new default daily restriction for all token holder
   */
  public addDefaultDailyRestriction = async (params: DailyRestrictionParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.checkRestrictionInputParams(params.startTime, params.endTime, params.allowedTokens, params.restrictionType, 1);
    const decimals = await this.decimalsByRestrictionType(params.restrictionType);
    return (await this.contract).addDefaultDailyRestriction.sendTransactionAsync(
      valueToWei(params.allowedTokens, decimals),
      dateToBigNumber(params.startTime),
      dateToBigNumber(params.endTime),
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to remove the individual restriction for a given address
   */
  public removeIndividualRestriction = async (params: HolderIndividualRestrictionParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isNotDateZero(
      (await this.getIndividualRestriction({ investor: params.investor })).endTime,
      'Individual Restriction not set with end time',
    );
    assert.isNonZeroETHAddressHex('investor', params.investor);
    return (await this.contract).removeIndividualRestriction.sendTransactionAsync(
      params.investor,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to remove the individual restriction for a given address
   */
  public removeIndividualRestrictionMulti = async (
    params: RemoveIndividualRestrictionMultiParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    params.holders.forEach(address => assert.isNonZeroETHAddressHex('holders', address));
    await Promise.all(
      params.holders.map(async holder =>
        assert.isNotDateZero(
          (await this.getIndividualRestriction({ investor: holder })).endTime,
          'Individual Restriction not set with end time',
        ),
      ),
    );
    return (await this.contract).removeIndividualRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to remove the individual daily restriction for a given address
   */
  public removeIndividualDailyRestriction = async (
    params: HolderIndividualRestrictionParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isNotDateZero(
      (await this.getIndividualDailyRestriction({ investor: params.investor })).endTime,
      'Individual Daily Restriction not set with end time',
    );
    assert.isNonZeroETHAddressHex('investor', params.investor);
    return (await this.contract).removeIndividualDailyRestriction.sendTransactionAsync(
      params.investor,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to remove the individual daily restriction for a given address
   */
  public removeIndividualDailyRestrictionMulti = async (
    params: RemoveIndividualRestrictionMultiParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await Promise.all(
      params.holders.map(async holder =>
        assert.isNotDateZero(
          (await this.getIndividualRestriction({ investor: holder })).endTime,
          'Individual Restriction not set with end time',
        ),
      ),
    );
    params.holders.forEach(address => assert.isNonZeroETHAddressHex('holders', address));
    return (await this.contract).removeIndividualDailyRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to remove the default restriction
   */
  public removeDefaultRestriction = async (params: TxParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isNotDateZero((await this.getDefaultRestriction()).endTime, 'Individual Restriction not set with end time');
    return (await this.contract).removeDefaultRestriction.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Use to remove the daily default restriction
   */
  public removeDefaultDailyRestriction = async (params: TxParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isNotDateZero(
      (await this.getDefaultDailyRestriction()).endTime,
      'Individual Restriction not set with end time',
    );
    return (await this.contract).removeDefaultDailyRestriction.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Use to modify the existing individual restriction for a given token holder
   */
  public modifyIndividualRestriction = async (params: IndividualRestrictionParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isNonZeroETHAddressHex('holder', params.holder);
    this.checkRestrictionInputParams(
      params.startTime,
      params.endTime,
      params.allowedTokens,
      params.restrictionType,
      params.rollingPeriodInDays,
    );
    const decimals = await this.decimalsByRestrictionType(params.restrictionType);
    return (await this.contract).modifyIndividualRestriction.sendTransactionAsync(
      params.holder,
      valueToWei(params.allowedTokens, decimals),
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.rollingPeriodInDays),
      dateToBigNumber(params.endTime),
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to modify the existing individual daily restriction for a given token holder
   */
  public modifyIndividualDailyRestriction = async (params: IndividualDailyRestrictionParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isNonZeroETHAddressHex('holder', params.holder);
    this.checkRestrictionInputParams(params.startTime, params.endTime, params.allowedTokens, params.restrictionType, 1);
    const decimals = await this.decimalsByRestrictionType(params.restrictionType);
    return (await this.contract).modifyIndividualDailyRestriction.sendTransactionAsync(
      params.holder,
      valueToWei(params.allowedTokens, decimals),
      dateToBigNumber(params.startTime),
      dateToBigNumber(params.endTime),
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to modify the existing individual daily restriction for multiple token holders
   */
  public modifyIndividualDailyRestrictionMulti = async (
    params: IndividualDailyRestrictionMultiParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    params.holders.forEach(address => assert.isNonZeroETHAddressHex('holders', address));
    assert.assert(
      params.startTimes.length === params.allowedTokens.length &&
        params.startTimes.length === params.restrictionTypes.length &&
        params.startTimes.length === params.holders.length &&
        params.startTimes.length === params.endTimes.length,
      ErrorCode.MismatchedArrayLength,
      'Array lengths mismatch',
    );
    let restrictions = [];
    for (let i = 0; i < params.startTimes.length; i += 1) {
      this.checkRestrictionInputParams(
        params.startTimes[i],
        params.endTimes[i],
        params.allowedTokens[i],
        params.restrictionTypes[i],
        1,
      );
      restrictions.push(this.decimalsByRestrictionType(params.restrictionTypes[i]));
    }
    restrictions = await Promise.all(restrictions);
    const allowedTokens = [];
    for (let i = 0; i < restrictions.length; i += 1) {
      allowedTokens.push(valueToWei(params.allowedTokens[i], restrictions[i]));
    }
    return (await this.contract).modifyIndividualDailyRestrictionMulti.sendTransactionAsync(
      params.holders,
      allowedTokens,
      dateArrayToBigNumberArray(params.startTimes),
      dateArrayToBigNumberArray(params.endTimes),
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to modify the existing individual restriction for multiple token holders
   */
  public modifyIndividualRestrictionMulti = async (params: IndividualRestrictionMultiParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    params.holders.forEach(address => assert.isNonZeroETHAddressHex('holders', address));
    assert.assert(
      params.startTimes.length === params.allowedTokens.length &&
        params.startTimes.length === params.restrictionTypes.length &&
        params.startTimes.length === params.rollingPeriodInDays.length &&
        params.startTimes.length === params.holders.length &&
        params.startTimes.length === params.endTimes.length,
      ErrorCode.MismatchedArrayLength,
      'Array lengths mismatch',
    );
    let restrictions = [];
    for (let i = 0; i < params.startTimes.length; i += 1) {
      this.checkRestrictionInputParams(
        params.startTimes[i],
        params.endTimes[i],
        params.allowedTokens[i],
        params.restrictionTypes[i],
        params.rollingPeriodInDays[i],
      );
      restrictions.push(this.decimalsByRestrictionType(params.restrictionTypes[i]));
    }
    restrictions = await Promise.all(restrictions);
    const allowedTokens = [];
    for (let i = 0; i < restrictions.length; i += 1) {
      allowedTokens.push(valueToWei(params.allowedTokens[i], restrictions[i]));
    }
    return (await this.contract).modifyIndividualRestrictionMulti.sendTransactionAsync(
      params.holders,
      allowedTokens,
      dateArrayToBigNumberArray(params.startTimes),
      numberArrayToBigNumberArray(params.rollingPeriodInDays),
      dateArrayToBigNumberArray(params.endTimes),
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to modify the global restriction for all token holders
   */
  public modifyDefaultRestriction = async (params: RestrictionParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.checkRestrictionInputParams(
      params.startTime,
      params.endTime,
      params.allowedTokens,
      params.restrictionType,
      params.rollingPeriodInDays,
    );
    const decimals = await this.decimalsByRestrictionType(params.restrictionType);
    return (await this.contract).modifyDefaultRestriction.sendTransactionAsync(
      valueToWei(params.allowedTokens, decimals),
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.rollingPeriodInDays),
      dateToBigNumber(params.endTime),
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to modify the daily default restriction for all token holders
   */
  public modifyDefaultDailyRestriction = async (params: DailyRestrictionParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.checkRestrictionInputParams(params.startTime, params.endTime, params.allowedTokens, params.restrictionType, 1);
    const decimals = await this.decimalsByRestrictionType(params.restrictionType);
    return (await this.contract).modifyDefaultDailyRestriction.sendTransactionAsync(
      valueToWei(params.allowedTokens, decimals),
      dateToBigNumber(params.startTime),
      dateToBigNumber(params.endTime),
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to get the bucket details for a given address
   * @return lastTradedDayTime, sumOfLastPeriod, days covered, date lastTradedDayTime, timestamp at which last transaction get executed
   */
  public getIndividualBucketDetailsToUser = async (
    params: GetIndividualBucketDetailsToUserParams,
  ): Promise<GetIndividualBucketDetails> => {
    assert.isETHAddressHex('user', params.user);
    const result = await (await this.contract).getIndividualBucketDetailsToUser.callAsync(params.user);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const typedResult: GetIndividualBucketDetails = {
      lastTradedDayTime: bigNumberToDate(result[0]),
      sumOfLastPeriod: weiToValue(result[1], decimals),
      daysCovered: new BigNumber(result[2]).toNumber(),
      dailyLastTradedDayTime: bigNumberToDate(result[3]),
      lastTradedTimestamp: bigNumberToDate(result[4]),
    };
    return typedResult;
  };

  /**
   * Use to get the bucket details for a given address
   * @return lastTradedDayTime, sumOfLastPeriod, days covered, date lastTradedDayTime, timestamp at which last transaction get executed
   */
  public getDefaultBucketDetailsToUser = async (
    params: GetIndividualBucketDetailsToUserParams,
  ): Promise<GetIndividualBucketDetails> => {
    assert.isETHAddressHex('user', params.user);
    const result = await (await this.contract).getDefaultBucketDetailsToUser.callAsync(params.user);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const typedResult: GetIndividualBucketDetails = {
      lastTradedDayTime: bigNumberToDate(result[0]),
      sumOfLastPeriod: weiToValue(result[1], decimals),
      daysCovered: new BigNumber(result[2]).toNumber(),
      dailyLastTradedDayTime: bigNumberToDate(result[3]),
      lastTradedTimestamp: bigNumberToDate(result[4]),
    };
    return typedResult;
  };

  /**
   * Use to get the volume of token that being traded at a particular day (`at` + 24 hours) for a given user
   */
  public getTotalTradedByUser = async (params: GetTotalTradedByUserParams): Promise<BigNumber> => {
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return weiToValue(
      await (await this.contract).getTotalTradedByUser.callAsync(params.user, dateToBigNumber(params.at)),
      decimals,
    );
  };

  /**
   * Provide the restriction details of all the restricted addresses
   * @return List of the restricted addresses,
   * List of the tokens allowed to the restricted addresses corresponds to restricted address,
   * List of the start time of the restriction corresponds to restricted address,
   * List of the rolling period in days for a restriction corresponds to restricted address,
   * List of the end time of the restriction corresponds to restricted address,
   * List of the type of restriction to validate the value of the `allowedTokens`
   * of the restriction corresponds to restricted address,
   */
  public getRestrictionData = async (): Promise<GetRestrictedData[]> => {
    const result = await (await this.contract).getRestrictionData.callAsync();
    const restrictionType = [];
    for (let i = 0; i < result[0].length; i += 1) {
      const type = new BigNumber(result[5][i]).toNumber() === 0 ? RestrictionType.Fixed : RestrictionType.Percentage;
      restrictionType.push(this.decimalsByRestrictionType(type));
    }
    const decimals = await Promise.all(restrictionType);
    const typedResult: GetRestrictedData[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      const getRestrictedData: GetRestrictedData = {
        allAddresses: result[0][i],
        allowedTokens: weiToValue(result[1][i], decimals[i]),
        startTime: bigNumberToDate(result[2][i]),
        rollingPeriodInDays: new BigNumber(result[3][i]).toNumber(),
        endTime: bigNumberToDate(result[4][i]),
        typeOfRestriction: result[5][i],
      };
      typedResult.push(getRestrictedData);
    }
    return typedResult;
  };

  public checkRestrictionInputParams = (
    startTime: Date,
    endTime: Date,
    allowedTokens: BigNumber,
    restrictionType: RestrictionType,
    rollingPeriodInDays: number,
  ): void => {
    assert.isFutureDate(startTime, 'Start time must be in the future');
    assert.isBigNumberGreaterThanZero(allowedTokens, 'Allowed Tokens must be greater than 0');
    if (restrictionType === RestrictionType.Percentage) {
      assert.isPercentage('allowed tokens', allowedTokens);
    }
    assert.assert(
      rollingPeriodInDays <= 365 && rollingPeriodInDays >= 1,
      ErrorCode.InvalidData,
      'Invalid number of days in rolling period',
    );
    const diffDays = Math.ceil(Math.abs(endTime.getTime() - startTime.getTime()) / (1000 * 3600 * 24));
    assert.assert(
      new BigNumber(diffDays).isGreaterThanOrEqualTo(rollingPeriodInDays),
      ErrorCode.InvalidData,
      'Invalid times, rollingPeriodInDays must have less days than the duration',
    );
  };

  public decimalsByRestrictionType = async (restrictionType: RestrictionType): Promise<BigNumber> => {
    let decimals = PERCENTAGE_DECIMALS;
    if (restrictionType === RestrictionType.Fixed) {
      decimals = await (await this.securityTokenContract()).decimals.callAsync();
    }
    return decimals;
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: VolumeRestrictionTransferManagerSubscribeAsyncParams = async <
    ArgsType extends VolumeRestrictionTMEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VolumeRestrictionTMEvents_3_0_0);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = await this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetVolumeRestrictionTransferManagerLogsAsyncParams = async <
    ArgsType extends VolumeRestrictionTMEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VolumeRestrictionTMEvents_3_0_0);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
    );
    return logs;
  };
}

export function isVolumeRestrictionTransferManager(
  wrapper: ContractWrapper,
): wrapper is VolumeRestrictionTransferManagerCommon {
  return wrapper instanceof VolumeRestrictionTransferManagerCommon;
}
