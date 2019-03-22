import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import {
  ITxParams,
  STOBaseContract,
} from '../../../types';
import { ModuleWrapper } from '../module_wrapper';

/**
 * 
 */
interface IFundRaiseTypesParams {
  index: number;
}

/**
 * 
 */
interface IFundsRaisedParams {
  index: number;
}

interface IGetRaisedParams {
  fundRaiseType: number|BigNumber,
}

interface IReclaimERC20Params extends ITxParams {
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
  public fundRaiseTypes = async (params: IFundRaiseTypesParams): Promise<boolean> => {
    return await (await this._contract).fundRaiseTypes.callAsync(params.index);
  }

  /**
   * Returns funds raised by the STO
   */
  public fundsRaised = async (params: IFundsRaisedParams): Promise<BigNumber> => {
    return await (await this._contract).fundsRaised.callAsync(params.index);
  }

    /**
   * Start time of the Capped STO
   */
  public startTime = async (): Promise<BigNumber> => {
    return await (await this._contract).startTime.callAsync();
  }

  /**
   * End time of the Capped STO
   */
  public endTime = async (): Promise<BigNumber> => {
    return await (await this._contract).endTime.callAsync();
  }

  public pausedTime = async (): Promise<BigNumber> => {
    return await (await this._contract).pausedTime.callAsync();
  }

  /**
   * Number of individual investors this STO have.
   */
  public investorCount = async (): Promise<BigNumber> => {
    return await (await this._contract).investorCount.callAsync();
  }

  /**
   * Ethereum account address to hold the funds
   */
  public wallet = async (): Promise<string> => {
    return await (await this._contract).wallet.callAsync();
  }

  /**
   * Return the total no. of tokens sold
   */
  public totalTokensSold  = async (): Promise<BigNumber> => {
    return await (await this._contract).totalTokensSold.callAsync();
  }

  public getRaised = async (params: IGetRaisedParams): Promise<BigNumber> => {
    return await (await this._contract).getRaised.callAsync(
      params.fundRaiseType,
    );
  }

  public pause = async (params: ITxParams) => {
    return async () => {
      return (await this._contract).pause.sendTransactionAsync();
    }
  }

  public unpause = async (params: ITxParams) => {
    return async () => {
      return (await this._contract).unpause.sendTransactionAsync();
    }
  }

  public reclaimERC20 = async (params: IReclaimERC20Params) => {
    return async () => {
      return (await this._contract).reclaimERC20.sendTransactionAsync(
        params.tokenContract,
      );
    }
  }

  public reclaimETH = async () => {
    return async () => {
      //return (await this._contract).reclaimETH.sendTransactionAsync();
    }
  }
}