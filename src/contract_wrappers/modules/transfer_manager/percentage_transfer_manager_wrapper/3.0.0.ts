import {
  PercentageTransferManagerEvents_3_0_0,
  LogWithDecodedArgs,
  PercentageTransferManagerContract_3_0_0,
  Web3Wrapper,
  PercentageTransferManagerEventArgs_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import { ContractVersion, Constructor, SubscribeAsyncParams, GetLogsAsyncParams } from '../../../../types';
import PercentageTransferManagerCommon, {
  PercentageTransferManagerSubscribeAsyncParams,
  GetPercentageTransferManagerLogsAsyncParams,
} from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import assert from '../../../../utils/assert';

const PercentageTransferManagerBase_3_0_0 = WithModule_3_0_0(
  (PercentageTransferManagerCommon as unknown) as Constructor<PercentageTransferManagerCommon>,
);

export class PercentageTransferManager_3_0_0 extends PercentageTransferManagerBase_3_0_0 {
  public contract: Promise<PercentageTransferManagerContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate PercentageTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<PercentageTransferManagerContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: PercentageTransferManagerSubscribeAsyncParams = async <
    ArgsType extends PercentageTransferManagerEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PercentageTransferManagerEvents_3_0_0);
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
  public getLogsAsync: GetPercentageTransferManagerLogsAsyncParams = async <
    ArgsType extends PercentageTransferManagerEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PercentageTransferManagerEvents_3_0_0);
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

export function isPercentageTransferManager_3_0_0(
  wrapper: PercentageTransferManagerCommon,
): wrapper is PercentageTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
