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
import { numberToBigNumber, valueToWei } from '../../../utils/convert';

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

  public schedules = async () => {
    return (await this.contract).schedules.callAsync();
  };

  public templateNames = async () => {
    return (await this.contract).templateNames.callAsync();
  };

  public beneficiaries = async () => {
    return (await this.contract).beneficiaries.callAsync();
  };

  public getDataStore = async () => {
    return (await this.contract).getDataStore.callAsync();
  };

  public changeTreasuryWallet = async () => {};

  public depositTokens = async () => {};

  public sendToTreasury = async () => {};

  public getTreasuryWallet = async () => {
    return (await this.contract).getTreasuryWallet.callAsync();
  };

  public pushAvailableTokens = async () => {};

  public pullAvailableTokens = async () => {};

  public addTemplate = async () => {};

  public removeTemplate = async () => {};

  public getTemplateCount = async () => {
    return (await this.contract).getTreasuryWallet.callAsync();
  };

  public getAllTemplateNames = async () => {
    return (await this.contract).getTreasuryWallet.callAsync();
  };

  public addSchedule = async () => {};

  public addScheduleFromTemplate = async () => {};

  public modifySchedule = async () => {};

  public revokeSchedule = async () => {};

  public revokeAllSchedules = async () => {};

  public getSchedule = async () => {
    return (await this.contract).getSchedule.callAsync();
  };

  public getTemplateNames = async () => {
    return (await this.contract).getTemplateNames.callAsync();
  };

  public getScheduleCount = async () => {
    return (await this.contract).getScheduleCount.callAsync();
  };

  public pushAvailableTokensMulti = async () => {};

  public addScheduleMulti = async () => {};

  public addScheduleFromTemplateMulti = async () => {};

  public revokeSchedulesMulti = async () => {};

  public modifyScheduleMulti = async () => {};

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
