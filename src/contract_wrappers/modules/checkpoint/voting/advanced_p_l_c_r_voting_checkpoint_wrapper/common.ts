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
  BigNumber,
  PolyResponse,
  ethersUtils,
} from '@polymathnetwork/abi-wrappers';
import { map, find, times, constant } from 'lodash';
import { schemas } from '@0x/json-schemas';
import {
  numberToBigNumber,
  weiToValue,
  bigNumberToDate,
  parseBallotStageValue,
  dateToBigNumber,
  valueToWei,
  stringToBytes32,
  bytes32ToString,
} from '../../../../../utils/convert';
import ContractFactory from '../../../../../factories/contractFactory';
import ContractWrapper from '../../../../contract_wrapper';
import {
  ErrorCode,
  Perm,
  TxParams,
  BallotStage,
  FULL_DECIMALS,
  SubscribeAsyncParams,
  GetLogsAsyncParams,
  Subscribe,
  GetLogs,
  EventCallback,
} from '../../../../../types';
import { ModuleCommon } from '../../../module_wrapper';
import assert from '../../../../../utils/assert';

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

/**
 * @param name Name of the ballot (Should be unique)
 * @param startTime startTime of the ballot
 * @param commitDuration Unix time period till the voters commit their vote
 * @param revealDuration Unix time period till the voters reveal their vote starts when commit duration ends
 */
export interface BallotParams extends TxParams {
  name: string;
  startTime: Date;
  commitDuration: number;
  revealDuration: number;
}

/**
 * @param proposalTitles Title of proposal
 * @param proposalDetails Off-chain details related to the proposal
 * @param choices Choices of proposals
 * @param choicesCounts No. of choices (If it is 0 then it means NAY/YAY ballot type is choosen).
 */
export interface CreateStatutoryBallotParams extends BallotParams {
  proposalTitles: string[];
  proposalDetails: string;
  choices: string[];
  choicesCounts: number;
}

/**
 * @param checkpointId Valid checkpoint Id
 */
export interface CreateCustomStatutoryBallotParams extends CreateStatutoryBallotParams {
  checkpointId: number;
}

/**
 * @param proposalTitles Title of proposal
 * @param proposalDetails Off-chain details related to the proposal
 * @param choices Choices of proposals
 * @param choicesCounts Array of No. of choices (If it is 0 then it means NAY/YAY ballot type is choosen).
 */
export interface CreateCumulativeBallotParams extends BallotParams {
  proposalTitles: string[];
  proposalDetails: string[];
  choices: string[];
  choicesCounts: number[];
}

/**
 * @param checkpointId Valid checkpoint Id
 */
export interface CreateCustomCumulativeBallotParams extends CreateCumulativeBallotParams {
  checkpointId: number;
}

/**
 * @param exemptedAddresses List of addresses not allowed to vote
 */
export interface CreateCustomCumulativeBallotWithExemptionParams extends CreateCustomCumulativeBallotParams {
  exemptedAddresses: string[];
}

/**
 * @param exemptedAddresses List of addresses not allowed to vote
 */
export interface CreateCumulativeBallotWithExemptionParams extends CreateCumulativeBallotParams {
  exemptedAddresses: string[];
}

/**
 * @param exemptedAddresses List of addresses not allowed to vote
 */
export interface CreateStatutoryBallotWithExemptionParams extends CreateStatutoryBallotParams {
  exemptedAddresses: string[];
}

/**
 * @param checkpointId Valid checkpoint Id
 */
export interface CreateCustomStatutoryBallotWithExemptionParams extends CreateStatutoryBallotWithExemptionParams {
  checkpointId: number;
}

/**
 * @param ballotId Given ballot Id
 * @param votes An array  value votes
 * @param salt An 8-digit number to encode your votes
 */
export interface CommitVoteParams extends TxParams {
  ballotId: number;
  votes: number[];
  salt: number;
}

