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

interface ApprovalsParams {
  index: number;
}

interface VerifyTransferParams {
  from: string;
  to: string;
  amount: BigNumber;
  data: string;
}

interface AddManualApprovalParams extends TxParams {
  from: string;
  to: string;
  allowance: BigNumber;
  expiryTime: Date;
  description: string;
}

interface AddManualApprovalMultiParams extends TxParams {
  from: string[];
  to: string[];
  allowances: BigNumber[];
  expiryTimes: Date[];
  descriptions: string[];
}

interface ModifyManualApprovalParams extends TxParams {
  from: string;
  to: string;
  expiryTime: Date;
  changeInAllowance: BigNumber;
  description: string;
  increase: boolean;
}

interface ModifyManualApprovalMultiParams extends TxParams {
  from: string[];
  to: string[];
  expiryTimes: Date[];
  changedAllowances: BigNumber[];
  descriptions: string[];
  increase: boolean[];
}

interface RevokeManualApprovalParams extends TxParams {
  from: string;
  to: string;
}

interface RevokeManualApprovalMultiParams extends TxParams {
  from: string[];
  to: string[];
}

interface GetActiveApprovalsToUserParams {
  user: string;
}

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

  public getInitFunction = async () => {
    return (await this.contract).getInitFunction.callAsync();
  };

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

  public getActiveApprovalsToUser = async (params: GetActiveApprovalsToUserParams) => {
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

  public getApprovalDetails = async (params: GetApprovalDetailsParams) => {
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

  public getTotalApprovalsLength = async () => {
    return (await this.contract).getTotalApprovalsLength.callAsync();
  };

  public getAllApprovals = async () => {
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
