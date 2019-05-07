// STOWrapper test
import { mock, instance, reset, when, verify } from 'ts-mockito';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { CappedSTOContract, PolyTokenEvents } from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod } from '../../../../test_utils/mocked_methods';
import ContractWrapper from '../../../contract_wrapper';
import CappedSTOWrapper from '../capped_sto_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import {FundRaiseType} from '../../../../types';

describe('STOWrapper', () => {
  // Capped STO Wrapper is used as contract target here as STOWrapper is abstract
  let target: CappedSTOWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: CappedSTOContract;
  let mockedContractFactory: ContractFactory;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(CappedSTOContract);
    mockedContractFactory = mock(ContractFactory);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new CappedSTOWrapper(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
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

  describe('FundRaiseTypes', () => {
    test('should get the boolean for fundRaiseTypes', async () => {
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.fundRaiseTypes).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(FundRaiseType.StableCoin)).thenResolve(expectedResult);

      // Real call
      const result = await target.fundRaiseTypes({type: FundRaiseType.StableCoin});
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.fundRaiseTypes).once();
      verify(mockedMethod.callAsync(FundRaiseType.StableCoin)).once();
    });
  });

  describe('FundsRaised', () => {
    test('should get the Big Number for funds raised', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.fundsRaised).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(FundRaiseType.StableCoin)).thenResolve(expectedResult);

      // Real call
      const result = await target.fundsRaised({type: FundRaiseType.StableCoin});
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.fundsRaised).once();
      verify(mockedMethod.callAsync(FundRaiseType.StableCoin)).once();
    });
  });

  describe('Paused', () => {
    test('should get isPaused', async () => {
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.paused();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.paused).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('StartTime', () => {
    test('should get the start time', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.startTime).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.startTime();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.startTime).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('EndTime', () => {
    test('should get the end time', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.endTime).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.endTime();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.endTime).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('PausedTime', () => {
    test('should get the paused time', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.pausedTime).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.pausedTime();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.pausedTime).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('InvestorCount', () => {
    test('should get the investor count', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investorCount).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.investorCount();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.investorCount).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Wallet', () => {
    test('should get the wallet address', async () => {
      // Address expected
      const expectedResult = '0x1234567890123456789012345678901234567890';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.wallet).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.wallet();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.wallet).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('TotalTokensSold', () => {
    test('should get the total of tokens sold', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.totalTokensSold).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.totalTokensSold();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.totalTokensSold).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetRaised', () => {
    test('should getRaised', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getRaised).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(FundRaiseType.StableCoin)).thenResolve(expectedResult);

      // Real call
      const result = await target.getRaised({type: FundRaiseType.StableCoin});
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getRaised).once();
      verify(mockedMethod.callAsync(FundRaiseType.StableCoin)).once();
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
          `Expected eventName to be one of: 'TokenPurchase', 'SetAllowBeneficialInvestments', 'SetFundRaiseTypes', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});
