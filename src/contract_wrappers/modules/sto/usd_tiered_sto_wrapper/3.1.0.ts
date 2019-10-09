import {
  USDTieredSTOContract_3_1_0,
  USDTieredSTOEvents_3_1_0,
  USDTieredSTOEventArgs_3_1_0,
  USDTieredSTOReserveTokenTransferEventArgs_3_1_0,
  USDTieredSTOAllowPreMintFlagEventArgs_3_1_0,
  USDTieredSTORevokePreMintFlagEventArgs_3_1_0,
  LogWithDecodedArgs,
  BigNumber,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import USDTieredSTOCommon, {
  TierIndexParams,
  USDTieredSTOSubscribeAsyncParams,
  GetUSDTieredSTOLogsAsyncParams,
} from './common';
import assert from '../../../../utils/assert';
import {
  ErrorCode,
  ContractVersion,
  SubscribeAsyncParams,
  GetLogsAsyncParams,
  FULL_DECIMALS,
  Constructor,
  EventCallback,
} from '../../../../types';
import { numberToBigNumber, weiToValue, bigNumberToDate, weiArrayToValueArray } from '../../../../utils/convert';
import ContractFactory from '../../../../factories/contractFactory';
import { WithSTO_3_1_0 } from '../sto_wrapper';

interface ReserveTokenTransferSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_1_0.ReserveTokenTransfer;
  callback: EventCallback<USDTieredSTOReserveTokenTransferEventArgs_3_1_0>;
}

interface GetReserveTokenTransferLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_1_0.ReserveTokenTransfer;
}

interface AllowPreMintFlagSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_1_0.AllowPreMintFlag;
  callback: EventCallback<USDTieredSTOAllowPreMintFlagEventArgs_3_1_0>;
}

interface GetAllowPreMintFlagLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_1_0.AllowPreMintFlag;
}

interface RevokePreMintFlagSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_1_0.RevokePreMintFlag;
  callback: EventCallback<USDTieredSTORevokePreMintFlagEventArgs_3_1_0>;
}

interface GetRevokePreMintFlagLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_1_0.RevokePreMintFlag;
}

interface USDTieredSTOSubscribeAsyncParams_3_1_0 extends USDTieredSTOSubscribeAsyncParams {
  (params: ReserveTokenTransferSubscribeAsyncParams): Promise<string>;
  (params: AllowPreMintFlagSubscribeAsyncParams): Promise<string>;
  (params: RevokePreMintFlagSubscribeAsyncParams): Promise<string>;
}

interface GetUSDTieredSTOLogsAsyncParams_3_1_0 extends GetUSDTieredSTOLogsAsyncParams {
  (params: GetReserveTokenTransferLogsAsyncParams): Promise<
    LogWithDecodedArgs<USDTieredSTOReserveTokenTransferEventArgs_3_1_0>[]
  >;
  (params: GetAllowPreMintFlagLogsAsyncParams): Promise<
    LogWithDecodedArgs<USDTieredSTOAllowPreMintFlagEventArgs_3_1_0>[]
  >;
  (params: GetRevokePreMintFlagLogsAsyncParams): Promise<
    LogWithDecodedArgs<USDTieredSTORevokePreMintFlagEventArgs_3_1_0>[]
  >;
}

interface MintedByTier {
  mintedInETH: BigNumber;
  mintedInPOLY: BigNumber;
  mintedInSC: BigNumber;
}

export interface USDTieredSTOData {
  /** Timestamp at which offering gets start. */
  startTime: Date;
  /** Timestamp at which offering ends. */
  endTime: Date;
  /** Currently active tier */
  currentTier: number;
  /** Array of Number of tokens this STO will be allowed to sell at different tiers. */
  capPerTier: BigNumber[];
  /** Array Rate at which tokens are sold at different tiers */
  ratePerTier: BigNumber[];
  /** Amount of funds raised */
  fundsRaised: BigNumber;
  /** Number of individual investors this STO has. */
  investorCount: number;
  /** Amount of tokens sold. */
  tokensSold: BigNumber;
  /** Whether the STO accepts ETH */
  isRaisedInETH: boolean;
  /** Whether the STO accepts POLY */
  isRaisedInPOLY: boolean;
  /** Whether the STO accepts SableCoins */
  isRaisedInSC: boolean;
  /** Whether all tokens will be minted when the STO starts or on each buy */
  preMintingAllowed: boolean;
}

interface Tier {
  /** How many token units a buyer gets per USD in this tier */
  rate: BigNumber;
  /** How many token units a buyer gets per USD in this tier (multiplied by 10**18) when investing in POLY up to tokensDiscountPoly */
  rateDiscountPoly: BigNumber;
  /** How many tokens are available in this tier (relative to totalSupply) */
  tokenTotal: BigNumber;
  /** How many token units are available in this tier (relative to totalSupply) at the ratePerTierDiscountPoly rate */
  tokensDiscountPoly: BigNumber;
  /** How many tokens have been sold in this tier (relative to totalSupply) */
  totalTokensSoldInTier: BigNumber;
  /** How many tokens have been sold in this tier (relative to totalSupply) at discounted POLY rate */
  soldDiscountPoly: BigNumber;
}

