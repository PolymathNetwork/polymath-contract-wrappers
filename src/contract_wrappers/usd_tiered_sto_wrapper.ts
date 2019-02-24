import { USDTieredSTOContract } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { USDTieredSTO } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import { ContractAbi } from 'ethereum-types';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import {
  IFundRaiseTypes,
  IFundsRaised,
  ITiers,
  ITokensMintedByTier,
  IConvertToUSD,
  ITokensSoldFor,
  IStableCoinsRaised,
  IChangeAccredited,
  IChangeNonAccreditedLimit,
  IModifyTimes,
  IModifyLimits,
  IModifyFunding,
  IModifyAddresses,
  IModifyTiers,
} from '../types';

/**
 * This class includes the functionality related to interacting with the USDTieredSTO contract.
 */
export class USDTieredSTOWrapper extends ContractWrapper {
  public abi: ContractAbi = (USDTieredSTO as any).abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private usdTieredSTOContract: Promise<USDTieredSTOContract>;
  private factor = 1.2;
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
  public getFundRaiseTypes = async (params: IFundRaiseTypes): Promise<boolean> => {
    return await (await this.usdTieredSTOContract).fundRaiseTypes.callAsync(params.index);
  }

  /**
   * Returns funds raised by the STO
   */
  public getFundsRaised = async (params: IFundsRaised): Promise<BigNumber> => {
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
  public getTiers = async (params: ITiers): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]> => {
    return await (await this.usdTieredSTOContract).tiers.callAsync(params.index);
  }

  /**
   * Return array of minted tokens in each fund raise type for given tier
   */
  public getTokensMintedByTier = async (params: ITokensMintedByTier): Promise<BigNumber[]> => {
    return await (await this.usdTieredSTOContract).getTokensMintedByTier.callAsync(params.tier);
  }

  /**
   * This function converts from ETH or POLY to USD
   * @return Value in USD
   */
  public convertToUSD = async (params: IConvertToUSD): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).convertToUSD.callAsync(
      params.fundRaiseType,
      params.amount,
    );
  }

  /**
   * Return the total no. of tokens sold for the given fund raise type
   * @return Total number of tokens sold for ETH
   */
  public getTokensSoldFor = async (params: ITokensSoldFor): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).getTokensSoldFor.callAsync(params.fundRaiseType);
  }

  /**
   * Amount of stable coins raised
   */
  public getStableCoinsRaised = async (params: IStableCoinsRaised): Promise<BigNumber> => {
    return await (await this.usdTieredSTOContract).stableCoinsRaised.callAsync(params.index);
  }

  /**
   * Finalizes the STO and mint remaining tokens to reserve address
   * Reserve address must be whitelisted to successfully finalize
   */
  public finalize = async () => {
    return (await this.usdTieredSTOContract).finalize.sendTransactionAsync(
      {
        from: await this._getOwnerAddress(),
      },
    );
  }

  /**
   * Modifies the list of accredited addresses
   */
  public changeAccredited = async (params: IChangeAccredited) => {
    return (await this.usdTieredSTOContract).changeAccredited.sendTransactionAsync(
      params.investors,
      params.accredited,
      {
        from: await this._getOwnerAddress(),
      },
    );
  }

  /**
   * Modifies the list of overrides for non-accredited limits in USD
   */
  public changeNonAccreditedLimit = async (params: IChangeNonAccreditedLimit) => {
    return (await this.usdTieredSTOContract).changeNonAccreditedLimit.sendTransactionAsync(
      params.investors,
      params.nonAccreditedLimit,
      {
        from: await this._getOwnerAddress(),
      },
    );
  }

  /**
   * Modifies STO start and end times
   */
  public modifyTimes = async (params: IModifyTimes) => {
    return (await this.usdTieredSTOContract).modifyTimes.sendTransactionAsync(
      params.startTime,
      params.endTime,
      {
        from: await this._getOwnerAddress(),
      },
    );
  }

  /**
   * Modifies max non accredited invets limit and overall minimum investment limit
   */
  public modifyLimits = async (params: IModifyLimits) => {
    return (await this.usdTieredSTOContract).modifyLimits.sendTransactionAsync(
      params.nonAccreditedLimitUSD,
      params.minimumInvestmentUSD,
      {
        from: await this._getOwnerAddress(),
      },
    );
  }

  /**
   * Modifies fund raise types
   */
  public modifyFunding = async (params: IModifyFunding) => {
    return (await this.usdTieredSTOContract).modifyFunding.sendTransactionAsync(
      params.fundRaiseTypes,
      {
        from: await this._getOwnerAddress(),
      },
    );
  }

  /**
   * Modifies addresses used as wallet, reserve wallet and usd token
   */
  public modifyAddresses = async (params: IModifyAddresses) => {
    return (await this.usdTieredSTOContract).modifyAddresses.sendTransactionAsync(
      params.wallet,
      params.reserveWallet,
      params.usdToken,
      {
        from: await this._getOwnerAddress(),
      },
    );
  }

  /**
   * Modifiers STO tiers. All tiers must be passed, can not edit specific tiers.
   */
  public modifyTiers = async (params: IModifyTiers) => {
    return (await this.usdTieredSTOContract).modifyTiers.sendTransactionAsync(
      params.ratePerTier,
      params.ratePerTierDiscountPoly,
      params.tokensPerTierTotal,
      params.tokensPerTierDiscountPoly,
      {
        from: await this._getOwnerAddress(),
      },
    );
  }

  /**
   * Returns investor accredited & non-accredited override informatiomn
   */
  public getAccreditedData = async (): Promise<[string[], boolean[], BigNumber[]]> => {
    return await (await this.usdTieredSTOContract).getAccreditedData.callAsync();
  }

  private async _getOwnerAddress(): Promise<string> {
    const addresses = await this.web3Wrapper.getAvailableAddressesAsync();
    return addresses[0];
  }

  private async _getUSDTieredSTOContract(): Promise<USDTieredSTOContract> {
    return new USDTieredSTOContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'USDTieredSTO',
      }),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
  }
}
