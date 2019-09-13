// EtherDividendCheckpointWrapper test
import { mock, instance, reset } from 'ts-mockito';
import {
  EtherDividendCheckpointContract_3_0_0,
  PolyTokenEvents_3_0_0,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { EtherDividendCheckpoint_3_0_0 } from '../3.0.0';
import ContractFactory from '../../../../../factories/contractFactory';
import EtherDividendCheckpointCommon from '../common';

describe('Ether Dividend Checkpoint Common', () => {
  let target: EtherDividendCheckpoint_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: EtherDividendCheckpointContract_3_0_0;
  let mockedContractFactory: ContractFactory;  

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(EtherDividendCheckpointContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new EtherDividendCheckpoint_3_0_0(
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
      expect(target instanceof EtherDividendCheckpointCommon).toBe(true);
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
          `Expected eventName to be one of: 'EtherDividendDeposited', 'EtherDividendClaimed', 'EtherDividendReclaimed', 'EtherDividendClaimFailed', 'EtherDividendWithholdingWithdrawn', 'SetDefaultExcludedAddresses', 'SetWithholding', 'SetWithholdingFixed', 'SetWallet', 'UpdateDividendDates', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});
