import { CappedSTOFactoryContract, CappedSTOFactoryEventArgs, CappedSTOFactoryEvents } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { CappedSTOFactory } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import { BigNumber } from '@0x/utils';
import {
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
} from '../types';
import { assert } from '../utils/assert';
import { schemas } from '@0x/json-schemas';

/**
 * This class includes the functionality related to interacting with the CappedSTOFactory contract.
 */
export class CappedSTOFactoryWrapper extends ContractWrapper {
  public abi: ContractAbi = CappedSTOFactory.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private cappedSTOFactoryContract: Promise<CappedSTOFactoryContract>;
  /**
   * Instantiate CappedSTOFactoryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this.polymathRegistry = polymathRegistry;
    this.cappedSTOFactoryContract = this._getCappedSTOFactoryContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.cappedSTOFactoryContract).address;
  }

  /**
   * Get the setup cost of the module
   */
  public getSetupCost = async (): Promise<BigNumber> => {
    return await (await this.cappedSTOFactoryContract).getSetupCost.callAsync();
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync = async <ArgsType extends CappedSTOFactoryEventArgs>(
    params: ISubscribeAsyncParams<CappedSTOFactoryEvents, ArgsType>
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOFactoryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.cappedSTOFactoryContract).address.toLowerCase();
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
  public getLogsAsync = async <ArgsType extends CappedSTOFactoryEventArgs>(
    params: IGetLogsAsyncParams<CappedSTOFactoryEvents>
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOFactoryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.cappedSTOFactoryContract).address.toLowerCase();
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
      await this.polymathRegistry.getAddress({
        contractName: 'CappedSTOFactory',
      }),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
