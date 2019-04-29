import { TxParams, STOBaseContract, FundRaiseType } from '../../../types';
import ModuleWrapper from '../module_wrapper';
import assert from '../../../utils/assert';

interface FundRaiseTypesParams {
  type: FundRaiseType;
}

interface ReclaimERC20Params extends TxParams {
  tokenContract: string;
}

/**
 * This class includes the functionality related to interacting with the all STOs contracts.
 */
export default abstract class STOWrapper extends ModuleWrapper {
  protected abstract contract: Promise<STOBaseContract>;

  /**
   * Type of currency used to collect the funds
   */
  public fundRaiseTypes = async (params: FundRaiseTypesParams) => {
    return (await this.contract).fundRaiseTypes.callAsync(params.type);
  };

  /**
   * Returns funds raised by the STO
   */
  public fundsRaised = async (params: FundRaiseTypesParams) => {
    return (await this.contract).fundsRaised.callAsync(params.type);
  };

  /**
   * Start time of the Capped STO
   */
  public startTime = async () => {
    return (await this.contract).startTime.callAsync();
  };

  /**
   * End time of the Capped STO
   */
  public endTime = async () => {
    return (await this.contract).endTime.callAsync();
  };

  public pausedTime = async () => {
    return (await this.contract).pausedTime.callAsync();
  };

  /**
   * Number of individual investors this STO have.
   */
  public investorCount = async () => {
    return (await this.contract).investorCount.callAsync();
  };

  /**
   * Ethereum account address to hold the funds
   */
  public wallet = async () => {
    return (await this.contract).wallet.callAsync();
  };

  /**
   * Return the total no. of tokens sold
   */
  public totalTokensSold = async () => {
    return (await this.contract).totalTokensSold.callAsync();
  };

  public getRaised = async (params: FundRaiseTypesParams) => {
    return (await this.contract).getRaised.callAsync(params.type);
  };

  public pause = async (params: TxParams) => {
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public unpause = async (params: TxParams) => {
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public reclaimERC20 = async (params: ReclaimERC20Params) => {
    assert.isETHAddressHex('tokenContract', params.tokenContract);
    assert.isAddressNotZero(params.tokenContract);
    return (await this.contract).reclaimERC20.sendTransactionAsync(
      params.tokenContract,
      params.txData,
      params.safetyFactor,
    );
  };

  public reclaimETH = async (params: TxParams) => {
    return (await this.contract).reclaimETH.sendTransactionAsync(params.txData, params.safetyFactor);
  };
}
