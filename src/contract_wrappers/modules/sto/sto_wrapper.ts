import * as _ from 'lodash';
import {
  TxParams,
  STOBaseContract, FundRaiseType,
} from '../../../types';
import { ModuleWrapper } from '../module_wrapper';

interface FundRaiseTypesParams {
  type: FundRaiseType;
}

interface IReclaimERC20Params extends TxParams {
  tokenContract: string,
}

  /**
 * This class includes the functionality related to interacting with the all STOs contracts.
 */
export abstract class STOWrapper extends ModuleWrapper {
  protected abstract _contract: Promise<STOBaseContract>;

  /**
   * Type of currency used to collect the funds
   */
  public fundRaiseTypes = async (params: FundRaiseTypesParams) => {
    return await (await this._contract).fundRaiseTypes.callAsync(params.type);
  }

  /**
   * Returns funds raised by the STO
   */
  public fundsRaised = async (params: FundRaiseTypesParams) => {
    return await (await this._contract).fundsRaised.callAsync(params.type);
  }

    /**
   * Start time of the Capped STO
   */
  public startTime = async () => {
    return await (await this._contract).startTime.callAsync();
  }

  /**
   * End time of the Capped STO
   */
  public endTime = async () => {
    return await (await this._contract).endTime.callAsync();
  }

  public pausedTime = async () => {
    return await (await this._contract).pausedTime.callAsync();
  }

  /**
   * Number of individual investors this STO have.
   */
  public investorCount = async () => {
    return await (await this._contract).investorCount.callAsync();
  }

  /**
   * Ethereum account address to hold the funds
   */
  public wallet = async () => {
    return await (await this._contract).wallet.callAsync();
  }

  /**
   * Return the total no. of tokens sold
   */
  public totalTokensSold  = async () => {
    return await (await this._contract).totalTokensSold.callAsync();
  }

  public getRaised = async (params: FundRaiseTypesParams) => {
    return await (await this._contract).getRaised.callAsync(
      params.type,
    );
  }

  public pause = async (params: TxParams) => {
    return (await this._contract).pause.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  }

  public unpause = async (params: TxParams) => {
    return (await this._contract).unpause.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  }

  public reclaimERC20 = async (params: IReclaimERC20Params) => {
    return (await this._contract).reclaimERC20.sendTransactionAsync(
      params.tokenContract,
      params.txData,
      params.safetyFactor
    );
  }

  public reclaimETH = async (params: TxParams) => {
    return (await this._contract).reclaimETH.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  }
}