import { USDTieredSTOContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { USDTieredSTO } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';

import { _getDefaultContractAddresses } from '../utils/contract_addresses';

import { ContractWrapper } from './contract_wrapper';

/**
 * This class includes the functionality related to interacting with the USDTieredSTO contract.
 */
export class USDTieredSTOWrapper extends ContractWrapper {
  public abi: ContractAbi = USDTieredSTO.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private usdTieredSTOContractIfExists?: USDTieredSTOContract;
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
  public async getFundRaiseTypes(index: number): Promise<boolean> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.fundRaiseTypes.callAsync(index);
  }

  /**
   * Returns funds raised by the STO
   */
  public async getFundsRaised(index: number): Promise<BigNumber> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.fundsRaised.callAsync(index);
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
  public async getTiers(index: BigNumber): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.tiers.callAsync(index);
  }

  /**
   * Return array of minted tokens in each fund raise type for given tier
   */
  public async getTokensMintedByTier(tier: BigNumber): Promise<BigNumber[]> {
    const USDTieredSTOContractInstance = await this._getUSDTieredSTOContract();
    return await USDTieredSTOContractInstance.getTokensMintedByTier.callAsync(tier);
  }

  private async _getUSDTieredSTOContract(): Promise<USDTieredSTOContract> {
    if (!_.isUndefined(this.usdTieredSTOContractIfExists)) {
      return this.usdTieredSTOContractIfExists;
    }
    const contractInstance = new USDTieredSTOContract(
      this.abi,
      await this.polymathRegistry.getAddress('USDTieredSTO'),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
    this.usdTieredSTOContractIfExists = contractInstance;
    return this.usdTieredSTOContractIfExists;
  }
}
