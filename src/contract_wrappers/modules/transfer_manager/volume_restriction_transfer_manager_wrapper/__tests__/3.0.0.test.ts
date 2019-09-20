import { mock, instance, reset } from 'ts-mockito';
import { Web3Wrapper, VolumeRestrictionTMContract_3_0_0 } from '@polymathnetwork/abi-wrappers';
import ContractFactory from '../../../../../factories/contractFactory';
import VolumeRestrictionTransferManagerCommon from '../common';
import { VolumeRestrictionTransferManager_3_0_0 } from '../3.0.0';

describe('VolumeRestrictionTransferManager 3.0.0', () => {
  // we empty-extend the mixin to be able to use the class as a type
  class FakeVolumeRestrictionTransferManager_3_0_0 extends VolumeRestrictionTransferManager_3_0_0 {}

  let target: FakeVolumeRestrictionTransferManager_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: VolumeRestrictionTMContract_3_0_0;
  let mockedContractFactory: ContractFactory;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(VolumeRestrictionTMContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new FakeVolumeRestrictionTransferManager_3_0_0(
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
    test('should extend VolumeRestrictionTransferManagerCommon', async () => {
      expect(target instanceof VolumeRestrictionTransferManagerCommon).toBe(true);
    });
  });
});
