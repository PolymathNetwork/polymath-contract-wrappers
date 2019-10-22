/* istanbul ignore file */
import { AdvancedPLCRVotingCheckpointEventArgs_3_1_0 } from '@polymathnetwork/abi-wrappers';
import { AdvancedPLCRVotingCheckpoint_3_1_0, isAdvancedPLCRVotingCheckpoint_3_1_0 } from './3.1.0';

import Common, {
  isAdvancedPLCRVotingCheckpoint,
  CreateStatutoryBallotParams,
  CreateCustomStatutoryBallotParams,
  CreateCustomCumulativeBallotParams,
  CreateCumulativeBallotParams,
  CreateCustomCumulativeBallotWithExemptionParams,
  CreateCumulativeBallotWithExemptionParams,
  CreateStatutoryBallotWithExemptionParams,
  CreateCustomStatutoryBallotWithExemptionParams,
  CommitVoteParams,
  RevealVoteParams,
  CancelBallotParams,
  ChangeBallotExemptedVotersListParams,
  ChangeBallotExemptedVotersListMultiParams,
  ChangeDefaultExemptedVotersListParams,
  ChangeDefaultExemptedVotersListMultiParams,
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
  export interface CreateStatutoryBallot extends CreateStatutoryBallotParams {}
  export interface CreateCustomStatutoryBallot extends CreateCustomStatutoryBallotParams {}
  export interface CreateCustomCumulativeBallot extends CreateCustomCumulativeBallotParams {}
  export interface CreateCumulativeBallot extends CreateCumulativeBallotParams {}
  export interface CreateCustomCumulativeBallotWithExemption extends CreateCustomCumulativeBallotWithExemptionParams {}
  export interface CreateCumulativeBallotWithExemption extends CreateCumulativeBallotWithExemptionParams {}
  export interface CreateStatutoryBallotWithExemption extends CreateStatutoryBallotWithExemptionParams {}
  export interface CreateCustomStatutoryBallotWithExemption extends CreateCustomStatutoryBallotWithExemptionParams {}
  export interface CommitVote extends CommitVoteParams {}
  export interface RevealVote extends RevealVoteParams {}
  export interface CancelBallot extends CancelBallotParams {}
  export interface ChangeBallotExemptedVotersList extends ChangeBallotExemptedVotersListParams {}
  export interface ChangeBallotExemptedVotersListMulti extends ChangeBallotExemptedVotersListMultiParams {}
  export interface ChangeDefaultExemptedVotersList extends ChangeDefaultExemptedVotersListParams {}
  export interface ChangeDefaultExemptedVotersListMulti extends ChangeDefaultExemptedVotersListMultiParams {}
}

// for internal use
export class AdvancedPLCRVotingCheckpointCommon extends Common {
  public contractVersion!: ContractVersion;
}
