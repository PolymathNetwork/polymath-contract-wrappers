import { mock, instance, reset } from 'ts-mockito';
import { Web3Wrapper, ManualApprovalTransferManagerContract_3_0_0 } from '@polymathnetwork/abi-wrappers';
import ContractFactory from '../../../../../factories/contractFactory';
import ManualApprovalTransferManagerCommon from '../common';
import { ManualApprovalTransferManager_3_0_0 } from '../3.0.0';

describe('ManualApprovalTransferManager 3.0.0', () => {
  // we empty-extend the mixin to be able to use the class as a type
  class FakeManualApprovalTransferManager_3_0_0 extends ManualApprovalTransferManager_3_0_0 {}

  let target: FakeManualApprovalTransferManager_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ManualApprovalTransferManagerContract_3_0_0;
  let mockedContractFactory: ContractFactory;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ManualApprovalTransferManagerContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new FakeManualApprovalTransferManager_3_0_0(
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
    test('should extend ManualApprovalTransferManagerCommon', async () => {
      expect(target instanceof ManualApprovalTransferManagerCommon).toBe(true);
    });
  });
});
