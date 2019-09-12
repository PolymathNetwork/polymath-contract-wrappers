import {
  GeneralPermissionManagerContract,
  GeneralPermissionManagerEventArgs,
  GeneralPermissionManagerEvents,
  GeneralPermissionManagerChangePermissionEventArgs,
  GeneralPermissionManagerAddDelegateEventArgs,
  Web3Wrapper,
  LogWithDecodedArgs,
  PolyResponse,
} from '@polymathnetwork/abi-wrappers';
import _ from 'lodash';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import ModuleWrapper from '../module_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  GetLogs,
  Subscribe,
  Perm,
  ErrorCode,
} from '../../../types';
import {
  numberToBigNumber,
  stringToBytes32,
  stringArrayToBytes32Array,
  parsePermBytes32Value,
} from '../../../utils/convert';

interface ChangePermissionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralPermissionManagerEvents.ChangePermission;
  callback: EventCallback<GeneralPermissionManagerChangePermissionEventArgs>;
}

interface GetChangePermissionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralPermissionManagerEvents.ChangePermission;
}

interface AddDelegateSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralPermissionManagerEvents.AddDelegate;
  callback: EventCallback<GeneralPermissionManagerAddDelegateEventArgs>;
}

interface GetAddDelegateLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralPermissionManagerEvents.AddDelegate;
}

interface GeneralPermissionManagerSubscribeAsyncParams extends Subscribe {
  (params: ChangePermissionSubscribeAsyncParams): Promise<string>;
  (params: AddDelegateSubscribeAsyncParams): Promise<string>;
}

interface GetGeneralPermissionManagerLogsAsyncParams extends GetLogs {
  (params: GetChangePermissionLogsAsyncParams): Promise<
    LogWithDecodedArgs<GeneralPermissionManagerChangePermissionEventArgs>[]
  >;
  (params: GetAddDelegateLogsAsyncParams): Promise<LogWithDecodedArgs<GeneralPermissionManagerAddDelegateEventArgs>[]>;
}

export namespace GeneralPermissionManagerTransactionParams {
  export interface DeleteDelegate extends DelegateTxParams {}
  export interface AddDelegate extends AddDelegateParams {}
  export interface ChangePermission extends ChangePermissionParams {}
  export interface ChangePermissionMulti extends ChangePermissionMultiParams {}
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
export default class GeneralPermissionManagerWrapper extends ModuleWrapper {
  protected contract: Promise<GeneralPermissionManagerContract>;

  /**
   * Instantiate GeneralPermissionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<GeneralPermissionManagerContract>,
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
    return (await this.contract).delegateDetails.callAsync(params.delegate);
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
    ArgsType extends GeneralPermissionManagerEventArgs
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, GeneralPermissionManagerEvents);
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
    ArgsType extends GeneralPermissionManagerEventArgs
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, GeneralPermissionManagerEvents);
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
