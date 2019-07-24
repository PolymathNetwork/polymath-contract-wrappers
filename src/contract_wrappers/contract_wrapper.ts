/* eslint-disable no-underscore-dangle */
import { Web3Wrapper, marshaller } from '@0x/web3-wrapper';
import { AbiDecoder, intervalUtils, logUtils } from '@0x/utils';
import {
  BlockParamLiteral,
  ContractAbi,
  FilterObject,
  RawLogEntry,
  RawLog,
  LogEntry,
  LogWithDecodedArgs,
  TxData,
} from 'ethereum-types';
import { Block, BlockAndLogStreamer, Log } from 'ethereumjs-blockstream';
import * as _ from 'lodash';
import { BaseContract } from '@polymathnetwork/abi-wrappers';
import filterUtils from '../utils/filter_utils';
import {
  BlockRange,
  ContractEventArgs,
  ContractEvents,
  IndexedFilterValues,
  EventCallback,
  GetLogs,
  Subscribe,
} from '../types';
import assert from '../utils/assert';

const SUBSCRIPTION_NOT_FOUND = 'SUBSCRIPTION_NOT_FOUND';
const SUBSCRIPTION_ALREADY_PRESENT = 'SUBSCRIPTION_ALREADY_PRESENT';

export default abstract class ContractWrapper {
  public abstract abi: ContractAbi;

  protected contract: Promise<BaseContract>;

  protected web3Wrapper: Web3Wrapper;

  public abstract getLogsAsync: GetLogs | undefined;

  public abstract subscribeAsync: Subscribe | undefined;

  /**
   * Returns the contract address
   */
  public address = async (): Promise<string> => {
    return (await this.contract).address;
  };

  /**
   * Cancel a subscription
   * @param subscriptionToken Subscription token returned by `subscribe()`
   */
  public unsubscribe = (subscriptionToken: string): void => {
    assert.isValidSubscriptionToken('subscriptionToken', subscriptionToken);
    this.unsubscribeInternal(subscriptionToken);
  };

  /**
   * Cancels all existing subscriptions
   */
  public unsubscribeAll = (): void => {
    const filterTokens = _.keys(this._filterCallbacks);
    _.each(
      filterTokens,
      (filterToken): void => {
        this.unsubscribeInternal(filterToken);
      },
    );
  };

  private _blockAndLogStreamerIfExists: BlockAndLogStreamer<Block, Log> | undefined;

  private _blockAndLogStreamIntervalIfExists?: NodeJS.Timer;

  private _onLogAddedSubscriptionToken: string | undefined;

  private _onLogRemovedSubscriptionToken: string | undefined;

  private readonly _blockPollingIntervalMs: number;

  private readonly _filters: { [filterToken: string]: FilterObject };

  private readonly _filterCallbacks: {
    [filterToken: string]: EventCallback<ContractEventArgs>;
  };

