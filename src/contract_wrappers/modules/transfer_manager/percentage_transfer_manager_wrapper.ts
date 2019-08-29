import {
  PercentageTransferManagerContract,
  PercentageTransferManagerEventArgs,
  PercentageTransferManagerEvents,
  PercentageTransferManagerModifyHolderPercentageEventArgs,
  PercentageTransferManagerModifyWhitelistEventArgs,
  PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs,
  PercentageTransferManagerPauseEventArgs,
  PercentageTransferManagerUnpauseEventArgs,
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
  eventName: PercentageTransferManagerEvents.ModifyHolderPercentage;
  callback: EventCallback<PercentageTransferManagerModifyHolderPercentageEventArgs>;
}

interface GetModifyHolderPercentageLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents.ModifyHolderPercentage;
}

interface ModifyWhitelistSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents.ModifyWhitelist;
  callback: EventCallback<PercentageTransferManagerModifyWhitelistEventArgs>;
}

interface GetModifyWhitelistLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents.ModifyWhitelist;
}

interface SetAllowPrimaryIssuanceSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents.SetAllowPrimaryIssuance;
  callback: EventCallback<PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs>;
}

interface GetSetAllowPrimaryIssuanceLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents.SetAllowPrimaryIssuance;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents.Pause;
  callback: EventCallback<PercentageTransferManagerPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents.Unpause;
  callback: EventCallback<PercentageTransferManagerUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents.Unpause;
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
    LogWithDecodedArgs<PercentageTransferManagerModifyHolderPercentageEventArgs>[]
  >;
  (params: GetModifyWhitelistLogsAsyncParams): Promise<
    LogWithDecodedArgs<PercentageTransferManagerModifyWhitelistEventArgs>[]
  >;
  (params: GetSetAllowPrimaryIssuanceLogsAsyncParams): Promise<
    LogWithDecodedArgs<PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<PercentageTransferManagerPauseEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<PercentageTransferManagerUnpauseEventArgs>[]>;
}

interface InvestorAddressParams {
  investorAddress: string;
}

interface VerifyTransferParams {
  from: string;
  to: string;
  amount: BigNumber;
  data: string;
}

interface ChangeHolderPercentageParams extends TxParams {
  maxHolderPercentage: BigNumber;
}

interface ModifyWhitelistParams extends TxParams {
  investor: string;
  valid: boolean;
}

interface ModifyWhitelistMultiParams extends TxParams {
  investors: string[];
  valids: boolean[];
}

interface SetAllowPrimaryIssuanceParams extends TxParams {
  allowPrimaryIssuance: boolean;
}

/**
 * This class includes the functionality related to interacting with the Percentage Transfer Manager contract.
 */
export default class PercentageTransferManagerWrapper extends ModuleWrapper {
  protected contract: Promise<PercentageTransferManagerContract>;

  /**
   * Instantiate PercentageTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<PercentageTransferManagerContract>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  public allowPrimaryIssuance = async () => {
    return (await this.contract).allowPrimaryIssuance.callAsync();
  };

  public maxHolderPercentage = async () => {
    const result = await (await this.contract).maxHolderPercentage.callAsync();
    return weiToValue(result, PERCENTAGE_DECIMALS);
  };

  public unpause = async (params: TxParams) => {
    assert.assert(await this.paused(), ErrorCode.PreconditionRequired, 'Controller not currently paused');
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'Sender is not owner',
    );
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  public pause = async (params: TxParams) => {
    assert.assert(!(await this.paused()), ErrorCode.ContractPaused, 'Controller currently paused');
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'Sender is not owner',
    );
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public whitelist = async (params: InvestorAddressParams) => {
    assert.isETHAddressHex('investorAddress', params.investorAddress);
    return (await this.contract).whitelist.callAsync(params.investorAddress);
  };

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
    ArgsType extends PercentageTransferManagerEventArgs
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PercentageTransferManagerEvents);
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
    ArgsType extends PercentageTransferManagerEventArgs
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PercentageTransferManagerEvents);
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
