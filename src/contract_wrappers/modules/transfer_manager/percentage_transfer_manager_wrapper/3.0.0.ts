import { PercentageTransferManagerEvents_3_0_0, PercentageTransferManagerModifyHolderPercentageEventArgs_3_0_0, PercentageTransferManagerModifyWhitelistEventArgs_3_0_0, PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs_3_0_0, PercentageTransferManagerPauseEventArgs_3_0_0, PercentageTransferManagerUnpauseEventArgs_3_0_0, LogWithDecodedArgs, PercentageTransferManagerContract_3_0_0, Web3Wrapper, PercentageTransferManagerEventArgs_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import { ContractVersion, Constructor, SubscribeAsyncParams, EventCallback, GetLogsAsyncParams, Subscribe, GetLogs } from '../../../../types';
import PercentageTransferManagerCommon from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import assert from '../../../../utils/assert';

interface ModifyHolderPercentageSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.ModifyHolderPercentage;
  callback: EventCallback<PercentageTransferManagerModifyHolderPercentageEventArgs_3_0_0>;
}

interface GetModifyHolderPercentageLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.ModifyHolderPercentage;
}

interface ModifyWhitelistSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.ModifyWhitelist;
  callback: EventCallback<PercentageTransferManagerModifyWhitelistEventArgs_3_0_0>;
}

interface GetModifyWhitelistLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.ModifyWhitelist;
}

interface SetAllowPrimaryIssuanceSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.SetAllowPrimaryIssuance;
  callback: EventCallback<PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs_3_0_0>;
}

interface GetSetAllowPrimaryIssuanceLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.SetAllowPrimaryIssuance;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.Pause;
  callback: EventCallback<PercentageTransferManagerPauseEventArgs_3_0_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.Unpause;
  callback: EventCallback<PercentageTransferManagerUnpauseEventArgs_3_0_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.Unpause;
}

interface PercentageTransferManagerSubscribeAsyncParams extends Subscribe {
  (params: ModifyHolderPercentageSubscribeAsyncParams): Promise<string>;
  (params: ModifyWhitelistSubscribeAsyncParams): Promise<string>;
  (params: SetAllowPrimaryIssuanceSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetPercentageTransferManagerLogsAsyncParams extends GetLogs {
  (params: GetModifyHolderPercentageLogsAsyncParams): Promise<
    LogWithDecodedArgs<PercentageTransferManagerModifyHolderPercentageEventArgs_3_0_0>[]
  >;
  (params: GetModifyWhitelistLogsAsyncParams): Promise<
    LogWithDecodedArgs<PercentageTransferManagerModifyWhitelistEventArgs_3_0_0>[]
  >;
  (params: GetSetAllowPrimaryIssuanceLogsAsyncParams): Promise<
    LogWithDecodedArgs<PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs_3_0_0>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<PercentageTransferManagerPauseEventArgs_3_0_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<PercentageTransferManagerUnpauseEventArgs_3_0_0>[]>;
}

const PercentageTransferManagerBase_3_0_0 = WithModule_3_0_0(PercentageTransferManagerCommon as unknown as Constructor<PercentageTransferManagerCommon>);

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
