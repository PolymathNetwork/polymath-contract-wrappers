import {
  GeneralTransferManagerContract_3_0_0,
  USDTieredSTOContract_3_0_0,  
  Web3Wrapper,
  BigNumber,
  USDTieredSTOContract_3_1_0,
} from '@polymathnetwork/abi-wrappers';
import assert from '../../../../utils/assert';
import { STO } from '../sto_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import {
  FULL_DECIMALS,
  FundRaiseType,
  ModuleName,
  TxParams,
  ErrorCode,
} from '../../../../types';
import {
  bigNumberToDate,
  dateToBigNumber,
  stringToBytes32,
  valueArrayToWeiArray,
  valueToWei,
  weiArrayToValueArray,
  weiToValue,
} from '../../../../utils/convert';
import functionsUtils from '../../../../utils/functions_utils';
import GeneralTransferManagerWrapper from '../../transfer_manager/general_transfer_manager_wrapper';

const BIG_NUMBER_ZERO = new BigNumber(0);

export namespace USDTieredSTOTransactionParams {
  export interface ChangeNonAccreditedLimit extends ChangeNonAccreditedLimitParams {}
  export interface ModifyTimes extends ModifyTimesParams {}
  export interface ModifyLimits extends ModifyLimitsParams {}
  export interface ModifyOracle extends ModifyOracleParams {}
  export interface ModifyFunding extends ModifyFundingParams {}
  export interface ModifyAddresses extends ModifyAddressesParams {}
  export interface ModifyTiers extends ModifyTiersParams {}
  export interface ChangeAllowBeneficialInvestments extends ChangeAllowBeneficialInvestmentsParams {}
  export interface BuyWithETH extends BuyWithETHParams {}
  export interface BuyWithETHRateLimited extends BuyWithETHRateLimitedParams {}
  export interface BuyWithPOLY extends BuyWithPOLYParams {}
  export interface BuyWithPOLYRateLimited extends BuyWithPOLYRateLimitedParams {}
  export interface BuyWithUSD extends BuyWithUSDParams {}
  export interface BuyWithUSDRateLimited extends BuyWithUSDRateLimitedParams {}
}

/**
 * @param tier Index of Tier
 */
export interface TierIndexParams {
  tier: number;
}

/**
 * @param fundRaiseType Currency key
 * @param amount Value to convert from USD
 */
interface ConvertToOrFromUSDParams {
  fundRaiseType: FundRaiseType;
  amount: BigNumber;
}

/**
 * @param fundRaiseType Fund raise type to get rate of
 */
interface FundRaiseTypeParams {
  fundRaiseType: FundRaiseType;
}

/**
 * @param stableCoinAddress Address of USD Stable Coin
 */
interface StableCoinParams {
  stableCoinAddress: string;
}

/**
 * @param investorAddress Address of Investor
 */
interface InvestorAddressParams {
  investorAddress: string;
}

/**
 * @param investorAddress Address of Investor
 * @param fundRaiseType
 */
interface InvestorInvestedParams {
  investorAddress: string;
  fundRaiseType: FundRaiseType;
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
 * @param nonAccreditedLimitUSD max non accredited invets limit
 * @param minimumInvestmentUSD overall minimum investment limit
 */
interface ModifyOracleParams extends TxParams {
  fundRaiseType: FundRaiseType;
  oracleAddress: string;
}

/**
 * @param fundRaiseTypes Array of fund raise types to allow
 */
interface ModifyFundingParams extends TxParams {
  fundRaiseTypes: FundRaiseType[];
}

/**
 * @param wallet Address of wallet where funds are sent
 * @param treasuryWallet Address of wallet where unsold tokens are sent
 * @param usdTokens Address of usd tokens
 */
interface ModifyAddressesParams extends TxParams {
  wallet: string;
  treasuryWallet: string;
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

/**
 * @param allowBeneficialInvestments Boolean to allow or disallow beneficial investments
 */
interface ChangeAllowBeneficialInvestmentsParams extends TxParams {
  allowBeneficialInvestments: boolean;
}

/**
 * @param beneficiary Address of beneficiary for tokens
 * @param ETH value used to buy
 */
interface BuyWithETHParams extends TxParams {
  beneficiary: string;
  value: BigNumber;
}

/**
 * @param minTokens Minimum amount of tokens to buy else revert
 */
interface BuyWithETHRateLimitedParams extends BuyWithETHParams {
  minTokens: BigNumber;
}

/**
 * @param beneficiary Address of beneficiary for tokens
 * @param investedPOLY Value of poly invested
 */
interface BuyWithPOLYParams extends TxParams {
  beneficiary: string;
  investedPOLY: BigNumber;
}

/**
 * @param minTokens Minimum amount of tokens to buy else revert
 */
interface BuyWithPOLYRateLimitedParams extends BuyWithPOLYParams {
  minTokens: BigNumber;
}

/**
 * @param beneficiary Address of beneficiary for tokens
 * @param investedSC Amount of stable coin invested
 * @param usdToken USD stable coin address to buy tokens with
 */
interface BuyWithUSDParams extends TxParams {
  beneficiary: string;
  investedSC: BigNumber;
  usdToken: string;
}

/**
 * @param minTokens Minimum amount of tokens to buy else revert
 */
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
}

// End of return types //

/**
 * This class includes the functionality related to interacting with the USDTieredSTO contract.
 */
export default class USDTieredSTOWrapper extends STO {
  public contract: Promise<USDTieredSTOContract_3_0_0 | USDTieredSTOContract_3_1_0>;

