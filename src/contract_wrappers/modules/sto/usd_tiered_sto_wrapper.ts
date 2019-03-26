import {
  USDTieredSTOContract,
  USDTieredSTOEventArgs,
  USDTieredSTOEvents,
  USDTieredSTOSetAllowBeneficialInvestmentsEventArgs,
  USDTieredSTOSetNonAccreditedLimitEventArgs,
  USDTieredSTOSetAccreditedEventArgs,
  USDTieredSTOTokenPurchaseEventArgs,
  USDTieredSTOFundsReceivedEventArgs,
  USDTieredSTOReserveTokenMintEventArgs,
  USDTieredSTOSetAddressesEventArgs,
  USDTieredSTOSetLimitsEventArgs,
  USDTieredSTOSetTimesEventArgs,
  USDTieredSTOSetTiersEventArgs,
  USDTieredSTOSetFundRaiseTypesEventArgs,
  USDTieredSTOPauseEventArgs,
  USDTieredSTOUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { USDTieredSTO } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import * as _ from 'lodash';
import {
  TxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
  TxPayableParams,
} from '../../../types';
import { assert } from '../../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { STOWrapper } from './sto_wrapper';

interface ISetAllowBeneficialInvestmentsSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetAllowBeneficialInvestments,
  callback: EventCallback<USDTieredSTOSetAllowBeneficialInvestmentsEventArgs>,
}

interface IGetSetAllowBeneficialInvestmentsLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetAllowBeneficialInvestments,
}

interface ISetNonAccreditedLimitSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetNonAccreditedLimit,
  callback: EventCallback<USDTieredSTOSetNonAccreditedLimitEventArgs>,
}

interface IGetSetNonAccreditedLimitLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetNonAccreditedLimit,
}

interface ISetAccreditedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetAccredited,
  callback: EventCallback<USDTieredSTOSetAccreditedEventArgs>,
}

interface IGetSetAccreditedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetAccredited,
}

interface ITokenPurchaseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOEvents.TokenPurchase,
  callback: EventCallback<USDTieredSTOTokenPurchaseEventArgs>,
}

interface IGetTokenPurchaseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOEvents.TokenPurchase,
}

interface IFundsReceivedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOEvents.FundsReceived,
  callback: EventCallback<USDTieredSTOFundsReceivedEventArgs>,
}

interface IGetFundsReceivedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOEvents.FundsReceived,
}

interface IReserveTokenMintSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOEvents.ReserveTokenMint,
  callback: EventCallback<USDTieredSTOReserveTokenMintEventArgs>,
}

interface IGetReserveTokenMintLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOEvents.ReserveTokenMint,
}

interface ISetAddressesSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetAddresses,
  callback: EventCallback<USDTieredSTOSetAddressesEventArgs>,
}

interface IGetSetAddressesLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetAddresses,
}

interface ISetLimitsSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetLimits,
  callback: EventCallback<USDTieredSTOSetLimitsEventArgs>,
}

interface IGetSetLimitsLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetLimits,
}

interface ISetTimesSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetTimes,
  callback: EventCallback<USDTieredSTOSetTimesEventArgs>,
}

interface IGetSetTimesLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetTimes,
}

interface ISetTiersSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetTiers,
  callback: EventCallback<USDTieredSTOSetTiersEventArgs>,
}

interface IGetSetTiersLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetTiers,
}

interface ISetFundRaiseTypesSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOEvents.SetFundRaiseTypes,
  callback: EventCallback<USDTieredSTOSetFundRaiseTypesEventArgs>,
}

interface IGetSetFundRaiseTypesLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOEvents.SetFundRaiseTypes,
}

interface IPauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOEvents.Pause,
  callback: EventCallback<USDTieredSTOPauseEventArgs>,
}

interface IGetPauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOEvents.Pause,
}

interface IUnpauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: USDTieredSTOEvents.Unpause,
  callback: EventCallback<USDTieredSTOUnpauseEventArgs>,
}

interface IGetUnpauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: USDTieredSTOEvents.Unpause,
}

