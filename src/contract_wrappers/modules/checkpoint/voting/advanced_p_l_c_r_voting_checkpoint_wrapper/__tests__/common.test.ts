// AdvancedPLCRVotingCheckpointWrapper test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import {
  AdvancedPLCRVotingCheckpointContract_3_1_0,
  ISecurityTokenContract_3_0_0,
  BigNumber,
  Web3Wrapper,
  ethersUtils,
  PolyTokenEvents_3_0_0
} from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../../../../test_utils/mocked_methods';
import { ModuleCommon } from '../../../../module_wrapper';
import ContractFactory from '../../../../../../factories/contractFactory';
import {
  weiToValue,
  numberToBigNumber,
  parseBallotStageValue,
  dateToBigNumber,
  bigNumberToDate,
} from '../../../../../../utils/convert';
import { ContractVersion } from '../../../../../../types';
import AdvancedPLCRVotingCheckpointCommon from '../common';

describe('AdvancedPLCRVotingCheckpointWrapper', () => {
  // we extend the class to be able to instance it, using the 3.1.0 AdvancedPLCRVotingCheckpoint contract since it has all common functionality
  class FakeAdvancedPLCRVotingCheckpoint extends AdvancedPLCRVotingCheckpointCommon {
    public contract: Promise<AdvancedPLCRVotingCheckpointContract_3_1_0>;

    public contractVersion!: ContractVersion;

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
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)), params.voter)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.isVoterAllowed(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.isVoterAllowed).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.ballotId)), params.voter)).once();
    });
  });

  describe('Create Statutory Ballot', () => {
    test('should createStatutoryBallot', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Get all ballots
      const expectedBallotsResult = [
        [new BigNumber(1), new BigNumber(2)],
        ['ballot one', 'ballot two'],
        [new BigNumber(2), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
        [false, true],
      ];
      const mockedBallotsMethod = mock(MockedCallMethod);
      when(mockedContract.getAllBallots).thenReturn(instance(mockedBallotsMethod));
      when(mockedBallotsMethod.callAsync()).thenResolve(expectedBallotsResult);

      const mockedParams = {
        name: 'nee ballot',
        startTime: new Date(2019, 10),
        commitDuration: 80000,
        details: 'ballot details',
        revealDuration: 3000,
        proposalTitle: 'title proposal',
        choices: 'choices',
        noOfChoices: 1,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createStatutoryBallot).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(numberToBigNumber(mockedParams.noOfChoices)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createStatutoryBallot(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createStatutoryBallot).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(numberToBigNumber(mockedParams.noOfChoices)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getAllBallots).once();
      verify(mockedBallotsMethod.callAsync()).once();
    });
  });

  describe('Create Custom Statutory Ballot', () => {
    test('should createCustomStatutoryBallot', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Get all ballots
      const expectedBallotsResult = [
        [new BigNumber(1), new BigNumber(2)],
        ['ballot one', 'ballot two'],
        [new BigNumber(2), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
        [false, true],
      ];
      const mockedBallotsMethod = mock(MockedCallMethod);
      when(mockedContract.getAllBallots).thenReturn(instance(mockedBallotsMethod));
      when(mockedBallotsMethod.callAsync()).thenResolve(expectedBallotsResult);

      const mockedParams = {
        name: 'nee ballot',
        startTime: new Date(2019, 10),
        commitDuration: 80000,
        revealDuration: 3000,
        proposalTitle: 'title proposal',
        choices: 'choices',
        noOfChoices: 1,
        checkpointId: 1,
        details: 'detail  one',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createCustomStatutoryBallot).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(numberToBigNumber(mockedParams.noOfChoices)),
          objectContaining(numberToBigNumber(mockedParams.checkpointId)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createCustomStatutoryBallot(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createCustomStatutoryBallot).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(numberToBigNumber(mockedParams.noOfChoices)),
          objectContaining(numberToBigNumber(mockedParams.checkpointId)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getAllBallots).once();
      verify(mockedBallotsMethod.callAsync()).once();
    });
  });

  describe('Create Custom Cumulative Ballot', () => {
    test('should createCustomCumulativeBallot', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Get all ballots
      const expectedBallotsResult = [
        [new BigNumber(1), new BigNumber(2)],
        ['ballot one', 'ballot two'],
        [new BigNumber(2), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
        [false, true],
      ];
      const mockedBallotsMethod = mock(MockedCallMethod);
      when(mockedContract.getAllBallots).thenReturn(instance(mockedBallotsMethod));
      when(mockedBallotsMethod.callAsync()).thenResolve(expectedBallotsResult);

      const mockedParams = {
        name: 'nee ballot',
        startTime: new Date(2019, 10),
        commitDuration: 80000,
        revealDuration: 3000,
        proposalTitle: 'title proposal',
        choices: 'choices',
        noOfChoices: [1, 2],
        checkpointId: 1,
        details: ['detail  one', 'detail two'],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createCustomCumulativeBallot).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(mockedParams.noOfChoices.map(v => numberToBigNumber(v))),
          objectContaining(numberToBigNumber(mockedParams.checkpointId)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createCustomCumulativeBallot(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createCustomCumulativeBallot).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(mockedParams.noOfChoices.map(v => numberToBigNumber(v))),
          objectContaining(numberToBigNumber(mockedParams.checkpointId)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getAllBallots).once();
      verify(mockedBallotsMethod.callAsync()).once();
    });
  });

  describe('Create Cumulative Ballot', () => {
    test('should createCumulativeBallot', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Get all ballots
      const expectedBallotsResult = [
        [new BigNumber(1), new BigNumber(2)],
        ['ballot one', 'ballot two'],
        [new BigNumber(2), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
        [false, true],
      ];
      const mockedBallotsMethod = mock(MockedCallMethod);
      when(mockedContract.getAllBallots).thenReturn(instance(mockedBallotsMethod));
      when(mockedBallotsMethod.callAsync()).thenResolve(expectedBallotsResult);

      const mockedParams = {
        name: 'nee ballot',
        startTime: new Date(2019, 10),
        commitDuration: 80000,
        revealDuration: 3000,
        proposalTitle: 'title proposal',
        choices: 'choices',
        noOfChoices: [1, 2],
        details: ['detail  one', 'detail two'],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createCumulativeBallot).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(mockedParams.noOfChoices.map(v => numberToBigNumber(v))),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createCumulativeBallot(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createCumulativeBallot).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(mockedParams.noOfChoices.map(v => numberToBigNumber(v))),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getAllBallots).once();
      verify(mockedBallotsMethod.callAsync()).once();
    });
  });

  describe('Create Custom Cumulative Ballot With Exemption Ballot', () => {
    test('should createCustomCumulativeBallotWithExemption', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Get all ballots
      const expectedBallotsResult = [
        [new BigNumber(1), new BigNumber(2)],
        ['ballot one', 'ballot two'],
        [new BigNumber(2), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
        [false, true],
      ];
      const mockedBallotsMethod = mock(MockedCallMethod);
      when(mockedContract.getAllBallots).thenReturn(instance(mockedBallotsMethod));
      when(mockedBallotsMethod.callAsync()).thenResolve(expectedBallotsResult);

      const mockedParams = {
        name: 'nee ballot',
        startTime: new Date(2019, 10),
        commitDuration: 80000,
        revealDuration: 3000,
        proposalTitle: 'title proposal',
        choices: 'choices',
        noOfChoices: [1, 2],
        checkpointId: 1,
        details: ['detail  one', 'detail two'],
        exemptedAddresses: ['0x1555555555555555555555555555555555555555', '0x2555555555555555555555555555555555555555'],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createCustomCumulativeBallotWithExemption).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(mockedParams.noOfChoices.map(v => numberToBigNumber(v))),
          objectContaining(numberToBigNumber(mockedParams.checkpointId)),
          mockedParams.exemptedAddresses,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createCustomCumulativeBallotWithExemption(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createCustomCumulativeBallotWithExemption).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(mockedParams.noOfChoices.map(v => numberToBigNumber(v))),
          objectContaining(numberToBigNumber(mockedParams.checkpointId)),
          mockedParams.exemptedAddresses,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getAllBallots).once();
      verify(mockedBallotsMethod.callAsync()).once();
    });
  });

  describe('Create Cumulative Ballot With Exemption', () => {
    test('should createCumulativeBallotWithExemption', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Get all ballots
      const expectedBallotsResult = [
        [new BigNumber(1), new BigNumber(2)],
        ['ballot one', 'ballot two'],
        [new BigNumber(2), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
        [false, true],
      ];
      const mockedBallotsMethod = mock(MockedCallMethod);
      when(mockedContract.getAllBallots).thenReturn(instance(mockedBallotsMethod));
      when(mockedBallotsMethod.callAsync()).thenResolve(expectedBallotsResult);

      const mockedParams = {
        name: 'nee ballot',
        startTime: new Date(2019, 10),
        commitDuration: 80000,
        revealDuration: 3000,
        proposalTitle: 'title proposal',
        choices: 'choices',
        noOfChoices: [1, 2],
        details: ['detail  one', 'detail two'],
        exemptedAddresses: ['0x1555555555555555555555555555555555555555', '0x2555555555555555555555555555555555555555'],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createCumulativeBallotWithExemption).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(mockedParams.noOfChoices.map(v => numberToBigNumber(v))),
          mockedParams.exemptedAddresses,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createCumulativeBallotWithExemption(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createCumulativeBallotWithExemption).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(mockedParams.noOfChoices.map(v => numberToBigNumber(v))),
          mockedParams.exemptedAddresses,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getAllBallots).once();
      verify(mockedBallotsMethod.callAsync()).once();
    });
  });

  describe('Create Statutory Ballot With Exemption', () => {
    test('should createStatutoryBallotWithExemption', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Get all ballots
      const expectedBallotsResult = [
        [new BigNumber(1), new BigNumber(2)],
        ['ballot one', 'ballot two'],
        [new BigNumber(2), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
        [false, true],
      ];
      const mockedBallotsMethod = mock(MockedCallMethod);
      when(mockedContract.getAllBallots).thenReturn(instance(mockedBallotsMethod));
      when(mockedBallotsMethod.callAsync()).thenResolve(expectedBallotsResult);

      const mockedParams = {
        name: 'nee ballot',
        startTime: new Date(2019, 10),
        commitDuration: 80000,
        revealDuration: 3000,
        proposalTitle: 'title proposal',
        choices: 'choices',
        noOfChoices: 1,
        details: 'detail  one',
        exemptedAddresses: ['0x1555555555555555555555555555555555555555', '0x2555555555555555555555555555555555555555'],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createStatutoryBallotWithExemption).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(numberToBigNumber(mockedParams.noOfChoices)),
          mockedParams.exemptedAddresses,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createStatutoryBallotWithExemption(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createStatutoryBallotWithExemption).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(numberToBigNumber(mockedParams.noOfChoices)),
          mockedParams.exemptedAddresses,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getAllBallots).once();
      verify(mockedBallotsMethod.callAsync()).once();
    });
  });

  describe('Create Custom Statutory Ballot With Exemption', () => {
    test('should createCustomStatutoryBallotWithExemption', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Get all ballots
      const expectedBallotsResult = [
        [new BigNumber(1), new BigNumber(2)],
        ['ballot one', 'ballot two'],
        [new BigNumber(2), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
        [false, true],
      ];
      const mockedBallotsMethod = mock(MockedCallMethod);
      when(mockedContract.getAllBallots).thenReturn(instance(mockedBallotsMethod));
      when(mockedBallotsMethod.callAsync()).thenResolve(expectedBallotsResult);

      const mockedParams = {
        name: 'nee ballot',
        startTime: new Date(2019, 10),
        commitDuration: 80000,
        revealDuration: 3000,
        proposalTitle: 'title proposal',
        choices: 'choices',
        noOfChoices: 1,
        details: 'detail  one',
        exemptedAddresses: ['0x1555555555555555555555555555555555555555', '0x2555555555555555555555555555555555555555'],
        checkpointId: 1,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createCustomStatutoryBallotWithExemption).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(numberToBigNumber(mockedParams.noOfChoices)),
          objectContaining(numberToBigNumber(mockedParams.checkpointId)),
          mockedParams.exemptedAddresses,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createCustomStatutoryBallotWithExemption(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createCustomStatutoryBallotWithExemption).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.commitDuration)),
          objectContaining(numberToBigNumber(mockedParams.revealDuration)),
          mockedParams.proposalTitle,
          mockedParams.details,
          mockedParams.choices,
          objectContaining(numberToBigNumber(mockedParams.noOfChoices)),
          objectContaining(numberToBigNumber(mockedParams.checkpointId)),
          mockedParams.exemptedAddresses,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getAllBallots).once();
      verify(mockedBallotsMethod.callAsync()).once();
    });
  });

  describe('Commit Vote', () => {
    test('should commitVote', async () => {
      const mockedParams = {
        ballotId: 1,
        votes: [30, 50],
        salt: 12345678,
        txData: { from: '0x2222222222222222222222222222222222222222' },
        safetyFactor: 10,
      };

      // Check valid stage
      const expectedCurrentStageResult = new BigNumber(1);
      const mockedCurrentStageMethod = mock(MockedCallMethod);
      when(mockedContract.getCurrentBallotStage).thenReturn(instance(mockedCurrentStageMethod));
      when(mockedCurrentStageMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.ballotId)))).thenResolve(
        expectedCurrentStageResult,
      );

      // Is voter allowed
      const expectedIsVoterAllowedResult = true;
      const mockedIsVoterAllowedMethod = mock(MockedCallMethod);
      when(mockedContract.isVoterAllowed).thenReturn(instance(mockedIsVoterAllowedMethod));
      when(
        mockedIsVoterAllowedMethod.callAsync(
          objectContaining(numberToBigNumber(mockedParams.ballotId)),
          mockedParams.txData.from,
        ),
      ).thenResolve(expectedIsVoterAllowedResult);

      // pending ballots
      const expectedPendingBallotsResult = [[new BigNumber(1), new BigNumber(2)], [new BigNumber(3), new BigNumber(4)]];
      const mockedPendingBallotsMethod = mock(MockedCallMethod);
      when(mockedContract.pendingBallots).thenReturn(instance(mockedPendingBallotsMethod));
      when(mockedPendingBallotsMethod.callAsync(mockedParams.txData.from)).thenResolve(expectedPendingBallotsResult);

      // get ballot details
      const expectedBallotDetailsResult = [
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
      const mockedBallotDetailsMethod = mock(MockedCallMethod);
      when(mockedContract.getBallotDetails).thenReturn(instance(mockedBallotDetailsMethod));
      when(mockedBallotDetailsMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.ballotId)))).thenResolve(
        expectedBallotDetailsResult,
      );

      // Get all ballots
      const expectedBallotsResult = [
        [new BigNumber(1), new BigNumber(2)],
        ['ballot one', 'ballot two'],
        [new BigNumber(2), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
        [false, true],
      ];
      const mockedBallotsMethod = mock(MockedCallMethod);
      when(mockedContract.getAllBallots).thenReturn(instance(mockedBallotsMethod));
      when(mockedBallotsMethod.callAsync()).thenResolve(expectedBallotsResult);

      const keccakKeys = ['uint256', 'uint256', 'uint256'];
      const bgVotes = ['30000000000000000000', '50000000000000000000'];
      const secretVote = ethersUtils.solidityKeccak256(keccakKeys, [...bgVotes, mockedParams.salt]);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.commitVote).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(numberToBigNumber(mockedParams.ballotId)),
          secretVote,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.commitVote(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.commitVote).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(numberToBigNumber(mockedParams.ballotId)),
          secretVote,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      // get all ballots
      verify(mockedContract.getAllBallots).once();
      verify(mockedBallotsMethod.callAsync()).once();
      // check valid stage
      verify(mockedContract.getCurrentBallotStage).once();
      verify(mockedCurrentStageMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.ballotId)))).once();
      // is voter allowed
      verify(mockedContract.isVoterAllowed).once();
      verify(
        mockedIsVoterAllowedMethod.callAsync(
          objectContaining(numberToBigNumber(mockedParams.ballotId)),
          mockedParams.txData.from,
        ),
      ).once();
      // pending ballots
      verify(mockedContract.pendingBallots).once();
      verify(mockedPendingBallotsMethod.callAsync(mockedParams.txData.from)).once();
      // get ballot details
      verify(mockedContract.getBallotDetails).once();
      verify(mockedBallotDetailsMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.ballotId)))).once();
    });
  });

  /*
  describe('Reveal Vote', () => {
    test('should revealVote', async () => {
      const mockedParams = {
        ballotId: 1,
        choices: [30, 50],
        salt: 12345678,
        txData: { from: '0x2222222222222222222222222222222222222222' },
        safetyFactor: 10,
      };

      // Get all ballots
      const expectedBallotsResult = [
        [new BigNumber(1), new BigNumber(2)],
        ['ballot one', 'ballot two'],
        [new BigNumber(2), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
        [false, true],
      ];
      const mockedBallotsMethod = mock(MockedCallMethod);
      when(mockedContract.getAllBallots).thenReturn(instance(mockedBallotsMethod));
      when(mockedBallotsMethod.callAsync()).thenResolve(expectedBallotsResult);

      // Check valid stage
      const expectedCurrentStageResult = new BigNumber(1);
      const mockedCurrentStageMethod = mock(MockedCallMethod);
      when(mockedContract.getCurrentBallotStage).thenReturn(instance(mockedCurrentStageMethod));
      when(mockedCurrentStageMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.ballotId)))).thenResolve(
        expectedCurrentStageResult,
      );

      // get ballot details
      const expectedBallotDetailsResult = [
        'ballot name',
        new BigNumber(1000),
        new BigNumber(1),
        dateToBigNumber(new Date(2019, 11)),
        new BigNumber(86000),
        new BigNumber(86000),
        new BigNumber(2),
        new BigNumber(1),
        new BigNumber(1),
        false,
        new BigNumber(1),
        ['first proposal'],
        [new BigNumber(1), new BigNumber(1)],
      ];
      const mockedBallotDetailsMethod = mock(MockedCallMethod);
      when(mockedContract.getBallotDetails).thenReturn(instance(mockedBallotDetailsMethod));
      when(mockedBallotDetailsMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.ballotId)))).thenResolve(
        expectedBallotDetailsResult,
      );

      // pending ballots
      const expectedPendingBallotsResult = [[new BigNumber(1), new BigNumber(2)], [new BigNumber(3), new BigNumber(4)]];
      const mockedPendingBallotsMethod = mock(MockedCallMethod);
      when(mockedContract.pendingBallots).thenReturn(instance(mockedPendingBallotsMethod));
      when(mockedPendingBallotsMethod.callAsync(mockedParams.txData.from)).thenResolve(expectedPendingBallotsResult);

      // get logs
      // TODO

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.revealVote).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(numberToBigNumber(mockedParams.ballotId)),
          objectContaining(mockedParams.choices.map(v => numberToBigNumber(v))),
          objectContaining(numberToBigNumber(mockedParams.salt)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.revealVote(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.revealVote).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(numberToBigNumber(mockedParams.ballotId)),
          objectContaining(mockedParams.choices.map(v => numberToBigNumber(v))),
          objectContaining(numberToBigNumber(mockedParams.salt)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });
  */

  describe('Cancel Ballot', () => {
    test('should cancelBallot', async () => {
        const mockedParams = {
            ballotId: 1,
            txData: {},
            safetyFactor: 10,
          };

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Get all ballots
      const expectedBallotsResult = [
        [new BigNumber(1), new BigNumber(2)],
        ['ballot one', 'ballot two'],
        [new BigNumber(2), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
        [false, true],
      ];
      const mockedBallotsMethod = mock(MockedCallMethod);
      when(mockedContract.getAllBallots).thenReturn(instance(mockedBallotsMethod));
      when(mockedBallotsMethod.callAsync()).thenResolve(expectedBallotsResult);

      // get ballot details
      const expectedBallotDetailsResult = [
        'ballot name',
        new BigNumber(1000),
        new BigNumber(1),
        dateToBigNumber(new Date(2019, 11)),
        new BigNumber(86000),
        new BigNumber(86000),
        new BigNumber(2),
        new BigNumber(1),
        new BigNumber(1),
        true,
        new BigNumber(1),
        ['first proposal'],
        [new BigNumber(1), new BigNumber(1)],
      ];
      const mockedBallotDetailsMethod = mock(MockedCallMethod);
      when(mockedContract.getBallotDetails).thenReturn(instance(mockedBallotDetailsMethod));
      when(mockedBallotDetailsMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.ballotId)))).thenResolve(
        expectedBallotDetailsResult,
      );

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.cancelBallot).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(numberToBigNumber(mockedParams.ballotId)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.cancelBallot(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.cancelBallot).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(numberToBigNumber(mockedParams.ballotId)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getAllBallots).once();
      verify(mockedBallotsMethod.callAsync()).once();
      verify(mockedContract.getBallotDetails).once();
      verify(mockedBallotDetailsMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.ballotId)))).once();
    });
  });

  describe('Change Ballot Exempted Voters List', () => {
    test('should changeBallotExemptedVotersList', async () => {
      const mockedParams = {
        ballotId: 1,
        exemptedAddress: '0x5555555555555555555555555555555555555555',
        exempt: false,
        txData: {},
        safetyFactor: 10,
      };

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // get ballot details
      const expectedBallotDetailsResult = [
        'ballot name',
        new BigNumber(1000),
        new BigNumber(1),
        dateToBigNumber(new Date(2019, 11)),
        new BigNumber(86000),
        new BigNumber(86000),
        new BigNumber(2),
        new BigNumber(1),
        new BigNumber(1),
        false,
        new BigNumber(0),
        ['first proposal'],
        [new BigNumber(1), new BigNumber(1)],
      ];
      const mockedBallotDetailsMethod = mock(MockedCallMethod);
      when(mockedContract.getBallotDetails).thenReturn(instance(mockedBallotDetailsMethod));
      when(mockedBallotDetailsMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.ballotId)))).thenResolve(
        expectedBallotDetailsResult,
      );

      // get Exempted Voters
      const expectedExemptedResult = [
        '0x2222222222222222222222222222222222222222',
        '0x3333333333333333333333333333333333333333',
      ];
      const mockedExemptedMethod = mock(MockedCallMethod);
      when(mockedContract.getExemptedVotersByBallot).thenReturn(instance(mockedExemptedMethod));
      when(mockedExemptedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.ballotId)))).thenResolve(expectedExemptedResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeBallotExemptedVotersList).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(numberToBigNumber(mockedParams.ballotId)),
          mockedParams.exemptedAddress,
          mockedParams.exempt,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeBallotExemptedVotersList(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeBallotExemptedVotersList).once();
      verify(
        mockedMethod.sendTransactionAsync(
            objectContaining(numberToBigNumber(mockedParams.ballotId)),
            mockedParams.exemptedAddress,
            mockedParams.exempt,
            mockedParams.txData,
            mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getBallotDetails).once();
      verify(mockedBallotDetailsMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.ballotId)))).once();
      verify(mockedContract.getExemptedVotersByBallot).once();
      verify(mockedExemptedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.ballotId)))).once();
    });
  });

  describe('Change Ballot Exempted Voters List Multi', () => {
    test('should changeBallotExemptedVotersListMulti', async () => {
      const mockedParams = {
        ballotId: 1,
        exemptedAddress: ['0x5555555555555555555555555555555555555555', '0x4555555555555555555555555555555555555555'],
        exempt: [false, false],
        txData: {},
        safetyFactor: 10,
      };

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // get ballot details
      const expectedBallotDetailsResult = [
        'ballot name',
        new BigNumber(1000),
        new BigNumber(1),
        dateToBigNumber(new Date(2019, 11)),
        new BigNumber(86000),
        new BigNumber(86000),
        new BigNumber(2),
        new BigNumber(1),
        new BigNumber(1),
        false,
        new BigNumber(0),
        ['first proposal'],
        [new BigNumber(1), new BigNumber(1)],
      ];
      const mockedBallotDetailsMethod = mock(MockedCallMethod);
      when(mockedContract.getBallotDetails).thenReturn(instance(mockedBallotDetailsMethod));
      when(mockedBallotDetailsMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.ballotId)))).thenResolve(
        expectedBallotDetailsResult,
      );

      // get Exempted Voters
      const expectedExemptedResult = [
        '0x2222222222222222222222222222222222222222',
        '0x3333333333333333333333333333333333333333',
      ];
      const mockedExemptedMethod = mock(MockedCallMethod);
      when(mockedContract.getExemptedVotersByBallot).thenReturn(instance(mockedExemptedMethod));
      when(mockedExemptedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.ballotId)))).thenResolve(expectedExemptedResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeBallotExemptedVotersListMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(numberToBigNumber(mockedParams.ballotId)),
          mockedParams.exemptedAddress,
          mockedParams.exempt,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeBallotExemptedVotersListMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeBallotExemptedVotersListMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(numberToBigNumber(mockedParams.ballotId)),
          mockedParams.exemptedAddress,
          mockedParams.exempt,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getBallotDetails).twice();
      verify(mockedBallotDetailsMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.ballotId)))).twice();
    });
  });

  describe('Change Default Exempted Voters List', () => {
    test('should changeDefaultExemptedVotersList', async () => {
      const mockedParams = {
        voter: '0x5555555555555555555555555555555555555555',
        exempt: false,
        txData: {},
        safetyFactor: 10,
      };

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

    // Get all ballots
      const expectedBallotsResult = [
        [new BigNumber(1), new BigNumber(2)],
        ['ballot one', 'ballot two'],
        [new BigNumber(2), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
        [false, true],
      ];
      const mockedBallotsMethod = mock(MockedCallMethod);
      when(mockedContract.getAllBallots).thenReturn(instance(mockedBallotsMethod));
      when(mockedBallotsMethod.callAsync()).thenResolve(expectedBallotsResult);

      // get current ballot stage
      const CurrentStageParams = {
        ballotId: 1,
      };
      const expectedCurrentStageResult = new BigNumber(2);
      const mockedCurrentStageMethod = mock(MockedCallMethod);
      when(mockedContract.getCurrentBallotStage).thenReturn(instance(mockedCurrentStageMethod));
      when(mockedCurrentStageMethod.callAsync(objectContaining(numberToBigNumber(CurrentStageParams.ballotId)))).thenResolve(expectedCurrentStageResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeDefaultExemptedVotersList).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.voter,
          mockedParams.exempt,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeDefaultExemptedVotersList(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeDefaultExemptedVotersList).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.voter,
          mockedParams.exempt,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getAllBallots).once();
      verify(mockedBallotsMethod.callAsync()).once();
    });
  });

  describe('Change Default Exempted Voters List Multi', () => {
    test('should changeDefaultExemptedVotersListMulti', async () => {
      const mockedParams = {
        voters: ['0x5555555555555555555555555555555555555555', '0x4555555555555555555555555555555555555555'],
        exempts: [false, false],
        txData: {},
        safetyFactor: 10,
      };

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Get all ballots
      const expectedBallotsResult = [
        [new BigNumber(1), new BigNumber(2)],
        ['ballot one', 'ballot two'],
        [new BigNumber(2), new BigNumber(2)],
        [new BigNumber(1), new BigNumber(2)],
        [false, true],
      ];
      const mockedBallotsMethod = mock(MockedCallMethod);
      when(mockedContract.getAllBallots).thenReturn(instance(mockedBallotsMethod));
      when(mockedBallotsMethod.callAsync()).thenResolve(expectedBallotsResult);

      // get current ballot stage
      const CurrentStageParams = {
        ballotId: 1,
      };
      const expectedCurrentStageResult = new BigNumber(2);
      const mockedCurrentStageMethod = mock(MockedCallMethod);
      when(mockedContract.getCurrentBallotStage).thenReturn(instance(mockedCurrentStageMethod));
      when(mockedCurrentStageMethod.callAsync(objectContaining(numberToBigNumber(CurrentStageParams.ballotId)))).thenResolve(expectedCurrentStageResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeDefaultExemptedVotersListMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.voters,
          mockedParams.exempts,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeDefaultExemptedVotersListMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeDefaultExemptedVotersListMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.voters,
          mockedParams.exempts,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getAllBallots).once();
      verify(mockedBallotsMethod.callAsync()).once();
    });
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
