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
import * as _ from 'lodash';
import { schemas } from '@0x/json-schemas';
import { TxParams, GetLogsAsyncParams, SubscribeAsyncParams, EventCallback, Subscribe, GetLogs } from '../../../types';
import assert from '../../../utils/assert';
import ModuleWrapper from '../module_wrapper';

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
  isTransfer: boolean;
}

interface IndividualRestrictionParams {
  index: string;
}

interface HolderIndividualRestrictionParams extends TxParams {
  holder: string;
}

interface ExemptAddressesParams {
  index: BigNumber;
}

interface ChangeExemptWalletListParams extends TxParams {
  wallet: string;
  change: boolean;
}

interface AddIndividualRestrictionParams extends TxParams {
  holder: string;
  allowedTokens: BigNumber;
  startTime: BigNumber;
  rollingPeriodInDays: BigNumber;
  endTime: BigNumber;
  restrictionType: number | BigNumber;
}

interface AddIndividualDailyRestrictionParams extends TxParams {
  holder: string;
  allowedTokens: BigNumber;
  startTime: BigNumber;
  endTime: BigNumber;
  restrictionType: number | BigNumber;
}

interface AddIndividualDailyRestrictionMultiParams extends TxParams {
  holders: string[];
  allowedTokens: BigNumber[];
  startTimes: BigNumber[];
  endTimes: BigNumber[];
  restrictionTypes: (number | BigNumber)[];
}

interface AddIndividualRestrictionMultiParams extends TxParams {
  holders: string[];
  allowedTokens: BigNumber[];
  startTimes: BigNumber[];
  rollingPeriodInDays: BigNumber[];
  endTimes: BigNumber[];
  restrictionTypes: (number | BigNumber)[];
}

interface AddDefaultRestrictionParams extends TxParams {
  allowedTokens: BigNumber;
  startTime: BigNumber;
  rollingPeriodInDays: BigNumber;
  endTime: BigNumber;
  restrictionType: number | BigNumber;
}

interface AddDefaultDailyRestrictionParams extends TxParams {
  allowedTokens: BigNumber;
  startTime: BigNumber;
  endTime: BigNumber;
  restrictionType: number | BigNumber;
}

interface IndividualRestrictionMultiParams extends TxParams {
  holders: string[];
}

interface ModifyIndividualRestrictionParams extends TxParams {
  holder: string;
  allowedTokens: BigNumber;
  startTime: BigNumber;
  rollingPeriodInDays: BigNumber;
  endTime: BigNumber;
  restrictionType: number | BigNumber;
}

interface ModifyIndividualDailyRestrictionParams extends TxParams {
  holder: string;
  allowedTokens: BigNumber;
  startTime: BigNumber;
  endTime: BigNumber;
  restrictionType: number | BigNumber;
}

interface ModifyIndividualDailyRestrictionMultiParams extends TxParams {
  holders: string[];
  allowedTokens: BigNumber[];
  startTimes: BigNumber[];
  endTimes: BigNumber[];
  restrictionTypes: (number | BigNumber)[];
}

interface ModifyIndividualRestrictionMultiParams extends TxParams {
  holders: string[];
  allowedTokens: BigNumber[];
  startTimes: BigNumber[];
  rollingPeriodInDays: BigNumber[];
  endTimes: BigNumber[];
  restrictionTypes: (number | BigNumber)[];
}

interface ModifyDefaultRestrictionParams extends TxParams {
  allowedTokens: BigNumber;
  startTime: BigNumber;
  rollingPeriodInDays: BigNumber;
  endTime: BigNumber;
  restrictionType: number | BigNumber;
}

interface ModifyDefaultDailyRestrictionParams extends TxParams {
  allowedTokens: BigNumber;
  startTime: BigNumber;
  endTime: BigNumber;
  restrictionType: number | BigNumber;
}

interface GetIndividualBucketDetailsToUserParams {
  user: string;
}

interface GetTotalTradedByUserParams {
  user: string;
  at: BigNumber;
}

// // Return Types ////

interface GetRestrictedData {
  allAddresses: string;
  allowedTokens: BigNumber;
  startTime: BigNumber;
  rollingPeriodInDays: BigNumber;
  endTime: BigNumber;
  typeOfRestriction: BigNumber;
}

