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
  bigNumberToNumber,
  dateArrayToBigNumberArray,
  dateToBigNumber,
  numberArrayToBigNumberArray,
  numberToBigNumber,
} from '../../../utils/convert';
import { TxParams, GetLogsAsyncParams, SubscribeAsyncParams, EventCallback, Subscribe, GetLogs } from '../../../types';

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

interface IndividualRestrictionParams {
  index: string;
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

interface AddIndividualRestrictionParams extends TxParams {
  holder: string;
  allowedTokens: BigNumber;
  startTime: Date;
  rollingPeriodInDays: number;
  endTime: Date;
  restrictionType: number | BigNumber;
}

interface AddIndividualDailyRestrictionParams extends TxParams {
  holder: string;
  allowedTokens: BigNumber;
  startTime: Date;
  endTime: Date;
  restrictionType: number | BigNumber;
}

interface AddIndividualDailyRestrictionMultiParams extends TxParams {
  holders: string[];
  allowedTokens: BigNumber[];
  startTimes: Date[];
  endTimes: Date[];
  restrictionTypes: (number | BigNumber)[];
}

interface AddIndividualRestrictionMultiParams extends TxParams {
  holders: string[];
  allowedTokens: BigNumber[];
  startTimes: Date[];
  rollingPeriodInDays: number[];
  endTimes: Date[];
  restrictionTypes: (number | BigNumber)[];
}

interface AddDefaultRestrictionParams extends TxParams {
  allowedTokens: BigNumber;
  startTime: Date;
  rollingPeriodInDays: number;
  endTime: Date;
  restrictionType: number | BigNumber;
}

interface AddDefaultDailyRestrictionParams extends TxParams {
  allowedTokens: BigNumber;
  startTime: Date;
  endTime: Date;
  restrictionType: number | BigNumber;
}

interface IndividualRestrictionMultiParams extends TxParams {
  holders: string[];
}

interface ModifyIndividualRestrictionParams extends TxParams {
  holder: string;
  allowedTokens: BigNumber;
  startTime: Date;
  rollingPeriodInDays: number;
  endTime: Date;
  restrictionType: number | BigNumber;
}

interface ModifyIndividualDailyRestrictionParams extends TxParams {
  holder: string;
  allowedTokens: BigNumber;
  startTime: Date;
  endTime: Date;
  restrictionType: number | BigNumber;
}

interface ModifyIndividualDailyRestrictionMultiParams extends TxParams {
  holders: string[];
  allowedTokens: BigNumber[];
  startTimes: Date[];
  endTimes: Date[];
  restrictionTypes: (number | BigNumber)[];
}

interface ModifyIndividualRestrictionMultiParams extends TxParams {
  holders: string[];
  allowedTokens: BigNumber[];
  startTimes: Date[];
  rollingPeriodInDays: number[];
  endTimes: Date[];
  restrictionTypes: (number | BigNumber)[];
}

interface ModifyDefaultRestrictionParams extends TxParams {
  allowedTokens: BigNumber;
  startTime: Date;
  rollingPeriodInDays: number;
  endTime: Date;
  restrictionType: number | BigNumber;
}

interface ModifyDefaultDailyRestrictionParams extends TxParams {
  allowedTokens: BigNumber;
  startTime: Date;
  endTime: Date;
  restrictionType: number | BigNumber;
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
  restrictionType: number | BigNumber;
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
    await this.checkIsPaused();
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  public pause = async (params: TxParams) => {
    await this.checkIsNotPaused();
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public verifyTransfer = async (params: VerifyTransferParams) => {
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    // SC: require(_isTransfer == false || msg.sender == securityToken,...
    // _isTransfer is hardcoded to false as an end user cannot act as securityToken
    return (await this.contract).verifyTransfer.sendTransactionAsync(
      params.from,
      params.to,
      params.amount,
      params.data,
      false,
      params.txData,
      params.safetyFactor,
    );
  };

  public individualRestriction = async (params: IndividualRestrictionParams) => {
    const result = await (await this.contract).individualRestriction.callAsync(params.index);
    const typedResult: IndividualRestriction = {
      allowedTokens: result[0],
      startTime: bigNumberToDate(result[1]),
      rollingPeriodInDays: bigNumberToNumber(result[2]),
      endTime: bigNumberToDate(result[3]),
      restrictionType: result[4],
    };
    return typedResult;
  };

  public defaultRestriction = async () => {
    const result = await (await this.contract).defaultRestriction.callAsync();
    const typedResult: IndividualRestriction = {
      allowedTokens: result[0],
      startTime: bigNumberToDate(result[1]),
      rollingPeriodInDays: bigNumberToNumber(result[2]),
      endTime: bigNumberToDate(result[3]),
      restrictionType: result[4],
    };
    return typedResult;
  };

  public defaultDailyRestriction = async () => {
    const result = await (await this.contract).defaultDailyRestriction.callAsync();
    const typedResult: IndividualRestriction = {
      allowedTokens: result[0],
      startTime: bigNumberToDate(result[1]),
      rollingPeriodInDays: bigNumberToNumber(result[2]),
      endTime: bigNumberToDate(result[3]),
      restrictionType: result[4],
    };
    return typedResult;
  };

  public exemptAddresses = async (params: ExemptAddressesParams) => {
    return (await this.contract).exemptAddresses.callAsync(numberToBigNumber(params.index));
  };

  public individualDailyRestriction = async (params: IndividualRestrictionParams) => {
    const result = await (await this.contract).individualDailyRestriction.callAsync(params.index);
    const typedResult: IndividualRestriction = {
      allowedTokens: result[0],
      startTime: bigNumberToDate(result[1]),
      rollingPeriodInDays: bigNumberToNumber(result[2]),
      endTime: bigNumberToDate(result[3]),
      restrictionType: result[4],
    };
    return typedResult;
  };

  public changeExemptWalletList = async (params: ChangeExemptWalletListParams) => {
    assert.isETHAddressHex('wallet', params.wallet);
    assert.isAddressNotZero(params.wallet);
    const isWalletExempt = (await this.getExemptAddress()).includes(params.wallet);
    assert.assert(!isWalletExempt === params.change, 'There will be no change to exempt list');
    return (await this.contract).changeExemptWalletList.sendTransactionAsync(
      params.wallet,
      params.change,
      params.txData,
      params.safetyFactor,
    );
  };

  public addIndividualRestriction = async (params: AddIndividualRestrictionParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    assert.isETHAddressHex('holder', params.holder);
    assert.isAddressNotZero(params.holder);
    assert.assert((await this.getExemptAddress()).includes(params.holder), 'Holder is exempt from restriction');
    assert.checkRestrictionInputParams(
      params.startTime,
      params.allowedTokens,
      params.restrictionType,
      params.rollingPeriodInDays,
    );
    return (await this.contract).addIndividualRestriction.sendTransactionAsync(
      params.holder,
      params.allowedTokens,
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.rollingPeriodInDays),
      dateToBigNumber(params.endTime),
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  public addIndividualDailyRestriction = async (params: AddIndividualDailyRestrictionParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    assert.isETHAddressHex('holder', params.holder);
    assert.isAddressNotZero(params.holder);
    assert.checkRestrictionInputParams(params.startTime, params.allowedTokens, params.restrictionType, 1);
    return (await this.contract).addIndividualDailyRestriction.sendTransactionAsync(
      params.holder,
      params.allowedTokens,
      dateToBigNumber(params.startTime),
      dateToBigNumber(params.endTime),
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  public addIndividualDailyRestrictionMulti = async (params: AddIndividualDailyRestrictionMultiParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    assert.isETHAddressHexArray('holders', params.holders);
    assert.isAddressArrayNotZero(params.holders);
    assert.checkIndividualDailyRestrictionMultiConditions(
      params.holders,
      params.startTimes,
      params.allowedTokens,
      params.restrictionTypes,
      params.endTimes,
    );
    return (await this.contract).addIndividualDailyRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.allowedTokens,
      dateArrayToBigNumberArray(params.startTimes),
      dateArrayToBigNumberArray(params.endTimes),
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  };

  public addIndividualRestrictionMulti = async (params: AddIndividualRestrictionMultiParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    assert.isETHAddressHexArray('holders', params.holders);
    assert.isAddressArrayNotZero(params.holders);
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < params.holders.length; i + 1) {
      assert.assert((await this.getExemptAddress()).includes(params.holders[i]), 'Holder is exempt from restriction');
    }
    /* eslint-enable no-await-in-loop */
    assert.checkIndividualRestrictionMultiConditions(
      params.holders,
      params.startTimes,
      params.allowedTokens,
      params.restrictionTypes,
      params.rollingPeriodInDays,
      params.endTimes,
    );

    return (await this.contract).addIndividualRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.allowedTokens,
      dateArrayToBigNumberArray(params.startTimes),
      numberArrayToBigNumberArray(params.rollingPeriodInDays),
      dateArrayToBigNumberArray(params.endTimes),
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  };

  public addDefaultRestriction = async (params: AddDefaultRestrictionParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    assert.checkRestrictionInputParams(
      params.startTime,
      params.allowedTokens,
      params.restrictionType,
      params.rollingPeriodInDays,
    );
    return (await this.contract).addDefaultRestriction.sendTransactionAsync(
      params.allowedTokens,
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.rollingPeriodInDays),
      dateToBigNumber(params.endTime),
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  public addDefaultDailyRestriction = async (params: AddDefaultDailyRestrictionParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    assert.checkRestrictionInputParams(params.startTime, params.allowedTokens, params.restrictionType, 1);
    return (await this.contract).addDefaultDailyRestriction.sendTransactionAsync(
      params.allowedTokens,
      dateToBigNumber(params.startTime),
      dateToBigNumber(params.endTime),
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  public removeIndividualRestriction = async (params: HolderIndividualRestrictionParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    await this.checkIndividualRestriction(params.holder);
    assert.isAddressNotZero(params.holder);
    assert.isETHAddressHex('holder', params.holder);
    return (await this.contract).removeIndividualRestriction.sendTransactionAsync(
      params.holder,
      params.txData,
      params.safetyFactor,
    );
  };

  public removeIndividualRestrictionMulti = async (params: IndividualRestrictionMultiParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    assert.isAddressArrayNotZero(params.holders);
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < params.holders.length; i + 1) {
      await this.checkIndividualRestriction(params.holders[i]);
    }
    /* eslint-enable no-await-in-loop */
    assert.isETHAddressHexArray('holders', params.holders);
    return (await this.contract).removeIndividualRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.txData,
      params.safetyFactor,
    );
  };

  public removeIndividualDailyRestriction = async (params: HolderIndividualRestrictionParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    await this.checkIndividualDailyRestriction(params.holder);
    assert.isAddressNotZero(params.holder);
    assert.isETHAddressHex('holder', params.holder);
    return (await this.contract).removeIndividualDailyRestriction.sendTransactionAsync(
      params.holder,
      params.txData,
      params.safetyFactor,
    );
  };

  public removeIndividualDailyRestrictionMulti = async (params: IndividualRestrictionMultiParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < params.holders.length; i + 1) {
      await this.checkIndividualDailyRestriction(params.holders[i]);
    }
    /* eslint-enable no-await-in-loop */
    assert.isAddressArrayNotZero(params.holders);
    assert.isETHAddressHexArray('holders', params.holders);
    return (await this.contract).removeIndividualDailyRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.txData,
      params.safetyFactor,
    );
  };

  public removeDefaultRestriction = async (params: TxParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    await this.checkDefaultRestriction();
    return (await this.contract).removeDefaultRestriction.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public removeDefaultDailyRestriction = async (params: TxParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    await this.checkDefaultDailyRestriction();
    return (await this.contract).removeDefaultDailyRestriction.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public modifyIndividualRestriction = async (params: ModifyIndividualRestrictionParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    assert.isAddressNotZero(params.holder);
    assert.isETHAddressHex('holder', params.holder);
    assert.checkRestrictionInputParams(
      params.startTime,
      params.allowedTokens,
      params.restrictionType,
      params.rollingPeriodInDays,
    );
    return (await this.contract).modifyIndividualRestriction.sendTransactionAsync(
      params.holder,
      params.allowedTokens,
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.rollingPeriodInDays),
      dateToBigNumber(params.endTime),
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyIndividualDailyRestriction = async (params: ModifyIndividualDailyRestrictionParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    assert.isAddressNotZero(params.holder);
    assert.isETHAddressHex('holder', params.holder);
    assert.checkRestrictionInputParams(params.startTime, params.allowedTokens, params.restrictionType, 1);
    return (await this.contract).modifyIndividualDailyRestriction.sendTransactionAsync(
      params.holder,
      params.allowedTokens,
      dateToBigNumber(params.startTime),
      dateToBigNumber(params.endTime),
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyIndividualDailyRestrictionMulti = async (params: ModifyIndividualDailyRestrictionMultiParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    assert.isAddressArrayNotZero(params.holders);
    assert.isETHAddressHexArray('holders', params.holders);
    assert.checkIndividualDailyRestrictionMultiConditions(
      params.holders,
      params.startTimes,
      params.allowedTokens,
      params.restrictionTypes,
      params.endTimes,
    );
    return (await this.contract).modifyIndividualDailyRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.allowedTokens,
      dateArrayToBigNumberArray(params.startTimes),
      dateArrayToBigNumberArray(params.endTimes),
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyIndividualRestrictionMulti = async (params: ModifyIndividualRestrictionMultiParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    assert.isAddressArrayNotZero(params.holders);
    assert.isETHAddressHexArray('holders', params.holders);
    assert.checkIndividualRestrictionMultiConditions(
      params.holders,
      params.startTimes,
      params.allowedTokens,
      params.restrictionTypes,
      params.rollingPeriodInDays,
      params.endTimes,
    );
    return (await this.contract).modifyIndividualRestrictionMulti.sendTransactionAsync(
      params.holders,
      params.allowedTokens,
      dateArrayToBigNumberArray(params.startTimes),
      numberArrayToBigNumberArray(params.rollingPeriodInDays),
      dateArrayToBigNumberArray(params.endTimes),
      params.restrictionTypes,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyDefaultRestriction = async (params: ModifyDefaultRestrictionParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    assert.checkRestrictionInputParams(
      params.startTime,
      params.allowedTokens,
      params.restrictionType,
      params.rollingPeriodInDays,
    );
    return (await this.contract).modifyDefaultRestriction.sendTransactionAsync(
      params.allowedTokens,
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.rollingPeriodInDays),
      dateToBigNumber(params.endTime),
      params.restrictionType,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyDefaultDailyRestriction = async (params: ModifyDefaultDailyRestrictionParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm Admin) Requires ISecurityToken and Ownable
    assert.checkRestrictionInputParams(params.startTime, params.allowedTokens, params.restrictionType, 1);
    return (await this.contract).modifyDefaultDailyRestriction.sendTransactionAsync(
      params.allowedTokens,
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
    const typedResult: GetIndividualBucketDetails = {
      lastTradedDayTime: bigNumberToDate(result[0]),
      sumOfLastPeriod: result[1],
      daysCovered: bigNumberToNumber(result[2]),
      dailyLastTradedDayTime: bigNumberToDate(result[3]),
      lastTradedTimestamp: bigNumberToDate(result[4]),
    };
    return typedResult;
  };

  public getDefaultBucketDetailsToUser = async (params: GetIndividualBucketDetailsToUserParams) => {
    assert.isETHAddressHex('user', params.user);
    const result = await (await this.contract).getDefaultBucketDetailsToUser.callAsync(params.user);
    const typedResult: GetIndividualBucketDetails = {
      lastTradedDayTime: bigNumberToDate(result[0]),
      sumOfLastPeriod: result[1],
      daysCovered: bigNumberToNumber(result[2]),
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
    const typedResult: GetRestrictedData[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      const getRestrictedData: GetRestrictedData = {
        allAddresses: result[0][i],
        allowedTokens: result[1][i],
        startTime: bigNumberToDate(result[2][i]),
        rollingPeriodInDays: bigNumberToNumber(result[3][i]),
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

  private checkIsNotPaused = async () => {
    assert.assert(!(await this.paused()), 'Controller currently paused');
  };

  private checkIsPaused = async () => {
    assert.assert(await this.paused(), 'Controller not currently paused');
  };

  private checkDefaultRestriction = async () => {
    assert.assert(
      (await this.defaultRestriction()).endTime !== new Date(0),
      'Individual Restriction not set with end time',
    );
  };

  private checkDefaultDailyRestriction = async () => {
    assert.assert(
      (await this.defaultDailyRestriction()).endTime !== new Date(0),
      'Individual Restriction not set with end time',
    );
  };

  private checkIndividualRestriction = async (index: string) => {
    assert.assert(
      (await this.individualRestriction({ index })).endTime !== new Date(0),
      'Individual Restriction not set with end time',
    );
  };

  private checkIndividualDailyRestriction = async (index: string) => {
    assert.assert(
      (await this.individualDailyRestriction({ index })).endTime !== new Date(0),
      'Individual Daily Restriction not set with end time',
    );
  };
}
