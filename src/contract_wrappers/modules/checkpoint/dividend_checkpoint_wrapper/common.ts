import { BigNumber, TxData, ERC20DetailedContract_3_0_0, PolyResponse } from '@polymathnetwork/abi-wrappers';
import { ModuleCommon } from '../../module_wrapper';
import assert from '../../../../utils/assert';
import { TxParams, Perm, PERCENTAGE_DECIMALS, ErrorCode, DividendCheckpointBaseContract } from '../../../../types';
import {
  numberToBigNumber,
  dateToBigNumber,
  bigNumberToDate,
  bytes32ToString,
  valueToWei,
  valueArrayToWeiArray,
  weiToValue,
} from '../../../../utils/convert';

const EXCLUDED_ADDRESS_LIMIT = 150;

/**
 * @param dividendIndex Index of the dividend
 */
interface DividendIndexParams {
  dividendIndex: number;
}

/**
 * @param checkpointId Checkpoint identifier
 */
interface CheckpointIdParams {
  checkpointId: number;
}

/**
 * @param investor Address of the investor
 */
interface InvestorParams {
  investor: string;
}

/**
 * @param dividendIndex Dividend to calculate
 * @param payee Affected investor address
 */
interface CalculateDividendParams {
  dividendIndex: number;
  payee: string;
}

/**
 * @param investor Investor address to check
 * @param dividendIndex Dividend to withdraw from
 */
interface InvestorStatus {
  investor: string;
  dividendIndex: number;
}

/**
 * @param wallet Ethereum account address to receive reclaimed dividends and tax
 */
export interface ChangeWalletParams extends TxParams {
  wallet: string;
}

/**
 * @param excluded Addresses of investors
 */
export interface SetDefaultExcludedParams extends TxParams {
  excluded: string[];
}

/**
 * @param investors Addresses of investors
 * @param withholding Withholding tax array for individual investors
 */
export interface SetWithholdingParams extends TxParams {
  investors: string[];
  withholding: BigNumber[];
}

/**
 * @param investors Addresses of investor
 * @param withholding Single withholding tax for all investors
 */
export interface SetWithholdingFixedParams extends TxParams {
  investors: string[];
  withholding: BigNumber;
}

/**
 * @param dividendIndex Dividend index to push
 * @param payees Addresses to which to push the dividend
 */
export interface PushDividendPaymentToAddressesParams extends TxParams {
  dividendIndex: number;
  payees: string[];
}

/**
 * @param dividendIndex Dividend to push
 * @param start Index in investor list at which to start pushing dividends
 * @param end Index in investor list at which to stop pushing dividends
 */
export interface PushDividendPaymentParams extends TxParams {
  dividendIndex: number;
  start: number;
  end: number;
}

/**
 * @param dividendIndex Dividend index to use
 */
export interface DividendIndexTxParams extends TxParams {
  dividendIndex: number;
}

/**
 * @param dividendIndex Dividend to withdraw from
 * @param maturity Updated maturity date
 * @param expiry Updated expiry date
 */
export interface UpdateDividendDatesParams extends TxParams {
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
 * This class includes the functionality related to interacting with all DividendCheckpoint contracts.
 */
export default abstract class DividendCheckpointCommon extends ModuleCommon {
  public abstract contract: Promise<DividendCheckpointBaseContract>;

  public erc20DetailedContract = async (address: string): Promise<ERC20DetailedContract_3_0_0> => {
    return this.contractFactory.getERC20DetailedContract(address);
  };

  public abstract getDecimals(dividendIndex: number): Promise<BigNumber>;

  /**
   *  wallet
   */
  public wallet = async (): Promise<string> => {
    return (await this.contract).wallet.callAsync();
  };

  /**
   *  get the treasury wallet
   */
  public getTreasuryWallet = async (): Promise<string> => {
    return (await this.contract).getTreasuryWallet.callAsync();
  };

