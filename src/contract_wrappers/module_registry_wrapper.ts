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
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { ModuleRegistry } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import {
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
} from '../types';
import { assert } from '../utils/assert';
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

interface IModuleRegistrySubscribeAsyncParams {
  (params: IPauseSubscribeAsyncParams): Promise<string>,
  (params: IUnpauseSubscribeAsyncParams): Promise<string>,
  (params: IModuleUsedSubscribeAsyncParams): Promise<string>,
  (params: IModuleRegisteredSubscribeAsyncParams): Promise<string>,
  (params: IModuleVerifiedSubscribeAsyncParams): Promise<string>,
  (params: IModuleRemovedSubscribeAsyncParams): Promise<string>,
  (params: IOwnershipTransferredSubscribeAsyncParams): Promise<string>,
}

interface IGetModuleRegistryLogsAsyncParams {
  (params: IGetPauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryPauseEventArgs>>>,
  (params: IGetUnpauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryUnpauseEventArgs>>>,
  (params: IGetModuleUsedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryModuleUsedEventArgs>>>,
  (params: IGetModuleRegisteredLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryModuleRegisteredEventArgs>>>,
  (params: IGetModuleVerifiedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryModuleVerifiedEventArgs>>>,
  (params: IGetModuleRemovedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryModuleRemovedEventArgs>>>,
  (params: IGetOwnershipTransferredLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryOwnershipTransferredEventArgs>>>,
}

/**
 * @param moduleType is the module type to look for
 * @param securityToken is the address of SecurityToken
 */
interface IGetModulesByTypeAndTokenParams {
  moduleType: number;
  securityToken: string;
}

/**
 * This class includes the functionality related to interacting with the ModuleRegistry contract.
 */
export class ModuleRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = ModuleRegistry.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private moduleRegistryContract: Promise<ModuleRegistryContract>;
  /**
   * Instantiate ModuleRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this.polymathRegistry = polymathRegistry;
    this.moduleRegistryContract = this._getModuleRegistryContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.moduleRegistryContract).address;
  }

  /**
   * Returns the list of available Module factory addresses of a particular type for a given token.
   * @return address array that contains the list of available addresses of module factory contracts.
   */
  public getModulesByTypeAndToken = async (params: IGetModulesByTypeAndTokenParams): Promise<string[]> => {
    return await (await this.moduleRegistryContract).getModulesByTypeAndToken.callAsync(
      params.moduleType,
      params.securityToken,
    );
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
    const normalizedContractAddress = (await this.moduleRegistryContract).address.toLowerCase();
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
   * Cancel a subscription
   * @param subscriptionToken Subscription token returned by `subscribe()`
   */
  public unsubscribe = (subscriptionToken: string): void => {
    assert.isValidSubscriptionToken('subscriptionToken', subscriptionToken);
    this._unsubscribe(subscriptionToken);
  }

  /**
   * Cancels all existing subscriptions
   */
  public unsubscribeAll = (): void => {
    super._unsubscribeAll();
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
    const normalizedContractAddress = (await this.moduleRegistryContract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        ModuleRegistry.abi,
    );
    return logs;
  }

  private async _getModuleRegistryContract(): Promise<ModuleRegistryContract> {
    return new ModuleRegistryContract(
      this.abi,
      await this.polymathRegistry.getModuleRegistryAddress(),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
