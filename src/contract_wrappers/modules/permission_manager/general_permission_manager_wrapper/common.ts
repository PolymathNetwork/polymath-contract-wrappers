import {
  GeneralPermissionManagerContract_3_0_0,
  GeneralPermissionManagerContract_3_1_0,
  GeneralPermissionManagerEvents_3_0_0,
  GeneralPermissionManagerEventArgs_3_0_0,
  GeneralPermissionManagerAddDelegateEventArgs_3_0_0,
  GeneralPermissionManagerChangePermissionEventArgs_3_0_0,
  GeneralPermissionManagerPauseEventArgs_3_0_0,
  GeneralPermissionManagerUnpauseEventArgs_3_0_0,
  Web3Wrapper,
  PolyResponse,
  LogWithDecodedArgs,
} from '@polymathnetwork/abi-wrappers';
import _ from 'lodash';
import { schemas } from '@0x/json-schemas';
import assert from '../../../../utils/assert';
import { ModuleCommon } from '../../module_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import {
  TxParams,
  Perm,
  ErrorCode,
  GetLogs,
  Subscribe,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
} from '../../../../types';
import {
  numberToBigNumber,
  stringToBytes32,
  stringArrayToBytes32Array,
  parsePermBytes32Value,
  bytes32ToString,
} from '../../../../utils/convert';
import ContractWrapper from '../../../contract_wrapper';

interface ChangePermissionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralPermissionManagerEvents_3_0_0.ChangePermission;
  callback: EventCallback<GeneralPermissionManagerChangePermissionEventArgs_3_0_0>;
}

interface GetChangePermissionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralPermissionManagerEvents_3_0_0.ChangePermission;
}

interface AddDelegateSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralPermissionManagerEvents_3_0_0.AddDelegate;
  callback: EventCallback<GeneralPermissionManagerAddDelegateEventArgs_3_0_0>;
}

interface GetAddDelegateLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralPermissionManagerEvents_3_0_0.AddDelegate;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralPermissionManagerEvents_3_0_0.Pause;
  callback: EventCallback<GeneralPermissionManagerPauseEventArgs_3_0_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralPermissionManagerEvents_3_0_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralPermissionManagerEvents_3_0_0.Unpause;
  callback: EventCallback<GeneralPermissionManagerUnpauseEventArgs_3_0_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralPermissionManagerEvents_3_0_0.Unpause;
}

