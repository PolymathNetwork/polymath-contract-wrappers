import {
  AdvancedPLCRVotingCheckpointContract_3_1_0,
  AdvancedPLCRVotingCheckpointEvents_3_1_0,
  Web3Wrapper,
  BigNumber,
  PolyResponse,
  ethersUtils,
} from '@polymathnetwork/abi-wrappers';
import _ from 'lodash';
import {
  numberToBigNumber,
  weiToValue,
  bigNumberToDate,
  parseBallotStageValue,
  dateToBigNumber,
} from '../../../../../utils/convert';
import ContractFactory from '../../../../../factories/contractFactory';
import ContractWrapper from '../../../../contract_wrapper';
import { ErrorCode, Perm, TxParams, BallotStage } from '../../../../../types';
import { ModuleCommon } from '../../../module_wrapper';
import assert from '../../../../../utils/assert';

export namespace AdvancedPLCRVotingCheckpointTransactionParams {
  export interface Ballot extends BallotParams {}
  export interface StatutoryBallot extends StatutoryBallotParams {}
  export interface CustomStatutoryBallot extends CustomStatutoryBallotParams {}
  export interface CustomCumulativeBallot extends CustomCumulativeBallotParams {}
  export interface CumulativeBallot extends CumulativeBallotParams {}
  export interface CustomCumulativeBallotWithExemption extends CustomCumulativeBallotWithExemptionParams {}
  export interface CumulativeBallotWithExemption extends CumulativeBallotWithExemptionParams {}
  export interface StatutoryBallotWithExemption extends StatutoryBallotWithExemptionParams {}
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

interface BallotParams extends TxParams {
  name: string;
  startTime: Date;
  commitDuration: number;
  revealDuration: number;
  proposalTitle: string;
  choices: string;
}

/**
 * @param name Name of the ballot (Should be unique)
 * @param startTime startTime of the ballot
 * @param commitDuration Unix time period till the voters commit there vote
 * @param revealDuration Unix time period till the voters reveal there vote starts when commit duration ends
 * @param proposalTitle Title of proposal
 * @param details Off-chain details related to the proposal
 * @param choices Choices of proposals
 * @param noOfChoices No. of choices (If it is 0 then it means NAY/YAY ballot type is choosen).
 */
interface StatutoryBallotParams extends BallotParams {
  name: string;
  startTime: Date;
  commitDuration: number;
  details: string;
  revealDuration: number;
  proposalTitle: string;
  choices: string;
  noOfChoices: number;
}

/**
 * @param details Off-chain details related to the proposal
 * @param noOfChoices No. of choices (If it is 0 then it means NAY/YAY/ABSTAIN ballot type is choosen).
 * @param checkpointId Valid checkpoint Id
 */
interface CustomStatutoryBallotParams extends BallotParams {
  checkpointId: number;
  details: string;
  noOfChoices: number;
}

/**
 * @param details Off-chain details related to the proposal
 * @param noOfChoices Array of No. of choices (If it is 0 then it means NAY/YAY ballot type is choosen).
 * @param checkpointId Valid checkpoint Id
 */
interface CustomCumulativeBallotParams extends BallotParams {
  checkpointId: number;
  details: string[];
  noOfChoices: number[];
}

/**
 * @param details Off-chain details related to the proposal
 * @param noOfChoices Array of No. of choices (If it is 0 then it means NAY/YAY ballot type is choosen).
 */
interface CumulativeBallotParams extends BallotParams {
  details: string[];
  noOfChoices: number[];
}

/**
 * @param exemptedAddresses List of addresses not allowed to vote
 */
interface CustomCumulativeBallotWithExemptionParams extends CustomCumulativeBallotParams {
  exemptedAddresses: string[];
}

/**
 * @param exemptedAddresses List of addresses not allowed to vote
 */
interface CumulativeBallotWithExemptionParams extends CumulativeBallotParams {
  exemptedAddresses: string[];
}

/**
 * @param exemptedAddresses List of addresses not allowed to vote
 */
interface StatutoryBallotWithExemptionParams extends CustomStatutoryBallotParams {
  exemptedAddresses: string[];
}

/**
 * @param ballotId Given ballot Id
 * @param votes
 * @param salt
 */
interface CommitVoteParams extends TxParams {
  ballotId: number;
  votes: number[];
  salt: string;
}

/**
 * @param ballotId Given ballot Id
 * @param choiceOfProposal Proposal chosen by the voter. It varies from (1 to totalProposals)
 * @param salt Used salt for hashing (unique for each user)
 */
interface RevealVoteParams extends TxParams {
  ballotId: number;
  choices: number[];
  salt: number;
}

/**
 * @param ballotId The index of the target ballot
 */
interface CancelBallotParams extends TxParams {
  ballotId: number;
}

/**
 * @param ballotId Given ballot Id
 * @param voter Address of the voter
 * @param exempt Whether it is exempted or not
 */
interface ChangeBallotExemptedVotersListParams extends TxParams {
  ballotId: number;
  exemptedAddress: string;
  exempt: boolean;
}

/**
 * @param ballotId Given ballot Id
 * @param exemptedAddresses Address of the voters
 * @param exempts Whether it is exempted or not
 */
interface ChangeBallotExemptedVotersListMultiParams extends TxParams {
  ballotId: number;
  exemptedAddress: string[];
  exempt: boolean[];
}

/**
 * @param voter Address of the voter
 * @param exempt Whether it is exempted or not
 */
interface ChangeDefaultExemptedVotersListParams extends TxParams {
  voter: string;
  exempt: boolean;
}

/**
 * @param voters Address of the voter
 * @param exempts Whether it is exempted or not
 */
interface ChangeDefaultExemptedVotersListMultiParams extends TxParams {
  voters: string[];
  exempts: boolean[];
}

/**
 * @param checkpointId Checkpoint identifier
 */
interface CheckpointIdParams {
  checkpointId: number;
}

interface BallotIdParams {
  ballotId: number;
}

interface VoteTokenCountParams {
  // Address of the voter (Who will vote).
  voter: string;
  // Id of the ballot.
  ballotId: number;
}

interface CheckpointData {
  investor: string;
  balance: BigNumber;
}

interface Ballots {
  // Id list of the ballots
  ballotId: number;
  // Name of the ballots
  name: string;
  // List of the no. of the proposals in the ballot
  totalProposal: number;
  // Current stage of the ballot
  currentStage: BallotStage;
  // Array of boolean to know the status of the ballot
  isCancelled: boolean;
}

interface PendingBallots {
  // ballots list of indexes of ballots on which given voter has to commit
  commitCount: number[];
  // ballots list of indexes of ballots on which given voter has to reveal
  revealCount: number[];
}

interface BallotResults {
  choicesWeighting: number;
  noOfChoicesInProposal: number;
  voters: string;
}

interface BallotDetails {
  name: string;
  totalSupplyAtCheckpoint: number;
  checkpointId: number;
  startTime: Date;
  commitDuration: number;
  revealDuration: number;
  totalProposals: number;
  totalVoters: number;
  commitedVoteCount: number;
  isCancelled: boolean;
  currentStage: BallotStage;
  proposalDetails: string[];
  proposalChoicesCounts: number[];
}

/**
 * This class includes the functionality related to interacting with the Advanced PLCR Voting Checkpoint contract.
 */
export default abstract class AdvancedPLCRVotingCheckpointCommon extends ModuleCommon {
  public contract: Promise<AdvancedPLCRVotingCheckpointContract_3_1_0>;

