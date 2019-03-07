import { USDTieredSTOContract, USDTieredSTOEventArgs, USDTieredSTOEvents } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { USDTieredSTO } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import {
  ITxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
} from '../types';
import { assert } from '../utils/assert';
import { schemas } from '@0x/json-schemas';

/**
 * 
 */
export interface IGetFundRaiseTypesParams {
  index: number;
}

/**
 * 
 */
export interface IGetFundsRaisedParams {
  index: number;
}

export interface IGetTiersParams {
  index: BigNumber;
}

export interface IGetTokensMintedByTierParams {
  tier: BigNumber;
}

/**
* @param fundRaiseType Currency key
* @param amount Value to convert to USD
*/
export interface IConvertToUSDParams {
  fundRaiseType: number;
  amount: BigNumber;
}

/**
* @param fundRaiseType The fund raising currency (e.g. ETH, POLY, SC) to calculate sold tokens for
*/
export interface IGetTokensSoldForParams {
  fundRaiseType: number;
}

export interface IGetStableCoinsRaisedParams {
  index: string;
}

/**
* @param investors Array of investor addresses to modify
* @param accredited Array of bools specifying accreditation status
*/
export interface IChangeAccreditedParams extends ITxParams {
  investors: string[];
  accredited: boolean[];
}

/**
* @param investors Array of investor addresses to modify
* @param nonAccreditedLimit Array of uints specifying non-accredited limits
*/
export interface IChangeNonAccreditedLimitParams extends ITxParams {
  investors: string[];
  nonAccreditedLimit: BigNumber[];
}

/**
* @param startTime start time of sto
* @param endTime end time of sto
*/
export interface IModifyTimesParams extends ITxParams {
  startTime: BigNumber;
  endTime: BigNumber;
}

/**
* @param nonAccreditedLimitUSD max non accredited invets limit
* @param minimumInvestmentUSD overall minimum investment limit
*/
export interface IModifyLimitsParams extends ITxParams {
  nonAccreditedLimitUSD: BigNumber;
  minimumInvestmentUSD: BigNumber;
}

/**
* @param fundRaiseTypes Array of fund raise types to allow
*/
export interface IModifyFundingParams extends ITxParams {
  fundRaiseTypes: number[];
}

