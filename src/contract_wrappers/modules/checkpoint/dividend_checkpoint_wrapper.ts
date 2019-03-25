
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import {
  ITxParams,
  DividendCheckpointBaseContract,
} from '../../../types';
import { ModuleWrapper } from '../module_wrapper';

interface IDividendsParams {
  dividendIndex: BigNumber,
}

interface IExcludedParams {
  dividendIndex: BigNumber
}

interface IWithholdingTaxParams {
  investor: string,
}

interface IReclaimERC20Params extends ITxParams {
  tokenContract: string,
}

interface ISetDefaultExcludedParams extends ITxParams {
  excluded: string[],
}

interface ISetWithholdingParams extends ITxParams {
  investors: string[],
  withholding: BigNumber[],
}

interface ISetWithholdingFixedParams extends ITxParams {
  investors: string[],
  withholding: BigNumber,
}

interface IPushDividendPaymentToAddressesParams extends ITxParams {
  dividendIndex: BigNumber,
  payees: string[],
}

interface IPushDividendPaymentParams extends ITxParams {
  dividendIndex: BigNumber,
  start: BigNumber,
  iterations: BigNumber,
}

interface IPullDividendPaymentParams extends ITxParams {
  dividendIndex: BigNumber,
}

interface IReclaimDividendParams extends ITxParams {
  dividendIndex: BigNumber
}

interface ICalculateDividendParams {
  dividendIndex: BigNumber,
  payee: string,
}

interface IGetDividendIndexParams {
  checkpointId: BigNumber,
}

interface IWithdrawWithholdingParams extends ITxParams {
  dividendIndex: BigNumber
}

interface IUpdateDividendsDatesParams extends ITxParams {
  dividendIndex: BigNumber,
  maturity: BigNumber,
  expiry: BigNumber,
}

interface IGetDividendDataParams {
  dividendIndex: BigNumber,
}

interface IGetDividendProgressParams {
  dividendIndex: BigNumber
}

interface IGetCheckpointDataParams {
  checkpointId: BigNumber,
}

interface IIsClaimedParams {
  investor: string,
  dividendIndex: BigNumber,
}

interface IIsExcludedParams {
  investor: string,
  dividendIndex: BigNumber,
}

/**
 * This class includes the functionality related to interacting with the DividendCheckpoint contract.
 */
export abstract class DividendCheckpointWrapper extends ModuleWrapper {
  protected abstract _contract: Promise<DividendCheckpointBaseContract>;

  //TODO: Once updated abi-wrappers to latest 2.1.1 release
  //public wallet = async (): Promise<string> => {
    //return await (await this._contract).wallet.callAsync();
  //}