  /**
   * Instantiate AdvancedPLCRVotingCheckpointWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
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
   * Return the default exemption list
   */
  public getDefaultExemptionVotersList = async (): Promise<string[]> => {
    return (await this.contract).getDefaultExemptionVotersList.callAsync();
  };

  /**
   * Retrieves list of investors, their balances
   */
  public getCheckpointData = async (params: CheckpointIdParams): Promise<CheckpointData[]> => {
    const result = await (await this.contract).getCheckpointData.callAsync(numberToBigNumber(params.checkpointId));
    const typedResult: Promise<CheckpointData>[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      typedResult.push(this.pushCheckpointData(result, i));
    }
    return Promise.all(typedResult);
  };

  private pushCheckpointData = async (result: [string[], BigNumber[]], i: number): Promise<CheckpointData> => {
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return {
      investor: result[0][i],
      balance: weiToValue(result[1][i], decimals),
    };
  };

  /**
   * Retrives the list of investors who are remain to vote
   * @return address list of invesotrs who are remain to vote
   */
  public getPendingInvestorToVote = async (params: BallotIdParams): Promise<string[]> => {
    return (await this.contract).getPendingInvestorToVote.callAsync(numberToBigNumber(params.ballotId));
  };

  /**
   * It will return the no. of the voters who take part in the commit phase of the voting
   * @return No. of the voters who take part in the commit phase of the voting
   */
  public getCommitedVoteCount = async (params: BallotIdParams): Promise<number> => {
    const result = await (await this.contract).getCommitedVoteCount.callAsync(numberToBigNumber(params.ballotId));
    return result.toNumber();
  };

