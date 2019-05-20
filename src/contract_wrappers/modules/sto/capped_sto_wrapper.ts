import {
  CappedSTOContract,
  CappedSTOEventArgs,
  CappedSTOEvents,
  CappedSTOTokenPurchaseEventArgs,
  CappedSTOSetAllowBeneficialInvestmentsEventArgs,
  CappedSTOSetFundRaiseTypesEventArgs,
  CappedSTOPauseEventArgs,
  CappedSTOUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { CappedSTO } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import STOWrapper from './sto_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  TxParams,
  Subscribe,
  GetLogs,
  FundRaiseType,
} from '../../../types';
import { bigNumberToDate } from '../../../utils/convert';

interface TokenPurchaseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents.TokenPurchase;
  callback: EventCallback<CappedSTOTokenPurchaseEventArgs>;
}

interface GetTokenPurchaseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents.TokenPurchase;
}

interface SetAllowBeneficialInvestmentsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents.SetAllowBeneficialInvestments;
  callback: EventCallback<CappedSTOSetAllowBeneficialInvestmentsEventArgs>;
}

interface GetSetAllowBeneficialInvestmentsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents.SetAllowBeneficialInvestments;
}

interface SetFundRaiseTypesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents.SetFundRaiseTypes;
  callback: EventCallback<CappedSTOSetFundRaiseTypesEventArgs>;
}

interface GetSetFundRaiseTypesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents.SetFundRaiseTypes;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents.Pause;
  callback: EventCallback<CappedSTOPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents.Unpause;
  callback: EventCallback<CappedSTOUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents.Unpause;
}

