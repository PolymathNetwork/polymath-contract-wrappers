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
import * as _ from 'lodash';
import {
    TxParams,
    IGetLogsAsyncParams,
    ISubscribeAsyncParams,
    EventCallback,
    ISubscribe,
    IGetLogs
} from '../../../types';
import { assert } from '../../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { ModuleWrapper } from '../module_wrapper';
  
interface IModifyHolderCountSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: CountTransferManagerEvents.ModifyHolderCount,
  callback: EventCallback<CountTransferManagerModifyHolderCountEventArgs>,
}

interface IGetModifyHolderCountLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: CountTransferManagerEvents.ModifyHolderCount,
}

interface IPauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: CountTransferManagerEvents.Pause,
  callback: EventCallback<CountTransferManagerPauseEventArgs>,
}

interface IGetPauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: CountTransferManagerEvents.Pause,
}

interface IUnpauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: CountTransferManagerEvents.Unpause,
  callback: EventCallback<CountTransferManagerUnpauseEventArgs>,
}

interface IGetUnpauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: CountTransferManagerEvents.Unpause,
}

interface ICountTransferManagerSubscribeAsyncParams extends ISubscribe {
  (params: IModifyHolderCountSubscribeAsyncParams): Promise<string>,
  (params: IPauseSubscribeAsyncParams): Promise<string>,
  (params: IUnpauseSubscribeAsyncParams): Promise<string>,
}

interface IGetCountTransferManagerLogsAsyncParams extends IGetLogs {
  (params: IGetModifyHolderCountLogsAsyncParams): Promise<Array<LogWithDecodedArgs<CountTransferManagerModifyHolderCountEventArgs>>>,
  (params: IGetPauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<CountTransferManagerPauseEventArgs>>>,
  (params: IGetUnpauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<CountTransferManagerUnpauseEventArgs>>>,
}

interface VerifyTransferParams extends TxParams {
    from: string,
    to: string,
    amount: BigNumber,
    data: string,
    isTransfer: boolean,
}

interface ConfigureParams extends TxParams {
    maxHolderCount: BigNumber,
}

/**
 * This class includes the functionality related to interacting with the Count Transfer Manager contract.
 */
export class CountTransferManagerWrapper extends ModuleWrapper {
  public abi: ContractAbi = CountTransferManager.abi;
  protected _contract: Promise<CountTransferManagerContract>;

  /**
   * Instantiate CountTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param address The address of the GTM
   */
  constructor(web3Wrapper: Web3Wrapper, address: string) {
    super(web3Wrapper, address);
    this._contract = this._getCountTransferManagerContract();
  }

  public unpause = async (params: TxParams) => {
      return (await this._contract).unpause.sendTransactionAsync(
          params.txData,
          params.safetyFactor
      );
  }

  public paused = async () => {
      return await (await this._contract).paused.callAsync();
  }

  public pause = async (params: TxParams) => {
      return (await this._contract).pause.sendTransactionAsync(
          params.txData,
          params.safetyFactor
      );
  }

  public maxHolderCount = async () => {
      return await (await this._contract).maxHolderCount.callAsync();
  }

  public verifyTransfer = async (params: VerifyTransferParams) => {
      return (await this._contract).verifyTransfer.sendTransactionAsync(
          params.from,
          params.to,
          params.amount,
          params.data,
          params.isTransfer,
          params.txData,
          params.safetyFactor
      );
  }

  public configure = async (params: ConfigureParams) => {
      return (await this._contract).configure.sendTransactionAsync(
          params.maxHolderCount,
          params.txData,
          params.safetyFactor
      );
  }

  public changeHolderCount = async (params: ConfigureParams) => {
      return (await this._contract).changeHolderCount.sendTransactionAsync(
          params.maxHolderCount,
          params.txData,
          params.safetyFactor
      );
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: ICountTransferManagerSubscribeAsyncParams = async <ArgsType extends CountTransferManagerEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CountTransferManagerEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        CountTransferManager.abi,
        params.callback,
        !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetCountTransferManagerLogsAsyncParams = async <ArgsType extends CountTransferManagerEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CountTransferManagerEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        CountTransferManager.abi,
    );
    return logs;
  }

  private async _getCountTransferManagerContract(): Promise<CountTransferManagerContract> {
    return new CountTransferManagerContract(
      this.abi,
      this._address,
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
  