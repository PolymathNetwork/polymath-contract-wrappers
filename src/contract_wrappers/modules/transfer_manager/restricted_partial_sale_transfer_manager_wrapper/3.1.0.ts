import {
  RestrictedPartialSaleTMContract_3_1_0,
  RestrictedPartialSaleTMEventArgs_3_1_0,
  RestrictedPartialSaleTMEvents_3_1_0,
  RestrictedPartialSaleTMChangedExemptWalletListEventArgs_3_1_0,
  RestrictedPartialSaleTMPauseEventArgs_3_1_0,
  RestrictedPartialSaleTMUnpauseEventArgs_3_1_0,
  LogWithDecodedArgs,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import {
  ContractVersion,
  SubscribeAsyncParams,
  GetLogsAsyncParams,
  Subscribe,
  GetLogs,
  EventCallback,
} from '../../../../types';
import ContractFactory from '../../../../factories/contractFactory';

import RestrictedPartialSaleTransferManagerCommon from './common';
import assert from '../../../../utils/assert';

interface ChangedExemptWalletListSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: RestrictedPartialSaleTMEvents_3_1_0.ChangedExemptWalletList;
  callback: EventCallback<RestrictedPartialSaleTMChangedExemptWalletListEventArgs_3_1_0>;
}

interface GetChangedExemptWalletListLogsAsyncParams extends GetLogsAsyncParams {
  eventName: RestrictedPartialSaleTMEvents_3_1_0.ChangedExemptWalletList;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: RestrictedPartialSaleTMEvents_3_1_0.Pause;
  callback: EventCallback<RestrictedPartialSaleTMPauseEventArgs_3_1_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: RestrictedPartialSaleTMEvents_3_1_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: RestrictedPartialSaleTMEvents_3_1_0.Unpause;
  callback: EventCallback<RestrictedPartialSaleTMUnpauseEventArgs_3_1_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: RestrictedPartialSaleTMEvents_3_1_0.Unpause;
}

interface RestrictedPartialSaleTransferManagerSubscribeAsyncParams extends Subscribe {
  (params: ChangedExemptWalletListSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetRestrictedPartialSaleTransferManagerLogsAsyncParams extends GetLogs {
  (params: GetChangedExemptWalletListLogsAsyncParams): Promise<
    LogWithDecodedArgs<RestrictedPartialSaleTMChangedExemptWalletListEventArgs_3_1_0>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<RestrictedPartialSaleTMPauseEventArgs_3_1_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<RestrictedPartialSaleTMUnpauseEventArgs_3_1_0>[]>;
}

export class RestrictedPartialSaleTransferManager_3_1_0 extends RestrictedPartialSaleTransferManagerCommon {
  public contract: Promise<RestrictedPartialSaleTMContract_3_1_0>;

  public contractVersion = ContractVersion.V3_1_0;

  /**
   * Instantiate RestrictedPartialSaleTransferManager_3_1_0
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract Contract
   * @param contractFactory Contract factory address
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<RestrictedPartialSaleTMContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: RestrictedPartialSaleTransferManagerSubscribeAsyncParams = async <
    ArgsType extends RestrictedPartialSaleTMEventArgs_3_1_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, RestrictedPartialSaleTMEvents_3_1_0);
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
  public getLogsAsync: GetRestrictedPartialSaleTransferManagerLogsAsyncParams = async <
    ArgsType extends RestrictedPartialSaleTMEventArgs_3_1_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, RestrictedPartialSaleTMEvents_3_1_0);
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

export function isRestrictedPartialSaleTransferManager_3_1_0(
  wrapper: RestrictedPartialSaleTransferManagerCommon,
): wrapper is RestrictedPartialSaleTransferManager_3_1_0 {
  return wrapper.contractVersion === ContractVersion.V3_1_0;
}
