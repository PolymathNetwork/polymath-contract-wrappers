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
  TxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
  Features,
  ISubscribe,
  IGetLogs
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

interface IFeatureRegistrySubscribeAsyncParams extends ISubscribe {
  (params: IChangeFeatureStatusSubscribeAsyncParams): Promise<string>,
  (params: IOwnershipRenouncedSubscribeAsyncParams): Promise<string>,
  (params: IOwnershipTransferredSubscribeAsyncParams): Promise<string>,
}

interface IGetFeatureRegistryLogsAsyncParams extends IGetLogs {
  (params: IGetChangeFeatureStatusLogsAsyncParams): Promise<Array<LogWithDecodedArgs<FeatureRegistryChangeFeatureStatusEventArgs>>>,
  (params: IGetOwnershipRenouncedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<FeatureRegistryOwnershipRenouncedEventArgs>>>,
  (params: IGetOwnershipTransferredLogsAsyncParams): Promise<Array<LogWithDecodedArgs<FeatureRegistryOwnershipTransferredEventArgs>>>,
}

/**
 * @param nameKey is the key for the feature status mapping
 */
interface GetFeatureStatusParams {
  nameKey: string;
}

/**
* @param nameKey is the key for the feature status mapping
* @param newStatus is the new feature status
*/
interface SetFeatureStatusParams extends TxParams {
  nameKey: string;
  newStatus: boolean;
}

/**
 * This class includes the functionality related to interacting with the FeatureRegistry contract.
 */
export class FeatureRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = FeatureRegistry.abi;
  protected _contract: Promise<FeatureRegistryContract>;
  private _polymathRegistry: PolymathRegistryWrapper;
  
  /**
   * Instantiate FeatureRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this._polymathRegistry = polymathRegistry;
    this._contract = this._getFeatureRegistryContract();
  }

  /**
   * Get the status of a feature
   * @return bool
   */
  public getFeatureStatus = async (params: GetFeatureStatusParams) => {
    return await (await this._contract).getFeatureStatus.callAsync(
        params.nameKey,
    )
  }

  /**
   * Change a feature status
   */
  public setFeatureStatus = async (params: SetFeatureStatusParams) => {
    return (await this._contract).setFeatureStatus.sendTransactionAsync(
      params.nameKey,
      params.newStatus,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Get the CustomModulesAllowed status
   * @return bool
   */
  public getCustomModulesAllowedStatus = async () => {
    return await (await this._contract).getFeatureStatus.callAsync(
        Features.CustomModulesAllowed,
    )
  }

  /**
   * Get the FreezeMintingAllowed status
   * @return bool
   */
  public getFreezeMintingAllowedStatus = async () => {
    return await (await this._contract).getFeatureStatus.callAsync(
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
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
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
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetFeatureRegistryLogsAsyncParams = async <ArgsType extends FeatureRegistryEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, FeatureRegistryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
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
      await this._polymathRegistry.getFeatureRegistryAddress(),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
