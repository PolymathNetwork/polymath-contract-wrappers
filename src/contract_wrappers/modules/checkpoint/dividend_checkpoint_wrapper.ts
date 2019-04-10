
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import {
  TxParams,
  DividendCheckpointBaseContract,
} from '../../../types';
import {
  numberToBigNumber,
  dateToBigNumber,
  bigNumberToDate,
} from '../../../utils/convert';
import { ModuleWrapper } from '../module_wrapper';

interface DividendIndexParams {
  dividendIndex: number,
}

interface CheckpointIdParams {
  checkpointId: number,
}

interface InvestorParams {
  investor: string,
}

interface CalculateDividendParams {
  dividendIndex: number,
  payee: string,
}

interface InvestorStatus {
  investor: string,
  dividendIndex: number,
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
  dividendIndex: number,
  payees: string[],
}

interface PushDividendPaymentParams extends TxParams {
  dividendIndex: number,
  start: Date,
  iterations: number,
}

interface DividendIndexTxParams extends TxParams {
  dividendIndex: number,
}

interface UpdateDividendDatesParams extends TxParams {
  dividendIndex: number,
  maturity: Date,
  expiry: Date,
}

//// Return types ////

interface Dividend {
  checkpointId: number,
  /** Time at which the dividend was created */
  created: Date,
  /** Time after which dividend can be claimed - set to 0 to bypass */
  maturity: Date, 
  /** 
   * Time until which dividend can be claimed 
   * After this time any remaining amount can be withdrawn by issuer
   * Set to very high value to bypass
   */
  expiry: Date,
  /** Dividend amount in WEI */ 
  amount: BigNumber,
  /** Amount of dividend claimed so far */
  claimedAmount: BigNumber,
  /** Total supply at the associated checkpoint */
  totalSupply: BigNumber,
  /** True if expiry has passed and issuer has reclaimed remaining dividend */
  reclaimed: boolean,
  /**  */ 
  totalWithheld: BigNumber,
  /**  */
  totalWithheldWithdrawn: BigNumber,
  /** Name/title - used for identification */ 
  name: string
}

interface CalculateDividendResult {
  claim: BigNumber,
  withheld: BigNumber
}

interface DividendData {
  /** Timestamp of dividend creation */
  created: Date,
  /** Timestamp of dividend maturity */
  maturity: Date,
  /** Timestamp of dividend expiry */
  expiry: Date,
  /** Amount of dividend */
  amount: BigNumber,
  /** Claimed amount of dividend */
  claimedAmount: BigNumber,
  /** Name of dividend */
  name: string
}

interface DividendProgress {
  /** Investor address */
  investor: string,
  /** Whether investor has claimed */
  claimend: boolean,
  /** Whether investor is excluded */
  excluded: boolean,
  /** Amount of withheld tax (estimate if not claimed) */
  withheld: BigNumber,
  /** Amount of claim (estimate if not claimeed) */
  amount: BigNumber,
  /** Investor balance */
  balance: BigNumber
}

interface CheckpointData {
  /** Investor address */
  investor: string,
  /** Investor balance */
  balance: BigNumber
  /** Tax withheld percentage */
  withheld: BigNumber,
}

//// End of return types ////

/**
 * This class includes the functionality related to interacting with the DividendCheckpoint contract.
 */
export abstract class DividendCheckpointWrapper extends ModuleWrapper {
  protected abstract _contract: Promise<DividendCheckpointBaseContract>;

  public wallet = async () => {
    return await (await this._contract).wallet.callAsync();
  }

  public dividends = async (params: DividendIndexParams) => {
    const result = await (await this._contract).dividends.callAsync(
      numberToBigNumber(params.dividendIndex),
    );
    const typedResult: Dividend = {
      checkpointId: result[0].toNumber(),
      created: bigNumberToDate(result[1]),
      maturity: bigNumberToDate(result[2]), 
      expiry: bigNumberToDate(result[3]),
      amount: result[4],
      claimedAmount: result[5],
      totalSupply: result[6],
      reclaimed: result[7],
      totalWithheld: result[8],
      totalWithheldWithdrawn: result[9],
      name: result[10]
    }
    return typedResult;
  }

  public excluded = async (params: DividendIndexParams)=> {
    return await (await this._contract).excluded.callAsync(
      numberToBigNumber(params.dividendIndex),
    );
  }

