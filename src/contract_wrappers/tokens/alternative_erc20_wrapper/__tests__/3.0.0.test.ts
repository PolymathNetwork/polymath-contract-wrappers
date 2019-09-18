import { mock, instance, reset } from 'ts-mockito';
import { Web3Wrapper, ERC20DetailedContract_3_0_0 } from '@polymathnetwork/abi-wrappers';
import AlternativeERC20Common from '../common';
import { AlternativeERC20_3_0_0 } from '../3.0.0';

describe('BlacklistTransferManager 3.0.0', () => {
  class FakeAlternativeERC20_3_0_0 extends AlternativeERC20_3_0_0 {}

  let target: FakeAlternativeERC20_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ERC20DetailedContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ERC20DetailedContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new FakeAlternativeERC20_3_0_0(instance(mockedWrapper), myContractPromise);
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
  });

  describe('Types', () => {
    test('should extend ModuleWrapper', async () => {
      expect(target instanceof AlternativeERC20Common).toBe(true);
    });
  });
});
