import {
  CountTransferManagerEvents_3_0_0,
  LogWithDecodedArgs,
  CountTransferManagerEventArgs_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import { ContractVersion, SubscribeAsyncParams, GetLogsAsyncParams, Constructor } from '../../../../types';
import CountTransferManagerCommon, {
  CountTransferManagerSubscribeAsyncParams,
  GetCountTransferManagerLogsAsyncParams,
} from './common';
import assert from '../../../../utils/assert';
import { WithModule_3_0_0 } from '../../module_wrapper';

const CountTransferManagerBase_3_0_0 = WithModule_3_0_0((CountTransferManagerCommon as unknown) as Constructor<
  CountTransferManagerCommon
>);

export class CountTransferManager_3_0_0 extends CountTransferManagerBase_3_0_0 {
  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: CountTransferManagerSubscribeAsyncParams = async <
    ArgsType extends CountTransferManagerEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CountTransferManagerEvents_3_0_0);
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
  public getLogsAsync: GetCountTransferManagerLogsAsyncParams = async <
    ArgsType extends CountTransferManagerEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CountTransferManagerEvents_3_0_0);
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

export function isCountTransferManager_3_0_0(
  wrapper: CountTransferManagerCommon,
): wrapper is CountTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
