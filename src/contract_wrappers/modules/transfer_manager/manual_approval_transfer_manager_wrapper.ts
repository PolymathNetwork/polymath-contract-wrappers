import {
  ManualApprovalTransferManagerContract,
  ManualApprovalTransferManagerEventArgs,
  ManualApprovalTransferManagerEvents,
  ManualApprovalTransferManagerAddManualApprovalEventArgs,
  ManualApprovalTransferManagerModifyManualApprovalEventArgs,
  ManualApprovalTransferManagerRevokeManualApprovalEventArgs,
  ManualApprovalTransferManagerPauseEventArgs,
  ManualApprovalTransferManagerUnpauseEventArgs,
  Web3Wrapper,
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
} from '../../../types';
import {
  bigNumberToDate,
  bytes32ToString,
  dateArrayToBigNumberArray,
  dateToBigNumber,
  numberToBigNumber,
  stringArrayToBytes32Array,
  stringToBytes32,
  valueToWei,
  valueArrayToWeiArray,
  weiToValue,
  parseTransferResult,
} from '../../../utils/convert';

interface AddManualApprovalSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.AddManualApproval;
  callback: EventCallback<ManualApprovalTransferManagerAddManualApprovalEventArgs>;
}

interface GetAddManualApprovalLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.AddManualApproval;
}

interface ModifyManualApprovalSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.ModifyManualApproval;
  callback: EventCallback<ManualApprovalTransferManagerModifyManualApprovalEventArgs>;
}

interface GetModifyManualApprovalLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.ModifyManualApproval;
}

interface RevokeManualApprovalSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.RevokeManualApproval;
  callback: EventCallback<ManualApprovalTransferManagerRevokeManualApprovalEventArgs>;
}

interface GetRevokeManualApprovalLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.RevokeManualApproval;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.Pause;
  callback: EventCallback<ManualApprovalTransferManagerPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.Unpause;
  callback: EventCallback<ManualApprovalTransferManagerUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.Unpause;
}

