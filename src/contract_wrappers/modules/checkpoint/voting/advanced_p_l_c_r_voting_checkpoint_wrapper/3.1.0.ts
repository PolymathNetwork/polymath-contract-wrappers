import {
  AdvancedPLCRVotingCheckpointContract_3_1_0,
  AdvancedPLCRVotingCheckpointEventArgs_3_1_0,
  AdvancedPLCRVotingCheckpointEvents_3_1_0,
  AdvancedPLCRVotingCheckpointStatutoryBallotCreatedEventArgs_3_1_0,
  AdvancedPLCRVotingCheckpointCumulativeBallotCreatedEventArgs_3_1_0,
  AdvancedPLCRVotingCheckpointVotersExemptedEventArgs_3_1_0,
  AdvancedPLCRVotingCheckpointVoteCommitEventArgs_3_1_0,
  AdvancedPLCRVotingCheckpointVoteRevealedEventArgs_3_1_0,
  AdvancedPLCRVotingCheckpointBallotCancelledEventArgs_3_1_0,
  AdvancedPLCRVotingCheckpointChangedBallotExemptedVotersListEventArgs_3_1_0,
  AdvancedPLCRVotingCheckpointChangedDefaultExemptedVotersListEventArgs_3_1_0,
  AdvancedPLCRVotingCheckpointPauseEventArgs_3_1_0,
  AdvancedPLCRVotingCheckpointUnpauseEventArgs_3_1_0,
  LogWithDecodedArgs,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import {
  ContractVersion,
  SubscribeAsyncParams,
  GetLogsAsyncParams,
  Subscribe,
  GetLogs,
  EventCallback,
  Constructor,
} from '../../../../../types';
import ContractFactory from '../../../../../factories/contractFactory';

import AdvancedPLCRVotingCheckpointCommon from './common';
import assert from '../../../../../utils/assert';
import { WithModule_3_0_0 } from '../../../module_wrapper';

interface StatutoryBallotCreatedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.StatutoryBallotCreated;
  callback: EventCallback<AdvancedPLCRVotingCheckpointStatutoryBallotCreatedEventArgs_3_1_0>;
}

interface GetStatutoryBallotCreatedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.StatutoryBallotCreated;
}

interface CumulativeBallotCreatedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.CumulativeBallotCreated;
  callback: EventCallback<AdvancedPLCRVotingCheckpointCumulativeBallotCreatedEventArgs_3_1_0>;
}

interface GetCumulativeBallotCreatedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.CumulativeBallotCreated;
}

interface VotersExemptedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.VotersExempted;
  callback: EventCallback<AdvancedPLCRVotingCheckpointVotersExemptedEventArgs_3_1_0>;
}

interface GetVotersExemptedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.VotersExempted;
}

interface VoteCommitSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.VoteCommit;
  callback: EventCallback<AdvancedPLCRVotingCheckpointVoteCommitEventArgs_3_1_0>;
}

interface GetVoteCommitLogsAsyncParams extends GetLogsAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.VoteCommit;
}

interface VoteRevealedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.VoteRevealed;
  callback: EventCallback<AdvancedPLCRVotingCheckpointVoteRevealedEventArgs_3_1_0>;
}

interface GetVoteRevealedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.VoteRevealed;
}

interface BallotCancelledSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.BallotCancelled;
  callback: EventCallback<AdvancedPLCRVotingCheckpointBallotCancelledEventArgs_3_1_0>;
}

interface GetBallotCancelledLogsAsyncParams extends GetLogsAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.BallotCancelled;
}

interface ChangedBallotExemptedVotersListSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.ChangedBallotExemptedVotersList;
  callback: EventCallback<AdvancedPLCRVotingCheckpointChangedBallotExemptedVotersListEventArgs_3_1_0>;
}

interface GetChangedBallotExemptedVotersListLogsAsyncParams extends GetLogsAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.ChangedBallotExemptedVotersList;
}

interface ChangedDefaultExemptedVotersListSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.ChangedDefaultExemptedVotersList;
  callback: EventCallback<AdvancedPLCRVotingCheckpointChangedDefaultExemptedVotersListEventArgs_3_1_0>;
}

interface GetChangedDefaultExemptedVotersListLogsAsyncParams extends GetLogsAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.ChangedDefaultExemptedVotersList;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.Pause;
  callback: EventCallback<AdvancedPLCRVotingCheckpointPauseEventArgs_3_1_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.Unpause;
  callback: EventCallback<AdvancedPLCRVotingCheckpointUnpauseEventArgs_3_1_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.Unpause;
}

