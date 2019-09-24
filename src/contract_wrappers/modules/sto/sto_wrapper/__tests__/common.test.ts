// STOWrapper test
import { mock, instance, reset, when, verify } from 'ts-mockito';
import { CappedSTOContract_3_0_0, ISecurityTokenContract_3_0_0, BigNumber, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod } from '../../../../../test_utils/mocked_methods';
import ContractFactory from '../../../../../factories/contractFactory';
import { FULL_DECIMALS, FundRaiseType, ContractVersion, Subscribe, GetLogs } from '../../../../../types';
import { ModuleCommon } from '../../../module_wrapper';
import { bigNumberToDate, weiToValue } from '../../../../../utils/convert';
import STOCommon from '../common';

describe('STO Common', () => {
  // we extend the class to be able to instance it, using the 3.0.0 CappedSTO contract since it has all common functionality
  class FakeSTO extends STOCommon {
    public contract: Promise<CappedSTOContract_3_0_0>;

    public contractVersion!: ContractVersion;

    public subscribeAsync!: Subscribe

    public getLogsAsync!: GetLogs;

    public constructor(web3Wrapper: Web3Wrapper, contract: Promise<CappedSTOContract_3_0_0>, contractFactory: ContractFactory) {
      super(web3Wrapper, contract, contractFactory);
      this.contract = contract;
    }
  }

  let target: FakeSTO;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: CappedSTOContract_3_0_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(CappedSTOContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new FakeSTO(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);
    reset(mockedSecurityTokenContract);
  });

  describe('Types', () => {
    test('should extend Module', async () => {
      expect(target instanceof ModuleCommon).toBe(true);
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
      const result = await target.fundRaiseTypes({ type: FundRaiseType.StableCoin });
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
      const result = await target.fundsRaised({ type: FundRaiseType.StableCoin });
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.fundsRaised).once();
      verify(mockedMethod.callAsync(FundRaiseType.StableCoin)).once();
    });
  });

  describe('StartTime', () => {
    test('should get the start time', async () => {
      // Value expected
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
      expect(result).toEqual(bigNumberToDate(expectedResult));
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
      expect(result).toEqual(bigNumberToDate(expectedResult));
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
      expect(result).toEqual(bigNumberToDate(expectedResult));
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
      expect(result).toEqual(expectedResult.toNumber());
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

      // Security Token, its address, and decimals mocked
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.totalTokensSold).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.totalTokensSold();
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, expectedDecimalsResult));
      // Verifications
      verify(mockedContract.totalTokensSold).once();
      verify(mockedMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
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
      const result = await target.getRaised({ type: FundRaiseType.StableCoin });
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.getRaised).once();
      verify(mockedMethod.callAsync(FundRaiseType.StableCoin)).once();
    });
  });
});
