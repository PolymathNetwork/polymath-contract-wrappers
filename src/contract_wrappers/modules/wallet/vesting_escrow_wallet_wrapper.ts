import {
  VestingEscrowWalletContract,
  VestingEscrowWalletEventArgs,
  VestingEscrowWalletEvents,
  VestingEscrowWalletAddScheduleEventArgs,
  VestingEscrowWalletModifyScheduleEventArgs,
  VestingEscrowWalletRevokeAllSchedulesEventArgs,
  VestingEscrowWalletRevokeScheduleEventArgs,
  VestingEscrowWalletDepositTokensEventArgs,
  VestingEscrowWalletSendToTreasuryEventArgs,
  VestingEscrowWalletSendTokensEventArgs,
  VestingEscrowWalletAddTemplateEventArgs,
  VestingEscrowWalletRemoveTemplateEventArgs,
  VestingEscrowWalletTreasuryWalletChangedEventArgs,
  VestingEscrowWalletPauseEventArgs,
  VestingEscrowWalletUnpauseEventArgs,
  VestingEscrowWallet,
  Web3Wrapper,
  ContractAbi,
  LogWithDecodedArgs,
  BigNumber,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import ModuleWrapper from '../module_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Subscribe,
  GetLogs,
  TransferResult,
  Perm,
} from '../../../types';
import { numberToBigNumber, valueToWei, dateToBigNumber } from '../../../utils/convert';

interface AddScheduleSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents.AddSchedule;
  callback: EventCallback<VestingEscrowWalletAddScheduleEventArgs>;
}

interface GetAddScheduleLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents.AddSchedule;
}

interface ModifyScheduleSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents.ModifySchedule;
  callback: EventCallback<VestingEscrowWalletModifyScheduleEventArgs>;
}

interface GetModifyScheduleLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents.ModifySchedule;
}

interface RevokeAllSchedulesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents.RevokeAllSchedules;
  callback: EventCallback<VestingEscrowWalletRevokeAllSchedulesEventArgs>;
}

interface GetRevokeAllSchedulesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents.RevokeAllSchedules;
}

interface RevokeScheduleSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents.RevokeSchedule;
  callback: EventCallback<VestingEscrowWalletRevokeScheduleEventArgs>;
}

interface GetRevokeScheduleLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents.RevokeSchedule;
}

interface DepositTokensSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents.DepositTokens;
  callback: EventCallback<VestingEscrowWalletDepositTokensEventArgs>;
}

interface GetDepositTokensLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents.DepositTokens;
}

interface SendToTreasurySubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents.SendToTreasury;
  callback: EventCallback<VestingEscrowWalletSendToTreasuryEventArgs>;
}

interface GetSendToTreasuryLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents.SendToTreasury;
}

interface SendTokensSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents.SendTokens;
  callback: EventCallback<VestingEscrowWalletSendTokensEventArgs>;
}

interface GetSendTokensLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents.SendTokens;
}

interface AddTemplateSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents.AddTemplate;
  callback: EventCallback<VestingEscrowWalletAddTemplateEventArgs>;
}

interface GetAddTemplateLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents.AddTemplate;
}

interface RemoveTemplateSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents.RemoveTemplate;
  callback: EventCallback<VestingEscrowWalletRemoveTemplateEventArgs>;
}

interface GetRemoveTemplateLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents.RemoveTemplate;
}

interface TreasuryWalletChangedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents.TreasuryWalletChanged;
  callback: EventCallback<VestingEscrowWalletTreasuryWalletChangedEventArgs>;
}

interface GetTreasuryWalletChangedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents.TreasuryWalletChanged;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents.Pause;
  callback: EventCallback<VestingEscrowWalletPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents.Unpause;
  callback: EventCallback<VestingEscrowWalletUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents.Unpause;
}

