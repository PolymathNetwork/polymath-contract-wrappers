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
import { PolymathRegistryWrapper } from '../../registries/polymath_registry_wrapper';
import { CappedSTOFactory } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import * as _ from 'lodash';
import { ContractWrapper } from '../../contract_wrapper';
import { BigNumber } from '@0x/utils';
import {
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
} from '../../../types';
import { assert } from '../../../utils/assert';
import { schemas } from '@0x/json-schemas';

interface IOwnershipRenouncedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: CappedSTOFactoryEvents.OwnershipRenounced,
  callback: EventCallback<CappedSTOFactoryOwnershipRenouncedEventArgs>,
}

interface IGetOwnershipRenouncedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: CappedSTOFactoryEvents.OwnershipRenounced,
}

interface IOwnershipTransferredSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: CappedSTOFactoryEvents.OwnershipTransferred,
  callback: EventCallback<CappedSTOFactoryOwnershipTransferredEventArgs>,
}

interface IGetOwnershipTransferredLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: CappedSTOFactoryEvents.OwnershipTransferred,
}

interface IChangeFactorySetupFeeSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeFactorySetupFee,
  callback: EventCallback<CappedSTOFactoryChangeFactorySetupFeeEventArgs>,
}

interface IGetChangeFactorySetupFeeLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeFactorySetupFee,
}

interface IChangeFactoryUsageFeeSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeFactoryUsageFee,
  callback: EventCallback<CappedSTOFactoryChangeFactoryUsageFeeEventArgs>,
}

interface IGetChangeFactoryUsageFeeLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeFactoryUsageFee,
}

interface IChangeFactorySubscriptionFeeSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeFactorySubscriptionFee,
  callback: EventCallback<CappedSTOFactoryChangeFactorySubscriptionFeeEventArgs>,
}

interface IGetChangeFactorySubscriptionFeeLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeFactorySubscriptionFee,
}

interface IGenerateModuleFromFactorySubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: CappedSTOFactoryEvents.GenerateModuleFromFactory,
  callback: EventCallback<CappedSTOFactoryGenerateModuleFromFactoryEventArgs>,
}

interface IGetGenerateModuleFromFactoryLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: CappedSTOFactoryEvents.GenerateModuleFromFactory,
}

interface IChangeSTVersionBoundSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeSTVersionBound,
  callback: EventCallback<CappedSTOFactoryChangeSTVersionBoundEventArgs>,
}

interface IGetChangeSTVersionBoundLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: CappedSTOFactoryEvents.ChangeSTVersionBound,
}

interface ICappedSTOFactorySubscribeAsyncParams {
  (params: IOwnershipRenouncedSubscribeAsyncParams): Promise<string>,
  (params: IOwnershipTransferredSubscribeAsyncParams): Promise<string>,
  (params: IChangeFactorySetupFeeSubscribeAsyncParams): Promise<string>,
  (params: IChangeFactoryUsageFeeSubscribeAsyncParams): Promise<string>,
  (params: IChangeFactorySubscriptionFeeSubscribeAsyncParams): Promise<string>,
  (params: IGenerateModuleFromFactorySubscribeAsyncParams): Promise<string>,
  (params: IChangeSTVersionBoundSubscribeAsyncParams): Promise<string>,
}

interface IGetCappedSTOFactoryLogsAsyncParams {
  (params: IGetOwnershipRenouncedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<CappedSTOFactoryOwnershipRenouncedEventArgs>>>,
  (params: IGetOwnershipTransferredLogsAsyncParams): Promise<Array<LogWithDecodedArgs<CappedSTOFactoryOwnershipTransferredEventArgs>>>,
  (params: IGetChangeFactorySetupFeeLogsAsyncParams): Promise<Array<LogWithDecodedArgs<CappedSTOFactoryChangeFactorySetupFeeEventArgs>>>,
  (params: IGetChangeFactoryUsageFeeLogsAsyncParams): Promise<Array<LogWithDecodedArgs<CappedSTOFactoryChangeFactoryUsageFeeEventArgs>>>,
  (params: IGetChangeFactorySubscriptionFeeLogsAsyncParams): Promise<Array<LogWithDecodedArgs<CappedSTOFactoryChangeFactorySubscriptionFeeEventArgs>>>,
  (params: IGetGenerateModuleFromFactoryLogsAsyncParams): Promise<Array<LogWithDecodedArgs<CappedSTOFactoryGenerateModuleFromFactoryEventArgs>>>,
  (params: IGetChangeSTVersionBoundLogsAsyncParams): Promise<Array<LogWithDecodedArgs<CappedSTOFactoryChangeSTVersionBoundEventArgs>>>,
}

/**
 * This class includes the functionality related to interacting with the CappedSTOFactory contract.
 */
export class CappedSTOFactoryWrapper extends ContractWrapper {
  public abi: ContractAbi = CappedSTOFactory.abi;
  protected _contract: Promise<CappedSTOFactoryContract>;
  private _polymathRegistry: PolymathRegistryWrapper;
  
  /**
   * Instantiate CappedSTOFactoryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this._polymathRegistry = polymathRegistry;
    this._contract = this._getCappedSTOFactoryContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this._contract).address;
  }

  /**
   * Get the setup cost of the module
   */
  public getSetupCost = async (): Promise<BigNumber> => {
    return await (await this._contract).getSetupCost.callAsync();
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: ICappedSTOFactorySubscribeAsyncParams = async <ArgsType extends CappedSTOFactoryEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOFactoryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        CappedSTOFactory.abi,
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
  public getLogsAsync: IGetCappedSTOFactoryLogsAsyncParams = async <ArgsType extends CappedSTOFactoryEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOFactoryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        CappedSTOFactory.abi,
    );
    return logs;
  }

  private async _getCappedSTOFactoryContract(): Promise<CappedSTOFactoryContract> {
    return new CappedSTOFactoryContract(
      this.abi,
      await this._polymathRegistry.getAddress({
        contractName: 'CappedSTOFactory',
      }),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
