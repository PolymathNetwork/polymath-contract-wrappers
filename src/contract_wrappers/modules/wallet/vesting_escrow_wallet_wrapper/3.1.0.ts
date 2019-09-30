import {
  VestingEscrowWalletContract_3_1_0,
  Web3Wrapper,
  BigNumber,
  PolyResponse,
  LogWithDecodedArgs,
  VestingEscrowWalletEventArgs_3_1_0,
  VestingEscrowWalletEvents_3_1_0,
  VestingEscrowWalletAddScheduleEventArgs_3_1_0,
  VestingEscrowWalletModifyScheduleEventArgs_3_1_0,
  VestingEscrowWalletRevokeAllSchedulesEventArgs_3_1_0,
  VestingEscrowWalletRevokeScheduleEventArgs_3_1_0,
  VestingEscrowWalletDepositTokensEventArgs_3_1_0,
  VestingEscrowWalletSendToTreasuryEventArgs_3_1_0,
  VestingEscrowWalletSendTokensEventArgs_3_1_0,
  VestingEscrowWalletAddTemplateEventArgs_3_1_0,
  VestingEscrowWalletRemoveTemplateEventArgs_3_1_0,
  VestingEscrowWalletTreasuryWalletChangedEventArgs_3_1_0,
  VestingEscrowWalletPauseEventArgs_3_1_0,
  VestingEscrowWalletUnpauseEventArgs_3_1_0,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../../utils/assert';
import ContractFactory from '../../../../factories/contractFactory';
import {
  ErrorCode,
  ContractVersion,
  TxParams,
  Perm,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Subscribe,
  GetLogs,
  Constructor,
} from '../../../../types';
import { weiToValue, stringToBytes32, dateToBigNumber } from '../../../../utils/convert';
import VestingEscrowWalletCommon from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';

interface AddScheduleSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.AddSchedule;
  callback: EventCallback<VestingEscrowWalletAddScheduleEventArgs_3_1_0>;
}

interface GetAddScheduleLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.AddSchedule;
}

interface ModifyScheduleSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.ModifySchedule;
  callback: EventCallback<VestingEscrowWalletModifyScheduleEventArgs_3_1_0>;
}

interface GetModifyScheduleLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.ModifySchedule;
}

interface RevokeAllSchedulesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.RevokeAllSchedules;
  callback: EventCallback<VestingEscrowWalletRevokeAllSchedulesEventArgs_3_1_0>;
}

interface GetRevokeAllSchedulesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.RevokeAllSchedules;
}

interface RevokeScheduleSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.RevokeSchedule;
  callback: EventCallback<VestingEscrowWalletRevokeScheduleEventArgs_3_1_0>;
}

interface GetRevokeScheduleLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.RevokeSchedule;
}

interface DepositTokensSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.DepositTokens;
  callback: EventCallback<VestingEscrowWalletDepositTokensEventArgs_3_1_0>;
}

interface GetDepositTokensLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.DepositTokens;
}

interface SendToTreasurySubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.SendToTreasury;
  callback: EventCallback<VestingEscrowWalletSendToTreasuryEventArgs_3_1_0>;
}

interface GetSendToTreasuryLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.SendToTreasury;
}

interface SendTokensSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.SendTokens;
  callback: EventCallback<VestingEscrowWalletSendTokensEventArgs_3_1_0>;
}

interface GetSendTokensLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.SendTokens;
}

interface AddTemplateSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.AddTemplate;
  callback: EventCallback<VestingEscrowWalletAddTemplateEventArgs_3_1_0>;
}

interface GetAddTemplateLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.AddTemplate;
}

interface RemoveTemplateSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.RemoveTemplate;
  callback: EventCallback<VestingEscrowWalletRemoveTemplateEventArgs_3_1_0>;
}

interface GetRemoveTemplateLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.RemoveTemplate;
}

interface TreasuryWalletChangedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.TreasuryWalletChanged;
  callback: EventCallback<VestingEscrowWalletTreasuryWalletChangedEventArgs_3_1_0>;
}

interface GetTreasuryWalletChangedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.TreasuryWalletChanged;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.Pause;
  callback: EventCallback<VestingEscrowWalletPauseEventArgs_3_1_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.Unpause;
  callback: EventCallback<VestingEscrowWalletUnpauseEventArgs_3_1_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: VestingEscrowWalletEvents_3_1_0.Unpause;
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
  (params: GetAddScheduleLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletAddScheduleEventArgs_3_1_0>[]>;
  (params: GetModifyScheduleLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletModifyScheduleEventArgs_3_1_0>[]
  >;
  (params: GetRevokeAllSchedulesLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletRevokeAllSchedulesEventArgs_3_1_0>[]
  >;
  (params: GetRevokeScheduleLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletRevokeScheduleEventArgs_3_1_0>[]
  >;
  (params: GetDepositTokensLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletDepositTokensEventArgs_3_1_0>[]
  >;
  (params: GetSendToTreasuryLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletSendToTreasuryEventArgs_3_1_0>[]
  >;
  (params: GetSendTokensLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletSendTokensEventArgs_3_1_0>[]>;
  (params: GetAddTemplateLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletAddTemplateEventArgs_3_1_0>[]>;
  (params: GetRemoveTemplateLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletRemoveTemplateEventArgs_3_1_0>[]
  >;
  (params: GetTreasuryWalletChangedLogsAsyncParams): Promise<
    LogWithDecodedArgs<VestingEscrowWalletTreasuryWalletChangedEventArgs_3_1_0>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletPauseEventArgs_3_1_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<VestingEscrowWalletUnpauseEventArgs_3_1_0>[]>;
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

// RETURN TYPES

interface Template {
  numberOfTokens: BigNumber;
  duration: number;
  frequency: number;
  index: number;
}

// uses 3.0.0 Module contract
const VestingEscrowWalletBase_3_1_0 = WithModule_3_0_0(VestingEscrowWalletCommon as unknown as Constructor<VestingEscrowWalletCommon>);

/**
 * This class includes the functionality related to interacting with the Vesting Escrow Wallet contract.
 */
export class VestingEscrowWallet_3_1_0 extends VestingEscrowWalletBase_3_1_0 {
  public contract: Promise<VestingEscrowWalletContract_3_1_0>;

  public contractVersion = ContractVersion.V3_1_0;

  /**
   * Instantiate VestingEscrowWalletWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<VestingEscrowWalletContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

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
    assert.assert(params.startTime.getTime() >= Date.now(), ErrorCode.TooEarly, 'Date in the past');
    return (await this.contract).modifySchedule.sendTransactionAsync(
      params.beneficiary,
      stringToBytes32(params.templateName),
      dateToBigNumber(params.startTime),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Returns a list of templates for a given template name
   * @param templateName Name of the template
   * @return List of templates
   */
  public templates = async (templateName: string): Promise<Template> => {
    const templates = await (await this.contract).templates.callAsync(stringToBytes32(templateName));
    const result: Template = {
      numberOfTokens: templates[0],
      duration: templates[1].toNumber(),
      frequency: templates[2].toNumber(),
      index: templates[3].toNumber(),
    };
    return result;
  };

  /**
   * Returns the schedule count per template
   * @param templateName Name of the template
   * @return count of schedules
   */
  public getSchedulesCountByTemplate = async (templateName: string): Promise<number> => {
    assert.assert(templateName !== '', ErrorCode.InvalidData, 'Invalid name');
    const schedulesCount = await (await this.contract).getSchedulesCountByTemplate.callAsync(
      stringToBytes32(templateName),
    );
    return schedulesCount.toNumber();
  };

  /**
   * Returns the list of all beneficiary
   * @return List of addresses
   */
  public getAllBeneficiaries = async (): Promise<string[]> => {
    const result = await (await this.contract).getAllBeneficiaries.callAsync();
    return result;
  };

  /**
   * Returns the tokens quantity that can be withdrawn from the contract at a moment
   * @param beneficiary Address of the beneficiary
   * @return availableTokens Tokens amount that are available to withdraw
   */
  public getAvailableTokens = async (beneficiary: string): Promise<BigNumber> => {
    assert.isNonZeroETHAddressHex('beneficiary', beneficiary);
    const result = await (await this.contract).getAvailableTokens.callAsync(beneficiary);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return weiToValue(result, decimals);
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: VestingEscrowWalletSubscribeAsyncParams = async <
    ArgsType extends VestingEscrowWalletEventArgs_3_1_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VestingEscrowWalletEvents_3_1_0);
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
    ArgsType extends VestingEscrowWalletEventArgs_3_1_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VestingEscrowWalletEvents_3_1_0);
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

export function isVestingEscrowWallet_3_1_0(wrapper: VestingEscrowWalletCommon): wrapper is VestingEscrowWallet_3_1_0 {
  return wrapper.contractVersion === ContractVersion.V3_1_0;
}
