// ERC20DividendCheckpointWrapper test
import { mock, instance, reset } from 'ts-mockito';
import {
  ERC20DividendCheckpointContract_3_0_0,
  PolyTokenEvents_3_0_0,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { ERC20DividendCheckpoint_3_0_0 } from '../3.0.0';
import ContractFactory from '../../../../../factories/contractFactory';
import ERC20DividendCheckpointCommon from '../common';

describe('ERC20 Dividend Checkpoint Common', () => {
  let target: ERC20DividendCheckpoint_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ERC20DividendCheckpointContract_3_0_0;
  let mockedContractFactory: ContractFactory;  

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ERC20DividendCheckpointContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new ERC20DividendCheckpoint_3_0_0(
      instance(mockedWrapper),
      myContractPromise,
      instance(mockedContractFactory),
    );
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);  
  });

  describe('Types', () => {
    test('should extend DividendCheckpoint', async () => {
      expect(target instanceof ERC20DividendCheckpointCommon).toBe(true);
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to Checkpoint Events', async () => {
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
          `Expected eventName to be one of: 'ERC20DividendDeposited', 'ERC20DividendClaimed', 'ERC20DividendReclaimed', 'ERC20DividendWithholdingWithdrawn', 'SetDefaultExcludedAddresses', 'SetWithholding', 'SetWithholdingFixed', 'SetWallet', 'UpdateDividendDates', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});
