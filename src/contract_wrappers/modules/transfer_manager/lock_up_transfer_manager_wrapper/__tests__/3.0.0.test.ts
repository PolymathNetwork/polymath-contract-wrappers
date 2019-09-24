import { mock, instance, reset } from 'ts-mockito';
import { Web3Wrapper, LockUpTransferManagerContract_3_0_0, PolyTokenEvents_3_0_0 } from '@polymathnetwork/abi-wrappers';
import ContractFactory from '../../../../../factories/contractFactory';
import LockUpTransferManagerCommon from '../common';
import { LockUpTransferManager_3_0_0 } from '../3.0.0';

describe('LockUpTransferManager 3.0.0', () => {
  // we empty-extend the mixin to be able to use the class as a type
  class FakeLockUpTransferManager_3_0_0 extends LockUpTransferManager_3_0_0 {}

  let target: FakeLockUpTransferManager_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: LockUpTransferManagerContract_3_0_0;
  let mockedContractFactory: ContractFactory;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(LockUpTransferManagerContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new FakeLockUpTransferManager_3_0_0(
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
    test('should extend LockUpTransferManagerCommon', async () => {
      expect(target instanceof LockUpTransferManagerCommon).toBe(true);
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to LockUpTransferManager', async () => {
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
          `Expected eventName to be one of: 'AddLockUpToUser', 'RemoveLockUpFromUser', 'ModifyLockUpType', 'AddNewLockUpType', 'RemoveLockUpType', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});
