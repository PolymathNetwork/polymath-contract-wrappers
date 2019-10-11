// AdvancedPLCRVotingCheckpointWrapper test
import { mock, instance, reset } from 'ts-mockito';
import {
  AdvancedPLCRVotingCheckpointContract_3_1_0,
  ISecurityTokenContract_3_0_0,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import AdvancedPLCRVotingCheckpointCommon from '../common';
import { AdvancedPLCRVotingCheckpoint_3_1_0 } from '../3.1.0';
import ContractFactory from '../../../../../../factories/contractFactory';

describe('AdvancedPLCRVotingCheckpointWrapper', () => {
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

  describe('Types', () => {
    test('should extend AdvancedPLCRVotingCheckpointCommon', async () => {
      expect(target instanceof AdvancedPLCRVotingCheckpointCommon).toBe(true);
    });
  });
});
