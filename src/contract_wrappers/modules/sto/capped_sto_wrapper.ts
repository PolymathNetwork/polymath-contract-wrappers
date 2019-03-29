import {
  CappedSTOContract,
  CappedSTOEventArgs,
  CappedSTOEvents,
  CappedSTOTokenPurchaseEventArgs,
  CappedSTOSetAllowBeneficialInvestmentsEventArgs,
  CappedSTOSetFundRaiseTypesEventArgs,
  CappedSTOPauseEventArgs,
  CappedSTOUnpauseEventArgs
} from '@polymathnetwork/abi-wrappers';
import { CappedSTO } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import {
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
  TxParams,
  TxPayableParams,
  ISubscribe,
  IGetLogs,
} from '../../../types';
import { assert } from '../../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { STOWrapper } from './sto_wrapper';

interface ITokenPurchaseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: CappedSTOEvents.TokenPurchase,
  callback: EventCallback<CappedSTOTokenPurchaseEventArgs>,
}

interface IGetTokenPurchaseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: CappedSTOEvents.TokenPurchase,
}

interface ISetAllowBeneficialInvestmentsSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: CappedSTOEvents.SetAllowBeneficialInvestments,
  callback: EventCallback<CappedSTOSetAllowBeneficialInvestmentsEventArgs>,
}

interface IGetSetAllowBeneficialInvestmentsLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: CappedSTOEvents.SetAllowBeneficialInvestments,
}

interface ISetFundRaiseTypesSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: CappedSTOEvents.SetFundRaiseTypes,
  callback: EventCallback<CappedSTOSetFundRaiseTypesEventArgs>,
}

interface IGetSetFundRaiseTypesLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: CappedSTOEvents.SetFundRaiseTypes,
}

interface IPauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: CappedSTOEvents.Pause,
  callback: EventCallback<CappedSTOPauseEventArgs>,
}

interface IGetPauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: CappedSTOEvents.Pause,
}

interface IUnpauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: CappedSTOEvents.Unpause,
  callback: EventCallback<CappedSTOUnpauseEventArgs>,
}

interface IGetUnpauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: CappedSTOEvents.Unpause,
}

interface ICappedSTOSubscribeAsyncParams extends ISubscribe {
  (params: ITokenPurchaseSubscribeAsyncParams): Promise<string>,
  (params: ISetAllowBeneficialInvestmentsSubscribeAsyncParams): Promise<string>,
  (params: ISetFundRaiseTypesSubscribeAsyncParams): Promise<string>,
  (params: IPauseSubscribeAsyncParams): Promise<string>,
  (params: IUnpauseSubscribeAsyncParams): Promise<string>,
}

