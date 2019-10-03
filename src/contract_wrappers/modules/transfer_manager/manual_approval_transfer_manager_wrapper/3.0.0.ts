import {
  ManualApprovalTransferManagerContract_3_0_0,
  ManualApprovalTransferManagerEvents_3_0_0,
  LogWithDecodedArgs,
  ManualApprovalTransferManagerEventArgs_3_0_0,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import ManualApprovalTransferManagerCommon, {
  ManualApprovalTransferManagerSubscribeAsyncParams,
  GetManualApprovalTransferManagerLogsAsyncParams,
} from './common';
import { ContractVersion, Constructor, SubscribeAsyncParams, GetLogsAsyncParams } from '../../../../types';
import { WithModule_3_0_0 } from '../../module_wrapper';
import assert from '../../../../utils/assert';
import ContractFactory from '../../../../factories/contractFactory';

const ManualApprovalTransferManagerBase_3_0_0 = WithModule_3_0_0(
  (ManualApprovalTransferManagerCommon as unknown) as Constructor<ManualApprovalTransferManagerCommon>,
);

export class ManualApprovalTransferManager_3_0_0 extends ManualApprovalTransferManagerBase_3_0_0 {
  public contract: Promise<ManualApprovalTransferManagerContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate ManualApprovalTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<ManualApprovalTransferManagerContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: ManualApprovalTransferManagerSubscribeAsyncParams = async <
    ArgsType extends ManualApprovalTransferManagerEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ManualApprovalTransferManagerEvents_3_0_0);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContract_3_0_0Address = (await this.contract).address.toLowerCase();
    const subscriptionToken = await this.subscribeInternal<ArgsType>(
      normalizedContract_3_0_0Address,
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
  public getLogsAsync: GetManualApprovalTransferManagerLogsAsyncParams = async <
    ArgsType extends ManualApprovalTransferManagerEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ManualApprovalTransferManagerEvents_3_0_0);
    const normalizedContract_3_0_0Address = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContract_3_0_0Address,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
    );
    return logs;
  };
}

export function isManualApprovalTransferManager_3_0_0(
  wrapper: ManualApprovalTransferManagerCommon,
): wrapper is ManualApprovalTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
