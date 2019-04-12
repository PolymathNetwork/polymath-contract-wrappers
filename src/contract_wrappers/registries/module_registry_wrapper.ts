import {
  ModuleRegistryContract,
  ModuleRegistryEventArgs,
  ModuleRegistryEvents,
  ModuleRegistryPauseEventArgs,
  ModuleRegistryUnpauseEventArgs,
  ModuleRegistryModuleUsedEventArgs,
  ModuleRegistryModuleRegisteredEventArgs,
  ModuleRegistryModuleVerifiedEventArgs,
  ModuleRegistryModuleRemovedEventArgs,
  ModuleRegistryOwnershipTransferredEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { ModuleRegistry } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import * as _ from 'lodash';
import { ContractWrapper } from '../contract_wrapper';
import {
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
  TxPayableParams,
  TxParams,
  ISubscribe,
  IGetLogs,
  ModuleType
} from '../../types';
import { assert } from '../../utils/assert';
import { bytes32ToString } from '../../utils/convert';
import { schemas } from '@0x/json-schemas';

interface IPauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleRegistryEvents.Pause,
  callback: EventCallback<ModuleRegistryPauseEventArgs>,
}

interface IGetPauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleRegistryEvents.Pause,
}

interface IUnpauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleRegistryEvents.Unpause,
  callback: EventCallback<ModuleRegistryUnpauseEventArgs>,
}

interface IGetUnpauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleRegistryEvents.Unpause,
}

interface IModuleUsedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleRegistryEvents.ModuleUsed,
  callback: EventCallback<ModuleRegistryModuleUsedEventArgs>,
}

interface IGetModuleUsedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleRegistryEvents.ModuleUsed,
}

interface IModuleRegisteredSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleRegistryEvents.ModuleRegistered,
  callback: EventCallback<ModuleRegistryModuleRegisteredEventArgs>,
}

interface IGetModuleRegisteredLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleRegistryEvents.ModuleRegistered,
}

interface IModuleVerifiedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleRegistryEvents.ModuleVerified,
  callback: EventCallback<ModuleRegistryModuleVerifiedEventArgs>,
}

interface IGetModuleVerifiedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleRegistryEvents.ModuleVerified,
}

interface IModuleRemovedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleRegistryEvents.ModuleRemoved,
  callback: EventCallback<ModuleRegistryModuleRemovedEventArgs>,
}

interface IGetModuleRemovedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleRegistryEvents.ModuleRemoved,
}

interface IOwnershipTransferredSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleRegistryEvents.OwnershipTransferred,
  callback: EventCallback<ModuleRegistryOwnershipTransferredEventArgs>,
}

interface IGetOwnershipTransferredLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleRegistryEvents.OwnershipTransferred,
}

interface IModuleRegistrySubscribeAsyncParams extends ISubscribe {
  (params: IPauseSubscribeAsyncParams): Promise<string>,
  (params: IUnpauseSubscribeAsyncParams): Promise<string>,
  (params: IModuleUsedSubscribeAsyncParams): Promise<string>,
  (params: IModuleRegisteredSubscribeAsyncParams): Promise<string>,
  (params: IModuleVerifiedSubscribeAsyncParams): Promise<string>,
  (params: IModuleRemovedSubscribeAsyncParams): Promise<string>,
  (params: IOwnershipTransferredSubscribeAsyncParams): Promise<string>,
}

