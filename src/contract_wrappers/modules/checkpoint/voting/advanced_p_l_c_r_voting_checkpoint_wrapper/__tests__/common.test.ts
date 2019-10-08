// AdvancedPLCRVotingCheckpointWrapper test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import {
  AdvancedPLCRVotingCheckpointContract_3_1_0,
  ISecurityTokenContract_3_0_0,
  BigNumber,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../../../../test_utils/mocked_methods';
import { ModuleCommon } from '../../../../module_wrapper';
import ContractFactory from '../../../../../../factories/contractFactory';
import {
  parsePermBytes32Value,
  stringArrayToBytes32Array,
  valueToWei,
  weiToValue,
  numberToBigNumber,
  parseBallotStageValue,
  dateToBigNumber,
  bigNumberToDate,
} from '../../../../../../utils/convert';
import { Perm, ContractVersion, Subscribe, GetLogs, BallotStage } from '../../../../../../types';
import AdvancedPLCRVotingCheckpointCommon from '../common';

describe('AdvancedPLCRVotingCheckpointWrapper', () => {
  // we extend the class to be able to instance it, using the 3.1.0 AdvancedPLCRVotingCheckpoint contract since it has all common functionality
  class FakeAdvancedPLCRVotingCheckpoint extends AdvancedPLCRVotingCheckpointCommon {
    public contract: Promise<AdvancedPLCRVotingCheckpointContract_3_1_0>;

    public contractVersion!: ContractVersion;

    public subscribeAsync!: Subscribe;

    public getLogsAsync!: GetLogs;

    public constructor(
      web3Wrapper: Web3Wrapper,
      contract: Promise<AdvancedPLCRVotingCheckpointContract_3_1_0>,
      contractFactory: ContractFactory,
    ) {
      super(web3Wrapper, contract, contractFactory);
      this.contract = contract;
    }
  }

  let target: FakeAdvancedPLCRVotingCheckpoint;
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
    target = new FakeAdvancedPLCRVotingCheckpoint(
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

  describe('Types', () => {
    test('should extend ModuleWrapper', async () => {
      expect(target instanceof ModuleCommon).toBe(true);
    });
  });

  describe('Get Default Exemption Voters List', () => {
    test('should getDefaultExemptionVotersList', async () => {
      // Address expected
      const expectedResult = [
        '0x2222222222222222222222222222222222222222',
        '0x3333333333333333333333333333333333333333',
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getDefaultExemptionVotersList).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getDefaultExemptionVotersList();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getDefaultExemptionVotersList).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Get Checkpoint Data', () => {
    test('should getCheckpointData', async () => {
      // Mock security token
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const expectedDecimalsResult = new BigNumber(18);
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      const mockedParams = {
        checkpointId: 2,
      };
      const expectedResult = [
        ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
        [new BigNumber(1), new BigNumber(2)],
      ];
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getCheckpointData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(new BigNumber(mockedParams.checkpointId)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.getCheckpointData(mockedParams);

      // Result expectation
      expect(result[0].investor).toBe(expectedResult[0][0]);
      expect(result[0].balance).toEqual(weiToValue(expectedResult[1][0] as BigNumber, expectedDecimalsResult));

      // Verifications
      verify(mockedContract.getCheckpointData).once();
      verify(mockedMethod.callAsync(objectContaining(new BigNumber(mockedParams.checkpointId)))).once();
      verify(mockedContract.securityToken).times(2);
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(2);
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(2);
      verify(mockedSecurityTokenContract.decimals).twice();
    });
  });

  describe('Get Pending Investor To Vote', () => {
    test('should getPendingInvestorToVote', async () => {
      const params = {
        ballotId: 1,
      };
      // Address expected
      const expectedResult = [
        '0x2222222222222222222222222222222222222222',
        '0x3333333333333333333333333333333333333333',
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getPendingInvestorToVote).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)))).thenResolve(expectedResult);

      // Real call
      const result = await target.getPendingInvestorToVote(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getPendingInvestorToVote).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)))).once();
    });
  });

  describe('Get Commited Vote Count', () => {
    test('should getCommitedVoteCount', async () => {
      const params = {
        ballotId: 1,
      };
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getCommitedVoteCount).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)))).thenResolve(expectedResult);

      // Real call
      const result = await target.getCommitedVoteCount(params);
      // Result expectation
      expect(result).toBe(expectedResult.toNumber());
      // Verifications
      verify(mockedContract.getCommitedVoteCount).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)))).once();
    });
  });

  describe('Get Allowed Voters By Ballot', () => {
    test('should getAllowedVotersByBallot', async () => {
      const params = {
        ballotId: 1,
      };
      // Address expected
      const expectedResult = [
        '0x2222222222222222222222222222222222222222',
        '0x3333333333333333333333333333333333333333',
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllowedVotersByBallot).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)))).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllowedVotersByBallot(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getAllowedVotersByBallot).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)))).once();
    });
  });

  describe('Get All Ballots', () => {
    test('should getAllBallots', async () => {
      // Address expected
      const expectedResult = [
        [new BigNumber(1), new BigNumber(2)],
        ['ballot one', 'ballot two'],
        [new BigNumber(2), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
        [false, true],
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllBallots).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllBallots();
      // Result expectation
      expect(result[0].ballotId).toBe((expectedResult[0][0] as BigNumber).toNumber());
      expect(result[0].name).toBe(expectedResult[1][0]);
      expect(result[0].totalProposal).toBe((expectedResult[2][0] as BigNumber).toNumber());
      expect(result[0].currentStage).toBe(parseBallotStageValue(expectedResult[3][0] as BigNumber));
      expect(result[0].isCancelled).toBe(expectedResult[4][0]);
      // Verifications
      verify(mockedContract.getAllBallots).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Get Exempted Voters By Ballot', () => {
    test('should getExemptedVotersByBallot', async () => {
      const params = {
        ballotId: 1,
      };
      // Address expected
      const expectedResult = [
        '0x2222222222222222222222222222222222222222',
        '0x3333333333333333333333333333333333333333',
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getExemptedVotersByBallot).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)))).thenResolve(expectedResult);

      // Real call
      const result = await target.getExemptedVotersByBallot(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getExemptedVotersByBallot).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)))).once();
    });
  });

  describe('Get Pending Ballots', () => {
    test('should pendingBallots', async () => {
      const params = '0x2222222222222222222222222222222222222222';
      // Address expected
      const expectedResult = [[new BigNumber(1), new BigNumber(2)], [new BigNumber(3), new BigNumber(4)]];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.pendingBallots).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params)).thenResolve(expectedResult);

      // Real call
      const result = await target.pendingBallots(params);
      // Result expectation
      expect(result.commitCount[0]).toBe(expectedResult[0][0].toNumber());
      expect(result.revealCount[0]).toBe(expectedResult[1][0].toNumber());
      // Verifications
      verify(mockedContract.pendingBallots).once();
      verify(mockedMethod.callAsync(params)).once();
    });
  });

  describe('Get Current Ballot Stage', () => {
    test('should getCurrentBallotStage', async () => {
      const params = {
        ballotId: 1,
      };
      // Address expected
      const expectedResult = new BigNumber(2);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getCurrentBallotStage).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)))).thenResolve(expectedResult);

      // Real call
      const result = await target.getCurrentBallotStage(params);
      // Result expectation
      expect(result).toBe(parseBallotStageValue(expectedResult));
      // Verifications
      verify(mockedContract.getCurrentBallotStage).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)))).once();
    });
  });

  describe('Get Vote Token Count', () => {
    test('should getVoteTokenCount', async () => {
      const params = {
        voter: '0x2222222222222222222222222222222222222222',
        ballotId: 1,
      };
      // Address expected
      const expectedResult = new BigNumber(2);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getVoteTokenCount).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.voter, objectContaining(numberToBigNumber(params.ballotId)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.getVoteTokenCount(params);
      // Result expectation
      expect(result).toBe(expectedResult.toNumber());
      // Verifications
      verify(mockedContract.getVoteTokenCount).once();
      verify(mockedMethod.callAsync(params.voter, objectContaining(numberToBigNumber(params.ballotId)))).once();
    });
  });

  describe('Get Ballot Results', () => {
    test('should getBallotResults', async () => {
      const params = {
        ballotId: 1,
      };

      // Address expected
      const expectedResult = [
        [new BigNumber(1), new BigNumber(2)],
        [new BigNumber(2), new BigNumber(2)],
        ['ballot one', 'ballot two'],
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getBallotResults).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)))).thenResolve(expectedResult);

      // Real call
      const result = await target.getBallotResults(params);
      // Result expectation
      expect(result[0].choicesWeighting).toBe((expectedResult[0][0] as BigNumber).toNumber());
      expect(result[0].noOfChoicesInProposal).toBe((expectedResult[1][0] as BigNumber).toNumber());
      expect(result[0].voters).toBe(expectedResult[2][0]);
      // Verifications
      verify(mockedContract.getBallotResults).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)))).once();
    });
  });

  describe('Get Ballot Details', () => {
    test('should getBallotDetails', async () => {
      const params = {
        ballotId: 1,
      };

      // Address expected
      const expectedResult = [
        'ballot name',
        new BigNumber(1000),
        new BigNumber(1),
        dateToBigNumber(new Date(2019, 11)),
        new BigNumber(86000),
        new BigNumber(86000),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        false,
        new BigNumber(1),
        ['first proposal'],
        [new BigNumber(1)],
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getBallotDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)))).thenResolve(expectedResult);

      // Real call
      const result = await target.getBallotDetails(params);
      // Result expectation
      expect(result.name).toBe(expectedResult[0]);
      expect(result.totalSupplyAtCheckpoint).toBe((expectedResult[1] as BigNumber).toNumber());
      expect(result.checkpointId).toBe((expectedResult[2] as BigNumber).toNumber());
      expect(result.startTime).toEqual(bigNumberToDate(expectedResult[3] as BigNumber));
      expect(result.commitDuration).toBe((expectedResult[4] as BigNumber).toNumber());
      expect(result.revealDuration).toBe((expectedResult[5] as BigNumber).toNumber());
      expect(result.totalProposals).toBe((expectedResult[6] as BigNumber).toNumber());
      expect(result.totalVoters).toBe((expectedResult[7] as BigNumber).toNumber());
      expect(result.commitedVoteCount).toBe((expectedResult[8] as BigNumber).toNumber());
      expect(result.isCancelled).toBe(expectedResult[9]);
      expect(result.currentStage).toBe(parseBallotStageValue(expectedResult[10] as BigNumber));
      expect(result.proposalDetails).toBe(expectedResult[11]);
      expect(result.proposalChoicesCounts[0]).toBe((expectedResult[12] as BigNumber[])[0].toNumber());
      // Verifications
      verify(mockedContract.getBallotDetails).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)))).once();
    });
  });

  describe('Get Ballots Array Length', () => {
    test('should getBallotsArrayLength', async () => {
      // Address expected
      const expectedResult = new BigNumber(5);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getBallotsArrayLength).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getBallotsArrayLength();
      // Result expectation
      expect(result).toBe(expectedResult.toNumber());
      // Verifications
      verify(mockedContract.getBallotsArrayLength).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Get Voter Allowed', () => {
    test('should isVoterAllowed', async () => {
      const params = {
        ballotId: 1,
        voter: '0x2222222222222222222222222222222222222222',
      };
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isVoterAllowed).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)), params.voter)).thenResolve(expectedResult);

      // Real call
      const result = await target.isVoterAllowed(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.isVoterAllowed).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)), params.voter)).once();
    });
  });
});
