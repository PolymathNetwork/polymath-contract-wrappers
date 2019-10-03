import {
  VolumeRestrictionTMEvents_3_0_0,
  LogWithDecodedArgs,
  VolumeRestrictionTMContract_3_0_0,
  Web3Wrapper,
  VolumeRestrictionTMEventArgs_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import VolumeRestrictionTransferManagerCommon, {
  VolumeRestrictionTransferManagerSubscribeAsyncParams,
  GetVolumeRestrictionTransferManagerLogsAsyncParams,
} from './common';
import { ContractVersion, Constructor, SubscribeAsyncParams, GetLogsAsyncParams } from '../../../../types';
import { WithModule_3_0_0 } from '../../module_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import assert from '../../../../utils/assert';

const VolumeRestrictionTransferManagerBase_3_0_0 = WithModule_3_0_0(
  (VolumeRestrictionTransferManagerCommon as unknown) as Constructor<VolumeRestrictionTransferManagerCommon>,
);

export class VolumeRestrictionTransferManager_3_0_0 extends VolumeRestrictionTransferManagerBase_3_0_0 {
  public contract: Promise<VolumeRestrictionTMContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate VolumeRestrictionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<VolumeRestrictionTMContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: VolumeRestrictionTransferManagerSubscribeAsyncParams = async <
    ArgsType extends VolumeRestrictionTMEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VolumeRestrictionTMEvents_3_0_0);
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
  public getLogsAsync: GetVolumeRestrictionTransferManagerLogsAsyncParams = async <
    ArgsType extends VolumeRestrictionTMEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VolumeRestrictionTMEvents_3_0_0);
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

export function isVolumeRestrictionTransferManager_3_0_0(
  wrapper: VolumeRestrictionTransferManagerCommon,
): wrapper is VolumeRestrictionTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
