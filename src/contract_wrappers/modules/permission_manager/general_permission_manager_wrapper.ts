import {
  GeneralPermissionManagerContract,
  GeneralPermissionManagerEventArgs,
  GeneralPermissionManagerEvents,
  GeneralPermissionManagerChangePermissionEventArgs,
  GeneralPermissionManagerAddDelegateEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { GeneralPermissionManager } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import {
  TxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
  IGetLogs,
  ISubscribe
} from '../../../types';
import { assert } from '../../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { ModuleWrapper } from '../module_wrapper';
import { stringToBytes32, bytes32ToString } from '../../../utils/convert';
  
interface IChangePermissionSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: GeneralPermissionManagerEvents.ChangePermission,
  callback: EventCallback<GeneralPermissionManagerChangePermissionEventArgs>,
}

interface IGetChangePermissionLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: GeneralPermissionManagerEvents.ChangePermission,
}

interface IAddDelegateSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: GeneralPermissionManagerEvents.AddDelegate,
  callback: EventCallback<GeneralPermissionManagerAddDelegateEventArgs>,
}

interface IGetAddDelegateLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: GeneralPermissionManagerEvents.AddDelegate,
}

interface IGeneralPermissionManagerSubscribeAsyncParams extends ISubscribe {
  (params: IChangePermissionSubscribeAsyncParams): Promise<string>,
  (params: IAddDelegateSubscribeAsyncParams): Promise<string>,
}

interface IGetGeneralPermissionManagerLogsAsyncParams extends IGetLogs {
  (params: IGetChangePermissionLogsAsyncParams): Promise<Array<LogWithDecodedArgs<GeneralPermissionManagerChangePermissionEventArgs>>>,
  (params: IGetAddDelegateLogsAsyncParams): Promise<Array<LogWithDecodedArgs<GeneralPermissionManagerAddDelegateEventArgs>>>,
}

interface PermsParams {
  module: string,
  delegate: string,
  permission: string,
}

interface DelegateIndexParams {
  delegateIndex: BigNumber,
}

interface DelegateParams {
  delegate: string,
}

interface GetAllDelegatesWithPermParams {
  module: string,
  perm: string,
}

interface GetAllModulesAndPermsFromTypesParams {
  delegate: string,
  types: Array<number>,
}

interface DelegateTxParams extends TxParams {
  delegate: string,
}

interface AddDelegateParams extends TxParams {
  delegate: string,
  details: string,
}

interface ChangePermissionParams extends TxParams {
  delegate: string,
  module: string,
  perm: string,
  valid: boolean,
}

interface ChangePermissionMultiParams extends TxParams {
  delegate: string,
  modules: string[],
  perms: string[],
  valids: boolean[],
}

//// Return types ////
interface PermissonsPerModule {
  /** Module address */
  module: string
  /** List of permissions */
  permissions: string[]
}
//// End of return types ////

/**
 * This class includes the functionality related to interacting with the General Permission Manager contract.
 */
export class GeneralPermissionManagerWrapper extends ModuleWrapper {
  public abi: ContractAbi = GeneralPermissionManager.abi;
  protected _contract: Promise<GeneralPermissionManagerContract>;

  /**
   * Instantiate GeneralPermissionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param address The contract instance address
   */
  constructor(web3Wrapper: Web3Wrapper, contract: Promise<GeneralPermissionManagerContract>) {
    super(web3Wrapper, contract);
    this._contract = contract;
  }

  public perms = async (params: PermsParams) => {
    return await (await this._contract).perms.callAsync(
      params.module,
      params.delegate,
      params.permission,
    );
  }

  public allDelegates = async (params: DelegateIndexParams) => {
    return await (await this._contract).allDelegates.callAsync(
      params.delegateIndex,
    );
  }

  public delegateDetails = async (params: DelegateParams) => {
    return await (await this._contract).delegateDetails.callAsync(
      params.delegate,
    );
  }

  public checkPermission = async (params: PermsParams) => {
    return await (await this._contract).checkPermission.callAsync(
      params.delegate,
      params.module,
      params.permission,
    );
  }

  public addDelegate = async (params: AddDelegateParams) => {
    return (await this._contract).addDelegate.sendTransactionAsync(
      params.delegate,
      params.details,
      params.txData,
      params.safetyFactor
    );
  }

  public deleteDelegate = async (params: DelegateTxParams) => {
    return (await this._contract).deleteDelegate.sendTransactionAsync(
      params.delegate,
      params.txData,
      params.safetyFactor
    );
  }

  public checkDelegate = async (params: DelegateParams) => {
    return await (await this._contract).checkDelegate.callAsync(
      params.delegate,
    );
  }

  public changePermission = async (params: ChangePermissionParams) => {
    return (await this._contract).changePermission.sendTransactionAsync(
      params.delegate,
      params.module,
      params.perm,
      params.valid,
      params.txData,
      params.safetyFactor
    );
  }

  public changePermissionMulti = async (params: ChangePermissionMultiParams) => {
    return (await this._contract).changePermissionMulti.sendTransactionAsync(
      params.delegate,
      params.modules,
      params.perms,
      params.valids,
      params.txData,
      params.safetyFactor
    );
  }

  public getAllDelegatesWithPerm = async (params: GetAllDelegatesWithPermParams) => {
    return await (await this._contract).getAllDelegatesWithPerm.callAsync(
      params.module,
      params.perm,
    );
  }

  public getAllModulesAndPermsFromTypes = async (params: GetAllModulesAndPermsFromTypesParams) => {
    const result = await (await this._contract).getAllModulesAndPermsFromTypes.callAsync(
      params.delegate,
      params.types,
    ); 
    // [module1, module1, module2, module3, module3], [perm1, perm2, perm1, perm2, perm3]
    const zippedResult = _.zip(result[0], result[1]); // [[module1, perm1], [module1, perm2], [module2, perm1] ...]
    const groupedResult = _.groupBy(zippedResult, (value) => { return value[0]}); // [module1: [[module1, perm1], [module1, perm2]], ...]
    let typedResult: PermissonsPerModule[] = [];
    _.forEach(groupedResult, function(value, key) {
      const permissonsPerModule: PermissonsPerModule = {
        module: key,
        permissions: value.map((pair) => bytes32ToString(pair[1] as string))
      }
      typedResult.push(permissonsPerModule);
    });
    return typedResult;
  }

  public getAllDelegates = async () => {
    return await (await this._contract).getAllDelegates.callAsync();
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: IGeneralPermissionManagerSubscribeAsyncParams = async <ArgsType extends GeneralPermissionManagerEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, GeneralPermissionManagerEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      GeneralPermissionManager.abi,
      params.callback,
      !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetGeneralPermissionManagerLogsAsyncParams = async <ArgsType extends GeneralPermissionManagerEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, GeneralPermissionManagerEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      GeneralPermissionManager.abi,
    );
    return logs;
  }
}
