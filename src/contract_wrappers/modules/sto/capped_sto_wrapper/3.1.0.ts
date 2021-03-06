import {
  CappedSTOEvents_3_1_0,
  CappedSTOContract_3_1_0,
  CappedSTOEventArgs_3_1_0,
  CappedSTOReserveTokenMintEventArgs_3_1_0,
  CappedSTOReserveTokenTransferEventArgs_3_1_0,
  CappedSTOAllowPreMintFlagEventArgs_3_1_0,
  CappedSTORevokePreMintFlagEventArgs_3_1_0,
  Web3Wrapper,
  LogWithDecodedArgs,
  BigNumber,
  PolyResponse,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import functionsUtils from '../../../../utils/functions_utils';
import CappedSTOCommon, {
  BuyTokensWithPolyParams,
  BuyTokensParams,
  CappedSTOSubscribeAsyncParams,
  GetCappedSTOLogsAsyncParams,
} from './common';
import assert from '../../../../utils/assert';
import {
  ErrorCode,
  ContractVersion,
  SubscribeAsyncParams,
  GetLogsAsyncParams,
  FULL_DECIMALS,
  FundRaiseType,
  Constructor,
  EventCallback,
} from '../../../../types';
import { valueToWei, bigNumberToDate, weiToValue } from '../../../../utils/convert';
import ContractFactory from '../../../../factories/contractFactory';
import { WithSTO_3_1_0 } from '../sto_wrapper';

interface ReserveTokenMintSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents_3_1_0.ReserveTokenMint;
  callback: EventCallback<CappedSTOReserveTokenMintEventArgs_3_1_0>;
}

interface GetReserveTokenMintLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents_3_1_0.ReserveTokenMint;
}

interface ReserveTokenTransferSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents_3_1_0.ReserveTokenTransfer;
  callback: EventCallback<CappedSTOReserveTokenTransferEventArgs_3_1_0>;
}

interface GetReserveTokenTransferLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents_3_1_0.ReserveTokenTransfer;
}

interface AllowPreMintFlagSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents_3_1_0.AllowPreMintFlag;
  callback: EventCallback<CappedSTOAllowPreMintFlagEventArgs_3_1_0>;
}

interface GetAllowPreMintFlagLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents_3_1_0.AllowPreMintFlag;
}

interface RevokePreMintFlagSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents_3_1_0.RevokePreMintFlag;
  callback: EventCallback<CappedSTORevokePreMintFlagEventArgs_3_1_0>;
}

interface GetRevokePreMintFlagLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents_3_1_0.RevokePreMintFlag;
}

interface CappedSTOSubscribeAsyncParams_3_1_0 extends CappedSTOSubscribeAsyncParams {
  (params: ReserveTokenMintSubscribeAsyncParams): Promise<string>;
  (params: ReserveTokenTransferSubscribeAsyncParams): Promise<string>;
  (params: AllowPreMintFlagSubscribeAsyncParams): Promise<string>;
  (params: RevokePreMintFlagSubscribeAsyncParams): Promise<string>;
}

interface GetCappedSTOLogsAsyncParams_3_1_0 extends GetCappedSTOLogsAsyncParams {
  (params: GetReserveTokenMintLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOReserveTokenMintEventArgs_3_1_0>[]>;
  (params: GetReserveTokenTransferLogsAsyncParams): Promise<
    LogWithDecodedArgs<CappedSTOReserveTokenTransferEventArgs_3_1_0>[]
  >;
  (params: GetAllowPreMintFlagLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOAllowPreMintFlagEventArgs_3_1_0>[]>;
  (params: GetRevokePreMintFlagLogsAsyncParams): Promise<
    LogWithDecodedArgs<CappedSTORevokePreMintFlagEventArgs_3_1_0>[]
  >;
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
  /** Whether all tokens will be minted when the STO starts or on each buy */
  preMintingAllowed: boolean;
}

const CappedSTOBase_3_1_0 = WithSTO_3_1_0((CappedSTOCommon as unknown) as Constructor<CappedSTOCommon>);

export class CappedSTO_3_1_0 extends CappedSTOBase_3_1_0 {
  public contract: Promise<CappedSTOContract_3_1_0>;

  public contractVersion = ContractVersion.V3_1_0;

  /**
   * Instantiate CappedSTO_3_1_0
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<CappedSTOContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Return the STO details
   * @return Date at which offering gets start, Date at which offering ends, Number of token base units this STO will
   * be allowed to sell to investors, Token units a buyer gets as the rate, Amount of funds raised, Number of
   * individual investors this STO have, Amount of tokens get sold, Boolean value to justify whether the fund raise
   * type is POLY or not, ie true for POLY, Boolean value to know the nature of the STO Whether it is pre-mint or
   * mint on buying type sto
   */
  public getSTODetails = async (): Promise<CappedSTODetails> => {
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const result = await (await this.contract).getSTODetails.callAsync();
    const typedResult: CappedSTODetails = {
      startTime: bigNumberToDate(result[0]),
      endTime: bigNumberToDate(result[1]),
      cap: weiToValue(result[2], decimals),
      rate: weiToValue(result[3], FULL_DECIMALS),
      fundsRaised: weiToValue(result[4], FULL_DECIMALS),
      investorCount: new BigNumber(result[5]).toNumber(),
      totalTokensSold: weiToValue(result[6], decimals),
      isRaisedInPoly: result[7],
      preMintingAllowed: result[8],
    };
    return typedResult;
  };

  /**
   * Low level token purchase
   */

  public buyTokens = async (params: BuyTokensParams): Promise<PolyResponse> => {
    assert.assert(!(await this.isFinalized()), ErrorCode.PreconditionRequired, 'STO is already finalized');
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
    assert.assert(!(await this.isFinalized()), ErrorCode.PreconditionRequired, 'STO is already finalized');
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
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: CappedSTOSubscribeAsyncParams_3_1_0 = async <ArgsType extends CappedSTOEventArgs_3_1_0>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOEvents_3_1_0);
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
  public getLogsAsync: GetCappedSTOLogsAsyncParams_3_1_0 = async <ArgsType extends CappedSTOEventArgs_3_1_0>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOEvents_3_1_0);
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

export function isCappedSTO_3_1_0(wrapper: CappedSTOCommon): wrapper is CappedSTO_3_1_0 {
  return wrapper.contractVersion === ContractVersion.V3_1_0;
}
