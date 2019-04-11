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
import { schemas } from '@0x/json-schemas';
import { GetLogsAsyncParams, SubscribeAsyncParams, EventCallback, Subscribe, GetLogs } from '../../types';
import assert from '../../utils/assert';
import ERC20TokenWrapper from './erc20_wrapper';

interface ApprovalSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: DetailedERC20Events.Approval;
  callback: EventCallback<DetailedERC20ApprovalEventArgs>;
}

interface GetApprovalLogsAsyncParams extends GetLogsAsyncParams {
  eventName: DetailedERC20Events.Approval;
}

interface TransferSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: DetailedERC20Events.Transfer;
  callback: EventCallback<DetailedERC20TransferEventArgs>;
}

interface GetTransferLogsAsyncParams extends GetLogsAsyncParams {
  eventName: DetailedERC20Events.Transfer;
}

interface DetailedERC20TokenSubscribeAsyncParams extends Subscribe {
  (params: ApprovalSubscribeAsyncParams): Promise<string>;
  (params: TransferSubscribeAsyncParams): Promise<string>;
}

interface DetailedGetERC20TokenLogsAsyncParams extends GetLogs {
  (params: GetApprovalLogsAsyncParams): Promise<LogWithDecodedArgs<DetailedERC20ApprovalEventArgs>[]>;
  (params: GetTransferLogsAsyncParams): Promise<LogWithDecodedArgs<DetailedERC20TransferEventArgs>[]>;
}

/**
 * This class includes the functionality related to interacting with the DetailedERC20 contract.
 */
export default class DetailedERC20TokenWrapper extends ERC20TokenWrapper {
  public abi: ContractAbi = DetailedERC20.abi;

  protected contract: Promise<DetailedERC20Contract>;

  /**
   * Instantiate DetailedERC20Wrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<DetailedERC20Contract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: DetailedERC20TokenSubscribeAsyncParams = async <ArgsType extends DetailedERC20EventArgs>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, DetailedERC20Events);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      DetailedERC20.abi,
      params.callback,
      !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: DetailedGetERC20TokenLogsAsyncParams = async <ArgsType extends DetailedERC20EventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, DetailedERC20Events);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      DetailedERC20.abi,
    );
    return logs;
  };
}
