import {
  ModuleFactoryContract,
  ModuleFactoryEventArgs,
  ModuleFactoryEvents,
  ModuleFactoryOwnershipRenouncedEventArgs,
  ModuleFactoryOwnershipTransferredEventArgs,
  ModuleFactoryChangeFactorySetupFeeEventArgs,
  ModuleFactoryChangeFactoryUsageFeeEventArgs,
  ModuleFactoryChangeFactorySubscriptionFeeEventArgs,
  ModuleFactoryGenerateModuleFromFactoryEventArgs,
  ModuleFactoryChangeSTVersionBoundEventArgs
} from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from '../registries/polymath_registry_wrapper';
import { ModuleFactory } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import * as _ from 'lodash';
import { ContractWrapper } from '../contract_wrapper';
import {
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
} from '../../types';
import { assert } from '../../utils/assert';
import { schemas } from '@0x/json-schemas';

interface IOwnershipRenouncedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleFactoryEvents.OwnershipRenounced,
  callback: EventCallback<ModuleFactoryOwnershipRenouncedEventArgs>,
}

interface IGetOwnershipRenouncedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleFactoryEvents.OwnershipRenounced,
}

interface IOwnershipTransferredSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleFactoryEvents.OwnershipTransferred,
  callback: EventCallback<ModuleFactoryOwnershipTransferredEventArgs>,
}

interface IGetOwnershipTransferredLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleFactoryEvents.OwnershipTransferred,
}

interface IChangeFactorySetupFeeSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleFactoryEvents.ChangeFactorySetupFee,
  callback: EventCallback<ModuleFactoryChangeFactorySetupFeeEventArgs>,
}

interface IGetChangeFactorySetupFeeLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleFactoryEvents.ChangeFactorySetupFee,
}

interface IChangeFactoryUsageFeeSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleFactoryEvents.ChangeFactoryUsageFee,
  callback: EventCallback<ModuleFactoryChangeFactoryUsageFeeEventArgs>,
}

interface IGetChangeFactoryUsageFeeLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleFactoryEvents.ChangeFactoryUsageFee,
}

interface IChangeFactorySubscriptionFeeSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleFactoryEvents.ChangeFactorySubscriptionFee,
  callback: EventCallback<ModuleFactoryChangeFactorySubscriptionFeeEventArgs>,
}

interface IGetChangeFactorySubscriptionFeeLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleFactoryEvents.ChangeFactorySubscriptionFee,
}

interface IGenerateModuleFromFactorySubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleFactoryEvents.GenerateModuleFromFactory,
  callback: EventCallback<ModuleFactoryGenerateModuleFromFactoryEventArgs>,
}

interface IGetGenerateModuleFromFactoryLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleFactoryEvents.GenerateModuleFromFactory,
}

interface IChangeSTVersionBoundSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleFactoryEvents.ChangeSTVersionBound,
  callback: EventCallback<ModuleFactoryChangeSTVersionBoundEventArgs>,
}

interface IGetChangeSTVersionBoundLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleFactoryEvents.ChangeSTVersionBound,
}

interface IModuleFactorySubscribeAsyncParams {
  (params: IOwnershipRenouncedSubscribeAsyncParams): Promise<string>,
  (params: IOwnershipTransferredSubscribeAsyncParams): Promise<string>,
  (params: IChangeFactorySetupFeeSubscribeAsyncParams): Promise<string>,
  (params: IChangeFactoryUsageFeeSubscribeAsyncParams): Promise<string>,
  (params: IChangeFactorySubscriptionFeeSubscribeAsyncParams): Promise<string>,
  (params: IGenerateModuleFromFactorySubscribeAsyncParams): Promise<string>,
  (params: IChangeSTVersionBoundSubscribeAsyncParams): Promise<string>,
}

interface IGetModuleFactoryLogsAsyncParams {
  (params: IGetOwnershipRenouncedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleFactoryOwnershipRenouncedEventArgs>>>,
  (params: IGetOwnershipTransferredLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleFactoryOwnershipTransferredEventArgs>>>,
  (params: IGetChangeFactorySetupFeeLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleFactoryChangeFactorySetupFeeEventArgs>>>,
  (params: IGetChangeFactoryUsageFeeLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleFactoryChangeFactoryUsageFeeEventArgs>>>,
  (params: IGetChangeFactorySubscriptionFeeLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleFactoryChangeFactorySubscriptionFeeEventArgs>>>,
  (params: IGetGenerateModuleFromFactoryLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleFactoryGenerateModuleFromFactoryEventArgs>>>,
  (params: IGetChangeSTVersionBoundLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleFactoryChangeSTVersionBoundEventArgs>>>,
}

/**
 * This class includes the functionality related to interacting with the ModuleFactory contract.
 */
export class ModuleFactoryWrapper extends ContractWrapper {
  public abi: ContractAbi = ModuleFactory.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private moduleFactoryContract: Promise<ModuleFactoryContract>;
  /**
   * Instantiate ModuleFactoryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this.polymathRegistry = polymathRegistry;
    this.moduleFactoryContract = this._getModuleFactoryContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.moduleFactoryContract).address;
  }

  /**
   * Get the name of the Module
   */
  public getName = async (): Promise<string> => {
    return await (await this.moduleFactoryContract).name.callAsync();
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: IModuleFactorySubscribeAsyncParams = async <ArgsType extends ModuleFactoryEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ModuleFactoryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.moduleFactoryContract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        ModuleFactory.abi,
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
  public getLogsAsync: IGetModuleFactoryLogsAsyncParams = async <ArgsType extends ModuleFactoryEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ModuleFactoryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.moduleFactoryContract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        ModuleFactory.abi,
    );
    return logs;
  }

  private async _getModuleFactoryContract(): Promise<ModuleFactoryContract> {
    return new ModuleFactoryContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'ModuleFactory',
      }),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
