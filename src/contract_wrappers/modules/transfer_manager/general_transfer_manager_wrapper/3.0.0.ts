import {
  GeneralTransferManagerContract_3_0_0,
  GeneralTransferManagerEventArgs_3_0_0,
  GeneralTransferManagerEvents_3_0_0,
  GeneralTransferManagerChangeIssuanceAddressEventArgs_3_0_0,
  GeneralTransferManagerModifyKYCDataEventArgs_3_0_0,
  GeneralTransferManagerModifyInvestorFlagEventArgs_3_0_0,
  GeneralTransferManagerModifyTransferRequirementsEventArgs_3_0_0,
  GeneralTransferManagerChangeDefaultsEventArgs_3_0_0,
  GeneralTransferManagerPauseEventArgs_3_0_0,
  GeneralTransferManagerUnpauseEventArgs_3_0_0,
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
  Constructor,
} from '../../../../types';
import ContractFactory from '../../../../factories/contractFactory';

import GeneralTransferManagerCommon, {
  GeneralTransferManagerSubscribeAsyncParams,
  GetGeneralTransferManagerLogsAsyncParams,
} from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';

const GeneralTransferManagerBase_3_0_0 = WithModule_3_0_0((GeneralTransferManagerCommon as unknown) as Constructor<
  GeneralTransferManagerCommon
>);

export class GeneralTransferManager_3_0_0 extends GeneralTransferManagerBase_3_0_0 {
  public contract: Promise<GeneralTransferManagerContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate GeneralTransferManager_3_0_0
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<GeneralTransferManagerContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: GeneralTransferManagerSubscribeAsyncParams = async <
    ArgsType extends GeneralTransferManagerEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, GeneralTransferManagerEvents_3_0_0);
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
    ArgsType extends GeneralTransferManagerEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, GeneralTransferManagerEvents_3_0_0);
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

export function isGeneralTransferManager_3_0_0(
  wrapper: GeneralTransferManagerCommon,
): wrapper is GeneralTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
