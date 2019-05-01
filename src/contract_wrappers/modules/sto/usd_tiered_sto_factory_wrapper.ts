import {
  USDTieredSTOFactoryContract,
  USDTieredSTOFactoryEvents,
  USDTieredSTOFactoryEventArgs,
  USDTieredSTOFactoryOwnershipRenouncedEventArgs,
  USDTieredSTOFactoryOwnershipTransferredEventArgs,
  USDTieredSTOFactoryChangeFactorySetupFeeEventArgs,
  USDTieredSTOFactoryChangeFactoryUsageFeeEventArgs,
  USDTieredSTOFactoryChangeFactorySubscriptionFeeEventArgs,
  USDTieredSTOFactoryGenerateModuleFromFactoryEventArgs,
  USDTieredSTOFactoryChangeSTVersionBoundEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { USDTieredSTOFactory } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { schemas } from '@0x/json-schemas';
import ContractWrapper from '../../contract_wrapper';
import { GetLogsAsyncParams, SubscribeAsyncParams, EventCallback, Subscribe, GetLogs } from '../../../types';
import assert from '../../../utils/assert';

interface OwnershipRenouncedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOFactoryEvents.OwnershipRenounced;
  callback: EventCallback<USDTieredSTOFactoryOwnershipRenouncedEventArgs>;
}

interface GetOwnershipRenouncedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOFactoryEvents.OwnershipRenounced;
}

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOFactoryEvents.OwnershipTransferred;
  callback: EventCallback<USDTieredSTOFactoryOwnershipTransferredEventArgs>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOFactoryEvents.OwnershipTransferred;
}

interface ChangeFactorySetupFeeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeFactorySetupFee;
  callback: EventCallback<USDTieredSTOFactoryChangeFactorySetupFeeEventArgs>;
}

interface GetChangeFactorySetupFeeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeFactorySetupFee;
}

interface ChangeFactoryUsageFeeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeFactoryUsageFee;
  callback: EventCallback<USDTieredSTOFactoryChangeFactoryUsageFeeEventArgs>;
}

interface GetChangeFactoryUsageFeeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeFactoryUsageFee;
}

interface ChangeFactorySubscriptionFeeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeFactorySubscriptionFee;
  callback: EventCallback<USDTieredSTOFactoryChangeFactorySubscriptionFeeEventArgs>;
}

interface GetChangeFactorySubscriptionFeeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeFactorySubscriptionFee;
}

interface GenerateModuleFromFactorySubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOFactoryEvents.GenerateModuleFromFactory;
  callback: EventCallback<USDTieredSTOFactoryGenerateModuleFromFactoryEventArgs>;
}

interface GetGenerateModuleFromFactoryLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOFactoryEvents.GenerateModuleFromFactory;
}

interface ChangeSTVersionBoundSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeSTVersionBound;
  callback: EventCallback<USDTieredSTOFactoryChangeSTVersionBoundEventArgs>;
}

interface GetChangeSTVersionBoundLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeSTVersionBound;
}

interface USDTieredSTOFactorySubscribeAsyncParams extends Subscribe {
  (params: OwnershipRenouncedSubscribeAsyncParams): Promise<string>;
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
  (params: ChangeFactorySetupFeeSubscribeAsyncParams): Promise<string>;
  (params: ChangeFactoryUsageFeeSubscribeAsyncParams): Promise<string>;
  (params: ChangeFactorySubscriptionFeeSubscribeAsyncParams): Promise<string>;
  (params: GenerateModuleFromFactorySubscribeAsyncParams): Promise<string>;
  (params: ChangeSTVersionBoundSubscribeAsyncParams): Promise<string>;
}

interface GetUSDTieredSTOFactoryLogsAsyncParams extends GetLogs {
  (params: GetOwnershipRenouncedLogsAsyncParams): Promise<
    LogWithDecodedArgs<USDTieredSTOFactoryOwnershipRenouncedEventArgs>[]
  >;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<USDTieredSTOFactoryOwnershipTransferredEventArgs>[]
  >;
  (params: GetChangeFactorySetupFeeLogsAsyncParams): Promise<
    LogWithDecodedArgs<USDTieredSTOFactoryChangeFactorySetupFeeEventArgs>[]
  >;
  (params: GetChangeFactoryUsageFeeLogsAsyncParams): Promise<
    LogWithDecodedArgs<USDTieredSTOFactoryChangeFactoryUsageFeeEventArgs>[]
  >;
  (params: GetChangeFactorySubscriptionFeeLogsAsyncParams): Promise<
    LogWithDecodedArgs<USDTieredSTOFactoryChangeFactorySubscriptionFeeEventArgs>[]
  >;
  (params: GetGenerateModuleFromFactoryLogsAsyncParams): Promise<
    LogWithDecodedArgs<USDTieredSTOFactoryGenerateModuleFromFactoryEventArgs>[]
  >;
  (params: GetChangeSTVersionBoundLogsAsyncParams): Promise<
    LogWithDecodedArgs<USDTieredSTOFactoryChangeSTVersionBoundEventArgs>[]
  >;
}

/**
 * This class includes the functionality related to interacting with the USDTieredSTOFactory contract.
 */
export default class USDTieredSTOFactoryWrapper extends ContractWrapper {
  public abi: ContractAbi = USDTieredSTOFactory.abi;

  protected contract: Promise<USDTieredSTOFactoryContract>;

  /**
   * Instantiate USDTieredSTOFactoryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<USDTieredSTOFactoryContract>) {
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
  public subscribeAsync: USDTieredSTOFactorySubscribeAsyncParams = async <
    ArgsType extends USDTieredSTOFactoryEventArgs
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, USDTieredSTOFactoryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      USDTieredSTOFactory.abi,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetUSDTieredSTOFactoryLogsAsyncParams = async <ArgsType extends USDTieredSTOFactoryEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, USDTieredSTOFactoryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      USDTieredSTOFactory.abi,
    );
    return logs;
  };
}