  /**
   * Get eligible voters list for the given ballot
   * @return Addresses of the voters
   */
  public getAllowedVotersByBallot = async (params: BallotIdParams): Promise<string[]> => {
    return (await this.contract).getAllowedVotersByBallot.callAsync(numberToBigNumber(params.ballotId));
  };

  /**
   * Get the data of all the ballots
   * @return List of ballots
   */
  public getAllBallots = async (): Promise<Ballots[]> => {
    const result = await (await this.contract).getAllBallots.callAsync();
    const typedResult: Ballots[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      typedResult.push({
        ballotId: result[0][i].toNumber(),
        name: result[1][i],
        totalProposal: result[2][i].toNumber(),
        currentStage: parseBallotStageValue(result[3][i]),
        isCancelled: result[4][i],
      });
    }
    return typedResult;
  };

  /**
   * Return the list of the exempted voters list for a given ballotId
   * @return List of the exempted voters.
   */
  public getExemptedVotersByBallot = async (params: BallotIdParams): Promise<string[]> => {
    return (await this.contract).getExemptedVotersByBallot.callAsync(numberToBigNumber(params.ballotId));
  };

  /**
   * Provide the list of ballot in which given address is eligible for vote
   * @return list of pending ballots
   */
  public pendingBallots = async (voter: string): Promise<PendingBallots> => {
    const result = await (await this.contract).pendingBallots.callAsync(voter);
    const typedResult: PendingBallots = {
      commitCount: result[0].map(v => v.toNumber()),
      revealCount: result[1].map(v => v.toNumber()),
    };
    return typedResult;
  };

  /**
   * Used to get the current stage of the ballot
   */
  public getCurrentBallotStage = async (params: BallotIdParams): Promise<BallotStage> => {
    const result = await (await this.contract).getCurrentBallotStage.callAsync(numberToBigNumber(params.ballotId));
    return parseBallotStageValue(result);
  };

  /**
   * Get the voting power for an voter in terms of the token
   */
  public getVoteTokenCount = async (params: VoteTokenCountParams): Promise<number> => {
    const result = await (await this.contract).getVoteTokenCount.callAsync(
      params.voter,
      numberToBigNumber(params.ballotId),
    );
    return result.toNumber();
  };

  /**
   * Queries the result of a given ballot
   */
  public getBallotResults = async (params: BallotIdParams): Promise<BallotResults[]> => {
    const result = await (await this.contract).getBallotResults.callAsync(numberToBigNumber(params.ballotId));
    const typedResult: BallotResults[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      typedResult.push({
        choicesWeighting: result[0][i].toNumber(),
        noOfChoicesInProposal: result[1][i].toNumber(),
        voters: result[2][i],
      });
    }
    return typedResult;
  };

