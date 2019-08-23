import { BigNumber, TxData, ERC20DetailedContract } from '@polymathnetwork/abi-wrappers';
import ModuleWrapper from '../module_wrapper';
import assert from '../../../utils/assert';
import { TxParams, DividendCheckpointBaseContract, Perm, PERCENTAGE_DECIMALS } from '../../../types';
import {
  numberToBigNumber,
  dateToBigNumber,
  bigNumberToDate,
  bytes32ToString,
  valueToWei,
  valueArrayToWeiArray,
  weiToValue,
} from '../../../utils/convert';

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
  end: Date;
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
  claimed: boolean;
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

  protected erc20DetailedContract = async (address: string): Promise<ERC20DetailedContract> => {
    return this.contractFactory.getERC20DetailedContract(address);
  };

  protected abstract getDecimals(dividendIndex: number): Promise<BigNumber>;

  public wallet = async () => {
    return (await this.contract).wallet.callAsync();
  };

  public getTreasuryWallet = async (): Promise<string> => {
    return (await this.contract).getTreasuryWallet.callAsync();
  };

  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  public dividends = async (params: DividendIndexParams) => {
    const decimals = await this.getDecimals(params.dividendIndex);
    const result = await (await this.contract).dividends.callAsync(numberToBigNumber(params.dividendIndex));
    const typedResult: Dividend = {
      checkpointId: new BigNumber(result[0]).toNumber(),
      created: bigNumberToDate(result[1]),
      maturity: bigNumberToDate(result[2]),
      expiry: bigNumberToDate(result[3]),
      amount: weiToValue(result[4], decimals),
      claimedAmount: weiToValue(result[5], decimals),
      totalSupply: weiToValue(result[6], decimals),
      reclaimed: result[7],
      totalWithheld: weiToValue(result[8], decimals),
      totalWithheldWithdrawn: weiToValue(result[9], decimals),
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

  public changeWallet = async (params: ChangeWalletParams) => {
    assert.isNonZeroETHAddressHex('wallet', params.wallet);
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    return (await this.contract).changeWallet.sendTransactionAsync(params.wallet, params.txData, params.safetyFactor);
  };

  public getDefaultExcluded = async () => {
    return (await this.contract).getDefaultExcluded.callAsync();
  };

  public createCheckpoint = async (params: TxParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Operator), 'Caller is not allowed');
    return (await this.contract).createCheckpoint.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public setDefaultExcluded = async (params: SetDefaultExcludedParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
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
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.assert(params.investors.length === params.withholding.length, 'Mismatched input lengths');
    params.withholding.forEach(withholding => assert.isPercentage('withholding tax', withholding));
    return (await this.contract).setWithholding.sendTransactionAsync(
      params.investors,
      valueArrayToWeiArray(params.withholding, PERCENTAGE_DECIMALS),
      params.txData,
      params.safetyFactor,
    );
  };

  public setWithholdingFixed = async (params: SetWithholdingFixedParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.isPercentage('withholding tax', params.withholding);
    return (await this.contract).setWithholdingFixed.sendTransactionAsync(
      params.investors,
      valueToWei(params.withholding, PERCENTAGE_DECIMALS),
      params.txData,
      params.safetyFactor,
    );
  };

  public pushDividendPaymentToAddresses = async (params: PushDividendPaymentToAddressesParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Operator), 'Caller is not allowed');
    params.payees.forEach(address => assert.isNonZeroETHAddressHex('payees', address));
    await this.checkValidDividend(params.dividendIndex);
    return (await this.contract).pushDividendPaymentToAddresses.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.payees,
      params.txData,
      params.safetyFactor,
    );
  };

  public pushDividendPayment = async (params: PushDividendPaymentParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Operator), 'Caller is not allowed');
    await this.checkValidDividend(params.dividendIndex);
    return (await this.contract).pushDividendPayment.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      dateToBigNumber(params.start),
      numberToBigNumber(params.iterations),
      params.txData,
      params.safetyFactor,
    );
  };

  public pullDividendPayment = async (params: DividendIndexTxParams) => {
    await this.checkValidDividend(params.dividendIndex);
    assert.assert(!(await this.paused()), 'Contract currently paused');
    const investor = await this.getCallerAddress(params.txData);
    const isClaimed = await (await this.contract).isClaimed.callAsync(
      investor,
      numberToBigNumber(params.dividendIndex),
    );
    assert.assert(!isClaimed, `${investor} has already claimed this dividend`);
    const isExcluded = await (await this.contract).isExcluded.callAsync(
      investor,
      numberToBigNumber(params.dividendIndex),
    );
    assert.assert(!isExcluded, `${investor} is excluded from dividend`);
    return (await this.contract).pullDividendPayment.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.txData,
      params.safetyFactor,
    );
  };

  public reclaimDividend = async (params: DividendIndexTxParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Operator), 'Caller is not allowed');
    assert.assert(await this.isValidDividendIndex(params.dividendIndex), 'Invalid dividend index');
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
    assert.assert(await this.isValidDividendIndex(params.dividendIndex), 'Invalid dividend index');
    const result = await (await this.contract).calculateDividend.callAsync(
      numberToBigNumber(params.dividendIndex),
      params.payee,
    );
    const decimals = await this.getDecimals(params.dividendIndex);
    const typedResult: CalculateDividendResult = {
      claim: weiToValue(result[0], decimals),
      withheld: weiToValue(result[1], decimals),
    };
    return typedResult;
  };

  public getDividendIndex = async (params: CheckpointIdParams) => {
    return (await this.contract).getDividendIndex.callAsync(numberToBigNumber(params.checkpointId));
  };

  public withdrawWithholding = async (params: DividendIndexTxParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Operator), 'Caller is not allowed');
    assert.assert(await this.isValidDividendIndex(params.dividendIndex), 'Invalid dividend index');
    return (await this.contract).withdrawWithholding.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.txData,
      params.safetyFactor,
    );
  };

  public updateDividendDates = async (params: UpdateDividendDatesParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    assert.assert(await this.isValidDividendIndex(params.dividendIndex), 'Invalid dividend index');
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
    const typedResult: Promise<DividendData>[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      typedResult.push(this.pushDividendsData(result, i));
    }
    return Promise.all(typedResult);
  };

  private pushDividendsData = async (
    result: [BigNumber[], BigNumber[], BigNumber[], BigNumber[], BigNumber[], string[]],
    i: number,
  ): Promise<DividendData> => {
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return {
      created: bigNumberToDate(result[0][i]),
      maturity: bigNumberToDate(result[1][i]),
      expiry: bigNumberToDate(result[2][i]),
      amount: weiToValue(result[3][i], decimals),
      claimedAmount: weiToValue(result[4][i], decimals),
      name: bytes32ToString(result[5][i]),
    };
  };

  public getDividendData = async (params: DividendIndexParams) => {
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const result = await (await this.contract).getDividendData.callAsync(numberToBigNumber(params.dividendIndex));
    const typedResult: DividendData = {
      created: bigNumberToDate(result[0]),
      maturity: bigNumberToDate(result[1]),
      expiry: bigNumberToDate(result[2]),
      amount: weiToValue(result[3], decimals),
      claimedAmount: weiToValue(result[4], decimals),
      name: bytes32ToString(result[5]),
    };
    return typedResult;
  };

  public getDividendProgress = async (params: DividendIndexParams) => {
    assert.assert(await this.isValidDividendIndex(params.dividendIndex), 'Invalid dividend index');
    const result = await (await this.contract).getDividendProgress.callAsync(numberToBigNumber(params.dividendIndex));
    const typedResult: Promise<DividendProgress>[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      typedResult.push(this.pushDividendProgress(result, i, params.dividendIndex));
    }
    return Promise.all(typedResult);
  };

  private pushDividendProgress = async (
    result: [string[], boolean[], boolean[], BigNumber[], BigNumber[], BigNumber[]],
    i: number,
    dividendIndex: number,
  ): Promise<DividendProgress> => {
    const decimals = await this.getDecimals(dividendIndex);
    return {
      investor: result[0][i],
      claimed: result[1][i],
      excluded: result[2][i],
      withheld: weiToValue(result[3][i], decimals),
      amount: weiToValue(result[4][i], decimals),
      balance: weiToValue(result[5][i], decimals),
    };
  };

  public getCheckpointData = async (params: CheckpointIdParams) => {
    const currentCheckpointId = await (await this.securityTokenContract()).currentCheckpointId.callAsync();
    assert.assert(params.checkpointId <= new BigNumber(currentCheckpointId).toNumber(), 'Invalid checkpoint');
    const result = await (await this.contract).getCheckpointData.callAsync(numberToBigNumber(params.checkpointId));
    const typedResult: Promise<CheckpointData>[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      typedResult.push(this.pushCheckpointData(result, i));
    }
    return Promise.all(typedResult);
  };

  private pushCheckpointData = async (
    result: [string[], BigNumber[], BigNumber[]],
    i: number,
  ): Promise<CheckpointData> => {
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return {
      investor: result[0][i],
      balance: weiToValue(result[1][i], decimals),
      withheld: weiToValue(result[2][i], decimals),
    };
  };

  public isClaimed = async (params: InvestorStatus) => {
    assert.isETHAddressHex('investor', params.investor);
    assert.assert(await this.isValidDividendIndex(params.dividendIndex), 'Invalid dividend index');
    return (await this.contract).isClaimed.callAsync(params.investor, numberToBigNumber(params.dividendIndex));
  };

  public isExcluded = async (params: InvestorStatus) => {
    assert.isETHAddressHex('investor', params.investor);
    assert.assert(await this.isValidDividendIndex(params.dividendIndex), 'Invalid dividend index');
    return (await this.contract).isExcluded.callAsync(params.investor, numberToBigNumber(params.dividendIndex));
  };

  private isValidDividendIndex = async (dividendIndex: number): Promise<boolean> => {
    const dividendsData = await (await this.contract).getDividendsData.callAsync();
    return dividendIndex < dividendsData[0].length;
  };

  private checkValidDividend = async (dividendIndex: number) => {
    assert.assert(await this.isValidDividendIndex(dividendIndex), 'Invalid dividend index');
    const dividend = await this.getDividendData({ dividendIndex });
    assert.assert(
      !dividend.claimedAmount.isGreaterThan(0),
      'Dividend claimed amount greater than 0, dividend reclaimed',
    );
    assert.isPastDate(dividend.maturity, 'Dividend maturity in future');
    assert.isFutureDate(dividend.expiry, 'Dividend expiry in past');
  };

  protected checkIfDividendCreationIsValid = async (
    expiry: Date,
    maturity: Date,
    amount: BigNumber,
    name: string,
    token?: string,
    txData?: Partial<TxData>,
    checkpointId?: number,
    excluded: string[] = [],
  ) => {
    excluded.forEach(address => assert.isNonZeroETHAddressHex('Excluded address', address));
    assert.areThereDuplicatedStrings('Excluded addresses', excluded);
    assert.assert(excluded.length <= EXCLUDED_ADDRESS_LIMIT, 'Too many addresses excluded');
    assert.assert(expiry > maturity, 'Expiry before maturity');
    assert.isFutureDate(expiry, 'Expiry in past');
    assert.isBigNumberGreaterThanZero(amount, 'No dividend sent');
    assert.assert(name.length > 0, 'The name can not be empty');

    const stContract = await this.securityTokenContract();

    if (checkpointId) {
      const currentCheckpointId = await stContract.currentCheckpointId.callAsync();
      assert.assert(checkpointId <= currentCheckpointId.toNumber(), 'Invalid checkpoint');
    }

    const callerAddress = await this.getCallerAddress(txData);
    if (token) {
      assert.isNonZeroETHAddressHex('token', token);
      const erc20Detailed = await this.erc20DetailedContract(token);
      const erc20TokenBalance = await erc20Detailed.balanceOf.callAsync(callerAddress);
      const erc20TokenAllowance = await erc20Detailed.allowance.callAsync(callerAddress, await this.address());
      assert.assert(
        erc20TokenAllowance.isGreaterThanOrEqualTo(amount),
        'Your allowance is less than dividend amount',
      );
      assert.assert(
        erc20TokenBalance.isGreaterThanOrEqualTo(amount),
        'Your balance is less than dividend amount',
      );
    } else {
      assert.assert(
        (await this.web3Wrapper.getBalanceInWeiAsync(callerAddress)).isGreaterThanOrEqualTo(amount.valueOf()),
        'Caller Address ETH Balance does not meet amount needed to create dividend',
      );
    }

    let currentSupply: BigNumber;
    let gettingExcludedSupply: Promise<BigNumber>[] = [];

    if (checkpointId) {
      gettingExcludedSupply = excluded.map(excludedAddress =>
        stContract.balanceOfAt.callAsync(excludedAddress, new BigNumber(checkpointId)),
      );
      currentSupply = await stContract.totalSupplyAt.callAsync(new BigNumber(checkpointId));
    } else {
      gettingExcludedSupply = excluded.map(excludedAddress => stContract.balanceOf.callAsync(excludedAddress));
      currentSupply = await stContract.totalSupply.callAsync();
    }

    assert.assert(!currentSupply.isZero(), 'Invalid supply, current supply must be greater than 0');

    // that hardcoded 0 is necessary for the sum function not
    // to return NaN if the excluded addresses array is empty
    const excludedSupplyList = await Promise.all([Promise.resolve(new BigNumber(0))].concat(gettingExcludedSupply));
    const totalExcludedSupply = BigNumber.sum.apply(null, excludedSupplyList);

    assert.assert(
      currentSupply.isGreaterThan(totalExcludedSupply),
      'Invalid supply, current supply must be greater than excluded supply',
    );
  };
}
