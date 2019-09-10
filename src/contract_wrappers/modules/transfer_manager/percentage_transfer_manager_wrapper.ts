import {
  PercentageTransferManagerContract_3_0_0,
  PercentageTransferManagerEventArgs_3_0_0,
  PercentageTransferManagerEvents_3_0_0,
  PercentageTransferManagerModifyHolderPercentageEventArgs_3_0_0,
  PercentageTransferManagerModifyWhitelistEventArgs_3_0_0,
  PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs_3_0_0,
  PercentageTransferManagerPauseEventArgs_3_0_0,
  PercentageTransferManagerUnpauseEventArgs_3_0_0,
  Web3Wrapper,
  LogWithDecodedArgs,
  BigNumber,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import ModuleWrapper from '../module_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Subscribe,
  GetLogs,
  Perm,
  PERCENTAGE_DECIMALS,
  ErrorCode,
} from '../../../types';
import { parseTransferResult, valueToWei, weiToValue } from '../../../utils/convert';

interface ModifyHolderPercentageSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.ModifyHolderPercentage;
  callback: EventCallback<PercentageTransferManagerModifyHolderPercentageEventArgs_3_0_0>;
}

interface GetModifyHolderPercentageLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.ModifyHolderPercentage;
}

interface ModifyWhitelistSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.ModifyWhitelist;
  callback: EventCallback<PercentageTransferManagerModifyWhitelistEventArgs_3_0_0>;
}

interface GetModifyWhitelistLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.ModifyWhitelist;
}

interface SetAllowPrimaryIssuanceSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.SetAllowPrimaryIssuance;
  callback: EventCallback<PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs_3_0_0>;
}

interface GetSetAllowPrimaryIssuanceLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.SetAllowPrimaryIssuance;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.Pause;
  callback: EventCallback<PercentageTransferManagerPauseEventArgs_3_0_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.Unpause;
  callback: EventCallback<PercentageTransferManagerUnpauseEventArgs_3_0_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents_3_0_0.Unpause;
}

interface PercentageTransferManagerSubscribeAsyncParams extends Subscribe {
  (params: ModifyHolderPercentageSubscribeAsyncParams): Promise<string>;
  (params: ModifyWhitelistSubscribeAsyncParams): Promise<string>;
  (params: SetAllowPrimaryIssuanceSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetPercentageTransferManagerLogsAsyncParams extends GetLogs {
  (params: GetModifyHolderPercentageLogsAsyncParams): Promise<
    LogWithDecodedArgs<PercentageTransferManagerModifyHolderPercentageEventArgs_3_0_0>[]
  >;
  (params: GetModifyWhitelistLogsAsyncParams): Promise<
    LogWithDecodedArgs<PercentageTransferManagerModifyWhitelistEventArgs_3_0_0>[]
  >;
  (params: GetSetAllowPrimaryIssuanceLogsAsyncParams): Promise<
    LogWithDecodedArgs<PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs_3_0_0>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<PercentageTransferManagerPauseEventArgs_3_0_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<PercentageTransferManagerUnpauseEventArgs_3_0_0>[]>;
}

export namespace PercentageTransferManagerTransactionParams {
  export interface ChangeHolderPercentage extends ChangeHolderPercentageParams {}
  export interface ModifyWhitelist extends ModifyWhitelistParams {}
  export interface ModifyWhitelistMulti extends ModifyWhitelistMultiParams {}
  export interface SetAllowPrimaryIssuance extends SetAllowPrimaryIssuanceParams {}
}

/**
 * @param investorAddress Address of the investor
 */
interface InvestorAddressParams {
  investorAddress: string;
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
 * @param maxHolderPercentage is the new maximum percentage
 */
interface ChangeHolderPercentageParams extends TxParams {
  maxHolderPercentage: BigNumber;
}

/**
 * @param investor is the address to whitelist
 * @param valid whether or not the address it to be added or removed from the whitelist
 */
interface ModifyWhitelistParams extends TxParams {
  investor: string;
  valid: boolean;
}

/**
 * @param investors Array of the addresses to whitelist
 * @param valids Array of boolean value to decide whether or not the address it to be added or removed from the whitelist
 */
interface ModifyWhitelistMultiParams extends TxParams {
  investors: string[];
  valids: boolean[];
}

/**
 * @param allowPrimaryIssuance whether to allow all primary issuance transfers
 */
interface SetAllowPrimaryIssuanceParams extends TxParams {
  allowPrimaryIssuance: boolean;
}

/**
 * This class includes the functionality related to interacting with the Percentage Transfer Manager contract.
 */
export default class PercentageTransferManagerWrapper extends ModuleWrapper {
  public contract: Promise<PercentageTransferManagerContract_3_0_0>;

  /**
   * Instantiate PercentageTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<PercentageTransferManagerContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Ignore transactions which are part of the primary issuance
   * @return boolean allowed
   */
  public allowPrimaryIssuance = async (): Promise<boolean> => {
    return (await this.contract).allowPrimaryIssuance.callAsync();
  };

  /**
   * Maximum percentage that any holder can have, multiplied by 10**16
   * @return percentage value
   */
  public maxHolderPercentage = async (): Promise<BigNumber> => {
    const result = await (await this.contract).maxHolderPercentage.callAsync();
    return weiToValue(result, PERCENTAGE_DECIMALS);
  };

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
   *  Check if module is paused
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
   * Addresses on this list are always able to send / receive tokens
   * @return boolean on whitelist
   */
  public whitelist = async (params: InvestorAddressParams): Promise<boolean> => {
    assert.isETHAddressHex('investorAddress', params.investorAddress);
    return (await this.contract).whitelist.callAsync(params.investorAddress);
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
   * Sets the maximum percentage that an individual token holder can hold
   */
  public changeHolderPercentage = async (params: ChangeHolderPercentageParams) => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isPercentage('maxHolderPercentage', params.maxHolderPercentage);
    return (await this.contract).changeHolderPercentage.sendTransactionAsync(
      valueToWei(params.maxHolderPercentage, PERCENTAGE_DECIMALS),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Adds or removes single addresses from the whitelist.
   */
  public modifyWhitelist = async (params: ModifyWhitelistParams) => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isETHAddressHex('investor', params.investor);
    return (await this.contract).modifyWhitelist.sendTransactionAsync(
      params.investor,
      params.valid,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Adds or removes addresses from the whitelist.
   */
  public modifyWhitelistMulti = async (params: ModifyWhitelistMultiParams) => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.assert(
      params.investors.length === params.valids.length,
      ErrorCode.MismatchedArrayLength,
      'Array lengths are not equal for investors and valids',
    );
    params.investors.forEach(address => assert.isETHAddressHex('investors', address));
    return (await this.contract).modifyWhitelistMulti.sendTransactionAsync(
      params.investors,
      params.valids,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Sets whether or not to consider primary issuance transfers
   */
  public setAllowPrimaryIssuance = async (params: SetAllowPrimaryIssuanceParams) => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.assert(
      (await this.allowPrimaryIssuance()) !== params.allowPrimaryIssuance,
      ErrorCode.PreconditionRequired,
      'AllowPrimaryIssuance value must change ',
    );
    return (await this.contract).setAllowPrimaryIssuance.sendTransactionAsync(
      params.allowPrimaryIssuance,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: PercentageTransferManagerSubscribeAsyncParams = async <
    ArgsType extends PercentageTransferManagerEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PercentageTransferManagerEvents_3_0_0);
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
  public getLogsAsync: GetPercentageTransferManagerLogsAsyncParams = async <
    ArgsType extends PercentageTransferManagerEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PercentageTransferManagerEvents_3_0_0);
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