interface AdvancedPLCRVotingCheckpointSubscribeAsyncParams extends Subscribe {
  (params: StatutoryBallotCreatedSubscribeAsyncParams): Promise<string>;
  (params: CumulativeBallotCreatedSubscribeAsyncParams): Promise<string>;
  (params: VotersExemptedSubscribeAsyncParams): Promise<string>;
  (params: VoteCommitSubscribeAsyncParams): Promise<string>;
  (params: VoteRevealedSubscribeAsyncParams): Promise<string>;
  (params: BallotCancelledSubscribeAsyncParams): Promise<string>;
  (params: ChangedBallotExemptedVotersListSubscribeAsyncParams): Promise<string>;
  (params: ChangedDefaultExemptedVotersListSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetAdvancedPLCRVotingCheckpointLogsAsyncParams extends GetLogs {
  (params: GetStatutoryBallotCreatedLogsAsyncParams): Promise<
    LogWithDecodedArgs<AdvancedPLCRVotingCheckpointStatutoryBallotCreatedEventArgs_3_1_0>[]
  >;
  (params: GetCumulativeBallotCreatedLogsAsyncParams): Promise<
    LogWithDecodedArgs<AdvancedPLCRVotingCheckpointCumulativeBallotCreatedEventArgs_3_1_0>[]
  >;
  (params: GetVotersExemptedLogsAsyncParams): Promise<
    LogWithDecodedArgs<AdvancedPLCRVotingCheckpointVotersExemptedEventArgs_3_1_0>[]
  >;
  (params: GetVoteCommitLogsAsyncParams): Promise<
    LogWithDecodedArgs<AdvancedPLCRVotingCheckpointVoteCommitEventArgs_3_1_0>[]
  >;
  (params: GetVoteRevealedLogsAsyncParams): Promise<
    LogWithDecodedArgs<AdvancedPLCRVotingCheckpointVoteRevealedEventArgs_3_1_0>[]
  >;
  (params: GetBallotCancelledLogsAsyncParams): Promise<
    LogWithDecodedArgs<AdvancedPLCRVotingCheckpointBallotCancelledEventArgs_3_1_0>[]
  >;
  (params: GetChangedBallotExemptedVotersListLogsAsyncParams): Promise<
    LogWithDecodedArgs<AdvancedPLCRVotingCheckpointChangedBallotExemptedVotersListEventArgs_3_1_0>[]
  >;
  (params: GetChangedDefaultExemptedVotersListLogsAsyncParams): Promise<
    LogWithDecodedArgs<AdvancedPLCRVotingCheckpointChangedDefaultExemptedVotersListEventArgs_3_1_0>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<AdvancedPLCRVotingCheckpointPauseEventArgs_3_1_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<
    LogWithDecodedArgs<AdvancedPLCRVotingCheckpointUnpauseEventArgs_3_1_0>[]
  >;
}

// uses 3.0.0 Module contract
const AdvancedPLCRVotingCheckpointBase_3_1_0 = WithModule_3_0_0(
  (AdvancedPLCRVotingCheckpointCommon as unknown) as Constructor<AdvancedPLCRVotingCheckpointCommon>,
);

export class AdvancedPLCRVotingCheckpoint_3_1_0 extends AdvancedPLCRVotingCheckpointBase_3_1_0 {
  public contract: Promise<AdvancedPLCRVotingCheckpointContract_3_1_0>;

  public contractVersion = ContractVersion.V3_1_0;

  /**
   * Instantiate AdvancedPLCRVotingCheckpoint_3_1_0
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract Contract
   * @param contractFactory Contract factory address
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<AdvancedPLCRVotingCheckpointContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: AdvancedPLCRVotingCheckpointSubscribeAsyncParams = async <
    ArgsType extends AdvancedPLCRVotingCheckpointEventArgs_3_1_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, AdvancedPLCRVotingCheckpointEvents_3_1_0);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = await this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetAdvancedPLCRVotingCheckpointLogsAsyncParams = async <
    ArgsType extends AdvancedPLCRVotingCheckpointEventArgs_3_1_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, AdvancedPLCRVotingCheckpointEvents_3_1_0);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
    );
    return logs;
  };
}

export function isAdvancedPLCRVotingCheckpoint_3_1_0(
  wrapper: AdvancedPLCRVotingCheckpointCommon,
): wrapper is AdvancedPLCRVotingCheckpoint_3_1_0 {
  return wrapper.contractVersion === ContractVersion.V3_1_0;
}
