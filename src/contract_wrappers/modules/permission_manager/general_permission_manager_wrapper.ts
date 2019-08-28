import {
  GeneralPermissionManagerContract,
  GeneralPermissionManagerEventArgs,
  GeneralPermissionManagerEvents,
  GeneralPermissionManagerChangePermissionEventArgs,
  GeneralPermissionManagerAddDelegateEventArgs,
  Web3Wrapper,
  LogWithDecodedArgs,
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

interface PermParams {
  module: string;
  delegate: string;
  permission: Perm;
}

interface DelegateIndexParams {
  delegateIndex: number;
}

interface DelegateParams {
  delegate: string;
}

interface GetAllDelegatesWithPermParams {
  module: string;
  perm: Perm;
}

interface GetAllModulesAndPermsFromTypesParams {
  delegate: string;
  types: number[];
}

interface DelegateTxParams extends TxParams {
  delegate: string;
}

interface AddDelegateParams extends TxParams {
  delegate: string;
  details: string;
}

interface ChangePermissionParams extends TxParams {
  delegate: string;
  module: string;
  perm: Perm;
  valid: boolean;
}

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

  public perms = async (params: PermParams) => {
    assert.isETHAddressHex('module', params.module);
    assert.isETHAddressHex('delegate', params.delegate);
    return (await this.contract).perms.callAsync(params.module, params.delegate, stringToBytes32(params.permission));
  };

  public allDelegates = async (params: DelegateIndexParams) => {
    return (await this.contract).allDelegates.callAsync(numberToBigNumber(params.delegateIndex));
  };

  public delegateDetails = async (params: DelegateParams) => {
    assert.isETHAddressHex('delegate', params.delegate);
    return (await this.contract).delegateDetails.callAsync(params.delegate);
  };

  public checkPermission = async (params: PermParams) => {
    assert.isETHAddressHex('delegate', params.delegate);
    assert.isETHAddressHex('module', params.module);
    return (await this.contract).checkPermission.callAsync(
      params.delegate,
      params.module,
      stringToBytes32(params.permission),
    );
  };

  public addDelegate = async (params: AddDelegateParams) => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isNonZeroETHAddressHex('delegate', params.delegate);
    assert.assert(params.details.length > 0, ErrorCode.InvalidData, '0 value not allowed');
    assert.assert(
      !(await (await this.contract).checkDelegate.callAsync(params.delegate)),
      ErrorCode.PreconditionRequired,
      'Delegate already present',
    );
    return (await this.contract).addDelegate.sendTransactionAsync(
      params.delegate,
      stringToBytes32(params.details),
      params.txData,
      params.safetyFactor,
    );
  };

  public deleteDelegate = async (params: DelegateTxParams) => {
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

  public checkDelegate = async (params: DelegateParams) => {
    assert.isNonZeroETHAddressHex('delegate', params.delegate);
    return (await this.contract).checkDelegate.callAsync(params.delegate);
  };

  public changePermission = async (params: ChangePermissionParams) => {
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

  public changePermissionMulti = async (params: ChangePermissionMultiParams) => {
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

  public getAllDelegatesWithPerm = async (params: GetAllDelegatesWithPermParams) => {
    assert.isETHAddressHex('module', params.module);
    return (await this.contract).getAllDelegatesWithPerm.callAsync(params.module, stringToBytes32(params.perm));
  };

  public getAllModulesAndPermsFromTypes = async (params: GetAllModulesAndPermsFromTypesParams) => {
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

  public getAllDelegates = async () => {
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
