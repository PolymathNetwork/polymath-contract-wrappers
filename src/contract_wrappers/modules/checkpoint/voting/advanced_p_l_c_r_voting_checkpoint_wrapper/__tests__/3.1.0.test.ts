// RestrictedPartialSaleTransferManagerWrapper test
import { mock, instance, reset } from 'ts-mockito';
import {
  AdvancedPLCRVotingCheckpointContract_3_1_0,
  ISecurityTokenContract_3_0_0,
  PolyTokenEvents_3_0_0,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { AdvancedPLCRVotingCheckpoint_3_1_0 } from '../3.1.0';
import ContractFactory from '../../../../../../factories/contractFactory';

describe('RestrictedPartialSaleTransferManagerWrapper', () => {
  let target: AdvancedPLCRVotingCheckpoint_3_1_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: AdvancedPLCRVotingCheckpointContract_3_1_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(AdvancedPLCRVotingCheckpointContract_3_1_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new AdvancedPLCRVotingCheckpoint_3_1_0(
      instance(mockedWrapper),
      myContractPromise,
      instance(mockedContractFactory),
    );
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);
    reset(mockedSecurityTokenContract);
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to AdvancedPLCRVotingCheckpoint', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: PolyTokenEvents_3_0_0.Transfer,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(
          `Expected eventName to be one of: 'StatutoryBallotCreated', 'CumulativeBallotCreated', 'VotersExempted', 'VoteCommit', 'VoteRevealed', 'BallotCancelled', 'ChangedBallotExemptedVotersList', 'ChangedDefaultExemptedVotersList', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});
