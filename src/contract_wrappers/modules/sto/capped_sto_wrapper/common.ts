import {
  CappedSTOContract_3_0_0,
  Web3Wrapper,
  BigNumber,
  CappedSTOContract_3_1_0,
} from '@polymathnetwork/abi-wrappers';
import assert from '../../../../utils/assert';
import { STOCommon } from '../sto_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import {
  TxParams,
  FundRaiseType,
  FULL_DECIMALS,
  ErrorCode,
} from '../../../../types';
import { valueToWei, weiToValue } from '../../../../utils/convert';
import functionsUtils from '../../../../utils/functions_utils';
import ContractWrapper from '../../../contract_wrapper';

export namespace CappedSTOTransactionParams {
  export interface ChangeAllowBeneficialInvestments extends ChangeAllowBeneficialInvestmentsParams {}
  export interface BuyTokens extends BuyTokensParams {}
  export interface BuyTokensWithPoly extends BuyTokensWithPolyParams {}
}

/**
 * @param investorAddress Address of the investor
 */
interface InvestorsParams extends TxParams {
  investorAddress: string;
}

/**
 * @param allowBeneficicalInvestments Boolean to allow or disallow beneficial investments
 */
interface ChangeAllowBeneficialInvestmentsParams extends TxParams {
  allowBeneficialInvestments: boolean;
}

/**
 * @param beneficiary Address performing the token purchase
 * @param value Value of investment
 */
export interface BuyTokensParams extends TxParams {
  beneficiary: string;
  value: BigNumber;
}

/**
 * @param investedPOLY Amount of POLY invested
 */
export interface BuyTokensWithPolyParams extends TxParams {
  investedPOLY: BigNumber;
}

/**
 * This class includes the functionality related to interacting with the CappedSTO contract.
 */
export default abstract class CappedSTOCommon extends STOCommon {
  public contract: Promise<CappedSTOContract_3_0_0 | CappedSTOContract_3_1_0>;

  /**
   * Instantiate CappedSTOCommon
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<CappedSTOContract_3_0_0 | CappedSTOContract_3_1_0>, contractFactory: ContractFactory) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * How many token units a buyer gets (multiplied by 10^18) per wei / base unit of POLY
   * @return rate
   */
  public rate = async (): Promise<BigNumber> => {
    return weiToValue(await (await this.contract).rate.callAsync(), FULL_DECIMALS);
  };

  /**
   * How many token base units this STO will be allowed to sell to investors
   * @return cap amount
   */
  public cap = async (): Promise<BigNumber> => {
    return weiToValue(
      await (await this.contract).cap.callAsync(),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };

  /**
   * Determine whether users can invest on behalf of a beneficiary
   * @return boolean status
   */
  public allowBeneficialInvestments = async (): Promise<boolean> => {
    return (await this.contract).allowBeneficialInvestments.callAsync();
  };

  /**
   * Access mapping of Capped STO investors
   * @return amount of investor investment
   */
  public investors = async (params: InvestorsParams): Promise<BigNumber> => {
    return (await this.contract).investors.callAsync(params.investorAddress);
  };

  /**
   * Function to set allowBeneficialInvestments (allow beneficiary to be different to funder)
   */
  public changeAllowBeneficialInvestments = async (params: ChangeAllowBeneficialInvestmentsParams) => {
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    assert.assert(
      (await this.allowBeneficialInvestments()) !== params.allowBeneficialInvestments,
      ErrorCode.PreconditionRequired,
      'Does not change value',
    );
    return (await this.contract).changeAllowBeneficialInvestments.sendTransactionAsync(
      params.allowBeneficialInvestments,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Low level token purchase
   */
  public buyTokens = async (params: BuyTokensParams) => {
    assert.isNonZeroETHAddressHex('beneficiary', params.beneficiary);
    assert.assert(!(await this.paused()), ErrorCode.ContractPaused, 'Should not be paused');
    assert.isBigNumberGreaterThanZero(params.value, 'Amount invested should not be equal to 0');
    const weiBalance = await this.web3Wrapper.getBalanceInWeiAsync(await this.getCallerAddress(params.txData));
    assert.assert(
      weiBalance.isGreaterThan(valueToWei(params.value, FULL_DECIMALS)),
      ErrorCode.InsufficientBalance,
      'Insufficient ETH funds',
    );
    assert.assert(
      await this.fundRaiseTypes({
        type: FundRaiseType.ETH,
      }),
      ErrorCode.DifferentMode,
      'Mode of investment is not ETH',
    );
    if (await this.allowBeneficialInvestments()) {
      assert.assert(
        functionsUtils.checksumAddressComparision(params.beneficiary, await this.getCallerAddress(params.txData)),
        ErrorCode.Unauthorized,
        'Beneficiary address does not match msg.sender',
      );
    }
    assert.isPastDate(await this.startTime(), 'Offering is not yet started');
    assert.isFutureDate(await this.endTime(), 'Offering is closed');
    const txPayableData = {
      ...params.txData,
      value: valueToWei(params.value, FULL_DECIMALS),
    };
    return (await this.contract).buyTokens.sendTransactionAsync(params.beneficiary, txPayableData, params.safetyFactor);
  };

  /**
   * Low level token purchase for poly
   */
  public buyTokensWithPoly = async (params: BuyTokensWithPolyParams) => {
    assert.isBigNumberGreaterThanZero(params.investedPOLY, 'Amount invested should not be equal to 0');
    assert.assert(!(await this.paused()), ErrorCode.ContractPaused, 'Should not be paused');
    assert.assert(
      await this.fundRaiseTypes({
        type: FundRaiseType.POLY,
      }),
      ErrorCode.DifferentMode,
      'Mode of investment is not POLY',
    );
    const polyTokenBalance = await (await this.polyTokenContract()).balanceOf.callAsync(
      await this.getCallerAddress(params.txData),
    );
    assert.assert(
      polyTokenBalance.isGreaterThanOrEqualTo(valueToWei(params.investedPOLY, FULL_DECIMALS)),
      ErrorCode.InvalidTransfer,
      'Budget less than amount unable to transfer fee',
    );
    assert.isPastDate(await this.startTime(), 'Offering is not yet started');
    assert.isFutureDate(await this.endTime(), 'Offering is closed');
    return (await this.contract).buyTokensWithPoly.sendTransactionAsync(
      valueToWei(params.investedPOLY, FULL_DECIMALS),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Checks whether the cap has been reached.
   * @return bool Whether the cap was reached
   */
  public capReached = async (): Promise<boolean> => {
    return (await this.contract).capReached.callAsync();
  };

  /**
   * Return the total no. of tokens sold
   */
  public getTokensSold = async (): Promise<BigNumber> => {
    return weiToValue(
      await (await this.contract).getTokensSold.callAsync(),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };
}

export function isCappedSTO(wrapper: ContractWrapper): wrapper is CappedSTOCommon {
  return wrapper instanceof CappedSTOCommon;
};
