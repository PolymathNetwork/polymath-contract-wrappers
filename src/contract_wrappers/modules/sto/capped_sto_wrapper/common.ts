import {
  CappedSTOContract_3_0_0,
  CappedSTOContract_3_1_0,
  CappedSTOEvents_3_0_0,
  CappedSTOEventArgs_3_0_0,
  CappedSTOTokenPurchaseEventArgs_3_0_0,
  CappedSTOSetAllowBeneficialInvestmentsEventArgs_3_0_0,
  CappedSTOSetFundRaiseTypesEventArgs_3_0_0,
  CappedSTOPauseEventArgs_3_0_0,
  CappedSTOUnpauseEventArgs_3_0_0,
  Web3Wrapper,
  BigNumber,
  LogWithDecodedArgs,
  PolyResponse,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../../utils/assert';
import { STOCommon } from '../sto_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import {
  TxParams,
  FundRaiseType,
  FULL_DECIMALS,
  ErrorCode,
  SubscribeAsyncParams,
  GetLogsAsyncParams,
  Subscribe,
  GetLogs,
  EventCallback,
} from '../../../../types';
import { valueToWei, weiToValue } from '../../../../utils/convert';
import functionsUtils from '../../../../utils/functions_utils';
import ContractWrapper from '../../../contract_wrapper';

interface TokenPurchaseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents_3_0_0.TokenPurchase;
  callback: EventCallback<CappedSTOTokenPurchaseEventArgs_3_0_0>;
}

interface GetTokenPurchaseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents_3_0_0.TokenPurchase;
}

interface SetAllowBeneficialInvestmentsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents_3_0_0.SetAllowBeneficialInvestments;
  callback: EventCallback<CappedSTOSetAllowBeneficialInvestmentsEventArgs_3_0_0>;
}

interface GetSetAllowBeneficialInvestmentsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents_3_0_0.SetAllowBeneficialInvestments;
}

interface SetFundRaiseTypesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents_3_0_0.SetFundRaiseTypes;
  callback: EventCallback<CappedSTOSetFundRaiseTypesEventArgs_3_0_0>;
}

interface GetSetFundRaiseTypesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents_3_0_0.SetFundRaiseTypes;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents_3_0_0.Pause;
  callback: EventCallback<CappedSTOPauseEventArgs_3_0_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents_3_0_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents_3_0_0.Unpause;
  callback: EventCallback<CappedSTOUnpauseEventArgs_3_0_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents_3_0_0.Unpause;
}