interface IGetModuleRegistryLogsAsyncParams extends IGetLogs {
  (params: IGetPauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryPauseEventArgs>>>,
  (params: IGetUnpauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryUnpauseEventArgs>>>,
  (params: IGetModuleUsedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryModuleUsedEventArgs>>>,
  (params: IGetModuleRegisteredLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryModuleRegisteredEventArgs>>>,
  (params: IGetModuleVerifiedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryModuleVerifiedEventArgs>>>,
  (params: IGetModuleRemovedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryModuleRemovedEventArgs>>>,
  (params: IGetOwnershipTransferredLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryOwnershipTransferredEventArgs>>>,
}

interface GetValueByVariableParams {
  variable: string,
}

interface GetValueByKeyParams {
  key: string,
}

interface InitializeParams extends TxPayableParams {
  polymathRegistry: string,
  owner: string,
}

interface ModuleFactoryParams extends TxParams {
  moduleFactory: string,
}

interface VerifyModuleParams extends TxParams {
  moduleFactory: string,
  verified: boolean,
}

/**
 * @param moduleType is the module type to look for
 * @param securityToken is the address of SecurityToken
 */
interface TypeAndTokenParams {
  moduleType: ModuleType,
  securityToken: string,
}

interface ModuleTypeParams {
  moduleType: ModuleType,
}

interface ReclaimERC20Params extends TxParams {
  tokenContract: string,
}

interface TransferOwnershipParams extends TxParams {
  newOwner: string,
}

//// Return types ////
interface TagsByModule {
  module: string;
  tags: string[]
}
//// End of return types ////

/**
 * This class includes the functionality related to interacting with the ModuleRegistry contract.
 */
export class ModuleRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = ModuleRegistry.abi;
  protected _contract: Promise<ModuleRegistryContract>;

  /**
   * Instantiate ModuleRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  constructor(web3Wrapper: Web3Wrapper, contract: Promise<ModuleRegistryContract>) {
    super(web3Wrapper, contract);
    this._contract = contract;
  }

  public getBytes32Value = async (params: GetValueByVariableParams) => {
    return await (await this._contract).getBytes32Value.callAsync(
      params.variable,
    )
  }

  public getBytesValue = async (params: GetValueByVariableParams) => {
    return await (await this._contract).getBytesValue.callAsync(
      params.variable,
    )
  }

  public getAddressValue = async (params: GetValueByVariableParams) => {
    return await (await this._contract).getAddressValue.callAsync(
      params.variable,
    )
  }

  public getArrayAddress = async (params: GetValueByKeyParams)=> {
    return await (await this._contract).getArrayAddress.callAsync(
      params.key,
    )
  }

  public getBoolValue = async (params: GetValueByVariableParams) => {
    return await (await this._contract).getBoolValue.callAsync(
      params.variable,
    )
  }

  public getStringValue = async (params: GetValueByVariableParams) => {
    return await (await this._contract).getStringValue.callAsync(
      params.variable,
    )
  }

  public getArrayBytes32 = async (params: GetValueByKeyParams) => {
    return await (await this._contract).getArrayBytes32.callAsync(
      params.key,
    )
  }
  
  public getUintValue = async (params: GetValueByVariableParams) => {
    return await (await this._contract).getUintValue.callAsync(
      params.variable,
    )
  }

  public getArrayUint = async (params: GetValueByKeyParams) => {
    return await (await this._contract).getArrayUint.callAsync(
      params.key,
    )
  }

  public initialize = async (params: InitializeParams) => {
    return (await this._contract).initialize.sendTransactionAsync(
      params.polymathRegistry,
      params.owner,
      params.txData,
      params.safetyFactor,
    );
  }

  public useModule = async (params: ModuleFactoryParams) => {
    return (await this._contract).useModule.sendTransactionAsync(
      params.moduleFactory,
      params.txData,
      params.safetyFactor,
    );
  }

  public registerModule = async (params: ModuleFactoryParams) => {
    return (await this._contract).registerModule.sendTransactionAsync(
      params.moduleFactory,
      params.txData,
      params.safetyFactor,
    );
  }

  public removeModule = async (params: ModuleFactoryParams) => {
      return (await this._contract).removeModule.sendTransactionAsync(
        params.moduleFactory,
        params.txData,
        params.safetyFactor,
      );
  }

  public verifyModule = async (params: VerifyModuleParams) => {
    return (await this._contract).verifyModule.sendTransactionAsync(
      params.moduleFactory,
      params.verified,
      params.txData,
      params.safetyFactor,
    );
  }

  public getTagsByTypeAndToken = async (params: TypeAndTokenParams) => {
    const result = await (await this._contract).getTagsByTypeAndToken.callAsync(
      params.moduleType,
      params.securityToken,
    )
    // [tag1, tag2, tag3, tag2, tag3], [module1, module1, module1, module2, module2]
    const zippedResult = _.zip(result[0], result[1]); // [[tag1, module1], [tag2, module1], [tag3, module1] ...]
    const groupedResult = _.groupBy(zippedResult, (value) => { return value[1]}); // [module1: [[tag1, module1], [tag2, module1]], ...]
    let typedResult: TagsByModule[] = [];
    _.forEach(groupedResult, function(value, key) {
      const tagsByModule: TagsByModule = {
        module: key,
        tags: value.map((pair) => bytes32ToString(pair[1] as string))
      }
      typedResult.push(tagsByModule);
    });
    return typedResult;
  }

  public getTagsByType = async (params: ModuleTypeParams) => {
    const result = await (await this._contract).getTagsByType.callAsync(
      params.moduleType,
    );
    // [tag1, tag2, tag3, tag2, tag3], [module1, module1, module1, module2, module2]
    const zippedResult = _.zip(result[0], result[1]); // [[tag1, module1], [tag2, module1], [tag3, module1] ...]
    const groupedResult = _.groupBy(zippedResult, (value) => { return value[1]}); // [module1: [[tag1, module1], [tag2, module1]], ...]
    let typedResult: TagsByModule[] = [];
    _.forEach(groupedResult, function(value, key) {
      const tagsByModule: TagsByModule = {
        module: key,
        tags: value.map((pair) => bytes32ToString(pair[1] as string))
      }
      typedResult.push(tagsByModule);
    });
    return typedResult;
  }

  public getReputationByFactory = async (params: ModuleFactoryParams) => {
    return await (await this._contract).getReputationByFactory.callAsync(
      params.moduleFactory,
    )
  }

  public getModulesByType = async (params: ModuleTypeParams) => {
    return await (await this._contract).getModulesByType.callAsync(
      params.moduleType,
    )
  }

  /**
   * Returns the list of available Module factory addresses of a particular type for a given token.
   * @return address array that contains the list of available addresses of module factory contracts.
   */
  public getModulesByTypeAndToken = async (params: TypeAndTokenParams) => {
    return await (await this._contract).getModulesByTypeAndToken.callAsync(
      params.moduleType,
      params.securityToken,
    )
  }

  public reclaimERC20 = async (params: ReclaimERC20Params) => {
    return (await this._contract).reclaimERC20.sendTransactionAsync(
      params.tokenContract,
      params.txData,
      params.safetyFactor,
    );
  }

  public pause = async (params: TxParams) => {
    return (await this._contract).pause.sendTransactionAsync(
      params.txData,
      params.safetyFactor,
    );
  }

  public unpause = async (params: TxParams) => {
    return (await this._contract).unpause.sendTransactionAsync(
      params.txData,
      params.safetyFactor,
    );
  }

  public updateFromRegistry = async (params: TxParams) => {
    return (await this._contract).updateFromRegistry.sendTransactionAsync(
      params.txData,
      params.safetyFactor,
    );
  }

  public transferOwnership = async (params: TransferOwnershipParams) => {
    return (await this._contract).transferOwnership.sendTransactionAsync(
      params.newOwner,
      params.txData,
      params.safetyFactor,
    );
  }

  public owner = async () => {
    return await (await this._contract).owner.callAsync()
  }

  public isPaused = async () => {
    return await (await this._contract).isPaused.callAsync()
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: IModuleRegistrySubscribeAsyncParams = async <ArgsType extends ModuleRegistryEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ModuleRegistryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        ModuleRegistry.abi,
        params.callback,
        !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetModuleRegistryLogsAsyncParams = async <ArgsType extends ModuleRegistryEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ModuleRegistryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        ModuleRegistry.abi,
    );
    return logs;
  }
}