  public dividends = async (params: IDividendsParams): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, boolean, BigNumber, BigNumber, string]> => {
    return await (await this._contract).dividends.callAsync(
      params.dividendIndex,
    );
  }

  public excluded = async (params: IExcludedParams): Promise<string> => {
    return await (await this._contract).excluded.callAsync(
      params.dividendIndex,
    );
  }

  public withholdingTax = async (params: IWithholdingTaxParams): Promise<BigNumber> => {
    return await (await this._contract).withholdingTax.callAsync(
      params.investor,
    );
  }

  //TODO: Once updated abi-wrappers to latest 2.1.1 release
  /* public pause = async (params: ITxParams) => {
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
      return (await this._contract).reclaimETH.sendTransactionAsync();
    }
  }

  public changeWallet = async (params: IChangeWalletParams) => {
    return await (await this._contract).changeWallet.sendTransactionAsync(
      params.wallet
    );
  }
  */

  public getDefaultExcluded = async (): Promise<string[]> => {
    return await (await this._contract).getDefaultExcluded.callAsync();
  }

  public createCheckpoint = async (params: ITxParams) => {
    return async () => {
      return (await this._contract).createCheckpoint.sendTransactionAsync();
    }
  }

  public setDefaultExcluded = async (params: ISetDefaultExcludedParams) => {
    return async () => {
      return (await this._contract).setDefaultExcluded.sendTransactionAsync(
        params.excluded,
      );
    }
  }

  public setWithholding = async (params: ISetWithholdingParams) => {
    return async () => {
      return (await this._contract).setWithholding.sendTransactionAsync(
        params.investors,
        params.withholding,
      );
    }
  }

  public setWithholdingFixed = async (params: ISetWithholdingFixedParams) => {
    return async () => {
      return (await this._contract).setWithholdingFixed.sendTransactionAsync(
        params.investors,
        params.withholding,
      );
    }
  }

  public pushDividendPaymentToAddresses = async (params: IPushDividendPaymentToAddressesParams) => {
    return async () => {
      return (await this._contract).pushDividendPaymentToAddresses.sendTransactionAsync(
        params.dividendIndex,
        params.payees,
      );
    }
  }

  public pushDividendPayment = async (params: IPushDividendPaymentParams) => {
    return async () => {
      return (await this._contract).pushDividendPayment.sendTransactionAsync(
        params.dividendIndex,
        params.start,
        params.iterations,
      );
    }
  }
  
  public pullDividendPayment = async (params: IPullDividendPaymentParams) => {
    return async () => {
      return (await this._contract).pullDividendPayment.sendTransactionAsync(
        params.dividendIndex,
      );
    }
  }

  public reclaimDividend = async (params: IReclaimDividendParams) => {
    return async () => {
      return (await this._contract).reclaimDividend.sendTransactionAsync(
        params.dividendIndex,
      );
    }
  }

  public calculateDividend = async (params: ICalculateDividendParams): Promise<[BigNumber, BigNumber]> => {
    return await (await this._contract).calculateDividend.callAsync(
      params.dividendIndex,
      params.payee,
    );
  }

  public getDividendIndex = async (params: IGetDividendIndexParams): Promise<BigNumber[]> => {
    return await (await this._contract).getDividendIndex.callAsync(
      params.checkpointId,
    );
  }

  public withdrawWithholding = async (params: IWithdrawWithholdingParams) => {
    return async () => {
      return (await this._contract).reclaimDividend.sendTransactionAsync(
        params.dividendIndex,
      );
    }
  }

  /*
  //TODO: Once updated abi-wrappers to latest 2.1.1 release
  public updateDividendDates = async (params: IUpdateDividendDatesParams) => {
    return async () => {
      return (await this._contract).updateDividendDates.sendTransactionAsync(
        params.dividendIndex,
        params.maturity,
        params.expiry
      );
    }
  }
  */


  public getDividendsData = async (): Promise<[BigNumber[], BigNumber[], BigNumber[], BigNumber[], BigNumber[], string[]]> => {
    return await (await this._contract).getDividendsData.callAsync();
  }

  public getDividendData = async (params: IGetDividendDataParams): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, string]> => {
    return await (await this._contract).getDividendData.callAsync(
      params.dividendIndex,
    );
  }

  public getDividendProgress = async (params: IGetDividendProgressParams): Promise<[string[], boolean[], boolean[], BigNumber[], BigNumber[], BigNumber[]]> => {
    return await (await this._contract).getDividendProgress.callAsync(
      params.dividendIndex,
    );
  }

  public getCheckpointData = async (params: IGetCheckpointDataParams): Promise<[string[], BigNumber[], BigNumber[]]> => {
    return await (await this._contract).getCheckpointData.callAsync(
      params.checkpointId,
    );
  }

  public isClaimed = async (params: IIsClaimedParams): Promise<boolean> => {
    return await (await this._contract).isClaimed.callAsync(
      params.investor,
      params.dividendIndex,
    );
  }

  public isExcluded = async (params: IIsExcludedParams): Promise<boolean> => {
    return await (await this._contract).isExcluded.callAsync(
      params.investor,
      params.dividendIndex,
    );
  }
} 