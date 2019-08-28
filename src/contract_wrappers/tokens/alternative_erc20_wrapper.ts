import {
  ERC20DetailedContract,
  ERC20DetailedEventArgs,
  ERC20DetailedEvents,
  LogWithDecodedArgs,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import { bytes32ToString } from '../../utils/convert';
import ERC20TokenWrapper from './erc20_wrapper';
import { GetLogs, GetLogsAsyncParams, Subscribe, SubscribeAsyncParams } from '../../types';
import assert from '../../utils/assert';
/**
 * This class includes the functionality related to interacting with the AlternativeERC20 contract.
 */
export default class AlternativeERC20Wrapper extends ERC20TokenWrapper {
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

  /**
   * Returns the token name
   * @return name
   */
  public name = async (): Promise<string> => {
    const name = (await this.contract).name.callAsync();
    return bytes32ToString(await name);
  };

  /**
   * Returns the token symbol
   * @return symbol
   */
  public symbol = async (): Promise<string> => {
    const symbol = (await this.contract).symbol.callAsync();
    return bytes32ToString(await symbol);
  };

  public async isValidContract(): Promise<boolean> {
    try {
      const contract = await this.contract;
      const totalSupply = await contract.totalSupply.callAsync();
      const symbol = await contract.symbol.callAsync();
      const name = await contract.name.callAsync();
      if (bytes32ToString(symbol) === '' || bytes32ToString(name) === '' || totalSupply.isZero()) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
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
