import {
  PolyTokenFaucetContract,
  PolyTokenFaucetEventArgs,
  PolyTokenFaucetEvents,
  PolyTokenFaucetTransferEventArgs,
  PolyTokenFaucetApprovalEventArgs
} from '@polymathnetwork/abi-wrappers';
import {
  PolyTokenFaucet
} from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { ethers } from 'ethers';
import * as _ from 'lodash';
import {
  TxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
  ISubscribe,
  IGetLogs
} from '../../types';
import { assert } from '../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { ERC20TokenWrapper } from './erc20_wrapper';

interface IApprovalSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: PolyTokenFaucetEvents.Approval,
  callback: EventCallback<PolyTokenFaucetApprovalEventArgs>,
}

interface IGetApprovalLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: PolyTokenFaucetEvents.Approval,
}

interface ITransferSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: PolyTokenFaucetEvents.Transfer,
  callback: EventCallback<PolyTokenFaucetTransferEventArgs>,
}

interface IGetTransferLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: PolyTokenFaucetEvents.Transfer,
}

interface IPolyTokenFaucetSubscribeAsyncParams extends ISubscribe {
  (params: IApprovalSubscribeAsyncParams): Promise<string>,
  (params: ITransferSubscribeAsyncParams): Promise<string>,
}

interface IGetPolyTokenFaucetLogsAsyncParams extends IGetLogs {
  (params: IGetApprovalLogsAsyncParams): Promise<Array<LogWithDecodedArgs<PolyTokenFaucetApprovalEventArgs>>>,
  (params: IGetTransferLogsAsyncParams): Promise<Array<LogWithDecodedArgs<PolyTokenFaucetTransferEventArgs>>>,
}

interface GetTokensParams extends TxParams {
  amount: BigNumber,
  recipient: string,
}

/**
 * This class includes the functionality related to interacting with the PolyTokenFaucet contract.
 */
export class PolyTokenFaucetWrapper extends ERC20TokenWrapper {
  public abi: ContractAbi = (PolyTokenFaucet as any).abi;
  protected _contract: Promise<PolyTokenFaucetContract>;

  /**
   * Instantiate PolyTokenFaucetWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param address The address contract
   */
  constructor(web3Wrapper: Web3Wrapper, address: string) {
    super(web3Wrapper, address);
    this._contract = this._getPolyTokenFaucetContract();
  }

  public getTokens = async (params: GetTokensParams) => {
    const networkId = await this._web3Wrapper.getNetworkIdAsync();
    if (networkId === 1) {
      throw new Error('Only for testnet');
    }
    return (await this._contract).getTokens.sendTransactionAsync(
      params.amount,
      params.recipient,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: IPolyTokenFaucetSubscribeAsyncParams = async <ArgsType extends PolyTokenFaucetEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PolyTokenFaucetEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        PolyTokenFaucet.abi,
        params.callback,
        !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetPolyTokenFaucetLogsAsyncParams = async <ArgsType extends PolyTokenFaucetEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PolyTokenFaucetEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        PolyTokenFaucet.abi,
    );
    return logs;
  }

  private async _getPolyTokenFaucetContract(): Promise<PolyTokenFaucetContract> {
    return new PolyTokenFaucetContract(
      this.abi,
      this._address,
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
