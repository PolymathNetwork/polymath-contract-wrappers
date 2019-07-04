import {
  USDTieredSTOContract,
  USDTieredSTOEventArgs,
  USDTieredSTOEvents,
  USDTieredSTOFundsReceivedEventArgs,
  USDTieredSTOPauseEventArgs,
  USDTieredSTOReserveTokenMintEventArgs,
  USDTieredSTOSetTreasuryWalletEventArgs,
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
  FULL_DECIMALS,
  FundRaiseType,
  GetLogs,
  GetLogsAsyncParams,
  Subscribe,
  SubscribeAsyncParams,
  TxParams,
} from '../../../types';
import {
  bigNumberToDate,
  dateToBigNumber,
  numberToBigNumber,
  valueArrayToWeiArray,
  valueToWei,
  weiArrayToValueArray,
  weiToValue,
} from '../../../utils/convert';
import functionsUtils from '../../../utils/functions_utils';

const BIG_NUMBER_ZERO = new BigNumber(0);

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

interface SetTreasuryWalletSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetTreasuryWallet;
  callback: EventCallback<USDTieredSTOSetTreasuryWalletEventArgs>;
}

interface GetSetTreasuryWalletLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetTreasuryWallet;
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
  (params: SetTreasuryWalletSubscribeAsyncParams): Promise<string>;
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
  (params: GetSetTreasuryWalletLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOSetTreasuryWalletEventArgs>[]>;
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
}

interface BuyWithETHRateLimitedParams extends BuyWithETHParams {
  minTokens: BigNumber;
}

interface BuyWithPOLYParams extends TxParams {
  beneficiary: string;
  investedPOLY: BigNumber;
}

interface BuyWithPOLYRateLimitedParams extends BuyWithPOLYParams {
  minTokens: BigNumber;
}