  /**
   *  Get the details of the ballot
   */
  public getBallotDetails = async (params: BallotIdParams): Promise<BallotDetails> => {
    const result = await (await this.contract).getBallotDetails.callAsync(numberToBigNumber(params.ballotId));
    const typedResult: BallotDetails = {
      name: result[0],
      totalSupplyAtCheckpoint: result[1].toNumber(),
      checkpointId: result[2].toNumber(),
      startTime: bigNumberToDate(result[3]),
      commitDuration: result[4].toNumber(),
      revealDuration: result[5].toNumber(),
      totalProposals: result[6].toNumber(),
      totalVoters: result[7].toNumber(),
      commitedVoteCount: result[8].toNumber(),
      isCancelled: result[9],
      currentStage: parseBallotStageValue(result[10]),
      proposalDetails: result[11],
      proposalChoicesCounts: result[12].map(v => v.toNumber()),
    };
    return typedResult;
  };

  /**
   * Get the length of the ballots array
   * @return Length of the ballots array
   */
  public getBallotsArrayLength = async (): Promise<number> => {
    const result = await (await this.contract).getBallotsArrayLength.callAsync();
    return result.toNumber();
  };

  /**
   * Use to check whether the voter is allowed to vote or not
   * @return bool
   */
  public isVoterAllowed = async (params: VoteTokenCountParams): Promise<boolean> => {
    return (await this.contract).isVoterAllowed.callAsync(numberToBigNumber(params.ballotId), params.voter);
  };

