import { USDTieredSTOContract } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { USDTieredSTO } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import { TxData, ContractAbi } from 'ethereum-types';
import { estimateGasLimit } from '../utils/transactions';
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
  public async getAddress(): Promise<string> {
    return (await this.usdTieredSTOContract).address;
  }

  /**
   * Start time of the Capped STO
   */
  public async getStartTime(): Promise<BigNumber> {
    return await (await this.usdTieredSTOContract).startTime.callAsync();
  }

  /**
   * End time of the Capped STO
   */
  public async getEndTime(): Promise<BigNumber> {
    return await (await this.usdTieredSTOContract).endTime.callAsync();
  }

  /**
   * Ethereum account address to hold the funds
   */
  public async getWallet(): Promise<string> {
    return await (await this.usdTieredSTOContract).wallet.callAsync();
  }

  /**
   * Type of currency used to collect the funds
   */
  public async getFundRaiseTypes(params: IFundRaiseTypes): Promise<boolean> {
    return await (await this.usdTieredSTOContract).fundRaiseTypes.callAsync(params.index);
  }

  /**
   * Returns funds raised by the STO
   */
  public async getFundsRaised(params: IFundsRaised): Promise<BigNumber> {
    return await (await this.usdTieredSTOContract).fundsRaised.callAsync(params.index);
  }

  /**
   * Return the total no. of tokens sold
   */
  public async getTotalTokensSold(): Promise<BigNumber> {
    return await (await this.usdTieredSTOContract).totalTokensSold.callAsync();
  }

  /**
   * Current tier
   */
  public async getCurrentTier(): Promise<BigNumber> {
    return await (await this.usdTieredSTOContract).currentTier.callAsync();
  }

  /**
   * Get the limit in USD for non-accredited investors
   */
  public async getNonAccreditedLimitUSD(): Promise<BigNumber> {
    return await (await this.usdTieredSTOContract).nonAccreditedLimitUSD.callAsync();
  }

  /**
   * Get the minimun investment in USD
   */
  public async getMinimumInvestmentUSD(): Promise<BigNumber> {
    return await (await this.usdTieredSTOContract).minimumInvestmentUSD.callAsync();
  }

  /**
   * Ethereum account address to receive unsold tokens
   */
  public async getReserveWallet(): Promise<string> {
    return await (await this.usdTieredSTOContract).reserveWallet.callAsync();
  }

  /**
   * Return the total no. of tokens sold
   */
  public async getTokensSold(): Promise<BigNumber> {
    return await (await this.usdTieredSTOContract).getTokensSold.callAsync();
  }

  /**
   * Whether or not the STO has been finalized
   */
  public async isFinalized(): Promise<boolean> {
    return await (await this.usdTieredSTOContract).isFinalized.callAsync();
  }

  /**
   * Return the total no. of tiers
   */
  public async getNumberOfTiers(): Promise<BigNumber> {
    return await (await this.usdTieredSTOContract).getNumberOfTiers.callAsync();
  }

  /**
   * Return the usd tokens accepted by the STO
   */
  public async getUsdTokens(): Promise<string[]> {
    return await (await this.usdTieredSTOContract).getUsdTokens.callAsync();
  }

  /**
   * Amount of USD funds raised
   */
  public async getFundsRaisedUSD(): Promise<BigNumber> {
    return await (await this.usdTieredSTOContract).fundsRaisedUSD.callAsync();
  }

  /**
   * Number of individual investors this STO have.
   */
  public async getInvestorCount(): Promise<BigNumber> {
    return await (await this.usdTieredSTOContract).investorCount.callAsync();
  }

  /**
   * Get specific tier
   */
  public async getTiers(params: ITiers): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]> {
    return await (await this.usdTieredSTOContract).tiers.callAsync(params.index);
  }

  /**
   * Return array of minted tokens in each fund raise type for given tier
   */
  public async getTokensMintedByTier(params: ITokensMintedByTier): Promise<BigNumber[]> {
    return await (await this.usdTieredSTOContract).getTokensMintedByTier.callAsync(params.tier);
  }

  /**
   * This function converts from ETH or POLY to USD
   * @return Value in USD
   */
  public async convertToUSD(params: IConvertToUSD): Promise<BigNumber> {
    return await (await this.usdTieredSTOContract).convertToUSD.callAsync(
      params.fundRaiseType,
      params.amount,
    );
  }

  /**
   * Return the total no. of tokens sold for the given fund raise type
   * @return Total number of tokens sold for ETH
   */
  public async getTokensSoldFor(params: ITokensSoldFor): Promise<BigNumber> {
    return await (await this.usdTieredSTOContract).getTokensSoldFor.callAsync(params.fundRaiseType);
  }

  /**
   * Amount of stable coins raised
   */
  public async getStableCoinsRaised(params: IStableCoinsRaised): Promise<BigNumber> {
    return await (await this.usdTieredSTOContract).stableCoinsRaised.callAsync(params.index);
  }

  /**
   * Finalizes the STO and mint remaining tokens to reserve address
   * Reserve address must be whitelisted to successfully finalize
   */
  public async finalize() {
    const owner = await this._getOwnerAddress();
    const estimateGas = await (await this.usdTieredSTOContract).finalize.estimateGasAsync(
      { from: owner },
    );
    const txData: TxData = {
      from: owner,
      gas: await estimateGasLimit(
        this.web3Wrapper,
        estimateGas,
        this.factor,
      ),
    };
    return async () => {
      return (await this.usdTieredSTOContract).finalize.sendTransactionAsync(
        txData,
      );
    };
  }

  /**
   * Modifies the list of accredited addresses
   */
  public async changeAccredited(params: IChangeAccredited) {
    const owner = await this._getOwnerAddress();
    const estimateGas = await (await this.usdTieredSTOContract).changeAccredited.estimateGasAsync(
      params.investors,
      params.accredited,
      { from: owner },
    );
    const txData: TxData = {
      from: owner,
      gas: await estimateGasLimit(
        this.web3Wrapper,
        estimateGas,
        this.factor,
      ),
    };
    return async () => {
      return (await this.usdTieredSTOContract).changeAccredited.sendTransactionAsync(
        params.investors,
        params.accredited,
        txData,
      );
    };
  }

  /**
   * Modifies the list of overrides for non-accredited limits in USD
   */
  public async changeNonAccreditedLimit(params: IChangeNonAccreditedLimit) {
    const owner = await this._getOwnerAddress();
    const estimateGas = await (await this.usdTieredSTOContract).changeNonAccreditedLimit.estimateGasAsync(
      params.investors,
      params.nonAccreditedLimit,
      { from: owner },
    );
    const txData: TxData = {
      from: owner,
      gas: await estimateGasLimit(
        this.web3Wrapper,
        estimateGas,
        this.factor,
      ),
    };
    return async () => {
      return (await this.usdTieredSTOContract).changeNonAccreditedLimit.sendTransactionAsync(
        params.investors,
        params.nonAccreditedLimit,
        txData,
      );
    };
  }

  /**
   * Modifies STO start and end times
   */
  public async modifyTimes(params: IModifyTimes) {
    const owner = await this._getOwnerAddress();
    const estimateGas = await (await this.usdTieredSTOContract).modifyTimes.estimateGasAsync(
      params.startTime,
      params.endTime,
      { from: owner },
    );
    const txData: TxData = {
      from: owner,
      gas: await estimateGasLimit(
        this.web3Wrapper,
        estimateGas,
        this.factor,
      ),
    };
    return async () => {
      return (await this.usdTieredSTOContract).modifyTimes.sendTransactionAsync(
        params.startTime,
        params.endTime,
        txData,
      );
    };
  }

  /**
   * Modifies max non accredited invets limit and overall minimum investment limit
   */
  public async modifyLimits(params: IModifyLimits) {
    const owner = await this._getOwnerAddress();
    const estimateGas = await (await this.usdTieredSTOContract).modifyLimits.estimateGasAsync(
      params.nonAccreditedLimitUSD,
      params.minimumInvestmentUSD,
      { from: owner },
    );
    const txData: TxData = {
      from: owner,
      gas: await estimateGasLimit(
        this.web3Wrapper,
        estimateGas,
        this.factor,
      ),
    };
    return async () => {
      return (await this.usdTieredSTOContract).modifyLimits.sendTransactionAsync(
        params.nonAccreditedLimitUSD,
        params.minimumInvestmentUSD,
        txData,
      );
    };
  }

  /**
   * Modifies fund raise types
   */
  public async modifyFunding(params: IModifyFunding) {
    const owner = await this._getOwnerAddress();
    const estimateGas = await (await this.usdTieredSTOContract).modifyFunding.estimateGasAsync(
      params.fundRaiseTypes,
      { from: owner },
    );
    const txData: TxData = {
      from: owner,
      gas: await estimateGasLimit(
        this.web3Wrapper,
        estimateGas,
        this.factor,
      ),
    };
    return async () => {
      return (await this.usdTieredSTOContract).modifyFunding.sendTransactionAsync(
        params.fundRaiseTypes,
        txData,
      );
    };
  }

  /**
   * Modifies addresses used as wallet, reserve wallet and usd token
   */
  public async modifyAddresses(params: IModifyAddresses) {
    const owner = await this._getOwnerAddress();
    const estimateGas = await (await this.usdTieredSTOContract).modifyAddresses.estimateGasAsync(
      params.wallet,
      params.reserveWallet,
      params.usdToken,
      { from: owner },
    );
    const txData: TxData = {
      from: owner,
      gas: await estimateGasLimit(
        this.web3Wrapper,
        estimateGas,
        this.factor,
      ),
    };
    return async () => {
      return (await this.usdTieredSTOContract).modifyAddresses.sendTransactionAsync(
        params.wallet,
        params.reserveWallet,
        params.usdToken,
        txData,
      );
    };
  }

  /**
   * Modifiers STO tiers. All tiers must be passed, can not edit specific tiers.
   */
  public async modifyTiers(params: IModifyTiers) {
    const owner = await this._getOwnerAddress();
    const estimateGas = await (await this.usdTieredSTOContract).modifyTiers.estimateGasAsync(
      params.ratePerTier,
      params.ratePerTierDiscountPoly,
      params.tokensPerTierTotal,
      params.tokensPerTierDiscountPoly,
      { from: owner },
    );
    const txData: TxData = {
      from: owner,
      gas: await estimateGasLimit(
        this.web3Wrapper,
        estimateGas,
        this.factor,
      ),
    };
    return async () => {
      return (await this.usdTieredSTOContract).modifyTiers.sendTransactionAsync(
        params.ratePerTier,
        params.ratePerTierDiscountPoly,
        params.tokensPerTierTotal,
        params.tokensPerTierDiscountPoly,
        txData,
      );
    };
  }

  /**
   * Returns investor accredited & non-accredited override informatiomn
   */
  public async getAccreditedData(): Promise<[string[], boolean[], BigNumber[]]> {
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