export interface CappedSTOSubscribeAsyncParams extends Subscribe {
  (params: TokenPurchaseSubscribeAsyncParams): Promise<string>;
  (params: SetAllowBeneficialInvestmentsSubscribeAsyncParams): Promise<string>;
  (params: SetFundRaiseTypesSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

export interface GetCappedSTOLogsAsyncParams extends GetLogs {
  (params: GetTokenPurchaseLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOTokenPurchaseEventArgs_3_0_0>[]>;
  (params: GetSetAllowBeneficialInvestmentsLogsAsyncParams): Promise<
    LogWithDecodedArgs<CappedSTOSetAllowBeneficialInvestmentsEventArgs_3_0_0>[]
  >;
  (params: GetSetFundRaiseTypesLogsAsyncParams): Promise<
    LogWithDecodedArgs<CappedSTOSetFundRaiseTypesEventArgs_3_0_0>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOPauseEventArgs_3_0_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOUnpauseEventArgs_3_0_0>[]>;
}

/**
 * @param investorAddress Address of the investor
 */
interface InvestorsParams {
  investorAddress: string;
}

/**
 * @param allowBeneficicalInvestments Boolean to allow or disallow beneficial investments
 */
export interface ChangeAllowBeneficialInvestmentsParams extends TxParams {
  allowBeneficialInvestments: boolean;
}

/**
 * @param beneficiary Address performing the token purchase
 * @param value Value of investment
 */
export interface BuyTokensParams extends TxParams {
  beneficiary: string;
  value: BigNumber;
}

/**
 * @param investedPOLY Amount of POLY invested
 */
export interface BuyTokensWithPolyParams extends TxParams {
  investedPOLY: BigNumber;
}

/**
 * This class includes the functionality related to interacting with the CappedSTO contract.
 */
export default abstract class CappedSTOCommon extends STOCommon {
  public contract: Promise<CappedSTOContract_3_0_0 | CappedSTOContract_3_1_0>;

  /**
   * Instantiate CappedSTOCommon
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<CappedSTOContract_3_0_0 | CappedSTOContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * How many token units a buyer gets (multiplied by 10^18) per wei / base unit of POLY
   * @return rate
   */
  public rate = async (): Promise<BigNumber> => {
    return weiToValue(await (await this.contract).rate.callAsync(), FULL_DECIMALS);
  };

  /**
   * How many token base units this STO will be allowed to sell to investors
   * @return cap amount
   */
  public cap = async (): Promise<BigNumber> => {
    return weiToValue(
      await (await this.contract).cap.callAsync(),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };

  /**
   * Determine whether users can invest on behalf of a beneficiary
   * @return boolean status
   */
  public allowBeneficialInvestments = async (): Promise<boolean> => {
    return (await this.contract).allowBeneficialInvestments.callAsync();
  };

  /**
   * Access mapping of Capped STO investors
   * @return amount of investor investment
   */
  public investors = async (params: InvestorsParams): Promise<BigNumber> => {
    return (await this.contract).investors.callAsync(params.investorAddress);
  };

  /**
   * Function to set allowBeneficialInvestments (allow beneficiary to be different to funder)
   */
  public changeAllowBeneficialInvestments = async (
    params: ChangeAllowBeneficialInvestmentsParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    assert.assert(
      (await this.allowBeneficialInvestments()) !== params.allowBeneficialInvestments,
      ErrorCode.PreconditionRequired,
      'Does not change value',
    );
    return (await this.contract).changeAllowBeneficialInvestments.sendTransactionAsync(
      params.allowBeneficialInvestments,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Low level token purchase
   */
  public buyTokens = async (params: BuyTokensParams): Promise<PolyResponse> => {
    assert.isNonZeroETHAddressHex('beneficiary', params.beneficiary);
    assert.assert(!(await this.paused()), ErrorCode.ContractPaused, 'Should not be paused');
    assert.isBigNumberGreaterThanZero(params.value, 'Amount invested should not be equal to 0');
    const weiBalance = await this.web3Wrapper.getBalanceInWeiAsync(await this.getCallerAddress(params.txData));
    assert.assert(
      weiBalance.isGreaterThan(valueToWei(params.value, FULL_DECIMALS)),
      ErrorCode.InsufficientBalance,
      'Insufficient ETH funds',
    );
    assert.assert(
      await this.fundRaiseTypes({
        type: FundRaiseType.ETH,
      }),
      ErrorCode.DifferentMode,
      'Mode of investment is not ETH',
    );
    if (await this.allowBeneficialInvestments()) {
      assert.assert(
        functionsUtils.checksumAddressComparision(params.beneficiary, await this.getCallerAddress(params.txData)),
        ErrorCode.Unauthorized,
        'Beneficiary address does not match msg.sender',
      );
    }
    assert.isPastDate(await this.startTime(), 'Offering is not yet started');
    assert.isFutureDate(await this.endTime(), 'Offering is closed');
    const txPayableData = {
      ...params.txData,
      value: valueToWei(params.value, FULL_DECIMALS),
    };
    return (await this.contract).buyTokens.sendTransactionAsync(params.beneficiary, txPayableData, params.safetyFactor);
  };

  /**
   * Low level token purchase for poly
   */
  public buyTokensWithPoly = async (params: BuyTokensWithPolyParams): Promise<PolyResponse> => {
    assert.isBigNumberGreaterThanZero(params.investedPOLY, 'Amount invested should not be equal to 0');
    assert.assert(!(await this.paused()), ErrorCode.ContractPaused, 'Should not be paused');
    assert.assert(
      await this.fundRaiseTypes({
        type: FundRaiseType.POLY,
      }),
      ErrorCode.DifferentMode,
      'Mode of investment is not POLY',
    );
    const polyTokenBalance = await (await this.polyTokenContract()).balanceOf.callAsync(
      await this.getCallerAddress(params.txData),
    );
    assert.assert(
      polyTokenBalance.isGreaterThanOrEqualTo(valueToWei(params.investedPOLY, FULL_DECIMALS)),
      ErrorCode.InvalidTransfer,
      'Budget less than amount unable to transfer fee',
    );
    assert.isPastDate(await this.startTime(), 'Offering is not yet started');
    assert.isFutureDate(await this.endTime(), 'Offering is closed');
    return (await this.contract).buyTokensWithPoly.sendTransactionAsync(
      valueToWei(params.investedPOLY, FULL_DECIMALS),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Checks whether the cap has been reached.
   * @return bool Whether the cap was reached
   */
  public capReached = async (): Promise<boolean> => {
    return (await this.contract).capReached.callAsync();
  };

  /**
   * Return the total no. of tokens sold
   */
  public getTokensSold = async (): Promise<BigNumber> => {
    return weiToValue(
      await (await this.contract).getTokensSold.callAsync(),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: CappedSTOSubscribeAsyncParams = async <ArgsType extends CappedSTOEventArgs_3_0_0>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOEvents_3_0_0);
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
  public getLogsAsync: GetCappedSTOLogsAsyncParams = async <ArgsType extends CappedSTOEventArgs_3_0_0>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOEvents_3_0_0);
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

export function isCappedSTO(wrapper: ContractWrapper): wrapper is CappedSTOCommon {
  return wrapper instanceof CappedSTOCommon;
}