  public withholdingTax = async (params: InvestorParams) => {
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

  public getDefaultExcluded = async () => {
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
      numberToBigNumber(params.dividendIndex),
      params.payees,
      params.txData,
      params.safetyFactor
    );
  }

  public pushDividendPayment = async (params: PushDividendPaymentParams) => {
    return (await this._contract).pushDividendPayment.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      dateToBigNumber(params.start),
      numberToBigNumber(params.iterations),
      params.txData,
      params.safetyFactor
    );
  }
  
  public pullDividendPayment = async (params: DividendIndexTxParams) => {
    return (await this._contract).pullDividendPayment.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.txData,
      params.safetyFactor
    );
  }

  public reclaimDividend = async (params: DividendIndexTxParams) => {
    return (await this._contract).reclaimDividend.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.txData,
      params.safetyFactor
    );
  }

  public calculateDividend = async (params: CalculateDividendParams) => {
    const result = await (await this._contract).calculateDividend.callAsync(
      numberToBigNumber(params.dividendIndex),
      params.payee,
    );
    const typedResult: CalculateDividendResult = {
      claim: result[0],
      withheld: result[1]
    }
    return typedResult;
  }

  public getDividendIndex = async (params: CheckpointIdParams) => {
    return await (await this._contract).getDividendIndex.callAsync(
      numberToBigNumber(params.checkpointId),
    );
  }

  public withdrawWithholding = async (params: DividendIndexTxParams) => {
    return (await this._contract).reclaimDividend.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.txData,
      params.safetyFactor
    );
  }

  public updateDividendDates = async (params: UpdateDividendDatesParams) => {
    return (await this._contract).updateDividendDates.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.txData,
      params.safetyFactor
    );
  }

  public getDividendsData = async () => {
    const result = await (await this._contract).getDividendsData.callAsync();
    let typedResult: DividendData[] = [];
    for (let i = 0; i < result[0].length; i++) {
      const dividendData: DividendData = {
        created: bigNumberToDate(result[0][i]),
        maturity: bigNumberToDate(result[1][i]),
        expiry: bigNumberToDate(result[2][i]),
        amount: result[3][i],
        claimedAmount: result[4][i],
        name: result[5][i]
      }
      typedResult.push(dividendData);
    }
    return typedResult;
  }

  public getDividendData = async (params: DividendIndexParams) => {
    const result = await (await this._contract).getDividendData.callAsync(
      numberToBigNumber(params.dividendIndex),
    );
    const typedResult: DividendData = {
      created: bigNumberToDate(result[0]),
      maturity: bigNumberToDate(result[1]),
      expiry: bigNumberToDate(result[2]),
      amount: result[3],
      claimedAmount: result[4],
      name: result[5]
    }
    return typedResult;
  }

  public getDividendProgress = async (params: DividendIndexParams) => {
    const result = await (await this._contract).getDividendProgress.callAsync(
      numberToBigNumber(params.dividendIndex),
    );
    let typedResult: DividendProgress[] = [];
    for (let i = 0; i < result[0].length; i++) {
      const dividendProgress: DividendProgress = {
        investor: result[0][i],
        claimend: result[1][i],
        excluded: result[2][i],
        withheld: result[3][i],
        amount: result[4][i],
        balance: result[5][i]
      }
      typedResult.push(dividendProgress);
    }
    return typedResult;
  }

  public getCheckpointData = async (params: CheckpointIdParams) => {
    const result = await (await this._contract).getCheckpointData.callAsync(
      numberToBigNumber(params.checkpointId),
    );
    let typedResult: CheckpointData[] = [];
    for (let i = 0; i < result[0].length; i++) {
      const checkpointData: CheckpointData = {
        investor: result[0][i],
        balance: result[1][i],
        withheld: result[2][i]
      }
      typedResult.push(checkpointData);
    }
    return typedResult;
  }

  public isClaimed = async (params: InvestorStatus) => {
    return await (await this._contract).isClaimed.callAsync(
      params.investor,
      numberToBigNumber(params.dividendIndex),
    );
  }

  public isExcluded = async (params: InvestorStatus) => {
    return await (await this._contract).isExcluded.callAsync(
      params.investor,
      numberToBigNumber(params.dividendIndex),
    );
  }
} 