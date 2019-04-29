import {
  PercentageTransferManagerContract,
  PercentageTransferManagerEventArgs,
  PercentageTransferManagerEvents,
  PercentageTransferManagerModifyHolderPercentageEventArgs,
  PercentageTransferManagerModifyWhitelistEventArgs,
  PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs,
  PercentageTransferManagerPauseEventArgs,
  PercentageTransferManagerUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { PercentageTransferManager } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
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
  Perms,
} from '../../../types';

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

interface VerifyTransferParams extends TxParams {
  from: string;
  to: string;
  amount: BigNumber;
  data: string;
  isTransfer: boolean;
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
  public abi: ContractAbi = PercentageTransferManager.abi;

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
    return (await this.contract).maxHolderPercentage.callAsync();
  };

  public unpause = async (params: TxParams) => {
    await this.checkIsPaused();
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  public pause = async (params: TxParams) => {
    await this.checkIsNotPaused();
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public whitelist = async (params: InvestorAddressParams) => {
    assert.isETHAddressHex('investorAddress', params.investorAddress);
    return (await this.contract).whitelist.callAsync(params.investorAddress);
  };

  public verifyTransfer = async (params: VerifyTransferParams) => {
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    return (await this.contract).verifyTransfer.sendTransactionAsync(
      params.from,
      params.to,
      params.amount,
      params.data,
      params.isTransfer,
      params.txData,
      params.safetyFactor,
    );
  };

  public changeHolderPercentage = async (params: ChangeHolderPercentageParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Admin), 'Caller is not allowed');
    return (await this.contract).changeHolderPercentage.sendTransactionAsync(
      params.maxHolderPercentage,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyWhitelist = async (params: ModifyWhitelistParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Whitelist), 'Caller is not allowed');
    assert.isETHAddressHex('investor', params.investor);
    return (await this.contract).modifyWhitelist.sendTransactionAsync(
      params.investor,
      params.valid,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyWhitelistMulti = async (params: ModifyWhitelistMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Whitelist), 'Caller is not allowed');
    assert.assert(
      params.investors.length === params.valids.length,
      'Array lengths are not equal for investors and valids',
    );
    assert.isETHAddressHexArray('investors', params.investors);
    return (await this.contract).modifyWhitelistMulti.sendTransactionAsync(
      params.investors,
      params.valids,
      params.txData,
      params.safetyFactor,
    );
  };

  public setAllowPrimaryIssuance = async (params: SetAllowPrimaryIssuanceParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Admin), 'Caller is not allowed');
    assert.assert(
      (await this.allowPrimaryIssuance()) !== params.allowPrimaryIssuance,
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
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      PercentageTransferManager.abi,
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
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      PercentageTransferManager.abi,
    );
    return logs;
  };

  private checkIsNotPaused = async () => {
    assert.assert(!(await this.paused()), 'Controller currently paused');
  };

  private checkIsPaused = async () => {
    assert.assert(await this.paused(), 'Controller not currently paused');
  };
}
