import {
  CountTransferManagerContract,
  CountTransferManagerEventArgs,
  CountTransferManagerEvents,
  CountTransferManagerModifyHolderCountEventArgs,
  CountTransferManagerPauseEventArgs,
  CountTransferManagerUnpauseEventArgs,
  Web3Wrapper,
  LogWithDecodedArgs,
  BigNumber,
} from '@polymathnetwork/abi-wrappers';
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
  Perm,
} from '../../../types';
import { numberToBigNumber, parseTransferResult, valueToWei } from '../../../utils/convert';

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

/**
 * @param from Address of the sender
 * @param to Address of the receiver
 * @param amount Amount to send
 * @param data Data value
 */
interface VerifyTransferParams {
  from: string;
  to: string;
  amount: BigNumber;
  data: string;
}

/**
 * @param maxHolderCount is the new maximum amount of token holders
 */
interface ChangeHolderCountParams extends TxParams {
  maxHolderCount: number;
}

/**
 * This class includes the functionality related to interacting with the Count Transfer Manager contract.
 */
export default class CountTransferManagerWrapper extends ModuleWrapper {
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

  /**
   *  unpause the module
   */
  public unpause = async (params: TxParams) => {
    assert.assert(await this.paused(), 'Controller not currently paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'Sender is not owner');
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   *  check if module paused
   */
  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  /**
   *  pause the module
   */
  public pause = async (params: TxParams) => {
    assert.assert(!(await this.paused()), 'Controller currently paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'Sender is not owner');
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   *The maximum number of concurrent token holders
   */
  public maxHolderCount = async (): Promise<number> => {
    return (await (await this.contract).maxHolderCount.callAsync()).toNumber();
  };

  /**
   *  Used to verify the transfer transaction and prevent a transfer if it passes the allowed amount of token holders
   *  @return boolean transfer result
   *  @return address
   */
  public verifyTransfer = async (params: VerifyTransferParams) => {
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const result = await (await this.contract).verifyTransfer.callAsync(
      params.from,
      params.to,
      valueToWei(params.amount, decimals),
      params.data,
    );
    const transferResult = parseTransferResult(result[0]);
    return {
      transferResult,
      address: result[1],
    };
  };

  /**
   * Sets the cap for the amount of token holders there can be
   */
  public changeHolderCount = async (params: ChangeHolderCountParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
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
  public getLogsAsync: GetCountTransferManagerLogsAsyncParams = async <ArgsType extends CountTransferManagerEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CountTransferManagerEvents);
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
