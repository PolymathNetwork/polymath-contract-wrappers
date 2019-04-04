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
import { PolymathRegistryWrapper } from '../../registries/polymath_registry_wrapper';
import { USDTieredSTOFactory } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import * as _ from 'lodash';
import { ContractWrapper } from '../../contract_wrapper';
import { BigNumber } from '@0x/utils';
import {
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
  ISubscribe,
  IGetLogs
} from '../../../types';
import { assert } from '../../../utils/assert';
import { schemas } from '@0x/json-schemas';

interface IOwnershipRenouncedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOFactoryEvents.OwnershipRenounced,
  callback: EventCallback<USDTieredSTOFactoryOwnershipRenouncedEventArgs>,
}

interface IGetOwnershipRenouncedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOFactoryEvents.OwnershipRenounced,
}

interface IOwnershipTransferredSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOFactoryEvents.OwnershipTransferred,
  callback: EventCallback<USDTieredSTOFactoryOwnershipTransferredEventArgs>,
}

interface IGetOwnershipTransferredLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOFactoryEvents.OwnershipTransferred,
}

interface IChangeFactorySetupFeeSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeFactorySetupFee,
  callback: EventCallback<USDTieredSTOFactoryChangeFactorySetupFeeEventArgs>,
}

interface IGetChangeFactorySetupFeeLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeFactorySetupFee,
}

interface IChangeFactoryUsageFeeSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeFactoryUsageFee,
  callback: EventCallback<USDTieredSTOFactoryChangeFactoryUsageFeeEventArgs>,
}

interface IGetChangeFactoryUsageFeeLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeFactoryUsageFee,
}

interface IChangeFactorySubscriptionFeeSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeFactorySubscriptionFee,
  callback: EventCallback<USDTieredSTOFactoryChangeFactorySubscriptionFeeEventArgs>,
}

interface IGetChangeFactorySubscriptionFeeLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeFactorySubscriptionFee,
}

interface IGenerateModuleFromFactorySubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOFactoryEvents.GenerateModuleFromFactory,
  callback: EventCallback<USDTieredSTOFactoryGenerateModuleFromFactoryEventArgs>,
}

interface IGetGenerateModuleFromFactoryLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOFactoryEvents.GenerateModuleFromFactory,
}

interface IChangeSTVersionBoundSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeSTVersionBound,
  callback: EventCallback<USDTieredSTOFactoryChangeSTVersionBoundEventArgs>,
}

interface IGetChangeSTVersionBoundLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOFactoryEvents.ChangeSTVersionBound,
}

interface IUSDTieredSTOFactorySubscribeAsyncParams extends ISubscribe {
  (params: IOwnershipRenouncedSubscribeAsyncParams): Promise<string>,
  (params: IOwnershipTransferredSubscribeAsyncParams): Promise<string>,
  (params: IChangeFactorySetupFeeSubscribeAsyncParams): Promise<string>,
  (params: IChangeFactoryUsageFeeSubscribeAsyncParams): Promise<string>,
  (params: IChangeFactorySubscriptionFeeSubscribeAsyncParams): Promise<string>,
  (params: IGenerateModuleFromFactorySubscribeAsyncParams): Promise<string>,
  (params: IChangeSTVersionBoundSubscribeAsyncParams): Promise<string>,
}

interface IGetUSDTieredSTOFactoryLogsAsyncParams extends IGetLogs {
  (params: IGetOwnershipRenouncedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOFactoryOwnershipRenouncedEventArgs>>>,
  (params: IGetOwnershipTransferredLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOFactoryOwnershipTransferredEventArgs>>>,
  (params: IGetChangeFactorySetupFeeLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOFactoryChangeFactorySetupFeeEventArgs>>>,
  (params: IGetChangeFactoryUsageFeeLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOFactoryChangeFactoryUsageFeeEventArgs>>>,
  (params: IGetChangeFactorySubscriptionFeeLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOFactoryChangeFactorySubscriptionFeeEventArgs>>>,
  (params: IGetGenerateModuleFromFactoryLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOFactoryGenerateModuleFromFactoryEventArgs>>>,
  (params: IGetChangeSTVersionBoundLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOFactoryChangeSTVersionBoundEventArgs>>>,
}

/**
 * This class includes the functionality related to interacting with the USDTieredSTOFactory contract.
 */
export class USDTieredSTOFactoryWrapper extends ContractWrapper {
  public abi: ContractAbi = USDTieredSTOFactory.abi;
  protected _contract: Promise<USDTieredSTOFactoryContract>;
  private _polymathRegistry: PolymathRegistryWrapper;
  /**
   * Instantiate USDTieredSTOFactoryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this._polymathRegistry = polymathRegistry;
    this._contract = this._getUSDTieredSTOFactoryContract();
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
  public subscribeAsync: IUSDTieredSTOFactorySubscribeAsyncParams = async <ArgsType extends USDTieredSTOFactoryEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, USDTieredSTOFactoryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        USDTieredSTOFactory.abi,
        params.callback,
        !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetUSDTieredSTOFactoryLogsAsyncParams = async <ArgsType extends USDTieredSTOFactoryEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, USDTieredSTOFactoryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        USDTieredSTOFactory.abi,
    );
    return logs;
  }

  private async _getUSDTieredSTOFactoryContract(): Promise<USDTieredSTOFactoryContract> {
    return new USDTieredSTOFactoryContract(
      this.abi,
      await this._polymathRegistry.getAddress({
        contractName: 'USDTieredSTOFactory',
      }),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