  /**
   *  check dividend information at a specific dividend index
   *  @return checkpointId, created, maturity, expiry, token amount,
   *  claimedAmount, totalSupply, reclaimed tokens, total withheld,
   *  total withdrawn and name of dividend
   */
  public dividends = async (params: DividendIndexParams): Promise<Dividend> => {
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

  /**
   *  check excluded address at a specific dividend index
   *  @return excluded address
   */
  public excluded = async (params: DividendIndexParams): Promise<string> => {
    return (await this.contract).excluded.callAsync(numberToBigNumber(params.dividendIndex));
  };

  /**
   *  check withholding tax for an investor
   *  @return amount of withholding tax
   */
  public withholdingTax = async (params: InvestorParams): Promise<BigNumber> => {
    assert.isETHAddressHex('investor', params.investor);
    return (await this.contract).withholdingTax.callAsync(params.investor);
  };

  /**
   * Function used to change wallet address
   */
  public changeWallet = async (params: ChangeWalletParams): Promise<PolyResponse> => {
    assert.isNonZeroETHAddressHex('wallet', params.wallet);
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    return (await this.contract).changeWallet.sendTransactionAsync(params.wallet, params.txData, params.safetyFactor);
  };

  /**
   * Return the default excluded addresses
   * @return List of excluded addresses
   */
  public getDefaultExcluded = async (): Promise<string[]> => {
    return (await this.contract).getDefaultExcluded.callAsync();
  };

  /**
   * Creates a checkpoint on the security token
   */
  public createCheckpoint = async (params: TxParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Operator),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    return (await this.contract).createCheckpoint.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Function to clear and set list of excluded addresses used for future dividends
   */
  public setDefaultExcluded = async (params: SetDefaultExcludedParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.assert(
      params.excluded.length <= EXCLUDED_ADDRESS_LIMIT,
      ErrorCode.InvalidData,
      'Too many excluded addresses',
    );
    params.excluded.forEach(address => assert.isNonZeroETHAddressHex('excluded', address));
    assert.areThereDuplicatedStrings('excluded', params.excluded);
    return (await this.contract).setDefaultExcluded.sendTransactionAsync(
      params.excluded,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Function to set withholding tax rates for investors
   */
  public setWithholding = async (params: SetWithholdingParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.assert(
      params.investors.length === params.withholding.length,
      ErrorCode.InvalidData,
      'Mismatched input lengths',
    );
    params.withholding.forEach(withholding => assert.isPercentage('withholding tax', withholding));
    return (await this.contract).setWithholding.sendTransactionAsync(
      params.investors,
      valueArrayToWeiArray(params.withholding, PERCENTAGE_DECIMALS),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Function to set withholding tax rates for investors
   */
  public setWithholdingFixed = async (params: SetWithholdingFixedParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.isPercentage('withholding tax', params.withholding);
    return (await this.contract).setWithholdingFixed.sendTransactionAsync(
      params.investors,
      valueToWei(params.withholding, PERCENTAGE_DECIMALS),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Issuer can push dividends to provided addresses
   */
  public pushDividendPaymentToAddresses = async (
    params: PushDividendPaymentToAddressesParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Operator),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    params.payees.forEach(address => assert.isNonZeroETHAddressHex('payees', address));
    await this.checkValidDividend(params.dividendIndex);
    return (await this.contract).pushDividendPaymentToAddresses.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.payees,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Issuer can push dividends using the investor list from the security token
   */
  public pushDividendPayment = async (params: PushDividendPaymentParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Operator),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.checkValidDividend(params.dividendIndex);
    return (await this.contract).pushDividendPayment.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      numberToBigNumber(params.start),
      numberToBigNumber(params.end),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Investors can pull their own dividends
   */
  public pullDividendPayment = async (params: DividendIndexTxParams): Promise<PolyResponse> => {
    await this.checkValidDividend(params.dividendIndex);
    assert.assert(!(await this.paused()), ErrorCode.PreconditionRequired, 'Contract currently paused');
    const investor = await this.getCallerAddress(params.txData);
    const isClaimed = await (await this.contract).isClaimed.callAsync(
      investor,
      numberToBigNumber(params.dividendIndex),
    );
    assert.assert(!isClaimed, ErrorCode.AlreadyClaimed, `${investor} has already claimed this dividend`);
    const isExcluded = await (await this.contract).isExcluded.callAsync(
      investor,
      numberToBigNumber(params.dividendIndex),
    );
    assert.assert(!isExcluded, ErrorCode.AddressExcluded, `${investor} is excluded from dividend`);
    return (await this.contract).pullDividendPayment.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Issuer can reclaim remaining unclaimed dividend amounts, for expired dividends
   */
  public reclaimDividend = async (params: DividendIndexTxParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Operator),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.assert(
      await this.isValidDividendIndex(params.dividendIndex),
      ErrorCode.InvalidData,
      'Invalid dividend index',
    );
    const dividend = await this.dividends(params);
    assert.isPastDate(dividend.expiry, 'Dividend expiry is in the future');
    assert.assert(!dividend.reclaimed, ErrorCode.AlreadyClaimed, 'Dividend is already claimed');
    return (await this.contract).reclaimDividend.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Calculate amount of dividends claimable
   * @return claim, withheld amounts
   */
  public calculateDividend = async (params: CalculateDividendParams): Promise<CalculateDividendResult> => {
    assert.assert(
      await this.isValidDividendIndex(params.dividendIndex),
      ErrorCode.InvalidDividend,
      'Invalid dividend index',
    );
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

  /**
   * Get the index according to the checkpoint id
   * @return dividend index
   */
  public getDividendIndex = async (params: CheckpointIdParams): Promise<number[]> => {
    const dividendIndex = await (await this.contract).getDividendIndex.callAsync(
      numberToBigNumber(params.checkpointId),
    );
    return dividendIndex.map(index => {
      return index.toNumber();
    });
  };

  /**
   * Allows issuer to withdraw withheld tax
   */
  public withdrawWithholding = async (params: DividendIndexTxParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Operator),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.assert(
      await this.isValidDividendIndex(params.dividendIndex),
      ErrorCode.InvalidDividend,
      'Invalid dividend index',
    );
    return (await this.contract).withdrawWithholding.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Allows issuer to change maturity / expiry dates for dividends
   * NB - setting the maturity of a currently matured dividend to a future date
   * will effectively refreeze claims on that dividend until the new maturity date passes
   * @ dev NB - setting the expiry date to a past date will mean no more payments can be pulled
   * or pushed out of a dividend
   */
  public updateDividendDates = async (params: UpdateDividendDatesParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    assert.assert(
      await this.isValidDividendIndex(params.dividendIndex),
      ErrorCode.InvalidDividend,
      'Invalid dividend index',
    );
    assert.assert(params.expiry > params.maturity, ErrorCode.TooLate, 'Expiry before maturity');
    return (await this.contract).updateDividendDates.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Get static dividend data
   * @return timestamp of dividends creation, timestamp of dividends maturity, timestamp of dividends expiry, amount
   * of dividends, claimed amount of dividends, name of dividends
   */
  public getDividendsData = async (): Promise<DividendData[]> => {
    const result = await (await this.contract).getDividendsData.callAsync();
    const typedResult: Promise<DividendData>[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      typedResult.push(this.pushDividendsData(result, i));
    }
    return Promise.all(typedResult);
  };

  public pushDividendsData = async (
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

  /**
   * Get static dividend data
   * @return timestamp of dividend creation, timestamp of dividend maturity, timestamp of dividend expiry, amount of
   * dividend, claimed amount of dividend, name of dividend
   */
  public getDividendData = async (params: DividendIndexParams): Promise<DividendData> => {
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

  /**
   * Retrieves list of investors, their claim status and whether they are excluded
   * @return list of investors, whether investor has claimed, whether investor is excluded, amount of withheld tax
   * (estimate if not claimed), amount of claim (estimate if not claimeed), investor balance
   */
  public getDividendProgress = async (params: DividendIndexParams): Promise<DividendProgress[]> => {
    assert.assert(
      await this.isValidDividendIndex(params.dividendIndex),
      ErrorCode.InvalidDividend,
      'Invalid dividend index',
    );
    const result = await (await this.contract).getDividendProgress.callAsync(numberToBigNumber(params.dividendIndex));
    const typedResult: Promise<DividendProgress>[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      typedResult.push(this.pushDividendProgress(result, i, params.dividendIndex));
    }
    return Promise.all(typedResult);
  };

  public pushDividendProgress = async (
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

  /**
   * Retrieves list of investors, their balances, and their current withholding tax percentage
   * @return list of investors, investor balances, investor withheld percentages
   */
  public getCheckpointData = async (params: CheckpointIdParams): Promise<CheckpointData[]> => {
    const currentCheckpointId = await (await this.securityTokenContract()).currentCheckpointId.callAsync();
    assert.assert(
      params.checkpointId <= new BigNumber(currentCheckpointId).toNumber(),
      ErrorCode.InvalidCheckpoint,
      'Invalid checkpoint',
    );
    const result = await (await this.contract).getCheckpointData.callAsync(numberToBigNumber(params.checkpointId));
    const typedResult: Promise<CheckpointData>[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      typedResult.push(this.pushCheckpointData(result, i));
    }
    return Promise.all(typedResult);
  };

  public pushCheckpointData = async (
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

  /**
   * Checks whether an address has claimed a dividend
   * @return bool whether the address has claimed
   */
  public isClaimed = async (params: InvestorStatus): Promise<boolean> => {
    assert.isETHAddressHex('investor', params.investor);
    assert.assert(
      await this.isValidDividendIndex(params.dividendIndex),
      ErrorCode.InvalidDividend,
      'Invalid dividend index',
    );
    return (await this.contract).isClaimed.callAsync(params.investor, numberToBigNumber(params.dividendIndex));
  };

  /**
   * Checks whether an address is excluded from claiming a dividend
   * @return bool whether the address is excluded
   */
  public isExcluded = async (params: InvestorStatus): Promise<boolean> => {
    assert.isETHAddressHex('investor', params.investor);
    assert.assert(
      await this.isValidDividendIndex(params.dividendIndex),
      ErrorCode.InvalidDividend,
      'Invalid dividend index',
    );
    return (await this.contract).isExcluded.callAsync(params.investor, numberToBigNumber(params.dividendIndex));
  };

  public isValidDividendIndex = async (dividendIndex: number): Promise<boolean> => {
    const dividendsData = await (await this.contract).getDividendsData.callAsync();
    return dividendIndex < dividendsData[0].length;
  };

  public checkValidDividend = async (dividendIndex: number) => {
    assert.assert(await this.isValidDividendIndex(dividendIndex), ErrorCode.InvalidDividend, 'Invalid dividend index');
    const dividend = await this.getDividendData({ dividendIndex });
    assert.assert(
      !dividend.claimedAmount.isGreaterThan(0),
      ErrorCode.InvalidData,
      'Dividend claimed amount greater than 0, dividend reclaimed',
    );
    assert.isPastDate(dividend.maturity, 'Dividend maturity in future');
    assert.isFutureDate(dividend.expiry, 'Dividend expiry in past');
  };

  public checkIfDividendCreationIsValid = async (
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
    assert.assert(excluded.length <= EXCLUDED_ADDRESS_LIMIT, ErrorCode.ArrayTooLarge, 'Too many addresses excluded');
    assert.assert(expiry > maturity, ErrorCode.TooLate, 'Expiry before maturity');
    assert.isFutureDate(expiry, 'Expiry in past');
    assert.isBigNumberGreaterThanZero(amount, 'No dividend sent');
    assert.assert(name.length > 0, ErrorCode.InvalidData, 'The name can not be empty');

    const stContract = await this.securityTokenContract();

    if (checkpointId) {
      const currentCheckpointId = await stContract.currentCheckpointId.callAsync();
      assert.assert(checkpointId <= currentCheckpointId.toNumber(), ErrorCode.InvalidCheckpoint, 'Invalid checkpoint');
    }

    const callerAddress = await this.getCallerAddress(txData);
    if (token) {
      assert.isNonZeroETHAddressHex('token', token);
      const erc20Detailed = await this.erc20DetailedContract(token);
      const erc20TokenBalance = await erc20Detailed.balanceOf.callAsync(callerAddress);
      const erc20TokenAllowance = await erc20Detailed.allowance.callAsync(callerAddress, await this.address());
      assert.assert(
        erc20TokenAllowance.isGreaterThanOrEqualTo(amount),
        ErrorCode.InsufficientAllowance,
        'Your allowance is less than dividend amount',
      );
      assert.assert(
        erc20TokenBalance.isGreaterThanOrEqualTo(amount),
        ErrorCode.InsufficientBalance,
        'Your balance is less than dividend amount',
      );
    } else {
      assert.assert(
        (await this.web3Wrapper.getBalanceInWeiAsync(callerAddress)).isGreaterThanOrEqualTo(amount.valueOf()),
        ErrorCode.PreconditionRequired,
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

    assert.assert(
      !currentSupply.isZero(),
      ErrorCode.InvalidData,
      'Invalid supply, current supply must be greater than 0',
    );

    // that hardcoded 0 is necessary for the sum function not
    // to return NaN if the excluded addresses array is empty
    const excludedSupplyList = await Promise.all([Promise.resolve(new BigNumber(0))].concat(gettingExcludedSupply));
    const totalExcludedSupply = BigNumber.sum.apply(null, excludedSupplyList);

    assert.assert(
      currentSupply.isGreaterThan(totalExcludedSupply),
      ErrorCode.InvalidData,
      'Invalid supply, current supply must be greater than excluded supply',
    );
  };
}
