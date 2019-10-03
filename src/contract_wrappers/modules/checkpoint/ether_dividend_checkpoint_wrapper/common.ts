import {
  EtherDividendCheckpointContract_3_0_0,
  EtherDividendCheckpointEtherDividendDepositedEventArgs_3_0_0,
  EtherDividendCheckpointEtherDividendClaimedEventArgs_3_0_0,
  EtherDividendCheckpointEtherDividendReclaimedEventArgs_3_0_0,
  EtherDividendCheckpointEtherDividendClaimFailedEventArgs_3_0_0,
  EtherDividendCheckpointEtherDividendWithholdingWithdrawnEventArgs_3_0_0,
  EtherDividendCheckpointSetDefaultExcludedAddressesEventArgs_3_0_0,
  EtherDividendCheckpointSetWithholdingEventArgs_3_0_0,
  EtherDividendCheckpointSetWithholdingFixedEventArgs_3_0_0,
  EtherDividendCheckpointSetWalletEventArgs_3_0_0,
  EtherDividendCheckpointUpdateDividendDatesEventArgs_3_0_0,
  EtherDividendCheckpointPauseEventArgs_3_0_0,
  EtherDividendCheckpointUnpauseEventArgs_3_0_0,
  Web3Wrapper,
  BigNumber,
  PolyResponse,
  LogWithDecodedArgs,
  EtherDividendCheckpointEvents_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import assert from '../../../../utils/assert';
import { DividendCheckpointCommon } from '../dividend_checkpoint_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import {
  TxParams,
  Perm,
  ErrorCode,
  ContractVersion,
  SubscribeAsyncParams,
  EventCallback,
  GetLogsAsyncParams,
  Subscribe,
  GetLogs,
} from '../../../../types';
import { numberToBigNumber, dateToBigNumber, stringToBytes32, valueToWei } from '../../../../utils/convert';
import ContractWrapper from '../../../contract_wrapper';

export namespace EtherDividendCheckpointTransactionParams {
  export interface CreateDividend extends CreateDividendParams {}
  export interface CreateDividendWithCheckpoint extends CreateDividendWithCheckpointParams {}
  export interface CreateDividendWithExclusions extends CreateDividendWithExclusionsParams {}
  export interface CreateDividendWithCheckpointAndExclusions extends CreateDividendWithCheckpointAndExclusionsParams {}
}

interface EtherDividendDepositedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.EtherDividendDeposited;
  callback: EventCallback<EtherDividendCheckpointEtherDividendDepositedEventArgs_3_0_0>;
}

interface GetEtherDividendDepositedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.EtherDividendDeposited;
}

interface EtherDividendClaimedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.EtherDividendClaimed;
  callback: EventCallback<EtherDividendCheckpointEtherDividendClaimedEventArgs_3_0_0>;
}

interface GetEtherDividendClaimedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.EtherDividendClaimed;
}

interface EtherDividendReclaimedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.EtherDividendReclaimed;
  callback: EventCallback<EtherDividendCheckpointEtherDividendReclaimedEventArgs_3_0_0>;
}

interface GetEtherDividendReclaimedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.EtherDividendReclaimed;
}

interface EtherDividendClaimFailedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.EtherDividendClaimFailed;
  callback: EventCallback<EtherDividendCheckpointEtherDividendClaimFailedEventArgs_3_0_0>;
}

interface GetEtherDividendClaimFailedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.EtherDividendClaimFailed;
}

interface EtherDividendWithholdingWithdrawnSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.EtherDividendWithholdingWithdrawn;
  callback: EventCallback<EtherDividendCheckpointEtherDividendWithholdingWithdrawnEventArgs_3_0_0>;
}

interface GetEtherDividendWithholdingWithdrawnLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.EtherDividendWithholdingWithdrawn;
}

interface SetDefaultExcludedAddressesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.SetDefaultExcludedAddresses;
  callback: EventCallback<EtherDividendCheckpointSetDefaultExcludedAddressesEventArgs_3_0_0>;
}

interface GetSetDefaultExcludedAddressesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.SetDefaultExcludedAddresses;
}

interface SetWithholdingSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.SetWithholding;
  callback: EventCallback<EtherDividendCheckpointSetWithholdingEventArgs_3_0_0>;
}

interface GetSetWithholdingLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.SetWithholding;
}

interface SetWithholdingFixedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.SetWithholdingFixed;
  callback: EventCallback<EtherDividendCheckpointSetWithholdingFixedEventArgs_3_0_0>;
}

interface GetSetWithholdingFixedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.SetWithholdingFixed;
}

interface SetWalletSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.SetWallet;
  callback: EventCallback<EtherDividendCheckpointSetWalletEventArgs_3_0_0>;
}

interface GetSetWalletLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.SetWallet;
}

interface UpdateDividendDatesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.UpdateDividendDates;
  callback: EventCallback<EtherDividendCheckpointUpdateDividendDatesEventArgs_3_0_0>;
}

interface GetUpdateDividendDatesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.UpdateDividendDates;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.Pause;
  callback: EventCallback<EtherDividendCheckpointPauseEventArgs_3_0_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.Unpause;
  callback: EventCallback<EtherDividendCheckpointUnpauseEventArgs_3_0_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents_3_0_0.Unpause;
}

export interface EtherDividendCheckpointSubscribeAsyncParams extends Subscribe {
  (params: EtherDividendDepositedSubscribeAsyncParams): Promise<string>;
  (params: EtherDividendClaimedSubscribeAsyncParams): Promise<string>;
  (params: EtherDividendReclaimedSubscribeAsyncParams): Promise<string>;
  (params: EtherDividendClaimFailedSubscribeAsyncParams): Promise<string>;
  (params: EtherDividendWithholdingWithdrawnSubscribeAsyncParams): Promise<string>;
  (params: SetDefaultExcludedAddressesSubscribeAsyncParams): Promise<string>;
  (params: SetWithholdingSubscribeAsyncParams): Promise<string>;
  (params: SetWithholdingFixedSubscribeAsyncParams): Promise<string>;
  (params: SetWalletSubscribeAsyncParams): Promise<string>;
  (params: UpdateDividendDatesSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

export interface GetEtherDividendCheckpointLogsAsyncParams extends GetLogs {
  (params: GetEtherDividendDepositedLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointEtherDividendDepositedEventArgs_3_0_0>[]
  >;
  (params: GetEtherDividendClaimedLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointEtherDividendClaimedEventArgs_3_0_0>[]
  >;
  (params: GetEtherDividendReclaimedLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointEtherDividendReclaimedEventArgs_3_0_0>[]
  >;
  (params: GetEtherDividendClaimFailedLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointEtherDividendClaimFailedEventArgs_3_0_0>[]
  >;
  (params: GetEtherDividendWithholdingWithdrawnLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointEtherDividendWithholdingWithdrawnEventArgs_3_0_0>[]
  >;
  (params: GetSetDefaultExcludedAddressesLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointSetDefaultExcludedAddressesEventArgs_3_0_0>[]
  >;
  (params: GetSetWithholdingLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointSetWithholdingEventArgs_3_0_0>[]
  >;
  (params: GetSetWithholdingFixedLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointSetWithholdingFixedEventArgs_3_0_0>[]
  >;
  (params: GetSetWalletLogsAsyncParams): Promise<LogWithDecodedArgs<EtherDividendCheckpointSetWalletEventArgs_3_0_0>[]>;
  (params: GetUpdateDividendDatesLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointUpdateDividendDatesEventArgs_3_0_0>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<EtherDividendCheckpointPauseEventArgs_3_0_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<EtherDividendCheckpointUnpauseEventArgs_3_0_0>[]>;
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
export default abstract class EtherDividendCheckpointCommon extends DividendCheckpointCommon {
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

export function isEtherDividendCheckpoint(wrapper: ContractWrapper): wrapper is EtherDividendCheckpointCommon {
  return wrapper instanceof EtherDividendCheckpointCommon;
}
