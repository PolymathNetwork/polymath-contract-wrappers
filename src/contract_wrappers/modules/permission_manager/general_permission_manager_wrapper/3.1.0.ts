import {
  GeneralPermissionManagerContract_3_1_0,
  GeneralPermissionManagerEventArgs_3_1_0,
  GeneralPermissionManagerEvents_3_1_0,
  GeneralPermissionManagerChangePermissionEventArgs_3_1_0,
  GeneralPermissionManagerAddDelegateEventArgs_3_1_0,
  Web3Wrapper,
  LogWithDecodedArgs,
  PolyResponse,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../../utils/assert';
import ContractFactory from '../../../../factories/contractFactory';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  GetLogs,
  Subscribe,
  Perm,
  ErrorCode,
  ContractVersion,
} from '../../../../types';
import { stringArrayToBytes32Array } from '../../../../utils/convert';
import GeneralPermissionManagerCommon from './common';

interface ChangePermissionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralPermissionManagerEvents_3_1_0.ChangePermission;
  callback: EventCallback<GeneralPermissionManagerChangePermissionEventArgs_3_1_0>;
}

interface GetChangePermissionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralPermissionManagerEvents_3_1_0.ChangePermission;
}

interface AddDelegateSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralPermissionManagerEvents_3_1_0.AddDelegate;
  callback: EventCallback<GeneralPermissionManagerAddDelegateEventArgs_3_1_0>;
}

interface GetAddDelegateLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralPermissionManagerEvents_3_1_0.AddDelegate;
}

interface GeneralPermissionManagerSubscribeAsyncParams extends Subscribe {
  (params: ChangePermissionSubscribeAsyncParams): Promise<string>;
  (params: AddDelegateSubscribeAsyncParams): Promise<string>;
}

interface GetGeneralPermissionManagerLogsAsyncParams extends GetLogs {
  (params: GetChangePermissionLogsAsyncParams): Promise<
    LogWithDecodedArgs<GeneralPermissionManagerChangePermissionEventArgs_3_1_0>[]
  >;
  (params: GetAddDelegateLogsAsyncParams): Promise<
    LogWithDecodedArgs<GeneralPermissionManagerAddDelegateEventArgs_3_1_0>[]
  >;
}

export namespace GeneralPermissionManagerTransactionParams {
  export interface DeleteDelegate extends DelegateTxParams {}
  export interface AddDelegate extends AddDelegateParams {}
  export interface ChangePermission extends ChangePermissionParams {}
  export interface ChangePermissionMulti extends ChangePermissionMultiParams {}
}

/**
 * @param delegate Ethereum address of the delegate
 */
interface DelegateTxParams extends TxParams {
  delegate: string;
}

/**
 * @param delegate Ethereum address of the delegate
 * @param details Details about the delegate i.e `Belongs to financial firm`
 */
interface AddDelegateParams extends TxParams {
  delegate: string;
  details: string;
}

/**
 * @param delegate Ethereum address of the delegate
 * @param module Ethereum contract address of the module
 * @param perm Permission flag
 * @param valid Bool flag use to switch on/off the permission
 */
interface ChangePermissionParams extends TxParams {
  delegate: string;
  module: string;
  perm: Perm;
  valid: boolean;
}

/**
 * @param delegate Ethereum address of the delegate
 * @param modules Multiple module matching the multiple perms, needs to be same length
 * @param perms Multiple permission flag needs to be changed
 * @param valids Bool array consist the flag to switch on/off the permission
 */
interface ChangePermissionMultiParams extends TxParams {
  delegate: string;
  modules: string[];
  perms: Perm[];
  valids: boolean[];
}

/**
 * @param delegates An array of Ethereum addresses of the delegates
 * @param details An array of details about the delegates i.e `Belongs to financial firm`
 */
interface AddDelegateMultiParams extends TxParams {
  delegates: string[];
  details: string[];
}

/**
 * @param delegates An array of Ethereum address of delegates
 */
interface DeleteDelegateMultiParams extends TxParams {
  delegates: string[];
}

/**
 * This class includes the functionality related to interacting with the General Permission Manager contract.
 */
export class GeneralPermissionManager_3_1_0 extends GeneralPermissionManagerCommon {
  public contract: Promise<GeneralPermissionManagerContract_3_1_0>;

  public contractVersion = ContractVersion.V3_1_0;

  /**
   * Instantiate GeneralPermissionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<GeneralPermissionManagerContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Used to add multiple delegates in a batch
   */
  public addDelegateMulti = async (params: AddDelegateMultiParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.assert(
      params.delegates.length === params.details.length,
      ErrorCode.MismatchedArrayLength,
      'Array length mismatch',
    );

    const resultCheckDelegate = [];
    for (let i = 0; i < params.delegates.length; i += 1) {
      assert.isNonZeroETHAddressHex('delegate', params.delegates[i]);
      assert.assert(params.details[i].length > 0, ErrorCode.InvalidData, '0 value not allowed');
      resultCheckDelegate.push(this.delegateIsNotPresent(params.delegates[i]));
    }
    await Promise.all(resultCheckDelegate);
    return (await this.contract).addDelegateMulti.sendTransactionAsync(
      params.delegates,
      stringArrayToBytes32Array(params.details),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to delete a list of delegates
   */
  public deleteDelegateMulti = async (params: DeleteDelegateMultiParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );

    const resultCheckDelegate = [];
    for (let i = 0; i < params.delegates.length; i += 1) {
      assert.isNonZeroETHAddressHex('delegate', params.delegates[i]);
      resultCheckDelegate.push(this.delegateDoesNotExist(params.delegates[i]));
    }
    await Promise.all(resultCheckDelegate);
    return (await this.contract).deleteDelegateMulti.sendTransactionAsync(
      stringArrayToBytes32Array(params.delegates),
      params.txData,
      params.safetyFactor,
    );
  };

  private delegateIsNotPresent = async (delegate: string) => {
    assert.assert(
      !(await (await this.contract).checkDelegate.callAsync(delegate)),
      ErrorCode.AlreadyExists,
      `Delegate already present`,
    );
  };

  private delegateDoesNotExist = async (delegate: string) => {
    assert.assert(
      await (await this.contract).checkDelegate.callAsync(delegate),
      ErrorCode.NotFound,
      'Delegate does not exist',
    );
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: GeneralPermissionManagerSubscribeAsyncParams = async <
    ArgsType extends GeneralPermissionManagerEventArgs_3_1_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, GeneralPermissionManagerEvents_3_1_0);
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
  public getLogsAsync: GetGeneralPermissionManagerLogsAsyncParams = async <
    ArgsType extends GeneralPermissionManagerEventArgs_3_1_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, GeneralPermissionManagerEvents_3_1_0);
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

export function isGeneralPermissionManager_3_1_0(
  wrapper: GeneralPermissionManagerCommon,
): wrapper is GeneralPermissionManager_3_1_0 {
  return wrapper.contractVersion === ContractVersion.V3_1_0;
}
