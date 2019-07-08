import {
  VolumeRestrictionTMContract,
  VolumeRestrictionTMEventArgs,
  VolumeRestrictionTMEvents,
  VolumeRestrictionTMChangedExemptWalletListEventArgs,
  VolumeRestrictionTMAddIndividualRestrictionEventArgs,
  VolumeRestrictionTMAddIndividualDailyRestrictionEventArgs,
  VolumeRestrictionTMModifyIndividualRestrictionEventArgs,
  VolumeRestrictionTMModifyIndividualDailyRestrictionEventArgs,
  VolumeRestrictionTMAddDefaultRestrictionEventArgs,
  VolumeRestrictionTMAddDefaultDailyRestrictionEventArgs,
  VolumeRestrictionTMModifyDefaultRestrictionEventArgs,
  VolumeRestrictionTMModifyDefaultDailyRestrictionEventArgs,
  VolumeRestrictionTMIndividualRestrictionRemovedEventArgs,
  VolumeRestrictionTMIndividualDailyRestrictionRemovedEventArgs,
  VolumeRestrictionTMDefaultRestrictionRemovedEventArgs,
  VolumeRestrictionTMDefaultDailyRestrictionRemovedEventArgs,
  VolumeRestrictionTMPauseEventArgs,
  VolumeRestrictionTMUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { VolumeRestrictionTransferManager } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import ModuleWrapper from '../module_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  bigNumberToDate,
  dateArrayToBigNumberArray,
  dateToBigNumber,
  numberArrayToBigNumberArray,
  numberToBigNumber,
  valueToWei,
  weiToValue,
} from '../../../utils/convert';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Subscribe,
  GetLogs,
  Perm,
  RestrictionType,
  PERCENTAGE_DECIMALS,
} from '../../../types';

interface ChangedExemptWalletListSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.ChangedExemptWalletList;
  callback: EventCallback<VolumeRestrictionTMChangedExemptWalletListEventArgs>;
}

interface GetChangedExemptWalletListLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.ChangedExemptWalletList;
}

interface AddIndividualRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddIndividualRestriction;
  callback: EventCallback<VolumeRestrictionTMAddIndividualRestrictionEventArgs>;
}

interface GetAddIndividualRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddIndividualRestriction;
}

interface AddIndividualDailyRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddIndividualDailyRestriction;
  callback: EventCallback<VolumeRestrictionTMAddIndividualDailyRestrictionEventArgs>;
}

interface GetAddIndividualDailyRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddIndividualDailyRestriction;
}

interface ModifyIndividualRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyIndividualRestriction;
  callback: EventCallback<VolumeRestrictionTMModifyIndividualRestrictionEventArgs>;
}

interface GetModifyIndividualRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyIndividualRestriction;
}

interface ModifyIndividualDailyRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyIndividualDailyRestriction;
  callback: EventCallback<VolumeRestrictionTMModifyIndividualDailyRestrictionEventArgs>;
}

interface GetModifyIndividualDailyRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyIndividualDailyRestriction;
}

interface AddDefaultRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddDefaultRestriction;
  callback: EventCallback<VolumeRestrictionTMAddDefaultRestrictionEventArgs>;
}

interface GetAddDefaultRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddDefaultRestriction;
}

interface AddDefaultDailyRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddDefaultDailyRestriction;
  callback: EventCallback<VolumeRestrictionTMAddDefaultDailyRestrictionEventArgs>;
}

interface GetAddDefaultDailyRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddDefaultDailyRestriction;
}

interface ModifyDefaultRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyDefaultRestriction;
  callback: EventCallback<VolumeRestrictionTMModifyDefaultRestrictionEventArgs>;
}

interface GetModifyDefaultRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyDefaultRestriction;
}

interface ModifyDefaultDailyRestrictionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyDefaultDailyRestriction;
  callback: EventCallback<VolumeRestrictionTMModifyDefaultDailyRestrictionEventArgs>;
}

interface GetModifyDefaultDailyRestrictionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyDefaultDailyRestriction;
}

