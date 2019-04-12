import {
  CappedSTOFactoryContract,
  CappedSTOFactoryEventArgs,
  CappedSTOFactoryEvents,
  CappedSTOFactoryOwnershipRenouncedEventArgs,
  CappedSTOFactoryOwnershipTransferredEventArgs,
  CappedSTOFactoryChangeFactorySetupFeeEventArgs,
  CappedSTOFactoryChangeFactoryUsageFeeEventArgs,
  CappedSTOFactoryChangeFactorySubscriptionFeeEventArgs,
  CappedSTOFactoryGenerateModuleFromFactoryEventArgs,
  CappedSTOFactoryChangeSTVersionBoundEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { CappedSTOFactory } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import * as _ from 'lodash';
import { BigNumber } from '@0x/utils';
import { schemas } from '@0x/json-schemas';
import ContractWrapper from '../../contract_wrapper';
import { GetLogsAsyncParams, SubscribeAsyncParams, EventCallback, GetLogs, Subscribe } from '../../../types';
import assert from '../../../utils/assert';

interface OwnershipRenouncedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOFactoryEvents.OwnershipRenounced;
  callback: EventCallback<CappedSTOFactoryOwnershipRenouncedEventArgs>;
}

interface GetOwnershipRenouncedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOFactoryEvents.OwnershipRenounced;
}

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOFactoryEvents.OwnershipTransferred;
  callback: EventCallback<CappedSTOFactoryOwnershipTransferredEventArgs>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOFactoryEvents.OwnershipTransferred;
}

interface ChangeFactorySetupFeeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeFactorySetupFee;
  callback: EventCallback<CappedSTOFactoryChangeFactorySetupFeeEventArgs>;
}

interface GetChangeFactorySetupFeeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeFactorySetupFee;
}

interface ChangeFactoryUsageFeeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeFactoryUsageFee;
  callback: EventCallback<CappedSTOFactoryChangeFactoryUsageFeeEventArgs>;
}

interface GetChangeFactoryUsageFeeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeFactoryUsageFee;
}

interface ChangeFactorySubscriptionFeeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeFactorySubscriptionFee;
  callback: EventCallback<CappedSTOFactoryChangeFactorySubscriptionFeeEventArgs>;
}

interface GetChangeFactorySubscriptionFeeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeFactorySubscriptionFee;
}

interface GenerateModuleFromFactorySubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOFactoryEvents.GenerateModuleFromFactory;
  callback: EventCallback<CappedSTOFactoryGenerateModuleFromFactoryEventArgs>;
}

interface GetGenerateModuleFromFactoryLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOFactoryEvents.GenerateModuleFromFactory;
}

interface ChangeSTVersionBoundSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeSTVersionBound;
  callback: EventCallback<CappedSTOFactoryChangeSTVersionBoundEventArgs>;
}

interface GetChangeSTVersionBoundLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeSTVersionBound;
}

interface CappedSTOFactorySubscribeAsyncParams extends Subscribe {
  (params: OwnershipRenouncedSubscribeAsyncParams): Promise<string>;
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
  (params: ChangeFactorySetupFeeSubscribeAsyncParams): Promise<string>;
  (params: ChangeFactoryUsageFeeSubscribeAsyncParams): Promise<string>;
  (params: ChangeFactorySubscriptionFeeSubscribeAsyncParams): Promise<string>;
  (params: GenerateModuleFromFactorySubscribeAsyncParams): Promise<string>;
  (params: ChangeSTVersionBoundSubscribeAsyncParams): Promise<string>;
}

interface GetCappedSTOFactoryLogsAsyncParams extends GetLogs {
  (params: GetOwnershipRenouncedLogsAsyncParams): Promise<
    LogWithDecodedArgs<CappedSTOFactoryOwnershipRenouncedEventArgs>[]
  >;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<CappedSTOFactoryOwnershipTransferredEventArgs>[]
  >;
  (params: GetChangeFactorySetupFeeLogsAsyncParams): Promise<
    LogWithDecodedArgs<CappedSTOFactoryChangeFactorySetupFeeEventArgs>[]
  >;
  (params: GetChangeFactoryUsageFeeLogsAsyncParams): Promise<
    LogWithDecodedArgs<CappedSTOFactoryChangeFactoryUsageFeeEventArgs>[]
  >;
  (params: GetChangeFactorySubscriptionFeeLogsAsyncParams): Promise<
    LogWithDecodedArgs<CappedSTOFactoryChangeFactorySubscriptionFeeEventArgs>[]
  >;
  (params: GetGenerateModuleFromFactoryLogsAsyncParams): Promise<
    LogWithDecodedArgs<CappedSTOFactoryGenerateModuleFromFactoryEventArgs>[]
  >;
  (params: GetChangeSTVersionBoundLogsAsyncParams): Promise<
    LogWithDecodedArgs<CappedSTOFactoryChangeSTVersionBoundEventArgs>[]
  >;
}

/**
 * This class includes the functionality related to interacting with the CappedSTOFactory contract.
 */
export default class CappedSTOFactoryWrapper extends ContractWrapper {
  public abi: ContractAbi = CappedSTOFactory.abi;

  protected contract: Promise<CappedSTOFactoryContract>;

  /**
   * Instantiate CappedSTOFactoryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<CappedSTOFactoryContract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Get the setup cost of the module
   */
  public getSetupCost = async (): Promise<BigNumber> => {
    return (await this.contract).getSetupCost.callAsync();
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: CappedSTOFactorySubscribeAsyncParams = async <ArgsType extends CappedSTOFactoryEventArgs>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOFactoryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      CappedSTOFactory.abi,
      params.callback,
      !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetCappedSTOFactoryLogsAsyncParams = async <ArgsType extends CappedSTOFactoryEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOFactoryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      CappedSTOFactory.abi,
    );
    return logs;
  };
}
