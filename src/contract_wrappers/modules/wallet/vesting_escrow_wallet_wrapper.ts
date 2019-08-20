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
  Perm,
  TransferStatusCode,
} from '../../../types';
import {
  numberToBigNumber,
  valueToWei,
  weiToValue,
  dateToBigNumber,
  bytes32ToString,
  bytes32ArrayToStringArray,
  bigNumberToDate,
  stringToBytes32,
} from '../../../utils/convert';

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

/**
 * @param newTreasuryWallet Address of the treasury wallet
 */
interface ChangeTreasuryWalletParams extends TxParams {
  newTreasuryWallet: string;
}

/**
 * @param numberOfTokens Number of tokens that should be deposited
 */
interface DepositTokensParams extends TxParams {
  numberOfTokens: BigNumber;
}

/**
 * @param amount Amount of tokens that should be send to the treasury wallet
 */
interface SendToTreasuryParams extends TxParams {
  amount: BigNumber;
}

/**
 * @param beneficiary Address of the beneficiary who will receive tokens
 */
interface PushAvailableTokensParams extends TxParams {
  beneficiary: string;
}

/**
 * @param name Name of the template will be created
 * @param numberOfTokens Number of tokens that should be assigned to schedule
 * @param duration Duration of the vesting schedule in seconds
 * @param frequency Frequency of the vesting schedule in seconds
 */
interface AddTemplateParams extends TxParams {
  name: string;
  numberOfTokens: BigNumber;
  duration: number;
  frequency: number;
}

/**
 * @param name Name of the template that will be removed
 */
interface RemoveTemplateParams extends TxParams {
  name: string;
}

/**
 * @param beneficiary Address of the beneficiary for whom it is scheduled
 * @param templateName Name of the template that will be created
 * @param numberOfTokens Total number of tokens for created schedule
 * @param duration Duration of the created vesting schedule
 * @param frequency Frequency of the created vesting schedule
 * @param startTime Start time of the created vesting schedule
 */
interface AddScheduleParams extends TxParams {
  beneficiary: string;
  templateName: string;
  numberOfTokens: BigNumber;
  duration: number;
  frequency: number;
  startTime: Date;
}

/**
 * @param beneficiary Address of the beneficiary for whom it is scheduled
 * @param templateName Name of the exists template
 * @param startTime Start time of the created vesting schedule
 */
interface AddScheduleFromTemplateParams extends TxParams {
  beneficiary: string;
  templateName: string;
  startTime: Date;
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

/**
 * @param beneficiary Address of the beneficiary for whom it is revoked
 * @param templateName Name of the template was used for schedule creation
 */
interface RevokeScheduleParams extends TxParams {
  beneficiary: string;
  templateName: string;
}

/**
 * @param beneficiary Address of the beneficiary for whom all schedules will be revoked
 */
interface RevokeAllSchedulesParams extends TxParams {
  beneficiary: string;
}

/**
 * @param beneficiary Address of the beneficiary who will receive tokens
 * @param templateName Name of the template was used for schedule creation
 */
interface GetScheduleParams {
  beneficiary: string;
  templateName: string;
}

/**
 * @param beneficiary Address of the beneficiary
 */
interface GetTemplateNamesParams {
  beneficiary: string;
}

/**
 * @param beneficiary Address of the beneficiary
 */
interface GetScheduleCountParams {
  beneficiary: string;
}

/**
 * @param fromIndex Start index of array of beneficiary's addresses
 * @param toIndex End index of array of beneficiary's addresses
 */
interface PushAvailableTokensMultiParams extends TxParams {
  fromIndex: number;
  toIndex: number;
}

/**
 * @param beneficiaries Array of the beneficiary's addresses
 * @param templateNames Array of the template names
 * @param numberOfTokens Array of number of tokens should be assigned to schedules
 * @param durations Array of the vesting duration
 * @param frequencies Array of the vesting frequency
 * @param startTimes Array of the vesting start time
 */
interface AddScheduleMultiParams extends TxParams {
  beneficiaries: string[];
  templateNames: string[];
  numberOfTokens: BigNumber[];
  durations: number[];
  frequencies: number[];
  startTimes: Date[];
}

/**
 * @param beneficiaries Array of beneficiary's addresses
 * @param templateNames Array of the template names were used for schedule creation
 * @param startTimes Array of the vesting start time
 */
interface AddScheduleFromTemplateMultiParams extends TxParams {
  beneficiaries: string[];
  templateNames: string[];
  startTimes: Date[];
}

/**
 * @param beneficiaries Array of the beneficiary's addresses
 */
interface RevokeSchedulesMultiParams extends TxParams {
  beneficiaries: string[];
}

/**
 * @param beneficiaries Array of the beneficiary's addresses
 * @param templateNames Array of the template names
 * @param startTimes Array of the vesting start time
 */
interface ModifyScheduleMultiParams extends TxParams {
  beneficiaries: string[];
  templateNames: string[];
  startTimes: Date[];
}

enum StateStatus {
  Created,
  Started,
  Completed,
}

interface Schedule {
  templateName: string;
  claimedTokens: number;
  startTime: Date;
}

interface BeneficiarySchedule {
  numberOfTokens: BigNumber;
  duration: number;
  frequency: number;
  startTime: Date;
  claimedTokens: number;
  state: StateStatus;
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
    const result = await (await this.contract).unassignedTokens.callAsync();
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return weiToValue(result, decimals);
  };

