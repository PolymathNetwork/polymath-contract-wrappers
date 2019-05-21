import {
  EtherDividendCheckpointContract,
  EtherDividendCheckpointEventArgs,
  EtherDividendCheckpointEvents,
  EtherDividendCheckpointEtherDividendDepositedEventArgs,
  EtherDividendCheckpointEtherDividendClaimedEventArgs,
  EtherDividendCheckpointEtherDividendReclaimedEventArgs,
  EtherDividendCheckpointEtherDividendClaimFailedEventArgs,
  EtherDividendCheckpointEtherDividendWithholdingWithdrawnEventArgs,
  EtherDividendCheckpointSetDefaultExcludedAddressesEventArgs,
  EtherDividendCheckpointSetWithholdingEventArgs,
  EtherDividendCheckpointSetWithholdingFixedEventArgs,
  EtherDividendCheckpointSetWalletEventArgs,
  EtherDividendCheckpointUpdateDividendDatesEventArgs,
  EtherDividendCheckpointPauseEventArgs,
  EtherDividendCheckpointUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { EtherDividendCheckpoint } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import DividendCheckpointWrapper from './dividend_checkpoint_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Subscribe,
  GetLogs,
  Perms,
} from '../../../types';
import { numberToBigNumber, dateToBigNumber, stringToBytes32 } from '../../../utils/convert';

const EXCLUDED_ADDRESS_LIMIT = 150;

interface EtherDividendDepositedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents.EtherDividendDeposited;
  callback: EventCallback<EtherDividendCheckpointEtherDividendDepositedEventArgs>;
}

interface GetEtherDividendDepositedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents.EtherDividendDeposited;
}

interface EtherDividendClaimedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents.EtherDividendClaimed;
  callback: EventCallback<EtherDividendCheckpointEtherDividendClaimedEventArgs>;
}

interface GetEtherDividendClaimedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents.EtherDividendClaimed;
}

interface EtherDividendReclaimedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents.EtherDividendReclaimed;
  callback: EventCallback<EtherDividendCheckpointEtherDividendReclaimedEventArgs>;
}

interface GetEtherDividendReclaimedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents.EtherDividendReclaimed;
}

interface EtherDividendClaimFailedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents.EtherDividendClaimFailed;
  callback: EventCallback<EtherDividendCheckpointEtherDividendClaimFailedEventArgs>;
}

interface GetEtherDividendClaimFailedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents.EtherDividendClaimFailed;
}

interface EtherDividendWithholdingWithdrawnSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents.EtherDividendWithholdingWithdrawn;
  callback: EventCallback<EtherDividendCheckpointEtherDividendWithholdingWithdrawnEventArgs>;
}

interface GetEtherDividendWithholdingWithdrawnLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents.EtherDividendWithholdingWithdrawn;
}

interface SetDefaultExcludedAddressesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents.SetDefaultExcludedAddresses;
  callback: EventCallback<EtherDividendCheckpointSetDefaultExcludedAddressesEventArgs>;
}

interface GetSetDefaultExcludedAddressesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents.SetDefaultExcludedAddresses;
}

interface SetWithholdingSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents.SetWithholding;
  callback: EventCallback<EtherDividendCheckpointSetWithholdingEventArgs>;
}

interface GetSetWithholdingLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents.SetWithholding;
}

interface SetWithholdingFixedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents.SetWithholdingFixed;
  callback: EventCallback<EtherDividendCheckpointSetWithholdingFixedEventArgs>;
}

interface GetSetWithholdingFixedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents.SetWithholdingFixed;
}

interface SetWalletSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents.SetWallet;
  callback: EventCallback<EtherDividendCheckpointSetWalletEventArgs>;
}

interface GetSetWalletLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents.SetWallet;
}

interface UpdateDividendDatesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents.UpdateDividendDates;
  callback: EventCallback<EtherDividendCheckpointUpdateDividendDatesEventArgs>;
}

interface GetUpdateDividendDatesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents.UpdateDividendDates;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents.Pause;
  callback: EventCallback<EtherDividendCheckpointPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: EtherDividendCheckpointEvents.Unpause;
  callback: EventCallback<EtherDividendCheckpointUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: EtherDividendCheckpointEvents.Unpause;
}

