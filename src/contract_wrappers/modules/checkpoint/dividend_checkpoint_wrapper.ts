import { BigNumber } from '@0x/utils';
import ModuleWrapper from '../module_wrapper';
import assert from '../../../utils/assert';
import { TxParams, DividendCheckpointBaseContract, Perms } from '../../../types';
import { numberToBigNumber, dateToBigNumber, bigNumberToDate, bytes32ToString } from '../../../utils/convert';

const EXCLUDED_ADDRESS_LIMIT = 150;

interface DividendIndexParams {
  dividendIndex: number;
}

interface CheckpointIdParams {
  checkpointId: number;
}

interface InvestorParams {
  investor: string;
}

interface CalculateDividendParams {
  dividendIndex: number;
  payee: string;
}

interface InvestorStatus {
  investor: string;
  dividendIndex: number;
}

interface ChangeWalletParams extends TxParams {
  wallet: string;
}

interface ReclaimERC20Params extends TxParams {
  tokenContract: string;
}

interface SetDefaultExcludedParams extends TxParams {
  excluded: string[];
}

interface SetWithholdingParams extends TxParams {
  investors: string[];
  withholding: BigNumber[];
}

interface SetWithholdingFixedParams extends TxParams {
  investors: string[];
  withholding: BigNumber;
}

interface PushDividendPaymentToAddressesParams extends TxParams {
  dividendIndex: number;
  payees: string[];
}

interface PushDividendPaymentParams extends TxParams {
  dividendIndex: number;
  start: Date;
  iterations: number;
}

interface DividendIndexTxParams extends TxParams {
  dividendIndex: number;
}

interface UpdateDividendDatesParams extends TxParams {
  dividendIndex: number;
  maturity: Date;
  expiry: Date;
}

// // Return types ////

interface Dividend {
  checkpointId: number;
  /** Time at which the dividend was created */
  created: Date;
  /** Time after which dividend can be claimed - set to 0 to bypass */
  maturity: Date;
  /**
   * Time until which dividend can be claimed
   * After this time any remaining amount can be withdrawn by issuer
   * Set to very high value to bypass
   */
  expiry: Date;
  /** Dividend amount in WEI */

  amount: BigNumber;
  /** Amount of dividend claimed so far */
  claimedAmount: BigNumber;
  /** Total supply at the associated checkpoint */
  totalSupply: BigNumber;
  /** True if expiry has passed and issuer has reclaimed remaining dividend */
  reclaimed: boolean;
  /**  */

  totalWithheld: BigNumber;
  /**  */
  totalWithheldWithdrawn: BigNumber;
  /** Name/title - used for identification */

  name: string;
}

interface CalculateDividendResult {
  claim: BigNumber;
  withheld: BigNumber;
}

interface DividendData {
  /** Timestamp of dividend creation */
  created: Date;
  /** Timestamp of dividend maturity */
  maturity: Date;
  /** Timestamp of dividend expiry */
  expiry: Date;
  /** Amount of dividend */
  amount: BigNumber;
  /** Claimed amount of dividend */
  claimedAmount: BigNumber;
  /** Name of dividend */
  name: string;
}

interface DividendProgress {
  /** Investor address */
  investor: string;
  /** Whether investor has claimed */
  claimend: boolean;
  /** Whether investor is excluded */
  excluded: boolean;
  /** Amount of withheld tax (estimate if not claimed) */
  withheld: BigNumber;
  /** Amount of claim (estimate if not claimeed) */
  amount: BigNumber;
  /** Investor balance */
  balance: BigNumber;
}

interface CheckpointData {
  /** Investor address */
  investor: string;
  /** Investor balance */
  balance: BigNumber;
  /** Tax withheld percentage */
  withheld: BigNumber;
}

// // End of return types ////

/**
 * This class includes the functionality related to interacting with the DividendCheckpoint contract.
 */
export default abstract class DividendCheckpointWrapper extends ModuleWrapper {
  protected abstract contract: Promise<DividendCheckpointBaseContract>;