  public generalTransferManagerContract = async (address: string): Promise<GeneralTransferManagerContract_3_0_0> => {
    return this.contractFactory.getGeneralTransferManagerContract(address);
  };

  /**
   * Instantiate USDTieredSTOWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<USDTieredSTOContract_3_0_0 | USDTieredSTOContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Determine whether users can invest on behalf of a beneficiary
   * @return boolean status
   */
  public allowBeneficialInvestments = async (): Promise<boolean> => {
    return (await this.contract).allowBeneficialInvestments.callAsync();
  };

  /**
   *  Check if the module is paused
   *  @return boolean if paused
   */
  public paused = async (): Promise<boolean> => {
    return (await this.contract).paused.callAsync();
  };

  /**
   * Final amount of tokens returned to the issuer
   * @return amount of tokens
   */
  public finalAmountReturned = async (): Promise<BigNumber> => {
    return weiToValue(
      await (await this.contract).finalAmountReturned.callAsync(),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };

  /**
   * Amount in fund raise type invested by each investor
   * @return amount invested
   */
  public investorInvested = async (params: InvestorInvestedParams) => {
    assert.isETHAddressHex('investorAddress', params.investorAddress);
    return weiToValue(
      await (await this.contract).investorInvested.callAsync(params.investorAddress, params.fundRaiseType),
      FULL_DECIMALS,
    );
  };

  /**
   * Amount in USD invested by each address
   * @return invested amount
   */
  public investorInvestedUSD = async (params: InvestorAddressParams): Promise<BigNumber> => {
    assert.isETHAddressHex('investorAddress', params.investorAddress);
    return weiToValue(await (await this.contract).investorInvestedUSD.callAsync(params.investorAddress), FULL_DECIMALS);
  };

  /**
   * Function to set allowBeneficialInvestments (allow beneficiary to be different to funder)
   */
  public changeAllowBeneficialInvestments = async (params: ChangeAllowBeneficialInvestmentsParams) => {
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    assert.assert(
      params.allowBeneficialInvestments !== (await this.allowBeneficialInvestments()),
      ErrorCode.PreconditionRequired,
      'The value must be different',
    );
    return (await this.contract).changeAllowBeneficialInvestments.sendTransactionAsync(
      params.allowBeneficialInvestments,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Buy with eth without rate restriction
   */
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

  /**
   * Buy with poly without rate restriction
   */
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

  /**
   * Buy with USD stable coin without rate restriction
   */
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

  /**
   * Buy tokens with eth and with rate restriction
   */
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

  /**
   * Buy tokens with poly and with rate restriction
   */
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

  /**
   * Buy tokens with usd stable coin and with rate restriction
   */
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

  /**
   * This function returns whether or not the STO is in fundraising mode (open)
   * @return bool Whether the STO is accepting investments
   */
  public isOpen = async (): Promise<boolean> => {
    return (await this.contract).isOpen.callAsync();
  };

  /**
   * Checks whether the cap has been reached.
   * @return bool Whether the cap was reached
   */
  public capReached = async (): Promise<boolean> => {
    return (await this.contract).capReached.callAsync();
  };

  /**
   * returns current conversion rate of funds
   * @return rate value
   */
  public getRate = async (params: FundRaiseTypeParams): Promise<BigNumber> => {
    return weiToValue(await (await this.contract).getRate.callAsync(params.fundRaiseType), FULL_DECIMALS);
  };

  /**
   * This function converts from USD to ETH or POLY
   * @return Value in ETH or POLY
   */
  public convertFromUSD = async (params: ConvertToOrFromUSDParams) => {
    return weiToValue(
      await (await this.contract).convertFromUSD.callAsync(
        params.fundRaiseType,
        valueToWei(params.amount, FULL_DECIMALS),
      ),
      FULL_DECIMALS,
    );
  };

  /**
   * Return the total no. of tokens minted
   * @return Total number of tokens minted
   */
  public getTokensMinted = async (): Promise<BigNumber> => {
    return weiToValue(
      await (await this.contract).getTokensMinted.callAsync(),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };

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
    };
    return typedResult;
  };

  /**
   * Get current tier
   * @returns current tier number
   */
  public currentTier = async (): Promise<number> => {
    return (await (await this.contract).currentTier.callAsync()).toNumber();
  };

  /**
   * Get the limit in USD for non-accredited investors
   * @returns non accredited limit usd value
   */
  public nonAccreditedLimitUSD = async (): Promise<BigNumber> => {
    return weiToValue(await (await this.contract).nonAccreditedLimitUSD.callAsync(), FULL_DECIMALS);
  };

  /**
   * Get the minimun investment in USD
   * @return minimumInvestmentUSD value
   */
  public minimumInvestmentUSD = async (): Promise<BigNumber> => {
    return weiToValue(await (await this.contract).minimumInvestmentUSD.callAsync(), FULL_DECIMALS);
  };

  /**
   * Return the total no. of tokens sold
   * @return token sold amount
   */
  public getTokensSold = async (): Promise<BigNumber> => {
    return weiToValue(
      await (await this.contract).getTokensSold.callAsync(),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };


  /**
   * Return the total no. of tiers
   * @return tier count
   */
  public getNumberOfTiers = async (): Promise<number> => {
    return (await (await this.contract).getNumberOfTiers.callAsync()).toNumber();
  };

  /**
   * Return the usd tokens accepted by the STO
   * @return list of usd token addresses
   */
  public getUsdTokens = async (): Promise<string[]> => {
    return (await this.contract).getUsdTokens.callAsync();
  };

  /**
   * Amount of USD funds raised
   * @return value usd funds
   */
  public fundsRaisedUSD = async (): Promise<BigNumber> => {
    return weiToValue(await (await this.contract).fundsRaisedUSD.callAsync(), FULL_DECIMALS);
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
   * Amount of stable coin raised
   * @return stable coin amount
   */
  public stableCoinsRaised = async (params: StableCoinParams): Promise<BigNumber> => {
    assert.isETHAddressHex('stableCoinAddress', params.stableCoinAddress);
    return weiToValue(await (await this.contract).stableCoinsRaised.callAsync(params.stableCoinAddress), FULL_DECIMALS);
  };

  /**
   * Modifies the list of overrides for non-accredited limits in USD
   */
  public changeNonAccreditedLimit = async (params: ChangeNonAccreditedLimitParams) => {
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    params.investors.forEach(address => assert.isETHAddressHex('investors', address));
    assert.assert(
      params.investors.length === params.nonAccreditedLimit.length,
      ErrorCode.MismatchedArrayLength,
      'Array length mismatch',
    );
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
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    assert.isFutureDate(await this.startTime(), 'STO already started');
    assert.assert(params.endTime > params.startTime, ErrorCode.TooEarly, 'Start date must be greater than end time');
    assert.isFutureDate(params.startTime, 'Start date must be in the future');
    return (await this.contract).modifyTimes.sendTransactionAsync(
      dateToBigNumber(params.startTime),
      dateToBigNumber(params.endTime),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Modifies oracle
   */
  public modifyOracle = async (params: ModifyOracleParams) => {
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    assert.assert(
      params.fundRaiseType === FundRaiseType.POLY || params.fundRaiseType === FundRaiseType.ETH,
      ErrorCode.InvalidData,
      'Invalid currency',
    );
    return (await this.contract).modifyOracle.sendTransactionAsync(
      params.fundRaiseType,
      params.oracleAddress,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Modifies max non accredited investment limit and overall minimum investment limit
   */
  public modifyLimits = async (params: ModifyLimitsParams) => {
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    assert.isFutureDate(await this.startTime(), 'STO already started');
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
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    assert.isFutureDate(await this.startTime(), 'STO already started');
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
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    params.usdTokens.forEach(address => assert.isETHAddressHex('usdTokens', address));
    assert.isNonZeroETHAddressHex('wallet', params.wallet);
    assert.isNonZeroETHAddressHex('treasuryWallet', params.treasuryWallet);
    return (await this.contract).modifyAddresses.sendTransactionAsync(
      params.wallet,
      params.treasuryWallet,
      params.usdTokens,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Modifiers STO tiers. All tiers must be passed, can not edit specific tiers.
   */
  public modifyTiers = async (params: ModifyTiersParams) => {
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    assert.isFutureDate(await this.startTime(), 'STO already started');
    assert.assert(params.tokensPerTierTotal.length > 0, ErrorCode.InvalidData, 'No tiers provided');
    assert.assert(
      params.ratePerTier.length === params.tokensPerTierTotal.length &&
        params.ratePerTierDiscountPoly.length === params.tokensPerTierTotal.length &&
        params.tokensPerTierDiscountPoly.length === params.tokensPerTierTotal.length,
      ErrorCode.MismatchedArrayLength,
      'Tier data arrays length mismatch',
    );
    for (let i = 0; i < params.tokensPerTierTotal.length; i += 1) {
      assert.isBigNumberGreaterThanZero(params.ratePerTier[i], 'Invalid rate');
      assert.isBigNumberGreaterThanZero(params.tokensPerTierTotal[i], 'Invalid token amount');
      assert.assert(
        params.tokensPerTierDiscountPoly[i].isLessThanOrEqualTo(params.tokensPerTierTotal[i]),
        ErrorCode.InvalidDiscount,
        'Too many discounted tokens',
      );
      assert.assert(
        params.ratePerTierDiscountPoly[i].isLessThanOrEqualTo(params.ratePerTier[i]),
        ErrorCode.InvalidDiscount,
        'Invalid discount',
      );
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
   * Returns investor accredited & non-accredited override information
   * @return investor[], accredited data value, nonAccreditedLimitUSDOverride value
   */
  public getAccreditedData = async (): Promise<AccreditedData[]> => {
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

  public checkIfBuyIsValid = async (
    beneficiary: string,
    from: string,
    investmentValue: BigNumber,
    fundRaiseType: FundRaiseType,
    usdToken?: string,
  ) => {
    assert.isETHAddressHex('beneficiary', beneficiary);
    assert.assert(!(await this.paused()), ErrorCode.PreconditionRequired, 'Contract is Paused');
    assert.assert(await this.isOpen(), ErrorCode.STOClosed, 'STO not open');
    assert.isBigNumberGreaterThanZero(investmentValue, 'No funds were sent');
    const stoDetails = await this.getSTODetails();
    switch (fundRaiseType) {
      case FundRaiseType.ETH: {
        assert.assert(stoDetails.isRaisedInETH, ErrorCode.CoinNotAllowed, 'ETH Not Allowed');
        const weiBalance = await this.web3Wrapper.getBalanceInWeiAsync(from);
        assert.assert(
          weiBalance.isGreaterThan(investmentValue),
          ErrorCode.InsufficientBalance,
          'Insufficient ETH funds',
        );
        break;
      }
      case FundRaiseType.POLY: {
        assert.assert(stoDetails.isRaisedInPOLY, ErrorCode.CoinNotAllowed, 'POLY Not Allowed');
        const polyTokenBalance = await (await this.polyTokenContract()).balanceOf.callAsync(from);
        assert.assert(
          polyTokenBalance.isGreaterThanOrEqualTo(investmentValue),
          ErrorCode.InsufficientBalance,
          'Budget less than amount unable to transfer fee',
        );
        break;
      }
      case FundRaiseType.StableCoin: {
        assert.assert(stoDetails.isRaisedInSC, ErrorCode.CoinNotAllowed, 'USD Not Allowed');
        assert.assert(usdToken !== null, ErrorCode.InvalidAddress, 'USD Token Address must exist');
        if (usdToken) {
          const scTokenBalance = await (await this.detailedERC20TokenContract(usdToken)).balanceOf.callAsync(from);
          assert.assert(
            scTokenBalance.isGreaterThanOrEqualTo(investmentValue),
            ErrorCode.InsufficientBalance,
            'Budget less than amount unable to transfer fee',
          );
        }
        break;
      }
      default: {
        assert.assert(false, ErrorCode.InvalidData, 'Missing fundraise type');
        break;
      }
    }
    if (!(await this.allowBeneficialInvestments())) {
      assert.assert(
        functionsUtils.checksumAddressComparision(beneficiary, from),
        ErrorCode.Unauthorized,
        'Beneficiary address must be the same as sender',
      );
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
      ErrorCode.PreconditionRequired,
      'Investment amount must be greater than the minimum investment amount',
    );

    const generalTMAddress = await (await this.securityTokenContract()).getModulesByName.callAsync(
      stringToBytes32(ModuleName.GeneralTransferManager),
    );
    const generalTM = new GeneralTransferManagerWrapper(
      this.web3Wrapper,
      this.generalTransferManagerContract(generalTMAddress[0]),
      this.contractFactory,
    );
    if (await generalTM.getInvestorFlag({ investor: beneficiary, flag: 0 })) {
      const accreditedData = await this.getAccreditedData();
      let nonAccreditedLimit;
      for (let i = 0; i < accreditedData.length; i += 1) {
        if (accreditedData[i].investor === beneficiary) {
          nonAccreditedLimit = accreditedData[i].accreditedData.nonAccreditedLimitUSDOverride;
        }
      }
      const nonAccreditedLimitUSD =
        !nonAccreditedLimit || nonAccreditedLimit.isEqualTo(BIG_NUMBER_ZERO)
          ? await this.nonAccreditedLimitUSD()
          : nonAccreditedLimit;
      assert.assert(
        investorInvestedUSD.isLessThan(nonAccreditedLimitUSD),
        ErrorCode.PreconditionRequired,
        'Over investor limit',
      );
    }
  };
}