  private static _onBlockAndLogStreamerError(isVerbose: boolean, err: Error): void {
    if (isVerbose) {
      logUtils.warn(err);
    }
  }

  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<BaseContract>) {
    this.web3Wrapper = web3Wrapper;
    this.contract = contract;
    this._blockPollingIntervalMs = 1000;
    this._filters = {};
    this._filterCallbacks = {};
  }

  protected unsubscribeInternal(filterToken: string, err?: Error): void {
    if (_.isUndefined(this._filters[filterToken])) {
      throw new Error(SUBSCRIPTION_NOT_FOUND);
    }
    if (!_.isUndefined(err)) {
      const callback = this._filterCallbacks[filterToken];
      callback(err, undefined);
    }
    delete this._filters[filterToken];
    delete this._filterCallbacks[filterToken];
    if (_.isEmpty(this._filters)) {
      this._stopBlockAndLogStream();
    }
  }

  protected subscribeInternal<ArgsType extends ContractEventArgs>(
    address: string,
    eventName: ContractEvents,
    indexFilterValues: IndexedFilterValues,
    abi: ContractAbi,
    callback: EventCallback<ArgsType>,
    isVerbose: boolean = false,
  ): string {
    const filter = filterUtils.getFilter(address, eventName, indexFilterValues, abi);
    if (_.isUndefined(this._blockAndLogStreamerIfExists)) {
      this._startBlockAndLogStream(isVerbose);
    }
    const filterToken = filterUtils.generateUUID();
    this._filters[filterToken] = filter;
    this._filterCallbacks[filterToken] = callback as EventCallback<ContractEventArgs>;
    return filterToken;
  }

  protected async getLogsAsyncInternal<ArgsType extends ContractEventArgs>(
    address: string,
    eventName: ContractEvents,
    blockRange: BlockRange,
    indexFilterValues: IndexedFilterValues,
    abi: ContractAbi,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> {
    const filter = filterUtils.getFilter(address, eventName, indexFilterValues, abi, blockRange);
    const logs = await this.web3Wrapper.getLogsAsync(filter);
    const logsWithDecodedArguments = _.map(logs, this.tryToDecodeLogOrNoopInternal.bind(this));
    return logsWithDecodedArguments as LogWithDecodedArgs<ArgsType>[];
  }

  protected tryToDecodeLogOrNoopInternal<ArgsType extends ContractEventArgs>(
    log: LogEntry,
  ): LogWithDecodedArgs<ArgsType> | RawLog {
    const abiDecoder = new AbiDecoder([this.abi]);
    const logWithDecodedArgs = abiDecoder.tryToDecodeLogOrNoop(log);
    return logWithDecodedArgs;
  }

  private _onLogStateChanged<ArgsType extends ContractEventArgs>(isRemoved: boolean, rawLog: Log): void {
    const log: LogEntry = marshaller.unmarshalLog(rawLog as RawLogEntry);
    _.forEach(
      this._filters,
      (filter: FilterObject, filterToken: string): void => {
        if (filterUtils.matchesFilter(log, filter)) {
          const decodedLog = this.tryToDecodeLogOrNoopInternal(log) as LogWithDecodedArgs<ArgsType>;
          const logEvent = {
            log: decodedLog,
            isRemoved,
          };
          this._filterCallbacks[filterToken](null, logEvent);
        }
      },
    );
  }

  private _startBlockAndLogStream(isVerbose: boolean): void {
    if (!_.isUndefined(this._blockAndLogStreamerIfExists)) {
      throw new Error(SUBSCRIPTION_ALREADY_PRESENT);
    }
    this._blockAndLogStreamerIfExists = new BlockAndLogStreamer(
      this._blockstreamGetBlockOrNullAsync.bind(this),
      this._blockstreamGetLogsAsync.bind(this),
      ContractWrapper._onBlockAndLogStreamerError.bind(this, isVerbose),
    );
    const catchAllLogFilter = {};
    this._blockAndLogStreamerIfExists.addLogFilter(catchAllLogFilter);
    this._blockAndLogStreamIntervalIfExists = intervalUtils.setAsyncExcludingInterval(
      this._reconcileBlockAsync.bind(this),
      this._blockPollingIntervalMs,
      ContractWrapper._onBlockAndLogStreamerError.bind(this, isVerbose),
    );
    let isRemoved = false;
    this._onLogAddedSubscriptionToken = this._blockAndLogStreamerIfExists.subscribeToOnLogAdded(
      this._onLogStateChanged.bind(this, isRemoved),
    );
    isRemoved = true;
    this._onLogRemovedSubscriptionToken = this._blockAndLogStreamerIfExists.subscribeToOnLogRemoved(
      this._onLogStateChanged.bind(this, isRemoved),
    );
  }

  // This method only exists in order to comply with the expected interface of Blockstream's constructor
  private async _blockstreamGetBlockOrNullAsync(hash: string): Promise<Block | null> {
    const shouldIncludeTransactionData = false;
    const blockOrNull = await this.web3Wrapper.sendRawPayloadAsync<Block | null>({
      method: 'eth_getBlockByHash',
      params: [hash, shouldIncludeTransactionData],
    });
    return blockOrNull;
  }

  // This method only exists in order to comply with the expected interface of Blockstream's constructor
  private async _blockstreamGetLatestBlockOrNullAsync(): Promise<Block | null> {
    const shouldIncludeTransactionData = false;
    const blockOrNull = await this.web3Wrapper.sendRawPayloadAsync<Block | null>({
      method: 'eth_getBlockByNumber',
      params: [BlockParamLiteral.Latest, shouldIncludeTransactionData],
    });
    return blockOrNull;
  }

  private _stopBlockAndLogStream(): void {
    if (_.isUndefined(this._blockAndLogStreamerIfExists)) {
      throw new Error(SUBSCRIPTION_NOT_FOUND);
    }
    this._blockAndLogStreamerIfExists.unsubscribeFromOnLogAdded(this._onLogAddedSubscriptionToken as string);
    this._blockAndLogStreamerIfExists.unsubscribeFromOnLogRemoved(this._onLogRemovedSubscriptionToken as string);
    intervalUtils.clearAsyncExcludingInterval(this._blockAndLogStreamIntervalIfExists as NodeJS.Timer);
    delete this._blockAndLogStreamerIfExists;
  }

  private async _blockstreamGetLogsAsync(filterOptions: FilterObject): Promise<Log[]> {
    const logs = await this.web3Wrapper.sendRawPayloadAsync<RawLogEntry[]>({
      method: 'eth_getLogs',
      params: [filterOptions],
    });
    return logs as Log[];
  }

  private async _reconcileBlockAsync(): Promise<void> {
    const latestBlockOrNull = await this._blockstreamGetLatestBlockOrNullAsync();
    if (_.isNull(latestBlockOrNull)) {
      return;
    }
    if (!_.isUndefined(this._blockAndLogStreamerIfExists)) {
      await this._blockAndLogStreamerIfExists.reconcileNewBlock(latestBlockOrNull);
    }
  }

  protected getDefaultFromAddress = async (): Promise<string> => {
    const addresses = await this.web3Wrapper.getAvailableAddressesAsync();
    return addresses[0];
  };

  protected getCallerAddress = async (txData: Partial<TxData> | undefined): Promise<string> => {
    return txData === undefined || txData.from === undefined ? this.getDefaultFromAddress() : txData.from;
  };
}
