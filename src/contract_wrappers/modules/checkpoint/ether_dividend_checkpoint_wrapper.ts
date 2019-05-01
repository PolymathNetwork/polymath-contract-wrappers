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
  TxPayableParams,
} from '../../../types';
import { numberToBigNumber, dateToBigNumber, stringToBytes32 } from '../../../utils/convert';

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

interface SetWithholdingFixedParams extends TxParams {
  investors: string[];
  withholding: BigNumber;
}

interface PullDividendPaymentParams extends TxParams {
  dividendIndex: number;
}

interface PushDividendPaymentToAddressesParams extends TxParams {
  dividendIndex: number;
  payees: string[];
}

interface IsClaimedParams {
  investor: string;
  dividendIndex: number;
}

interface GetDividendIndexParams {
  checkpointId: number;
}

interface UpdateDividendDatesParams extends TxParams {
  dividendIndex: number;
  maturity: Date;
  expiry: Date;
}

interface IsExcludedParams {
  investor: string;
  dividendIndex: number;
}

interface SetWithholdingParams extends TxParams {
  investors: string[];
  withholding: BigNumber[];
}

interface ReclaimERC20Params extends TxParams {
  tokenContract: string;
}

interface ChangeWalletParams extends TxParams {
  wallet: string;
}

interface SetDefaultExcludedParams extends TxParams {
  excluded: string[];
}

interface PushDividendPaymentParams extends TxParams {
  dividendIndex: number;
  start: Date;
  iterations: number;
}

interface CreateDividendParams extends TxPayableParams {
  maturity: Date;
  expiry: Date;
  name: string;
}

interface CreateDividendWithCheckpointParams extends TxPayableParams {
  maturity: Date;
  expiry: Date;
  checkpointId: number;
  name: string;
}

interface CreateDividendWithExclusionsParams extends TxPayableParams {
  maturity: Date;
  expiry: Date;
  excluded: string[];
  name: string;
}

interface CreateDividendWithCheckpointAndExclusionsParams extends TxPayableParams {
  maturity: Date;
  expiry: Date;
  checkpointId: number;
  excluded: string[];
  name: string;
}

interface ReclaimDividendParams extends TxParams {
  dividendIndex: number;
}

interface WithdrawWithholdingParams extends TxParams {
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

  public setWithholdingFixed = async (params: SetWithholdingFixedParams) => {
    assert.isETHAddressHexArray('investors', params.investors);
    return (await this.contract).setWithholdingFixed.sendTransactionAsync(
      params.investors,
      params.withholding,
      params.txData,
      params.safetyFactor,
    );
  };

  public reclaimETH = async (params: TxParams) => {
    return (await this.contract).reclaimETH.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public pullDividendPayment = async (params: PullDividendPaymentParams) => {
    return (await this.contract).pullDividendPayment.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.txData,
      params.safetyFactor,
    );
  };

  public unpause = async (params: TxParams) => {
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public pushDividendPaymentToAddresses = async (params: PushDividendPaymentToAddressesParams) => {
    assert.isETHAddressHexArray('payees', params.payees);
    return (await this.contract).pushDividendPaymentToAddresses.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      params.payees,
      params.txData,
      params.safetyFactor,
    );
  };

  public wallet = async (): Promise<string> => {
    return (await this.contract).wallet.callAsync();
  };

  public isClaimed = async (params: IsClaimedParams): Promise<boolean> => {
    assert.isETHAddressHex('investor', params.investor);
    return (await this.contract).isClaimed.callAsync(params.investor, numberToBigNumber(params.dividendIndex));
  };

  public paused = async (): Promise<boolean> => {
    return (await this.contract).paused.callAsync();
  };

  public getDividendIndex = async (params: GetDividendIndexParams): Promise<BigNumber[]> => {
    return (await this.contract).getDividendIndex.callAsync(numberToBigNumber(params.checkpointId));
  };

  public updateDividendDates = async (params: UpdateDividendDatesParams) => {
    return (await this.contract).updateDividendDates.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.txData,
      params.safetyFactor,
    );
  };

  public isExcluded = async (params: IsExcludedParams): Promise<boolean> => {
    assert.isETHAddressHex('investor', params.investor);
    return (await this.contract).isExcluded.callAsync(params.investor, numberToBigNumber(params.dividendIndex));
  };

  public pause = async (params: TxParams) => {
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public setWithholding = async (params: SetWithholdingParams) => {
    assert.isETHAddressHexArray('investors', params.investors);
    return (await this.contract).setWithholding.sendTransactionAsync(
      params.investors,
      params.withholding,
      params.txData,
      params.safetyFactor,
    );
  };

  public reclaimERC20 = async (params: ReclaimERC20Params) => {
    assert.isETHAddressHex('tokenContract', params.tokenContract);
    return (await this.contract).reclaimERC20.sendTransactionAsync(
      params.tokenContract,
      params.txData,
      params.safetyFactor,
    );
  };

  public changeWallet = async (params: ChangeWalletParams) => {
    assert.isETHAddressHex('wallet', params.wallet);
    return (await this.contract).changeWallet.sendTransactionAsync(params.wallet, params.txData, params.safetyFactor);
  };

  public setDefaultExcluded = async (params: SetDefaultExcludedParams) => {
    assert.isETHAddressHexArray('excluded', params.excluded);
    return (await this.contract).setDefaultExcluded.sendTransactionAsync(
      params.excluded,
      params.txData,
      params.safetyFactor,
    );
  };

  public pushDividendPayment = async (params: PushDividendPaymentParams) => {
    return (await this.contract).pushDividendPayment.sendTransactionAsync(
      numberToBigNumber(params.dividendIndex),
      dateToBigNumber(params.start),
      numberToBigNumber(params.iterations),
      params.txData,
      params.safetyFactor,
    );
  };

  public getDefaultExcluded = async (): Promise<string[]> => {
    return (await this.contract).getDefaultExcluded.callAsync();
  };

  public createCheckpoint = async (params: TxParams) => {
    return (await this.contract).createCheckpoint.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public createDividend = async (params: CreateDividendParams) => {
    return (await this.contract).createDividend.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  public createDividendWithCheckpoint = async (params: CreateDividendWithCheckpointParams) => {
    return (await this.contract).createDividendWithCheckpoint.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      numberToBigNumber(params.checkpointId),
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  public createDividendWithExclusions = async (params: CreateDividendWithExclusionsParams) => {
    assert.isETHAddressHexArray('excluded', params.excluded);
    return (await this.contract).createDividendWithExclusions.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.excluded,
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  public createDividendWithCheckpointAndExclusions = async (
    params: CreateDividendWithCheckpointAndExclusionsParams,
  ) => {
    assert.isETHAddressHexArray('excluded', params.excluded);
    return (await this.contract).createDividendWithCheckpointAndExclusions.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      numberToBigNumber(params.checkpointId),
      params.excluded,
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  public reclaimDividend = async (params: ReclaimDividendParams) => {
    return (await this.contract).reclaimDividend.sendTransactionAsync(numberToBigNumber(params.dividendIndex));
  };

  public withdrawWithholding = async (params: WithdrawWithholdingParams) => {
    return (await this.contract).withdrawWithholding.sendTransactionAsync(numberToBigNumber(params.dividendIndex));
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
}
