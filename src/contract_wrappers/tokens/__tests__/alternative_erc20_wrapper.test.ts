// PolymathRegistryWrapper test
import { mock, instance, reset, when, verify } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { AlternativeERC20Contract, SecurityTokenRegistryEvents } from '@polymathnetwork/abi-wrappers';
import ERC20TokenWrapper from '../erc20_wrapper';
import AlternativeERC20TokenWrapper from '../alternative_erc20_wrapper';
import { MockedCallMethod } from '../../../test_utils/mocked_methods';
import { stringToBytes32, bytes32ToString } from '../../../utils/convert';

describe('AlternativeERC20TokenWrapper', () => {
  // Declare AlternativeERC20TokenWrapper object
  let target: AlternativeERC20TokenWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: AlternativeERC20Contract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(AlternativeERC20Contract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new AlternativeERC20TokenWrapper(instance(mockedWrapper), myContractPromise);
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
  });

  describe('Types', () => {
    test('should extend ERC20TokenWrapper', async () => {
      expect(target instanceof ERC20TokenWrapper).toBe(true);
    });
  });

  describe('name', () => {
    test('should call to name', async () => {
      const expectedResult = stringToBytes32('string');
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.name).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.name();
      // Result expectation
      expect(result).toBe(bytes32ToString(expectedResult));
      // Verifications
      verify(mockedContract.name).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('symbol', () => {
    test('should call to symbol', async () => {
      const expectedResult = stringToBytes32('string');
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.symbol).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.symbol();
      // Result expectation
      expect(result).toBe(bytes32ToString(expectedResult));
      // Verifications
      verify(mockedContract.symbol).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to SecurityTokenRegistryEvents', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: SecurityTokenRegistryEvents.ChangeExpiryLimit,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(`Expected eventName to be one of: 'Approval', 'Transfer', encountered: ChangeExpiryLimit`),
      );
    });
  });
});
