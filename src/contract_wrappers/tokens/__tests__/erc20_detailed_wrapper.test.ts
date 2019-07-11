// PolymathRegistryWrapper test
import { mock, instance, reset, when, verify } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ERC20DetailedContract, SecurityTokenRegistryEvents } from '@polymathnetwork/abi-wrappers';
import { BigNumber } from '@0x/utils';
import ERC20TokenWrapper from '../erc20_wrapper';
import ERC20DetailedTokenWrapper from '../erc20_detailed_wrapper';
import { MockedCallMethod } from '../../../test_utils/mocked_methods';

describe('ERC20DetailedTokenWrapper', () => {
  // Declare ERC20DetailedTokenWrapper object
  let target: ERC20DetailedTokenWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ERC20DetailedContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ERC20DetailedContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new ERC20DetailedTokenWrapper(instance(mockedWrapper), myContractPromise);
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
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.name).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.name();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.name).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('symbol', () => {
    test('should call to symbol', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.symbol).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.symbol();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.symbol).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('isValidContract', () => {
    test('should call to isValidContract', async () => {
      const expectedBNResult = new BigNumber(1);
      const expectedStringResult = 'string';

      const mockedTotalSupplyMethod = mock(MockedCallMethod);
      when(mockedContract.totalSupply).thenReturn(instance(mockedTotalSupplyMethod));
      when(mockedTotalSupplyMethod.callAsync()).thenResolve(expectedBNResult);

      const mockedSymbolMethod = mock(MockedCallMethod);
      when(mockedContract.symbol).thenReturn(instance(mockedSymbolMethod));
      when(mockedSymbolMethod.callAsync()).thenResolve(expectedStringResult);

      const mockedNameMethod = mock(MockedCallMethod);
      when(mockedContract.name).thenReturn(instance(mockedNameMethod));
      when(mockedSymbolMethod.callAsync()).thenResolve(expectedStringResult);

      const expectedIsValidResult = true;
      const result = await target.isValidContract();
      expect(result).toBe(expectedIsValidResult);

      verify(mockedContract.totalSupply).once();
      verify(mockedContract.symbol).once();
      verify(mockedContract.name).once();
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
        new Error(`Expected eventName to be one of: 'Transfer', 'Approval', encountered: ChangeExpiryLimit`),
      );
    });
  });
});