  public schedules = async (params: SchedulesParams) => {
    const result = await (await this.contract).schedules.callAsync(params.beneficiary, numberToBigNumber(params.index));
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const schedule: Schedule = {
      templateName: bytes32ToString(result[0]),
      claimedTokens: weiToValue(result[1], decimals).toNumber(),
      startTime: bigNumberToDate(result[2]),
    };
    return schedule;
  };

  public templateNames = async (params: TemplateNamesParams) => {
    const result = await (await this.contract).templateNames.callAsync(numberToBigNumber(params.index));
    return bytes32ToString(result);
  };

  public beneficiaries = async (params: BeneficiariesParams) => {
    return (await this.contract).beneficiaries.callAsync(numberToBigNumber(params.index));
  };

  /**
   * Used to change the treasury wallet address
   */
  public changeTreasuryWallet = async (params: ChangeTreasuryWalletParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    return (await this.contract).changeTreasuryWallet.sendTransactionAsync(
      params.newTreasuryWallet,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to deposit tokens from treasury wallet to the vesting escrow wallet
   */
  public depositTokens = async (params: DepositTokensParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');

    assert.assert(params.numberOfTokens.toNumber() > 0, 'Number of tokens should be > 0');
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const canTransferFromResult = await (await this.securityTokenContract()).canTransferFrom.callAsync(
      await this.getCallerAddress(params.txData),
      await this.address(),
      valueToWei(params.numberOfTokens, decimals),
      '0x00',
    );
    assert.assert(canTransferFromResult[0] === TransferStatusCode.TransferSuccess, 'Failed transferFrom');

    return (await this.contract).depositTokens.sendTransactionAsync(
      valueToWei(params.numberOfTokens, decimals),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Sends unassigned tokens to the treasury wallet
   */
  public sendToTreasury = async (params: SendToTreasuryParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Operator), 'Caller is not allowed');
    assert.assert(params.amount.toNumber() > 0, 'Amount cannot be zero');

    const unassignedTokens = await this.unassignedTokens();
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    assert.assert(
      params.amount.isLessThanOrEqualTo(valueToWei(unassignedTokens, decimals)),
      'Amount is greater than unassigned tokens',
    );

    const canTransferResult = await (await this.securityTokenContract()).canTransfer.callAsync(
      await this.getTreasuryWallet(),
      valueToWei(params.amount, decimals),
      '0x00',
    );
    assert.assert(canTransferResult[0] === TransferStatusCode.TransferSuccess, 'Transfer failed');

    return (await this.contract).sendToTreasury.sendTransactionAsync(
      valueToWei(params.amount, decimals),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Returns the treasury wallet address
   */
  public getTreasuryWallet = async () => {
    return (await this.contract).getTreasuryWallet.callAsync();
  };

  /**
   * Pushes available tokens to the beneficiary's address
   */
  public pushAvailableTokens = async (params: PushAvailableTokensParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Operator), 'Caller is not allowed');

    return (await this.contract).pushAvailableTokens.sendTransactionAsync(
      params.beneficiary,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to withdraw available tokens by beneficiary
   */
  public pullAvailableTokens = async (params: TxParams) => {
    assert.assert(!(await this.paused()), 'Contract currently paused');
    return (await this.contract).pullAvailableTokens.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Adds template that can be used for creating schedule
   */
  public addTemplate = async (params: AddTemplateParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.assert(params.name !== '', 'Invalid name');
    assert.assert(!(await this.getAllTemplateNames()).includes(params.name), 'Template name already exists');
    await this.validateTemplate(params.numberOfTokens, params.duration, params.frequency);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).addTemplate.sendTransactionAsync(
      stringToBytes32(params.name),
      valueToWei(params.numberOfTokens, decimals),
      numberToBigNumber(params.duration),
      numberToBigNumber(params.frequency),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Removes template with a given name
   */
  public removeTemplate = async (params: RemoveTemplateParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.assert(params.name !== '', 'Invalid name');
    assert.assert((await this.getAllTemplateNames()).includes(params.name), 'Template not found');
    // TODO 3.1: require(templateToUsers[_name].length == 0, "Template is used");
    return (await this.contract).removeTemplate.sendTransactionAsync(
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Returns the amount of templates that can be used for creating schedules
   * @return Amount of templates
   */
  public getTemplateCount = async () => {
    const result = await (await this.contract).getTemplateCount.callAsync();
    return result.toNumber();
  };

  /**
   * Gets the list of template names that can be used for creating schedules
   * @return Array of all template names
   */
  public getAllTemplateNames = async () => {
    const results = await (await this.contract).getAllTemplateNames.callAsync();
    return bytes32ArrayToStringArray(results);
  };

  /**
   * Adds a vesting schedule for the beneficiary address
   */
  public addSchedule = async (params: AddScheduleParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.assert(params.templateName !== '', 'Invalid name');
    assert.assert(!(await this.getAllTemplateNames()).includes(params.templateName), 'Template name already exists');
    await this.validateTemplate(params.numberOfTokens, params.duration, params.frequency);
    await this.validateAddSchedule(params.beneficiary, params.templateName, params.startTime);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).addSchedule.sendTransactionAsync(
      params.beneficiary,
      stringToBytes32(params.templateName),
      valueToWei(params.numberOfTokens, decimals),
      numberToBigNumber(params.duration),
      numberToBigNumber(params.frequency),
      dateToBigNumber(params.startTime),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Adds a vesting schedule for the beneficiary address from a template
   */
  public addScheduleFromTemplate = async (params: AddScheduleFromTemplateParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.validateAddScheduleFromTemplate(params.beneficiary, params.templateName, params.startTime);
    return (await this.contract).addScheduleFromTemplate.sendTransactionAsync(
      params.beneficiary,
      stringToBytes32(params.templateName),
      dateToBigNumber(params.startTime),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Modifies a vesting schedule for a beneficiary address
   */
  public modifySchedule = async (params: ModifyScheduleParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    this.checkSchedule(params.beneficiary, params.templateName);
    assert.assert(params.startTime.getTime() > Date.now(), 'Date in the past');
    // TODO: require(now < schedule.startTime, "Schedule started");
    return (await this.contract).modifySchedule.sendTransactionAsync(
      params.beneficiary,
      stringToBytes32(params.templateName),
      dateToBigNumber(params.startTime),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Revokes a vesting schedule with a given template name for a given beneficiary
   */
  public revokeSchedule = async (params: RevokeScheduleParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    this.checkSchedule(params.beneficiary, params.templateName);
    // TODO: _sendTokensPerSchedule assert
    return (await this.contract).revokeSchedule.sendTransactionAsync(
      params.beneficiary,
      stringToBytes32(params.templateName),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Revokes all vesting schedules for a given beneficiary address
   */
  public revokeAllSchedules = async (params: RevokeAllSchedulesParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.isNonZeroETHAddressHex('beneficiary', params.beneficiary);
    return (await this.contract).revokeAllSchedules.sendTransactionAsync(
      params.beneficiary,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Returns a schedule with a given template name for a given beneficiary address
   * @return beneficiary's schedule data (numberOfTokens, duration, frequency, startTime, claimedTokens, state)
   */
  public getSchedule = async (params: GetScheduleParams) => {
    this.checkSchedule(params.beneficiary, params.templateName);
    const result = await (await this.contract).getSchedule.callAsync(
      params.beneficiary,
      stringToBytes32(params.templateName),
    );

    let state: StateStatus = StateStatus.Created;
    switch (result[5].toNumber()) {
      case 0:
        state = StateStatus.Created;
        break;
      case 1:
        state = StateStatus.Completed;
        break;
      case 2:
        state = StateStatus.Started;
        break;
      default:
        break;
    }

    const decimals = await (await this.securityTokenContract()).decimals.callAsync();

    const response: BeneficiarySchedule = {
      numberOfTokens: weiToValue(result[0], decimals),
      duration: result[1].toNumber(),
      frequency: result[2].toNumber(),
      startTime: bigNumberToDate(result[3]),
      claimedTokens: result[4].toNumber(),
      state,
    };

    return response;
  };

  /**
   * Returns a list of the template names for a given beneficiary address
   * @return List of template names used for the beneficiary address' schedules
   */
  public getTemplateNames = async (params: GetTemplateNamesParams) => {
    assert.isNonZeroETHAddressHex('beneficiary', params.beneficiary);
    const result = await (await this.contract).getTemplateNames.callAsync(params.beneficiary);
    return bytes32ArrayToStringArray(result);
  };

  /**
   * Returns amount of schedules for a given beneficiary address
   * @return Amount of schedules
   */
  public getScheduleCount = async (params: GetScheduleCountParams) => {
    assert.isNonZeroETHAddressHex('beneficiary', params.beneficiary);
    const result = await (await this.contract).getScheduleCount.callAsync(params.beneficiary);
    return result.toNumber();
  };

  /**
   * Used to bulk add vesting schedules for each of the beneficiaries
   */
  public pushAvailableTokensMulti = async (params: PushAvailableTokensMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Operator), 'Caller is not allowed');
    // TODO: require(_toIndex < beneficiaries.length, "Array out of bound");
    return (await this.contract).pushAvailableTokensMulti.sendTransactionAsync(
      numberToBigNumber(params.fromIndex),
      numberToBigNumber(params.toIndex),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to bulk add vesting schedules for each of beneficiary
   */
  public addScheduleMulti = async (params: AddScheduleMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.assert(
      params.beneficiaries.length === params.templateNames.length &&
        params.beneficiaries.length === params.numberOfTokens.length &&
        params.beneficiaries.length === params.durations.length &&
        params.beneficiaries.length === params.frequencies.length &&
        params.beneficiaries.length === params.startTimes.length,
      'Arrays sizes mismatch',
    );

    const resultGetAllTemplatesNames = [];
    const resultValidateTemplate = [];
    const resultValidateAddScheduleFromTemplate = [];
    for (let i = 0; i < params.beneficiaries.length; i += 1) {
      assert.assert(params.templateNames[i] !== '', 'Invalid name');
      resultGetAllTemplatesNames.push(this.getAllTemplateNames());
      resultValidateTemplate.push(
        this.validateTemplate(params.numberOfTokens[i], params.durations[i], params.frequencies[i]),
      );
      resultValidateAddScheduleFromTemplate.push(
        this.validateAddSchedule(params.beneficiaries[i], params.templateNames[i], params.startTimes[i]),
      );
    }
    const getAllTemplatesNames = await Promise.all(resultGetAllTemplatesNames);
    getAllTemplatesNames.forEach((templateName, i) => {
      assert.assert(!templateName.includes(params.templateNames[i]), 'Template name already exists');
    });
    await Promise.all(resultValidateTemplate);
    await Promise.all(resultValidateAddScheduleFromTemplate);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).addScheduleMulti.sendTransactionAsync(
      params.beneficiaries,
      params.templateNames.map(name => {
        return stringToBytes32(name);
      }),
      params.numberOfTokens.map(tokens => {
        return valueToWei(tokens, decimals);
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

  /**
   * Used to bulk add vesting schedules from templates for each of the beneficiary addresses
   */
  public addScheduleFromTemplateMulti = async (params: AddScheduleFromTemplateMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    const resultsValidateAddScheduleFromTemplate = [];
    for (let i = 0; i < params.beneficiaries.length; i += 1) {
      resultsValidateAddScheduleFromTemplate.push(
        this.validateAddScheduleFromTemplate(params.beneficiaries[i], params.templateNames[i], params.startTimes[i]),
      );
    }
    await Promise.all(resultsValidateAddScheduleFromTemplate);
    return (await this.contract).addScheduleFromTemplateMulti.sendTransactionAsync(
      params.beneficiaries,
      params.templateNames.map(name => {
        return stringToBytes32(name);
      }),
      params.startTimes.map(startTime => {
        return dateToBigNumber(startTime);
      }),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to bulk revoke vesting schedules for each of the beneficiaries
   */
  public revokeSchedulesMulti = async (params: RevokeSchedulesMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    params.beneficiaries.forEach(beneficiary => {
      assert.isNonZeroETHAddressHex('beneficiary', beneficiary);
    });
    return (await this.contract).revokeSchedulesMulti.sendTransactionAsync(
      params.beneficiaries,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to bulk modify vesting schedules for each of the beneficiaries
   */
  public modifyScheduleMulti = async (params: ModifyScheduleMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.assert(
      params.beneficiaries.length === params.templateNames.length &&
        params.beneficiaries.length === params.startTimes.length,
      'Arrays sizes mismatch',
    );

    for (let i = 0; i < params.beneficiaries.length; i += 1) {
      this.checkSchedule(params.beneficiaries[i], params.templateNames[i]);
      assert.assert(params.startTimes[i].getTime() > Date.now(), 'Date in the past');
    }

    return (await this.contract).modifyScheduleMulti.sendTransactionAsync(
      params.beneficiaries,
      params.templateNames.map(name => {
        return stringToBytes32(name);
      }),
      params.startTimes.map(startTime => {
        return dateToBigNumber(startTime);
      }),
      params.txData,
      params.safetyFactor,
    );
  };

  private validateTemplate = async (numberOfTokens: BigNumber, duration: number, frequency: number) => {
    assert.assert(numberOfTokens.toNumber() > 0, 'Zero amount');
    assert.assert(duration % frequency === 0, 'Invalid frequency');
    const periodCount = duration / frequency;
    assert.assert(numberOfTokens.toNumber() % periodCount === 0, 'Invalid period count');
    const amountPerPeriod = numberOfTokens.toNumber() / periodCount;
    const granularity = await (await this.securityTokenContract()).granularity.callAsync();
    assert.assert(amountPerPeriod % granularity.toNumber() === 0, 'Invalid granularity');
  };

  private validateAddSchedule = async (beneficiary: string, templateName: string, startTime: Date) => {
    assert.isNonZeroETHAddressHex('beneficiary', beneficiary);
    assert.assert((await this.getScheduleCount({ beneficiary })) === 0, 'Already added');
    assert.assert(startTime.getTime() > Date.now(), 'Date in the past');
  };

  private validateAddScheduleFromTemplate = async (beneficiary: string, templateName: string, startTime: Date) => {
    assert.isNonZeroETHAddressHex('beneficiary', beneficiary);
    assert.assert((await this.getAllTemplateNames()).includes(templateName), 'Template not found');
    assert.assert((await this.getScheduleCount({ beneficiary })) === 0, 'Already added');
    assert.assert(startTime.getTime() > Date.now(), 'Date in the past');
  };

  private checkSchedule = (beneficiary: string, templateName: string) => {
    assert.isNonZeroETHAddressHex('beneficiary', beneficiary);
    // TODO: userToTemplateIndex[_beneficiary][_templateName]
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
