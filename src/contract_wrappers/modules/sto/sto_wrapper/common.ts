import { BigNumber } from '@polymathnetwork/abi-wrappers';
import { STOBaseContract, FundRaiseType, FULL_DECIMALS } from '../../../../types';
import { ModuleCommon } from '../../module_wrapper';
import { bigNumberToDate, weiToValue } from '../../../../utils/convert';

/**
 * @param type The FundRaiseType
 */
export interface FundRaiseTypesParams {
  type: FundRaiseType;
}

/**
 * This class includes the functionality related to interacting with all STO contracts
 */
export default abstract class STOCommon extends ModuleCommon {
  public abstract contract: Promise<STOBaseContract>;

  /**
   * Type of currency used to collect the funds
   * @return boolean corresponding to fund raise type
   */
  public fundRaiseTypes = async (params: FundRaiseTypesParams): Promise<boolean> => {
    return (await this.contract).fundRaiseTypes.callAsync(params.type);
  };

  /**
   * Returns funds raised by the STO
   * @return amount of funds raised
   */
  public fundsRaised = async (params: FundRaiseTypesParams): Promise<BigNumber> => {
    return weiToValue(await (await this.contract).fundsRaised.callAsync(params.type), FULL_DECIMALS);
  };

  /**
   * Start time of the STO
   * @returns startTime
   */
  public startTime = async (): Promise<Date> => {
    return bigNumberToDate(await (await this.contract).startTime.callAsync());
  };

  /**
   * End time of the STO
   * @returns endTime
   */
  public endTime = async (): Promise<Date> => {
    return bigNumberToDate(await (await this.contract).endTime.callAsync());
  };

  /**
   * End time of the Capped STO
   * @returns pausedTime
   */
  public pausedTime = async (): Promise<Date> => {
    return bigNumberToDate(await (await this.contract).pausedTime.callAsync());
  };

  /**
   * Number of individual investors this STO have.
   * @return number of investors
   */
  public investorCount = async (): Promise<number> => {
    return (await (await this.contract).investorCount.callAsync()).toNumber();
  };

  /**
   * Ethereum account address to hold the funds
   * @return wallet address
   */
  public wallet = async (): Promise<string> => {
    return (await this.contract).wallet.callAsync();
  };

  /**
   * Return the total no. of tokens sold
   */
  public totalTokensSold = async (): Promise<BigNumber> => {
    return weiToValue(
      await (await this.contract).totalTokensSold.callAsync(),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };

  /**
   * Returns funds raised by the STO
   */
  public getRaised = async (params: FundRaiseTypesParams): Promise<BigNumber> => {
    return weiToValue(await (await this.contract).getRaised.callAsync(params.type), FULL_DECIMALS);
  };
}
