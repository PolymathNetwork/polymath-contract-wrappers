import {
  ERC20DividendCheckpointContract_3_0_0,
  ERC20DetailedContract_3_0_0,
  BigNumber,
  Web3Wrapper,
  PolyResponse,
} from '@polymathnetwork/abi-wrappers';
import assert from '../../../../utils/assert';
import { DividendCheckpointCommon } from "../dividend_checkpoint_wrapper";
import ContractFactory from '../../../../factories/contractFactory';
import {
  TxParams,
  Perm,
  ErrorCode,
} from '../../../../types';
import { numberToBigNumber, dateToBigNumber, stringToBytes32, valueToWei } from '../../../../utils/convert';
import ContractWrapper from '../../../contract_wrapper';

export namespace ERC20DividendCheckpointTransactionParams {
  export interface CreateDividend extends CreateDividendParams {}
  export interface CreateDividendWithCheckpoint extends CreateDividendWithCheckpointParams {}
  export interface CreateDividendWithExclusions extends CreateDividendWithExclusionsParams {}
  export interface CreateDividendWithCheckpointAndExclusions extends CreateDividendWithCheckpointAndExclusionsParams {}
}

/**
 * @param dividendIndex Index of the dividend
 */
interface DividendIndexParams {
  dividendIndex: number;
}

/**
 * @param maturity Time from which dividend can be paid
 * @param expiry Time until dividend can no longer be paid, and can be reclaimed by issuer
 * @param token Address of ERC20 token in which dividend is to be denominated
 * @param amount Amount of specified token for dividend
 * @param name Name/Title for identification
 */
interface CreateDividendParams extends TxParams {
  maturity: Date;
  expiry: Date;
  token: string;
  amount: BigNumber;
  name: string;
}

/**
 * @param checkpointId Checkpoint id from which to create dividends
 */
interface CreateDividendWithCheckpointParams extends CreateDividendParams {
  checkpointId: number;
}

/**
 * @param excluded List of addresses to exclude
 */
interface CreateDividendWithExclusionsParams extends CreateDividendParams {
  excluded: string[];
}

/**
 * @param checkpointId Checkpoint id from which to create dividends
 * @param excluded List of addresses to exclude
 */
interface CreateDividendWithCheckpointAndExclusionsParams extends CreateDividendParams {
  checkpointId: number;
  excluded: string[];
}

/**
 * This class includes the functionality related to interacting with the ERC20DividendCheckpoint contract.
 */
export default abstract class ERC20DividendCheckpointCommon extends DividendCheckpointCommon {
  public contract: Promise<ERC20DividendCheckpointContract_3_0_0>;

  public erc20DetailedContract = async (address: string): Promise<ERC20DetailedContract_3_0_0> => {
    return this.contractFactory.getERC20DetailedContract(address);
  };

  public getDecimals = async (dividendIndex: number): Promise<BigNumber> => {
    const token = await this.dividendTokens({
      dividendIndex,
    });
    const decimals = await (await this.erc20DetailedContract(token)).decimals.callAsync();
    return decimals;
  };

  /**
   * Instantiate ERC20DividendCheckpointWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<ERC20DividendCheckpointContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Mapping to token address for each dividend
   */
  public dividendTokens = async (params: DividendIndexParams): Promise<string> => {
    return (await this.contract).dividendTokens.callAsync(numberToBigNumber(params.dividendIndex));
  };

  /**
   * Creates a dividend and checkpoint for the dividend
   */
  public createDividend = async (params: CreateDividendParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.checkIfDividendCreationIsValid(
      params.expiry,
      params.maturity,
      params.amount,
      params.name,
      params.token,
      params.txData,
    );
    const decimals = await (await this.erc20DetailedContract(params.token)).decimals.callAsync();
    return (await this.contract).createDividend.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.token,
      valueToWei(params.amount, decimals),
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Creates a dividend with a provided checkpoint
   */
  public createDividendWithCheckpoint = async (params: CreateDividendWithCheckpointParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.checkIfDividendCreationIsValid(
      params.expiry,
      params.maturity,
      params.amount,
      params.name,
      params.token,
      params.txData,
      params.checkpointId,
    );
    const decimals = await (await this.erc20DetailedContract(params.token)).decimals.callAsync();
    return (await this.contract).createDividendWithCheckpoint.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.token,
      valueToWei(params.amount, decimals),
      numberToBigNumber(params.checkpointId),
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Creates a dividend and checkpoint for the dividend with excluded addresses
   */
  public createDividendWithExclusions = async (params: CreateDividendWithExclusionsParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.checkIfDividendCreationIsValid(
      params.expiry,
      params.maturity,
      params.amount,
      params.name,
      params.token,
      params.txData,
      undefined,
      params.excluded,
    );
    const decimals = await (await this.erc20DetailedContract(params.token)).decimals.callAsync();
    return (await this.contract).createDividendWithExclusions.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.token,
      valueToWei(params.amount, decimals),
      params.excluded,
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Creates a dividend with a provided checkpoint and with excluded addresses
   */
  public createDividendWithCheckpointAndExclusions = async (
    params: CreateDividendWithCheckpointAndExclusionsParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.checkIfDividendCreationIsValid(
      params.expiry,
      params.maturity,
      params.amount,
      params.name,
      params.token,
      params.txData,
      params.checkpointId,
      params.excluded,
    );
    const decimals = await (await this.erc20DetailedContract(params.token)).decimals.callAsync();
    return (await this.contract).createDividendWithCheckpointAndExclusions.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.token,
      valueToWei(params.amount, decimals),
      numberToBigNumber(params.checkpointId),
      params.excluded,
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };
}

export function isERC20DividendCheckpoint(wrapper: ContractWrapper): wrapper is ERC20DividendCheckpointCommon {
  return wrapper instanceof ERC20DividendCheckpointCommon;
};
