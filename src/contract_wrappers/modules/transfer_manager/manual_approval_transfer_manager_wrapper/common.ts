import {
  ManualApprovalTransferManagerContract_3_0_0,
  ManualApprovalTransferManagerEventArgs_3_0_0,
  ManualApprovalTransferManagerEvents_3_0_0,
  ManualApprovalTransferManagerAddManualApprovalEventArgs_3_0_0,
  ManualApprovalTransferManagerModifyManualApprovalEventArgs_3_0_0,
  ManualApprovalTransferManagerRevokeManualApprovalEventArgs_3_0_0,
  ManualApprovalTransferManagerPauseEventArgs_3_0_0,
  ManualApprovalTransferManagerUnpauseEventArgs_3_0_0,
  Web3Wrapper,
  LogWithDecodedArgs,
  BigNumber,
  PolyResponse,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../../utils/assert';
import ModuleWrapper from '../../module_wrapper';
import Contract_3_0_0Factory from '../../../../factories/contractFactory';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Subscribe,
  GetLogs,
  Perm,
  ErrorCode,
  TransferResult,
} from '../../../../types';
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
} from '../../../../utils/convert';

interface AddManualApprovalSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ManualApprovalTransferManagerEvents_3_0_0.AddManualApproval;
  callback: EventCallback<ManualApprovalTransferManagerAddManualApprovalEventArgs_3_0_0>;
}

interface GetAddManualApprovalLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ManualApprovalTransferManagerEvents_3_0_0.AddManualApproval;
}

interface ModifyManualApprovalSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ManualApprovalTransferManagerEvents_3_0_0.ModifyManualApproval;
  callback: EventCallback<ManualApprovalTransferManagerModifyManualApprovalEventArgs_3_0_0>;
}

interface GetModifyManualApprovalLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ManualApprovalTransferManagerEvents_3_0_0.ModifyManualApproval;
}

interface RevokeManualApprovalSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ManualApprovalTransferManagerEvents_3_0_0.RevokeManualApproval;
  callback: EventCallback<ManualApprovalTransferManagerRevokeManualApprovalEventArgs_3_0_0>;
}

interface GetRevokeManualApprovalLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ManualApprovalTransferManagerEvents_3_0_0.RevokeManualApproval;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ManualApprovalTransferManagerEvents_3_0_0.Pause;
  callback: EventCallback<ManualApprovalTransferManagerPauseEventArgs_3_0_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ManualApprovalTransferManagerEvents_3_0_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ManualApprovalTransferManagerEvents_3_0_0.Unpause;
  callback: EventCallback<ManualApprovalTransferManagerUnpauseEventArgs_3_0_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ManualApprovalTransferManagerEvents_3_0_0.Unpause;
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
    LogWithDecodedArgs<ManualApprovalTransferManagerAddManualApprovalEventArgs_3_0_0>[]
  >;
  (params: GetModifyManualApprovalLogsAsyncParams): Promise<
    LogWithDecodedArgs<ManualApprovalTransferManagerModifyManualApprovalEventArgs_3_0_0>[]
  >;
  (params: GetRevokeManualApprovalLogsAsyncParams): Promise<
    LogWithDecodedArgs<ManualApprovalTransferManagerRevokeManualApprovalEventArgs_3_0_0>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<ManualApprovalTransferManagerPauseEventArgs_3_0_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<
    LogWithDecodedArgs<ManualApprovalTransferManagerUnpauseEventArgs_3_0_0>[]
  >;
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

/**
 * @param transferResult
 * @param address
 */
interface VerifyTransfer {
  transferResult: TransferResult;
  address: string;
}
// // End of return types ////

/**
 * This class includes the functionality related to interacting with the ManualApproval Transfer Manager contract.
 */
export default class ManualApprovalTransferManagerCommon extends ModuleWrapper {
  public contract: Promise<ManualApprovalTransferManagerContract_3_0_0>;

  /**
   * Instantiate ManualApprovalTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<ManualApprovalTransferManagerContract_3_0_0>,
    contractFactory: Contract_3_0_0Factory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   *  Unpause the module
   */
  public unpause = async (params: TxParams): Promise<PolyResponse> => {
    assert.assert(await this.paused(), ErrorCode.PreconditionRequired, 'Controller not currently paused');
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'Sender is not owner',
    );
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   *  Check if the module is paused
   */
  public paused = async (): Promise<boolean> => {
    return (await this.contract).paused.callAsync();
  };