  /**
   * Use to create a statutory ballot
   */
  public createStatutoryBallot = async (params: StatutoryBallotParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.validateMaximumLimitCount();
    this.isEmptyString(params.name);
    this.isEmptyString(params.proposalTitle);
    this.isGreaterThanZero(params.commitDuration, params.revealDuration);
    return (await this.contract).createStatutoryBallot.sendTransactionAsync(
      params.name,
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitle,
      params.details,
      params.choices,
      numberToBigNumber(params.noOfChoices),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to create a custom statutory ballot
   */
  public createCustomStatutoryBallot = async (params: CustomStatutoryBallotParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.validateMaximumLimitCount();
    this.isEmptyString(params.name);
    this.isEmptyString(params.proposalTitle);
    this.isGreaterThanZero(params.commitDuration, params.revealDuration);
    return (await this.contract).createCustomStatutoryBallot.sendTransactionAsync(
      params.name,
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitle,
      params.details,
      params.choices,
      numberToBigNumber(params.noOfChoices),
      numberToBigNumber(params.checkpointId),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to create a custom cumulative ballot
   */
  public createCustomCumulativeBallot = async (params: CustomCumulativeBallotParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.validateMaximumLimitCount();
    this.isEmptyString(params.name);
    this.isEmptyString(params.proposalTitle);
    this.isGreaterThanZero(params.commitDuration, params.revealDuration);
    this.isValidLength(params.noOfChoices.length, params.details.length);
    return (await this.contract).createCustomCumulativeBallot.sendTransactionAsync(
      params.name,
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitle,
      params.details,
      params.choices,
      params.noOfChoices.map(v => numberToBigNumber(v)),
      numberToBigNumber(params.checkpointId),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to create a cumulative ballot
   */
  public createCumulativeBallot = async (params: CumulativeBallotParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.validateMaximumLimitCount();
    this.isEmptyString(params.name);
    this.isEmptyString(params.proposalTitle);
    this.isGreaterThanZero(params.commitDuration, params.revealDuration);
    this.isValidLength(params.noOfChoices.length, params.details.length);
    return (await this.contract).createCumulativeBallot.sendTransactionAsync(
      params.name,
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitle,
      params.details,
      params.choices,
      params.noOfChoices.map(v => numberToBigNumber(v)),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to create a ballot with exemption
   */
  public createCustomCumulativeBallotWithExemption = async (
    params: CustomCumulativeBallotWithExemptionParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.validateMaximumLimitCount();
    this.isEmptyString(params.name);
    this.isEmptyString(params.proposalTitle);
    this.isGreaterThanZero(params.commitDuration, params.revealDuration);
    this.isValidLength(params.noOfChoices.length, params.details.length);
    return (await this.contract).createCustomCumulativeBallotWithExemption.sendTransactionAsync(
      params.name,
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitle,
      params.details,
      params.choices,
      params.noOfChoices.map(v => numberToBigNumber(v)),
      numberToBigNumber(params.checkpointId),
      params.exemptedAddresses,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to create a cumulative ballot with exemption
   */
  public createCumulativeBallotWithExemption = async (
    params: CumulativeBallotWithExemptionParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.validateMaximumLimitCount();
    this.isEmptyString(params.name);
    this.isEmptyString(params.proposalTitle);
    this.isGreaterThanZero(params.commitDuration, params.revealDuration);
    this.isValidLength(params.noOfChoices.length, params.details.length);
    return (await this.contract).createCumulativeBallotWithExemption.sendTransactionAsync(
      params.name,
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitle,
      params.details,
      params.choices,
      params.noOfChoices.map(v => numberToBigNumber(v)),
      params.exemptedAddresses,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to create a statutory ballot with exemption
   */
  public createStatutoryBallotWithExemption = async (
    params: StatutoryBallotWithExemptionParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.validateMaximumLimitCount();
    this.isEmptyString(params.name);
    this.isEmptyString(params.proposalTitle);
    this.isGreaterThanZero(params.commitDuration, params.revealDuration);
    return (await this.contract).createStatutoryBallotWithExemption.sendTransactionAsync(
      params.name,
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitle,
      params.details,
      params.choices,
      numberToBigNumber(params.noOfChoices),
      params.exemptedAddresses,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to create a custom statutory ballot with exemption
   */
  public createCustomStatutoryBallotWithExemption = async (
    params: StatutoryBallotWithExemptionParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.validateMaximumLimitCount();
    this.isEmptyString(params.name);
    this.isEmptyString(params.proposalTitle);
    this.isGreaterThanZero(params.commitDuration, params.revealDuration);
    return (await this.contract).createCustomStatutoryBallotWithExemption.sendTransactionAsync(
      params.name,
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitle,
      params.details,
      params.choices,
      numberToBigNumber(params.noOfChoices),
      numberToBigNumber(params.checkpointId),
      params.exemptedAddresses,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to commit the vote
   */
  public commitVote = async (params: CommitVoteParams): Promise<PolyResponse> => {
    this.checkIndexOutOfBound(params.ballotId);
    assert.assert(params.votes.length > 0, ErrorCode.InvalidData, 'Invalid vote');
    this.checkValidStage(
      {
        ballotId: params.ballotId,
      },
      BallotStage.Commit,
    );
    const caller = await this.getCallerAddress(params.txData);
    const isVoterAllowed = await this.isVoterAllowed({
      voter: caller,
      ballotId: params.ballotId,
    });
    assert.assert(isVoterAllowed, ErrorCode.PreconditionRequired, 'Invalid voter');

    const commitVote: PendingBallots = await this.pendingBallots(caller);
    const alreadyVoted = commitVote.commitCount.find(v => {
      return v === params.ballotId;
    });
    assert.assert(alreadyVoted !== undefined, ErrorCode.PreconditionRequired, 'Already voted');

    const ballot = await this.getBallotDetails({ ballotId: params.ballotId });
    assert.assert(!ballot.isCancelled, ErrorCode.PreconditionRequired, 'Cancelled ballot');

    const keccakKeys = ['uint256'];
    const bgVotes = params.votes.map(e => {
      keccakKeys.push('uint256');
      return new BigNumber(e);
    });

    const secretVote = ethersUtils.solidityKeccak256(keccakKeys, [...bgVotes, params.salt]);

    return (await this.contract).commitVote.sendTransactionAsync(
      numberToBigNumber(params.ballotId),
      secretVote,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to reveal the vote
   */
  public revealVote = async (params: RevealVoteParams): Promise<PolyResponse> => {
    this.checkIndexOutOfBound(params.ballotId);
    this.checkValidStage(
      {
        ballotId: params.ballotId,
      },
      BallotStage.Commit,
    );

    const ballot = await this.getBallotDetails({ ballotId: params.ballotId });
    assert.assert(!ballot.isCancelled, ErrorCode.PreconditionRequired, 'Cancelled ballot');

    const caller = await this.getCallerAddress(params.txData);
    const commitVote: PendingBallots = await this.pendingBallots(caller);
    const alreadyVoted = commitVote.commitCount.find(v => {
      return v === params.ballotId;
    });
    assert.assert(alreadyVoted === undefined, ErrorCode.PreconditionRequired, 'Secret vote not available');

    let choiceCount = 0;
    for (let i = 0; i < ballot.totalProposals - 1; i += 1) {
      const noOfChoice = ballot.proposalChoicesCounts[i];
      choiceCount += noOfChoice === 0 ? 3 : noOfChoice;
    }
    assert.assert(choiceCount === params.choices.length, ErrorCode.MismatchedArrayLength, 'Choices count mismatch');

    const getVoteCommitEvents = await this.getLogsAsync({
      eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.VoteCommit,
      indexFilterValues: { _voter: caller },
    });

    const args = _.map(getVoteCommitEvents, e => {
      return e.args;
    });

    const onlyBallot = _.filter(args, e => {
      /* eslint-disable no-underscore-dangle */
      return e._ballotId.toNumber() === params.ballotId;
    });

    const keccakKeys = ['uint256'];
    params.choices.forEach(() => {
      keccakKeys.push('uint256');
    });
    const hash = ethersUtils.solidityKeccak256(keccakKeys, params.choices.concat(params.salt));
    assert.assert(onlyBallot[0]._secretHash === hash, ErrorCode.InvalidData, 'Invalid vote');

    this.unsubscribeAll();

    return (await this.contract).revealVote.sendTransactionAsync(
      numberToBigNumber(params.ballotId),
      params.choices.map(v => numberToBigNumber(v)),
      numberToBigNumber(params.salt),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Allows the token issuer to scrapped down a ballot
   */
  public cancelBallot = async (params: CancelBallotParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.checkIndexOutOfBound(params.ballotId);

    const ballot = await this.getBallotDetails({ ballotId: params.ballotId });
    const now = new Date();
    now.setSeconds(now.getSeconds() + ballot.commitDuration + ballot.revealDuration);
    assert.assert(now <= ballot.startTime, ErrorCode.PreconditionRequired, 'Already ended');

    assert.assert(ballot.isCancelled, ErrorCode.PreconditionRequired, 'Already cancelled');

    return (await this.contract).cancelBallot.sendTransactionAsync(
      numberToBigNumber(params.ballotId),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Change the given ballot exempted list
   */
  public changeBallotExemptedVotersList = async (
    params: ChangeBallotExemptedVotersListParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );

    await this.changeBallotExemptedVotersAssertions(params);

    return (await this.contract).changeBallotExemptedVotersList.sendTransactionAsync(
      numberToBigNumber(params.ballotId),
      params.exemptedAddress,
      params.exempt,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Change the given ballot exempted list (Multi)
   */
  public changeBallotExemptedVotersListMulti = async (
    params: ChangeBallotExemptedVotersListMultiParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );

    const assertResult = [];
    for (let i = 0; i < params.exempt.length; i += 1) {
      assertResult.push(
        this.changeBallotExemptedVotersAssertions({
          ballotId: params.ballotId,
          exemptedAddress: params.exemptedAddress[i],
          exempt: params.exempt[i],
        }),
      );
    }
    Promise.all(assertResult);

    return (await this.contract).changeBallotExemptedVotersListMulti.sendTransactionAsync(
      numberToBigNumber(params.ballotId),
      params.exemptedAddress,
      params.exempt,
      params.txData,
      params.safetyFactor,
    );
  };

  private changeBallotExemptedVotersAssertions = async (params: ChangeBallotExemptedVotersListParams) => {
    const ballot = await this.getBallotDetails({ ballotId: params.ballotId });
    assert.assert(
      ballot.currentStage === BallotStage.Prep,
      ErrorCode.PreconditionRequired,
      'Ballot is not in PREP stage',
    );
    assert.isNonZeroETHAddressHex('exemptedAddress', params.exemptedAddress);

    const exemptedVoters = await this.getExemptedVotersByBallot({ ballotId: params.ballotId });
    const found = exemptedVoters.find(e => {
      return e === params.exemptedAddress;
    });
    assert.assert(!(found === undefined) === params.exempt, ErrorCode.InvalidData, 'No change');
  };

  /**
   * Change the global exempted voters list
   */
  public changeDefaultExemptedVotersList = async (
    params: ChangeDefaultExemptedVotersListParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );

    assert.assert(!this.isAnyBallotRunning(), ErrorCode.PreconditionRequired, 'At least one ballot is running');

    assert.isNonZeroETHAddressHex('voter', params.voter);

    return (await this.contract).changeDefaultExemptedVotersList.sendTransactionAsync(
      params.voter,
      params.exempt,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Change the global exempted voters list
   */
  public changeDefaultExemptedVotersListMulti = async (
    params: ChangeDefaultExemptedVotersListMultiParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );

    assert.assert(!this.isAnyBallotRunning(), ErrorCode.PreconditionRequired, 'At least one ballot is running');

    this.isValidLength(params.voters.length, params.exempts.length);

    for (let i = 0; i < params.voters.length; i += 1) {
      assert.isNonZeroETHAddressHex('voters', params.voters[i]);
    }

    return (await this.contract).changeDefaultExemptedVotersListMulti.sendTransactionAsync(
      params.voters,
      params.exempts,
      params.txData,
      params.safetyFactor,
    );
  };

  private isAnyBallotRunning = async (): Promise<boolean> => {
    const ballots = await this.getAllBallots();
    if (ballots.length) {
      const count = ballots.length - 1;

      const currentBallotStage: Promise<BallotStage>[] = [];
      for (let i = count; i >= 0 && i < count; i -= 1) {
        currentBallotStage.push(this.getCurrentBallotStage({ ballotId: i }));
      }
      const result = await Promise.all(currentBallotStage);
      for (let i = 0; i < result.length; i += 1) {
        if (result[i] === BallotStage.Commit && result[i] === BallotStage.Reveal && !ballots[i].isCancelled) {
          return true;
        }
      }
    }
    return false;
  };

  private isGreaterThanZero = (commitDuration: number, revealDuration: number) => {
    assert.assert(commitDuration > 0 && revealDuration > 0, ErrorCode.InvalidData, 'Invalid Duration');
  };

  private isEmptyString = (title: string) => {
    assert.assert(title.length > 0, ErrorCode.InvalidData, 'Empty title');
  };

  private isValidLength = (length1: number, length2: number) => {
    assert.assert(length1 === length2, ErrorCode.InvalidData, 'Length mismatch');
  };

  private checkIndexOutOfBound = async (ballotId: number) => {
    const allBallots: Ballots[] = await this.getAllBallots();
    assert.assert(allBallots.length > ballotId, ErrorCode.InvalidData, 'Index out of bound');
  };

  private checkValidStage = async (ballot: BallotIdParams, stage: BallotStage) => {
    const currentBallotStage = await this.getCurrentBallotStage(ballot);
    assert.assert(currentBallotStage === stage, ErrorCode.InvalidData, 'Invalid stage');
  };

  private validateMaximumLimitCount = async () => {
    const allBallots: Ballots[] = await this.getAllBallots();
    assert.assert(allBallots.length < 500, ErrorCode.PreconditionRequired, 'Max Limit Reached');
  };
}

export function isAdvancedPLCRVotingCheckpoint(
  wrapper: ContractWrapper,
): wrapper is AdvancedPLCRVotingCheckpointCommon {
  return wrapper instanceof AdvancedPLCRVotingCheckpointCommon;
}
