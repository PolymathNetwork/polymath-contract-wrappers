import { BlacklistTransferManagerEvents_3_0_0, BlacklistTransferManagerDeleteInvestorFromBlacklistEventArgs_3_0_0, BlacklistTransferManagerAddInvestorToBlacklistEventArgs_3_0_0, BlacklistTransferManagerDeleteBlacklistTypeEventArgs_3_0_0, BlacklistTransferManagerModifyBlacklistTypeEventArgs_3_0_0, BlacklistTransferManagerAddBlacklistTypeEventArgs_3_0_0, BlacklistTransferManagerPauseEventArgs_3_0_0, BlacklistTransferManagerUnpauseEventArgs_3_0_0, LogWithDecodedArgs, BlacklistTransferManagerEventArgs_3_0_0, BlacklistTransferManagerContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import { ContractVersion, Constructor, SubscribeAsyncParams, EventCallback, GetLogsAsyncParams, Subscribe, GetLogs } from '../../../../types';

import BlacklistTransferManagerCommon from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';
import assert from '../../../../utils/assert';
import ContractFactory from '../../../../factories/contractFactory';

interface DeleteInvestorFromBlacklistSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: BlacklistTransferManagerEvents_3_0_0.DeleteInvestorFromBlacklist;
  callback: EventCallback<BlacklistTransferManagerDeleteInvestorFromBlacklistEventArgs_3_0_0>;
}

interface GetDeleteInvestorFromBlacklistLogsAsyncParams extends GetLogsAsyncParams {
  eventName: BlacklistTransferManagerEvents_3_0_0.DeleteInvestorFromBlacklist;
}

interface AddInvestorToBlacklistSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: BlacklistTransferManagerEvents_3_0_0.AddInvestorToBlacklist;
  callback: EventCallback<BlacklistTransferManagerAddInvestorToBlacklistEventArgs_3_0_0>;
}

interface GetAddInvestorToBlacklistLogsAsyncParams extends GetLogsAsyncParams {
  eventName: BlacklistTransferManagerEvents_3_0_0.AddInvestorToBlacklist;
}

interface DeleteBlacklistTypeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: BlacklistTransferManagerEvents_3_0_0.DeleteBlacklistType;
  callback: EventCallback<BlacklistTransferManagerDeleteBlacklistTypeEventArgs_3_0_0>;
}

interface GetDeleteBlacklistTypeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: BlacklistTransferManagerEvents_3_0_0.DeleteBlacklistType;
}

interface ModifyBlacklistTypeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: BlacklistTransferManagerEvents_3_0_0.ModifyBlacklistType;
  callback: EventCallback<BlacklistTransferManagerModifyBlacklistTypeEventArgs_3_0_0>;
}

interface GetModifyBlacklistTypeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: BlacklistTransferManagerEvents_3_0_0.ModifyBlacklistType;
}

interface AddBlacklistTypeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: BlacklistTransferManagerEvents_3_0_0.AddBlacklistType;
  callback: EventCallback<BlacklistTransferManagerAddBlacklistTypeEventArgs_3_0_0>;
}

interface GetAddBlacklistTypeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: BlacklistTransferManagerEvents_3_0_0.AddBlacklistType;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: BlacklistTransferManagerEvents_3_0_0.Pause;
  callback: EventCallback<BlacklistTransferManagerPauseEventArgs_3_0_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: BlacklistTransferManagerEvents_3_0_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: BlacklistTransferManagerEvents_3_0_0.Unpause;
  callback: EventCallback<BlacklistTransferManagerUnpauseEventArgs_3_0_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: BlacklistTransferManagerEvents_3_0_0.Unpause;
}

interface BlacklistTransferManagerSubscribeAsyncParams extends Subscribe {
  (params: AddBlacklistTypeSubscribeAsyncParams): Promise<string>;
  (params: ModifyBlacklistTypeSubscribeAsyncParams): Promise<string>;
  (params: DeleteBlacklistTypeSubscribeAsyncParams): Promise<string>;
  (params: AddInvestorToBlacklistSubscribeAsyncParams): Promise<string>;
  (params: DeleteInvestorFromBlacklistSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetBlacklistTransferManagerLogsAsyncParams extends GetLogs {
  (params: GetAddBlacklistTypeLogsAsyncParams): Promise<
    LogWithDecodedArgs<BlacklistTransferManagerPauseEventArgs_3_0_0>[]
  >;
  (params: GetModifyBlacklistTypeLogsAsyncParams): Promise<
    LogWithDecodedArgs<BlacklistTransferManagerPauseEventArgs_3_0_0>[]
  >;
  (params: GetDeleteBlacklistTypeLogsAsyncParams): Promise<
    LogWithDecodedArgs<BlacklistTransferManagerPauseEventArgs_3_0_0>[]
  >;
  (params: GetAddInvestorToBlacklistLogsAsyncParams): Promise<
    LogWithDecodedArgs<BlacklistTransferManagerPauseEventArgs_3_0_0>[]
  >;
  (params: GetDeleteInvestorFromBlacklistLogsAsyncParams): Promise<
    LogWithDecodedArgs<BlacklistTransferManagerPauseEventArgs_3_0_0>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<BlacklistTransferManagerPauseEventArgs_3_0_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<BlacklistTransferManagerUnpauseEventArgs_3_0_0>[]>;
}

const BlacklistTransferManagerBase_3_0_0 = WithModule_3_0_0(BlacklistTransferManagerCommon as unknown as Constructor<BlacklistTransferManagerCommon>);

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