interface ManualApprovalTransferManagerSubscribeAsyncParams extends Subscribe {
  (params: AddManualApprovalSubscribeAsyncParams): Promise<string>;
  (params: ModifyManualApprovalSubscribeAsyncParams): Promise<string>;
  (params: RevokeManualApprovalSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetManualApprovalTransferManagerLogsAsyncParams extends GetLogs {
  (params: GetAddManualApprovalLogsAsyncParams): Promise<
    LogWithDecodedArgs<ManualApprovalTransferManagerAddManualApprovalEventArgs>[]
  >;
  (params: GetModifyManualApprovalLogsAsyncParams): Promise<
    LogWithDecodedArgs<ManualApprovalTransferManagerModifyManualApprovalEventArgs>[]
  >;
  (params: GetRevokeManualApprovalLogsAsyncParams): Promise<
    LogWithDecodedArgs<ManualApprovalTransferManagerRevokeManualApprovalEventArgs>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<ManualApprovalTransferManagerPauseEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<ManualApprovalTransferManagerUnpauseEventArgs>[]>;
}

export namespace ManualApprovalTransferManagerTransactionParams {
  export interface AddManualApproval extends AddManualApprovalParams {}
  export interface AddManualApprovalMulti extends AddManualApprovalMultiParams {}
  export interface ModifyManualApproval extends ModifyManualApprovalParams {}
  export interface ModifyManualApprovalMulti extends ModifyManualApprovalMultiParams {}
  export interface RevokeManualApproval extends RevokeManualApprovalParams {}
  export interface RevokeManualApprovalMulti extends RevokeManualApprovalMultiParams {}
}

/**
 * @param index
 */
interface ApprovalsParams {
  index: number;
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
 * @param from is the address from which transfers are approved
 * @param to is the address to which transfers are approved
 * @param allowance is the approved amount of tokens
 * @param expiryTime is the time until which the transfer is allowed
 * @param description Description about the manual approval
 */
interface AddManualApprovalParams extends TxParams {
  from: string;
  to: string;
  allowance: BigNumber;
  expiryTime: Date;
  description: string;
}

/**
 * @param from is the address array from which transfers are approved
 * @param to is the address array to which transfers are approved
 * @param allowances is the array of approved amounts
 * @param expiryTimes is the array of the times until which eath transfer is allowed
 * @param descriptions is the description array for these manual approvals
 */
interface AddManualApprovalMultiParams extends TxParams {
  from: string[];
  to: string[];
  allowances: BigNumber[];
  expiryTimes: Date[];
  descriptions: string[];
}

/**
 * @param from is the address from which transfers are approved
 * @param to is the address to which transfers are approved
 * @param expiryTime is the time until which the transfer is allowed
 * @param changeInAllowance is the change in allowance
 * @param description Description about the manual approval
 * @param increase tells whether the allowances will be increased (true) or decreased (false).
 * or any value when there is no change in allowances
 */
interface ModifyManualApprovalParams extends TxParams {
  from: string;
  to: string;
  expiryTime: Date;
  changeInAllowance: BigNumber;
  description: string;
  increase: boolean;
}

/**
 * @param from is the address array from which transfers are approved
 * @param to is the address array to which transfers are approved
 * @param expiryTimes is the array of the times until which each transfer is allowed
 * @param changeInAllowance is the array of change in allowances
 * @param descriptions is the description array for these manual approvals
 * @param increase Array of bools that tells whether the allowances will be increased (true) or decreased (false).
 * or any value when there is no change in allowances
 */
interface ModifyManualApprovalMultiParams extends TxParams {
  from: string[];
  to: string[];
  expiryTimes: Date[];
  changedAllowances: BigNumber[];
  descriptions: string[];
  increase: boolean[];
}

/**
 * @param from is the address from which transfers are approved
 * @param to is the address to which transfers are approved
 */
interface RevokeManualApprovalParams extends TxParams {
  from: string;
  to: string;
}

/**
 * @param from is the address array from which transfers are approved
 * @param to is the address array to which transfers are approved
 */
interface RevokeManualApprovalMultiParams extends TxParams {
  from: string[];
  to: string[];
}

/**
 * @param user Address of the holder corresponds to whom list of manual approvals
 * need to return
 */
interface GetActiveApprovalsToUserParams {
  user: string;
}

/**
 * @param from Address of the sender
 * @param to Address of the receiver
 */
interface GetApprovalDetailsParams {
  from: string;
  to: string;
}

// // Return types ////
interface Approval {
  /**  */
  from: string;
  /**  */
  to: string;
  /**  */
  allowance: BigNumber;
  /**  */
  expiryTime: Date;
  /**  */
  description: string;
}
// // End of return types ////

/**
 * This class includes the functionality related to interacting with the ManualApproval Transfer Manager contract.
 */
export default class ManualApprovalTransferManagerWrapper extends ModuleWrapper {
  protected contract: Promise<ManualApprovalTransferManagerContract>;

  /**
   * Instantiate ManualApprovalTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<ManualApprovalTransferManagerContract>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   *  unpause the module
   */
  public unpause = async (params: TxParams) => {
    assert.assert(await this.paused(), 'Controller not currently paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'Sender is not owner');
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   *  check if the module is paused
   */
  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  /**
   *  pause the module
   */
  public pause = async (params: TxParams) => {
    assert.assert(!(await this.paused()), 'Controller currently paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'Sender is not owner');
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   *  An array to track all approvals. It is an unbounded array but it's not a problem as
   * it is never looped through in an on chain call. It is defined as an Array instead of mapping
   * just to make it easier for users to fetch list of all approvals through constant functions.
   */
  public approvals = async (params: ApprovalsParams) => {
    const result = await (await this.contract).approvals.callAsync(numberToBigNumber(params.index));
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const typedResult: Approval = {
      from: result[0],
      to: result[1],
      allowance: valueToWei(result[2], decimals),
      expiryTime: bigNumberToDate(result[3]),
      description: result[4],
    };
    return typedResult;
  };

  /**
   * This function returns the signature of configure function
   */
  public getInitFunction = async (): Promise<string> => {
    return (await this.contract).getInitFunction.callAsync();
  };

  /**
   * Used to verify the transfer transaction (View)
   *  @return boolean transfer result
   *  @return address
   */
  public verifyTransfer = async (params: VerifyTransferParams) => {
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
   * Adds a pair of addresses to manual approvals
   */
  public addManualApproval = async (params: AddManualApprovalParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.isETHAddressHex('from', params.from);
    assert.isNonZeroETHAddressHex('to', params.to);
    assert.isFutureDate(params.expiryTime, 'ExpiryTime must be in the future');
    assert.isBigNumberGreaterThanZero(params.allowance, 'Allowance must be greater than 0');
    await this.checkApprovalDoesNotExist(params.from, params.to);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).addManualApproval.sendTransactionAsync(
      params.from,
      params.to,
      valueToWei(params.allowance, decimals),
      dateToBigNumber(params.expiryTime),
      stringToBytes32(params.description),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Adds multiple manual approvals in batch
   */
  public addManualApprovalMulti = async (params: AddManualApprovalMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    params.from.forEach(address => assert.isETHAddressHex('from', address));
    params.to.forEach(address => assert.isNonZeroETHAddressHex('to', address));
    assert.assert(
      params.from.length === params.to.length &&
        params.from.length === params.allowances.length &&
        params.from.length === params.expiryTimes.length &&
        params.from.length === params.descriptions.length,
      'Array lengths missmatch',
    );
    params.expiryTimes.forEach(expiry => assert.isFutureDate(expiry, 'ExpiryTime must be in the future'));
    params.allowances.forEach(allowance =>
      assert.isBigNumberGreaterThanZero(allowance, 'Allowance must be greater than 0'),
    );
    const approvals = [];
    for (let i = 0; i < params.to.length; i += 1) {
      approvals.push(this.checkApprovalDoesNotExist(params.from[i], params.to[i]));
    }
    await Promise.all(approvals);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).addManualApprovalMulti.sendTransactionAsync(
      params.from,
      params.to,
      valueArrayToWeiArray(params.allowances, decimals),
      dateArrayToBigNumberArray(params.expiryTimes),
      stringArrayToBytes32Array(params.descriptions),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Modify the existing manual approvals
   */
  public modifyManualApproval = async (params: ModifyManualApprovalParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.isETHAddressHex('from', params.from);
    assert.isNonZeroETHAddressHex('to', params.to);
    assert.isFutureDate(params.expiryTime, 'ExpiryTime must be in the future');
    await this.checkApprovalDoesExist(params.from, params.to);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).modifyManualApproval.sendTransactionAsync(
      params.from,
      params.to,
      dateToBigNumber(params.expiryTime),
      valueToWei(params.changeInAllowance, decimals),
      stringToBytes32(params.description),
      params.increase,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Adds multiple manual approvals in batch
   */
  public modifyManualApprovalMulti = async (params: ModifyManualApprovalMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    params.from.forEach(address => assert.isETHAddressHex('from', address));
    params.to.forEach(address => assert.isNonZeroETHAddressHex('to', address));
    assert.assert(
      params.from.length === params.to.length &&
        params.from.length === params.changedAllowances.length &&
        params.from.length === params.expiryTimes.length &&
        params.from.length === params.descriptions.length,
      'Array lengths missmatch',
    );
    params.expiryTimes.forEach(expiry => assert.isFutureDate(expiry, 'ExpiryTime must be in the future'));
    const approvals = [];
    for (let i = 0; i < params.to.length; i += 1) {
      approvals.push(this.checkApprovalDoesExist(params.from[i], params.to[i]));
    }
    await Promise.all(approvals);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).modifyManualApprovalMulti.sendTransactionAsync(
      params.from,
      params.to,
      dateArrayToBigNumberArray(params.expiryTimes),
      valueArrayToWeiArray(params.changedAllowances, decimals),
      stringArrayToBytes32Array(params.descriptions),
      params.increase,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Removes pairs of addresses from manual approvals
   */
  public revokeManualApproval = async (params: RevokeManualApprovalParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    await this.checkApprovalDoesExist(params.from, params.to);
    return (await this.contract).revokeManualApproval.sendTransactionAsync(
      params.from,
      params.to,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Removes multiple pairs of addresses from manual approvals
   */
  public revokeManualApprovalMulti = async (params: RevokeManualApprovalMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    params.from.forEach(address => assert.isETHAddressHex('from', address));
    params.to.forEach(address => assert.isETHAddressHex('to', address));
    assert.assert(params.to.length === params.from.length, 'To and From address arrays must have the same length');
    const approvals = [];
    for (let i = 0; i < params.to.length; i += 1) {
      approvals.push(this.checkApprovalDoesExist(params.from[i], params.to[i]));
    }
    await Promise.all(approvals);
    return (await this.contract).revokeManualApprovalMulti.sendTransactionAsync(
      params.from,
      params.to,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Returns the all active approvals corresponds to an address
   * @return addresses from
   * @return addresses to
   * @return allowances provided to the approvals
   * @return expiry times provided to the approvals
   * @return descriptions provided to the approvals
   */
  public getActiveApprovalsToUser = async (params: GetActiveApprovalsToUserParams): Promise<Approval[]> => {
    assert.isETHAddressHex('user', params.user);
    const result = await (await this.contract).getActiveApprovalsToUser.callAsync(params.user);
    const typedResult: Approval[] = [];
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    for (let i = 0; i < result[0].length; i += 1) {
      const approval: Approval = {
        from: result[0][i],
        to: result[1][i],
        allowance: weiToValue(result[2][i], decimals),
        expiryTime: bigNumberToDate(result[3][i]),
        description: bytes32ToString(result[4][i]),
      };
      typedResult.push(approval);
    }
    return typedResult;
  };

  /**
   * Get the details of the approval corresponds to from & to addresses
   * @return expiryTime of the approval
   * @return allowance provided to the approval
   * @return Description provided to the approval
   */
  public getApprovalDetails = async (params: GetApprovalDetailsParams): Promise<Approval> => {
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    const result = await (await this.contract).getApprovalDetails.callAsync(params.from, params.to);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const typedResult: Approval = {
      from: params.from,
      to: params.to,
      allowance: weiToValue(result[0], decimals),
      expiryTime: bigNumberToDate(result[1]),
      description: bytes32ToString(result[2]),
    };
    return typedResult;
  };

  /**
   * Returns the current number of active approvals
   */
  public getTotalApprovalsLength = async (): Promise<number> => {
    return (await (await this.contract).getTotalApprovalsLength.callAsync()).toNumber();
  };

  /**
   * Get the details of all approvals
   * @return addresses from
   * @return addresses to
   * @return allowances provided to the approvals
   * @return expiry times provided to the approvals
   * @return descriptions provided to the approvals
   */
  public getAllApprovals = async (): Promise<Approval[]> => {
    const result = await (await this.contract).getAllApprovals.callAsync();
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const typedResult: Approval[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      const approval: Approval = {
        from: result[0][i],
        to: result[1][i],
        allowance: weiToValue(result[2][i], decimals),
        expiryTime: bigNumberToDate(result[3][i]),
        description: bytes32ToString(result[4][i]),
      };
      typedResult.push(approval);
    }
    return typedResult;
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: ManualApprovalTransferManagerSubscribeAsyncParams = async <
    ArgsType extends ManualApprovalTransferManagerEventArgs
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ManualApprovalTransferManagerEvents);
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
  public getLogsAsync: GetManualApprovalTransferManagerLogsAsyncParams = async <
    ArgsType extends ManualApprovalTransferManagerEventArgs
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ManualApprovalTransferManagerEvents);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
    );
    return logs;
  };

  private checkApprovalDoesNotExist = async (from: string, to: string) => {
    const approval = await this.getApprovalDetails({ from, to });
    assert.isBigNumberZero(approval.allowance, 'Approval already exists with allowance');
    assert.isPastDate(approval.expiryTime, 'Approval already exists with valid future expiry date');
  };

  private checkApprovalDoesExist = async (from: string, to: string) => {
    const approval = await this.getApprovalDetails({ from, to });
    assert.isBigNumberGreaterThanZero(approval.allowance, 'Approval does not exist');
    assert.isFutureDate(approval.expiryTime, 'Approval does not exist');
  };
}
