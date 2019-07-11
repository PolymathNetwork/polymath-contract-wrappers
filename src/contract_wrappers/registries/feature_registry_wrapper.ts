import {
  FeatureRegistryContract,
  FeatureRegistryEventArgs,
  FeatureRegistryEvents,
  FeatureRegistryChangeFeatureStatusEventArgs,
  FeatureRegistryOwnershipTransferredEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { FeatureRegistry } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { schemas } from '@0x/json-schemas';
import ContractWrapper from '../contract_wrapper';
import assert from '../../utils/assert';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Feature,
  Subscribe,
  GetLogs,
} from '../../types';
import functionsUtils from '../../utils/functions_utils';

interface ChangeFeatureStatusSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: FeatureRegistryEvents.ChangeFeatureStatus;
  callback: EventCallback<FeatureRegistryChangeFeatureStatusEventArgs>;
}

interface GetChangeFeatureStatusLogsAsyncParams extends GetLogsAsyncParams {
  eventName: FeatureRegistryEvents.ChangeFeatureStatus;
}

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: FeatureRegistryEvents.OwnershipTransferred;
  callback: EventCallback<FeatureRegistryOwnershipTransferredEventArgs>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: FeatureRegistryEvents.OwnershipTransferred;
}

interface FeatureRegistrySubscribeAsyncParams extends Subscribe {
  (params: ChangeFeatureStatusSubscribeAsyncParams): Promise<string>;
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
}

interface GetFeatureRegistryLogsAsyncParams extends GetLogs {
  (params: GetChangeFeatureStatusLogsAsyncParams): Promise<
    LogWithDecodedArgs<FeatureRegistryChangeFeatureStatusEventArgs>[]
  >;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<FeatureRegistryOwnershipTransferredEventArgs>[]
  >;
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
export default class FeatureRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = FeatureRegistry.abi;

  protected contract: Promise<FeatureRegistryContract>;

  /**
   * Instantiate FeatureRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<FeatureRegistryContract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  public owner = async () => {
    return (await this.contract).owner.callAsync();
  };

  /**
   * Get the status of a feature
   * @return bool
   */
  public getFeatureStatus = async (params: GetFeatureStatusParams) => {
    return (await this.contract).getFeatureStatus.callAsync(params.nameKey);
  };

  /**
   * Change a feature status
   */
  public setFeatureStatus = async (params: SetFeatureStatusParams) => {
    assert.assert(
      functionsUtils.checksumAddressComparision(await this.owner(), await this.getCallerAddress(params.txData)),
      'From sender must be owner',
    );
    const currentStatus = await this.getFeatureStatus({ nameKey: params.nameKey });
    assert.assert(currentStatus !== params.newStatus, 'FeatureStatus must change');
    return (await this.contract).setFeatureStatus.sendTransactionAsync(
      params.nameKey,
      params.newStatus,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Get the CustomModulesAllowed status
   * @return bool
   */
  public getCustomModulesAllowedStatus = async () => {
    return (await this.contract).getFeatureStatus.callAsync(Feature.CustomModulesAllowed);
  };

  /**
   * Get the FreezeMintingAllowed status
   * @return bool
   */
  public getFreezeMintingAllowedStatus = async () => {
    return (await this.contract).getFeatureStatus.callAsync(Feature.FreezeMintingAllowed);
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: FeatureRegistrySubscribeAsyncParams = async <ArgsType extends FeatureRegistryEventArgs>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, FeatureRegistryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      FeatureRegistry.abi,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetFeatureRegistryLogsAsyncParams = async <ArgsType extends FeatureRegistryEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, FeatureRegistryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      FeatureRegistry.abi,
    );
    return logs;
  };
}