  /**
   *  Pause the module
   */
  public pause = async (params: TxParams): Promise<PolyResponse> => {
    assert.assert(!(await this.paused()), ErrorCode.ContractPaused, 'Controller currently paused');
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'Sender is not owner',
    );
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   *  An array to track all approvals. It is an unbounded array but it's not a problem as
   * it is never looped through in an on chain call. It is defined as an Array instead of mapping
   * just to make it easier for users to fetch list of all approvals through constant functions.
   */
  public approvals = async (params: ApprovalsParams): Promise<Approval> => {
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
   * Used to verify the transfer transaction (View)
   *  @return boolean transfer result, address
   */
  public verifyTransfer = async (params: VerifyTransferParams): Promise<VerifyTransfer> => {
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
  public addManualApproval = async (params: AddManualApprovalParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
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
  public addManualApprovalMulti = async (params: AddManualApprovalMultiParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    params.from.forEach(address => assert.isETHAddressHex('from', address));
    params.to.forEach(address => assert.isNonZeroETHAddressHex('to', address));
    assert.assert(
      params.from.length === params.to.length &&
        params.from.length === params.allowances.length &&
        params.from.length === params.expiryTimes.length &&
        params.from.length === params.descriptions.length,
      ErrorCode.MismatchedArrayLength,
      'Array lengths mismatch',
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
  public modifyManualApproval = async (params: ModifyManualApprovalParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
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
  public modifyManualApprovalMulti = async (params: ModifyManualApprovalMultiParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    params.from.forEach(address => assert.isETHAddressHex('from', address));
    params.to.forEach(address => assert.isNonZeroETHAddressHex('to', address));
    assert.assert(
      params.from.length === params.to.length &&
        params.from.length === params.changedAllowances.length &&
        params.from.length === params.expiryTimes.length &&
        params.from.length === params.descriptions.length,
      ErrorCode.MismatchedArrayLength,
      'Array lengths mismatch',
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
  public revokeManualApproval = async (params: RevokeManualApprovalParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
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
  public revokeManualApprovalMulti = async (params: RevokeManualApprovalMultiParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    params.from.forEach(address => assert.isETHAddressHex('from', address));
    params.to.forEach(address => assert.isETHAddressHex('to', address));
    assert.assert(
      params.to.length === params.from.length,
      ErrorCode.MismatchedArrayLength,
      'To and From address arrays must have the same length',
    );
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
   * @return addresses from, addresses to, allowances provided to the approvals, expiry times provided to the
   * approvals, descriptions provided to the approvals
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
   * @return expiryTime of the approval, allowance provided to the approval, Description provided to the approval
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
   * @return addresses from, addresses to, allowances provided to the approvals, expiry times provided to the
   * approvals, descriptions provided to the approvals
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
    ArgsType extends ManualApprovalTransferManagerEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ManualApprovalTransferManagerEvents_3_0_0);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContract_3_0_0Address = (await this.contract).address.toLowerCase();
    const subscriptionToken = await this.subscribeInternal<ArgsType>(
      normalizedContract_3_0_0Address,
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
    ArgsType extends ManualApprovalTransferManagerEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ManualApprovalTransferManagerEvents_3_0_0);
    const normalizedContract_3_0_0Address = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContract_3_0_0Address,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
    );
    return logs;
  };

  public checkApprovalDoesNotExist = async (from: string, to: string) => {
    const approval = await this.getApprovalDetails({ from, to });
    assert.isBigNumberZero(approval.allowance, 'Approval already exists with allowance');
    assert.isPastDate(approval.expiryTime, 'Approval already exists with valid future expiry date');
  };

  public checkApprovalDoesExist = async (from: string, to: string) => {
    const approval = await this.getApprovalDetails({ from, to });
    assert.isBigNumberGreaterThanZero(approval.allowance, 'Approval does not exist');
    assert.isFutureDate(approval.expiryTime, 'Approval does not exist');
  };
}
