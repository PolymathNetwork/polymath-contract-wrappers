import {
  PercentageTransferManagerContract,
  PercentageTransferManagerEventArgs,
  PercentageTransferManagerEvents,
  PercentageTransferManagerModifyHolderPercentageEventArgs,
  PercentageTransferManagerModifyWhitelistEventArgs,
  PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs,
  PercentageTransferManagerPauseEventArgs,
  PercentageTransferManagerUnpauseEventArgs
} from '@polymathnetwork/abi-wrappers';
import { PercentageTransferManager } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import {
  TxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
  ISubscribe,
  IGetLogs
} from '../../../types';
import { assert } from '../../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { ModuleWrapper } from '../module_wrapper';
  
interface IModifyHolderPercentageSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents.ModifyHolderPercentage,
  callback: EventCallback<PercentageTransferManagerModifyHolderPercentageEventArgs>,
}

interface IGetModifyHolderPercentageLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents.ModifyHolderPercentage,
}

interface IModifyWhitelistSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents.ModifyWhitelist,
  callback: EventCallback<PercentageTransferManagerModifyWhitelistEventArgs>,
}

interface IGetModifyWhitelistLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents.ModifyWhitelist,
}

interface ISetAllowPrimaryIssuanceSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents.SetAllowPrimaryIssuance,
  callback: EventCallback<PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs>,
}

interface IGetSetAllowPrimaryIssuanceLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents.SetAllowPrimaryIssuance,
}

interface IPauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents.Pause,
  callback: EventCallback<PercentageTransferManagerPauseEventArgs>,
}

interface IGetPauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents.Pause,
}

interface IUnpauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: PercentageTransferManagerEvents.Unpause,
  callback: EventCallback<PercentageTransferManagerUnpauseEventArgs>,
}

interface IGetUnpauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: PercentageTransferManagerEvents.Unpause,
}

interface IPercentageTransferManagerSubscribeAsyncParams extends ISubscribe {
  (params: IModifyHolderPercentageSubscribeAsyncParams): Promise<string>,
  (params: IModifyWhitelistSubscribeAsyncParams): Promise<string>,
  (params: ISetAllowPrimaryIssuanceSubscribeAsyncParams): Promise<string>,
  (params: IPauseSubscribeAsyncParams): Promise<string>,
  (params: IUnpauseSubscribeAsyncParams): Promise<string>,
}

interface IGetPercentageTransferManagerLogsAsyncParams extends IGetLogs {
  (params: IGetModifyHolderPercentageLogsAsyncParams): Promise<Array<LogWithDecodedArgs<PercentageTransferManagerModifyHolderPercentageEventArgs>>>,
  (params: IGetModifyWhitelistLogsAsyncParams): Promise<Array<LogWithDecodedArgs<PercentageTransferManagerModifyWhitelistEventArgs>>>,
  (params: IGetSetAllowPrimaryIssuanceLogsAsyncParams): Promise<Array<LogWithDecodedArgs<PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs>>>,
  (params: IGetPauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<PercentageTransferManagerPauseEventArgs>>>,
  (params: IGetUnpauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<PercentageTransferManagerUnpauseEventArgs>>>,
}

interface InvestorAddressParams {
  investorAddress: string,
}

interface VerifyTransferParams extends TxParams {
  from: string,
  to: string,
  amount: BigNumber,
  data: string,
  isTransfer: boolean,
}

interface ConfigureParams extends TxParams {
  maxHolderPercentage: BigNumber,
  allowPrimaryIssuance: boolean,
}

interface ChangeHolderPercentageParams extends TxParams {
  maxHolderPercentage: BigNumber,
}

interface ModifyWhitelistParams extends TxParams {
  investor: string,
  valid: boolean,
}

interface ModifyWhitelistMultiParams extends TxParams {
  investors: string[],
  valids: boolean[],
}

interface SetAllowPrimaryIssuanceParams extends TxParams {
  allowPrimaryIssuance: boolean,
}

/**
 * This class includes the functionality related to interacting with the Percentage Transfer Manager contract.
 */
export class PercentageTransferManagerWrapper extends ModuleWrapper {
  public abi: ContractAbi = PercentageTransferManager.abi;
  protected _contract: Promise<PercentageTransferManagerContract>;

  /**
   * Instantiate PercentageTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param address The address of the GTM
   */
  constructor(web3Wrapper: Web3Wrapper, address: string) {
    super(web3Wrapper, address);
    this._contract = this._getPercentageTransferManagerContract();
  }

  public allowPrimaryIssuance = async () => {
    return await (await this._contract).allowPrimaryIssuance.callAsync();
  }

  public maxHolderPercentage = async () => {
    return await (await this._contract).maxHolderPercentage.callAsync();
  }

  public unpause = async (params: TxParams) => {
    return (await this._contract).unpause.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  }

  public paused = async () => {
    return await (await this._contract).paused.callAsync();
  }

  public pause = async (params: TxParams) => {
    return (await this._contract).pause.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  } 

  public whitelist = async (params: InvestorAddressParams) => {
    return await (await this._contract).whitelist.callAsync(
      params.investorAddress,
    );
  }

  public verifyTransfer = async (params: VerifyTransferParams) => {
    return (await this._contract).verifyTransfer.sendTransactionAsync(
      params.from,
      params.to,
      params.amount,
      params.data,
      params.isTransfer,
      params.txData,
      params.safetyFactor
    );
  }

  public configure = async (params: ConfigureParams) => {
    return (await this._contract).configure.sendTransactionAsync(
      params.maxHolderPercentage,
      params.allowPrimaryIssuance,
      params.txData,
      params.safetyFactor
    );
  }

  public changeHolderPercentage = async (params: ChangeHolderPercentageParams) => {
    return (await this._contract).changeHolderPercentage.sendTransactionAsync(
      params.maxHolderPercentage,
      params.txData,
      params.safetyFactor
    );
  }

  public modifyWhitelist = async (params: ModifyWhitelistParams) => {
    return (await this._contract).modifyWhitelist.sendTransactionAsync(
      params.investor,
      params.valid,
      params.txData,
      params.safetyFactor
    );
  }

  public modifyWhitelistMulti = async (params: ModifyWhitelistMultiParams) => {
    return (await this._contract).modifyWhitelistMulti.sendTransactionAsync(
      params.investors,
      params.valids,
      params.txData,
      params.safetyFactor
    );
  }

  public setAllowPrimaryIssuance = async (params: SetAllowPrimaryIssuanceParams) => {
    return (await this._contract).setAllowPrimaryIssuance.sendTransactionAsync(
      params.allowPrimaryIssuance,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: IPercentageTransferManagerSubscribeAsyncParams = async <ArgsType extends PercentageTransferManagerEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PercentageTransferManagerEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      PercentageTransferManager.abi,
      params.callback,
      !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetPercentageTransferManagerLogsAsyncParams = async <ArgsType extends PercentageTransferManagerEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PercentageTransferManagerEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      PercentageTransferManager.abi,
    );
    return logs;
  }
  
  private async _getPercentageTransferManagerContract(): Promise<PercentageTransferManagerContract> {
    return new PercentageTransferManagerContract(
      this.abi,
      this._address,
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
  