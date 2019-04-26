import {
  ManualApprovalTransferManagerContract,
  ManualApprovalTransferManagerEventArgs,
  ManualApprovalTransferManagerEvents,
  ManualApprovalTransferManagerAddManualApprovalEventArgs,
  ManualApprovalTransferManagerModifyManualApprovalEventArgs,
  ManualApprovalTransferManagerRevokeManualApprovalEventArgs,
  ManualApprovalTransferManagerPauseEventArgs,
  ManualApprovalTransferManagerUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { ManualApprovalTransferManager } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import { schemas } from '@0x/json-schemas';
import { TxParams, GetLogsAsyncParams, SubscribeAsyncParams, EventCallback, Subscribe, GetLogs } from '../../../types';
import assert from '../../../utils/assert';
import ModuleWrapper from '../module_wrapper';
import {
  bigNumberToDate,
  bytes32ToString,
  dateArrayToBigNumberArray,
  dateToBigNumber,
  numberToBigNumber,
  stringArrayToBytes32Array,
  stringToBytes32,
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

interface VerifyTransferParams extends TxParams {
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
  public abi: ContractAbi = ManualApprovalTransferManager.abi;

  protected contract: Promise<ManualApprovalTransferManagerContract>;

  /**
   * Instantiate ManualApprovalTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<ManualApprovalTransferManagerContract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  public unpause = async (params: TxParams) => {
    await this.checkIsPaused();
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  public approvals = async (params: ApprovalsParams) => {
    const result = await (await this.contract).approvals.callAsync(numberToBigNumber(params.index));
    const typedResult: Approval = {
      from: result[0],
      to: result[1],
      allowance: result[2],
      expiryTime: bigNumberToDate(result[3]),
      description: result[4],
    };
    return typedResult;
  };

  public pause = async (params: TxParams) => {
    await this.checkIsNotPaused();
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public getInitFunction = async () => {
    return (await this.contract).getInitFunction.callAsync();
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

  public addManualApproval = async (params: AddManualApprovalParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm TRANSFER_APPROVAL) Requires ISecurityToken and Ownable
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    assert.checkAddManualApprovalConditions(params.to, params.expiryTime, params.allowance);
    await this.checkApprovalDoesNotExist(params.from, params.to);
    return (await this.contract).addManualApproval.sendTransactionAsync(
      params.from,
      params.to,
      params.allowance,
      dateToBigNumber(params.expiryTime),
      stringToBytes32(params.description),
      params.txData,
      params.safetyFactor,
    );
  };

  public addManualApprovalMulti = async (params: AddManualApprovalMultiParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm TRANSFER_APPROVAL) Requires ISecurityToken and Ownable
    assert.isETHAddressHexArray('from', params.from);
    assert.isETHAddressHexArray('to', params.to);
    assert.checkAddManualApprovalMultiConditions(
      params.from,
      params.to,
      params.allowances,
      params.expiryTimes,
      params.descriptions,
    );
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < params.to.length; i + 1) {
      await this.checkApprovalDoesNotExist(params.from[i], params.to[i]);
    }
    /* eslint-enable no-await-in-loop */
    return (await this.contract).addManualApprovalMulti.sendTransactionAsync(
      params.from,
      params.to,
      params.allowances,
      dateArrayToBigNumberArray(params.expiryTimes),
      stringArrayToBytes32Array(params.descriptions),
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyManualApproval = async (params: ModifyManualApprovalParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm TRANSFER_APPROVAL) Requires ISecurityToken and Ownable
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    assert.checkModifyManualApprovalConditions(params.to, params.expiryTime);
    await this.checkApprovalDoesExist(params.from, params.to);
    return (await this.contract).modifyManualApproval.sendTransactionAsync(
      params.from,
      params.to,
      dateToBigNumber(params.expiryTime),
      params.changeInAllowance,
      stringToBytes32(params.description),
      params.increase,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyManualApprovalMulti = async (params: ModifyManualApprovalMultiParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm TRANSFER_APPROVAL) Requires ISecurityToken and Ownable
    assert.isETHAddressHexArray('from', params.from);
    assert.isETHAddressHexArray('to', params.to);
    assert.checkModifyManualApprovalMultiConditions(
      params.from,
      params.to,
      params.changedAllowances,
      params.expiryTimes,
      params.descriptions,
    );
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < params.to.length; i + 1) {
      await this.checkApprovalDoesExist(params.from[i], params.to[i]);
    }
    /* eslint-enable no-await-in-loop */
    return (await this.contract).modifyManualApprovalMulti.sendTransactionAsync(
      params.from,
      params.to,
      dateArrayToBigNumberArray(params.expiryTimes),
      params.changedAllowances,
      stringArrayToBytes32Array(params.descriptions),
      params.increase,
      params.txData,
      params.safetyFactor,
    );
  };

  public revokeManualApproval = async (params: RevokeManualApprovalParams) => {
    // TODO Check that the msg.sender has appropriate permisssions (With Perm TRANSFER_APPROVAL) Requires ISecurityToken and Ownable
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
    // TODO Check that the msg.sender has appropriate permisssions (With Perm TRANSFER_APPROVAL) Requires ISecurityToken and Ownable
    assert.isETHAddressHexArray('from', params.from);
    assert.isETHAddressHexArray('to', params.to);
    assert.assert(params.to.length === params.from.length, 'To and From address arrays must have the same length');
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < params.to.length; i + 1) {
      await this.checkApprovalDoesExist(params.from[i], params.to[i]);
    }
    /* eslint-enable no-await-in-loop */
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
    for (let i = 0; i < result[0].length; i += 1) {
      const approval: Approval = {
        from: result[0][i],
        to: result[1][i],
        allowance: result[2][i],
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
    const typedResult: Approval = {
      from: params.from,
      to: params.to,
      allowance: result[0],
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
    const typedResult: Approval[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      const approval: Approval = {
        from: result[0][i],
        to: result[1][i],
        allowance: result[2][i],
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
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      ManualApprovalTransferManager.abi,
      params.callback,
      !_.isUndefined(params.isVerbose),
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
      ManualApprovalTransferManager.abi,
    );
    return logs;
  };

  private checkIsNotPaused = async () => {
    assert.assert(!(await this.paused()), 'Controller currently paused');
  };

  private checkIsPaused = async () => {
    assert.assert(await this.paused(), 'Controller not currently paused');
  };

  // TODO Extra Review- Verify necessity for following CheckApprovalDoes(Not)Exist Functions

  private checkApprovalDoesNotExist = async (from: string, to: string) => {
    const approval = await this.getApprovalDetails({ from, to });
    const hasAllowance = approval.allowance.isGreaterThan(new BigNumber(0));
    const hasValidFutureExpiry = approval.expiryTime >= new Date();
    assert.assert(
      !hasAllowance || !hasValidFutureExpiry,
      'Approval already exists with allowance and/or valid future expiry date',
    );
  };

  private checkApprovalDoesExist = async (from: string, to: string) => {
    const approval = await this.getApprovalDetails({ from, to });
    const hasAllowance = approval.allowance.isGreaterThan(new BigNumber(0));
    const hasValidFutureExpiry = approval.expiryTime >= new Date();
    assert.assert(
      hasAllowance && hasValidFutureExpiry,
      'Approval does not exist with valid allowance and valid future expiry date',
    );
  };
}
