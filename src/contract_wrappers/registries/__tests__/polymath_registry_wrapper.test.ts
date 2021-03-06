// PolymathRegistryWrapper test
import { mock, instance, reset, when, verify } from 'ts-mockito';
import {
  PolymathRegistryContract_3_0_0,
  PolyTokenEvents_3_0_0,
  PolymathRegistryEvents_3_0_0,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../test_utils/mocked_methods';
import { PolymathContract } from '../../../types';
import ContractWrapper from '../../contract_wrapper';
import PolymathRegistryWrapper from '../polymath_registry_wrapper';

describe('PolyMathRegistryWrapper', () => {
  // Declare PolyMathRegistryWrapper object
  let target: PolymathRegistryWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: PolymathRegistryContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(PolymathRegistryContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new PolymathRegistryWrapper(instance(mockedWrapper), myContractPromise);
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

  describe('GetAddress', () => {
    test('should get the address for the given contract name', async () => {
      // Address expected
      const expectedResult = '0x0123456789012345678901234567890123456789';
      // Contract requested
      const contractName = 'CustomName';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(contractName)).thenResolve(expectedResult);

      // Real call
      const result = await target.getAddress({ contractName });

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getAddress).once();
      verify(mockedMethod.callAsync(contractName)).once();
    });

    test('should get the address for the PolyToken contract', async () => {
      // Address expected
      const expectedResult = '0x0123456789012345678901234567890123456789';
      // Contract requested
      const contractName = PolymathContract.PolyToken;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(contractName)).thenResolve(expectedResult);

      // Real call
      const result = await target.getPolyTokenAddress();

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getAddress).once();
      verify(mockedMethod.callAsync(contractName)).once();
    });

    test('should get the address for the ModuleRegistry contract', async () => {
      // Address expected
      const expectedResult = '0x0123456789012345678901234567890123456789';
      // Contract requested
      const contractName = PolymathContract.ModuleRegistry;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(contractName)).thenResolve(expectedResult);

      // Real call
      const result = await target.getModuleRegistryAddress();

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getAddress).once();
      verify(mockedMethod.callAsync(contractName)).once();
    });

    test('should get the address for the FeatureRegistry contract', async () => {
      // Address expected
      const expectedResult = '0x0123456789012345678901234567890123456789';
      // Contract requested
      const contractName = PolymathContract.FeatureRegistry;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(contractName)).thenResolve(expectedResult);

      // Real call
      const result = await target.getFeatureRegistryAddress();

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getAddress).once();
      verify(mockedMethod.callAsync(contractName)).once();
    });

    test('should get the address for the SecurityTokenRegistry contract', async () => {
      // Address expected
      const expectedResult = '0x0123456789012345678901234567890123456789';
      // Contract requested
      const contractName = PolymathContract.SecurityTokenRegistry;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(contractName)).thenResolve(expectedResult);

      // Real call
      const result = await target.getSecurityTokenRegistryAddress();

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getAddress).once();
      verify(mockedMethod.callAsync(contractName)).once();
    });

    test('should get the address for the PolyUsdOracle contract', async () => {
      // Address expected
      const expectedResult = '0x0123456789012345678901234567890123456789';
      // Contract requested
      const contractName = PolymathContract.PolyUsdOracle;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(contractName)).thenResolve(expectedResult);

      // Real call
      const result = await target.getPolyUsdOracleAddress();

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getAddress).once();
      verify(mockedMethod.callAsync(contractName)).once();
    });

    test('should get the address for the EthUsdOracle contract', async () => {
      // Address expected
      const expectedResult = '0x0123456789012345678901234567890123456789';
      // Contract requested
      const contractName = PolymathContract.EthUsdOracle;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(contractName)).thenResolve(expectedResult);

      // Real call
      const result = await target.getEthUsdOracleAddress();

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getAddress).once();
      verify(mockedMethod.callAsync(contractName)).once();
    });
  });

  describe('ChangeAddress', () => {
    test.todo('should fail as newAddress is not an Eth address');

    test('should send the transaction to change the address for given params', async () => {
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
      // Mocked parameters
      const mockedParams = {
        nameKey: 'CustomName',
        newAddress: '0x0123456789012345678901234567890123456789',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.nameKey,
          mockedParams.newAddress,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeAddress(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeAddress).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.nameKey,
          mockedParams.newAddress,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();

      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to PolymathRegistryEvents', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: PolyTokenEvents_3_0_0.Transfer,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(`Expected eventName to be one of: 'ChangeAddress', 'OwnershipTransferred', encountered: Transfer`),
      );
    });

    test('should throw as indexFilterValues does not conform the schema', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: PolymathRegistryEvents_3_0_0.ChangeAddress,
        indexFilterValues: { 1: 'aValue' },
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(
          `Expected indexFilterValues to conform to schema /indexFilterValuesSchema\n` +
            `Encountered: {\n` +
            `\t"1": "aValue"\n` +
            `}\n` +
            `Validation errors: instance[1] is not exactly one from </numberSchema>,</addressSchema>,</orderHashSchema>`,
        ),
      );
    });

    test.todo(
      'should subscribe to contract event',
    ); /* , async () => {
      // Mocked parameters
      const mockedContractAddress = '0x0123456789AbCdEf67890123456789aBcDeF6789';
      const mockedParams = {
        eventName: PolymathRegistryEvents.ChangeAddress,
        indexFilterValues: { aKey: 'aValue' },
        callback: () => {},
      };
      // Stub the contract address
      when(mockedContract.address).thenReturn(mockedContractAddress);

      // Real call

      verify(mockedContract.address).once();
    });
    */
  });
});
