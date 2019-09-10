import {
  PolyTokenContract_3_0_0,
  PolyTokenEventArgs_3_0_0,
  PolyTokenEvents_3_0_0,
  PolyTokenTransferEventArgs_3_0_0,
  PolyTokenApprovalEventArgs_3_0_0,
  Web3Wrapper,
  LogWithDecodedArgs,
  BigNumber,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import { TxParams, GetLogsAsyncParams, SubscribeAsyncParams, EventCallback, Subscribe, GetLogs, ContractVersion } from '../../types';
import assert from '../../utils/assert';
import ERC20TokenWrapper from './erc20_wrapper';
import { valueToWei } from '../../utils/convert';

interface ApprovalSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PolyTokenEvents_3_0_0.Approval;
  callback: EventCallback<PolyTokenApprovalEventArgs_3_0_0>;
}

interface GetApprovalLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PolyTokenEvents_3_0_0.Approval;
}

interface TransferSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PolyTokenEvents_3_0_0.Transfer;
  callback: EventCallback<PolyTokenTransferEventArgs_3_0_0>;
}

interface GetTransferLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PolyTokenEvents_3_0_0.Transfer;
}

interface PolyTokenSubscribeAsyncParams extends Subscribe {
  (params: ApprovalSubscribeAsyncParams): Promise<string>;
  (params: TransferSubscribeAsyncParams): Promise<string>;
}

interface GetPolyTokenLogsAsyncParams extends GetLogs {
  (params: GetApprovalLogsAsyncParams): Promise<LogWithDecodedArgs<PolyTokenApprovalEventArgs_3_0_0>[]>;
  (params: GetTransferLogsAsyncParams): Promise<LogWithDecodedArgs<PolyTokenTransferEventArgs_3_0_0>[]>;
}

export namespace PolyTokenTransactionParams {
  export interface ChangeApproval extends ChangeApprovalParams {}
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
  public contract: Promise<PolyTokenContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate PolyTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<PolyTokenContract_3_0_0>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Use to increase approval
   */
  public increaseApproval = async (params: ChangeApprovalParams) => {
    assert.isETHAddressHex('spender', params.spender);
    return (await this.contract).increaseApproval.sendTransactionAsync(
      params.spender,
      valueToWei(params.value, await this.decimals()),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to decrease approval
   */
  public decreaseApproval = async (params: ChangeApprovalParams) => {
    assert.isETHAddressHex('spender', params.spender);
    return (await this.contract).decreaseApproval.sendTransactionAsync(
      params.spender,
      valueToWei(params.value, await this.decimals()),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Get decimal factor
   * @return factor
   */
  public decimalFactor = async (): Promise<BigNumber> => {
    return (await this.contract).decimalFactor.callAsync();
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: PolyTokenSubscribeAsyncParams = async <ArgsType extends PolyTokenEventArgs_3_0_0>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PolyTokenEvents_3_0_0);
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
  public getLogsAsync: GetPolyTokenLogsAsyncParams = async <ArgsType extends PolyTokenEventArgs_3_0_0>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PolyTokenEvents_3_0_0);
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
