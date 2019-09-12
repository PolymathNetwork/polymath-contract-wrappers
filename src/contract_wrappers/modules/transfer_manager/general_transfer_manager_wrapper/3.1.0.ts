import {
  GeneralTransferManagerContract_3_1_0,
  GeneralTransferManagerEventArgs_3_1_0,
  GeneralTransferManagerEvents_3_1_0,
  GeneralTransferManagerChangeIssuanceAddressEventArgs_3_1_0,
  GeneralTransferManagerModifyKYCDataEventArgs_3_1_0,
  GeneralTransferManagerModifyInvestorFlagEventArgs_3_1_0,
  GeneralTransferManagerModifyTransferRequirementsEventArgs_3_1_0,
  GeneralTransferManagerChangeDefaultsEventArgs_3_1_0,
  GeneralTransferManagerPauseEventArgs_3_1_0,
  GeneralTransferManagerUnpauseEventArgs_3_1_0,
  LogWithDecodedArgs,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../../utils/assert';
import {
  ContractVersion,
  SubscribeAsyncParams,
  GetLogsAsyncParams,
  Subscribe,
  GetLogs,
  EventCallback,
} from '../../../../types';
import ContractFactory from '../../../../factories/contractFactory';

import GeneralTransferManagerCommon from './common';

interface ChangeIssuanceAddressSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralTransferManagerEvents_3_1_0.ChangeIssuanceAddress;
  callback: EventCallback<GeneralTransferManagerChangeIssuanceAddressEventArgs_3_1_0>;
}

interface GetChangeIssuanceAddressLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralTransferManagerEvents_3_1_0.ChangeIssuanceAddress;
}

interface ChangeDefaultsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralTransferManagerEvents_3_1_0.ChangeDefaults;
  callback: EventCallback<GeneralTransferManagerChangeDefaultsEventArgs_3_1_0>;
}

interface GetChangeDefaultsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralTransferManagerEvents_3_1_0.ChangeDefaults;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralTransferManagerEvents_3_1_0.Pause;
  callback: EventCallback<GeneralTransferManagerPauseEventArgs_3_1_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralTransferManagerEvents_3_1_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralTransferManagerEvents_3_1_0.Unpause;
  callback: EventCallback<GeneralTransferManagerUnpauseEventArgs_3_1_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralTransferManagerEvents_3_1_0.Unpause;
}

interface ModifyKYCDataSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralTransferManagerEvents_3_1_0.ModifyKYCData;
  callback: EventCallback<GeneralTransferManagerModifyKYCDataEventArgs_3_1_0>;
}

interface GetModifyKYCDataLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralTransferManagerEvents_3_1_0.ModifyKYCData;
}

interface ModifyInvestorFlagSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralTransferManagerEvents_3_1_0.ModifyInvestorFlag;
  callback: EventCallback<GeneralTransferManagerModifyInvestorFlagEventArgs_3_1_0>;
}

interface GetModifyInvestorFlagLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralTransferManagerEvents_3_1_0.ModifyInvestorFlag;
}

interface ModifyTransferRequirementsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralTransferManagerEvents_3_1_0.ModifyTransferRequirements;
  callback: EventCallback<GeneralTransferManagerModifyTransferRequirementsEventArgs_3_1_0>;
}

interface GetModifyTransferRequirementsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralTransferManagerEvents_3_1_0.ModifyTransferRequirements;
}

interface GeneralTransferManagerSubscribeAsyncParams extends Subscribe {
  (params: ChangeIssuanceAddressSubscribeAsyncParams): Promise<string>;
  (params: ChangeDefaultsSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
  (params: ModifyKYCDataSubscribeAsyncParams): Promise<string>;
  (params: ModifyInvestorFlagSubscribeAsyncParams): Promise<string>;
  (params: ModifyTransferRequirementsSubscribeAsyncParams): Promise<string>;
}

interface GetGeneralTransferManagerLogsAsyncParams extends GetLogs {
  (params: GetChangeIssuanceAddressLogsAsyncParams): Promise<
    LogWithDecodedArgs<GeneralTransferManagerChangeIssuanceAddressEventArgs_3_1_0>[]
  >;
  (params: GetChangeDefaultsLogsAsyncParams): Promise<
    LogWithDecodedArgs<GeneralTransferManagerChangeDefaultsEventArgs_3_1_0>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<GeneralTransferManagerPauseEventArgs_3_1_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<GeneralTransferManagerUnpauseEventArgs_3_1_0>[]>;
  (params: GetModifyKYCDataLogsAsyncParams): Promise<
    LogWithDecodedArgs<GeneralTransferManagerModifyKYCDataEventArgs_3_1_0>[]
  >;
  (params: GetModifyInvestorFlagLogsAsyncParams): Promise<
    LogWithDecodedArgs<GeneralTransferManagerModifyInvestorFlagEventArgs_3_1_0>[]
  >;
  (params: GetModifyTransferRequirementsLogsAsyncParams): Promise<
    LogWithDecodedArgs<GeneralTransferManagerModifyTransferRequirementsEventArgs_3_1_0>[]
  >;
}

export class GeneralTransferManager_3_1_0 extends GeneralTransferManagerCommon {
  public contract: Promise<GeneralTransferManagerContract_3_1_0>;

  public contractVersion = ContractVersion.V3_1_0;

  /**
   * Instantiate GeneralTransferManager_3_1_0
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract Contract
   * @param contractFactory Contract factory address
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<GeneralTransferManagerContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Get whitelist module
   * @return whitelist module number
   */
  public whitelistModule = async (): Promise<number> => {
    const result = await (await this.contract).WHITELISTMODULE.callAsync();
    return result.toNumber();
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: GeneralTransferManagerSubscribeAsyncParams = async <
    ArgsType extends GeneralTransferManagerEventArgs_3_1_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, GeneralTransferManagerEvents_3_1_0);
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
  public getLogsAsync: GetGeneralTransferManagerLogsAsyncParams = async <
    ArgsType extends GeneralTransferManagerEventArgs_3_1_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, GeneralTransferManagerEvents_3_1_0);
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

export function isGeneralTransferManager_3_1_0(wrapper: any): wrapper is GeneralTransferManager_3_1_0 {
  return wrapper.contractVersion === ContractVersion.V3_1_0;
}
