import {
  ISecurityTokenContract_3_0_0,
  ISecurityTokenEventArgs_3_0_0,
  SecurityTokenEvents_3_0_0,
  Web3Wrapper,
  LogWithDecodedArgs,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import SecurityTokenCommon, { SecurityTokenSubscribeAsyncParams, GetSecurityTokenLogsAsyncParams } from './common';
import ContractFactory from '../../../factories/contractFactory';
import { GetLogsAsyncParams, SubscribeAsyncParams, ContractVersion } from '../../../types';

/**
 * This class includes the functionality related to interacting with the SecurityToken contract.
 */
export class SecurityToken_3_0_0 extends SecurityTokenCommon {
  public contract: Promise<ISecurityTokenContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate SecurityTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<ISecurityTokenContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: SecurityTokenSubscribeAsyncParams = async <ArgsType extends ISecurityTokenEventArgs_3_0_0>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenEvents_3_0_0);
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
  public getLogsAsync: GetSecurityTokenLogsAsyncParams = async <ArgsType extends ISecurityTokenEventArgs_3_0_0>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenEvents_3_0_0);
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

export function isSecurityToken_3_0_0(wrapper: SecurityTokenCommon): wrapper is SecurityToken_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