/**
 * @param ballotId Given ballot Id
 * @param choices Proposal chosen by the voter. It varies from (1 to totalProposals)
 * @param salt Used salt for hashing (unique for each user)
 */
export interface RevealVoteParams extends TxParams {
  ballotId: number;
  choices: number[];
  salt: number;
}

/**
 * @param ballotId The index of the target ballot
 */
export interface CancelBallotParams extends TxParams {
  ballotId: number;
}

/**
 * @param ballotId Given ballot Id
 * @param exemptedAddress Address of the voter
 * @param exempt Whether it is exempted or not
 */
export interface ChangeBallotExemptedVotersListParams extends TxParams {
  ballotId: number;
  exemptedAddress: string;
  exempt: boolean;
}

/**
 * @param ballotId Given ballot Id
 * @param exemptedAddresses Address of the voters
 * @param exempts Whether it is exempted or not
 */
export interface ChangeBallotExemptedVotersListMultiParams extends TxParams {
  ballotId: number;
  exemptedAddress: string[];
  exempt: boolean[];
}

/**
 * @param voter Address of the voter
 * @param exempt Whether it is exempted or not
 */
export interface ChangeDefaultExemptedVotersListParams extends TxParams {
  voter: string;
  exempt: boolean;
}

/**
 * @param voters List of voters
 * @param exempts Whether it is exempted or not
 */
export interface ChangeDefaultExemptedVotersListMultiParams extends TxParams {
  voters: string[];
  exempts: boolean[];
}

/**
 * @param checkpointId Checkpoint identifier
 */
export interface CheckpointIdParams {
  checkpointId: number;
}

/**
 * @param ballotId Given ballot Id
 */
export interface BallotIdParams {
  ballotId: number;
}

/**
 * @param voter Address of the voter (Who will vote)
 * @param ballotId Id of the ballot
 */
export interface VoteTokenCountParams {
  voter: string;
  ballotId: number;
}

/**
 * @param investor Address of the investor
 * @param balance Balance at checkpoint moment
 */
export interface CheckpointData {
  investor: string;
  balance: BigNumber;
}

/**
 * @param ballotId Id list of the ballot
 * @param name Name of the ballot
 * @param totalProposal List of the no. of the proposals in the ballot
 * @param currentStage Current stage of the ballot
 * @param isCancelled Boolean value to know the status of the ballot
 */
export interface Ballot {
  ballotId: number;
  name: string;
  totalProposal: number;
  currentStage: BallotStage;
  isCancelled: boolean;
}

/**
 * @param pendingCommitBallots Ballots list of indexes of ballots on which given voter has to commit
 * @param pendingRevealBallots Ballots list of indexes of ballots on which given voter has to reveal
 */
export interface PendingBallots {
  pendingCommitBallots: number[];
  pendingRevealBallots: number[];
}

/**
 * @param choicesWeighting Vote's weight
 * @param noOfChoicesInProposal Number of choises in the proposal
 * @param voters Voter's address
 */
export interface BallotResult {
  choicesWeighting: number[];
  noOfChoicesInProposal: number[];
  voters: string[];
}

/**
 * @param name
 * @param totalSupplyAtCheckpoint
 * @param checkpointId
 * @param startTime
 * @param commitDuration
 * @param revealDuration
 * @param totalProposals
 * @param totalVoters
 * @param commitedVoteCount
 * @param isCancelled
 * @param currentStage
 * @param proposalDetails
 * @param proposalChoicesCounts
 */
