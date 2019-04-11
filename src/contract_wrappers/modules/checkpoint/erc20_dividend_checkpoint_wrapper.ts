import {
  ERC20DividendCheckpointContract,
  ERC20DividendCheckpointEventArgs,
  ERC20DividendCheckpointEvents,
  ERC20DividendCheckpointERC20DividendDepositedEventArgs,
  ERC20DividendCheckpointERC20DividendClaimedEventArgs,
  ERC20DividendCheckpointERC20DividendReclaimedEventArgs,
  ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs,
  ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs,
  ERC20DividendCheckpointSetWithholdingEventArgs,
  ERC20DividendCheckpointSetWithholdingFixedEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { ERC20DividendCheckpoint } from '@polymathnetwork/contract-artifacts';
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
import {
  numberToBigNumber,
  dateToBigNumber, stringToBytes32,
} from '../../../utils/convert';
import { assert } from '../../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { DividendCheckpointWrapper } from './dividend_checkpoint_wrapper';
  
interface IERC20DividendDepositedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendDeposited,
  callback: EventCallback<ERC20DividendCheckpointERC20DividendDepositedEventArgs>,
}

interface IGetERC20DividendDepositedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendDeposited,
}

interface IERC20DividendClaimedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendClaimed,
  callback: EventCallback<ERC20DividendCheckpointERC20DividendClaimedEventArgs>,
}

interface IGetERC20DividendClaimedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendClaimed,
}

interface IERC20DividendReclaimedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendReclaimed,
  callback: EventCallback<ERC20DividendCheckpointERC20DividendReclaimedEventArgs>,
}

interface IGetERC20DividendReclaimedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendReclaimed,
}

interface IERC20DividendWithholdingWithdrawnSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendWithholdingWithdrawn,
  callback: EventCallback<ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs>,
}

interface IGetERC20DividendWithholdingWithdrawnLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendWithholdingWithdrawn,
}

interface ISetDefaultExcludedAddressesSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents.SetDefaultExcludedAddresses,
  callback: EventCallback<ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs>,
}

interface IGetSetDefaultExcludedAddressesLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents.SetDefaultExcludedAddresses,
}

interface ISetWithholdingSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents.SetWithholding,
  callback: EventCallback<ERC20DividendCheckpointSetWithholdingEventArgs>,
}

interface IGetSetWithholdingLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents.SetWithholding,
}

interface ISetWithholdingFixedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents.SetWithholdingFixed,
  callback: EventCallback<ERC20DividendCheckpointSetWithholdingFixedEventArgs>,
}

interface IGetSetWithholdingFixedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents.SetWithholdingFixed,
}

interface IERC20DividendCheckpointSubscribeAsyncParams extends ISubscribe {
  (params: IERC20DividendDepositedSubscribeAsyncParams): Promise<string>,
  (params: IERC20DividendClaimedSubscribeAsyncParams): Promise<string>,
  (params: IERC20DividendReclaimedSubscribeAsyncParams): Promise<string>,
  (params: IERC20DividendWithholdingWithdrawnSubscribeAsyncParams): Promise<string>,
  (params: ISetDefaultExcludedAddressesSubscribeAsyncParams): Promise<string>,
  (params: ISetWithholdingSubscribeAsyncParams): Promise<string>,
  (params: ISetWithholdingFixedSubscribeAsyncParams): Promise<string>,
}

interface IGetERC20DividendCheckpointLogsAsyncParams extends IGetLogs {
  (params: IGetERC20DividendDepositedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendDepositedEventArgs>>>,
  (params: IGetERC20DividendClaimedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendClaimedEventArgs>>>,
  (params: IGetERC20DividendReclaimedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendReclaimedEventArgs>>>,
  (params: IGetERC20DividendWithholdingWithdrawnLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs>>>,
  (params: IGetSetDefaultExcludedAddressesLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs>>>,
  (params: IGetSetWithholdingLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ERC20DividendCheckpointSetWithholdingEventArgs>>>,
  (params: IGetSetWithholdingFixedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ERC20DividendCheckpointSetWithholdingFixedEventArgs>>>,
}
    
interface DividendIndexParams {
  dividendIndex: number
}

interface CreateDividendParams extends TxParams {
  maturity: Date,
  expiry: Date,
  token: string,
  amount: BigNumber,
  name: string,
}

interface CreateDividendWithCheckpointParams extends CreateDividendParams {
  checkpointId: number,
}

interface CreateDividendWithExclusionsParams extends CreateDividendParams {
  excluded: string[],
}

interface CreateDividendWithCheckpointAndExclusionsParams extends CreateDividendParams {
  checkpointId: number,
  excluded: string[],
}

  
/**
 * This class includes the functionality related to interacting with the ERC20DividendCheckpoint contract.
 */
export class ERC20DividendCheckpointWrapper extends DividendCheckpointWrapper {
  public abi: ContractAbi = ERC20DividendCheckpoint.abi;
  protected _contract: Promise<ERC20DividendCheckpointContract>;

  /**
   * Instantiate ERC20DividendCheckpointWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  constructor(web3Wrapper: Web3Wrapper, contract: Promise<ERC20DividendCheckpointContract>) {
    super(web3Wrapper, contract);
    this._contract = contract;
  }

  public dividendTokens = async (params: DividendIndexParams) => {
    return await (await this._contract).dividendTokens.callAsync(
      numberToBigNumber(params.dividendIndex),
    );
  }

  public createDividend = async (params: CreateDividendParams) => {
    return (await this._contract).createDividend.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.token,
      params.amount,
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor
    );
  }

  public createDividendWithCheckpoint = async (params: CreateDividendWithCheckpointParams) => {
    return (await this._contract).createDividendWithCheckpoint.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.token,
      params.amount,
      numberToBigNumber(params.checkpointId),
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor
    );
  }

  public createDividendWithExclusions = async (params: CreateDividendWithExclusionsParams) => {
    return (await this._contract).createDividendWithExclusions.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.token,
      params.amount,
      params.excluded,
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor
    );
  }

  public createDividendWithCheckpointAndExclusions = async (params: CreateDividendWithCheckpointAndExclusionsParams) => {
    return (await this._contract).createDividendWithCheckpointAndExclusions.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.token,
      params.amount,
      numberToBigNumber(params.checkpointId),
      params.excluded,
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: IERC20DividendCheckpointSubscribeAsyncParams = async <ArgsType extends ERC20DividendCheckpointEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ERC20DividendCheckpointEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      ERC20DividendCheckpoint.abi,
      params.callback,
      !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetERC20DividendCheckpointLogsAsyncParams = async <ArgsType extends ERC20DividendCheckpointEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ERC20DividendCheckpointEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      ERC20DividendCheckpoint.abi,
    );
    return logs;
  }
}
  