interface GetIndividualBucketDetails {
  lastTradedDayTime: BigNumber;
  sumOfLastPeriod: BigNumber;
  daysCovered: BigNumber;
  dailyLastTradedDayTime: BigNumber;
  lastTradedTimestamp: BigNumber;
}

interface IndividualRestriction {
  allowedTokens: BigNumber;
  startTime: BigNumber;
  rollingPeriodInDays: BigNumber;
  endTime: BigNumber;
  restrictionType: BigNumber;
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
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<VolumeRestrictionTMContract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  public unpause = async (params: TxParams) => {
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  public pause = async (params: TxParams) => {
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public verifyTransfer = async (params: VerifyTransferParams) => {
    return (await this.contract).verifyTransfer.sendTransactionAsync(
      params.from,
      params.to,
      params.amount,
      params.data,
      params.isTransfer,
      params.txData,
      params.safetyFactor,
    );
  };

  public individualRestriction = async (params: IndividualRestrictionParams) => {
    const result = await (await this.contract).individualRestriction.callAsync(params.index);
    const typedResult: IndividualRestriction = {
      allowedTokens: result[0],
      startTime: result[1],
      rollingPeriodInDays: result[2],
      endTime: result[3],
      restrictionType: result[4],
    };
    return typedResult;
  };

  public defaultRestriction = async () => {
    const result = await (await this.contract).defaultRestriction.callAsync();
    const typedResult: IndividualRestriction = {
      allowedTokens: result[0],
      startTime: result[1],
      rollingPeriodInDays: result[2],
      endTime: result[3],
      restrictionType: result[4],
    };
    return typedResult;
  };

  public defaultDailyRestriction = async () => {
    const result = await (await this.contract).defaultDailyRestriction.callAsync();
    const typedResult: IndividualRestriction = {
      allowedTokens: result[0],
      startTime: result[1],
      rollingPeriodInDays: result[2],
      endTime: result[3],
      restrictionType: result[4],
    };
    return typedResult;
  };

  public exemptAddresses = async (params: ExemptAddressesParams) => {
    return (await this.contract).exemptAddresses.callAsync(params.index);
  };

  public individualDailyRestriction = async (params: IndividualRestrictionParams) => {
    const result = await (await this.contract).individualDailyRestriction.callAsync(params.index);
    const typedResult: IndividualRestriction = {
      allowedTokens: result[0],
      startTime: result[1],
      rollingPeriodInDays: result[2],
      endTime: result[3],
      restrictionType: result[4],
    };
    return typedResult;
  };

  public changeExemptWalletList = async (params: ChangeExemptWalletListParams) => {
    return (await this.contract).changeExemptWalletList.sendTransactionAsync(
      params.wallet,
      params.change,
      params.txData,
      params.safetyFactor,
    );
  };

  public addIndividualRestriction = async (params: AddIndividualRestrictionParams) => {
    return (await this.contract).addIndividualRestriction.sendTransactionAsync(
      params.holder,
      params.allowedTokens,
      params.startTime,
      params.rollingPeriodInDays,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  public addIndividualDailyRestriction = async (params: AddIndividualDailyRestrictionParams) => {
    return (await this.contract).addIndividualDailyRestriction.sendTransactionAsync(
      params.holder,
      params.allowedTokens,
      params.startTime,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  public addIndividualDailyRestrictionMulti = async (params: AddIndividualDailyRestrictionMultiParams) => {
    return (await this.contract).addIndividualDailyRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.allowedTokens,
      params.startTimes,
      params.endTimes,
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  };

  public addIndividualRestrictionMulti = async (params: AddIndividualRestrictionMultiParams) => {
    return (await this.contract).addIndividualRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.allowedTokens,
      params.startTimes,
      params.rollingPeriodInDays,
      params.endTimes,
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  };

  public addDefaultRestriction = async (params: AddDefaultRestrictionParams) => {
    return (await this.contract).addDefaultRestriction.sendTransactionAsync(
      params.allowedTokens,
      params.startTime,
      params.rollingPeriodInDays,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  public addDefaultDailyRestriction = async (params: AddDefaultDailyRestrictionParams) => {
    return (await this.contract).addDefaultDailyRestriction.sendTransactionAsync(
      params.allowedTokens,
      params.startTime,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  public removeIndividualRestriction = async (params: HolderIndividualRestrictionParams) => {
    return (await this.contract).removeIndividualRestriction.sendTransactionAsync(
      params.holder,
      params.txData,
      params.safetyFactor,
    );
  };

  public removeIndividualRestrictionMulti = async (params: IndividualRestrictionMultiParams) => {
    return (await this.contract).removeIndividualRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.txData,
      params.safetyFactor,
    );
  };

  public removeIndividualDailyRestriction = async (params: HolderIndividualRestrictionParams) => {
    return (await this.contract).removeIndividualDailyRestriction.sendTransactionAsync(
      params.holder,
      params.txData,
      params.safetyFactor,
    );
  };

  public removeIndividualDailyRestrictionMulti = async (params: IndividualRestrictionMultiParams) => {
    return (await this.contract).removeIndividualDailyRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.txData,
      params.safetyFactor,
    );
  };

  public removeDefaultRestriction = async (params: TxParams) => {
    return (await this.contract).removeDefaultRestriction.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public removeDefaultDailyRestriction = async (params: TxParams) => {
    return (await this.contract).removeDefaultDailyRestriction.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public modifyIndividualRestriction = async (params: ModifyIndividualRestrictionParams) => {
    return (await this.contract).modifyIndividualRestriction.sendTransactionAsync(
      params.holder,
      params.allowedTokens,
      params.startTime,
      params.rollingPeriodInDays,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyIndividualDailyRestriction = async (params: ModifyIndividualDailyRestrictionParams) => {
    return (await this.contract).modifyIndividualDailyRestriction.sendTransactionAsync(
      params.holder,
      params.allowedTokens,
      params.startTime,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyIndividualDailyRestrictionMulti = async (params: ModifyIndividualDailyRestrictionMultiParams) => {
    return (await this.contract).modifyIndividualDailyRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.allowedTokens,
      params.startTimes,
      params.endTimes,
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyIndividualRestrictionMulti = async (params: ModifyIndividualRestrictionMultiParams) => {
    return (await this.contract).modifyIndividualRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.allowedTokens,
      params.startTimes,
      params.rollingPeriodInDays,
      params.endTimes,
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyDefaultRestriction = async (params: ModifyDefaultRestrictionParams) => {
    return (await this.contract).modifyDefaultRestriction.sendTransactionAsync(
      params.allowedTokens,
      params.startTime,
      params.rollingPeriodInDays,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyDefaultDailyRestriction = async (params: ModifyDefaultDailyRestrictionParams) => {
    return (await this.contract).modifyDefaultDailyRestriction.sendTransactionAsync(
      params.allowedTokens,
      params.startTime,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  public getIndividualBucketDetailsToUser = async (params: GetIndividualBucketDetailsToUserParams) => {
    const result = await (await this.contract).getIndividualBucketDetailsToUser.callAsync(params.user);
    const typedResult: GetIndividualBucketDetails = {
      lastTradedDayTime: result[0],
      sumOfLastPeriod: result[1],
      daysCovered: result[2],
      dailyLastTradedDayTime: result[3],
      lastTradedTimestamp: result[4],
    };
    return typedResult;
  };

  public getDefaultBucketDetailsToUser = async (params: GetIndividualBucketDetailsToUserParams) => {
    const result = await (await this.contract).getDefaultBucketDetailsToUser.callAsync(params.user);
    const typedResult: GetIndividualBucketDetails = {
      lastTradedDayTime: result[0],
      sumOfLastPeriod: result[1],
      daysCovered: result[2],
      dailyLastTradedDayTime: result[3],
      lastTradedTimestamp: result[4],
    };
    return typedResult;
  };

  public getTotalTradedByUser = async (params: GetTotalTradedByUserParams) => {
    return (await this.contract).getTotalTradedByUser.callAsync(params.user, params.at);
  };

  public getInitFunction = async () => {
    return (await this.contract).getInitFunction.callAsync();
  };

  public getExemptAddress = async () => {
    return (await this.contract).getExemptAddress.callAsync();
  };

  public getRestrictedData = async () => {
    const result = await (await this.contract).getRestrictedData.callAsync();
    const typedResult: GetRestrictedData[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      const getRestrictedData: GetRestrictedData = {
        allAddresses: result[0][i],
        allowedTokens: result[1][i],
        startTime: result[2][i],
        rollingPeriodInDays: result[3][i],
        endTime: result[4][i],
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
      !_.isUndefined(params.isVerbose),
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
}