  public wallet = async () => {
    return (await this.contract).wallet.callAsync();
  };

  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  public dividends = async (params: DividendIndexParams) => {
    const result = await (await this.contract).dividends.callAsync(numberToBigNumber(params.dividendIndex));
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
      name: result[10],
    };
    return typedResult;
  };

  public excluded = async (params: DividendIndexParams) => {
    return (await this.contract).excluded.callAsync(numberToBigNumber(params.dividendIndex));
  };

  public withholdingTax = async (params: InvestorParams) => {
    assert.isETHAddressHex('investor', params.investor);
    return (await this.contract).withholdingTax.callAsync(params.investor);
  };

  public pause = async (params: TxParams) => {
    assert.assert(!(await this.paused()), 'Contract currently paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public unpause = async (params: TxParams) => {
    assert.assert(await this.paused(), 'Contract currently not paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public reclaimERC20 = async (params: ReclaimERC20Params) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    assert.isNonZeroETHAddressHex('tokenContract', params.tokenContract);
    // require(token.transfer(msg.sender, balance), "Transfer failed");
    return (await this.contract).reclaimERC20.sendTransactionAsync(
      params.tokenContract,
      params.txData,
      params.safetyFactor,
    );
  };

  public reclaimETH = async (params: TxParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    return (await this.contract).reclaimETH.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public changeWallet = async (params: ChangeWalletParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    assert.isNonZeroETHAddressHex('wallet', params.wallet);
    return (await this.contract).changeWallet.sendTransactionAsync(params.wallet, params.txData, params.safetyFactor);
  };

  public getDefaultExcluded = async () => {
    return (await this.contract).getDefaultExcluded.callAsync();
  };

  public createCheckpoint = async (params: TxParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Checkpoint), 'Caller is not allowed');
    return (await this.contract).createCheckpoint.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public setDefaultExcluded = async (params: SetDefaultExcludedParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Manage), 'Caller is not allowed');
    assert.assert(params.excluded.length <= EXCLUDED_ADDRESS_LIMIT, 'Too many excluded addresses');
    params.excluded.forEach(address => assert.isNonZeroETHAddressHex('excluded', address));
    assert.areThereDuplicatedStrings('excluded', params.excluded);
    return (await this.contract).setDefaultExcluded.sendTransactionAsync(
      params.excluded,
      params.txData,
      params.safetyFactor,
    );
  };

  public setWithholding = async (params: SetWithholdingParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Manage), 'Caller is not allowed');
    assert.assert(params.investors.length === params.withholding.length, 'Mismatched input lengths');
    params.withholding.forEach(withholding => assert.isPercentage('withholding tax', withholding));
    return (await this.contract).setWithholding.sendTransactionAsync(
      params.investors,
      params.withholding,
      params.txData,
      params.safetyFactor,
    );
  };

  public setWithholdingFixed = async (params: SetWithholdingFixedParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Manage), 'Caller is not allowed');
    assert.isPercentage('withholding tax', params.withholding);
    return (await this.contract).setWithholdingFixed.sendTransactionAsync(
      params.investors,
      params.withholding,
      params.txData,
      params.safetyFactor,
    );
  };

  public pushDividendPaymentToAddresses = async (params: PushDividendPaymentToAddressesParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Distribute), 'Caller is not allowed');
    params.payees.forEach(address => assert.isNonZeroETHAddressHex('payees', address));
    await this.checkValidDividendIndex(params.dividendIndex);
    return (await this.contract).pushDividendPaymentToAddresses.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.payees,
      params.txData,
      params.safetyFactor,
    );
  };

  public pushDividendPayment = async (params: PushDividendPaymentParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Distribute), 'Caller is not allowed');
    await this.checkValidDividendIndex(params.dividendIndex);
    return (await this.contract).pushDividendPayment.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      dateToBigNumber(params.start),
      numberToBigNumber(params.iterations),
      params.txData,
      params.safetyFactor,
    );
  };

  public pullDividendPayment = async (params: DividendIndexTxParams) => {
    await this.checkValidDividendIndex(params.dividendIndex);
    assert.assert(!(await this.paused()), 'Contract currently paused');
    const address = (await this.web3Wrapper.getAvailableAddressesAsync())[0];
    const isClaimed = await this.isClaimed({
      investor: address,
      dividendIndex: params.dividendIndex,
    });
    const isExcluded = await this.isExcluded({
      investor: address,
      dividendIndex: params.dividendIndex,
    });
    assert.assert(!isClaimed, 'Dividend already claimed');
    assert.assert(!isExcluded, `${address} is excluded from Dividend`);
    return (await this.contract).pullDividendPayment.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.txData,
      params.safetyFactor,
    );
  };

  public reclaimDividend = async (params: DividendIndexTxParams) => {
    const dividends = await (await this.contract).getDividendsData.callAsync();
    assert.assert(params.dividendIndex < dividends[0].length, 'Incorrect dividend index');
    const dividend = await this.dividends(params);
    assert.isPastDate(dividend.expiry, 'Dividend expiry is in the future');
    assert.assert(!dividend.reclaimed, 'Dividend is already claimed');
    return (await this.contract).reclaimDividend.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.txData,
      params.safetyFactor,
    );
  };

  public calculateDividend = async (params: CalculateDividendParams) => {
    const dividendsData = await (await this.contract).getDividendsData.callAsync();
    assert.assert(params.dividendIndex < dividendsData[0].length, 'Invalid dividend');
    const result = await (await this.contract).calculateDividend.callAsync(
      numberToBigNumber(params.dividendIndex),
      params.payee,
    );
    const typedResult: CalculateDividendResult = {
      claim: result[0],
      withheld: result[1],
    };
    return typedResult;
  };

  public getDividendIndex = async (params: CheckpointIdParams) => {
    return (await this.contract).getDividendIndex.callAsync(numberToBigNumber(params.checkpointId));
  };

  public withdrawWithholding = async (params: DividendIndexTxParams) => {
    const dividends = await (await this.contract).getDividendsData.callAsync();
    assert.assert(params.dividendIndex < dividends[0].length, 'Incorrect dividend index');
    return (await this.contract).reclaimDividend.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.txData,
      params.safetyFactor,
    );
  };

  public updateDividendDates = async (params: UpdateDividendDatesParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    const dividendsData = await (await this.contract).getDividendsData.callAsync();
    assert.assert(params.dividendIndex < dividendsData[0].length, 'Invalid dividend');
    assert.assert(params.expiry > params.maturity, 'Expiry before maturity');
    return (await this.contract).updateDividendDates.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.txData,
      params.safetyFactor,
    );
  };

  public getDividendsData = async () => {
    const result = await (await this.contract).getDividendsData.callAsync();
    const typedResult: DividendData[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      const dividendData: DividendData = {
        created: bigNumberToDate(result[0][i]),
        maturity: bigNumberToDate(result[1][i]),
        expiry: bigNumberToDate(result[2][i]),
        amount: result[3][i],
        claimedAmount: result[4][i],
        name: bytes32ToString(result[5][i]),
      };
      typedResult.push(dividendData);
    }
    return typedResult;
  };

  public getDividendData = async (params: DividendIndexParams) => {
    const result = await (await this.contract).getDividendData.callAsync(numberToBigNumber(params.dividendIndex));
    const typedResult: DividendData = {
      created: bigNumberToDate(result[0]),
      maturity: bigNumberToDate(result[1]),
      expiry: bigNumberToDate(result[2]),
      amount: result[3],
      claimedAmount: result[4],
      name: bytes32ToString(result[5]),
    };
    return typedResult;
  };

  public getDividendProgress = async (params: DividendIndexParams) => {
    const dividendsData = await (await this.contract).getDividendsData.callAsync();
    assert.assert(params.dividendIndex < dividendsData[0].length, 'Invalid dividend');
    const result = await (await this.contract).getDividendProgress.callAsync(numberToBigNumber(params.dividendIndex));
    const typedResult: DividendProgress[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      const dividendProgress: DividendProgress = {
        investor: result[0][i],
        claimend: result[1][i],
        excluded: result[2][i],
        withheld: result[3][i],
        amount: result[4][i],
        balance: result[5][i],
      };
      typedResult.push(dividendProgress);
    }
    return typedResult;
  };

  public getCheckpointData = async (params: CheckpointIdParams) => {
    const st = await this.securityTokenContract();
    const currentCheckpointId = await st.currentCheckpointId.callAsync();
    assert.assert(params.checkpointId <= currentCheckpointId.toNumber(), 'Invalid checkpoint');
    const result = await (await this.contract).getCheckpointData.callAsync(numberToBigNumber(params.checkpointId));
    const typedResult: CheckpointData[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      const checkpointData: CheckpointData = {
        investor: result[0][i],
        balance: result[1][i],
        withheld: result[2][i],
      };
      typedResult.push(checkpointData);
    }
    return typedResult;
  };

  public isClaimed = async (params: InvestorStatus) => {
    assert.isETHAddressHex('investor', params.investor);
    const dividendsData = await (await this.contract).getDividendsData.callAsync();
    assert.assert(params.dividendIndex < dividendsData[0].length, 'Invalid dividend');
    return (await this.contract).isClaimed.callAsync(params.investor, numberToBigNumber(params.dividendIndex));
  };

  public isExcluded = async (params: InvestorStatus) => {
    assert.isETHAddressHex('investor', params.investor);
    const dividendsData = await (await this.contract).getDividendsData.callAsync();
    assert.assert(params.dividendIndex < dividendsData[0].length, 'Invalid dividend');
    return (await this.contract).isExcluded.callAsync(params.investor, numberToBigNumber(params.dividendIndex));
  };

  private checkValidDividendIndex = async (dividendIndex: number) => {
    const dividends = await this.getDividendsData();
    assert.assert(dividends.length > dividendIndex, 'Invalid dividend');
    const dividend = await this.getDividendData({ dividendIndex });
    // Reclaimed
    assert.assert(
      !dividend.claimedAmount.isGreaterThan(0),
      'Dividend claimed amount greater than 0, dividend reclaimed',
    );
    assert.isPastDate(dividend.maturity, 'Dividend maturity in future');
    assert.isFutureDate(dividend.expiry, 'Dividend expiry in past');
  };
}
