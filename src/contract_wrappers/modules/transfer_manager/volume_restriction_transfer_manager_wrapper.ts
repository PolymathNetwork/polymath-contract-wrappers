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
import {
  TxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
  ISubscribe,
  IGetLogs
} from '../../../types';
import { assert } from '../../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { ModuleWrapper } from '../module_wrapper';
  
interface IChangedExemptWalletListSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.ChangedExemptWalletList,
  callback: EventCallback<VolumeRestrictionTMChangedExemptWalletListEventArgs>,
}

interface IGetChangedExemptWalletListLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.ChangedExemptWalletList,
}

interface IAddIndividualRestrictionSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddIndividualRestriction,
  callback: EventCallback<VolumeRestrictionTMAddIndividualRestrictionEventArgs>,
}

interface IGetAddIndividualRestrictionLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddIndividualRestriction,
}

interface IAddIndividualDailyRestrictionSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddIndividualDailyRestriction,
  callback: EventCallback<VolumeRestrictionTMAddIndividualDailyRestrictionEventArgs>,
}

interface IGetAddIndividualDailyRestrictionLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddIndividualDailyRestriction,
}

interface IModifyIndividualRestrictionSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyIndividualRestriction,
  callback: EventCallback<VolumeRestrictionTMModifyIndividualRestrictionEventArgs>,
}

interface IGetModifyIndividualRestrictionLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyIndividualRestriction,
}

interface IModifyIndividualDailyRestrictionSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyIndividualDailyRestriction,
  callback: EventCallback<VolumeRestrictionTMModifyIndividualDailyRestrictionEventArgs>,
}

interface IGetModifyIndividualDailyRestrictionLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyIndividualDailyRestriction,
}

interface IAddDefaultRestrictionSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddDefaultRestriction,
  callback: EventCallback<VolumeRestrictionTMAddDefaultRestrictionEventArgs>,
}

interface IGetAddDefaultRestrictionLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddDefaultRestriction,
}

interface IAddDefaultDailyRestrictionSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddDefaultDailyRestriction,
  callback: EventCallback<VolumeRestrictionTMAddDefaultDailyRestrictionEventArgs>,
}

interface IGetAddDefaultDailyRestrictionLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.AddDefaultDailyRestriction,
}

interface IModifyDefaultRestrictionSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyDefaultRestriction,
  callback: EventCallback<VolumeRestrictionTMModifyDefaultRestrictionEventArgs>,
}

interface IGetModifyDefaultRestrictionLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyDefaultRestriction,
}

interface IModifyDefaultDailyRestrictionSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyDefaultDailyRestriction,
  callback: EventCallback<VolumeRestrictionTMModifyDefaultDailyRestrictionEventArgs>,
}

interface IGetModifyDefaultDailyRestrictionLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.ModifyDefaultDailyRestriction,
}

interface IIndividualRestrictionRemovedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.IndividualRestrictionRemoved,
  callback: EventCallback<VolumeRestrictionTMIndividualRestrictionRemovedEventArgs>,
}

interface IGetIndividualRestrictionRemovedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.IndividualRestrictionRemoved,
}

interface IIndividualDailyRestrictionRemovedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.IndividualDailyRestrictionRemoved,
  callback: EventCallback<VolumeRestrictionTMIndividualDailyRestrictionRemovedEventArgs>,
}

interface IGetIndividualDailyRestrictionRemovedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.IndividualDailyRestrictionRemoved,
}

interface IDefaultRestrictionRemovedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.DefaultRestrictionRemoved,
  callback: EventCallback<VolumeRestrictionTMDefaultRestrictionRemovedEventArgs>,
}

interface IGetDefaultRestrictionRemovedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.DefaultRestrictionRemoved,
}

interface IDefaultDailyRestrictionRemovedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.DefaultDailyRestrictionRemoved,
  callback: EventCallback<VolumeRestrictionTMDefaultDailyRestrictionRemovedEventArgs>,
}

interface IGetDefaultDailyRestrictionRemovedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.DefaultDailyRestrictionRemoved,
}

interface IPauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.Pause,
  callback: EventCallback<VolumeRestrictionTMPauseEventArgs>,
}

interface IGetPauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.Pause,
}

interface IUnpauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: VolumeRestrictionTMEvents.Unpause,
  callback: EventCallback<VolumeRestrictionTMUnpauseEventArgs>,
}

interface IGetUnpauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: VolumeRestrictionTMEvents.Unpause,
}

interface IVolumeRestrictionTransferManagerSubscribeAsyncParams extends ISubscribe {
  (params: IChangedExemptWalletListSubscribeAsyncParams): Promise<string>,
  (params: IAddIndividualRestrictionSubscribeAsyncParams): Promise<string>,
  (params: IAddIndividualDailyRestrictionSubscribeAsyncParams): Promise<string>,
  (params: IModifyIndividualRestrictionSubscribeAsyncParams): Promise<string>,
  (params: IModifyIndividualDailyRestrictionSubscribeAsyncParams): Promise<string>,
  (params: IAddDefaultRestrictionSubscribeAsyncParams): Promise<string>,
  (params: IAddDefaultDailyRestrictionSubscribeAsyncParams): Promise<string>,
  (params: IModifyDefaultRestrictionSubscribeAsyncParams): Promise<string>,
  (params: IModifyDefaultDailyRestrictionSubscribeAsyncParams): Promise<string>,
  (params: IIndividualRestrictionRemovedSubscribeAsyncParams): Promise<string>,
  (params: IIndividualDailyRestrictionRemovedSubscribeAsyncParams): Promise<string>,
  (params: IDefaultRestrictionRemovedSubscribeAsyncParams): Promise<string>,
  (params: IDefaultDailyRestrictionRemovedSubscribeAsyncParams): Promise<string>,
  (params: IPauseSubscribeAsyncParams): Promise<string>,
  (params: IUnpauseSubscribeAsyncParams): Promise<string>,
}

