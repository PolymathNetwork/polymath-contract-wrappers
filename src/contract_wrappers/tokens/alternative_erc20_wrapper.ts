import {
  AlternativeERC20Contract,
  AlternativeERC20EventArgs,
  AlternativeERC20Events,
  AlternativeERC20ApprovalEventArgs,
  AlternativeERC20TransferEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { AlternativeERC20 } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import * as _ from 'lodash';
import { schemas } from '@0x/json-schemas';
import { GetLogsAsyncParams, SubscribeAsyncParams, EventCallback, Subscribe, GetLogs } from '../../types';
import assert from '../../utils/assert';
import ERC20TokenWrapper from './erc20_wrapper';
import { bytes32ToString } from '../../utils/convert';

interface ApprovalSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: AlternativeERC20Events.Approval;
  callback: EventCallback<AlternativeERC20ApprovalEventArgs>;
}

interface GetApprovalLogsAsyncParams extends GetLogsAsyncParams {
  eventName: AlternativeERC20Events.Approval;
}

interface TransferSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: AlternativeERC20Events.Transfer;
  callback: EventCallback<AlternativeERC20TransferEventArgs>;
}

interface GetTransferLogsAsyncParams extends GetLogsAsyncParams {
  eventName: AlternativeERC20Events.Transfer;
}

interface AlternativeERC20TokenSubscribeAsyncParams extends Subscribe {
  (params: ApprovalSubscribeAsyncParams): Promise<string>;
  (params: TransferSubscribeAsyncParams): Promise<string>;
}

interface AlternativeGetERC20TokenLogsAsyncParams extends GetLogs {
  (params: GetApprovalLogsAsyncParams): Promise<LogWithDecodedArgs<AlternativeERC20ApprovalEventArgs>[]>;
  (params: GetTransferLogsAsyncParams): Promise<LogWithDecodedArgs<AlternativeERC20TransferEventArgs>[]>;
}

/**
 * This class includes the functionality related to interacting with the AlternativeERC20 contract.
 */
export default class AlternativeERC20TokenWrapper extends ERC20TokenWrapper {
  public abi: ContractAbi = AlternativeERC20.abi;

  protected contract: Promise<AlternativeERC20Contract>;

  /**
   * Instantiate AlternativeERC20Wrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<AlternativeERC20Contract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Returns the token name
   */
  public name = async () => {
    const name = (await this.contract).name.callAsync();
    return bytes32ToString(await name);
  };

  /**
   * Returns the token symbol
   */
  public symbol = async () => {
    const symbol = (await this.contract).symbol.callAsync();
    return bytes32ToString(await symbol);
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: AlternativeERC20TokenSubscribeAsyncParams = async <ArgsType extends AlternativeERC20EventArgs>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, AlternativeERC20Events);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      AlternativeERC20.abi,
      params.callback,
      !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: AlternativeGetERC20TokenLogsAsyncParams = async <ArgsType extends AlternativeERC20EventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, AlternativeERC20Events);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      AlternativeERC20.abi,
    );
    return logs;
  };
}
