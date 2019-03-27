
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import {
  TxParams,
  DividendCheckpointBaseContract,
} from '../../../types';
import { ModuleWrapper } from '../module_wrapper';

interface DividendIndexParams {
  dividendIndex: BigNumber,
}

interface CheckpointIdParams {
  checkpointId: BigNumber,
}

interface InvestorParams {
  investor: string,
}

interface CalculateDividendParams {
  dividendIndex: BigNumber,
  payee: string,
}

interface InvestorStatus {
  investor: string,
  dividendIndex: BigNumber,
}

interface ChangeWalletParams extends TxParams {
  wallet: string,
}

interface ReclaimERC20Params extends TxParams {
  tokenContract: string,
}

interface SetDefaultExcludedParams extends TxParams {
  excluded: string[],
}

interface SetWithholdingParams extends TxParams {
  investors: string[],
  withholding: BigNumber[],
}

interface SetWithholdingFixedParams extends TxParams {
  investors: string[],
  withholding: BigNumber,
}

interface PushDividendPaymentToAddressesParams extends TxParams {
  dividendIndex: BigNumber,
  payees: string[],
}

interface PushDividendPaymentParams extends TxParams {
  dividendIndex: BigNumber,
  start: BigNumber,
  iterations: BigNumber,
}

interface DividendIndexTxParams extends TxParams {
  dividendIndex: BigNumber,
}

interface UpdateDividendDatesParams extends TxParams {
  dividendIndex: BigNumber,
  maturity: BigNumber,
  expiry: BigNumber,
}

/**
 * This class includes the functionality related to interacting with the DividendCheckpoint contract.
 */
export abstract class DividendCheckpointWrapper extends ModuleWrapper {
  protected abstract _contract: Promise<DividendCheckpointBaseContract>;

  public wallet = async (): Promise<string> => {
    return await (await this._contract).wallet.callAsync();
  }

  public dividends = async (params: DividendIndexParams): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, boolean, BigNumber, BigNumber, string]> => {
    return await (await this._contract).dividends.callAsync(
      params.dividendIndex,
    );
  }

  public excluded = async (params: DividendIndexParams): Promise<string> => {
    return await (await this._contract).excluded.callAsync(
      params.dividendIndex,
    );
  }

  public withholdingTax = async (params: InvestorParams): Promise<BigNumber> => {
    return await (await this._contract).withholdingTax.callAsync(
      params.investor,
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

  public reclaimERC20 = async (params: ReclaimERC20Params) => {
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

  public changeWallet = async (params: ChangeWalletParams) => {
    return await (await this._contract).changeWallet.sendTransactionAsync(
      params.wallet,
      params.txData,
      params.safetyFactor
    );
  }

  public getDefaultExcluded = async (): Promise<string[]> => {
    return await (await this._contract).getDefaultExcluded.callAsync();
  }

  public createCheckpoint = async (params: TxParams) => {
    return (await this._contract).createCheckpoint.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  }

  public setDefaultExcluded = async (params: SetDefaultExcludedParams) => {
    return (await this._contract).setDefaultExcluded.sendTransactionAsync(
      params.excluded,
      params.txData,
      params.safetyFactor
    );
  }

  public setWithholding = async (params: SetWithholdingParams) => {
    return (await this._contract).setWithholding.sendTransactionAsync(
      params.investors,
      params.withholding,
      params.txData,
      params.safetyFactor
    );
  }

  public setWithholdingFixed = async (params: SetWithholdingFixedParams) => {
    return (await this._contract).setWithholdingFixed.sendTransactionAsync(
      params.investors,
      params.withholding,
      params.txData,
      params.safetyFactor
    );
  }

  public pushDividendPaymentToAddresses = async (params: PushDividendPaymentToAddressesParams) => {
    return (await this._contract).pushDividendPaymentToAddresses.sendTransactionAsync(
      params.dividendIndex,
      params.payees,
      params.txData,
      params.safetyFactor
    );
  }

  public pushDividendPayment = async (params: PushDividendPaymentParams) => {
    return (await this._contract).pushDividendPayment.sendTransactionAsync(
      params.dividendIndex,
      params.start,
      params.iterations,
      params.txData,
      params.safetyFactor
    );
  }
  
  public pullDividendPayment = async (params: DividendIndexTxParams) => {
    return (await this._contract).pullDividendPayment.sendTransactionAsync(
      params.dividendIndex,
      params.txData,
      params.safetyFactor
    );
  }

  public reclaimDividend = async (params: DividendIndexTxParams) => {
    return (await this._contract).reclaimDividend.sendTransactionAsync(
      params.dividendIndex,
      params.txData,
      params.safetyFactor
    );
  }

  public calculateDividend = async (params: CalculateDividendParams): Promise<[BigNumber, BigNumber]> => {
    return await (await this._contract).calculateDividend.callAsync(
      params.dividendIndex,
      params.payee,
    );
  }

  public getDividendIndex = async (params: CheckpointIdParams): Promise<BigNumber[]> => {
    return await (await this._contract).getDividendIndex.callAsync(
      params.checkpointId,
    );
  }

  public withdrawWithholding = async (params: DividendIndexTxParams) => {
    return (await this._contract).reclaimDividend.sendTransactionAsync(
      params.dividendIndex,
      params.txData,
      params.safetyFactor
    );
  }

  public updateDividendDates = async (params: UpdateDividendDatesParams) => {
    return (await this._contract).updateDividendDates.sendTransactionAsync(
      params.dividendIndex,
      params.maturity,
      params.expiry,
      params.txData,
      params.safetyFactor
    );
  }

  public getDividendsData = async (): Promise<[BigNumber[], BigNumber[], BigNumber[], BigNumber[], BigNumber[], string[]]> => {
    return await (await this._contract).getDividendsData.callAsync();
  }

  public getDividendData = async (params: DividendIndexParams): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, string]> => {
    return await (await this._contract).getDividendData.callAsync(
      params.dividendIndex,
    );
  }

  public getDividendProgress = async (params: DividendIndexParams): Promise<[string[], boolean[], boolean[], BigNumber[], BigNumber[], BigNumber[]]> => {
    return await (await this._contract).getDividendProgress.callAsync(
      params.dividendIndex,
    );
  }

  public getCheckpointData = async (params: CheckpointIdParams): Promise<[string[], BigNumber[], BigNumber[]]> => {
    return await (await this._contract).getCheckpointData.callAsync(
      params.checkpointId,
    );
  }

  public isClaimed = async (params: InvestorStatus): Promise<boolean> => {
    return await (await this._contract).isClaimed.callAsync(
      params.investor,
      params.dividendIndex,
    );
  }

  public isExcluded = async (params: InvestorStatus): Promise<boolean> => {
    return await (await this._contract).isExcluded.callAsync(
      params.investor,
      params.dividendIndex,
    );
  }
} 