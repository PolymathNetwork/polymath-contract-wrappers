// PolymathRegistryWrapper test
import { BigNumber } from '@0x/utils';
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { PolyTokenContract, SecurityTokenRegistryEvents } from '@polymathnetwork/abi-wrappers';
import ERC20TokenWrapper from '../erc20_wrapper';
import PolyTokenWrapper from '../poly_token_wrapper';
import { MockedSendMethod, getMockedPolyResponse, MockedCallMethod } from '../../../test_utils/mocked_methods';
import { valueToWei } from '../../../utils/convert';

describe('PolyTokenWrapper', () => {
  // Declare PolyTokenWrapper object
  let target: PolyTokenWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: PolyTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(PolyTokenContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new PolyTokenWrapper(instance(mockedWrapper), myContractPromise);
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

  describe('increaseApproval', () => {
    test.todo('should fail as spender is not an Eth address');
    test('should send the transaction to increaseApproval', async () => {
      // Mocked parameters
      const mockedParams = {
        spender: '0x1111111111111111111111111111111111111111',
        value: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.increaseApproval).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.spender,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.increaseApproval(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.increaseApproval).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.spender,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('decreaseApproval', () => {
    test.todo('should fail as spender is not an Eth address');
    test('should send the transaction to decreaseApproval', async () => {
      // Mocked parameters
      const mockedParams = {
        spender: '0x2222222222222222222222222222222222222222',
        value: new BigNumber(2),
        txData: {},
        safetyFactor: 10,
      };

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.decreaseApproval).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.spender,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.decreaseApproval(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.decreaseApproval).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.spender,
          objectContaining(valueToWei(mockedParams.value, expectedDecimalsResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('decimalFactor', () => {
    test('should call to decimalFactor', async () => {
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.decimalFactor).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.decimalFactor();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.decimalFactor).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to SecurityTokenRegistryEvents', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: SecurityTokenRegistryEvents.RegisterTicker,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(`Expected eventName to be one of: 'Transfer', 'Approval', encountered: RegisterTicker`),
      );
    });
  });
});
