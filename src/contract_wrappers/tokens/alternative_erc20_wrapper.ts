import {
  ERC20DetailedContract_3_0_0,
  ERC20DetailedEventArgs_3_0_0,
  ERC20DetailedEvents_3_0_0,
  LogWithDecodedArgs,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import { bytes32ToString } from '../../utils/convert';
import ERC20TokenWrapper from './erc20_wrapper';
import { GetLogs, GetLogsAsyncParams, Subscribe, SubscribeAsyncParams, ContractVersion } from '../../types';
import assert from '../../utils/assert';
/**
 * This class includes the functionality related to interacting with the AlternativeERC20 contract.
 */
export default class AlternativeERC20Wrapper extends ERC20TokenWrapper {
  public contract: Promise<ERC20DetailedContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate AlternativeERC20Wrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<ERC20DetailedContract_3_0_0>) {
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

  public subscribeAsync: Subscribe = async <ArgsType extends ERC20DetailedEventArgs_3_0_0>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ERC20DetailedEvents_3_0_0);
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

  public getLogsAsync: GetLogs = async <ArgsType extends ERC20DetailedEventArgs_3_0_0>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ERC20DetailedEvents_3_0_0);
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
