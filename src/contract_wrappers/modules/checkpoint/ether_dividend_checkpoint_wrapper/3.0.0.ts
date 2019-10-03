import {
  EtherDividendCheckpointContract_3_0_0,
  EtherDividendCheckpointEventArgs_3_0_0,
  EtherDividendCheckpointEvents_3_0_0,
  Web3Wrapper,
  LogWithDecodedArgs,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../../utils/assert';
import { WithDividendCheckpoint_3_0_0 } from '../dividend_checkpoint_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import { GetLogsAsyncParams, SubscribeAsyncParams, ContractVersion, Constructor } from '../../../../types';
import EtherDividendCheckpointCommon, {
  EtherDividendCheckpointSubscribeAsyncParams,
  GetEtherDividendCheckpointLogsAsyncParams,
} from './common';

const EtherDividendCheckpointBase_3_0_0 = WithDividendCheckpoint_3_0_0(
  (EtherDividendCheckpointCommon as unknown) as Constructor<EtherDividendCheckpointCommon>,
);

export class EtherDividendCheckpoint_3_0_0 extends EtherDividendCheckpointBase_3_0_0 {
  public contract: Promise<EtherDividendCheckpointContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate EtherDividendCheckpointWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<EtherDividendCheckpointContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: EtherDividendCheckpointSubscribeAsyncParams = async <
    ArgsType extends EtherDividendCheckpointEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, EtherDividendCheckpointEvents_3_0_0);
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
  public getLogsAsync: GetEtherDividendCheckpointLogsAsyncParams = async <
    ArgsType extends EtherDividendCheckpointEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, EtherDividendCheckpointEvents_3_0_0);
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

export function isEtherDividendCheckpoint_3_0_0(
  wrapper: EtherDividendCheckpointCommon,
): wrapper is EtherDividendCheckpoint_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