export interface BallotDetails {
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
   * Retrieves the list of investors who haven't voted yet
   * @return list of investors
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
  public getAllBallots = async (): Promise<Ballot[]> => {
    const result = await (await this.contract).getAllBallots.callAsync();
    const typedResult: Ballot[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      typedResult.push({
        ballotId: result[0][i].toNumber(),
        name: bytes32ToString(result[1][i]),
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
      pendingCommitBallots: result[0].map(v => v.toNumber()),
      pendingRevealBallots: result[1].map(v => v.toNumber()),
    };
    return typedResult;
  };

  /**
   * Used to get the current stage of the ballot
   * @return ballot state
   */
  public getCurrentBallotStage = async (params: BallotIdParams): Promise<BallotStage> => {
    const result = await (await this.contract).getCurrentBallotStage.callAsync(numberToBigNumber(params.ballotId));
    return parseBallotStageValue(result);
  };

  /**
   * Get the voting power for a voter in terms of the token
   * @return voting power
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
   * @return ballot result
   */
  public getBallotResults = async (params: BallotIdParams): Promise<BallotResult> => {
    const result = await (await this.contract).getBallotResults.callAsync(numberToBigNumber(params.ballotId));
    return {
      choicesWeighting: result[0].map(v => weiToValue(v, FULL_DECIMALS).toNumber()),
      noOfChoicesInProposal: result[1].map(v => v.toNumber()),
      voters: result[2],
    };
  };

  /**
   * Get the details of the ballot
   * @return ballot details
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
  public createStatutoryBallot = async (params: CreateStatutoryBallotParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.validateMaximumLimitCount();
    this.checkNonEmptyTitle(params.name);
    params.proposalTitles.map(t => this.checkNonEmptyTitle(t));
    this.checkPositiveDurations(params.commitDuration, params.revealDuration);
    return (await this.contract).createStatutoryBallot.sendTransactionAsync(
      stringToBytes32(params.name),
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitles.join(','),
      stringToBytes32(params.proposalDetails),
      params.choices.join(','),
      numberToBigNumber(params.choicesCounts),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to create a custom statutory ballot
   */
  public createCustomStatutoryBallot = async (params: CreateCustomStatutoryBallotParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.validateMaximumLimitCount();
    this.checkNonEmptyTitle(params.name);
    params.proposalTitles.map(t => this.checkNonEmptyTitle(t));
    this.checkPositiveDurations(params.commitDuration, params.revealDuration);
    return (await this.contract).createCustomStatutoryBallot.sendTransactionAsync(
      stringToBytes32(params.name),
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitles.join(','),
      stringToBytes32(params.proposalDetails),
      params.choices.join(','),
      numberToBigNumber(params.choicesCounts),
      numberToBigNumber(params.checkpointId),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to create a custom cumulative ballot
   */
  public createCustomCumulativeBallot = async (params: CreateCustomCumulativeBallotParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.validateMaximumLimitCount();
    this.checkNonEmptyTitle(params.name);
    params.proposalTitles.map(t => this.checkNonEmptyTitle(t));
    this.checkPositiveDurations(params.commitDuration, params.revealDuration);
    this.checkSameLength(params.choices.length, params.proposalDetails.length);
    return (await this.contract).createCustomCumulativeBallot.sendTransactionAsync(
      stringToBytes32(params.name),
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitles.join(','),
      params.proposalDetails.map(d => stringToBytes32(d)),
      params.choices.join(','),
      params.choicesCounts.map(v => numberToBigNumber(v)),
      numberToBigNumber(params.checkpointId),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to create a cumulative ballot
   */
  public createCumulativeBallot = async (params: CreateCumulativeBallotParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.validateMaximumLimitCount();
    this.checkNonEmptyTitle(params.name);
    params.proposalTitles.map(t => this.checkNonEmptyTitle(t));
    this.checkPositiveDurations(params.commitDuration, params.revealDuration);
    this.checkSameLength(params.choices.length, params.proposalDetails.length);
    return (await this.contract).createCumulativeBallot.sendTransactionAsync(
      stringToBytes32(params.name),
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitles.join(','),
      params.proposalDetails.map(v => stringToBytes32(v)),
      params.choices.join(','),
      params.choicesCounts.map(v => numberToBigNumber(v)),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to create a ballot with exemption
   */
  public createCustomCumulativeBallotWithExemption = async (
    params: CreateCustomCumulativeBallotWithExemptionParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.validateMaximumLimitCount();
    this.checkNonEmptyTitle(params.name);
    params.proposalTitles.map(t => this.checkNonEmptyTitle(t));
    this.checkPositiveDurations(params.commitDuration, params.revealDuration);
    this.checkSameLength(params.choices.length, params.proposalDetails.length);
    return (await this.contract).createCustomCumulativeBallotWithExemption.sendTransactionAsync(
      stringToBytes32(params.name),
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitles.join(','),
      params.proposalDetails.map(v => stringToBytes32(v)),
      params.choices.join(','),
      params.choicesCounts.map(v => numberToBigNumber(v)),
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
    params: CreateCumulativeBallotWithExemptionParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.validateMaximumLimitCount();
    this.checkNonEmptyTitle(params.name);
    params.proposalTitles.map(t => this.checkNonEmptyTitle(t));
    this.checkPositiveDurations(params.commitDuration, params.revealDuration);
    this.checkSameLength(params.choices.length, params.proposalDetails.length);
    return (await this.contract).createCumulativeBallotWithExemption.sendTransactionAsync(
      stringToBytes32(params.name),
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitles.join(','),
      params.proposalDetails.map(v => stringToBytes32(v)),
      params.choices.join(','),
      params.choicesCounts.map(v => numberToBigNumber(v)),
      params.exemptedAddresses,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to create a statutory ballot with exemption
   */
  public createStatutoryBallotWithExemption = async (
    params: CreateStatutoryBallotWithExemptionParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.validateMaximumLimitCount();
    this.checkNonEmptyTitle(params.name);
    params.proposalTitles.map(t => this.checkNonEmptyTitle(t));
    this.checkPositiveDurations(params.commitDuration, params.revealDuration);
    return (await this.contract).createStatutoryBallotWithExemption.sendTransactionAsync(
      stringToBytes32(params.name),
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitles.join(','),
      params.proposalDetails,
      params.choices.join(','),
      numberToBigNumber(params.choicesCounts),
      params.exemptedAddresses,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to create a custom statutory ballot with exemption
   */
  public createCustomStatutoryBallotWithExemption = async (
    params: CreateCustomStatutoryBallotWithExemptionParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.validateMaximumLimitCount();
    this.checkNonEmptyTitle(params.name);
    params.proposalTitles.map(t => this.checkNonEmptyTitle(t));
    this.checkPositiveDurations(params.commitDuration, params.revealDuration);
    return (await this.contract).createCustomStatutoryBallotWithExemption.sendTransactionAsync(
      stringToBytes32(params.name),
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.commitDuration),
      numberToBigNumber(params.revealDuration),
      params.proposalTitles.join(','),
      params.proposalDetails,
      params.choices.join(','),
      numberToBigNumber(params.choicesCounts),
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
    await this.checkIndexOutOfBound(params.ballotId);
    assert.assert(params.votes.length > 0, ErrorCode.InvalidData, 'Invalid vote');
    await this.checkValidStage(
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
    const alreadyVoted = commitVote.pendingCommitBallots.find(v => {
      return v === params.ballotId;
    });
    assert.assert(alreadyVoted !== undefined, ErrorCode.PreconditionRequired, 'Already voted');

    const ballot = await this.getBallotDetails({ ballotId: params.ballotId });
    assert.assert(!ballot.isCancelled, ErrorCode.PreconditionRequired, 'Cancelled ballot');

    const keccakKeys = ['uint256'];
    const bgVotes = params.votes.map(e => {
      keccakKeys.push('uint256');
      return valueToWei(new BigNumber(e), FULL_DECIMALS).toString();
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
    await this.checkIndexOutOfBound(params.ballotId);
    await this.checkValidStage(
      {
        ballotId: params.ballotId,
      },
      BallotStage.Reveal,
    );

    const ballot = await this.getBallotDetails({ ballotId: params.ballotId });
    assert.assert(!ballot.isCancelled, ErrorCode.PreconditionRequired, 'Cancelled ballot');

    const caller = await this.getCallerAddress(params.txData);
    const commitVote: PendingBallots = await this.pendingBallots(caller);
    const alreadyVoted = commitVote.pendingRevealBallots.find(v => {
      return v === params.ballotId;
    });
    assert.assert(alreadyVoted !== undefined, ErrorCode.PreconditionRequired, 'Secret vote not available');

    let choiceCount = 0;
    for (let i = 0; i <= ballot.totalProposals - 1; i += 1) {
      const noOfChoice = ballot.proposalChoicesCounts[i];
      choiceCount += noOfChoice === 0 ? 3 : noOfChoice;
    }
    assert.assert(choiceCount === params.choices.length, ErrorCode.MismatchedArrayLength, 'Choices count mismatch');
    const getVoteCommitEvents = await this.getLogsAsync({
      eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.VoteCommit,
      indexFilterValues: { _voter: caller },
    });

    const args = map(getVoteCommitEvents, e => {
      return e.args;
    });

    const onlyBallot = find(args, e => {
      /* eslint-disable no-underscore-dangle */
      return e._ballotId.toNumber() === params.ballotId;
    });
    assert.assert(onlyBallot !== undefined, ErrorCode.NotFound, 'Ballot id not found');

    const bgVotes = params.choices.map(e => valueToWei(new BigNumber(e), FULL_DECIMALS).toString());
    const keccakKeys = times(bgVotes.length + 1, constant('uint256'));
    const hash = ethersUtils.solidityKeccak256(keccakKeys, [...bgVotes, params.salt]);

    assert.assert(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onlyBallot!._secretHash === hash,
      ErrorCode.InvalidData,
      'Invalid vote',
    );

    this.unsubscribeAll();

    return (await this.contract).revealVote.sendTransactionAsync(
      numberToBigNumber(params.ballotId),
      params.choices.map(v => new BigNumber(valueToWei(new BigNumber(v), FULL_DECIMALS).toString())),
      numberToBigNumber(params.salt),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Allows the token issuer to cancel a ballot
   */
  public cancelBallot = async (params: CancelBallotParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.checkIndexOutOfBound(params.ballotId);

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
    await Promise.all(assertResult);

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

    assert.assert(!(await this.isAnyBallotRunning()), ErrorCode.PreconditionRequired, 'At least one ballot is running');

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

    assert.assert(!(await this.isAnyBallotRunning()), ErrorCode.PreconditionRequired, 'At least one ballot is running');

    this.checkSameLength(params.voters.length, params.exempts.length);

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

  private checkPositiveDurations = (commitDuration: number, revealDuration: number) => {
    assert.assert(commitDuration > 0 && revealDuration > 0, ErrorCode.InvalidData, 'Invalid Duration');
  };

  private checkNonEmptyTitle = (title: string) => {
    assert.assert(title.length > 0, ErrorCode.InvalidData, 'Empty title');
  };

  private checkSameLength = (length1: number, length2: number) => {
    assert.assert(length1 === length2, ErrorCode.InvalidData, 'Length mismatch');
  };

  private checkIndexOutOfBound = async (ballotId: number) => {
    const allBallots: Ballot[] = await this.getAllBallots();
    assert.assert(allBallots.length > ballotId, ErrorCode.InvalidData, 'Index out of bounds');
  };

  private checkValidStage = async (ballot: BallotIdParams, stage: BallotStage) => {
    const currentBallotStage = await this.getCurrentBallotStage(ballot);
    assert.assert(currentBallotStage === stage, ErrorCode.InvalidData, 'Invalid stage');
  };

  private validateMaximumLimitCount = async () => {
    const allBallots: Ballot[] = await this.getAllBallots();
    assert.assert(allBallots.length < 500, ErrorCode.PreconditionRequired, 'Max Limit Reached');
  };

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

export function isAdvancedPLCRVotingCheckpoint(
  wrapper: ContractWrapper,
): wrapper is AdvancedPLCRVotingCheckpointCommon {
  return wrapper instanceof AdvancedPLCRVotingCheckpointCommon;
}
