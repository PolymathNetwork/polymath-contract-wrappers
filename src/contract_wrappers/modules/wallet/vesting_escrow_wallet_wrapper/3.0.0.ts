import {
  VestingEscrowWalletContract_3_0_0,
  Web3Wrapper,
  PolyResponse,
  LogWithDecodedArgs,
  VestingEscrowWalletEventArgs_3_0_0,
  VestingEscrowWalletEvents_3_0_0,
  VestingEscrowWalletAddScheduleEventArgs_3_0_0,
  VestingEscrowWalletModifyScheduleEventArgs_3_0_0,
  VestingEscrowWalletRevokeAllSchedulesEventArgs_3_0_0,
  VestingEscrowWalletRevokeScheduleEventArgs_3_0_0,
  VestingEscrowWalletDepositTokensEventArgs_3_0_0,
  VestingEscrowWalletSendToTreasuryEventArgs_3_0_0,
  VestingEscrowWalletSendTokensEventArgs_3_0_0,
  VestingEscrowWalletAddTemplateEventArgs_3_0_0,
  VestingEscrowWalletRemoveTemplateEventArgs_3_0_0,
  VestingEscrowWalletTreasuryWalletChangedEventArgs_3_0_0,
  VestingEscrowWalletPauseEventArgs_3_0_0,
  VestingEscrowWalletUnpauseEventArgs_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import ContractFactory from '../../../../factories/contractFactory';
import {
  ContractVersion,
  TxParams,
  Perm,
  ErrorCode,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Subscribe,
  GetLogs,
  Constructor,
} from '../../../../types';
import { stringToBytes32, dateToBigNumber } from '../../../../utils/convert';
import VestingEscrowWalletCommon from './common';
import assert from '../../../../utils/assert';
import { WithModule_3_0_0 } from '../../module_wrapper';

interface AddScheduleSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.AddSchedule;
  callback: EventCallback<VestingEscrowWalletAddScheduleEventArgs_3_0_0>;
}

interface GetAddScheduleLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.AddSchedule;
}

interface ModifyScheduleSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.ModifySchedule;
  callback: EventCallback<VestingEscrowWalletModifyScheduleEventArgs_3_0_0>;
}

interface GetModifyScheduleLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.ModifySchedule;
}

interface RevokeAllSchedulesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.RevokeAllSchedules;
  callback: EventCallback<VestingEscrowWalletRevokeAllSchedulesEventArgs_3_0_0>;
}

interface GetRevokeAllSchedulesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.RevokeAllSchedules;
}

interface RevokeScheduleSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.RevokeSchedule;
  callback: EventCallback<VestingEscrowWalletRevokeScheduleEventArgs_3_0_0>;
}

interface GetRevokeScheduleLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.RevokeSchedule;
}

interface DepositTokensSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.DepositTokens;
  callback: EventCallback<VestingEscrowWalletDepositTokensEventArgs_3_0_0>;
}

interface GetDepositTokensLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.DepositTokens;
}

interface SendToTreasurySubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.SendToTreasury;
  callback: EventCallback<VestingEscrowWalletSendToTreasuryEventArgs_3_0_0>;
}

interface GetSendToTreasuryLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.SendToTreasury;
}

interface SendTokensSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.SendTokens;
  callback: EventCallback<VestingEscrowWalletSendTokensEventArgs_3_0_0>;
}

interface GetSendTokensLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.SendTokens;
}

interface AddTemplateSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.AddTemplate;
  callback: EventCallback<VestingEscrowWalletAddTemplateEventArgs_3_0_0>;
}

interface GetAddTemplateLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.AddTemplate;
}

interface RemoveTemplateSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.RemoveTemplate;
  callback: EventCallback<VestingEscrowWalletRemoveTemplateEventArgs_3_0_0>;
}

interface GetRemoveTemplateLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.RemoveTemplate;
}

interface TreasuryWalletChangedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.TreasuryWalletChanged;
  callback: EventCallback<VestingEscrowWalletTreasuryWalletChangedEventArgs_3_0_0>;
}

interface GetTreasuryWalletChangedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.TreasuryWalletChanged;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.Pause;
  callback: EventCallback<VestingEscrowWalletPauseEventArgs_3_0_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.Unpause;
  callback: EventCallback<VestingEscrowWalletUnpauseEventArgs_3_0_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_0_0.Unpause;
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
  (params: GetAddScheduleLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletAddScheduleEventArgs_3_0_0>[]>;
  (params: GetModifyScheduleLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletModifyScheduleEventArgs_3_0_0>[]
  >;
  (params: GetRevokeAllSchedulesLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletRevokeAllSchedulesEventArgs_3_0_0>[]
  >;
  (params: GetRevokeScheduleLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletRevokeScheduleEventArgs_3_0_0>[]
  >;
  (params: GetDepositTokensLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletDepositTokensEventArgs_3_0_0>[]
  >;
  (params: GetSendToTreasuryLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletSendToTreasuryEventArgs_3_0_0>[]
  >;
  (params: GetSendTokensLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletSendTokensEventArgs_3_0_0>[]>;
  (params: GetAddTemplateLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletAddTemplateEventArgs_3_0_0>[]>;
  (params: GetRemoveTemplateLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletRemoveTemplateEventArgs_3_0_0>[]
  >;
  (params: GetTreasuryWalletChangedLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletTreasuryWalletChangedEventArgs_3_0_0>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletPauseEventArgs_3_0_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletUnpauseEventArgs_3_0_0>[]>;
}

/**
 * @param beneficiary Address of the beneficiary for whom it is modified
 * @param templateName Name of the template was used for schedule creation
 * @param startTime Start time of the created vesting schedule
 */
interface ModifyScheduleParams extends TxParams {
  beneficiary: string;
  templateName: string;
  startTime: Date;
}

export namespace VestingEscrowWalletTransactionParams {
  export interface ModifySchedule extends ModifyScheduleParams {}
}

const VestingEscrowWalletBase_3_0_0 = WithModule_3_0_0(VestingEscrowWalletCommon as unknown as Constructor<VestingEscrowWalletCommon>);

/**
 * This class includes the functionality related to interacting with the Vesting Escrow Wallet contract.
 */
export class VestingEscrowWallet_3_0_0 extends VestingEscrowWalletBase_3_0_0 {
  public contract: Promise<VestingEscrowWalletContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate VestingEscrowWalletWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<VestingEscrowWalletContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Address of the Treasury wallet. All of the unassigned token will transfer to that address.
   * @return address
   */
  public treasuryWallet = async (): Promise<string> => {
    return (await this.contract).treasuryWallet.callAsync();
  };

  /**
   * Modifies a vesting schedule for a beneficiary address
   */
  public modifySchedule = async (params: ModifyScheduleParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.checkSchedule(params.beneficiary);
    assert.assert(params.startTime.getTime() > Date.now(), ErrorCode.TooEarly, 'Date in the past');
    return (await this.contract).modifySchedule.sendTransactionAsync(
      params.beneficiary,
      stringToBytes32(params.templateName),
      dateToBigNumber(params.startTime),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: VestingEscrowWalletSubscribeAsyncParams = async <
    ArgsType extends VestingEscrowWalletEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VestingEscrowWalletEvents_3_0_0);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
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
  public getLogsAsync: GetVestingEscrowWalletLogsAsyncParams = async <
    ArgsType extends VestingEscrowWalletEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VestingEscrowWalletEvents_3_0_0);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
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

export function isVestingEscrowWallet_3_0_0(wrapper: VestingEscrowWalletCommon): wrapper is VestingEscrowWallet_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
