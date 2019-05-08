import {
  USDTieredSTOContract,
  USDTieredSTOEventArgs,
  USDTieredSTOEvents,
  USDTieredSTOFundsReceivedEventArgs,
  USDTieredSTOPauseEventArgs,
  USDTieredSTOReserveTokenMintEventArgs,
  USDTieredSTOSetAccreditedEventArgs,
  USDTieredSTOSetAddressesEventArgs,
  USDTieredSTOSetAllowBeneficialInvestmentsEventArgs,
  USDTieredSTOSetFundRaiseTypesEventArgs,
  USDTieredSTOSetLimitsEventArgs,
  USDTieredSTOSetNonAccreditedLimitEventArgs,
  USDTieredSTOSetTiersEventArgs,
  USDTieredSTOSetTimesEventArgs,
  USDTieredSTOTokenPurchaseEventArgs,
  USDTieredSTOUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { USDTieredSTO } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import STOWrapper from './sto_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  EventCallback,
  FundRaiseType,
  GetLogs,
  GetLogsAsyncParams,
  Subscribe,
  SubscribeAsyncParams,
  TxParams,
} from '../../../types';
import { bigNumberToDate, bigNumberToNumber, dateToBigNumber, numberToBigNumber } from '../../../utils/convert';

interface SetAllowBeneficialInvestmentsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetAllowBeneficialInvestments;
  callback: EventCallback<USDTieredSTOSetAllowBeneficialInvestmentsEventArgs>;
}

interface GetSetAllowBeneficialInvestmentsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetAllowBeneficialInvestments;
}

interface SetNonAccreditedLimitSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetNonAccreditedLimit;
  callback: EventCallback<USDTieredSTOSetNonAccreditedLimitEventArgs>;
}

interface GetSetNonAccreditedLimitLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetNonAccreditedLimit;
}

interface SetAccreditedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetAccredited;
  callback: EventCallback<USDTieredSTOSetAccreditedEventArgs>;
}

interface GetSetAccreditedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetAccredited;
}

interface TokenPurchaseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents.TokenPurchase;
  callback: EventCallback<USDTieredSTOTokenPurchaseEventArgs>;
}

interface GetTokenPurchaseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents.TokenPurchase;
}

interface FundsReceivedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents.FundsReceived;
  callback: EventCallback<USDTieredSTOFundsReceivedEventArgs>;
}

interface GetFundsReceivedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents.FundsReceived;
}

interface ReserveTokenMintSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents.ReserveTokenMint;
  callback: EventCallback<USDTieredSTOReserveTokenMintEventArgs>;
}

interface GetReserveTokenMintLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents.ReserveTokenMint;
}

interface SetAddressesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetAddresses;
  callback: EventCallback<USDTieredSTOSetAddressesEventArgs>;
}

interface GetSetAddressesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetAddresses;
}

interface SetLimitsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetLimits;
  callback: EventCallback<USDTieredSTOSetLimitsEventArgs>;
}

interface GetSetLimitsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetLimits;
}

interface SetTimesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetTimes;
  callback: EventCallback<USDTieredSTOSetTimesEventArgs>;
}

interface GetSetTimesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetTimes;
}

interface SetTiersSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetTiers;
  callback: EventCallback<USDTieredSTOSetTiersEventArgs>;
}

interface GetSetTiersLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetTiers;
}

interface SetFundRaiseTypesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetFundRaiseTypes;
  callback: EventCallback<USDTieredSTOSetFundRaiseTypesEventArgs>;
}

interface GetSetFundRaiseTypesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetFundRaiseTypes;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents.Pause;
  callback: EventCallback<USDTieredSTOPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents.Unpause;
  callback: EventCallback<USDTieredSTOUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents.Unpause;
}

