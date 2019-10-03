import {
  LogWithDecodedArgs,
  ModuleFactoryContract_3_0_0,
  ModuleFactoryEventArgs_3_0_0,
  ModuleFactoryEvents_3_0_0,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import { GetLogsAsyncParams, SubscribeAsyncParams, ContractVersion } from '../../../types';
import ModuleFactoryCommon, { ModuleFactorySubscribeAsyncParams, ModuleFactoryGetLogsAsyncParams } from './common';

/**
 * This class includes the functionality related to interacting with the ModuleFactory contract.
 */
export class ModuleFactory_3_0_0 extends ModuleFactoryCommon {
  public contract: Promise<ModuleFactoryContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate ModuleFactoryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<ModuleFactoryContract_3_0_0>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: ModuleFactorySubscribeAsyncParams = async <ArgsType extends ModuleFactoryEventArgs_3_0_0>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ModuleFactoryEvents_3_0_0);
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
  public getLogsAsync: ModuleFactoryGetLogsAsyncParams = async <ArgsType extends ModuleFactoryEventArgs_3_0_0>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ModuleFactoryEvents_3_0_0);
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

export function isModuleFactory_3_0_0(wrapper: ModuleFactoryCommon): wrapper is ModuleFactory_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
