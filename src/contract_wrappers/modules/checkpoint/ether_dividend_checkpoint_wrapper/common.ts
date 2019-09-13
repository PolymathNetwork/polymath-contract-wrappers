import {
  EtherDividendCheckpointContract_3_0_0,
  Web3Wrapper,
  BigNumber,
  PolyResponse,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../../utils/assert';
import { DividendCheckpointCommon } from "../dividend_checkpoint_wrapper";
import ContractFactory from '../../../../factories/contractFactory';
import {
  TxParams,
  Perm,
  ErrorCode,
  ContractVersion,
} from '../../../../types';
import { numberToBigNumber, dateToBigNumber, stringToBytes32, valueToWei } from '../../../../utils/convert';

export namespace EtherDividendCheckpointTransactionParams {
  export interface CreateDividend extends CreateDividendParams {}
  export interface CreateDividendWithCheckpoint extends CreateDividendWithCheckpointParams {}
  export interface CreateDividendWithExclusions extends CreateDividendWithExclusionsParams {}
  export interface CreateDividendWithCheckpointAndExclusions extends CreateDividendWithCheckpointAndExclusionsParams {}
}

/**
 * @param maturity Time from which dividend can be paid
 * @param expiry Time until dividend can no longer be paid, and can be reclaimed by issuer
 * @param name Name/title for identification
 * @param value Value of ether to contribute towards dividend
 */
interface CreateDividendParams extends TxParams {
  maturity: Date;
  expiry: Date;
  name: string;
  value: BigNumber;
}

/**
 * @param checkpointId The identifier for the checkpoint
 */
interface CreateDividendWithCheckpointParams extends CreateDividendParams {
  checkpointId: number;
}

/**
 * @param checkpointId The identifier for the checkpoint
 */
interface CreateDividendWithExclusionsParams extends CreateDividendParams {
  excluded: string[];
}

/**
 * @param checkpointId The identifier for the checkpoint
 */
interface CreateDividendWithCheckpointAndExclusionsParams extends CreateDividendWithExclusionsParams {
  checkpointId: number;
}

/**
 * This class includes the functionality related to interacting with the EtherDividendCheckpoint contract.
 */
export default class EtherDividendCheckpointWrapper extends DividendCheckpointCommon {
  public contract: Promise<EtherDividendCheckpointContract_3_0_0>;
  
  public contractVersion = ContractVersion.V3_0_0;

  public getDecimals = async (): Promise<BigNumber> => {
    return new BigNumber(18);
  };

  /**
   * Instantiate EtherDividendCheckpointWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<EtherDividendCheckpointContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Creates a dividend and checkpoint for the dividend
   */
  public createDividend = async (params: CreateDividendParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    const txPayableData = {
      ...params.txData,
      value: valueToWei(params.value, await this.getDecimals()),
    };
    await this.checkIfDividendCreationIsValid(
      params.expiry,
      params.maturity,
      params.value,
      params.name,
      undefined,
      txPayableData,
    );
    return (await this.contract).createDividend.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      stringToBytes32(params.name),
      txPayableData,
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
    const txPayableData = {
      ...params.txData,
      value: valueToWei(params.value, await this.getDecimals()),
    };
    await this.checkIfDividendCreationIsValid(
      params.expiry,
      params.maturity,
      params.value,
      params.name,
      undefined,
      txPayableData,
      params.checkpointId,
    );
    return (await this.contract).createDividendWithCheckpoint.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      numberToBigNumber(params.checkpointId),
      stringToBytes32(params.name),
      txPayableData,
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
    const txPayableData = {
      ...params.txData,
      value: valueToWei(params.value, await this.getDecimals()),
    };
    await this.checkIfDividendCreationIsValid(
      params.expiry,
      params.maturity,
      params.value,
      params.name,
      undefined,
      txPayableData,
      undefined,
      params.excluded,
    );
    return (await this.contract).createDividendWithExclusions.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.excluded,
      stringToBytes32(params.name),
      txPayableData,
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
    const txPayableData = {
      ...params.txData,
      value: valueToWei(params.value, await this.getDecimals()),
    };
    await this.checkIfDividendCreationIsValid(
      params.expiry,
      params.maturity,
      params.value,
      params.name,
      undefined,
      txPayableData,
      params.checkpointId,
      params.excluded,
    );
    return (await this.contract).createDividendWithCheckpointAndExclusions.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      numberToBigNumber(params.checkpointId),
      params.excluded,
      stringToBytes32(params.name),
      txPayableData,
      params.safetyFactor,
    );
  };
}
