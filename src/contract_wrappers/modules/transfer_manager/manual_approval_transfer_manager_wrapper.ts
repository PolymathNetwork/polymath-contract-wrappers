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
import {
    TxParams,
    IGetLogsAsyncParams,
    ISubscribeAsyncParams,
    EventCallback,
    ISubscribe,
    IGetLogs
} from '../../../types';
import { assert } from '../../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { ModuleWrapper } from '../module_wrapper';
import {
  bigNumberToDate, bytes32ToString,
  dateArrayToBigNumberArray,
  dateToBigNumber,
  numberToBigNumber, stringArrayToBytes32Array,
  stringToBytes32
} from '../../../utils/convert';

interface IAddManualApprovalSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.AddManualApproval,
  callback: EventCallback<ManualApprovalTransferManagerAddManualApprovalEventArgs>,
}

interface IGetAddManualApprovalLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.AddManualApproval,
}

interface IModifyManualApprovalSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.ModifyManualApproval,
  callback: EventCallback<ManualApprovalTransferManagerModifyManualApprovalEventArgs>,
}

interface IGetModifyManualApprovalLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.ModifyManualApproval,
}

interface IRevokeManualApprovalSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.RevokeManualApproval,
  callback: EventCallback<ManualApprovalTransferManagerRevokeManualApprovalEventArgs>,
}

interface IGetRevokeManualApprovalLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.RevokeManualApproval,
}

interface IPauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.Pause,
  callback: EventCallback<ManualApprovalTransferManagerPauseEventArgs>,
}

interface IGetPauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.Pause,
}

interface IUnpauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.Unpause,
  callback: EventCallback<ManualApprovalTransferManagerUnpauseEventArgs>,
}

interface IGetUnpauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ManualApprovalTransferManagerEvents.Unpause,
}

interface IManualApprovalTransferManagerSubscribeAsyncParams extends ISubscribe {
  (params: IAddManualApprovalSubscribeAsyncParams): Promise<string>,
  (params: IModifyManualApprovalSubscribeAsyncParams): Promise<string>,
  (params: IRevokeManualApprovalSubscribeAsyncParams): Promise<string>,
  (params: IPauseSubscribeAsyncParams): Promise<string>,
  (params: IUnpauseSubscribeAsyncParams): Promise<string>,
}