interface CappedSTOSubscribeAsyncParams extends Subscribe {
  (params: TokenPurchaseSubscribeAsyncParams): Promise<string>;
  (params: SetAllowBeneficialInvestmentsSubscribeAsyncParams): Promise<string>;
  (params: SetFundRaiseTypesSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetCappedSTOLogsAsyncParams extends GetLogs {
  (params: GetTokenPurchaseLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOTokenPurchaseEventArgs>[]>;
  (params: GetSetAllowBeneficialInvestmentsLogsAsyncParams): Promise<
    LogWithDecodedArgs<CappedSTOSetAllowBeneficialInvestmentsEventArgs>[]
  >;
  (params: GetSetFundRaiseTypesLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOSetFundRaiseTypesEventArgs>[]>;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOPauseEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOUnpauseEventArgs>[]>;
}

interface InvestorsParams extends TxParams {
  amount: string;
}

interface ChangeAllowBeneficialInvestmentsParams extends TxParams {
  allowBeneficialInvestments: boolean;
}

interface BuyTokensParams extends TxParams {
  beneficiary: string;
  value: BigNumber;
}

interface BuyTokensWithPolyParams extends TxParams {
  investedPOLY: BigNumber;
}

// // Return types ////
interface CappedSTODetails {
  /** Timestamp at which offering gets start. */
  startTime: Date;
  /** Timestamp at which offering ends. */
  endTime: Date;
  /** Number of token base units this STO will be allowed to sell to investors. */
  cap: BigNumber;
  /** Token units a buyer gets(multiplied by 10^18) per wei / base unit of POLY */
  rate: BigNumber;
  /** Amount of funds raised */
  fundsRaised: BigNumber;
  /** Number of individual investors this STO have. */
  investorCount: number;
  /** Amount of tokens get sold. */
  totalTokensSold: BigNumber;
  /** Boolean value to justify whether the fund raise type is POLY or not, i.e true for POLY. */
  isRaisedInPoly: boolean;
}
// // End of return types ////

/**
 * This class includes the functionality related to interacting with the CappedSTO contract.
 */
export default class CappedSTOWrapper extends STOWrapper {
  public abi: ContractAbi = CappedSTO.abi;

  protected contract: Promise<CappedSTOContract>;

  /**
   * Instantiate CappedSTOWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<CappedSTOContract>, contractFactory: ContractFactory) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * How many token units a buyer gets (multiplied by 10^18) per wei / base unit of POLY
   */
  public rate = async () => {
    return (await this.contract).rate.callAsync();
  };

  /**
   * How many token base units this STO will be allowed to sell to investors
   */
  public cap = async () => {
    return (await this.contract).cap.callAsync();
  };

  public allowBeneficialInvestments = async () => {
    return (await this.contract).allowBeneficialInvestments.callAsync();
  };

  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  public investors = async (params: InvestorsParams) => {
    return (await this.contract).investors.callAsync(params.amount);
  };

  public changeAllowBeneficialInvestments = async (params: ChangeAllowBeneficialInvestmentsParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    assert.assert(
      (await this.allowBeneficialInvestments()) !== params.allowBeneficialInvestments,
      'Does not change value',
    );
    return (await this.contract).changeAllowBeneficialInvestments.sendTransactionAsync(
      params.allowBeneficialInvestments,
      params.txData,
      params.safetyFactor,
    );
  };

  public buyTokens = async (params: BuyTokensParams) => {
    assert.isNonZeroETHAddressHex('beneficiary', params.beneficiary);
    assert.assert(!(await this.paused()), 'Should not be paused');
    assert.isBigNumberGreaterThanZero(params.value, 'Amount invested should not be equal to 0');
    assert.assert(
      await this.fundRaiseTypes({
        type: FundRaiseType.ETH,
      }),
      'Mode of investment is not ETH',
    );
    if (await this.allowBeneficialInvestments()) {
      assert.assert(
        params.beneficiary === (await this.getCallerAddress(params.txData)),
        'Beneficiary address does not match msg.sender',
      );
    }
    assert.isPastDate(bigNumberToDate(await this.startTime()), 'Offering is not yet started');
    assert.isFutureDate(bigNumberToDate(await this.endTime()), 'Offering is closed');
    const txPayableData = {
      ...params.txData,
      value: params.value,
    };
    return (await this.contract).buyTokens.sendTransactionAsync(params.beneficiary, txPayableData, params.safetyFactor);
  };

  public buyTokensWithPoly = async (params: BuyTokensWithPolyParams) => {
    assert.isBigNumberGreaterThanZero(params.investedPOLY, 'Amount invested should not be equal to 0');
    assert.assert(!(await this.paused()), 'Should not be paused');
    assert.assert(
      await this.fundRaiseTypes({
        type: FundRaiseType.POLY,
      }),
      'Mode of investment is not POLY',
    );
    const polyTokenBalance = await (await this.polyTokenContract()).balanceOf.callAsync(
      await this.getCallerAddress(params.txData),
    );
    assert.assert(
      polyTokenBalance.isGreaterThanOrEqualTo(params.investedPOLY),
      'Budget less than amount unable to transfer fee',
    );
    assert.isPastDate(bigNumberToDate(await this.startTime()), 'Offering is not yet started');
    assert.isFutureDate(bigNumberToDate(await this.endTime()), 'Offering is closed');
    return (await this.contract).buyTokensWithPoly.sendTransactionAsync(
      params.investedPOLY,
      params.txData,
      params.safetyFactor,
    );
  };

  public capReached = async () => {
    return (await this.contract).capReached.callAsync();
  };

  public getTokensSold = async () => {
    return (await this.contract).getTokensSold.callAsync();
  };

  public getSTODetails = async () => {
    const result = await (await this.contract).getSTODetails.callAsync();
    const typedResult: CappedSTODetails = {
      startTime: bigNumberToDate(result[0]),
      endTime: bigNumberToDate(result[1]),
      cap: result[2],
      rate: result[3],
      fundsRaised: result[4],
      investorCount: result[5].toNumber(),
      totalTokensSold: result[6],
      isRaisedInPoly: result[7],
    };
    return typedResult;
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: CappedSTOSubscribeAsyncParams = async <ArgsType extends CappedSTOEventArgs>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      CappedSTO.abi,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetCappedSTOLogsAsyncParams = async <ArgsType extends CappedSTOEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      CappedSTO.abi,
    );
    return logs;
  };
}
