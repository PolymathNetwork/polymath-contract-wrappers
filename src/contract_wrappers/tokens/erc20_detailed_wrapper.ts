import {
  ERC20DetailedContract,
  ERC20DetailedEventArgs,
  ERC20DetailedEvents,
  ERC20Detailed,
  LogWithDecodedArgs,
  Web3Wrapper,
  ContractAbi,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import ERC20TokenWrapper from './erc20_wrapper';
import { GetLogs, GetLogsAsyncParams, Subscribe, SubscribeAsyncParams } from '../../types';

import assert from '../../utils/assert';

import _ = require('lodash');

/**
 * This class includes the functionality related to interacting with the AlternativeERC20 contract.
 */
export default class ERC20DetailedWrapper extends ERC20TokenWrapper {
  public abi: ContractAbi = ERC20Detailed.abi;

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
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      ERC20Detailed.abi,
      params.callback,
      !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  };

  public getLogsAsync: GetLogs = async <ArgsType extends ERC20DetailedEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ERC20DetailedEvents);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      ERC20Detailed.abi,
    );
    return logs;
  };
}
