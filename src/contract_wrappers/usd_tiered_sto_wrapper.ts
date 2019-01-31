import { USDTieredSTOContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { USDTieredSTO } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { TxData } from 'ethereum-types';
import { estimateGasLimit } from '../utils/transactions';
import * as _ from 'lodash';
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

import { _getDefaultContractAddresses } from '../utils/contract_addresses';

import { ContractWrapper } from './contract_wrapper';

/**
 * This class includes the functionality related to interacting with the USDTieredSTO contract.
 */
export class USDTieredSTOWrapper extends ContractWrapper {
  public abi: ContractAbi = USDTieredSTO.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private usdTieredSTOContractIfExists?: USDTieredSTOContract;
  private factor = 1.2;
  /**
   * Instantiate USDTieredSTOWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param networkId Desired networkId
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this.polymathRegistry = polymathRegistry;
  }

  /**
   * Start time of the Capped STO
   */
  public async getStartTime(): Promise<BigNumber> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.startTime.callAsync();
  }

  /**
   * End time of the Capped STO
   */
  public async getEndTime(): Promise<BigNumber> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.endTime.callAsync();
  }

  /**
   * Ethereum account address to hold the funds
   */
  public async getWallet(): Promise<string> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.wallet.callAsync();
  }

  /**
   * Type of currency used to collect the funds
   */
  public async getFundRaiseTypes(params: IFundRaiseTypes): Promise<boolean> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.fundRaiseTypes.callAsync(params.index);
  }

  /**
   * Returns funds raised by the STO
   */
  public async getFundsRaised(params: IFundsRaised): Promise<BigNumber> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.fundsRaised.callAsync(params.index);
  }

  /**
   * Return the total no. of tokens sold
   */
  public async getTotalTokensSold(): Promise<BigNumber> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.totalTokensSold.callAsync();
  }

  /**
   * Current tier
   */
  public async getCurrentTier(): Promise<BigNumber> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.currentTier.callAsync();
  }

  /**
   * Get the limit in USD for non-accredited investors
   */
  public async getNonAccreditedLimitUSD(): Promise<BigNumber> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.nonAccreditedLimitUSD.callAsync();
  }

  /**
   * Get the minimun investment in USD
   */
  public async getMinimumInvestmentUSD(): Promise<BigNumber> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.minimumInvestmentUSD.callAsync();
  }

  /**
   * Ethereum account address to receive unsold tokens
   */
  public async getReserveWallet(): Promise<string> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.reserveWallet.callAsync();
  }

  /**
   * Return the total no. of tokens sold
   */
  public async getTokensSold(): Promise<BigNumber> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.getTokensSold.callAsync();
  }

  /**
   * Whether or not the STO has been finalized
   */
  public async isFinalized(): Promise<boolean> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.isFinalized.callAsync();
  }

  /**
   * Return the total no. of tiers
   */
  public async getNumberOfTiers(): Promise<BigNumber> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.getNumberOfTiers.callAsync();
  }

  /**
   * Return the usd tokens accepted by the STO
   */
  public async getUsdTokens(): Promise<string[]> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.getUsdTokens.callAsync();
  }

  /**
   * Amount of USD funds raised
   */
  public async getFundsRaisedUSD(): Promise<BigNumber> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.fundsRaisedUSD.callAsync();
  }

  /**
   * Number of individual investors this STO have.
   */
  public async getInvestorCount(): Promise<BigNumber> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.investorCount.callAsync();
  }

  /**
   * Get specific tier
   */
  public async getTiers(params: ITiers): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.tiers.callAsync(params.index);
  }

  /**
   * Return array of minted tokens in each fund raise type for given tier
   */
  public async getTokensMintedByTier(params: ITokensMintedByTier): Promise<BigNumber[]> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.getTokensMintedByTier.callAsync(params.tier);
  }

  /**
   * This function converts from ETH or POLY to USD
   * @return Value in USD
   */
  public async convertToUSD(params: IConvertToUSD): Promise<BigNumber> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.convertToUSD.callAsync(
      params.fundRaiseType,
      params.amount,
    );
  }

  /**
   * Return the total no. of tokens sold for the given fund raise type
   * @return Total number of tokens sold for ETH
   */
  public async getTokensSoldFor(params: ITokensSoldFor): Promise<BigNumber> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.getTokensSoldFor.callAsync(params.fundRaiseType);
  }

  /**
   * Amount of stable coins raised
   */
  public async getStableCoinsRaised(params: IStableCoinsRaised): Promise<BigNumber> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.stableCoinsRaised.callAsync(params.index);
  }

  /**
   * Finalizes the STO and mint remaining tokens to reserve address
   * Reserve address must be whitelisted to successfully finalize
   */
  public async finalize() {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    const owner = await this._getOwnerAddress();
    const estimateGas = await USDTieredSTOContractInstance.finalize.estimateGasAsync(
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
    return () => {
      return USDTieredSTOContractInstance.finalize.sendTransactionAsync(
        txData,
      );
    };
  }

  /**
   * Modifies the list of accredited addresses
   */
  public async changeAccredited(params: IChangeAccredited) {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    const owner = await this._getOwnerAddress();
    const estimateGas = await USDTieredSTOContractInstance.changeAccredited.estimateGasAsync(
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
    return () => {
      return USDTieredSTOContractInstance.changeAccredited.sendTransactionAsync(
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
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    const owner = await this._getOwnerAddress();
    const estimateGas = await USDTieredSTOContractInstance.changeNonAccreditedLimit.estimateGasAsync(
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
    return () => {
      return USDTieredSTOContractInstance.changeNonAccreditedLimit.sendTransactionAsync(
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
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    const owner = await this._getOwnerAddress();
    const estimateGas = await USDTieredSTOContractInstance.modifyTimes.estimateGasAsync(
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
    return () => {
      return USDTieredSTOContractInstance.modifyTimes.sendTransactionAsync(
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
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    const owner = await this._getOwnerAddress();
    const estimateGas = await USDTieredSTOContractInstance.modifyLimits.estimateGasAsync(
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
    return () => {
      return USDTieredSTOContractInstance.modifyLimits.sendTransactionAsync(
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
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    const owner = await this._getOwnerAddress();
    const estimateGas = await USDTieredSTOContractInstance.modifyFunding.estimateGasAsync(
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
    return () => {
      return USDTieredSTOContractInstance.modifyFunding.sendTransactionAsync(
        params.fundRaiseTypes,
        txData,
      );
    };
  }

  /**
   * Modifies addresses used as wallet, reserve wallet and usd token
   */
  public async modifyAddresses(params: IModifyAddresses) {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    const owner = await this._getOwnerAddress();
    const estimateGas = await USDTieredSTOContractInstance.modifyAddresses.estimateGasAsync(
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
    return () => {
      return USDTieredSTOContractInstance.modifyAddresses.sendTransactionAsync(
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
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    const owner = await this._getOwnerAddress();
    const estimateGas = await USDTieredSTOContractInstance.modifyTiers.estimateGasAsync(
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
    return () => {
      return USDTieredSTOContractInstance.modifyTiers.sendTransactionAsync(
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
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.getAccreditedData.callAsync();
  }

  private async _getOwnerAddress(): Promise<string> {
    const addresses = await this.web3Wrapper.getAvailableAddressesAsync();
    return addresses[0];
  }

  private async _getUSDTieredSTOContract(): Promise<USDTieredSTOContract> {
    if (!_.isUndefined(this.usdTieredSTOContractIfExists)) {
      return this.usdTieredSTOContractIfExists;
    }
    const contractInstance = new USDTieredSTOContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'USDTieredSTO',
      }),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
    this.usdTieredSTOContractIfExists = contractInstance;
    return this.usdTieredSTOContractIfExists;
  }
}
