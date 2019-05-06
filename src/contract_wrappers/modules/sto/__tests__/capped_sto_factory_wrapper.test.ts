// PolymathRegistryWrapper test
import { mock, instance, reset, when, verify } from 'ts-mockito';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { CappedSTOFactoryContract, PolyTokenEvents } from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod } from '../../../../test_utils/mocked_methods';
import ContractWrapper from '../../../contract_wrapper';
import CappedSTOFactoryWrapper from '../capped_sto_factory_wrapper';

describe('FeatureRegistryWrapper', () => {
  // Declare PolyMathRegistryWrapper object
  let target: CappedSTOFactoryWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: CappedSTOFactoryContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(CappedSTOFactoryContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new CappedSTOFactoryWrapper(instance(mockedWrapper), myContractPromise);
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
  });

  describe('Types', () => {
    test('should extend ContractWrapper', async () => {
      expect(target instanceof ContractWrapper).toBe(true);
    });
  });

  describe('GetSetupCost', () => {
    test('should get the setup cost for capped STO', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSetupCost).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getSetupCost();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getSetupCost).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to FeatureRegistryEvents', async () => {
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
          `Expected eventName to be one of: 'OwnershipRenounced', 'OwnershipTransferred', 'ChangeFactorySetupFee', 'ChangeFactoryUsageFee', 'ChangeFactorySubscriptionFee', 'GenerateModuleFromFactory', 'ChangeSTVersionBound', encountered: Transfer`,
        ),
      );
    });
  });
});
