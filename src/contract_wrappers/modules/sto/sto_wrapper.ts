import { TxParams, STOBaseContract, FundRaiseType, FULL_DECIMALS, ErrorCode } from '../../../types';
import ModuleWrapper from '../module_wrapper';
import assert from '../../../utils/assert';
import { weiToValue } from '../../../utils/convert';

interface FundRaiseTypesParams {
  type: FundRaiseType;
}

/**
 * This class includes the functionality related to interacting with the all STOs contracts.
 */
export default abstract class STOWrapper extends ModuleWrapper {
  protected abstract contract: Promise<STOBaseContract>;

  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  public securityToken = async () => {
    return (await this.contract).securityToken.callAsync();
  };

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
    return weiToValue(await (await this.contract).fundsRaised.callAsync(params.type), FULL_DECIMALS);
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
    return weiToValue(
      await (await this.contract).totalTokensSold.callAsync(),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };

  public getRaised = async (params: FundRaiseTypesParams) => {
    return weiToValue(await (await this.contract).getRaised.callAsync(params.type), FULL_DECIMALS);
  };

  public pause = async (params: TxParams) => {
    assert.assert(!(await this.paused()), ErrorCode.PreconditionRequired, 'Contract already paused');
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public unpause = async (params: TxParams) => {
    assert.assert(await this.paused(), ErrorCode.ContractPaused, 'Contract is not paused');
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };
}
