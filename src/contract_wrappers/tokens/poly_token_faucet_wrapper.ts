import {
  PolyTokenFaucetContract_3_0_0,
  Web3Wrapper,
  BigNumber,
  PolyResponse,
  PolyTokenFaucetEvents_3_0_0,
  PolyTokenFaucetEventArgs_3_0_0,
  LogWithDecodedArgs,
  PolyTokenFaucetApprovalEventArgs_3_0_0,
  EventCallback,
  PolyTokenFaucetTransferEventArgs_3_0_0
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import ContractWrapper from '../contract_wrapper';
import {
  TxParams,
  ErrorCode,
  ContractVersion,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  GetLogs,
  Subscribe
} from '../../types';
import assert from '../../utils/assert';
import { valueToWei } from '../../utils/convert';

const MAX_TOKEN_AMOUNT = new BigNumber(1000000e18);

export namespace PolyTokenFaucetTransactionParams {
  export interface GetTokens extends GetTokensParams {}
}

/**
 * @param amount Amount of tokens to get from faucet
 * @param recipient Address to transfer to
 */
interface GetTokensParams extends TxParams {
  amount: BigNumber;
  recipient: string;
}

interface ApprovalSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PolyTokenFaucetEvents_3_0_0.Approval;
  callback: EventCallback<PolyTokenFaucetApprovalEventArgs_3_0_0>;
}

interface GetApprovalLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PolyTokenFaucetEvents_3_0_0.Approval;
}

interface TransferSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PolyTokenFaucetEvents_3_0_0.Transfer;
  callback: EventCallback<PolyTokenFaucetTransferEventArgs_3_0_0>;
}

interface GetTransferLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PolyTokenFaucetEvents_3_0_0.Transfer;
}

interface PolyTokenFaucetSubscribeAsyncParams extends Subscribe {
  (params: ApprovalSubscribeAsyncParams): Promise<string>;
  (params: TransferSubscribeAsyncParams): Promise<string>;
}

interface GetPolyTokenFaucetLogsAsyncParams extends GetLogs {
  (params: GetApprovalLogsAsyncParams): Promise<LogWithDecodedArgs<PolyTokenFaucetApprovalEventArgs_3_0_0>[]>;
  (params: GetTransferLogsAsyncParams): Promise<LogWithDecodedArgs<PolyTokenFaucetTransferEventArgs_3_0_0>[]>;
}

/**
 * This class includes the functionality related to interacting with the PolyTokenFaucet contract.
 */
export default class PolyTokenFaucetWrapper extends ContractWrapper {
  public contract: Promise<PolyTokenFaucetContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate PolyTokenFaucetWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<PolyTokenFaucetContract_3_0_0>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Used to get tokens from faucet
   */
  public getTokens = async (params: GetTokensParams): Promise<PolyResponse> => {
    assert.isNonZeroETHAddressHex('recipient', params.recipient);
    assert.assert(
      params.amount.isLessThanOrEqualTo(MAX_TOKEN_AMOUNT),
      ErrorCode.InvalidData,
      'Amount cannot exceed 1 million tokens',
    );

    return (await this.contract).getTokens.sendTransactionAsync(
      valueToWei(params.amount, await (await this.contract).decimals.callAsync()),
      params.recipient,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: PolyTokenFaucetSubscribeAsyncParams = async <ArgsType extends PolyTokenFaucetEventArgs_3_0_0>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PolyTokenFaucetEvents_3_0_0);
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
  public getLogsAsync: GetPolyTokenFaucetLogsAsyncParams = async <ArgsType extends PolyTokenFaucetEventArgs_3_0_0>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PolyTokenFaucetEvents_3_0_0);
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