const USDTieredSTOBase_3_1_0 = WithSTO_3_1_0((USDTieredSTOCommon as unknown) as Constructor<USDTieredSTOCommon>);

export class USDTieredSTO_3_1_0 extends USDTieredSTOBase_3_1_0 {
  public contract: Promise<USDTieredSTOContract_3_1_0>;

  public contractVersion = ContractVersion.V3_1_0;

  /**
   * Instantiate USDTieredSTO_3_1_0
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<USDTieredSTOContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Return the STO details
   * @return Unixtimestamp at which offering gets start, Unixtimestamp at which offering ends, Currently active tier,
   * Array of Number of tokens this STO will be allowed to sell at different tiers, Array rate at which tokens are
   * sold at different tiers, Amount of funds raised, Number of individual investors this STO have, Amount of tokens
   * solo, Array of booleans to show if funding is allowed in ETH, POLY, SC respectively
   */
  public getSTODetails = async (): Promise<USDTieredSTOData> => {
    const result = await (await this.contract).getSTODetails.callAsync();
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const typedResult: USDTieredSTOData = {
      startTime: bigNumberToDate(result[0]),
      endTime: bigNumberToDate(result[1]),
      currentTier: new BigNumber(result[2]).toNumber(),
      capPerTier: weiArrayToValueArray(result[3], decimals),
      ratePerTier: weiArrayToValueArray(result[4], FULL_DECIMALS),
      fundsRaised: weiToValue(result[5], FULL_DECIMALS),
      investorCount: result[6].toNumber(),
      tokensSold: weiToValue(result[7], decimals),
      isRaisedInETH: result[8][0],
      isRaisedInPOLY: result[8][1],
      isRaisedInSC: result[8][2],
      preMintingAllowed: result[9],
    };
    return typedResult;
  };

  /**
   * Return tiers
   * @return rate, rateDiscountPoly, tokensTotal, tokensDiscountPoly, mintedTotal, mintedDiscountPoly
   */
  public tiers = async (params: TierIndexParams): Promise<Tier> => {
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const result = await (await this.contract).tiers.callAsync(numberToBigNumber(params.tier));
    const typedResult: Tier = {
      rate: weiToValue(result[0], FULL_DECIMALS),
      rateDiscountPoly: weiToValue(result[1], FULL_DECIMALS),
      tokenTotal: weiToValue(result[2], decimals),
      tokensDiscountPoly: weiToValue(result[3], decimals),
      totalTokensSoldInTier: weiToValue(result[4], decimals),
      soldDiscountPoly: weiToValue(result[5], decimals),
    };
    return typedResult;
  };

  /**
   * Return the total number of tokens sold in a given tier
   * @return Total amount of tokens sold in the tier
   */
  public getTotalTokensSoldByTier = async (params: TierIndexParams) => {
    const tiers = await this.getNumberOfTiers();
    assert.assert(params.tier < new BigNumber(tiers).toNumber(), ErrorCode.InvalidData, 'Invalid tier');
    return weiToValue(
      await (await this.contract).getTotalTokensSoldByTier.callAsync(numberToBigNumber(params.tier)),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };

  /**
   * Return array of sold tokens in each fund raise type for given tier
   * @return tokens amount by tier
   */
  public getTokensSoldByTier = async (params: TierIndexParams) => {
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    assert.assert(params.tier < (await this.getNumberOfTiers()), ErrorCode.InvalidData, 'Invalid tier');
    const result = await (await this.contract).getTokensSoldByTier.callAsync(numberToBigNumber(params.tier));
    const typedResult: MintedByTier = {
      mintedInETH: weiToValue(result[0], decimals),
      mintedInPOLY: weiToValue(result[1], decimals),
      mintedInSC: weiToValue(result[2], decimals),
    };
    return typedResult;
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: USDTieredSTOSubscribeAsyncParams_3_1_0 = async <ArgsType extends USDTieredSTOEventArgs_3_1_0>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, USDTieredSTOEvents_3_1_0);
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
  public getLogsAsync: GetUSDTieredSTOLogsAsyncParams_3_1_0 = async <ArgsType extends USDTieredSTOEventArgs_3_1_0>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, USDTieredSTOEvents_3_1_0);
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

export function isUSDTieredSTO_3_1_0(wrapper: USDTieredSTOCommon): wrapper is USDTieredSTO_3_1_0 {
  return wrapper.contractVersion === ContractVersion.V3_1_0;
}
