import { CappedSTOContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { CappedSTO } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { IFundRaiseTypes, IFundsRaised } from '../types';
import * as _ from 'lodash';
import { _getDefaultContractAddresses } from '../utils/contract_addresses';
import { ContractWrapper } from './contract_wrapper';

/**
 * This class includes the functionality related to interacting with the CappedSTO contract.
 */
export class CappedSTOWrapper extends ContractWrapper {
  public abi: ContractAbi = CappedSTO.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private cappedSTOContractIfExists?: CappedSTOContract;
  /**
   * Instantiate CappedSTOWrapper
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
    const CappedSTOContractInstance = await this._getCappedSTOContract();
    return await CappedSTOContractInstance.startTime.callAsync();
  }

  /**
   * End time of the Capped STO
   */
  public async getEndTime(): Promise<BigNumber> {
    const CappedSTOContractInstance = await this._getCappedSTOContract();
    return await CappedSTOContractInstance.endTime.callAsync();
  }

  /**
   * How many token units a buyer gets (multiplied by 10^18) per wei / base unit of POLY
   */
  public async getRate(): Promise<BigNumber> {
    const CappedSTOContractInstance = await this._getCappedSTOContract();
    return await CappedSTOContractInstance.rate.callAsync();
  }

  /**
   * How many token base units this STO will be allowed to sell to investors
   */
  public async getCap(): Promise<BigNumber> {
    const CappedSTOContractInstance = await this._getCappedSTOContract();
    return await CappedSTOContractInstance.cap.callAsync();
  }

  /**
   * Ethereum account address to hold the funds
   */
  public async getWallet(): Promise<string> {
    const CappedSTOContractInstance = await this._getCappedSTOContract();
    return await CappedSTOContractInstance.wallet.callAsync();
  }

  /**
   * Type of currency used to collect the funds
   */
  public async getFundRaiseTypes(params: IFundRaiseTypes): Promise<boolean> {
    const CappedSTOContractInstance = await this._getCappedSTOContract();
    return await CappedSTOContractInstance.fundRaiseTypes.callAsync(params.index);
  }

  /**
   * Returns funds raised by the STO
   */
  public async getFundsRaised(pasams: IFundsRaised): Promise<BigNumber> {
    const CappedSTOContractInstance = await this._getCappedSTOContract();
    return await CappedSTOContractInstance.fundsRaised.callAsync(pasams.index);
  }

  /**
   * Return the total no. of tokens sold
   */
  public async getTotalTokensSold(): Promise<BigNumber> {
    const CappedSTOContractInstance = await this._getCappedSTOContract();
    return await CappedSTOContractInstance.totalTokensSold.callAsync();
  }

  /**
   * Number of individual investors this STO have.
   */
  public async getInvestorCount(): Promise<BigNumber> {
    const CappedSTOContractInstance = await this._getCappedSTOContract();
    return await CappedSTOContractInstance.investorCount.callAsync();
  }

  private async _getCappedSTOContract(): Promise<CappedSTOContract> {
    if (!_.isUndefined(this.cappedSTOContractIfExists)) {
      return this.cappedSTOContractIfExists;
    }
    const contractInstance = new CappedSTOContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'CappedSTO',
      }),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
    this.cappedSTOContractIfExists = contractInstance;
    return this.cappedSTOContractIfExists;
  }
}
