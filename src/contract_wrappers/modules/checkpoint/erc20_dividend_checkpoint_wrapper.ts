import {
  ERC20DividendCheckpointContract,
  ERC20DividendCheckpointEventArgs,
  ERC20DividendCheckpointEvents,
  ERC20DividendCheckpointERC20DividendDepositedEventArgs,
  ERC20DividendCheckpointERC20DividendClaimedEventArgs,
  ERC20DividendCheckpointERC20DividendReclaimedEventArgs,
  ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs,
  ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs,
  ERC20DividendCheckpointSetWithholdingEventArgs,
  ERC20DividendCheckpointSetWithholdingFixedEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { ERC20DividendCheckpoint } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import { schemas } from '@0x/json-schemas';
import { TxParams, GetLogsAsyncParams, SubscribeAsyncParams, EventCallback, Subscribe, GetLogs } from '../../../types';
import assert from '../../../utils/assert';
import DividendCheckpointWrapper from './dividend_checkpoint_wrapper';

interface ERC20DividendDepositedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendDeposited;
  callback: EventCallback<ERC20DividendCheckpointERC20DividendDepositedEventArgs>;
}

interface GetERC20DividendDepositedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendDeposited;
}

interface ERC20DividendClaimedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendClaimed;
  callback: EventCallback<ERC20DividendCheckpointERC20DividendClaimedEventArgs>;
}

interface GetERC20DividendClaimedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendClaimed;
}

interface ERC20DividendReclaimedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendReclaimed;
  callback: EventCallback<ERC20DividendCheckpointERC20DividendReclaimedEventArgs>;
}

interface GetERC20DividendReclaimedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendReclaimed;
}

interface ERC20DividendWithholdingWithdrawnSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendWithholdingWithdrawn;
  callback: EventCallback<ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs>;
}

interface GetERC20DividendWithholdingWithdrawnLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents.ERC20DividendWithholdingWithdrawn;
}

interface SetDefaultExcludedAddressesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents.SetDefaultExcludedAddresses;
  callback: EventCallback<ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs>;
}

interface GetSetDefaultExcludedAddressesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents.SetDefaultExcludedAddresses;
}

interface SetWithholdingSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents.SetWithholding;
  callback: EventCallback<ERC20DividendCheckpointSetWithholdingEventArgs>;
}

interface GetSetWithholdingLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents.SetWithholding;
}

interface SetWithholdingFixedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents.SetWithholdingFixed;
  callback: EventCallback<ERC20DividendCheckpointSetWithholdingFixedEventArgs>;
}

interface GetSetWithholdingFixedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents.SetWithholdingFixed;
}

interface ERC20DividendCheckpointSubscribeAsyncParams extends Subscribe {
  (params: ERC20DividendDepositedSubscribeAsyncParams): Promise<string>;
  (params: ERC20DividendClaimedSubscribeAsyncParams): Promise<string>;
  (params: ERC20DividendReclaimedSubscribeAsyncParams): Promise<string>;
  (params: ERC20DividendWithholdingWithdrawnSubscribeAsyncParams): Promise<string>;
  (params: SetDefaultExcludedAddressesSubscribeAsyncParams): Promise<string>;
  (params: SetWithholdingSubscribeAsyncParams): Promise<string>;
  (params: SetWithholdingFixedSubscribeAsyncParams): Promise<string>;
}

interface GetERC20DividendCheckpointLogsAsyncParams extends GetLogs {
  (params: GetERC20DividendDepositedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendDepositedEventArgs>[]
  >;
  (params: GetERC20DividendClaimedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendClaimedEventArgs>[]
  >;
  (params: GetERC20DividendReclaimedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendReclaimedEventArgs>[]
  >;
  (params: GetERC20DividendWithholdingWithdrawnLogsAsyncParams): Promise<
    LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs>[]
  >;
  (params: GetSetDefaultExcludedAddressesLogsAsyncParams): Promise<
    LogWithDecodedArgs<ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs>[]
  >;
  (params: GetSetWithholdingLogsAsyncParams): Promise<
    LogWithDecodedArgs<ERC20DividendCheckpointSetWithholdingEventArgs>[]
  >;
  (params: GetSetWithholdingFixedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ERC20DividendCheckpointSetWithholdingFixedEventArgs>[]
  >;
}

interface DividendIndexParams {
  dividendIndex: BigNumber;
}

interface CreateDividendParams extends TxParams {
  maturity: BigNumber;
  expiry: BigNumber;
  token: string;
  amount: BigNumber;
  name: string;
}

interface CreateDividendWithCheckpointParams extends CreateDividendParams {
  checkpointId: BigNumber;
}

interface CreateDividendWithExclusionsParams extends CreateDividendParams {
  excluded: string[];
}

interface CreateDividendWithCheckpointAndExclusionsParams extends CreateDividendParams {
  checkpointId: BigNumber;
  excluded: string[];
}

/**
 * This class includes the functionality related to interacting with the ERC20DividendCheckpoint contract.
 */
export default class ERC20DividendCheckpointWrapper extends DividendCheckpointWrapper {
  public abi: ContractAbi = ERC20DividendCheckpoint.abi;

  protected contract: Promise<ERC20DividendCheckpointContract>;

  /**
   * Instantiate ERC20DividendCheckpointWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<ERC20DividendCheckpointContract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  public dividendTokens = async (params: DividendIndexParams) => {
    return (await this.contract).dividendTokens.callAsync(params.dividendIndex);
  };

  public createDividend = async (params: CreateDividendParams) => {
    return (await this.contract).createDividend.sendTransactionAsync(
      params.maturity,
      params.expiry,
      params.token,
      params.amount,
      params.name,
      params.txData,
      params.safetyFactor,
    );
  };

  public createDividendWithCheckpoint = async (params: CreateDividendWithCheckpointParams) => {
    return (await this.contract).createDividendWithCheckpoint.sendTransactionAsync(
      params.maturity,
      params.expiry,
      params.token,
      params.amount,
      params.checkpointId,
      params.name,
      params.txData,
      params.safetyFactor,
    );
  };

  public createDividendWithExclusions = async (params: CreateDividendWithExclusionsParams) => {
    return (await this.contract).createDividendWithExclusions.sendTransactionAsync(
      params.maturity,
      params.expiry,
      params.token,
      params.amount,
      params.excluded,
      params.name,
      params.txData,
      params.safetyFactor,
    );
  };

  public createDividendWithCheckpointAndExclusions = async (
    params: CreateDividendWithCheckpointAndExclusionsParams,
  ) => {
    return (await this.contract).createDividendWithCheckpointAndExclusions.sendTransactionAsync(
      params.maturity,
      params.expiry,
      params.token,
      params.amount,
      params.checkpointId,
      params.excluded,
      params.name,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: ERC20DividendCheckpointSubscribeAsyncParams = async <
    ArgsType extends ERC20DividendCheckpointEventArgs
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ERC20DividendCheckpointEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      ERC20DividendCheckpoint.abi,
      params.callback,
      !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetERC20DividendCheckpointLogsAsyncParams = async <
    ArgsType extends ERC20DividendCheckpointEventArgs
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ERC20DividendCheckpointEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      ERC20DividendCheckpoint.abi,
    );
    return logs;
  };
}