export interface GeneralPermissionManagerSubscribeAsyncParams extends Subscribe {
  (params: ChangePermissionSubscribeAsyncParams): Promise<string>;
  (params: AddDelegateSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

export interface GetGeneralPermissionManagerLogsAsyncParams extends GetLogs {
  (params: GetChangePermissionLogsAsyncParams): Promise<
    LogWithDecodedArgs<GeneralPermissionManagerChangePermissionEventArgs_3_0_0>[]
  >;
  (params: GetAddDelegateLogsAsyncParams): Promise<
    LogWithDecodedArgs<GeneralPermissionManagerAddDelegateEventArgs_3_0_0>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<GeneralPermissionManagerPauseEventArgs_3_0_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<GeneralPermissionManagerUnpauseEventArgs_3_0_0>[]>;
}

/**
 * @param delegate Ethereum address of the delegate
 * @param module Ethereum contract address of the module
 * @param perm Permission flag
 */
interface PermParams {
  module: string;
  delegate: string;
  permission: Perm;
}

/**
 * @param delegateIndex Index of the delegate
 */
interface DelegateIndexParams {
  delegateIndex: number;
}

/**
 * @param delegate the address of potential delegate
 */
interface DelegateParams {
  delegate: string;
}

/**
 * @param module Ethereum contract address of the module
 * @param perm Permission flag
 */
interface GetAllDelegatesWithPermParams {
  module: string;
  perm: Perm;
}

/**
 * @param delegate Ethereum address of the delegate
 * @param types Array of types
 */
interface GetAllModulesAndPermsFromTypesParams {
  delegate: string;
  types: number[];
}

/**
 * @param delegate Ethereum address of the delegate
 */
export interface DelegateTxParams extends TxParams {
  delegate: string;
}

/**
 * @param delegate Ethereum address of the delegate
 * @param details Details about the delegate i.e `Belongs to financial firm`
 */
export interface AddDelegateParams extends TxParams {
  delegate: string;
  details: string;
}

/**
 * @param delegate Ethereum address of the delegate
 * @param module Ethereum contract address of the module
 * @param perm Permission flag
 * @param valid Bool flag use to switch on/off the permission
 */
export interface ChangePermissionParams extends TxParams {
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
export interface ChangePermissionMultiParams extends TxParams {
  delegate: string;
  modules: string[];
  perms: Perm[];
  valids: boolean[];
}

// // Return types ////
interface PermissionsPerModule {
  /** Module address */
  module: string;
  /** List of permissions */
  permissions: Perm[];
}
// // End of return types ////

/**
 * This class includes the functionality related to interacting with the General Permission Manager contract.
 */
export default abstract class GeneralPermissionManagerCommon extends ModuleCommon {
  public contract: Promise<GeneralPermissionManagerContract_3_0_0 | GeneralPermissionManagerContract_3_1_0>;

  /**
   * Instantiate GeneralPermissionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<GeneralPermissionManagerContract_3_0_0 | GeneralPermissionManagerContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Mapping used to hold the permissions on the modules provided to delegate
   */
  public perms = async (params: PermParams): Promise<boolean> => {
    assert.isETHAddressHex('module', params.module);
    assert.isETHAddressHex('delegate', params.delegate);
    return (await this.contract).perms.callAsync(params.module, params.delegate, stringToBytes32(params.permission));
  };

  /**
   * Array to track all delegates
   */
  public allDelegates = async (params: DelegateIndexParams): Promise<string> => {
    return (await this.contract).allDelegates.callAsync(numberToBigNumber(params.delegateIndex));
  };

  /**
   * Mapping to hold the delegate details
   */
  public delegateDetails = async (params: DelegateParams): Promise<string> => {
    assert.isETHAddressHex('delegate', params.delegate);
    const delegateDetails = await (await this.contract).delegateDetails.callAsync(params.delegate);
    return bytes32ToString(delegateDetails);
  };

  /**
   * Used to check the permission on delegate corresponds to module contract address
   * @return bool if permission is valid
   */
  public checkPermission = async (params: PermParams): Promise<boolean> => {
    assert.isETHAddressHex('delegate', params.delegate);
    assert.isETHAddressHex('module', params.module);
    return (await this.contract).checkPermission.callAsync(
      params.delegate,
      params.module,
      stringToBytes32(params.permission),
    );
  };

  /**
   * Used to add a delegate
   */
  public addDelegate = async (params: AddDelegateParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isNonZeroETHAddressHex('delegate', params.delegate);
    assert.assert(params.details.length > 0, ErrorCode.InvalidData, '0 value not allowed');
    assert.assert(
      !(await (await this.contract).checkDelegate.callAsync(params.delegate)),
      ErrorCode.AlreadyExists,
      'Delegate already present',
    );
    return (await this.contract).addDelegate.sendTransactionAsync(
      params.delegate,
      stringToBytes32(params.details),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to delete a delegate
   */
  public deleteDelegate = async (params: DelegateTxParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isNonZeroETHAddressHex('delegate', params.delegate);
    assert.assert(
      await (await this.contract).checkDelegate.callAsync(params.delegate),
      ErrorCode.NotFound,
      'Delegate does not exist',
    );
    return (await this.contract).deleteDelegate.sendTransactionAsync(
      params.delegate,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to check if an address is a delegate or not
   * @return boolean if address is delegate
   */
  public checkDelegate = async (params: DelegateParams): Promise<boolean> => {
    assert.isNonZeroETHAddressHex('delegate', params.delegate);
    return (await this.contract).checkDelegate.callAsync(params.delegate);
  };

  /**
   * Used to provide/change the permission to the delegate corresponds to the module contract
   */
  public changePermission = async (params: ChangePermissionParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isNonZeroETHAddressHex('delegate', params.delegate);
    assert.isETHAddressHex('module', params.module);
    return (await this.contract).changePermission.sendTransactionAsync(
      params.delegate,
      params.module,
      stringToBytes32(params.perm),
      params.valid,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to change one or more permissions for a single delegate at once
   */
  public changePermissionMulti = async (params: ChangePermissionMultiParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isNonZeroETHAddressHex('delegate', params.delegate);
    params.modules.forEach(address => assert.isETHAddressHex('modules', address));
    assert.assert(params.modules.length > 0, ErrorCode.InvalidData, '0 length is not allowed');
    assert.assert(
      params.modules.length === params.perms.length,
      ErrorCode.MismatchedArrayLength,
      'Array length mismatch',
    );
    assert.assert(
      params.valids.length === params.perms.length,
      ErrorCode.MismatchedArrayLength,
      'Array length mismatch',
    );
    return (await this.contract).changePermissionMulti.sendTransactionAsync(
      params.delegate,
      params.modules,
      stringArrayToBytes32Array(params.perms),
      params.valids,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to return all delegates with a given permission and module
   * @return delegates address array
   */
  public getAllDelegatesWithPerm = async (params: GetAllDelegatesWithPermParams): Promise<string[]> => {
    assert.isETHAddressHex('module', params.module);
    return (await this.contract).getAllDelegatesWithPerm.callAsync(params.module, stringToBytes32(params.perm));
  };

  /**
   * Used to return all permission of a single or multiple module
   * @return The address array of Modules this delegate has permission, the permission array of the corresponding Modules
   */
  public getAllModulesAndPermsFromTypes = async (
    params: GetAllModulesAndPermsFromTypesParams,
  ): Promise<PermissionsPerModule[]> => {
    assert.isETHAddressHex('delegate', params.delegate);
    const result = await (await this.contract).getAllModulesAndPermsFromTypes.callAsync(params.delegate, params.types);
    // [module1, module1, module2, module3, module3], [perm1, perm2, perm1, perm2, perm3]
    const zippedResult = _.zip(result[0], result[1]); // [[module1, perm1], [module1, perm2], [module2, perm1] ...]
    const groupedResult = _.groupBy(zippedResult, value => {
      return value[0];
    }); // [module1: [[module1, perm1], [module1, perm2]], ...]
    const typedResult: PermissionsPerModule[] = [];
    _.forEach(groupedResult, (value, key): void => {
      const permissionsPerModule: PermissionsPerModule = {
        module: key,
        permissions: value.map(pair => parsePermBytes32Value(pair[1] as string)),
      };
      typedResult.push(permissionsPerModule);
    });
    return typedResult;
  };

  /**
   * Used to get all delegates
   * @return delegate addresses array
   */
  public getAllDelegates = async (): Promise<string[]> => {
    return (await this.contract).getAllDelegates.callAsync();
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: GeneralPermissionManagerSubscribeAsyncParams = async <
    ArgsType extends GeneralPermissionManagerEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, GeneralPermissionManagerEvents_3_0_0);
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
    ArgsType extends GeneralPermissionManagerEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, GeneralPermissionManagerEvents_3_0_0);
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

export function isGeneralPermissionManager(wrapper: ContractWrapper): wrapper is GeneralPermissionManagerCommon {
  return wrapper instanceof GeneralPermissionManagerCommon;
}
