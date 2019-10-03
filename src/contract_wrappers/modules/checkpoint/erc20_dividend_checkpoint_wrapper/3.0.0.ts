import {
  ERC20DividendCheckpointContract_3_0_0,
  ERC20DividendCheckpointEventArgs_3_0_0,
  ERC20DividendCheckpointEvents_3_0_0,
  LogWithDecodedArgs,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../../utils/assert';
import { WithDividendCheckpoint_3_0_0 } from '../dividend_checkpoint_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import { GetLogsAsyncParams, SubscribeAsyncParams, ContractVersion, Constructor } from '../../../../types';
import ERC20DividendCheckpointCommon, {
  ERC20DividendCheckpointSubscribeAsyncParams,
  GetERC20DividendCheckpointLogsAsyncParams,
} from './common';

const ERC20DividendCheckpointBase_3_0_0 = WithDividendCheckpoint_3_0_0(
  (ERC20DividendCheckpointCommon as unknown) as Constructor<ERC20DividendCheckpointCommon>,
);

export class ERC20DividendCheckpoint_3_0_0 extends ERC20DividendCheckpointBase_3_0_0 {
  public contract: Promise<ERC20DividendCheckpointContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate ERC20DividendCheckpointWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<ERC20DividendCheckpointContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: ERC20DividendCheckpointSubscribeAsyncParams = async <
    ArgsType extends ERC20DividendCheckpointEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ERC20DividendCheckpointEvents_3_0_0);
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
  public getLogsAsync: GetERC20DividendCheckpointLogsAsyncParams = async <
    ArgsType extends ERC20DividendCheckpointEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ERC20DividendCheckpointEvents_3_0_0);
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

export function isERC20DividendCheckpoint_3_0_0(
  wrapper: ERC20DividendCheckpointCommon,
): wrapper is ERC20DividendCheckpoint_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