interface IndividualRestrictionRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.IndividualRestrictionRemoved;
  callback: EventCallback<VolumeRestrictionTMIndividualRestrictionRemovedEventArgs>;
}

interface GetIndividualRestrictionRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.IndividualRestrictionRemoved;
}

interface IndividualDailyRestrictionRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.IndividualDailyRestrictionRemoved;
  callback: EventCallback<VolumeRestrictionTMIndividualDailyRestrictionRemovedEventArgs>;
}

interface GetIndividualDailyRestrictionRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.IndividualDailyRestrictionRemoved;
}

interface DefaultRestrictionRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.DefaultRestrictionRemoved;
  callback: EventCallback<VolumeRestrictionTMDefaultRestrictionRemovedEventArgs>;
}

interface GetDefaultRestrictionRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.DefaultRestrictionRemoved;
}

interface DefaultDailyRestrictionRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.DefaultDailyRestrictionRemoved;
  callback: EventCallback<VolumeRestrictionTMDefaultDailyRestrictionRemovedEventArgs>;
}

interface GetDefaultDailyRestrictionRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.DefaultDailyRestrictionRemoved;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.Pause;
  callback: EventCallback<VolumeRestrictionTMPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.Unpause;
  callback: EventCallback<VolumeRestrictionTMUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.Unpause;
}

