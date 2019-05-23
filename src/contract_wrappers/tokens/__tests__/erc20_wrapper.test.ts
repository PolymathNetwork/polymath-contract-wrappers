// PolymathRegistryWrapper test
import { BigNumber } from '@0x/utils';
import { mock, instance, reset, when, verify } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { DetailedERC20Contract } from '@polymathnetwork/abi-wrappers';
import ContractWrapper from '../../contract_wrapper';
import DetailedERC20Wrapper from '../detailed_erc20_wrapper';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../test_utils/mocked_methods';

describe('ERC20TokenWrapper', () => {
  // Declare ERC20TokenWrapper object
  let target: DetailedERC20Wrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: DetailedERC20Contract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(DetailedERC20Contract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new DetailedERC20Wrapper(instance(mockedWrapper), myContractPromise);
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

  describe('totalSupply', () => {
    test('should call to totalSupply', async () => {
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.totalSupply).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.totalSupply();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.totalSupply).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('decimals', () => {
    test('should call to decimals', async () => {
      const expectedResult = new BigNumber(0);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.decimals).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.decimals();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.decimals).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('balanceOf', () => {
    test.todo('should fail as owner is not an Eth address');
    test('should call to balanceOf', async () => {
      const expectedResult = new BigNumber(0);
      const params = {
        owner: '0x1111111111111111111111111111111111111111',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.balanceOf).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.owner)).thenResolve(expectedResult);

      // Real call
      const result = await target.balanceOf(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.balanceOf).once();
      verify(mockedMethod.callAsync(params.owner)).once();
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

  describe('allowance', () => {
    test.todo('should fail as owner is not an Eth address');
    test.todo('should fail as spender is not an Eth address');
    test('should call to allowance', async () => {
      const expectedResult = new BigNumber(0);
      const params = {
        owner: '0x1111111111111111111111111111111111111111',
        spender: '0x2222222222222222222222222222222222222222',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowance).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.owner, params.spender)).thenResolve(expectedResult);

      // Real call
      const result = await target.allowance(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.allowance).once();
      verify(mockedMethod.callAsync(params.owner, params.spender)).once();
    });
  });

  describe('isValidContract', () => {
    test('should call to isValidContract', async () => {
      const expectedBNResult = new BigNumber(1);
      const expectedStringResult = 'string';

      const mockedTotalSupplyMethod = mock(MockedCallMethod);
      when(mockedContract.totalSupply).thenReturn(instance(mockedTotalSupplyMethod));
      when(mockedTotalSupplyMethod.callAsync()).thenResolve(expectedBNResult);

      const balanceOfParams = {
        owner: '0x1111111111111111111111111111111111111111',
      };
      const mockedBalanceOfMethod = mock(MockedCallMethod);
      when(mockedContract.balanceOf).thenReturn(instance(mockedBalanceOfMethod));
      when(mockedBalanceOfMethod.callAsync(balanceOfParams.owner)).thenResolve(expectedBNResult);

      const allowanceParams = {
        owner: '0x1111111111111111111111111111111111111111',
        spender: '0x2222222222222222222222222222222222222222',
      };
      const mockedAllowanceMethod = mock(MockedCallMethod);
      when(mockedContract.allowance).thenReturn(instance(mockedAllowanceMethod));
      when(mockedAllowanceMethod.callAsync(allowanceParams.owner, allowanceParams.spender)).thenResolve(
        expectedBNResult,
      );

      const mockedSymbolMethod = mock(MockedCallMethod);
      when(mockedContract.symbol).thenReturn(instance(mockedSymbolMethod));
      when(mockedSymbolMethod.callAsync()).thenResolve(expectedStringResult);

      const expectedIsValidResult = true;
      const result = await target.isValidContract();
      expect(result).toBe(expectedIsValidResult);

      verify(mockedContract.totalSupply).once();
      verify(mockedContract.balanceOf).once();
      verify(mockedContract.allowance).once();
      verify(mockedContract.symbol).once();
    });
  });

  describe('approve', () => {
    test.todo('should fail as spender is not an Eth address');
    test('should send the transaction to approve', async () => {
      // Mocked parameters
      const mockedParams = {
        spender: '0x1111111111111111111111111111111111111111',
        value: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.approve).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.spender,
          mockedParams.value,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.approve(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.approve).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.spender,
          mockedParams.value,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });

  describe('transferFrom', () => {
    test.todo('should fail as from is not an Eth address');
    test.todo('should fail as to is not an Eth address');
    test('should send the transaction to transferFrom', async () => {
      // Mocked parameters
      const mockedParams = {
        from: '0x1111111111111111111111111111111111111111',
        to: '0x2222222222222222222222222222222222222222',
        value: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.transferFrom).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          mockedParams.to,
          mockedParams.value,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.transferFrom(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.transferFrom).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          mockedParams.to,
          mockedParams.value,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });

  describe('transfer', () => {
    test.todo('should fail as to is not an Eth address');
    test('should send the transaction to transfer', async () => {
      // Mocked parameters
      const mockedParams = {
        to: '0x2222222222222222222222222222222222222222',
        value: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.transfer).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.to,
          mockedParams.value,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.transfer(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.transfer).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.to,
          mockedParams.value,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });
});