interface VestingEscrowWalletSubscribeAsyncParams extends Subscribe {
  (params: AddScheduleSubscribeAsyncParams): Promise<string>;
  (params: ModifyScheduleSubscribeAsyncParams): Promise<string>;
  (params: RevokeAllSchedulesSubscribeAsyncParams): Promise<string>;
  (params: RevokeScheduleSubscribeAsyncParams): Promise<string>;
  (params: DepositTokensSubscribeAsyncParams): Promise<string>;
  (params: SendToTreasurySubscribeAsyncParams): Promise<string>;
  (params: SendTokensSubscribeAsyncParams): Promise<string>;
  (params: AddTemplateSubscribeAsyncParams): Promise<string>;
  (params: RemoveTemplateSubscribeAsyncParams): Promise<string>;
  (params: TreasuryWalletChangedSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetVestingEscrowWalletLogsAsyncParams extends GetLogs {
  (params: GetAddScheduleLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletAddScheduleEventArgs>[]>;
  (params: GetModifyScheduleLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletModifyScheduleEventArgs>[]>;
  (params: GetRevokeAllSchedulesLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletRevokeAllSchedulesEventArgs>[]
  >;
  (params: GetRevokeScheduleLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletRevokeScheduleEventArgs>[]>;
  (params: GetDepositTokensLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletDepositTokensEventArgs>[]>;
  (params: GetSendToTreasuryLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletSendToTreasuryEventArgs>[]>;
  (params: GetSendTokensLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletSendTokensEventArgs>[]>;
  (params: GetAddTemplateLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletAddTemplateEventArgs>[]>;
  (params: GetRemoveTemplateLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletRemoveTemplateEventArgs>[]>;
  (params: GetTreasuryWalletChangedLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletTreasuryWalletChangedEventArgs>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletPauseEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletUnpauseEventArgs>[]>;
}

interface SchedulesParams {
  beneficiary: string;
  index: number;
}

interface TemplateNamesParams {
  index: number;
}

interface BeneficiariesParams {
  index: number;
}

interface ChangeTreasuryWalletParams extends TxParams {
  newTreasuryWallet: string;
}

interface DepositTokensParams extends TxParams {
  numberOfTokens: number;
}

interface SendToTreasuryParams extends TxParams {
  amount: number;
}

interface PushAvailableTokensParams extends TxParams {
  beneficiary: string;
}

interface AddTemplateParams extends TxParams {
  name: string;
  numberOfTokens: number;
  duration: number;
  frequency: number;
}

interface RemoveTemplateParams extends TxParams {
  name: string;
}

interface AddScheduleParams extends TxParams {
  beneficiary: string;
  templateName: string;
  numberOfTokens: number;
  duration: number;
  frequency: number;
  startTime?: Date;
}

interface AddScheduleFromTemplateParams extends TxParams {
  beneficiary: string;
  templateName: string;
  startTime?: Date;
}

interface ModifyScheduleParams extends TxParams {
  beneficiary: string;
  templateName: string;
  startTime?: Date;
}

interface RevokeScheduleParams extends TxParams {
  beneficiary: string;
  templateName: string;
}

interface RevokeAllSchedulesParams extends TxParams {
  beneficiary: string;
}

interface GetScheduleParams {
  beneficiary: string;
  templateName: string;
}

interface GetTemplateNamesParams {
  beneficiary: string;
}

interface GetScheduleCountParams {
  beneficiary: string;
}

interface PushAvailableTokensMultiParams extends TxParams {
  fromIndex: number;
  toIndex: number;
}

interface AddScheduleMultiParams extends TxParams {
  beneficiaries: string[];
  templateNames: string[];
  numberOfTokens: number[];
  durations: number[];
  frequencies: number[];
  startTimes: Date[];
}

interface AddScheduleFromTemplateMultiParams extends TxParams {
  beneficiaries: string[];
  templateNames: string[];
  startTimes: Date[];
}

interface RevokeSchedulesMultiParams extends TxParams {
  beneficiaries: string[];
}

interface ModifyScheduleMultiParams extends TxParams {
  beneficiaries: string[];
  templateNames: string[];
  startTimes: Date[];
}

/**
 * This class includes the functionality related to interacting with the Vesting Escrow Wallet contract.
 */
export default class VestingEscrowWalletWrapper extends ModuleWrapper {
  public abi: ContractAbi = VestingEscrowWallet.abi;

  protected contract: Promise<VestingEscrowWalletContract>;

  /**
   * Instantiate VestingEscrowWalletWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<VestingEscrowWalletContract>,
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

  public treasuryWallet = async () => {
    return (await this.contract).treasuryWallet.callAsync();
  };

  public unassignedTokens = async () => {
    return (await this.contract).unassignedTokens.callAsync();
  };

  public schedules = async (params: SchedulesParams) => {
    return (await this.contract).schedules.callAsync(params.beneficiary, numberToBigNumber(params.index));
  };

  public templateNames = async (params: TemplateNamesParams) => {
    return (await this.contract).templateNames.callAsync(numberToBigNumber(params.index));
  };

  public beneficiaries = async (params: BeneficiariesParams) => {
    return (await this.contract).beneficiaries.callAsync(numberToBigNumber(params.index));
  };

  public getDataStore = async () => {
    return (await this.contract).getDataStore.callAsync();
  };

  public changeTreasuryWallet = async (params: ChangeTreasuryWalletParams) => {
    return (await this.contract).changeTreasuryWallet.sendTransactionAsync(
      params.newTreasuryWallet,
      params.txData,
      params.safetyFactor,
    );
  };

  public depositTokens = async (params: DepositTokensParams) => {
    return (await this.contract).depositTokens.sendTransactionAsync(
      numberToBigNumber(params.numberOfTokens),
      params.txData,
      params.safetyFactor,
    );
  };

  public sendToTreasury = async (params: SendToTreasuryParams) => {
    return (await this.contract).sendToTreasury.sendTransactionAsync(
      numberToBigNumber(params.amount),
      params.txData,
      params.safetyFactor,
    );
  };

  public getTreasuryWallet = async () => {
    return (await this.contract).getTreasuryWallet.callAsync();
  };

  public pushAvailableTokens = async (params: PushAvailableTokensParams) => {
    return (await this.contract).pushAvailableTokens.sendTransactionAsync(
      params.beneficiary,
      params.txData,
      params.safetyFactor,
    );
  };

  public pullAvailableTokens = async (params: TxParams) => {
    return (await this.contract).pullAvailableTokens.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public addTemplate = async (params: AddTemplateParams) => {
    return (await this.contract).addTemplate.sendTransactionAsync(
      params.name,
      numberToBigNumber(params.numberOfTokens),
      numberToBigNumber(params.duration),
      numberToBigNumber(params.frequency),
      params.txData,
      params.safetyFactor,
    );
  };

  public removeTemplate = async (params: RemoveTemplateParams) => {
    return (await this.contract).removeTemplate.sendTransactionAsync(params.name, params.txData, params.safetyFactor);
  };

  public getTemplateCount = async () => {
    return (await this.contract).getTreasuryWallet.callAsync();
  };

  public getAllTemplateNames = async () => {
    return (await this.contract).getTreasuryWallet.callAsync();
  };

  public addSchedule = async (params: AddScheduleParams) => {
    let startTime = new BigNumber(0);
    if (params.startTime) {
      startTime = dateToBigNumber(params.startTime);
    }

    return (await this.contract).addSchedule.sendTransactionAsync(
      params.beneficiary,
      params.templateName,
      numberToBigNumber(params.numberOfTokens),
      numberToBigNumber(params.duration),
      numberToBigNumber(params.frequency),
      startTime,
      params.txData,
      params.safetyFactor,
    );
  };

  public addScheduleFromTemplate = async (params: AddScheduleFromTemplateParams) => {
    let startTime = new BigNumber(0);
    if (params.startTime) {
      startTime = dateToBigNumber(params.startTime);
    }
    return (await this.contract).addScheduleFromTemplate.sendTransactionAsync(
      params.beneficiary,
      params.templateName,
      startTime,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifySchedule = async (params: ModifyScheduleParams) => {
    let startTime = new BigNumber(0);
    if (params.startTime) {
      startTime = dateToBigNumber(params.startTime);
    }
    return (await this.contract).modifySchedule.sendTransactionAsync(
      params.beneficiary,
      params.templateName,
      startTime,
      params.txData,
      params.safetyFactor,
    );
  };

  public revokeSchedule = async (params: RevokeScheduleParams) => {
    return (await this.contract).revokeSchedule.sendTransactionAsync(
      params.beneficiary,
      params.templateName,
      params.txData,
      params.safetyFactor,
    );
  };

  public revokeAllSchedules = async (params: RevokeAllSchedulesParams) => {
    return (await this.contract).revokeAllSchedules.sendTransactionAsync(
      params.beneficiary,
      params.txData,
      params.safetyFactor,
    );
  };

  public getSchedule = async (params: GetScheduleParams) => {
    return (await this.contract).getSchedule.callAsync(params.beneficiary, params.templateName);
  };

  public getTemplateNames = async (params: GetTemplateNamesParams) => {
    return (await this.contract).getTemplateNames.callAsync(params.beneficiary);
  };

  public getScheduleCount = async (params: GetScheduleCountParams) => {
    return (await this.contract).getScheduleCount.callAsync(params.beneficiary);
  };

  public pushAvailableTokensMulti = async (params: PushAvailableTokensMultiParams) => {
    return (await this.contract).pushAvailableTokensMulti.sendTransactionAsync(
      numberToBigNumber(params.fromIndex),
      numberToBigNumber(params.toIndex),
      params.txData,
      params.safetyFactor,
    );
  };

  public addScheduleMulti = async (params: AddScheduleMultiParams) => {
    return (await this.contract).addScheduleMulti.sendTransactionAsync(
      params.beneficiaries,
      params.templateNames,
      params.numberOfTokens.map(number => {
        return numberToBigNumber(number);
      }),
      params.durations.map(duration => {
        return numberToBigNumber(duration);
      }),
      params.frequencies.map(frequency => {
        return numberToBigNumber(frequency);
      }),
      params.startTimes.map(startTime => {
        return dateToBigNumber(startTime);
      }),
      params.txData,
      params.safetyFactor,
    );
  };

  public addScheduleFromTemplateMulti = async (params: AddScheduleFromTemplateMultiParams) => {
    return (await this.contract).addScheduleFromTemplateMulti.sendTransactionAsync(
      params.beneficiaries,
      params.templateNames,
      params.startTimes.map(startTime => {
        return dateToBigNumber(startTime);
      }),
      params.txData,
      params.safetyFactor,
    );
  };

  public revokeSchedulesMulti = async (params: RevokeSchedulesMultiParams) => {
    return (await this.contract).revokeSchedulesMulti.sendTransactionAsync(
      params.beneficiaries,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyScheduleMulti = async (params: ModifyScheduleMultiParams) => {
    return (await this.contract).modifyScheduleMulti.sendTransactionAsync(
      params.beneficiaries,
      params.templateNames,
      params.startTimes.map(startTime => {
        return dateToBigNumber(startTime);
      }),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: VestingEscrowWalletSubscribeAsyncParams = async <
    ArgsType extends VestingEscrowWalletEventArgs
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VestingEscrowWalletEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      VestingEscrowWallet.abi,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetVestingEscrowWalletLogsAsyncParams = async <ArgsType extends VestingEscrowWalletEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VestingEscrowWalletEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      VestingEscrowWallet.abi,
    );
    return logs;
  };
}