interface EtherDividendCheckpointSubscribeAsyncParams extends Subscribe {
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

interface GetEtherDividendCheckpointLogsAsyncParams extends GetLogs {
  (params: GetEtherDividendDepositedLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointEtherDividendDepositedEventArgs>[]
  >;
  (params: GetEtherDividendClaimedLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointEtherDividendClaimedEventArgs>[]
  >;
  (params: GetEtherDividendReclaimedLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointEtherDividendReclaimedEventArgs>[]
  >;
  (params: GetEtherDividendClaimFailedLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointEtherDividendClaimFailedEventArgs>[]
  >;
  (params: GetEtherDividendWithholdingWithdrawnLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointEtherDividendWithholdingWithdrawnEventArgs>[]
  >;
  (params: GetSetDefaultExcludedAddressesLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointSetDefaultExcludedAddressesEventArgs>[]
  >;
  (params: GetSetWithholdingLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointSetWithholdingEventArgs>[]
  >;
  (params: GetSetWithholdingFixedLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointSetWithholdingFixedEventArgs>[]
  >;
  (params: GetSetWalletLogsAsyncParams): Promise<LogWithDecodedArgs<EtherDividendCheckpointSetWalletEventArgs>[]>;
  (params: GetUpdateDividendDatesLogsAsyncParams): Promise<
    LogWithDecodedArgs<EtherDividendCheckpointUpdateDividendDatesEventArgs>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<EtherDividendCheckpointPauseEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<EtherDividendCheckpointUnpauseEventArgs>[]>;
}

interface CreateDividendParams extends TxParams {
  maturity: Date;
  expiry: Date;
  name: string;
  value: BigNumber;
}

interface CreateDividendWithCheckpointParams extends TxParams {
  maturity: Date;
  expiry: Date;
  checkpointId: number;
  name: string;
  value: BigNumber;
}

interface CreateDividendWithExclusionsParams extends TxParams {
  maturity: Date;
  expiry: Date;
  excluded: string[];
  name: string;
  value: BigNumber;
}

interface CreateDividendWithCheckpointAndExclusionsParams extends TxParams {
  maturity: Date;
  expiry: Date;
  checkpointId: number;
  excluded: string[];
  name: string;
  value: BigNumber;
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

/**
 * This class includes the functionality related to interacting with the EtherDividendCheckpoint contract.
 */
export default class EtherDividendCheckpointWrapper extends DividendCheckpointWrapper {
  public abi: ContractAbi = EtherDividendCheckpoint.abi;

  protected contract: Promise<EtherDividendCheckpointContract>;

  /**
   * Instantiate EtherDividendCheckpointWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<EtherDividendCheckpointContract>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  public paused = async (): Promise<boolean> => {
    return (await this.contract).paused.callAsync();
  };

  public createDividend = async (params: CreateDividendParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Manage), 'Caller is not allowed');
    const txPayableData = {
      ...params.txData,
      value: params.value,
    };
    await this.checkIfDividendIsValid(params.value, params.expiry, params.maturity, params.name);
    return (await this.contract).createDividend.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      stringToBytes32(params.name),
      txPayableData,
      params.safetyFactor,
    );
  };

  public createDividendWithCheckpoint = async (params: CreateDividendWithCheckpointParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Manage), 'Caller is not allowed');
    const txPayableData = {
      ...params.txData,
      value: params.value,
    };
    await this.checkIfDividendIsValid(params.value, params.expiry, params.maturity, params.name, params.checkpointId);
    return (await this.contract).createDividendWithCheckpoint.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      numberToBigNumber(params.checkpointId),
      stringToBytes32(params.name),
      txPayableData,
      params.safetyFactor,
    );
  };

  public createDividendWithExclusions = async (params: CreateDividendWithExclusionsParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Manage), 'Caller is not allowed');
    const txPayableData = {
      ...params.txData,
      value: params.value,
    };
    await this.checkIfDividendIsValid(
      params.value,
      params.expiry,
      params.maturity,
      params.name,
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

  public createDividendWithCheckpointAndExclusions = async (
    params: CreateDividendWithCheckpointAndExclusionsParams,
  ) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Manage), 'Caller is not allowed');
    const txPayableData = {
      ...params.txData,
      value: params.value,
    };
    await this.checkIfDividendIsValid(
      params.value,
      params.expiry,
      params.maturity,
      params.name,
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

  public pushDividendPaymentToAddresses = async (params: PushDividendPaymentToAddressesParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Distribute), 'Caller is not allowed');
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
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Distribute), 'Caller is not allowed');
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

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: EtherDividendCheckpointSubscribeAsyncParams = async <
    ArgsType extends EtherDividendCheckpointEventArgs
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, EtherDividendCheckpointEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      EtherDividendCheckpoint.abi,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetEtherDividendCheckpointLogsAsyncParams = async <
    ArgsType extends EtherDividendCheckpointEventArgs
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, EtherDividendCheckpointEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      EtherDividendCheckpoint.abi,
    );
    return logs;
  };

  private checkIfDividendIsValid = async (
    value: BigNumber,
    expiry: Date,
    maturity: Date,
    name: string,
    checkpointId?: number,
    excluded?: string[],
  ) => {
    if (excluded !== undefined) {
      excluded.forEach(address => assert.isNonZeroETHAddressHex('excluded', address));
      assert.areThereDuplicatedStrings('excluded', excluded);
      assert.assert(excluded.length <= EXCLUDED_ADDRESS_LIMIT, 'Too many addresses excluded');
    }
    assert.assert(expiry > maturity, 'Expiry before maturity');
    assert.isFutureDate(expiry, 'Expiry in past');
    assert.isBigNumberGreaterThanZero(value, 'No dividend sent');
    if (checkpointId !== undefined) {
      const currentCheckpointId = await (await this.securityTokenContract()).currentCheckpointId.callAsync();
      assert.assert(checkpointId < currentCheckpointId.toNumber(), 'Invalid checkpoint');
    }
    assert.assert(name.length > 0, 'The name can not be empty');
  };
}
