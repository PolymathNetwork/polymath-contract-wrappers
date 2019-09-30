// FeatureRegistryWrapper test
import { mock, instance, reset, when, verify } from 'ts-mockito';
import { FeatureRegistryContract_3_0_0, PolyTokenEvents_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../test_utils/mocked_methods';
import { Feature } from '../../../types';
import ContractWrapper from '../../contract_wrapper';
import FeatureRegistryWrapper from '../feature_registry_wrapper';

describe('FeatureRegistryWrapper', () => {
  let target: FeatureRegistryWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: FeatureRegistryContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(FeatureRegistryContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new FeatureRegistryWrapper(instance(mockedWrapper), myContractPromise);
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

  describe('GetFeatureStatus', () => {
    test('should get the feature status for the given name key', async () => {
      // Address expected
      const expectedResult = true;
      // Contract requested
      const featureName = Feature.CustomModulesAllowed.toString();
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getFeatureStatus).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(featureName)).thenResolve(expectedResult);

      // Real call
      const result = await target.getFeatureStatus({ nameKey: featureName });
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getFeatureStatus).once();
      verify(mockedMethod.callAsync(featureName)).once();
    });

    test('should get the feature status for the CustomModulesAllowed name key', async () => {
      // Address expected
      const expectedResult = true;
      // Contract requested
      const featureName = Feature.CustomModulesAllowed.toString();
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getFeatureStatus).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(featureName)).thenResolve(expectedResult);

      // Real call
      const result = await target.getCustomModulesAllowedStatus();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getFeatureStatus).once();
      verify(mockedMethod.callAsync(featureName)).once();
    });

    test('should get the feature status for the FreezeMintingAllowed name key', async () => {
      // Address expected
      const expectedResult = true;
      // Contract requested
      const featureName = Feature.FreezeMintingAllowed.toString();
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getFeatureStatus).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(featureName)).thenResolve(expectedResult);

      // Real call
      const result = await target.getFreezeMintingAllowedStatus();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getFeatureStatus).once();
      verify(mockedMethod.callAsync(featureName)).once();
    });

    describe('SetFeatureStatus', () => {
      test('should send the transaction to set the feature status', async () => {
        // Owner Address expected
        const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
        // Mocked method
        const mockedOwnerMethod = mock(MockedCallMethod);
        // Stub the method
        when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
        // Stub the request
        when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
        // Mock web3 wrapper owner
        when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
        // Address expected
        const currentFeatureStatus = false;
        // Feature name requested
        const featureName = Feature.CustomModulesAllowed.toString();
        // Mocked Get method
        const mockedGetMethod = mock(MockedCallMethod);
        // Stub the get method
        when(mockedContract.getFeatureStatus).thenReturn(instance(mockedGetMethod));
        // Stub the get request
        when(mockedGetMethod.callAsync(featureName)).thenResolve(currentFeatureStatus);

        // Mocked parameters
        const mockedParams = {
          nameKey: Feature.CustomModulesAllowed,
          newStatus: true,
          txData: {},
          safetyFactor: 10,
        };
        const expectedResult = getMockedPolyResponse();
        // Mocked method
        const mockedMethod = mock(MockedSendMethod);
        // Stub the method
        when(mockedContract.setFeatureStatus).thenReturn(instance(mockedMethod));
        // Stub the request
        when(
          mockedMethod.sendTransactionAsync(
            mockedParams.nameKey,
            mockedParams.newStatus,
            mockedParams.txData,
            mockedParams.safetyFactor,
          ),
        ).thenResolve(expectedResult);

        // Real call
        const result = await target.setFeatureStatus(mockedParams);

        // Result expectation
        expect(result).toBe(expectedResult);
        // Verifications
        verify(mockedContract.setFeatureStatus).once();
        verify(
          mockedMethod.sendTransactionAsync(
            mockedParams.nameKey,
            mockedParams.newStatus,
            mockedParams.txData,
            mockedParams.safetyFactor,
          ),
        ).once();
        verify(mockedContract.getFeatureStatus).once();
        verify(mockedGetMethod.callAsync(featureName)).once();
        verify(mockedContract.owner).once();
        verify(mockedOwnerMethod.callAsync()).once();
        verify(mockedWrapper.getAvailableAddressesAsync()).once();
      });
    });
  });
  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to FeatureRegistryEvents', async () => {
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
          `Expected eventName to be one of: 'OwnershipTransferred', 'ChangeFeatureStatus', encountered: Transfer`,
        ),
      );
    });
  });
});