interface IGetManualApprovalTransferManagerLogsAsyncParams extends IGetLogs {
  (params: IGetAddManualApprovalLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ManualApprovalTransferManagerAddManualApprovalEventArgs>>>,
  (params: IGetModifyManualApprovalLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ManualApprovalTransferManagerModifyManualApprovalEventArgs>>>,
  (params: IGetRevokeManualApprovalLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ManualApprovalTransferManagerRevokeManualApprovalEventArgs>>>,
  (params: IGetPauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ManualApprovalTransferManagerPauseEventArgs>>>,
  (params: IGetUnpauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ManualApprovalTransferManagerUnpauseEventArgs>>>,
}

interface ApprovalsParams {
  index: number,
}

interface VerifyTransferParams extends TxParams {
  from: string,
  to: string,
  amount: BigNumber,
  data: string,
  isTransfer: boolean,
}

interface AddManualApprovalParams extends TxParams {
  from: string,
  to: string,
  allowance: BigNumber,
  expiryTime: Date,
  description: string,
}

interface AddManualApprovalMultiParams extends TxParams {
  from: string[],
  to: string[],
  allowances: BigNumber[],
  expiryTimes: Date[],
  descriptions: string[],
}

interface ModifyManualApprovalParams extends TxParams {
  from: string,
  to: string,
  expiryTime: Date,
  changeInAllowance: BigNumber,
  description: string,
  increase: boolean,
}

interface ModifyManualApprovalMultiParams extends TxParams {
  from: string[],
  to: string[],
  expiryTimes: Date[],
  changedAllowances: BigNumber[],
  descriptions: string[],
  increase: boolean[],
}

interface RevokeManualApprovalParams extends TxParams {
  from: string,
  to: string,
}

interface RevokeManualApprovalMultiParams extends TxParams {
  from: string[],
  to: string[],
}

interface GetActiveApprovalsToUserParams {
  user: string,
}

interface GetApprovalDetailsParams {
  from: string,
  to: string,
}

//// Return types ////
interface Approval {
  /**  */
  from: string,
  /**  */
  to: string,
  /**  */
  allowance: BigNumber,
  /**  */
  expiryTime: Date,
  /**  */
  description: string
}
//// End of return types ////

/**
 * This class includes the functionality related to interacting with the ManualApproval Transfer Manager contract.
 */
export class ManualApprovalTransferManagerWrapper extends ModuleWrapper {
  public abi: ContractAbi = ManualApprovalTransferManager.abi;
  protected _contract: Promise<ManualApprovalTransferManagerContract>;

  /**
   * Instantiate ManualApprovalTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  constructor(web3Wrapper: Web3Wrapper, contract: Promise<ManualApprovalTransferManagerContract>) {
    super(web3Wrapper, contract);
    this._contract = contract;
  }

  public unpause = async (params: TxParams) => {
    return (await this._contract).unpause.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  }

  public paused = async () => {
    return await (await this._contract).paused.callAsync();
  }

  public approvals = async (params: ApprovalsParams) => {
    const result = await (await this._contract).approvals.callAsync(
        numberToBigNumber(params.index),
    );
    const typedResult: Approval = {
      from: result[0],
      to: result[1],
      allowance: result[2],
      expiryTime: bigNumberToDate(result[3]),
      description: result[4],
    }
    return typedResult;
  }

  public pause = async (params: TxParams) => {
    return (await this._contract).pause.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  } 

  public getInitFunction = async () => {
    return await (await this._contract).getInitFunction.callAsync();
  }

  public verifyTransfer = async (params: VerifyTransferParams) => {
    return (await this._contract).verifyTransfer.sendTransactionAsync(
      params.from,
      params.to,
      params.amount,
      params.data,
      params.isTransfer,
      params.txData,
      params.safetyFactor
    );
  }

  public addManualApproval = async (params: AddManualApprovalParams) => {
    return (await this._contract).addManualApproval.sendTransactionAsync(
      params.from,
      params.to,
      params.allowance,
      dateToBigNumber(params.expiryTime),
      stringToBytes32(params.description),
      params.txData,
      params.safetyFactor
    );
  }

  public addManualApprovalMulti = async (params: AddManualApprovalMultiParams) => {
    return (await this._contract).addManualApprovalMulti.sendTransactionAsync(
      params.from,
      params.to,
      params.allowances,
      dateArrayToBigNumberArray(params.expiryTimes),
      stringArrayToBytes32Array(params.descriptions),
      params.txData,
      params.safetyFactor
    );
  }

  public modifyManualApproval = async (params: ModifyManualApprovalParams) => {
    return (await this._contract).modifyManualApproval.sendTransactionAsync(
      params.from,
      params.to,
      dateToBigNumber(params.expiryTime),
      params.changeInAllowance,
      stringToBytes32(params.description),
      params.increase,
      params.txData,
      params.safetyFactor
    );
  }

  public modifyManualApprovalMulti = async (params: ModifyManualApprovalMultiParams) => {
    return (await this._contract).modifyManualApprovalMulti.sendTransactionAsync(
      params.from,
      params.to,
      dateArrayToBigNumberArray(params.expiryTimes),
      params.changedAllowances,
      stringArrayToBytes32Array(params.descriptions),
      params.increase,
      params.txData,
      params.safetyFactor
    );
  }

  public revokeManualApproval = async (params: RevokeManualApprovalParams) => {
    return (await this._contract).revokeManualApproval.sendTransactionAsync(
      params.from,
      params.to,
      params.txData,
      params.safetyFactor
    );
  }

  public revokeManualApprovalMulti = async (params: RevokeManualApprovalMultiParams) => {
    return (await this._contract).revokeManualApprovalMulti.sendTransactionAsync(
      params.from,
      params.to,
      params.txData,
      params.safetyFactor
    );
  }

  public getActiveApprovalsToUser = async (params: GetActiveApprovalsToUserParams) => {
    const result = await (await this._contract).getActiveApprovalsToUser.callAsync(
      params.user,
    );
    const typedResult: Approval[] = [];
    for (let i = 0; i < result[0].length; i++) {
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
  }

  public getApprovalDetails = async (params: GetApprovalDetailsParams) => {
    const result = await (await this._contract).getApprovalDetails.callAsync(
      params.from,
      params.to,
    );
    const typedResult: Approval = {
      from: params.from,
      to: params.to,
      allowance: result[0],
      expiryTime: bigNumberToDate(result[1]),
      description: bytes32ToString(result[2])
    }
    return typedResult;
  }

  public getTotalApprovalsLength = async () => {
    return await (await this._contract).getTotalApprovalsLength.callAsync();
  }

  public getAllApprovals = async () => {
    const result = await (await this._contract).getAllApprovals.callAsync();
    const typedResult: Approval[] = [];
    for (let i = 0; i < result[0].length; i++) {
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
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: IManualApprovalTransferManagerSubscribeAsyncParams = async <ArgsType extends ManualApprovalTransferManagerEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ManualApprovalTransferManagerEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      ManualApprovalTransferManager.abi,
      params.callback,
      !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetManualApprovalTransferManagerLogsAsyncParams = async <ArgsType extends ManualApprovalTransferManagerEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ManualApprovalTransferManagerEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      ManualApprovalTransferManager.abi,
    );
    return logs;
  }
}
