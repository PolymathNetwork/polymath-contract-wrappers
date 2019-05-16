// ERC20DividendCheckpointWrapper test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ERC20DividendCheckpointContract, SecurityTokenContract, PolyTokenEvents } from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import ERC20DividendCheckpointWrapper from '../erc20_dividend_checkpoint_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import DividendCheckpointWrapper from '../dividend_checkpoint_wrapper';

describe('ERC20DividendCheckpointWrapper', () => {
  // ERC20 Dividend Wrapper is used as contract target here as DividendCheckpoint is abstract
  let target: ERC20DividendCheckpointWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ERC20DividendCheckpointContract;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: SecurityTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ERC20DividendCheckpointContract);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(SecurityTokenContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new ERC20DividendCheckpointWrapper(
      instance(mockedWrapper),
      myContractPromise,
      instance(mockedContractFactory),
    );
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedSecurityTokenContract);
  });

  describe('Types', () => {
    test('should extend DividendCheckpoint', async () => {
      expect(target instanceof DividendCheckpointWrapper).toBe(true);
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to Checkpoint Events', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: PolyTokenEvents.Transfer,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(
          `Expected eventName to be one of: 'ERC20DividendDeposited', 'ERC20DividendClaimed', 'ERC20DividendReclaimed', 'ERC20DividendWithholdingWithdrawn', 'SetDefaultExcludedAddresses', 'SetWithholding', 'SetWithholdingFixed', 'SetWallet', 'UpdateDividendDates', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});
