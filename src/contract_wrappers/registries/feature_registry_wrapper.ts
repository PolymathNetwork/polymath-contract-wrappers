import {
  FeatureRegistryContract,
  FeatureRegistryEventArgs,
  FeatureRegistryEvents,
  FeatureRegistryChangeFeatureStatusEventArgs,
  FeatureRegistryOwnershipRenouncedEventArgs,
  FeatureRegistryOwnershipTransferredEventArgs
} from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { FeatureRegistry } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import * as _ from 'lodash';
import { ContractWrapper } from '../contract_wrapper';
import {
  ITxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
} from '../../types';
import { assert } from '../../utils/assert';
import { schemas } from '@0x/json-schemas';

interface IChangeFeatureStatusSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: FeatureRegistryEvents.ChangeFeatureStatus,
  callback: EventCallback<FeatureRegistryChangeFeatureStatusEventArgs>,
}

interface IGetChangeFeatureStatusLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: FeatureRegistryEvents.ChangeFeatureStatus,
}

interface IOwnershipRenouncedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: FeatureRegistryEvents.OwnershipRenounced,
  callback: EventCallback<FeatureRegistryOwnershipRenouncedEventArgs>,
}

interface IGetOwnershipRenouncedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: FeatureRegistryEvents.OwnershipRenounced,
}

interface IOwnershipTransferredSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: FeatureRegistryEvents.OwnershipTransferred,
  callback: EventCallback<FeatureRegistryOwnershipTransferredEventArgs>,
}

interface IGetOwnershipTransferredLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: FeatureRegistryEvents.OwnershipTransferred,
}

interface IFeatureRegistrySubscribeAsyncParams {
  (params: IChangeFeatureStatusSubscribeAsyncParams): Promise<string>,
  (params: IOwnershipRenouncedSubscribeAsyncParams): Promise<string>,
  (params: IOwnershipTransferredSubscribeAsyncParams): Promise<string>,
}

interface IGetFeatureRegistryLogsAsyncParams {
  (params: IGetChangeFeatureStatusLogsAsyncParams): Promise<Array<LogWithDecodedArgs<FeatureRegistryChangeFeatureStatusEventArgs>>>,
  (params: IGetOwnershipRenouncedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<FeatureRegistryOwnershipRenouncedEventArgs>>>,
  (params: IGetOwnershipTransferredLogsAsyncParams): Promise<Array<LogWithDecodedArgs<FeatureRegistryOwnershipTransferredEventArgs>>>,
}

/**
 * @param nameKey is the key for the feature status mapping
 */
interface IGetFeatureStatusParams {
  nameKey: string;
}

/**
* @param nameKey is the key for the feature status mapping
* @param newStatus is the new feature status
*/
interface ISetFeatureStatusParams extends ITxParams {
  nameKey: string;
  newStatus: boolean;
}

export enum Features {
  CustomModulesAllowed = "CustomModulesAllowed",
  FreezeMintingAllowed = "FreezeMintingAllowed",
}

/**
 * This class includes the functionality related to interacting with the FeatureRegistry contract.
 */
export class FeatureRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = FeatureRegistry.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private featureRegistryContract: Promise<FeatureRegistryContract>;
  /**
   * Instantiate FeatureRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this.polymathRegistry = polymathRegistry;
    this.featureRegistryContract = this._getFeatureRegistryContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.featureRegistryContract).address;
  }

  /**
   * Get the status of a feature
   * @return bool
   */
  public getFeatureStatus = async (params: IGetFeatureStatusParams): Promise<boolean> => {
    return await (await this.featureRegistryContract).getFeatureStatus.callAsync(
        params.nameKey,
    )
  }

  /**
   * Change a feature status
   */
  public setFeatureStatus = async (params: ISetFeatureStatusParams) => {
    return async () => {
      return (await this.featureRegistryContract).setFeatureStatus.sendTransactionAsync(
        params.nameKey,
        params.newStatus
      );
    }
  }

  /**
   * Get the CustomModulesAllowed status
   * @return bool
   */
  public getCustomModulesAllowedStatus = async (): Promise<boolean> => {
    return await (await this.featureRegistryContract).getFeatureStatus.callAsync(
        Features.CustomModulesAllowed,
    )
  }

  /**
   * Get the FreezeMintingAllowed status
   * @return bool
   */
  public getFreezeMintingAllowedStatus = async (): Promise<boolean> => {
    return await (await this.featureRegistryContract).getFeatureStatus.callAsync(
      Features.FreezeMintingAllowed,
    )
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: IFeatureRegistrySubscribeAsyncParams = async <ArgsType extends FeatureRegistryEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, FeatureRegistryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.featureRegistryContract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        FeatureRegistry.abi,
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
  public getLogsAsync: IGetFeatureRegistryLogsAsyncParams = async <ArgsType extends FeatureRegistryEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, FeatureRegistryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.featureRegistryContract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        FeatureRegistry.abi,
    );
    return logs;
  }

  private async _getFeatureRegistryContract(): Promise<FeatureRegistryContract> {
    return new FeatureRegistryContract(
      this.abi,
      await this.polymathRegistry.getFeatureRegistryAddress(),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
