import {
  RestrictedPartialSaleTMContract,
  RestrictedPartialSaleTMEventArgs,
  RestrictedPartialSaleTMEvents,
  RestrictedPartialSaleTMChangedExemptWalletListEventArgs,
  RestrictedPartialSaleTMPauseEventArgs,
  RestrictedPartialSaleTMUnpauseEventArgs,
  Web3Wrapper,
  LogWithDecodedArgs,
  BigNumber,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import ModuleWrapper from '../module_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  parseTransferResult,
  valueToWei,
} from '../../../utils/convert';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Subscribe,
  GetLogs,
  RestrictionType,
  PERCENTAGE_DECIMALS,
  ErrorCode,
} from '../../../types';

interface ChangedExemptWalletListSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: RestrictedPartialSaleTMEvents.ChangedExemptWalletList;
  callback: EventCallback<RestrictedPartialSaleTMChangedExemptWalletListEventArgs>;
}

interface GetChangedExemptWalletListLogsAsyncParams extends GetLogsAsyncParams {
  eventName: RestrictedPartialSaleTMEvents.ChangedExemptWalletList;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: RestrictedPartialSaleTMEvents.Pause;
  callback: EventCallback<RestrictedPartialSaleTMPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: RestrictedPartialSaleTMEvents.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: RestrictedPartialSaleTMEvents.Unpause;
  callback: EventCallback<RestrictedPartialSaleTMUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: RestrictedPartialSaleTMEvents.Unpause;
}

interface RestrictedPartialSaleTransferManagerSubscribeAsyncParams extends Subscribe {
  (params: ChangedExemptWalletListSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetRestrictedPartialSaleTransferManagerLogsAsyncParams extends GetLogs {
  (params: GetChangedExemptWalletListLogsAsyncParams): Promise<
    LogWithDecodedArgs<RestrictedPartialSaleTMChangedExemptWalletListEventArgs>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<RestrictedPartialSaleTMPauseEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<RestrictedPartialSaleTMUnpauseEventArgs>[]>;
}

export namespace RestrictedPartialSaleTransferManagerTransactionParams {
  export interface ChangeExemptWalletList extends ChangeExemptWalletListParams {}
}

/**
 * @param from Address of the sender
 * @param to Address of the receiver
 * @param amount
 * @param data
 */
interface VerifyTransferParams {
  from: string;
  to: string;
  amount: BigNumber;
  data: string;
}

/**
 * @param wallet Ethereum wallet/contract address that need to be exempted
 * @param exempted Boolean value used to add (i.e true) or remove (i.e false) from the list
 */
interface ChangeExemptWalletListParams extends TxParams {
  wallet: string;
  change: boolean;
}

/**
 * This class includes the functionality related to interacting with the Volume Restricted Partial Sale Transfer Manager contract.
 */
export default class RestrictedPartialSaleTransferManagerWrapper extends ModuleWrapper {
  protected contract: Promise<RestrictedPartialSaleTMContract>;

  /**
   * Instantiate RestrictedPartialSaleManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<RestrictedPartialSaleTMContract>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   *  Unpause the module
   */
  public unpause = async (params: TxParams) => {
    assert.assert(await this.paused(), ErrorCode.PreconditionRequired, 'Controller not currently paused');
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'Sender is not owner',
    );
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   *  Check if module paused
   *  @return boolean value
   */
  public paused = async (): Promise<boolean> => {
    return (await this.contract).paused.callAsync();
  };

  /**
   *  Pause the module
   */
  public pause = async (params: TxParams) => {
    assert.assert(!(await this.paused()), ErrorCode.ContractPaused, 'Controller currently paused');
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'Sender is not owner',
    );
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Used to verify the transfer transaction (View)
   * @return boolean transfer result, address
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
   * Use to return the list of exempted addresses
   */
  public getExemptAddresses = async (): Promise<string[]> => {
    return (await this.contract).getExemptAddresses.callAsync();
  };

  /**
   * Add/Remove wallet address from the exempt list
   */
  public changeExemptWalletList = async (params: ChangeExemptWalletListParams) => {
    assert.isNonZeroETHAddressHex('wallet', params.wallet);
    assert.assert(
      !(await this.getExemptAddresses()).includes(params.wallet) === params.change,
      ErrorCode.PreconditionRequired,
      'There will be no change to exempt list',
    );
    return (await this.contract).changeExemptWalletList.sendTransactionAsync(
      params.wallet,
      params.change,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * This function returns the signature of configure function
   */
  public getInitFunction = async (): Promise<string> => {
    return (await this.contract).getInitFunction.callAsync();
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: RestrictedPartialSaleTransferManagerSubscribeAsyncParams = async <
    ArgsType extends RestrictedPartialSaleTMEventArgs
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, RestrictedPartialSaleTMEvents);
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
  public getLogsAsync: GetRestrictedPartialSaleTransferManagerLogsAsyncParams = async <
    ArgsType extends RestrictedPartialSaleTMEventArgs
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, RestrictedPartialSaleTMEvents);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
    );
    return logs;
  };

  private checkRestrictionInputParams = (
    startTime: Date,
    endTime: Date,
    allowedTokens: BigNumber,
    restrictionType: RestrictionType,
    rollingPeriodInDays: number,
  ): void => {
    assert.isFutureDate(startTime, 'Start time must be in the future');
    assert.isBigNumberGreaterThanZero(allowedTokens, 'Allowed Tokens must be greater than 0');
    if (restrictionType === RestrictionType.Percentage) {
      assert.isPercentage('allowed tokens', allowedTokens);
    }
    assert.assert(
      rollingPeriodInDays <= 365 && rollingPeriodInDays >= 1,
      ErrorCode.InvalidData,
      'Invalid number of days in rolling period',
    );
    const diffDays = Math.ceil(Math.abs(endTime.getTime() - startTime.getTime()) / (1000 * 3600 * 24));
    assert.assert(
      new BigNumber(diffDays).isGreaterThanOrEqualTo(rollingPeriodInDays),
      ErrorCode.InvalidData,
      'Invalid times, rollingPeriodInDays must have less days than the duration',
    );
  };

  private decimalsByRestrictionType = async (restrictionType: RestrictionType): Promise<BigNumber> => {
    let decimals = PERCENTAGE_DECIMALS;
    if (restrictionType === RestrictionType.Fixed) {
      decimals = await (await this.securityTokenContract()).decimals.callAsync();
    }
    return decimals;
  };
}