/**
* @param wallet Address of wallet where funds are sent
* @param reserveWallet Address of wallet where unsold tokens are sent
* @param usdTokens Address of usd tokens
*/
export interface IModifyAddressesParams extends ITxParams {
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
export interface IModifyTiersParams extends ITxParams {
  ratePerTier: BigNumber[];
  ratePerTierDiscountPoly: BigNumber[];
  tokensPerTierTotal: BigNumber[];
  tokensPerTierDiscountPoly: BigNumber[];
}

/**
 * This class includes the functionality related to interacting with the USDTieredSTO contract.
 */
export class USDTieredSTOWrapper extends ContractWrapper {
  public abi: ContractAbi = (USDTieredSTO as any).abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private usdTieredSTOContract: Promise<USDTieredSTOContract>;
  /**
   * Instantiate USDTieredSTOWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this.polymathRegistry = polymathRegistry;
    this.usdTieredSTOContract = this._getUSDTieredSTOContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.usdTieredSTOContract).address;
  }

  /**
   * Start time of the Capped STO
   */
  public getStartTime = async (): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).startTime.callAsync();
  }

  /**
   * End time of the Capped STO
   */
  public getEndTime = async (): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).endTime.callAsync();
  }

  /**
   * Ethereum account address to hold the funds
   */
  public getWallet = async (): Promise<string> => {
    return await (await this.usdTieredSTOContract).wallet.callAsync();
  }

  /**
   * Type of currency used to collect the funds
   */
  public getFundRaiseTypes = async (params: IGetFundRaiseTypesParams): Promise<boolean> => {
    return await (await this.usdTieredSTOContract).fundRaiseTypes.callAsync(params.index);
  }

  /**
   * Returns funds raised by the STO
   */
  public getFundsRaised = async (params: IGetFundsRaisedParams): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).fundsRaised.callAsync(params.index);
  }

  /**
   * Return the total no. of tokens sold
   */
  public getTotalTokensSold  = async (): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).totalTokensSold.callAsync();
  }

  /**
   * Current tier
   */
  public getCurrentTier = async (): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).currentTier.callAsync();
  }

  /**
   * Get the limit in USD for non-accredited investors
   */
  public getNonAccreditedLimitUSD = async (): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).nonAccreditedLimitUSD.callAsync();
  }

  /**
   * Get the minimun investment in USD
   */
  public getMinimumInvestmentUSD = async (): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).minimumInvestmentUSD.callAsync();
  }

  /**
   * Ethereum account address to receive unsold tokens
   */
  public getReserveWallet = async (): Promise<string> => {
    return await (await this.usdTieredSTOContract).reserveWallet.callAsync();
  }

  /**
   * Return the total no. of tokens sold
   */
  public getTokensSold = async (): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).getTokensSold.callAsync();
  }

  /**
   * Whether or not the STO has been finalized
   */
  public isFinalized = async (): Promise<boolean> => {
    return await (await this.usdTieredSTOContract).isFinalized.callAsync();
  }

  /**
   * Return the total no. of tiers
   */
  public getNumberOfTiers = async (): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).getNumberOfTiers.callAsync();
  }

  /**
   * Return the usd tokens accepted by the STO
   */
  public getUsdTokens = async (): Promise<string[]> => {
    return await (await this.usdTieredSTOContract).getUsdTokens.callAsync();
  }

  /**
   * Amount of USD funds raised
   */
  public getFundsRaisedUSD = async (): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).fundsRaisedUSD.callAsync();
  }

  /**
   * Number of individual investors this STO have.
   */
  public getInvestorCount = async (): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).investorCount.callAsync();
  }

  /**
   * Get specific tier
   */
  public getTiers = async (params: IGetTiersParams): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]> => {
    return await (await this.usdTieredSTOContract).tiers.callAsync(params.index);
  }

  /**
   * Return array of minted tokens in each fund raise type for given tier
   */
  public getTokensMintedByTier = async (params: IGetTokensMintedByTierParams): Promise<BigNumber[]> => {
    return await (await this.usdTieredSTOContract).getTokensMintedByTier.callAsync(params.tier);
  }

  /**
   * This function converts from ETH or POLY to USD
   * @return Value in USD
   */
  public convertToUSD = async (params: IConvertToUSDParams): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).convertToUSD.callAsync(
      params.fundRaiseType,
      params.amount,
    );
  }

  /**
   * Return the total no. of tokens sold for the given fund raise type
   * @return Total number of tokens sold for ETH
   */
  public getTokensSoldFor = async (params: IGetTokensSoldForParams): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).getTokensSoldFor.callAsync(params.fundRaiseType);
  }

  /**
   * Amount of stable coins raised
   */
  public getStableCoinsRaised = async (params: IGetStableCoinsRaisedParams): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).stableCoinsRaised.callAsync(params.index);
  }

  /**
   * Finalizes the STO and mint remaining tokens to reserve address
   * Reserve address must be whitelisted to successfully finalize
   */
  public finalize = async () => {
    return async () => {
      return (await this.usdTieredSTOContract).finalize.sendTransactionAsync();
    }
  }

  /**
   * Modifies the list of accredited addresses
   */
  public changeAccredited = async (params: IChangeAccreditedParams) => {
    return async () => {
      return (await this.usdTieredSTOContract).changeAccredited.sendTransactionAsync(
        params.investors,
        params.accredited
      );
    }
  }

  /**
   * Modifies the list of overrides for non-accredited limits in USD
   */
  public changeNonAccreditedLimit = async (params: IChangeNonAccreditedLimitParams) => {
    return async () => {
      return (await this.usdTieredSTOContract).changeNonAccreditedLimit.sendTransactionAsync(
        params.investors,
        params.nonAccreditedLimit
      );
    }
  }

  /**
   * Modifies STO start and end times
   */
  public modifyTimes = async (params: IModifyTimesParams) => {
    return async () => {
      return (await this.usdTieredSTOContract).modifyTimes.sendTransactionAsync(
        params.startTime,
        params.endTime
      );
    }
  }

  /**
   * Modifies max non accredited invets limit and overall minimum investment limit
   */
  public modifyLimits = async (params: IModifyLimitsParams) => {
    return async () => {
      return (await this.usdTieredSTOContract).modifyLimits.sendTransactionAsync(
        params.nonAccreditedLimitUSD,
        params.minimumInvestmentUSD
      );
    }
  }

  /**
   * Modifies fund raise types
   */
  public modifyFunding = async (params: IModifyFundingParams) => {
    return async () => {
      return (await this.usdTieredSTOContract).modifyFunding.sendTransactionAsync(
        params.fundRaiseTypes
      );
    }
  }

  /**
   * Modifies addresses used as wallet, reserve wallet and usd token
   */
  public modifyAddresses = async (params: IModifyAddressesParams) => {
    return async () => {
      return (await this.usdTieredSTOContract).modifyAddresses.sendTransactionAsync(
        params.wallet,
        params.reserveWallet,
        params.usdToken
      );
    }
  }

  /**
   * Modifiers STO tiers. All tiers must be passed, can not edit specific tiers.
   */
  public modifyTiers = async (params: IModifyTiersParams) => {
    return async () => {
      return (await this.usdTieredSTOContract).modifyTiers.sendTransactionAsync(
        params.ratePerTier,
        params.ratePerTierDiscountPoly,
        params.tokensPerTierTotal,
        params.tokensPerTierDiscountPoly
      );
    }
  }

  /**
   * Returns investor accredited & non-accredited override informatiomn
   */
  public getAccreditedData = async (): Promise<[string[], boolean[], BigNumber[]]> => {
    return await (await this.usdTieredSTOContract).getAccreditedData.callAsync();
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync = async <ArgsType extends USDTieredSTOEventArgs>(
    params: ISubscribeAsyncParams<USDTieredSTOEvents, ArgsType>
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, USDTieredSTOEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.usdTieredSTOContract).address.toLowerCase();
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
  public getLogsAsync = async <ArgsType extends USDTieredSTOEventArgs>(
    params: IGetLogsAsyncParams<USDTieredSTOEvents>
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, USDTieredSTOEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.usdTieredSTOContract).address.toLowerCase();
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
      await this.polymathRegistry.getAddress({
        contractName: 'USDTieredSTO',
      }),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
