import {
  CountTransferManagerContract,
  CountTransferManagerEventArgs,
  CountTransferManagerEvents,
  CountTransferManagerModifyHolderCountEventArgs,
  CountTransferManagerPauseEventArgs,
  CountTransferManagerUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { CountTransferManager } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import ModuleWrapper from '../module_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Subscribe,
  GetLogs,
  Perms,
} from '../../../types';
import { numberToBigNumber } from '../../../utils/convert';

interface ModifyHolderCountSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CountTransferManagerEvents.ModifyHolderCount;
  callback: EventCallback<CountTransferManagerModifyHolderCountEventArgs>;
}

interface GetModifyHolderCountLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CountTransferManagerEvents.ModifyHolderCount;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CountTransferManagerEvents.Pause;
  callback: EventCallback<CountTransferManagerPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CountTransferManagerEvents.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CountTransferManagerEvents.Unpause;
  callback: EventCallback<CountTransferManagerUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CountTransferManagerEvents.Unpause;
}

interface CountTransferManagerSubscribeAsyncParams extends Subscribe {
  (params: ModifyHolderCountSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetCountTransferManagerLogsAsyncParams extends GetLogs {
  (params: GetModifyHolderCountLogsAsyncParams): Promise<
    LogWithDecodedArgs<CountTransferManagerModifyHolderCountEventArgs>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<CountTransferManagerPauseEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<CountTransferManagerUnpauseEventArgs>[]>;
}

interface VerifyTransferParams extends TxParams {
  from: string;
  to: string;
  amount: BigNumber;
  data: string;
  isTransfer: boolean;
}

interface ChangeHolderCountParams extends TxParams {
  maxHolderCount: number;
}

/**
 * This class includes the functionality related to interacting with the Count Transfer Manager contract.
 */
export default class CountTransferManagerWrapper extends ModuleWrapper {
  public abi: ContractAbi = CountTransferManager.abi;

  protected contract: Promise<CountTransferManagerContract>;

  /**
   * Instantiate CountTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<CountTransferManagerContract>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  public unpause = async (params: TxParams) => {
    assert.assert(await this.paused(), 'Controller not currently paused');
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  public pause = async (params: TxParams) => {
    assert.assert(!(await this.paused()), 'Controller currently paused');
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public maxHolderCount = async () => {
    return (await this.contract).maxHolderCount.callAsync();
  };

  public verifyTransfer = async (params: VerifyTransferParams) => {
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    return (await this.contract).verifyTransfer.sendTransactionAsync(
      params.from,
      params.to,
      params.amount,
      params.data,
      params.isTransfer,
      params.txData,
      params.safetyFactor,
    );
  };

  public changeHolderCount = async (params: ChangeHolderCountParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Admin), 'Caller is not allowed');
    return (await this.contract).changeHolderCount.sendTransactionAsync(
      numberToBigNumber(params.maxHolderCount),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: CountTransferManagerSubscribeAsyncParams = async <
    ArgsType extends CountTransferManagerEventArgs
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CountTransferManagerEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      CountTransferManager.abi,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetCountTransferManagerLogsAsyncParams = async <ArgsType extends CountTransferManagerEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CountTransferManagerEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      CountTransferManager.abi,
    );
    return logs;
  };
}
