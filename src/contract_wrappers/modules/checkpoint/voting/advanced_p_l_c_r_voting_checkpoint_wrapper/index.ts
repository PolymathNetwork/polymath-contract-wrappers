/* istanbul ignore file */
import { AdvancedPLCRVotingCheckpointEventArgs_3_1_0 } from '@polymathnetwork/abi-wrappers';
import { AdvancedPLCRVotingCheckpoint_3_1_0, isAdvancedPLCRVotingCheckpoint_3_1_0 } from './3.1.0';

import Common, {
  isAdvancedPLCRVotingCheckpoint,
  BallotParams,
  StatutoryBallotParams,
  CustomStatutoryBallotParams,
  CustomCumulativeBallotParams,
  CumulativeBallotParams,
  CustomCumulativeBallotWithExemptionParams,
  CumulativeBallotWithExemptionParams,
  StatutoryBallotWithExemptionParams,
  CustomStatutoryBallotWithExemptionParams,
  CommitVoteParams,
  RevealVoteParams,
  CancelBallotParams,
  ChangeBallotExemptedVotersListParams,
  ChangeBallotExemptedVotersListMultiParams,
  ChangeDefaultExemptedVotersListParams,
  ChangeDefaultExemptedVotersListMultiParams,
  CheckpointIdParams,
  BallotIdParams,
  VoteTokenCountParams,
} from './common';
import { ContractVersion } from '../../../../../types';

export type AdvancedPLCRVotingCheckpointEventArgs = AdvancedPLCRVotingCheckpointEventArgs_3_1_0;

export {
  AdvancedPLCRVotingCheckpointEvents_3_1_0 as AdvancedPLCRVotingCheckpointEvents,
  AdvancedPLCRVotingCheckpointStatutoryBallotCreatedEventArgs_3_1_0 as AdvancedPLCRVotingCheckpointStatutoryBallotCreatedEventArgs,
  AdvancedPLCRVotingCheckpointCumulativeBallotCreatedEventArgs_3_1_0 as AdvancedPLCRVotingCheckpointCumulativeBallotCreatedEventArgs,
  AdvancedPLCRVotingCheckpointVotersExemptedEventArgs_3_1_0 as AdvancedPLCRVotingCheckpointVotersExemptedEventArgs,
  AdvancedPLCRVotingCheckpointVoteCommitEventArgs_3_1_0 as AdvancedPLCRVotingCheckpointVoteCommitEventArgs,
  AdvancedPLCRVotingCheckpointVoteRevealedEventArgs_3_1_0 as AdvancedPLCRVotingCheckpointVoteRevealedEventArgs,
  AdvancedPLCRVotingCheckpointBallotCancelledEventArgs_3_1_0 as AdvancedPLCRVotingCheckpointBallotCancelledEventArgs,
  AdvancedPLCRVotingCheckpointChangedBallotExemptedVotersListEventArgs_3_1_0 as AdvancedPLCRVotingCheckpointChangedBallotExemptedVotersListEventArgs,
  AdvancedPLCRVotingCheckpointChangedDefaultExemptedVotersListEventArgs_3_1_0 as AdvancedPLCRVotingCheckpointChangedDefaultExemptedVotersListEventArgs,
  AdvancedPLCRVotingCheckpointPauseEventArgs_3_1_0 as AdvancedPLCRVotingCheckpointPauseEventArgs,
  AdvancedPLCRVotingCheckpointUnpauseEventArgs_3_1_0 as AdvancedPLCRVotingCheckpointUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';

export type AdvancedPLCRVotingCheckpoint = AdvancedPLCRVotingCheckpoint_3_1_0;

export { isAdvancedPLCRVotingCheckpoint, AdvancedPLCRVotingCheckpoint_3_1_0, isAdvancedPLCRVotingCheckpoint_3_1_0 };

export namespace AdvancedPLCRVotingCheckpointTransactionParams {
  export interface Ballot extends BallotParams {}
  export interface StatutoryBallot extends StatutoryBallotParams {}
  export interface CustomStatutoryBallot extends CustomStatutoryBallotParams {}
  export interface CustomCumulativeBallot extends CustomCumulativeBallotParams {}
  export interface CumulativeBallot extends CumulativeBallotParams {}
  export interface CustomCumulativeBallotWithExemption extends CustomCumulativeBallotWithExemptionParams {}
  export interface CumulativeBallotWithExemption extends CumulativeBallotWithExemptionParams {}
  export interface StatutoryBallotWithExemption extends StatutoryBallotWithExemptionParams {}
  export interface CustomStatutoryBallotWithExemption extends CustomStatutoryBallotWithExemptionParams {}
  export interface CommitVote extends CommitVoteParams {}
  export interface RevealVote extends RevealVoteParams {}
  export interface CancelBallot extends CancelBallotParams {}
  export interface ChangeBallotExemptedVotersList extends ChangeBallotExemptedVotersListParams {}
  export interface ChangeBallotExemptedVotersListMulti extends ChangeBallotExemptedVotersListMultiParams {}
  export interface ChangeDefaultExemptedVotersList extends ChangeDefaultExemptedVotersListParams {}
  export interface ChangeDefaultExemptedVotersListMulti extends ChangeDefaultExemptedVotersListMultiParams {}
  export interface CheckpointId extends CheckpointIdParams {}
  export interface BallotId extends BallotIdParams {}
  export interface VoteTokenCount extends VoteTokenCountParams {}
}

// for internal use
export class AdvancedPLCRVotingCheckpointCommon extends Common {
  public contractVersion!: ContractVersion;
}
