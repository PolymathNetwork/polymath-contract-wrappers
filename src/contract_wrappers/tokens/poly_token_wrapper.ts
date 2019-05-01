import {
  PolyTokenContract,
  PolyTokenEventArgs,
  PolyTokenEvents,
  PolyTokenTransferEventArgs,
  PolyTokenApprovalEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { PolyToken } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import { schemas } from '@0x/json-schemas';
import { TxParams, GetLogsAsyncParams, SubscribeAsyncParams, EventCallback, Subscribe, GetLogs } from '../../types';
import assert from '../../utils/assert';
import ERC20TokenWrapper from './erc20_wrapper';

interface ApprovalSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PolyTokenEvents.Approval;
  callback: EventCallback<PolyTokenApprovalEventArgs>;
}

interface GetApprovalLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PolyTokenEvents.Approval;
}

interface TransferSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PolyTokenEvents.Transfer;
  callback: EventCallback<PolyTokenTransferEventArgs>;
}

interface GetTransferLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PolyTokenEvents.Transfer;
}

interface PolyTokenSubscribeAsyncParams extends Subscribe {
  (params: ApprovalSubscribeAsyncParams): Promise<string>;
  (params: TransferSubscribeAsyncParams): Promise<string>;
}

interface GetPolyTokenLogsAsyncParams extends GetLogs {
  (params: GetApprovalLogsAsyncParams): Promise<LogWithDecodedArgs<PolyTokenApprovalEventArgs>[]>;
  (params: GetTransferLogsAsyncParams): Promise<LogWithDecodedArgs<PolyTokenTransferEventArgs>[]>;
}

/**
 * @param spender The address which will spend the funds.
 * @param value The amount of tokens to increase the allowance by.
 */
interface ChangeApprovalParams extends TxParams {
  spender: string;
  value: BigNumber;
}

/**
 * This class includes the functionality related to interacting with the PolyToken contract.
 */
export default class PolyTokenWrapper extends ERC20TokenWrapper {
  public abi: ContractAbi = PolyToken.abi;

  protected contract: Promise<PolyTokenContract>;

  /**
   * Instantiate PolyTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<PolyTokenContract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  public increaseApproval = async (params: ChangeApprovalParams) => {
    assert.isETHAddressHex('spender', params.spender);
    return (await this.contract).increaseApproval.sendTransactionAsync(
      params.spender,
      params.value,
      params.txData,
      params.safetyFactor,
    );
  };

  public decreaseApproval = async (params: ChangeApprovalParams) => {
    assert.isETHAddressHex('spender', params.spender);
    return (await this.contract).decreaseApproval.sendTransactionAsync(
      params.spender,
      params.value,
      params.txData,
      params.safetyFactor,
    );
  };

  public decimalFactor = async () => {
    return (await this.contract).decimalFactor.callAsync();
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: PolyTokenSubscribeAsyncParams = async <ArgsType extends PolyTokenEventArgs>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PolyTokenEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      PolyToken.abi,
      params.callback,
      !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetPolyTokenLogsAsyncParams = async <ArgsType extends PolyTokenEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PolyTokenEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      PolyToken.abi,
    );
    return logs;
  };
}
