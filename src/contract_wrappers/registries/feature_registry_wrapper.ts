import {
  FeatureRegistryContract_3_0_0,
  FeatureRegistryEventArgs_3_0_0,
  FeatureRegistryEvents_3_0_0,
  FeatureRegistryChangeFeatureStatusEventArgs_3_0_0,
  FeatureRegistryOwnershipTransferredEventArgs_3_0_0,
  Web3Wrapper,
  LogWithDecodedArgs,
} from '@polymathnetwork/abi-wrappers';
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
  ErrorCode,
  ContractVersion,
} from '../../types';
import functionsUtils from '../../utils/functions_utils';

interface ChangeFeatureStatusSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: FeatureRegistryEvents_3_0_0.ChangeFeatureStatus;
  callback: EventCallback<FeatureRegistryChangeFeatureStatusEventArgs_3_0_0>;
}

interface GetChangeFeatureStatusLogsAsyncParams extends GetLogsAsyncParams {
  eventName: FeatureRegistryEvents_3_0_0.ChangeFeatureStatus;
}

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: FeatureRegistryEvents_3_0_0.OwnershipTransferred;
  callback: EventCallback<FeatureRegistryOwnershipTransferredEventArgs_3_0_0>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: FeatureRegistryEvents_3_0_0.OwnershipTransferred;
}

interface FeatureRegistrySubscribeAsyncParams extends Subscribe {
  (params: ChangeFeatureStatusSubscribeAsyncParams): Promise<string>;
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
}

interface GetFeatureRegistryLogsAsyncParams extends GetLogs {
  (params: GetChangeFeatureStatusLogsAsyncParams): Promise<
    LogWithDecodedArgs<FeatureRegistryChangeFeatureStatusEventArgs_3_0_0>[]
  >;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<FeatureRegistryOwnershipTransferredEventArgs_3_0_0>[]
  >;
}

export namespace FeatureRegistryTransactionParams {
  export interface SetFeatureStatus extends SetFeatureStatusParams {}
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
  public contract: Promise<FeatureRegistryContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate FeatureRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<FeatureRegistryContract_3_0_0>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Get owner of contract
   * @return address
   */
  public owner = async (): Promise<string> => {
    return (await this.contract).owner.callAsync();
  };

  /**
   * Get the status of a feature
   * @return bool
   */
  public getFeatureStatus = async (params: GetFeatureStatusParams): Promise<boolean> => {
    return (await this.contract).getFeatureStatus.callAsync(params.nameKey);
  };

  /**
   * Change a feature status
   */
  public setFeatureStatus = async (params: SetFeatureStatusParams) => {
    assert.assert(
      functionsUtils.checksumAddressComparision(await this.owner(), await this.getCallerAddress(params.txData)),
      ErrorCode.Unauthorized,
      'From sender must be owner',
    );
    const currentStatus = await this.getFeatureStatus({ nameKey: params.nameKey });
    assert.assert(currentStatus !== params.newStatus, ErrorCode.PreconditionRequired, 'FeatureStatus must change');
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
  public getCustomModulesAllowedStatus = async (): Promise<boolean> => {
    return (await this.contract).getFeatureStatus.callAsync(Feature.CustomModulesAllowed);
  };

  /**
   * Get the FreezeMintingAllowed status
   * @return bool
   */
  public getFreezeMintingAllowedStatus = async (): Promise<boolean> => {
    return (await this.contract).getFeatureStatus.callAsync(Feature.FreezeMintingAllowed);
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: FeatureRegistrySubscribeAsyncParams = async <ArgsType extends FeatureRegistryEventArgs_3_0_0>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, FeatureRegistryEvents_3_0_0);
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
  public getLogsAsync: GetFeatureRegistryLogsAsyncParams = async <ArgsType extends FeatureRegistryEventArgs_3_0_0>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, FeatureRegistryEvents_3_0_0);
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
