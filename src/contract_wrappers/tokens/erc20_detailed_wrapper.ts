import {
  ERC20DetailedContract,
  ERC20DetailedEventArgs,
  ERC20DetailedEvents,
  LogWithDecodedArgs,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import ERC20TokenWrapper from './erc20_wrapper';
import { GetLogs, GetLogsAsyncParams, Subscribe, SubscribeAsyncParams } from '../../types';

import assert from '../../utils/assert';

/**
 * This class includes the functionality related to interacting with the AlternativeERC20 contract.
 */
export default class ERC20DetailedWrapper extends ERC20TokenWrapper {
  protected contract: Promise<ERC20DetailedContract>;

  /**
   * Instantiate AlternativeERC20Wrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<ERC20DetailedContract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  public subscribeAsync: Subscribe = async <ArgsType extends ERC20DetailedEventArgs>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ERC20DetailedEvents);
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

  public getLogsAsync: GetLogs = async <ArgsType extends ERC20DetailedEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ERC20DetailedEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
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