interface IGetVolumeRestrictionTransferManagerLogsAsyncParams extends IGetLogs {
  (params: IGetChangedExemptWalletListLogsAsyncParams): Promise<Array<LogWithDecodedArgs<VolumeRestrictionTMChangedExemptWalletListEventArgs>>>,
  (params: IGetAddIndividualRestrictionLogsAsyncParams): Promise<Array<LogWithDecodedArgs<VolumeRestrictionTMAddIndividualRestrictionEventArgs>>>,
  (params: IGetAddIndividualDailyRestrictionLogsAsyncParams): Promise<Array<LogWithDecodedArgs<VolumeRestrictionTMAddIndividualDailyRestrictionEventArgs>>>,
  (params: IGetModifyIndividualRestrictionLogsAsyncParams): Promise<Array<LogWithDecodedArgs<VolumeRestrictionTMModifyIndividualRestrictionEventArgs>>>,
  (params: IGetModifyIndividualDailyRestrictionLogsAsyncParams): Promise<Array<LogWithDecodedArgs<VolumeRestrictionTMModifyIndividualDailyRestrictionEventArgs>>>,
  (params: IGetAddDefaultRestrictionLogsAsyncParams): Promise<Array<LogWithDecodedArgs<VolumeRestrictionTMAddDefaultRestrictionEventArgs>>>,
  (params: IGetAddDefaultDailyRestrictionLogsAsyncParams): Promise<Array<LogWithDecodedArgs<VolumeRestrictionTMAddDefaultDailyRestrictionEventArgs>>>,
  (params: IGetModifyDefaultRestrictionLogsAsyncParams): Promise<Array<LogWithDecodedArgs<VolumeRestrictionTMModifyDefaultRestrictionEventArgs>>>,
  (params: IGetModifyDefaultDailyRestrictionLogsAsyncParams): Promise<Array<LogWithDecodedArgs<VolumeRestrictionTMModifyDefaultDailyRestrictionEventArgs>>>,
  (params: IGetIndividualRestrictionRemovedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<VolumeRestrictionTMIndividualRestrictionRemovedEventArgs>>>,
  (params: IGetIndividualDailyRestrictionRemovedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<VolumeRestrictionTMIndividualDailyRestrictionRemovedEventArgs>>>,
  (params: IGetDefaultRestrictionRemovedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<VolumeRestrictionTMDefaultRestrictionRemovedEventArgs>>>,
  (params: IGetDefaultDailyRestrictionRemovedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<VolumeRestrictionTMDefaultDailyRestrictionRemovedEventArgs>>>,
  (params: IGetPauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<VolumeRestrictionTMPauseEventArgs>>>,
  (params: IGetUnpauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<VolumeRestrictionTMUnpauseEventArgs>>>,
}

interface VerifyTransferParams extends TxParams {
  from: string,
  to: string,
  amount: BigNumber,
  data: string,
  isTransfer: boolean,
}

interface IndividualRestrictionParams {
  index: string,
}

interface HolderIndividualRestrictionParams extends TxParams {
  holder: string,
}

interface IndividualRestriction {
  allowedTokens: BigNumber,
  startTime: BigNumber,
  rollingPeriodInDays: BigNumber,
  endTime: BigNumber,
  restrictionType: BigNumber
}

interface ExemptAddressesParams {
  index: BigNumber,
}

interface ChangeExemptWalletListParams extends TxParams {
  wallet: string,
  change: boolean,
}

interface AddIndividualRestrictionParams extends TxParams {
  holder: string,
  allowedTokens: BigNumber,
  startTime: BigNumber,
  rollingPeriodInDays: BigNumber,
  endTime: BigNumber,
  restrictionType: number|BigNumber,
}

interface AddIndividualDailyRestrictionParams extends TxParams {
  holder: string,
  allowedTokens: BigNumber,
  startTime: BigNumber,
  endTime: BigNumber,
  restrictionType: number|BigNumber,
}

interface AddIndividualDailyRestrictionMultiParams extends TxParams {
  holders: string[],
  allowedTokens: BigNumber[],
  startTimes: BigNumber[],
  endTimes: BigNumber[],
  restrictionTypes: Array<number|BigNumber>,
}

interface AddIndividualRestrictionMultiParams extends TxParams {
  holders: string[],
  allowedTokens: BigNumber[],
  startTimes: BigNumber[],
  rollingPeriodInDays: BigNumber[],
  endTimes: BigNumber[],
  restrictionTypes: Array<number|BigNumber>,
}

interface AddDefaultRestrictionParams extends TxParams {
  allowedTokens: BigNumber,
  startTime: BigNumber,
  rollingPeriodInDays: BigNumber,
  endTime: BigNumber,
  restrictionType: number|BigNumber,
}

interface AddDefaultDailyRestrictionParams extends TxParams {
  allowedTokens: BigNumber,
  startTime: BigNumber,
  endTime: BigNumber,
  restrictionType: number|BigNumber,
}

interface IndividualRestrictionMultiParams extends TxParams {
  holders: string[],
}

interface ModifyIndividualRestrictionParams extends TxParams {
  holder: string,
  allowedTokens: BigNumber,
  startTime: BigNumber,
  rollingPeriodInDays: BigNumber,
  endTime: BigNumber,
  restrictionType: number|BigNumber,
}

interface ModifyIndividualDailyRestrictionParams extends TxParams {
  holder: string,
  allowedTokens: BigNumber,
  startTime: BigNumber,
  endTime: BigNumber,
  restrictionType: number|BigNumber,
}

interface ModifyIndividualDailyRestrictionMultiParams extends TxParams {
  holders: string[],
  allowedTokens: BigNumber[],
  startTimes: BigNumber[],
  endTimes: BigNumber[],
  restrictionTypes: Array<number|BigNumber>,
}

interface ModifyIndividualRestrictionMultiParams extends TxParams {
  holders: string[],
  allowedTokens: BigNumber[],
  startTimes: BigNumber[],
  rollingPeriodInDays: BigNumber[],
  endTimes: BigNumber[],
  restrictionTypes: Array<number|BigNumber>,
}

interface ModifyDefaultRestrictionParams extends TxParams {
  allowedTokens: BigNumber,
  startTime: BigNumber,
  rollingPeriodInDays: BigNumber,
  endTime: BigNumber,
  restrictionType: number|BigNumber,
}

interface ModifyDefaultDailyRestrictionParams extends TxParams {
  allowedTokens: BigNumber,
  startTime: BigNumber,
  endTime: BigNumber,
  restrictionType: number|BigNumber,
}

interface GetIndividualBucketDetailsToUserParams {
  user: string,
}

interface GetIndividualBucketDetails {
  lastTradedDayTime: BigNumber,
  sumOfLastPeriod: BigNumber,
  daysCovered: BigNumber,
  dailyLastTradedDayTime: BigNumber,
  lastTradedTimestamp: BigNumber
}

interface GetTotalTradedByUserParams {
  user: string,
  at: BigNumber,
}

interface GetRestrictedData {
  allAddresses: string,
  allowedTokens: BigNumber,
  startTime: BigNumber,
  rollingPeriodInDays: BigNumber,
  endTime: BigNumber,
  typeOfRestriction: BigNumber
}

/**
 * This class includes the functionality related to interacting with the Volume Restriction Transfer Manager contract.
 */
export class VolumeRestrictionTransferManagerWrapper extends ModuleWrapper {
  public abi: ContractAbi = (VolumeRestrictionTransferManager as any).abi;
  protected _contract: Promise<VolumeRestrictionTMContract>;

  /**
   * Instantiate VolumeRestrictionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param address The address of the GTM
   */
  constructor(web3Wrapper: Web3Wrapper, address: string) {
    super(web3Wrapper, address);
    this._contract = this._getPercentageTransferManagerContract();
  }

  public unpause = async (params: TxParams) => {
    return (await this._contract).unpause.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  }

  public paused = async () => {
    return await (await this._contract).paused.callAsync();
  }

  public pause = async (params: TxParams) => {
    return (await this._contract).pause.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  } 

  public verifyTransfer = async (params: VerifyTransferParams) => {
    return (await this._contract).verifyTransfer.sendTransactionAsync(
      params.from,
      params.to,
      params.amount,
      params.data,
      params.isTransfer,
      params.txData,
      params.safetyFactor
    );
  }

  public individualRestriction = async (params: IndividualRestrictionParams) => {
    const result = await (await this._contract).individualRestriction.callAsync(
      params.index,
    );
    const typedResult: IndividualRestriction = {
      allowedTokens: result[0],
      startTime: result[1],
      rollingPeriodInDays: result[2],
      endTime: result[3],
      restrictionType: result[4]
    }
    return typedResult
  }

  public defaultRestriction = async () => {
    const result = await (await this._contract).defaultRestriction.callAsync();
    const typedResult: IndividualRestriction = {
      allowedTokens: result[0],
      startTime: result[1],
      rollingPeriodInDays: result[2],
      endTime: result[3],
      restrictionType: result[4]
    }
    return typedResult
  }

  public defaultDailyRestriction = async () => {
    const result = await (await this._contract).defaultDailyRestriction.callAsync();
    const typedResult: IndividualRestriction = {
      allowedTokens: result[0],
      startTime: result[1],
      rollingPeriodInDays: result[2],
      endTime: result[3],
      restrictionType: result[4]
    }
    return typedResult
  }

  public exemptAddresses = async (params: ExemptAddressesParams) => {
    return await (await this._contract).exemptAddresses.callAsync(
      params.index,
    );
  }

  public individualDailyRestriction = async (params: IndividualRestrictionParams) => {
    const result = await (await this._contract).individualDailyRestriction.callAsync(
      params.index,
    );
    const typedResult: IndividualRestriction = {
      allowedTokens: result[0],
      startTime: result[1],
      rollingPeriodInDays: result[2],
      endTime: result[3],
      restrictionType: result[4]
    }
    return typedResult
  }

  public changeExemptWalletList = async (params: ChangeExemptWalletListParams) => {
    return (await this._contract).changeExemptWalletList.sendTransactionAsync(
      params.wallet,
      params.change,
      params.txData,
      params.safetyFactor,
    );
  }

  public addIndividualRestriction = async (params: AddIndividualRestrictionParams) => {
    return (await this._contract).addIndividualRestriction.sendTransactionAsync(
      params.holder,
      params.allowedTokens,
      params.startTime,
      params.rollingPeriodInDays,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  }

  public addIndividualDailyRestriction = async (params: AddIndividualDailyRestrictionParams) => {
    return (await this._contract).addIndividualDailyRestriction.sendTransactionAsync(
      params.holder,
      params.allowedTokens,
      params.startTime,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  }

  public addIndividualDailyRestrictionMulti = async (params: AddIndividualDailyRestrictionMultiParams) => {
    return (await this._contract).addIndividualDailyRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.allowedTokens,
      params.startTimes,
      params.endTimes,
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  }

  public addIndividualRestrictionMulti = async (params: AddIndividualRestrictionMultiParams) => {
    return (await this._contract).addIndividualRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.allowedTokens,
      params.startTimes,
      params.rollingPeriodInDays,
      params.endTimes,
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  }

  public addDefaultRestriction = async (params: AddDefaultRestrictionParams) => {
    return (await this._contract).addDefaultRestriction.sendTransactionAsync(
      params.allowedTokens,
      params.startTime,
      params.rollingPeriodInDays,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  }

  public addDefaultDailyRestriction = async (params: AddDefaultDailyRestrictionParams) => {
    return (await this._contract).addDefaultDailyRestriction.sendTransactionAsync(
      params.allowedTokens,
      params.startTime,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  }

  public removeIndividualRestriction = async (params: HolderIndividualRestrictionParams) => {
    return (await this._contract).removeIndividualRestriction.sendTransactionAsync(
      params.holder,
      params.txData,
      params.safetyFactor,
    );
  }

  public removeIndividualRestrictionMulti = async (params: IndividualRestrictionMultiParams) => {
    return (await this._contract).removeIndividualRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.txData,
      params.safetyFactor,
    );
  }

  public removeIndividualDailyRestriction = async (params: HolderIndividualRestrictionParams) => {
    return (await this._contract).removeIndividualDailyRestriction.sendTransactionAsync(
      params.holder,
      params.txData,
      params.safetyFactor,
    );
  }

  public removeIndividualDailyRestrictionMulti = async (params: IndividualRestrictionMultiParams) => {
    return (await this._contract).removeIndividualDailyRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.txData,
      params.safetyFactor,
    );
  }

  public removeDefaultRestriction = async (params: TxParams) => {
    return (await this._contract).removeDefaultRestriction.sendTransactionAsync(
      params.txData,
      params.safetyFactor,
    );
  }

  public removeDefaultDailyRestriction = async (params: TxParams) => {
    return (await this._contract).removeDefaultDailyRestriction.sendTransactionAsync(
      params.txData,
      params.safetyFactor,
    );
  }

  public modifyIndividualRestriction = async (params: ModifyIndividualRestrictionParams) => {
    return (await this._contract).modifyIndividualRestriction.sendTransactionAsync(
      params.holder,
      params.allowedTokens,
      params.startTime,
      params.rollingPeriodInDays,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  }

  public modifyIndividualDailyRestriction = async (params: ModifyIndividualDailyRestrictionParams) => {
    return (await this._contract).modifyIndividualDailyRestriction.sendTransactionAsync(
      params.holder,
      params.allowedTokens,
      params.startTime,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  }

  public modifyIndividualDailyRestrictionMulti = async (params: ModifyIndividualDailyRestrictionMultiParams) => {
    return (await this._contract).modifyIndividualDailyRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.allowedTokens,
      params.startTimes,
      params.endTimes,
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  }

  public modifyIndividualRestrictionMulti = async (params: ModifyIndividualRestrictionMultiParams) => {
    return (await this._contract).modifyIndividualRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.allowedTokens,
      params.startTimes,
      params.rollingPeriodInDays,
      params.endTimes,
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  }

  public modifyDefaultRestriction = async (params: ModifyDefaultRestrictionParams) => {
    return (await this._contract).modifyDefaultRestriction.sendTransactionAsync(
      params.allowedTokens,
      params.startTime,
      params.rollingPeriodInDays,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  }

  public modifyDefaultDailyRestriction = async (params: ModifyDefaultDailyRestrictionParams) => {
    return (await this._contract).modifyDefaultDailyRestriction.sendTransactionAsync(
      params.allowedTokens,
      params.startTime,
      params.endTime,
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  }

  public getIndividualBucketDetailsToUser = async (params: GetIndividualBucketDetailsToUserParams) => {
    const result = await (await this._contract).getIndividualBucketDetailsToUser.callAsync(
      params.user,
    );
    const typedResult: GetIndividualBucketDetails = {
      lastTradedDayTime: result[0],
      sumOfLastPeriod: result[1],
      daysCovered: result[2],
      dailyLastTradedDayTime: result[3],
      lastTradedTimestamp: result[4]
    }
    return typedResult
  }

  public getDefaultBucketDetailsToUser = async (params: GetIndividualBucketDetailsToUserParams) => {
    const result = await (await this._contract).getDefaultBucketDetailsToUser.callAsync(
      params.user,
    );
    const typedResult: GetIndividualBucketDetails = {
      lastTradedDayTime: result[0],
      sumOfLastPeriod: result[1],
      daysCovered: result[2],
      dailyLastTradedDayTime: result[3],
      lastTradedTimestamp: result[4]
    }
    return typedResult
  }

  public getTotalTradedByUser = async (params: GetTotalTradedByUserParams) => {
    return await (await this._contract).getTotalTradedByUser.callAsync(
      params.user,
      params.at,
    );
  }

  public getInitFunction = async () => {
    return await (await this._contract).getInitFunction.callAsync();
  }

  public getExemptAddress = async () => {
    return await (await this._contract).getExemptAddress.callAsync();
  }

  public getRestrictedData = async () => {
    const result = await (await this._contract).getRestrictedData.callAsync();
    let typedResult: GetRestrictedData[] = [];
    for (let i = 0; i < result[0].length; i++) {
      const getRestrictedData: GetRestrictedData = {
        allAddresses: result[0][i],
        allowedTokens: result[1][i],
        startTime: result[2][i],
        rollingPeriodInDays: result[3][i],
        endTime: result[4][i],
        typeOfRestriction: result[5][i]
      }
      typedResult.push(getRestrictedData);
    }
    return typedResult
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: IVolumeRestrictionTransferManagerSubscribeAsyncParams = async <ArgsType extends VolumeRestrictionTMEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VolumeRestrictionTMEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      (VolumeRestrictionTransferManager as any).abi,
      params.callback,
      !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetVolumeRestrictionTransferManagerLogsAsyncParams = async <ArgsType extends VolumeRestrictionTMEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VolumeRestrictionTMEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      (VolumeRestrictionTransferManager as any).abi,
    );
    return logs;
  }
  
  private async _getPercentageTransferManagerContract(): Promise<VolumeRestrictionTMContract> {
    return new VolumeRestrictionTMContract(
      this.abi,
      this._address,
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
  