interface VolumeRestrictionTransferManagerSubscribeAsyncParams extends Subscribe {
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

interface GetVolumeRestrictionTransferManagerLogsAsyncParams extends GetLogs {
  (params: GetChangedExemptWalletListLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMChangedExemptWalletListEventArgs>[]
  >;
  (params: GetAddIndividualRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMAddIndividualRestrictionEventArgs>[]
  >;
  (params: GetAddIndividualDailyRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMAddIndividualDailyRestrictionEventArgs>[]
  >;
  (params: GetModifyIndividualRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMModifyIndividualRestrictionEventArgs>[]
  >;
  (params: GetModifyIndividualDailyRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMModifyIndividualDailyRestrictionEventArgs>[]
  >;
  (params: GetAddDefaultRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMAddDefaultRestrictionEventArgs>[]
  >;
  (params: GetAddDefaultDailyRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMAddDefaultDailyRestrictionEventArgs>[]
  >;
  (params: GetModifyDefaultRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMModifyDefaultRestrictionEventArgs>[]
  >;
  (params: GetModifyDefaultDailyRestrictionLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMModifyDefaultDailyRestrictionEventArgs>[]
  >;
  (params: GetIndividualRestrictionRemovedLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMIndividualRestrictionRemovedEventArgs>[]
  >;
  (params: GetIndividualDailyRestrictionRemovedLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMIndividualDailyRestrictionRemovedEventArgs>[]
  >;
  (params: GetDefaultRestrictionRemovedLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMDefaultRestrictionRemovedEventArgs>[]
  >;
  (params: GetDefaultDailyRestrictionRemovedLogsAsyncParams): Promise<
    LogWithDecodedArgs<VolumeRestrictionTMDefaultDailyRestrictionRemovedEventArgs>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<VolumeRestrictionTMPauseEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<VolumeRestrictionTMUnpauseEventArgs>[]>;
}

interface VerifyTransferParams extends TxParams {
  from: string;
  to: string;
  amount: BigNumber;
  data: string;
}

interface HolderIndividualRestrictionParams extends TxParams {
  holder: string;
}

interface ExemptAddressesParams {
  index: number;
}

interface ChangeExemptWalletListParams extends TxParams {
  wallet: string;
  change: boolean;
}

interface DailyRestrictionParams extends TxParams {
  allowedTokens: BigNumber;
  startTime: Date;
  endTime: Date;
  restrictionType: RestrictionType;
}

interface IndividualDailyRestrictionParams extends DailyRestrictionParams {
  holder: string;
}

interface RestrictionParams extends DailyRestrictionParams {
  rollingPeriodInDays: number;
}

interface IndividualRestrictionParams extends RestrictionParams {
  holder: string;
}

interface IndividualDailyRestrictionMultiParams extends TxParams {
  holders: string[];
  allowedTokens: BigNumber[];
  startTimes: Date[];
  endTimes: Date[];
  restrictionTypes: RestrictionType[];
}

interface IndividualRestrictionMultiParams extends IndividualDailyRestrictionMultiParams {
  rollingPeriodInDays: number[];
}

interface GetIndividualBucketDetailsToUserParams {
  user: string;
}

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

// // End of return types ////

/**
 * This class includes the functionality related to interacting with the Volume Restriction Transfer Manager contract.
 */
export default class VolumeRestrictionTransferManagerWrapper extends ModuleWrapper {
  public abi: ContractAbi = VolumeRestrictionTransferManager.abi;

  protected contract: Promise<VolumeRestrictionTMContract>;

  /**
   * Instantiate VolumeRestrictionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<VolumeRestrictionTMContract>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  public unpause = async (params: TxParams) => {
    assert.assert(await this.paused(), 'Controller not currently paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'Sender is not owner');
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  public pause = async (params: TxParams) => {
    assert.assert(!(await this.paused()), 'Controller currently paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'Sender is not owner');
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public verifyTransfer = async (params: VerifyTransferParams) => {
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    // SC: require(_isTransfer == false || msg.sender == securityToken,...
    // _isTransfer is hardcoded to false as an end user cannot act as securityToken
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).verifyTransfer.sendTransactionAsync(
      params.from,
      params.to,
      valueToWei(params.amount, decimals),
      params.data,
      false,
      params.txData,
      params.safetyFactor,
    );
  };

  public individualRestriction = async (params: HolderIndividualRestrictionParams) => {
    const result = await (await this.contract).individualRestriction.callAsync(params.holder);
    const restrictionType = new BigNumber(result[4]).toNumber() === 0 ? RestrictionType.Fixed : RestrictionType.Percentage;
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

  public defaultRestriction = async () => {
    const result = await (await this.contract).defaultRestriction.callAsync();
    const restrictionType = new BigNumber(result[4]).toNumber() === 0 ? RestrictionType.Fixed : RestrictionType.Percentage;
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

  public defaultDailyRestriction = async () => {
    const result = await (await this.contract).defaultDailyRestriction.callAsync();
    const restrictionType = new BigNumber(result[4]).toNumber() === 0 ? RestrictionType.Fixed : RestrictionType.Percentage;
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

  public exemptAddresses = async (params: ExemptAddressesParams) => {
    return (await this.contract).exemptAddresses.callAsync(numberToBigNumber(params.index));
  };

  public individualDailyRestriction = async (params: HolderIndividualRestrictionParams) => {
    const result = await (await this.contract).individualDailyRestriction.callAsync(params.holder);
    const restrictionType = new BigNumber(result[4]).toNumber() === 0 ? RestrictionType.Fixed : RestrictionType.Percentage;
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

  public changeExemptWalletList = async (params: ChangeExemptWalletListParams) => {
    assert.isNonZeroETHAddressHex('wallet', params.wallet);
    assert.assert(
      !(await this.getExemptAddress()).includes(params.wallet) === params.change,
      'There will be no change to exempt list',
    );
    return (await this.contract).changeExemptWalletList.sendTransactionAsync(
      params.wallet,
      params.change,
      params.txData,
      params.safetyFactor,
    );
  };

  public addIndividualRestriction = async (params: IndividualRestrictionParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.isNonZeroETHAddressHex('holder', params.holder);
    assert.assert((await this.getExemptAddress()).includes(params.holder), 'Holder is exempt from restriction');
    this.checkRestrictionInputParams(
      params.startTime,
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

  public addIndividualDailyRestriction = async (params: IndividualRestrictionParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.isNonZeroETHAddressHex('holder', params.holder);
    this.checkRestrictionInputParams(params.startTime, params.allowedTokens, params.restrictionType, 1);
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

  public addIndividualDailyRestrictionMulti = async (params: IndividualDailyRestrictionMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    params.holders.forEach(address => assert.isNonZeroETHAddressHex('holders', address));
    assert.assert(
      params.startTimes.length === params.allowedTokens.length &&
        params.startTimes.length === params.restrictionTypes.length &&
        params.startTimes.length === params.holders.length &&
        params.startTimes.length === params.endTimes.length,
      'Array lengths missmatch',
    );
    let restrictions = [];
    for (let i = 0; i < params.startTimes.length; i += 1) {
      this.checkRestrictionInputParams(params.startTimes[i], params.allowedTokens[i], params.restrictionTypes[i], 1);
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

  public addIndividualRestrictionMulti = async (params: IndividualRestrictionMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    params.holders.forEach(address => assert.isNonZeroETHAddressHex('holders', address));
    const exemptAddress = await this.getExemptAddress();
    assert.assert(exemptAddress.some(address => params.holders.includes(address)), 'Holder is exempt from restriction');
    assert.assert(
      params.startTimes.length === params.allowedTokens.length &&
        params.startTimes.length === params.restrictionTypes.length &&
        params.startTimes.length === params.rollingPeriodInDays.length &&
        params.startTimes.length === params.holders.length &&
        params.startTimes.length === params.endTimes.length,
      'Array lengths missmatch',
    );
    let restrictions = [];
    for (let i = 0; i < params.startTimes.length; i += 1) {
      this.checkRestrictionInputParams(
        params.startTimes[i],
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

  public addDefaultRestriction = async (params: RestrictionParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    this.checkRestrictionInputParams(
      params.startTime,
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

  public addDefaultDailyRestriction = async (params: DailyRestrictionParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    this.checkRestrictionInputParams(params.startTime, params.allowedTokens, params.restrictionType, 1);
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

  public removeIndividualRestriction = async (params: HolderIndividualRestrictionParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.isNotDateZero(
      (await this.individualRestriction({ holder: params.holder })).endTime,
      'Individual Restriction not set with end time',
    );
    assert.isNonZeroETHAddressHex('holder', params.holder);
    return (await this.contract).removeIndividualRestriction.sendTransactionAsync(
      params.holder,
      params.txData,
      params.safetyFactor,
    );
  };

  public removeIndividualRestrictionMulti = async (params: IndividualRestrictionMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    params.holders.forEach(address => assert.isNonZeroETHAddressHex('holders', address));
    Promise.all(
      params.holders.map(async holder =>
        assert.isNotDateZero(
          (await this.individualRestriction({ holder })).endTime,
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

  public removeIndividualDailyRestriction = async (params: HolderIndividualRestrictionParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.isNotDateZero(
      (await this.individualDailyRestriction({ holder: params.holder })).endTime,
      'Individual Daily Restriction not set with end time',
    );
    assert.isNonZeroETHAddressHex('holder', params.holder);
    return (await this.contract).removeIndividualDailyRestriction.sendTransactionAsync(
      params.holder,
      params.txData,
      params.safetyFactor,
    );
  };

  public removeIndividualDailyRestrictionMulti = async (params: IndividualRestrictionMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    Promise.all(
      params.holders.map(async holder =>
        assert.isNotDateZero(
          (await this.individualRestriction({ holder })).endTime,
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

  public removeDefaultRestriction = async (params: TxParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.isNotDateZero((await this.defaultRestriction()).endTime, 'Individual Restriction not set with end time');
    return (await this.contract).removeDefaultRestriction.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public removeDefaultDailyRestriction = async (params: TxParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.isNotDateZero(
      (await this.defaultDailyRestriction()).endTime,
      'Individual Restriction not set with end time',
    );
    return (await this.contract).removeDefaultDailyRestriction.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public modifyIndividualRestriction = async (params: IndividualRestrictionParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.isNonZeroETHAddressHex('holder', params.holder);
    this.checkRestrictionInputParams(
      params.startTime,
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

  public modifyIndividualDailyRestriction = async (params: IndividualDailyRestrictionParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.isNonZeroETHAddressHex('holder', params.holder);
    this.checkRestrictionInputParams(params.startTime, params.allowedTokens, params.restrictionType, 1);
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

  public modifyIndividualDailyRestrictionMulti = async (params: IndividualDailyRestrictionMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    params.holders.forEach(address => assert.isNonZeroETHAddressHex('holders', address));
    assert.assert(
      params.startTimes.length === params.allowedTokens.length &&
        params.startTimes.length === params.restrictionTypes.length &&
        params.startTimes.length === params.holders.length &&
        params.startTimes.length === params.endTimes.length,
      'Array lengths missmatch',
    );
    let restrictions = [];
    for (let i = 0; i < params.startTimes.length; i += 1) {
      this.checkRestrictionInputParams(params.startTimes[i], params.allowedTokens[i], params.restrictionTypes[i], 1);
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

  public modifyIndividualRestrictionMulti = async (params: IndividualRestrictionMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    params.holders.forEach(address => assert.isNonZeroETHAddressHex('holders', address));
    assert.assert(
      params.startTimes.length === params.allowedTokens.length &&
        params.startTimes.length === params.restrictionTypes.length &&
        params.startTimes.length === params.rollingPeriodInDays.length &&
        params.startTimes.length === params.holders.length &&
        params.startTimes.length === params.endTimes.length,
      'Array lengths missmatch',
    );
    let restrictions = [];
    for (let i = 0; i < params.startTimes.length; i += 1) {
      this.checkRestrictionInputParams(
        params.startTimes[i],
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

  public modifyDefaultRestriction = async (params: RestrictionParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    this.checkRestrictionInputParams(
      params.startTime,
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

  public modifyDefaultDailyRestriction = async (params: DailyRestrictionParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    this.checkRestrictionInputParams(params.startTime, params.allowedTokens, params.restrictionType, 1);
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

  public getIndividualBucketDetailsToUser = async (params: GetIndividualBucketDetailsToUserParams) => {
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

  public getDefaultBucketDetailsToUser = async (params: GetIndividualBucketDetailsToUserParams) => {
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

  public getTotalTradedByUser = async (params: GetTotalTradedByUserParams) => {
    return (await this.contract).getTotalTradedByUser.callAsync(params.user, dateToBigNumber(params.at));
  };

  public getInitFunction = async () => {
    return (await this.contract).getInitFunction.callAsync();
  };

  public getExemptAddress = async () => {
    return (await this.contract).getExemptAddress.callAsync();
  };

  public getRestrictedData = async () => {
    const result = await (await this.contract).getRestrictedData.callAsync();
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

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: VolumeRestrictionTransferManagerSubscribeAsyncParams = async <
    ArgsType extends VolumeRestrictionTMEventArgs
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VolumeRestrictionTMEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      VolumeRestrictionTransferManager.abi,
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
    ArgsType extends VolumeRestrictionTMEventArgs
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VolumeRestrictionTMEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      VolumeRestrictionTransferManager.abi,
    );
    return logs;
  };

  private checkRestrictionInputParams = (
    startTime: Date,
    allowedTokens: BigNumber,
    restrictionType: RestrictionType,
    rollingPeriodInDays: number,
  ): void => {
    assert.isFutureDate(startTime, 'Start time must be in the future');
    assert.isBigNumberGreaterThanZero(allowedTokens, 'Allowed Tokens must be greater than 0');
    if (restrictionType === RestrictionType.Percentage) {
      assert.isPercentage('allowed tokens', allowedTokens);
    }
    assert.assert(rollingPeriodInDays <= 365 && rollingPeriodInDays >= 1, 'Invalid number of days in rolling period');
  };

  private decimalsByRestrictionType = async (restrictionType: RestrictionType): Promise<BigNumber> => {
    let decimals = PERCENTAGE_DECIMALS;
    if (restrictionType === RestrictionType.Fixed) {
      decimals = await (await this.securityTokenContract()).decimals.callAsync();
    }
    return decimals;
  };
}