interface IUSDTieredSTOSubscribeAsyncParams {
  (params: ISetAllowBeneficialInvestmentsSubscribeAsyncParams): Promise<string>,
  (params: ISetNonAccreditedLimitSubscribeAsyncParams): Promise<string>,
  (params: ISetAccreditedSubscribeAsyncParams): Promise<string>,
  (params: ITokenPurchaseSubscribeAsyncParams): Promise<string>,
  (params: IFundsReceivedSubscribeAsyncParams): Promise<string>,
  (params: IReserveTokenMintSubscribeAsyncParams): Promise<string>,
  (params: ISetAddressesSubscribeAsyncParams): Promise<string>,
  (params: ISetLimitsSubscribeAsyncParams): Promise<string>,
  (params: ISetTimesSubscribeAsyncParams): Promise<string>,
  (params: ISetTiersSubscribeAsyncParams): Promise<string>,
  (params: ISetFundRaiseTypesSubscribeAsyncParams): Promise<string>,
  (params: IPauseSubscribeAsyncParams): Promise<string>,
  (params: IUnpauseSubscribeAsyncParams): Promise<string>,
}

interface IGetUSDTieredSTOLogsAsyncParams {
  (params: IGetSetAllowBeneficialInvestmentsLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOSetAllowBeneficialInvestmentsEventArgs>>>,
  (params: IGetSetNonAccreditedLimitLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOSetNonAccreditedLimitEventArgs>>>,
  (params: IGetSetAccreditedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOSetAccreditedEventArgs>>>,
  (params: IGetTokenPurchaseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOTokenPurchaseEventArgs>>>,
  (params: IGetFundsReceivedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOFundsReceivedEventArgs>>>,
  (params: IGetReserveTokenMintLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOReserveTokenMintEventArgs>>>,
  (params: IGetSetAddressesLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOSetAddressesEventArgs>>>,
  (params: IGetSetLimitsLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOSetLimitsEventArgs>>>,
  (params: IGetSetTimesLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOSetTimesEventArgs>>>,
  (params: IGetSetTiersLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOSetTiersEventArgs>>>,
  (params: IGetSetFundRaiseTypesLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOSetFundRaiseTypesEventArgs>>>,
  (params: IGetPauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOPauseEventArgs>>>,
  (params: IGetUnpauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<USDTieredSTOUnpauseEventArgs>>>,
}

interface TierIndexParams {
  tier: BigNumber;
}

interface ConvertToOrFromUSDParams {
  fundRaiseType: number;
  amount: BigNumber;
}

interface FundRaiseTypeParams {
  fundRaiseType: number;
}

interface StableCoinParams {
  stableCoinAddress: string;
}

interface InvestorIndexParams {
  investorIndex: BigNumber,
}

interface InvestorAddressParams {
  investorAddress: string,
}

interface InvestorInvestedParams {
  investorAddress: string,
  fundRaiseType: number,
}

interface UsdTokenIndexParams {
  usdTokenIndex: BigNumber,
}

interface BuyTokensViewParams {
  beneficiary: string,
  investmentValue: BigNumber,
  fundRaiseType: number,
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
  startTime: BigNumber;
  endTime: BigNumber;
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
  fundRaiseTypes: number[];
}

/**
* @param wallet Address of wallet where funds are sent
* @param reserveWallet Address of wallet where unsold tokens are sent
* @param usdTokens Address of usd tokens
*/
interface ModifyAddressesParams extends TxParams {
  wallet: string;
  reserveWallet: string;
  usdToken: string[];
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

interface ConfigureParams extends TxParams {
  startTime: BigNumber,
  endTime: BigNumber,
  ratePerTier: BigNumber[],
  ratePerTierDiscountPoly: BigNumber[],
  tokensPerTierTotal: BigNumber[],
  tokensPerTierDiscountPoly: BigNumber[],
  nonAccreditedLimitUSD: BigNumber,
  minimumInvestmentUSD: BigNumber,
  fundRaiseTypes: Array<number|BigNumber>,
  wallet: string,
  reserveWallet: string,
  usdTokens: string[],
}

interface ChangeAllowBeneficialInvestmentsParams extends TxParams {
  allowBeneficialInvestments: boolean,
}

interface BuyWithETHParams extends TxPayableParams {
  beneficiary: string,
}

interface BuyWithETHRateLimitedParams extends BuyWithETHParams {
  minTokens: BigNumber,
}

interface BuyWithPOLYParams extends TxParams {
  beneficiary: string,
  investedPOLY: BigNumber,
}

interface BuyWithPOLYRateLimitedParams extends BuyWithPOLYParams {
  minTokens: BigNumber,
}

interface BuyWithUSDParams extends TxParams {
  beneficiary: string,
  investedSC: BigNumber,
  usdToken: string,
}

interface BuyWithUSDRateLimitedParams extends BuyWithUSDParams {
  minTokens: BigNumber,
}

/**
 * This class includes the functionality related to interacting with the USDTieredSTO contract.
 */
export class USDTieredSTOWrapper extends STOWrapper {
  public abi: ContractAbi = (USDTieredSTO as any).abi;
  protected _contract: Promise<USDTieredSTOContract>;

  /**
   * Instantiate USDTieredSTOWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, address: string) {
    super(web3Wrapper, address);
    this._contract = this._getUSDTieredSTOContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this._contract).address;
  }

  public investorsList = async (params: InvestorIndexParams): Promise<string> => {
    return await (await this._contract).investorsList.callAsync(
      params.investorIndex,
    );
  }

  public allowBeneficialInvestments = async (): Promise<boolean> => {
    return await (await this._contract).allowBeneficialInvestments.callAsync();
  }

  public paused = async (): Promise<boolean> => {
    return await (await this._contract).paused.callAsync();
  }

  public finalAmountReturned = async (): Promise<BigNumber> => {
    return await (await this._contract).finalAmountReturned.callAsync();
  }

  public investors = async (params: InvestorAddressParams): Promise<[BigNumber, BigNumber, BigNumber]> => {
    return await (await this._contract).investors.callAsync(
      params.investorAddress,
    );
  }

  public investorInvested = async (params: InvestorInvestedParams): Promise<BigNumber> => {
    return await (await this._contract).investorInvested.callAsync(
      params.investorAddress,
      params.fundRaiseType,
    );
  }

  public usdTokenEnabled = async (params: StableCoinParams): Promise<boolean> => {
    return await (await this._contract).usdTokenEnabled.callAsync(
      params.stableCoinAddress,
    );
  }

  public ETH_ORACLE = async (): Promise<string> => {
    return await (await this._contract).ETH_ORACLE.callAsync();
  }

  public usdTokens = async (params: UsdTokenIndexParams): Promise<string> => {
    return await (await this._contract).usdTokens.callAsync(
      params.usdTokenIndex,
    );
  }

  public investorInvestedUSD = async (params: InvestorAddressParams): Promise<BigNumber> => {
    return await (await this._contract).investorInvestedUSD.callAsync(
      params.investorAddress,
    );
  }

  public configure = async (params: ConfigureParams) => {
    return async () => {
      return (await this._contract).configure.sendTransactionAsync(
        params.startTime,
        params.endTime,
        params.ratePerTier,
        params.ratePerTierDiscountPoly,
        params.tokensPerTierTotal,
        params.tokensPerTierDiscountPoly,
        params.nonAccreditedLimitUSD,
        params.minimumInvestmentUSD,
        params.fundRaiseTypes,
        params.wallet,
        params.reserveWallet,
        params.usdTokens,
        params.txData,
        params.safetyFactor
      );
    }
  }

  public changeAllowBeneficialInvestments = async (params: ChangeAllowBeneficialInvestmentsParams) => {
    return async () => {
      return (await this._contract).changeAllowBeneficialInvestments.sendTransactionAsync(
        params.allowBeneficialInvestments,
        params.txData,
        params.safetyFactor
      );
    }
  }

  public buyWithETH = async (params: BuyWithETHParams) => {
    return async () => {
      return (await this._contract).buyWithETH.sendTransactionAsync(
        params.beneficiary,
        params.txData,
        params.safetyFactor
      );
    }
  }

  public buyWithPOLY = async (params: BuyWithPOLYParams) => {
    return async () => {
      return (await this._contract).buyWithPOLY.sendTransactionAsync(
        params.beneficiary,
        params.investedPOLY,
        params.txData,
        params.safetyFactor
      );
    }
  }

  public buyWithUSD = async (params: BuyWithUSDParams) => {
    return async () => {
      return (await this._contract).buyWithUSD.sendTransactionAsync(
        params.beneficiary,
        params.investedSC,
        params.usdToken,
        params.txData,
        params.safetyFactor
      );
    }
  }

  public buyWithETHRateLimited = async (params: BuyWithETHRateLimitedParams) => {
    return async () => {
      return (await this._contract).buyWithETHRateLimited.sendTransactionAsync(
        params.beneficiary,
        params.minTokens,
        params.txData,
        params.safetyFactor
      );
    }
  }

  public buyWithPOLYRateLimited = async (params: BuyWithPOLYRateLimitedParams) => {
    return async () => {
      return (await this._contract).buyWithPOLYRateLimited.sendTransactionAsync(
        params.beneficiary,
        params.investedPOLY,
        params.minTokens,
        params.txData,
        params.safetyFactor
      );
    }
  }

  public buyWithUSDRateLimited = async (params: BuyWithUSDRateLimitedParams) => {
    return async () => {
      return (await this._contract).buyWithUSDRateLimited.sendTransactionAsync(
        params.beneficiary,
        params.investedSC,
        params.minTokens,
        params.usdToken,
        params.txData,
        params.safetyFactor
      );
    }
  }

  public buyTokensView = async (params: BuyTokensViewParams): Promise<[BigNumber, BigNumber, BigNumber]> => {
    return await (await this._contract).buyTokensView.callAsync(
      params.beneficiary,
      params.investmentValue,
      params.fundRaiseType,
    );
  }

  public isOpen = async (): Promise<boolean> => {
    return await (await this._contract).isOpen.callAsync();
  }

  public capReached = async (): Promise<boolean> => {
    return await (await this._contract).capReached.callAsync();
  }

  public getRate = async (params: FundRaiseTypeParams): Promise<BigNumber> => {
    return await (await this._contract).getRate.callAsync(
      params.fundRaiseType,
    );
  }

  public convertFromUSD = async (params: ConvertToOrFromUSDParams): Promise<BigNumber> => {
    return await (await this._contract).convertFromUSD.callAsync(
      params.fundRaiseType,
      params.amount,
    );
  }

  public getTokensMinted = async (): Promise<BigNumber> => {
    return await (await this._contract).getTokensMinted.callAsync();
  }

  public getTokensSoldByTier = async (params: TierIndexParams): Promise<BigNumber> => {
    return await (await this._contract).getTokensSoldByTier.callAsync(
      params.tier,
    );
  }

  public getSTODetails = async (): Promise<[BigNumber, BigNumber, BigNumber, BigNumber[], BigNumber[], BigNumber, BigNumber, BigNumber, boolean[]]> => {
    return await (await this._contract).getSTODetails.callAsync();
  }

  /**
   * Current tier
   */
  public currentTier = async (): Promise<BigNumber> => {
    return await (await this._contract).currentTier.callAsync();
  }

  /**
   * Get the limit in USD for non-accredited investors
   */
  public nonAccreditedLimitUSD = async (): Promise<BigNumber> => {
    return await (await this._contract).nonAccreditedLimitUSD.callAsync();
  }

  /**
   * Get the minimun investment in USD
   */
  public minimumInvestmentUSD = async (): Promise<BigNumber> => {
    return await (await this._contract).minimumInvestmentUSD.callAsync();
  }

  /**
   * Ethereum account address to receive unsold tokens
   */
  public reserveWallet = async (): Promise<string> => {
    return await (await this._contract).reserveWallet.callAsync();
  }

  /**
   * Return the total no. of tokens sold
   */
  public getTokensSold = async (): Promise<BigNumber> => {
    return await (await this._contract).getTokensSold.callAsync();
  }

  /**
   * Whether or not the STO has been finalized
   */
  public isFinalized = async (): Promise<boolean> => {
    return await (await this._contract).isFinalized.callAsync();
  }

  /**
   * Return the total no. of tiers
   */
  public getNumberOfTiers = async (): Promise<BigNumber> => {
    return await (await this._contract).getNumberOfTiers.callAsync();
  }

  /**
   * Return the usd tokens accepted by the STO
   */
  public getUsdTokens = async (): Promise<string[]> => {
    return await (await this._contract).getUsdTokens.callAsync();
  }

  /**
   * Amount of USD funds raised
   */
  public fundsRaisedUSD = async (): Promise<BigNumber> => {
    return await (await this._contract).fundsRaisedUSD.callAsync();
  }

  /**
   * Get specific tier
   */
  public tiers = async (params: TierIndexParams): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]> => {
    return await (await this._contract).tiers.callAsync(params.tier);
  }

  /**
   * Return array of minted tokens in each fund raise type for given tier
   */
  public getTokensMintedByTier = async (params: TierIndexParams): Promise<BigNumber[]> => {
    return await (await this._contract).getTokensMintedByTier.callAsync(params.tier);
  }

  /**
   * This function converts from ETH or POLY to USD
   * @return Value in USD
   */
  public convertToUSD = async (params: ConvertToOrFromUSDParams): Promise<BigNumber> => {
    return await (await this._contract).convertToUSD.callAsync(
      params.fundRaiseType,
      params.amount,
    );
  }

  /**
   * Return the total no. of tokens sold for the given fund raise type
   * @return Total number of tokens sold for ETH
   */
  public getTokensSoldFor = async (params: FundRaiseTypeParams): Promise<BigNumber> => {
    return await (await this._contract).getTokensSoldFor.callAsync(params.fundRaiseType);
  }

  /**
   * Amount of stable coins raised
   */
  public stableCoinsRaised = async (params: StableCoinParams): Promise<BigNumber> => {
    return await (await this._contract).stableCoinsRaised.callAsync(params.stableCoinAddress);
  }

  /**
   * Finalizes the STO and mint remaining tokens to reserve address
   * Reserve address must be whitelisted to successfully finalize
   */
  public finalize = async (params: TxParams) => {
    return async () => {
      return (await this._contract).finalize.sendTransactionAsync(
        params.txData,
        params.safetyFactor
      );
    }
  }

  /**
   * Modifies the list of accredited addresses
   */
  public changeAccredited = async (params: ChangeAccreditedParams) => {
    return async () => {
      return (await this._contract).changeAccredited.sendTransactionAsync(
        params.investors,
        params.accredited,
        params.txData,
        params.safetyFactor
      );
    }
  }

  /**
   * Modifies the list of overrides for non-accredited limits in USD
   */
  public changeNonAccreditedLimit = async (params: ChangeNonAccreditedLimitParams) => {
    return async () => {
      return (await this._contract).changeNonAccreditedLimit.sendTransactionAsync(
        params.investors,
        params.nonAccreditedLimit,
        params.txData,
        params.safetyFactor
      );
    }
  }

  /**
   * Modifies STO start and end times
   */
  public modifyTimes = async (params: ModifyTimesParams) => {
    return async () => {
      return (await this._contract).modifyTimes.sendTransactionAsync(
        params.startTime,
        params.endTime,
        params.txData,
        params.safetyFactor
      );
    }
  }

  /**
   * Modifies max non accredited invets limit and overall minimum investment limit
   */
  public modifyLimits = async (params: ModifyLimitsParams) => {
    return async () => {
      return (await this._contract).modifyLimits.sendTransactionAsync(
        params.nonAccreditedLimitUSD,
        params.minimumInvestmentUSD,
        params.txData,
        params.safetyFactor
      );
    }
  }

  /**
   * Modifies fund raise types
   */
  public modifyFunding = async (params: ModifyFundingParams) => {
    return async () => {
      return (await this._contract).modifyFunding.sendTransactionAsync(
        params.fundRaiseTypes,
        params.txData,
        params.safetyFactor
      );
    }
  }

  /**
   * Modifies addresses used as wallet, reserve wallet and usd token
   */
  public modifyAddresses = async (params: ModifyAddressesParams) => {
    return async () => {
      return (await this._contract).modifyAddresses.sendTransactionAsync(
        params.wallet,
        params.reserveWallet,
        params.usdToken,
        params.txData,
        params.safetyFactor
      );
    }
  }

  /**
   * Modifiers STO tiers. All tiers must be passed, can not edit specific tiers.
   */
  public modifyTiers = async (params: ModifyTiersParams) => {
    return async () => {
      return (await this._contract).modifyTiers.sendTransactionAsync(
        params.ratePerTier,
        params.ratePerTierDiscountPoly,
        params.tokensPerTierTotal,
        params.tokensPerTierDiscountPoly,
        params.txData,
        params.safetyFactor
      );
    }
  }

  /**
   * Returns investor accredited & non-accredited override informatiomn
   */
  public getAccreditedData = async (): Promise<[string[], boolean[], BigNumber[]]> => {
    return await (await this._contract).getAccreditedData.callAsync();
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: IUSDTieredSTOSubscribeAsyncParams = async <ArgsType extends USDTieredSTOEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, USDTieredSTOEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        (USDTieredSTO as any).abi,
        params.callback,
        !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Cancel a subscription
   * @param subscriptionToken Subscription token returned by `subscribe()`
   */
  public unsubscribe = (subscriptionToken: string): void => {
    assert.isValidSubscriptionToken('subscriptionToken', subscriptionToken);
    this._unsubscribe(subscriptionToken);
  }

  /**
   * Cancels all existing subscriptions
   */
  public unsubscribeAll = (): void => {
    super._unsubscribeAll();
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetUSDTieredSTOLogsAsyncParams = async <ArgsType extends USDTieredSTOEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, USDTieredSTOEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        (USDTieredSTO as any).abi,
    );
    return logs;
  }

  private async _getUSDTieredSTOContract(): Promise<USDTieredSTOContract> {
    return new USDTieredSTOContract(
      this.abi,
      this._address,
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
