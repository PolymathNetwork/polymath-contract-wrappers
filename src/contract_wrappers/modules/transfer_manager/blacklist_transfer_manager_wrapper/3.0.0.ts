import {
  BlacklistTransferManagerEvents_3_0_0,
  BlacklistTransferManagerEventArgs_3_0_0,
  BlacklistTransferManagerContract_3_0_0,
  Web3Wrapper,
  LogWithDecodedArgs,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import { ContractVersion, Constructor, SubscribeAsyncParams, GetLogsAsyncParams } from '../../../../types';

import BlacklistTransferManagerCommon, {
  GetBlacklistTransferManagerLogsAsyncParams,
  BlacklistTransferManagerSubscribeAsyncParams,
} from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';
import assert from '../../../../utils/assert';
import ContractFactory from '../../../../factories/contractFactory';

const BlacklistTransferManagerBase_3_0_0 = WithModule_3_0_0((BlacklistTransferManagerCommon as unknown) as Constructor<
  BlacklistTransferManagerCommon
>);

export class BlacklistTransferManager_3_0_0 extends BlacklistTransferManagerBase_3_0_0 {
  public contract: Promise<BlacklistTransferManagerContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate BlacklistTransferManager
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<BlacklistTransferManagerContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: BlacklistTransferManagerSubscribeAsyncParams = async <
    ArgsType extends BlacklistTransferManagerEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, BlacklistTransferManagerEvents_3_0_0);
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
  public getLogsAsync: GetBlacklistTransferManagerLogsAsyncParams = async <
    ArgsType extends BlacklistTransferManagerEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, BlacklistTransferManagerEvents_3_0_0);
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

export function isBlacklistTransferManager_3_0_0(
  wrapper: BlacklistTransferManagerCommon,
): wrapper is BlacklistTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
