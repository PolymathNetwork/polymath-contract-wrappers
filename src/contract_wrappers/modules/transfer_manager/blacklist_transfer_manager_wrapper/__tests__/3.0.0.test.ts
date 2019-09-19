import { mock, instance, reset } from 'ts-mockito';
import { Web3Wrapper, BlacklistTransferManagerContract_3_0_0 } from '@polymathnetwork/abi-wrappers';
import ContractFactory from '../../../../../factories/contractFactory';
import BlacklistTransferManagerCommon from '../common';
import { BlacklistTransferManager_3_0_0 } from '../3.0.0';

describe('BlacklistTransferManager 3.0.0', () => {
  // we empty-extend the mixin to be able to use the class as a type
  class FakeBlacklistTransferManager_3_0_0 extends BlacklistTransferManager_3_0_0 {}

  let target: FakeBlacklistTransferManager_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: BlacklistTransferManagerContract_3_0_0;
  let mockedContractFactory: ContractFactory;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(BlacklistTransferManagerContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new FakeBlacklistTransferManager_3_0_0(
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
    test('should extend ModuleWrapper', async () => {
      expect(target instanceof BlacklistTransferManagerCommon).toBe(true);
    });
  });
});