interface BuyWithUSDParams extends TxParams {
  beneficiary: string;
  investedSC: BigNumber;
  usdToken: string;
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

  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  public finalAmountReturned = async () => {
    return weiToValue(
      await (await this.contract).finalAmountReturned.callAsync(),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };

  public investors = async (params: InvestorAddressParams) => {
    assert.isETHAddressHex('investorAddress', params.investorAddress);
    const result = await (await this.contract).investors.callAsync(params.investorAddress);
    const typedResult: InvestorData = {
      accredited: !result[0].isZero(),
      nonAccreditedLimitUSDOverride: weiToValue(result[2], FULL_DECIMALS),
    };
    return typedResult;
  };

  public investorInvested = async (params: InvestorInvestedParams) => {
    assert.isETHAddressHex('investorAddress', params.investorAddress);
    return weiToValue(
      await (await this.contract).investorInvested.callAsync(params.investorAddress, params.fundRaiseType),
      FULL_DECIMALS,
    );
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
    return weiToValue(await (await this.contract).investorInvestedUSD.callAsync(params.investorAddress), FULL_DECIMALS);
  };

  public changeAllowBeneficialInvestments = async (params: ChangeAllowBeneficialInvestmentsParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    assert.assert(
      params.allowBeneficialInvestments !== (await this.allowBeneficialInvestments()),
      'The value must be different',
    );
    return (await this.contract).changeAllowBeneficialInvestments.sendTransactionAsync(
      params.allowBeneficialInvestments,
      params.txData,
      params.safetyFactor,
    );
  };

  public buyWithETH = async (params: BuyWithETHParams) => {
    assert.isETHAddressHex('beneficiary', params.beneficiary);
    const investmentValue = valueToWei(params.value, FULL_DECIMALS);
    await this.checkIfBuyIsValid(
      params.beneficiary,
      await this.getCallerAddress(params.txData),
      investmentValue,
      FundRaiseType.ETH,
    );
    const txPayableData = {
      ...params.txData,
      value: investmentValue,
    };
    return (await this.contract).buyWithETH.sendTransactionAsync(
      params.beneficiary,
      txPayableData,
      params.safetyFactor,
    );
  };

  public buyWithPOLY = async (params: BuyWithPOLYParams) => {
    assert.isETHAddressHex('beneficiary', params.beneficiary);
    const investmentValue = valueToWei(params.investedPOLY, FULL_DECIMALS);
    await this.checkIfBuyIsValid(
      params.beneficiary,
      await this.getCallerAddress(params.txData),
      investmentValue,
      FundRaiseType.POLY,
    );
    return (await this.contract).buyWithPOLY.sendTransactionAsync(
      params.beneficiary,
      investmentValue,
      params.txData,
      params.safetyFactor,
    );
  };

  public buyWithUSD = async (params: BuyWithUSDParams) => {
    assert.isETHAddressHex('beneficiary', params.beneficiary);
    assert.isETHAddressHex('usdToken', params.usdToken);
    const investmentValue = valueToWei(params.investedSC, FULL_DECIMALS);
    await this.checkIfBuyIsValid(
      params.beneficiary,
      await this.getCallerAddress(params.txData),
      investmentValue,
      FundRaiseType.StableCoin,
      params.usdToken,
    );
    return (await this.contract).buyWithUSD.sendTransactionAsync(
      params.beneficiary,
      investmentValue,
      params.usdToken,
      params.txData,
      params.safetyFactor,
    );
  };

  public buyWithETHRateLimited = async (params: BuyWithETHRateLimitedParams) => {
    const investmentValue = valueToWei(params.value, FULL_DECIMALS);
    await this.checkIfBuyIsValid(
      params.beneficiary,
      await this.getCallerAddress(params.txData),
      investmentValue,
      FundRaiseType.ETH,
    );
    const txPayableData = {
      ...params.txData,
      value: investmentValue,
    };
    return (await this.contract).buyWithETHRateLimited.sendTransactionAsync(
      params.beneficiary,
      params.minTokens,
      txPayableData,
      params.safetyFactor,
    );
  };

  public buyWithPOLYRateLimited = async (params: BuyWithPOLYRateLimitedParams) => {
    const investmentValue = valueToWei(params.investedPOLY, FULL_DECIMALS);
    await this.checkIfBuyIsValid(
      params.beneficiary,
      await this.getCallerAddress(params.txData),
      investmentValue,
      FundRaiseType.POLY,
    );
    return (await this.contract).buyWithPOLYRateLimited.sendTransactionAsync(
      params.beneficiary,
      investmentValue,
      params.minTokens,
      params.txData,
      params.safetyFactor,
    );
  };

  public buyWithUSDRateLimited = async (params: BuyWithUSDRateLimitedParams) => {
    const investmentValue = valueToWei(params.investedSC, FULL_DECIMALS);
    await this.checkIfBuyIsValid(
      params.beneficiary,
      await this.getCallerAddress(params.txData),
      investmentValue,
      FundRaiseType.StableCoin,
      params.usdToken,
    );
    return (await this.contract).buyWithUSDRateLimited.sendTransactionAsync(
      params.beneficiary,
      investmentValue,
      params.minTokens,
      params.usdToken,
      params.txData,
      params.safetyFactor,
    );
  };

  public isOpen = async () => {
    return (await this.contract).isOpen.callAsync();
  };

  public capReached = async () => {
    return (await this.contract).capReached.callAsync();
  };

  public getRate = async (params: FundRaiseTypeParams) => {
    return weiToValue(await (await this.contract).getRate.callAsync(params.fundRaiseType), FULL_DECIMALS);
  };

  public convertFromUSD = async (params: ConvertToOrFromUSDParams) => {
    return weiToValue(
      await (await this.contract).convertFromUSD.callAsync(
        params.fundRaiseType,
        valueToWei(params.amount, FULL_DECIMALS),
      ),
      FULL_DECIMALS,
    );
  };

  public getTokensMinted = async () => {
    return weiToValue(
      await (await this.contract).getTokensMinted.callAsync(),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };

  public getTokensSoldByTier = async (params: TierIndexParams) => {
    const tiers = await this.getNumberOfTiers();
    assert.assert(params.tier < new BigNumber(tiers).toNumber(), 'Invalid tier');
    return weiToValue(
      await (await this.contract).getTokensSoldByTier.callAsync(numberToBigNumber(params.tier)),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };

  public getSTODetails = async () => {
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
    return weiToValue(await (await this.contract).nonAccreditedLimitUSD.callAsync(), FULL_DECIMALS);
  };

  /**
   * Get the minimun investment in USD
   */
  public minimumInvestmentUSD = async () => {
    return weiToValue(await (await this.contract).minimumInvestmentUSD.callAsync(), FULL_DECIMALS);
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
    return weiToValue(
      await (await this.contract).getTokensSold.callAsync(),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
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
    return weiToValue(await (await this.contract).fundsRaisedUSD.callAsync(), FULL_DECIMALS);
  };

  /**
   * Get specific tier
   */
  public tiers = async (params: TierIndexParams) => {
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const result = await (await this.contract).tiers.callAsync(numberToBigNumber(params.tier));
    const typedResult: Tier = {
      rate: weiToValue(result[0], FULL_DECIMALS),
      rateDiscountPoly: weiToValue(result[1], FULL_DECIMALS),
      tokenTotal: weiToValue(result[2], decimals),
      tokensDiscountPoly: weiToValue(result[3], decimals),
      mintedTotal: weiToValue(result[4], decimals),
      mintedDiscountPoly: weiToValue(result[5], decimals),
    };
    return typedResult;
  };

  /**
   * Return array of minted tokens in each fund raise type for given tier
   */
  public getTokensMintedByTier = async (params: TierIndexParams) => {
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    assert.assert(params.tier < (await this.getNumberOfTiers()).toNumber(), 'Invalid tier');
    const result = await (await this.contract).getTokensMintedByTier.callAsync(numberToBigNumber(params.tier));
    const typedResult: MintedByTier = {
      mintedInETH: weiToValue(result[0], decimals),
      mintedInPOLY: weiToValue(result[1], decimals),
      mintedInSC: weiToValue(result[2], decimals),
    };
    return typedResult;
  };

  /**
   * This function converts from ETH or POLY to USD
   * @return Value in USD
   */
  public convertToUSD = async (params: ConvertToOrFromUSDParams) => {
    return weiToValue(
      await (await this.contract).convertToUSD.callAsync(
        params.fundRaiseType,
        valueToWei(params.amount, FULL_DECIMALS),
      ),
      FULL_DECIMALS,
    );
  };

  /**
   * Return the total no. of tokens sold for the given fund raise type
   * @return Total number of tokens sold for ETH
   */
  public getTokensSoldFor = async (params: FundRaiseTypeParams) => {
    return weiToValue(
      await (await this.contract).getTokensSoldFor.callAsync(params.fundRaiseType),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };

  /**
   * Amount of stable coins raised
   */
  public stableCoinsRaised = async (params: StableCoinParams) => {
    assert.isETHAddressHex('stableCoinAddress', params.stableCoinAddress);
    return weiToValue(await (await this.contract).stableCoinsRaised.callAsync(params.stableCoinAddress), FULL_DECIMALS);
  };

  /**
   * Finalizes the STO and mint remaining tokens to reserve address
   * Reserve address must be whitelisted to successfully finalize
   */
  public finalize = async (params: TxParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    assert.assert(!(await this.isFinalized()), 'STO is finalized');
    // we can't execute mint to validate the method
    return (await this.contract).finalize.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Modifies the list of overrides for non-accredited limits in USD
   */
  public changeNonAccreditedLimit = async (params: ChangeNonAccreditedLimitParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    params.investors.forEach(address => assert.isETHAddressHex('investors', address));
    assert.assert(params.investors.length === params.nonAccreditedLimit.length, 'Array length mismatch');
    return (await this.contract).changeNonAccreditedLimit.sendTransactionAsync(
      params.investors,
      valueArrayToWeiArray(params.nonAccreditedLimit, FULL_DECIMALS),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Modifies STO start and end times
   */
  public modifyTimes = async (params: ModifyTimesParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    assert.isFutureDate(bigNumberToDate(await this.startTime()), 'STO already started');
    assert.assert(params.endTime > params.startTime, 'Start date must be greater than end time');
    assert.isFutureDate(params.startTime, 'Start date must be in the future');
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
    assert.isFutureDate(bigNumberToDate(await this.startTime()), 'STO already started');
    return (await this.contract).modifyLimits.sendTransactionAsync(
      valueToWei(params.nonAccreditedLimitUSD, FULL_DECIMALS),
      valueToWei(params.minimumInvestmentUSD, FULL_DECIMALS),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Modifies fund raise types
   */
  public modifyFunding = async (params: ModifyFundingParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    assert.isFutureDate(bigNumberToDate(await this.startTime()), 'STO already started');
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
    params.usdTokens.forEach(address => assert.isETHAddressHex('usdTokens', address));
    assert.isNonZeroETHAddressHex('wallet', params.wallet);
    assert.isNonZeroETHAddressHex('reserveWallet', params.reserveWallet);
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
    assert.isFutureDate(bigNumberToDate(await this.startTime()), 'STO already started');
    assert.assert(params.tokensPerTierTotal.length > 0, 'No tiers provided');
    assert.assert(
      params.ratePerTier.length === params.tokensPerTierTotal.length &&
        params.ratePerTierDiscountPoly.length === params.tokensPerTierTotal.length &&
        params.tokensPerTierDiscountPoly.length === params.tokensPerTierTotal.length,
      'Tier data arrays length mismatch',
    );
    for (let i = 0; i < params.tokensPerTierTotal.length; i += 1) {
      assert.isBigNumberGreaterThanZero(params.ratePerTier[i], 'Invalid rate');
      assert.isBigNumberGreaterThanZero(params.tokensPerTierTotal[i], 'Invalid token amount');
      assert.assert(
        params.tokensPerTierDiscountPoly[i].isLessThanOrEqualTo(params.tokensPerTierTotal[i]),
        'Too many discounted tokens',
      );
      assert.assert(params.ratePerTierDiscountPoly[i].isLessThanOrEqualTo(params.ratePerTier[i]), 'Invalid discount');
    }
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).modifyTiers.sendTransactionAsync(
      valueArrayToWeiArray(params.ratePerTier, FULL_DECIMALS),
      valueArrayToWeiArray(params.ratePerTierDiscountPoly, FULL_DECIMALS),
      valueArrayToWeiArray(params.tokensPerTierTotal, decimals),
      valueArrayToWeiArray(params.tokensPerTierDiscountPoly, decimals),
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
          nonAccreditedLimitUSDOverride: weiToValue(result[2][i], FULL_DECIMALS),
        },
      };
      typedResult.push(accreditedData);
    }
    return typedResult;
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

  private checkIfBuyIsValid = async (
    beneficiary: string,
    from: string,
    investmentValue: BigNumber,
    fundRaiseType: FundRaiseType,
    usdToken?: string,
  ) => {
    assert.isETHAddressHex('beneficiary', beneficiary);
    assert.assert(!(await this.paused()), 'Contract is Paused');
    assert.assert(await this.isOpen(), 'STO not open');
    assert.isBigNumberGreaterThanZero(investmentValue, 'No funds were sent');
    const stoDetails = await this.getSTODetails();
    switch (fundRaiseType) {
      case FundRaiseType.ETH: {
        assert.assert(stoDetails.isRaisedInETH, 'ETH Not Allowed');
        const weiBalance = await this.web3Wrapper.getBalanceInWeiAsync(from);
        assert.assert(weiBalance.isGreaterThan(investmentValue), 'Insufficient ETH funds');
        break;
      }
      case FundRaiseType.POLY: {
        assert.assert(stoDetails.isRaisedInPOLY, 'POLY Not Allowed');
        const polyTokenBalance = await (await this.polyTokenContract()).balanceOf.callAsync(from);
        assert.assert(
          polyTokenBalance.isGreaterThanOrEqualTo(investmentValue),
          'Budget less than amount unable to transfer fee',
        );
        break;
      }
      case FundRaiseType.StableCoin: {
        assert.assert(stoDetails.isRaisedInSC, 'USD Not Allowed');
        assert.assert(usdToken !== null, 'USD Token Address must exist');
        if (usdToken) {
          const scTokenBalance = await (await this.detailedErc20TokenContract(usdToken)).balanceOf.callAsync(from);
          assert.assert(
            scTokenBalance.isGreaterThanOrEqualTo(investmentValue),
            'Budget less than amount unable to transfer fee',
          );
        }
        break;
      }
      default: {
        assert.assert(false, 'Missing fundraise type');
        break;
      }
    }
    if (!(await this.allowBeneficialInvestments())) {
      assert.assert(functionsUtils.checksumAddressComparision(beneficiary, from), 'Beneficiary != funder');
    }
    const rate = await this.getRate({
      fundRaiseType,
    });
    const investedUSD = rate.multipliedBy(investmentValue);
    const investorInvestedUSD = await this.investorInvestedUSD({
      investorAddress: beneficiary,
    });
    const minimumInvestmentUSD = await this.minimumInvestmentUSD();
    assert.assert(
      investedUSD.plus(investorInvestedUSD).isGreaterThan(minimumInvestmentUSD),
      'investment < minimumInvestmentUSD',
    );
    const investor = await this.investors({
      investorAddress: beneficiary,
    });
    if (investor.accredited) {
      const nonAccreditedLimitUSD = investor.nonAccreditedLimitUSDOverride.isEqualTo(BIG_NUMBER_ZERO)
        ? await this.nonAccreditedLimitUSD()
        : investor.nonAccreditedLimitUSDOverride;
      assert.assert(investorInvestedUSD.isLessThan(nonAccreditedLimitUSD), 'Over investor limit');
    }
  };
}
