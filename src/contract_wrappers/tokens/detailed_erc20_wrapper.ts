import {
  DetailedERC20Contract,
  DetailedERC20EventArgs,
  DetailedERC20Events,
  DetailedERC20ApprovalEventArgs,
  DetailedERC20TransferEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { DetailedERC20 } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import * as _ from 'lodash';
import {
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
  eventName: DetailedERC20Events.Approval,
  callback: EventCallback<DetailedERC20ApprovalEventArgs>,
}

interface IGetApprovalLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: DetailedERC20Events.Approval,
}

interface ITransferSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: DetailedERC20Events.Transfer,
  callback: EventCallback<DetailedERC20TransferEventArgs>,
}

interface IGetTransferLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: DetailedERC20Events.Transfer,
}

interface IDetailedERC20TokenSubscribeAsyncParams extends ISubscribe {
  (params: IApprovalSubscribeAsyncParams): Promise<string>,
  (params: ITransferSubscribeAsyncParams): Promise<string>,
}

interface IDetailedGetERC20TokenLogsAsyncParams extends IGetLogs {
  (params: IGetApprovalLogsAsyncParams): Promise<Array<LogWithDecodedArgs<DetailedERC20ApprovalEventArgs>>>,
  (params: IGetTransferLogsAsyncParams): Promise<Array<LogWithDecodedArgs<DetailedERC20TransferEventArgs>>>,
}

/**
 * This class includes the functionality related to interacting with the DetailedERC20 contract.
 */
export class DetailedERC20TokenWrapper extends ERC20TokenWrapper {
  public abi: ContractAbi = DetailedERC20.abi;
  protected _contract: Promise<DetailedERC20Contract>;

  /**
   * Instantiate DetailedERC20Wrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param address The contract address
   */
  constructor(web3Wrapper: Web3Wrapper, address: string) {
    super(web3Wrapper, address);
    this._contract = this._getDetailedERC20Contract();
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: IDetailedERC20TokenSubscribeAsyncParams = async <ArgsType extends DetailedERC20EventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, DetailedERC20Events);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        DetailedERC20.abi,
        params.callback,
        !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IDetailedGetERC20TokenLogsAsyncParams = async <ArgsType extends DetailedERC20EventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, DetailedERC20Events);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        DetailedERC20.abi,
    );
    return logs;
  }

  private async _getDetailedERC20Contract(): Promise<DetailedERC20Contract> {
    return new DetailedERC20Contract(
      this.abi,
      this._address,
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