interface IGetCappedSTOLogsAsyncParams extends IGetLogs {
  (params: IGetTokenPurchaseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<CappedSTOTokenPurchaseEventArgs>>>,
  (params: IGetSetAllowBeneficialInvestmentsLogsAsyncParams): Promise<Array<LogWithDecodedArgs<CappedSTOSetAllowBeneficialInvestmentsEventArgs>>>,
  (params: IGetSetFundRaiseTypesLogsAsyncParams): Promise<Array<LogWithDecodedArgs<CappedSTOSetFundRaiseTypesEventArgs>>>,
  (params: IGetPauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<CappedSTOPauseEventArgs>>>,
  (params: IGetUnpauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<CappedSTOUnpauseEventArgs>>>,
}

interface InvestorsParams extends TxParams {
  amount: string,
}

interface ConfigureParams extends TxParams {
  startTime: BigNumber,
  endTime: BigNumber,
  cap: BigNumber,
  rate: BigNumber,
  fundRaiseTypes: Array<number|BigNumber>,
  fundsReceiver: string,
}

interface ChangeAllowBeneficialInvestmentsParams extends TxParams {
  allowBeneficialInvestments: boolean,
}

interface BuyTokensParams extends TxPayableParams {
  beneficiary: string,
}

interface BuyTokensWithPolyParams extends TxParams {
  investedPOLY: BigNumber,
}

//// Return types ////
interface CappedSTODetails {
  /** Timestamp at which offering gets start. */
  startTime: BigNumber,
  /** Timestamp at which offering ends. */
  endTime: BigNumber,
  /** Number of token base units this STO will be allowed to sell to investors. */
  cap: BigNumber,
  /** Token units a buyer gets(multiplied by 10^18) per wei / base unit of POLY */
  rate: BigNumber,
  /** Amount of funds raised */
  fundsRaised: BigNumber,
  /** Number of individual investors this STO have. */
  investorCount: BigNumber,
  /** Amount of tokens get sold. */
  totalTokensSold: BigNumber,
  /** Boolean value to justify whether the fund raise type is POLY or not, i.e true for POLY. */
  isRaisedInPoly: boolean,
}
//// End of return types ////

/**
 * This class includes the functionality related to interacting with the CappedSTO contract.
 */
export class CappedSTOWrapper extends STOWrapper {
  public abi: ContractAbi = CappedSTO.abi;
  protected _contract: Promise<CappedSTOContract>;
  /**
   * Instantiate CappedSTOWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, address: string) {
    super(web3Wrapper, address);
    this._contract = this._getCappedSTOContract();
  }

  /**
   * How many token units a buyer gets (multiplied by 10^18) per wei / base unit of POLY
   */
  public rate = async () => {
    return await (await this._contract).rate.callAsync();
  }

  /**
   * How many token base units this STO will be allowed to sell to investors
   */
  public cap = async () => {
    return await (await this._contract).cap.callAsync();
  }

  public allowBeneficialInvestments = async() => {
    return await (await this._contract).allowBeneficialInvestments.callAsync();
  }

  public paused = async() => {
    return await (await this._contract).paused.callAsync();
  }

  public investors = async(params: InvestorsParams) => {
    return await (await this._contract).investors.callAsync(
      params.amount,
    );
  }

  public configure = async (params: ConfigureParams) => {
    return (await this._contract).configure.sendTransactionAsync(
      params.startTime,
      params.endTime,
      params.cap,
      params.rate,
      params.fundRaiseTypes,
      params.fundsReceiver,
      params.txData,
      params.safetyFactor,
    );
  }

  public changeAllowBeneficialInvestments = async (params: ChangeAllowBeneficialInvestmentsParams) => {
    return (await this._contract).changeAllowBeneficialInvestments.sendTransactionAsync(
      params.allowBeneficialInvestments,
      params.txData,
      params.safetyFactor,
    );
  }
  
  public buyTokens = async (params: BuyTokensParams) => {
    return (await this._contract).buyTokens.sendTransactionAsync(
      params.beneficiary,
      params.txData,
      params.safetyFactor,
    );
  }

  public buyTokensWithPoly = async (params: BuyTokensWithPolyParams) => {
    return (await this._contract).buyTokensWithPoly.sendTransactionAsync(
      params.investedPOLY,
      params.txData,
      params.safetyFactor,
    );
  }

  public capReached = async() => {
    return await (await this._contract).capReached.callAsync();
  }

  public getTokensSold = async() => {
    return await (await this._contract).getTokensSold.callAsync();
  }

  public getSTODetails = async() => {
    const result = await (await this._contract).getSTODetails.callAsync();
    const typedResult: CappedSTODetails = {
      startTime: result[0],
      endTime: result[1],
      cap: result[2],
      rate: result[3],
      fundsRaised: result[4],
      investorCount: result[5],
      totalTokensSold: result[6],
      isRaisedInPoly: result[7],
    }
    return typedResult;
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: ICappedSTOSubscribeAsyncParams = async <ArgsType extends CappedSTOEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        CappedSTO.abi,
        params.callback,
        !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetCappedSTOLogsAsyncParams = async <ArgsType extends CappedSTOEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        CappedSTO.abi,
    );
    return logs;
  }

  private async _getCappedSTOContract(): Promise<CappedSTOContract> {
    return new CappedSTOContract(
      this.abi,
      this._address,
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