interface USDTieredSTOSubscribeAsyncParams extends Subscribe {
  (params: SetAllowBeneficialInvestmentsSubscribeAsyncParams): Promise<string>;
  (params: SetNonAccreditedLimitSubscribeAsyncParams): Promise<string>;
  (params: SetAccreditedSubscribeAsyncParams): Promise<string>;
  (params: TokenPurchaseSubscribeAsyncParams): Promise<string>;
  (params: FundsReceivedSubscribeAsyncParams): Promise<string>;
  (params: ReserveTokenMintSubscribeAsyncParams): Promise<string>;
  (params: SetAddressesSubscribeAsyncParams): Promise<string>;
  (params: SetLimitsSubscribeAsyncParams): Promise<string>;
  (params: SetTimesSubscribeAsyncParams): Promise<string>;
  (params: SetTiersSubscribeAsyncParams): Promise<string>;
  (params: SetFundRaiseTypesSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetUSDTieredSTOLogsAsyncParams extends GetLogs {
  (params: GetSetAllowBeneficialInvestmentsLogsAsyncParams): Promise<
    LogWithDecodedArgs<USDTieredSTOSetAllowBeneficialInvestmentsEventArgs>[]
  >;
  (params: GetSetNonAccreditedLimitLogsAsyncParams): Promise<
    LogWithDecodedArgs<USDTieredSTOSetNonAccreditedLimitEventArgs>[]
  >;
  (params: GetSetAccreditedLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOSetAccreditedEventArgs>[]>;
  (params: GetTokenPurchaseLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOTokenPurchaseEventArgs>[]>;
  (params: GetFundsReceivedLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOFundsReceivedEventArgs>[]>;
  (params: GetReserveTokenMintLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOReserveTokenMintEventArgs>[]>;
  (params: GetSetAddressesLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOSetAddressesEventArgs>[]>;
  (params: GetSetLimitsLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOSetLimitsEventArgs>[]>;
  (params: GetSetTimesLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOSetTimesEventArgs>[]>;
  (params: GetSetTiersLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOSetTiersEventArgs>[]>;
  (params: GetSetFundRaiseTypesLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOSetFundRaiseTypesEventArgs>[]>;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOPauseEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOUnpauseEventArgs>[]>;
}

interface TierIndexParams {
  tier: number;
}

interface ConvertToOrFromUSDParams {
  fundRaiseType: FundRaiseType;
  amount: BigNumber;
}

interface FundRaiseTypeParams {
  fundRaiseType: FundRaiseType;
}

interface StableCoinParams {
  stableCoinAddress: string;
}

interface InvestorIndexParams {
  investorIndex: number;
}

interface InvestorAddressParams {
  investorAddress: string;
}

interface InvestorInvestedParams {
  investorAddress: string;
  fundRaiseType: FundRaiseType;
}

interface UsdTokenIndexParams {
  usdTokenIndex: number;
}

interface BuyTokensViewParams {
  beneficiary: string;
  investmentValue: BigNumber;
  fundRaiseType: FundRaiseType;
}

/**
 * @param investors Array of investor addresses to modify
 * @param accredited Array of bools specifying accreditation status
 */
interface ChangeAccreditedParams extends TxParams {
  investors: string[];
  accredited: boolean[];
}

/**
 * @param investors Array of investor addresses to modify
 * @param nonAccreditedLimit Array of uints specifying non-accredited limits
 */
interface ChangeNonAccreditedLimitParams extends TxParams {
  investors: string[];
  nonAccreditedLimit: BigNumber[];
}

/**
 * @param startTime start time of sto
 * @param endTime end time of sto
 */
interface ModifyTimesParams extends TxParams {
  startTime: Date;
  endTime: Date;
}

/**
 * @param nonAccreditedLimitUSD max non accredited invets limit
 * @param minimumInvestmentUSD overall minimum investment limit
 */
interface ModifyLimitsParams extends TxParams {
  nonAccreditedLimitUSD: BigNumber;
  minimumInvestmentUSD: BigNumber;
}

/**
 * @param fundRaiseTypes Array of fund raise types to allow
 */
interface ModifyFundingParams extends TxParams {
  fundRaiseTypes: FundRaiseType[];
}

/**
 * @param wallet Address of wallet where funds are sent
 * @param reserveWallet Address of wallet where unsold tokens are sent
 * @param usdTokens Address of usd tokens
 */
interface ModifyAddressesParams extends TxParams {
  wallet: string;
  reserveWallet: string;
  usdTokens: string[];
}

/**
 * @param ratePerTier Array of rates per tier
 * @param ratePerTierDiscountPoly Array of discounted poly rates per tier
 * @param tokensPerTierTotal Array of total tokens per tier
 * @param tokensPerTierDiscountPoly Array of discounted tokens per tier
 */
interface ModifyTiersParams extends TxParams {
  ratePerTier: BigNumber[];
  ratePerTierDiscountPoly: BigNumber[];
  tokensPerTierTotal: BigNumber[];
  tokensPerTierDiscountPoly: BigNumber[];
}

interface ChangeAllowBeneficialInvestmentsParams extends TxParams {
  allowBeneficialInvestments: boolean;
}

interface BuyWithETHParams extends TxParams {
  beneficiary: string;
  value: BigNumber;
  from: string;
}

interface BuyWithETHRateLimitedParams extends BuyWithETHParams {
  minTokens: BigNumber;
}

interface BuyWithPOLYParams extends TxParams {
  beneficiary: string;
  investedPOLY: BigNumber;
  from: string;
}

interface BuyWithPOLYRateLimitedParams extends BuyWithPOLYParams {
  minTokens: BigNumber;
}

interface BuyWithUSDParams extends TxParams {
  beneficiary: string;
  investedSC: BigNumber;
  usdToken: string;
  from: string;
}

interface BuyWithUSDRateLimitedParams extends BuyWithUSDParams {
  minTokens: BigNumber;
}

// Return types //
interface AccreditedData {
  /** Investor address */
  investor: string;
  accreditedData: InvestorData;
}

interface InvestorData {
  /** Whether investor is accredited */
  accredited: boolean;
  /** Overrides for default limit in USD for non-accredited investors multiplied by 10**18 (0 = no override) */
  nonAccreditedLimitUSDOverride: BigNumber;
}

interface BuyTokensViewData {
  /** USD amount spent */
  spentUSD: BigNumber;
  spentValue: BigNumber;
  /** Minted tokens amount */
  tokensMinted: BigNumber;
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
  /** How many tokens have been minted in this tier (relative to totalSupply) */
  mintedTotal: BigNumber;
  /** How many tokens have been minted in this tier (relative to totalSupply) at discounted POLY rate */
  mintedDiscountPoly: BigNumber;
}

interface USDTieredSTOData {
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
}

interface MintedByTier {
  mintedInETH: BigNumber;
  mintedInPOLY: BigNumber;
  mintedInSC: BigNumber;
}
// End of return types //

/**
 * This class includes the functionality related to interacting with the USDTieredSTO contract.
 */
export default class USDTieredSTOWrapper extends STOWrapper {
  public abi: ContractAbi = USDTieredSTO.abi;

  protected contract: Promise<USDTieredSTOContract>;

  /**
   * Instantiate USDTieredSTOWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<USDTieredSTOContract>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  public investorsList = async (params: InvestorIndexParams) => {
    return (await this.contract).investorsList.callAsync(numberToBigNumber(params.investorIndex));
  };

  public allowBeneficialInvestments = async () => {
    return (await this.contract).allowBeneficialInvestments.callAsync();
  };

  public finalAmountReturned = async () => {
    return (await this.contract).finalAmountReturned.callAsync();
  };

  public investors = async (params: InvestorAddressParams) => {
    assert.isETHAddressHex('investorAddress', params.investorAddress);
    const result = await (await this.contract).investors.callAsync(params.investorAddress);
    const typedResult: InvestorData = {
      accredited: !result[0].isZero(),
      nonAccreditedLimitUSDOverride: result[2],
    };
    return typedResult;
  };

  public investorInvested = async (params: InvestorInvestedParams) => {
    assert.isETHAddressHex('investorAddress', params.investorAddress);
    return (await this.contract).investorInvested.callAsync(params.investorAddress, params.fundRaiseType);
  };

  public usdTokenEnabled = async (params: StableCoinParams) => {
    assert.isETHAddressHex('stableCoinAddress', params.stableCoinAddress);
    return (await this.contract).usdTokenEnabled.callAsync(params.stableCoinAddress);
  };

  public usdTokens = async (params: UsdTokenIndexParams) => {
    return (await this.contract).usdTokens.callAsync(numberToBigNumber(params.usdTokenIndex));
  };

  public investorInvestedUSD = async (params: InvestorAddressParams) => {
    assert.isETHAddressHex('investorAddress', params.investorAddress);
    return (await this.contract).investorInvestedUSD.callAsync(params.investorAddress);
  };

  public changeAllowBeneficialInvestments = async (params: ChangeAllowBeneficialInvestmentsParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    const allowBeneficialInvestments = await this.allowBeneficialInvestments();
    assert.assert(params.allowBeneficialInvestments !== allowBeneficialInvestments, 'The value must be different');
    return (await this.contract).changeAllowBeneficialInvestments.sendTransactionAsync(
      params.allowBeneficialInvestments,
      params.txData,
      params.safetyFactor,
    );
  };

  public buyWithETH = async (params: BuyWithETHParams) => {
    const txPayableData = {
      ...params.txData,
      value: params.value,
      from: params.from,
    };
    await this.buyWithTokens(params.beneficiary, params.from, new BigNumber(0), FundRaiseType.ETH);
    return (await this.contract).buyWithETH.sendTransactionAsync(
      params.beneficiary,
      txPayableData,
      params.safetyFactor,
    );
  };

  public buyWithPOLY = async (params: BuyWithPOLYParams) => {
    await this.buyWithTokens(params.beneficiary, params.from, new BigNumber(0), FundRaiseType.POLY);
    return (await this.contract).buyWithPOLY.sendTransactionAsync(
      params.beneficiary,
      params.investedPOLY,
      params.txData,
      params.safetyFactor,
    );
  };

  public buyWithUSD = async (params: BuyWithUSDParams) => {
    assert.isETHAddressHex('usdToken', params.usdToken);
    await this.buyWithTokens(params.beneficiary, params.from, new BigNumber(0), FundRaiseType.StableCoin);
    return (await this.contract).buyWithUSD.sendTransactionAsync(
      params.beneficiary,
      params.investedSC,
      params.usdToken,
      params.txData,
      params.safetyFactor,
    );
  };

  public buyWithETHRateLimited = async (params: BuyWithETHRateLimitedParams) => {
    const txPayableData = {
      ...params.txData,
      value: params.value,
      from: params.from,
    };
    await this.buyWithTokens(params.beneficiary, params.from, params.minTokens, FundRaiseType.ETH);
    return (await this.contract).buyWithETHRateLimited.sendTransactionAsync(
      params.beneficiary,
      params.minTokens,
      txPayableData,
      params.safetyFactor,
    );
  };

  public buyWithPOLYRateLimited = async (params: BuyWithPOLYRateLimitedParams) => {
    await this.buyWithTokens(params.beneficiary, params.from, params.minTokens, FundRaiseType.POLY);
    return (await this.contract).buyWithPOLYRateLimited.sendTransactionAsync(
      params.beneficiary,
      params.investedPOLY,
      params.minTokens,
      params.txData,
      params.safetyFactor,
    );
  };

  public buyWithUSDRateLimited = async (params: BuyWithUSDRateLimitedParams) => {
    await this.buyWithTokens(params.beneficiary, params.from, params.minTokens, FundRaiseType.StableCoin);
    return (await this.contract).buyWithUSDRateLimited.sendTransactionAsync(
      params.beneficiary,
      params.investedSC,
      params.minTokens,
      params.usdToken,
      params.txData,
      params.safetyFactor,
    );
  };

  public buyTokensView = async (params: BuyTokensViewParams) => {
    assert.isETHAddressHex('beneficiary', params.beneficiary);
    const isOpen = await this.isOpen();
    assert.assert(isOpen, 'STO not open');
    assert.assert(params.investmentValue.gt(new BigNumber(0)), 'No funds were sent');
    const rate = await this.getRate({
      fundRaiseType: params.fundRaiseType,
    });
    const investedUSD = rate.multipliedBy(params.investmentValue);
    const investorInvestedUSD = await this.investorInvestedUSD({
      investorAddress: params.beneficiary,
    });
    const minimumInvestmentUSD = await this.minimumInvestmentUSD();
    assert.assert(investedUSD.plus(investorInvestedUSD).gte(minimumInvestmentUSD), 'investment < minimumInvestmentUSD');
    const investor = await this.investors({
      investorAddress: params.beneficiary,
    });
    if (investor.accredited) {
      const nonAccreditedLimitUSD = investor.nonAccreditedLimitUSDOverride.eq(new BigNumber(0))
        ? await this.nonAccreditedLimitUSD()
        : investor.nonAccreditedLimitUSDOverride;
      assert.assert(investorInvestedUSD.lt(nonAccreditedLimitUSD), 'Over investor limit');
    }

    const result = await (await this.contract).buyTokensView.callAsync(
      params.beneficiary,
      params.investmentValue,
      params.fundRaiseType,
    );
    const typedResult: BuyTokensViewData = {
      spentUSD: result[0],
      spentValue: result[1],
      tokensMinted: result[2],
    };
    return typedResult;
  };

  public isOpen = async () => {
    return (await this.contract).isOpen.callAsync();
  };

  public capReached = async () => {
    return (await this.contract).capReached.callAsync();
  };

  public getRate = async (params: FundRaiseTypeParams) => {
    return (await this.contract).getRate.callAsync(params.fundRaiseType);
  };

  public convertFromUSD = async (params: ConvertToOrFromUSDParams) => {
    return (await this.contract).convertFromUSD.callAsync(params.fundRaiseType, params.amount);
  };

  public getTokensMinted = async () => {
    return (await this.contract).getTokensMinted.callAsync();
  };

  public getTokensSoldByTier = async (params: TierIndexParams) => {
    const tiers = await this.getNumberOfTiers();
    assert.assert(params.tier < bigNumberToNumber(tiers), 'Invalid tier');
    return (await this.contract).getTokensSoldByTier.callAsync(numberToBigNumber(params.tier));
  };

  public getSTODetails = async () => {
    const result = await (await this.contract).getSTODetails.callAsync();
    const typedResult: USDTieredSTOData = {
      startTime: bigNumberToDate(result[0]),
      endTime: bigNumberToDate(result[1]),
      currentTier: result[2].toNumber(),
      capPerTier: result[3],
      ratePerTier: result[4],
      fundsRaised: result[5],
      investorCount: bigNumberToNumber(result[6]),
      tokensSold: result[7],
      isRaisedInETH: result[8][0],
      isRaisedInPOLY: result[8][1],
      isRaisedInSC: result[8][2],
    };
    return typedResult;
  };

  /**
   * Current tier
   */
  public currentTier = async () => {
    return (await this.contract).currentTier.callAsync();
  };

  /**
   * Get the limit in USD for non-accredited investors
   */
  public nonAccreditedLimitUSD = async () => {
    return (await this.contract).nonAccreditedLimitUSD.callAsync();
  };

  /**
   * Get the minimun investment in USD
   */
  public minimumInvestmentUSD = async () => {
    return (await this.contract).minimumInvestmentUSD.callAsync();
  };

  /**
   * Ethereum account address to receive unsold tokens
   */
  public reserveWallet = async () => {
    return (await this.contract).reserveWallet.callAsync();
  };

  /**
   * Return the total no. of tokens sold
   */
  public getTokensSold = async () => {
    return (await this.contract).getTokensSold.callAsync();
  };

  /**
   * Whether or not the STO has been finalized
   */
  public isFinalized = async () => {
    return (await this.contract).isFinalized.callAsync();
  };

  /**
   * Return the total no. of tiers
   */
  public getNumberOfTiers = async () => {
    return (await this.contract).getNumberOfTiers.callAsync();
  };

  /**
   * Return the usd tokens accepted by the STO
   */
  public getUsdTokens = async () => {
    return (await this.contract).getUsdTokens.callAsync();
  };

  /**
   * Amount of USD funds raised
   */
  public fundsRaisedUSD = async () => {
    return (await this.contract).fundsRaisedUSD.callAsync();
  };

  /**
   * Get specific tier
   */
  public tiers = async (params: TierIndexParams) => {
    const result = await (await this.contract).tiers.callAsync(numberToBigNumber(params.tier));
    const typedResult: Tier = {
      rate: result[0],
      rateDiscountPoly: result[1],
      tokenTotal: result[2],
      tokensDiscountPoly: result[3],
      mintedTotal: result[4],
      mintedDiscountPoly: result[5],
    };
    return typedResult;
  };

  /**
   * Return array of minted tokens in each fund raise type for given tier
   */
  public getTokensMintedByTier = async (params: TierIndexParams) => {
    const tiers = await this.getNumberOfTiers();
    assert.assert(params.tier < bigNumberToNumber(tiers), 'Invalid tier');
    const result = await (await this.contract).getTokensMintedByTier.callAsync(numberToBigNumber(params.tier));
    const typedResult: MintedByTier = {
      mintedInETH: result[0],
      mintedInPOLY: result[1],
      mintedInSC: result[2],
    };
    return typedResult;
  };

  /**
   * This function converts from ETH or POLY to USD
   * @return Value in USD
   */
  public convertToUSD = async (params: ConvertToOrFromUSDParams) => {
    return (await this.contract).convertToUSD.callAsync(params.fundRaiseType, params.amount);
  };

  /**
   * Return the total no. of tokens sold for the given fund raise type
   * @return Total number of tokens sold for ETH
   */
  public getTokensSoldFor = async (params: FundRaiseTypeParams) => {
    return (await this.contract).getTokensSoldFor.callAsync(params.fundRaiseType);
  };

  /**
   * Amount of stable coins raised
   */
  public stableCoinsRaised = async (params: StableCoinParams) => {
    assert.isETHAddressHex('stableCoinAddress', params.stableCoinAddress);
    return (await this.contract).stableCoinsRaised.callAsync(params.stableCoinAddress);
  };

  /**
   * Finalizes the STO and mint remaining tokens to reserve address
   * Reserve address must be whitelisted to successfully finalize
   */
  public finalize = async (params: TxParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    const isFinalized = await this.isFinalized();
    assert.assert(!isFinalized, 'STO is finalized');
    // we can't execute mint to validate the method
    return (await this.contract).finalize.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Modifies the list of accredited addresses
   */
  public changeAccredited = async (params: ChangeAccreditedParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    assert.isETHAddressHexArray('investors', params.investors);
    assert.assert(params.investors.length === params.accredited.length, 'Array mismatch');
    return (await this.contract).changeAccredited.sendTransactionAsync(
      params.investors,
      params.accredited,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Modifies the list of overrides for non-accredited limits in USD
   */
  public changeNonAccreditedLimit = async (params: ChangeNonAccreditedLimitParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    assert.isETHAddressHexArray('investors', params.investors);
    assert.assert(params.investors.length === params.nonAccreditedLimit.length, 'Array mismatch');
    return (await this.contract).changeNonAccreditedLimit.sendTransactionAsync(
      params.investors,
      params.nonAccreditedLimit,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Modifies STO start and end times
   */
  public modifyTimes = async (params: ModifyTimesParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    const startTime = await this.startTime();
    const now = new Date();
    assert.assert(now < bigNumberToDate(startTime), 'STO already started');
    assert.assert(params.endTime > params.startTime && params.startTime > now, 'Invalid times');
    return (await this.contract).modifyTimes.sendTransactionAsync(
      dateToBigNumber(params.startTime),
      dateToBigNumber(params.endTime),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Modifies max non accredited invets limit and overall minimum investment limit
   */
  public modifyLimits = async (params: ModifyLimitsParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    const startTime = await this.startTime();
    assert.assert(new Date() < bigNumberToDate(startTime), 'STO already started');
    return (await this.contract).modifyLimits.sendTransactionAsync(
      params.nonAccreditedLimitUSD,
      params.minimumInvestmentUSD,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Modifies fund raise types
   */
  public modifyFunding = async (params: ModifyFundingParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    const startTime = await this.startTime();
    assert.assert(new Date() < bigNumberToDate(startTime), 'STO already started');
    return (await this.contract).modifyFunding.sendTransactionAsync(
      params.fundRaiseTypes,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Modifies addresses used as wallet, reserve wallet and usd token
   */
  public modifyAddresses = async (params: ModifyAddressesParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    assert.isETHAddressHexArray('usdToken', params.usdTokens);
    assert.isETHAddressHex('wallet', params.wallet);
    assert.isETHAddressHex('reserveWallet', params.reserveWallet);
    assert.isAddressNotZero('wallet', params.wallet);
    assert.isAddressNotZero('reserveWallet', params.reserveWallet);
    return (await this.contract).modifyAddresses.sendTransactionAsync(
      params.wallet,
      params.reserveWallet,
      params.usdTokens,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Modifiers STO tiers. All tiers must be passed, can not edit specific tiers.
   */
  public modifyTiers = async (params: ModifyTiersParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    const startTime = await this.startTime();
    assert.assert(new Date() < bigNumberToDate(startTime), 'STO already started');
    assert.assert(params.tokensPerTierTotal.length > 0, 'No tiers provided');
    assert.assert(
      params.ratePerTier.length === params.tokensPerTierTotal.length &&
        params.ratePerTierDiscountPoly.length === params.tokensPerTierTotal.length &&
        params.tokensPerTierDiscountPoly.length === params.tokensPerTierTotal.length,
      'Tier data length mismatch',
    );
    for (let i = 0; i < params.tokensPerTierTotal.length; i += 1) {
      assert.assert(params.ratePerTier[i].gt(new BigNumber(0)), 'Invalid rate');
      assert.assert(params.tokensPerTierTotal[i].gt(new BigNumber(0)), 'Invalid token amount');
      assert.assert(
        params.tokensPerTierDiscountPoly[i].lte(params.tokensPerTierTotal[i]),
        'Too many discounted tokens',
      );
      assert.assert(params.ratePerTierDiscountPoly[i].lte(params.ratePerTier[i]), 'Invalid discount');
    }
    return (await this.contract).modifyTiers.sendTransactionAsync(
      params.ratePerTier,
      params.ratePerTierDiscountPoly,
      params.tokensPerTierTotal,
      params.tokensPerTierDiscountPoly,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Returns investor accredited & non-accredited override informatiomn
   */
  public getAccreditedData = async () => {
    const result = await (await this.contract).getAccreditedData.callAsync();
    const typedResult: AccreditedData[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      const accreditedData: AccreditedData = {
        investor: result[0][i],
        accreditedData: {
          accredited: result[1][i],
          nonAccreditedLimitUSDOverride: result[2][i],
        },
      };
      typedResult.push(accreditedData);
    }
    return typedResult;
  };

  private buyWithTokens = async (
    beneficiary: string,
    from: string,
    minTokens: BigNumber,
    fundRaiseType: FundRaiseType,
  ) => {
    assert.isETHAddressHex('beneficiary', beneficiary);
    assert.assert(!(await this.paused()), 'Contract is Paused');
    const stoDetails = await this.getSTODetails();
    switch (fundRaiseType) {
      case FundRaiseType.ETH: {
        assert.assert(stoDetails.isRaisedInETH, 'ETH Not Allowed');
        break;
      }
      case FundRaiseType.POLY: {
        assert.assert(stoDetails.isRaisedInETH, 'POLY Not Allowed');
        break;
      }
      case FundRaiseType.StableCoin: {
        assert.assert(stoDetails.isRaisedInETH, 'USD Not Allowed');
        break;
      }
      default: {
        assert.assert(false, 'Missing fundraise type');
        break;
      }
    }
    const allowBeneficialInvestments = await this.allowBeneficialInvestments();
    if (!allowBeneficialInvestments) {
      assert.assert(beneficiary === from, 'Beneficiary != funder');
    }
    const getTokensMinted = await this.getTokensMinted();
    assert.assert((await this.getTokensMinted()).minus(getTokensMinted).gte(minTokens), 'Insufficient minted');
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: USDTieredSTOSubscribeAsyncParams = async <ArgsType extends USDTieredSTOEventArgs>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, USDTieredSTOEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      USDTieredSTO.abi,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetUSDTieredSTOLogsAsyncParams = async <ArgsType extends USDTieredSTOEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, USDTieredSTOEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      USDTieredSTO.abi,
    );
    return logs;
  };
}
