// USDTieredSTOWrapper test
import { instance, mock, objectContaining, reset, verify, when } from 'ts-mockito';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import {
  PolyTokenEvents,
  SecurityTokenContract,
  DetailedERC20Contract,
  USDTieredSTOContract,
  PolyTokenContract,
} from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import USDTieredSTOWrapper from '../usd_tiered_sto_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import STOWrapper from '../sto_wrapper';
import {
  dateToBigNumber,
  numberToBigNumber,
  valueArrayToWeiArray,
  valueToWei,
  weiArrayToValueArray,
  weiToValue,
} from '../../../../utils/convert';
import { FULL_DECIMALS, FundRaiseType } from '../../../../types';

describe('USDTieredSTOWrapper', () => {
  // Capped STO Wrapper is used as contract target here as STOWrapper is abstract
  let target: USDTieredSTOWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: USDTieredSTOContract;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: SecurityTokenContract;
  let mockedDetailedERC20Contract: DetailedERC20Contract;
  let mockedPolyTokenContract: PolyTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(USDTieredSTOContract);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(SecurityTokenContract);
    mockedDetailedERC20Contract = mock(DetailedERC20Contract);
    mockedPolyTokenContract = mock(PolyTokenContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new USDTieredSTOWrapper(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedSecurityTokenContract);
    reset(mockedContractFactory);
    reset(mockedDetailedERC20Contract);
    reset(mockedPolyTokenContract);
  });

  describe('Types', () => {
    test('should extend STOWrapper', async () => {
      expect(target instanceof STOWrapper).toBe(true);
    });
  });

  describe('InvestorsList', () => {
    test('should get address in investors list', async () => {
      // Address expected
      const expectedResult = '0x1111111111111111111111111111111111111111';
      const params = { investorIndex: 1 };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investorsList).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.investorIndex)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.investorsList(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.investorsList).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.investorIndex)))).once();
    });
  });

  describe('AllowBeneficialInvestments', () => {
    test('should get boolean of allowBeneficialInvestments', async () => {
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowBeneficialInvestments).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.allowBeneficialInvestments();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.allowBeneficialInvestments).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('FinalAmountReturned', () => {
    test('should get bigNumber of finalAmountReturned', async () => {
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
      when(mockedContract.finalAmountReturned).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.finalAmountReturned();
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, expectedDecimalsResult));
      // Verifications
      verify(mockedContract.finalAmountReturned).once();
      verify(mockedMethod.callAsync()).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('Investors', () => {
    test('should get investor info', async () => {
      const investorAddress = '0x1111111111111111111111111111111111111111';
      const expectedResult = [new BigNumber(1), new BigNumber(1), new BigNumber(1)];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investors).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(investorAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.investors({ investorAddress });
      // Result expectation
      expect(result.accredited).toEqual(!expectedResult[0].isZero());
      expect(result.nonAccreditedLimitUSDOverride).toEqual(weiToValue(expectedResult[2], FULL_DECIMALS));

      // Verifications
      verify(mockedContract.investors).once();
      verify(mockedMethod.callAsync(investorAddress)).once();
    });
  });

  describe('InvestorInvested', () => {
    test('should get amount of investorInvested', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      const params = {
        investorAddress: '0x1111111111111111111111111111111111111111',
        fundRaiseType: FundRaiseType.ETH,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investorInvested).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.investorAddress, params.fundRaiseType)).thenResolve(expectedResult);

      // Real call
      const result = await target.investorInvested(params);
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.investorInvested).once();
      verify(mockedMethod.callAsync(params.investorAddress, params.fundRaiseType)).once();
    });
  });

  describe('USDTokenEnabled', () => {
    test('should get boolean of usdTokenEnabled', async () => {
      // Result expected
      const expectedResult = true;
      const params = {
        stableCoinAddress: '0x1111111111111111111111111111111111111111',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.usdTokenEnabled).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.stableCoinAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.usdTokenEnabled(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.usdTokenEnabled).once();
      verify(mockedMethod.callAsync(params.stableCoinAddress)).once();
    });
  });

  describe('USDTokens', () => {
    test('should get address in USDTokens', async () => {
      // Address expected
      const expectedResult = '0x1111111111111111111111111111111111111111';
      const params = { usdTokenIndex: 1 };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.usdTokens).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.usdTokenIndex)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.usdTokens(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.usdTokens).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.usdTokenIndex)))).once();
    });
  });

  describe('InvestorInvestedUSD', () => {
    test('should get address in USDTokens', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      const params = { investorAddress: '0x1111111111111111111111111111111111111111' };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investorInvestedUSD).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.investorAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.investorInvestedUSD(params);
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.investorInvestedUSD).once();
      verify(mockedMethod.callAsync(params.investorAddress)).once();
    });
  });

  describe('Change AllowBeneficialInvestments', () => {
    test('should change allowBeneficialInvestments', async () => {
      // Address expected
      const expectedAllowBeneficialInvestmentResult = true;
      // Mocked method
      const mockedAllowBeneficialInvestmentMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowBeneficialInvestments).thenReturn(instance(mockedAllowBeneficialInvestmentMethod));
      // Stub the request
      when(mockedAllowBeneficialInvestmentMethod.callAsync()).thenResolve(expectedAllowBeneficialInvestmentResult);

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);

      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        allowBeneficialInvestments: false,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeAllowBeneficialInvestments).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.allowBeneficialInvestments,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeAllowBeneficialInvestments(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeAllowBeneficialInvestments).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.allowBeneficialInvestments,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedAllowBeneficialInvestmentMethod.callAsync()).once();
      verify(mockedContract.allowBeneficialInvestments).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('BuyWithETHLimited', () => {
    test('should buyWithETHRateLimited', async () => {
      const investorAddress = '0x1111111111111111111111111111111111111111';

      // Address expected
      const expectedAllowBeneficialInvestmentResult = false;
      // Mocked method
      const mockedAllowBeneficialInvestmentMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowBeneficialInvestments).thenReturn(instance(mockedAllowBeneficialInvestmentMethod));
      // Stub the request
      when(mockedAllowBeneficialInvestmentMethod.callAsync()).thenResolve(expectedAllowBeneficialInvestmentResult);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([investorAddress]);
      const expectedETHBalanceResult = valueToWei(new BigNumber(100), FULL_DECIMALS);
      when(mockedWrapper.getBalanceInWeiAsync(investorAddress)).thenResolve(expectedETHBalanceResult);

      // Pause Address expected
      const expectedPausedResult = false;
      // Mocked method
      const mockedPausedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPausedMethod));
      // Stub the request
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // Mock getRate
      const expectedGetRateResult = new BigNumber(1);
      // Mocked method
      const mockedGetRateMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getRate).thenReturn(instance(mockedGetRateMethod));
      // Stub the request
      when(mockedGetRateMethod.callAsync(FundRaiseType.ETH)).thenResolve(expectedGetRateResult);

      // Mock investorInvestedUSD
      const expectedInvestorInvestedUSDResult = new BigNumber(10);
      // Mocked method
      const mockedInvestorInvestedUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investorInvestedUSD).thenReturn(instance(mockedInvestorInvestedUSDMethod));
      // Stub the request
      when(mockedInvestorInvestedUSDMethod.callAsync(investorAddress)).thenResolve(expectedInvestorInvestedUSDResult);

      // Mock minimumInvestmentUSD
      const expectedMinimumInvestmentUSDResult = new BigNumber(1);
      // Mocked method
      const mockedMinimumInvestmentUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.minimumInvestmentUSD).thenReturn(instance(mockedMinimumInvestmentUSDMethod));
      // Stub the request
      when(mockedMinimumInvestmentUSDMethod.callAsync()).thenResolve(expectedMinimumInvestmentUSDResult);

      // Mock investors
      const expectedInvestorsResult = [new BigNumber(1), new BigNumber(1), new BigNumber(0)];
      // Mocked method
      const mockedInvestorsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investors).thenReturn(instance(mockedInvestorsMethod));
      // Stub the request
      when(mockedInvestorsMethod.callAsync(investorAddress)).thenResolve(expectedInvestorsResult);

      // Mock nonAccreditedLimitUSD
      const expectedNonAccreditedLimitUSDResult = new BigNumber(100);
      // Mocked method
      const mockedNonAccreditedLimitUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.nonAccreditedLimitUSD).thenReturn(instance(mockedNonAccreditedLimitUSDMethod));
      // Stub the request
      when(mockedNonAccreditedLimitUSDMethod.callAsync()).thenResolve(expectedNonAccreditedLimitUSDResult);

      // Mock isOpen
      const expectedIsOpenResult = true;
      // Mocked method
      const mockedIsOpenMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isOpen).thenReturn(instance(mockedIsOpenMethod));
      // Stub the request
      when(mockedIsOpenMethod.callAsync()).thenResolve(expectedIsOpenResult);

      // Mock STO Details
      const expectedStartTime = new Date(2025, 1);
      const expectedEndTime = new Date(2026, 1);
      const expectedSTODetailsResult = [
        dateToBigNumber(expectedStartTime),
        dateToBigNumber(expectedEndTime),
        new BigNumber(1),
        [new BigNumber(1), new BigNumber(1)],
        [new BigNumber(1), new BigNumber(1)],
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        [true, false, false],
      ];
      // Mocked method
      const mockedSTODetailsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSTODetails).thenReturn(instance(mockedSTODetailsMethod));
      // Stub the request
      when(mockedSTODetailsMethod.callAsync()).thenResolve(expectedSTODetailsResult);

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

      const mockedParams = {
        beneficiary: investorAddress,
        minTokens: new BigNumber(1),
        value: new BigNumber(10),
        txData: {},
        safetyFactor: 10,
      };
      const txPayableData = {
        ...{},
        value: valueToWei(mockedParams.value, FULL_DECIMALS),
      };

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.buyWithETHRateLimited).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          objectContaining(mockedParams.minTokens),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.buyWithETHRateLimited(mockedParams);
      // Result expectation
      expect(result).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.buyWithETHRateLimited).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          objectContaining(mockedParams.minTokens),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.paused).once();
      verify(mockedPausedMethod.callAsync()).once();
      verify(mockedContract.allowBeneficialInvestments).once();
      verify(mockedAllowBeneficialInvestmentMethod.callAsync()).once();
      verify(mockedContract.getSTODetails).once();
      verify(mockedSTODetailsMethod.callAsync()).once();
      verify(mockedContract.isOpen).once();
      verify(mockedIsOpenMethod.callAsync()).once();
      verify(mockedContract.getRate).once();
      verify(mockedGetRateMethod.callAsync(FundRaiseType.ETH)).once();
      verify(mockedContract.investorInvestedUSD).once();
      verify(mockedInvestorInvestedUSDMethod.callAsync(investorAddress)).once();
      verify(mockedContract.minimumInvestmentUSD).once();
      verify(mockedMinimumInvestmentUSDMethod.callAsync()).once();
      verify(mockedContract.nonAccreditedLimitUSD).once();
      verify(mockedNonAccreditedLimitUSDMethod.callAsync()).once();
      verify(mockedContract.investors).once();
      verify(mockedInvestorsMethod.callAsync(investorAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedWrapper.getBalanceInWeiAsync(investorAddress)).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('BuyWithPOLYRateLimited', () => {
    test('should buyWithPolyRateLimited', async () => {
      // Owner Address expected
      const investorAddress = '0x5555555555555555555555555555555555555555';

      // Result expected
      const expectedAllowBeneficialInvestmentResult = false;
      // Mocked method
      const mockedAllowBeneficialInvestmentMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowBeneficialInvestments).thenReturn(instance(mockedAllowBeneficialInvestmentMethod));
      // Stub the request
      when(mockedAllowBeneficialInvestmentMethod.callAsync()).thenResolve(expectedAllowBeneficialInvestmentResult);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([investorAddress]);

      // Pause Address expected
      const expectedPausedResult = false;
      // Mocked method
      const mockedPausedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPausedMethod));
      // Stub the request
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // Mock getRate
      const expectedGetRateResult = new BigNumber(1);
      // Mocked method
      const mockedGetRateMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getRate).thenReturn(instance(mockedGetRateMethod));
      // Stub the request
      when(mockedGetRateMethod.callAsync(FundRaiseType.POLY)).thenResolve(expectedGetRateResult);

      // Mock investorInvestedUSD
      const expectedInvestorInvestedUSDResult = new BigNumber(10);
      // Mocked method
      const mockedInvestorInvestedUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investorInvestedUSD).thenReturn(instance(mockedInvestorInvestedUSDMethod));
      // Stub the request
      when(mockedInvestorInvestedUSDMethod.callAsync(investorAddress)).thenResolve(expectedInvestorInvestedUSDResult);

      // Mock minimumInvestmentUSD
      const expectedMinimumInvestmentUSDResult = new BigNumber(1);
      // Mocked method
      const mockedMinimumInvestmentUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.minimumInvestmentUSD).thenReturn(instance(mockedMinimumInvestmentUSDMethod));
      // Stub the request
      when(mockedMinimumInvestmentUSDMethod.callAsync()).thenResolve(expectedMinimumInvestmentUSDResult);

      // Mock investors
      const expectedInvestorsResult = [new BigNumber(1), new BigNumber(1), new BigNumber(0)];
      // Mocked method
      const mockedInvestorsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investors).thenReturn(instance(mockedInvestorsMethod));
      // Stub the request
      when(mockedInvestorsMethod.callAsync(investorAddress)).thenResolve(expectedInvestorsResult);

      // Mock nonAccreditedLimitUSD
      const expectedNonAccreditedLimitUSDResult = new BigNumber(100);
      // Mocked method
      const mockedNonAccreditedLimitUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.nonAccreditedLimitUSD).thenReturn(instance(mockedNonAccreditedLimitUSDMethod));
      // Stub the request
      when(mockedNonAccreditedLimitUSDMethod.callAsync()).thenResolve(expectedNonAccreditedLimitUSDResult);

      // Mock isOpen
      const expectedIsOpenResult = true;
      // Mocked method
      const mockedIsOpenMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isOpen).thenReturn(instance(mockedIsOpenMethod));
      // Stub the request
      when(mockedIsOpenMethod.callAsync()).thenResolve(expectedIsOpenResult);

      // Mock STO Details
      const expectedStartTime = new Date(2025, 1);
      const expectedEndTime = new Date(2026, 1);
      const expectedSTODetailsResult = [
        dateToBigNumber(expectedStartTime),
        dateToBigNumber(expectedEndTime),
        new BigNumber(1),
        [new BigNumber(1), new BigNumber(1)],
        [new BigNumber(1), new BigNumber(1)],
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        [false, true, false],
      ];
      // Mocked method
      const mockedSTODetailsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSTODetails).thenReturn(instance(mockedSTODetailsMethod));
      // Stub the request
      when(mockedSTODetailsMethod.callAsync()).thenResolve(expectedSTODetailsResult);

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

      const expectedBalanceOfResult = valueToWei(new BigNumber(100), FULL_DECIMALS);
      // Setup get Security Token Address
      const mockedBalanceOfAddressMethod = mock(MockedCallMethod);
      when(mockedPolyTokenContract.balanceOf).thenReturn(instance(mockedBalanceOfAddressMethod));
      when(mockedBalanceOfAddressMethod.callAsync(investorAddress)).thenResolve(expectedBalanceOfResult);
      when(mockedContractFactory.getPolyTokenContract()).thenResolve(instance(mockedPolyTokenContract));

      const mockedParams = {
        beneficiary: investorAddress,
        investedPOLY: new BigNumber(1),
        minTokens: new BigNumber(1),
        value: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.buyWithPOLYRateLimited).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          objectContaining(valueToWei(mockedParams.investedPOLY, FULL_DECIMALS)),
          objectContaining(mockedParams.minTokens),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.buyWithPOLYRateLimited(mockedParams);
      // Result expectation
      expect(result).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.buyWithPOLYRateLimited).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          objectContaining(valueToWei(mockedParams.investedPOLY, FULL_DECIMALS)),
          objectContaining(mockedParams.minTokens),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.paused).once();
      verify(mockedPausedMethod.callAsync()).once();
      verify(mockedContract.allowBeneficialInvestments).once();
      verify(mockedAllowBeneficialInvestmentMethod.callAsync()).once();
      verify(mockedContract.getSTODetails).once();
      verify(mockedSTODetailsMethod.callAsync()).once();
      verify(mockedContract.isOpen).once();
      verify(mockedIsOpenMethod.callAsync()).once();
      verify(mockedContract.getRate).once();
      verify(mockedGetRateMethod.callAsync(FundRaiseType.POLY)).once();
      verify(mockedContract.investorInvestedUSD).once();
      verify(mockedInvestorInvestedUSDMethod.callAsync(investorAddress)).once();
      verify(mockedContract.minimumInvestmentUSD).once();
      verify(mockedMinimumInvestmentUSDMethod.callAsync()).once();
      verify(mockedContract.nonAccreditedLimitUSD).once();
      verify(mockedNonAccreditedLimitUSDMethod.callAsync()).once();
      verify(mockedContract.investors).once();
      verify(mockedInvestorsMethod.callAsync(investorAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedPolyTokenContract.balanceOf).once();
      verify(mockedBalanceOfAddressMethod.callAsync(investorAddress)).once();
      verify(mockedContractFactory.getPolyTokenContract()).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('BuyWithUSDRateLimited', () => {
    test('should buy with USDRateLimited', async () => {
      // Owner Address expected
      const investorAddress = '0x5555555555555555555555555555555555555555';

      // Address expected
      const expectedAllowBeneficialInvestmentResult = false;
      // Mocked method
      const mockedAllowBeneficialInvestmentMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowBeneficialInvestments).thenReturn(instance(mockedAllowBeneficialInvestmentMethod));
      // Stub the request
      when(mockedAllowBeneficialInvestmentMethod.callAsync()).thenResolve(expectedAllowBeneficialInvestmentResult);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([investorAddress]);

      // Pause Address expected
      const expectedPausedResult = false;
      // Mocked method
      const mockedPausedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPausedMethod));
      // Stub the request
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // Mock getRate
      const expectedGetRateResult = new BigNumber(10);
      // Mocked method
      const mockedGetRateMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getRate).thenReturn(instance(mockedGetRateMethod));
      // Stub the request
      when(mockedGetRateMethod.callAsync(FundRaiseType.StableCoin)).thenResolve(expectedGetRateResult);

      // Mock investorInvestedUSD
      const expectedInvestorInvestedUSDResult = new BigNumber(1);
      // Mocked method
      const mockedInvestorInvestedUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investorInvestedUSD).thenReturn(instance(mockedInvestorInvestedUSDMethod));
      // Stub the request
      when(mockedInvestorInvestedUSDMethod.callAsync(investorAddress)).thenResolve(expectedInvestorInvestedUSDResult);

      // Mock minimumInvestmentUSD
      const expectedMinimumInvestmentUSDResult = new BigNumber(10);
      // Mocked method
      const mockedMinimumInvestmentUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.minimumInvestmentUSD).thenReturn(instance(mockedMinimumInvestmentUSDMethod));
      // Stub the request
      when(mockedMinimumInvestmentUSDMethod.callAsync()).thenResolve(expectedMinimumInvestmentUSDResult);

      // Mock investors
      const expectedInvestorsResult = [new BigNumber(10), new BigNumber(0), new BigNumber(0)];
      // Mocked method
      const mockedInvestorsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investors).thenReturn(instance(mockedInvestorsMethod));
      // Stub the request
      when(mockedInvestorsMethod.callAsync(investorAddress)).thenResolve(expectedInvestorsResult);

      // Mock nonAccreditedLimitUSD
      const expectedNonAccreditedLimitUSDResult = new BigNumber(50000);
      // Mocked method
      const mockedNonAccreditedLimitUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.nonAccreditedLimitUSD).thenReturn(instance(mockedNonAccreditedLimitUSDMethod));
      // Stub the request
      when(mockedNonAccreditedLimitUSDMethod.callAsync()).thenResolve(expectedNonAccreditedLimitUSDResult);

      // Mock isOpen
      const expectedIsOpenResult = true;
      // Mocked method
      const mockedIsOpenMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isOpen).thenReturn(instance(mockedIsOpenMethod));
      // Stub the request
      when(mockedIsOpenMethod.callAsync()).thenResolve(expectedIsOpenResult);

      // Mock STO Details
      const expectedStartTime = new Date(2025, 1);
      const expectedEndTime = new Date(2026, 1);
      const expectedSTODetailsResult = [
        dateToBigNumber(expectedStartTime),
        dateToBigNumber(expectedEndTime),
        new BigNumber(1),
        [new BigNumber(1), new BigNumber(1)],
        [new BigNumber(1), new BigNumber(1)],
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        [false, false, true],
      ];
      // Mocked method
      const mockedSTODetailsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSTODetails).thenReturn(instance(mockedSTODetailsMethod));
      // Stub the request
      when(mockedSTODetailsMethod.callAsync()).thenResolve(expectedSTODetailsResult);

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

      // Security Token Address expected
      const expectedBalanceOfResult = valueToWei(new BigNumber(100), FULL_DECIMALS);
      const usdToken = '0x0123456789012345678901234567890123456789';
      // Setup get Security Token Address
      const mockedBalanceOfAddressMethod = mock(MockedCallMethod);
      when(mockedDetailedERC20Contract.balanceOf).thenReturn(instance(mockedBalanceOfAddressMethod));
      when(mockedBalanceOfAddressMethod.callAsync(investorAddress)).thenResolve(expectedBalanceOfResult);
      when(mockedContractFactory.getDetailedERC20Contract(usdToken)).thenResolve(instance(mockedDetailedERC20Contract));

      const mockedParams = {
        beneficiary: investorAddress,
        investedSC: new BigNumber(1),
        minTokens: new BigNumber(1),
        usdToken: '0x0123456789012345678901234567890123456789',
        value: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.buyWithUSDRateLimited).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          objectContaining(valueToWei(mockedParams.investedSC, FULL_DECIMALS)),
          objectContaining(mockedParams.minTokens),
          mockedParams.usdToken,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.buyWithUSDRateLimited(mockedParams);
      // Result expectation
      expect(result).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.buyWithUSDRateLimited).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          objectContaining(valueToWei(mockedParams.investedSC, FULL_DECIMALS)),
          objectContaining(mockedParams.minTokens),
          mockedParams.usdToken,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.paused).once();
      verify(mockedPausedMethod.callAsync()).once();
      verify(mockedContract.allowBeneficialInvestments).once();
      verify(mockedAllowBeneficialInvestmentMethod.callAsync()).once();
      verify(mockedContract.getSTODetails).once();
      verify(mockedSTODetailsMethod.callAsync()).once();
      verify(mockedContract.isOpen).once();
      verify(mockedIsOpenMethod.callAsync()).once();
      verify(mockedContract.getRate).once();
      verify(mockedGetRateMethod.callAsync(FundRaiseType.StableCoin)).once();
      verify(mockedContract.investorInvestedUSD).once();
      verify(mockedInvestorInvestedUSDMethod.callAsync(investorAddress)).once();
      verify(mockedContract.minimumInvestmentUSD).once();
      verify(mockedMinimumInvestmentUSDMethod.callAsync()).once();
      verify(mockedContract.nonAccreditedLimitUSD).once();
      verify(mockedNonAccreditedLimitUSDMethod.callAsync()).once();
      verify(mockedContract.investors).once();
      verify(mockedInvestorsMethod.callAsync(investorAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedDetailedERC20Contract.balanceOf).once();
      verify(mockedBalanceOfAddressMethod.callAsync(investorAddress)).once();
      verify(mockedContractFactory.getDetailedERC20Contract(usdToken)).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('BuyWithETH', () => {
    test('should buy with ETH', async () => {
      // Owner Address expected
      const investorAddress = '0x5555555555555555555555555555555555555555';

      // Result expected
      const expectedAllowBeneficialInvestmentResult = false;
      // Mocked method
      const mockedAllowBeneficialInvestmentMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowBeneficialInvestments).thenReturn(instance(mockedAllowBeneficialInvestmentMethod));
      // Stub the request
      when(mockedAllowBeneficialInvestmentMethod.callAsync()).thenResolve(expectedAllowBeneficialInvestmentResult);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([investorAddress]);
      const expectedETHBalanceResult = valueToWei(new BigNumber(100), FULL_DECIMALS);
      when(mockedWrapper.getBalanceInWeiAsync(investorAddress)).thenResolve(expectedETHBalanceResult);

      // Pause Address expected
      const expectedPausedResult = false;
      // Mocked method
      const mockedPausedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPausedMethod));
      // Stub the request
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // Mock getRate
      const expectedGetRateResult = new BigNumber(1);
      // Mocked method
      const mockedGetRateMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getRate).thenReturn(instance(mockedGetRateMethod));
      // Stub the request
      when(mockedGetRateMethod.callAsync(FundRaiseType.ETH)).thenResolve(expectedGetRateResult);

      // Mock investorInvestedUSD
      const expectedInvestorInvestedUSDResult = new BigNumber(10);
      // Mocked method
      const mockedInvestorInvestedUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investorInvestedUSD).thenReturn(instance(mockedInvestorInvestedUSDMethod));
      // Stub the request
      when(mockedInvestorInvestedUSDMethod.callAsync(investorAddress)).thenResolve(expectedInvestorInvestedUSDResult);

      // Mock minimumInvestmentUSD
      const expectedMinimumInvestmentUSDResult = new BigNumber(1);
      // Mocked method
      const mockedMinimumInvestmentUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.minimumInvestmentUSD).thenReturn(instance(mockedMinimumInvestmentUSDMethod));
      // Stub the request
      when(mockedMinimumInvestmentUSDMethod.callAsync()).thenResolve(expectedMinimumInvestmentUSDResult);

      // Mock investors
      const expectedInvestorsResult = [new BigNumber(1), new BigNumber(1), new BigNumber(0)];
      // Mocked method
      const mockedInvestorsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investors).thenReturn(instance(mockedInvestorsMethod));
      // Stub the request
      when(mockedInvestorsMethod.callAsync(investorAddress)).thenResolve(expectedInvestorsResult);

      // Mock nonAccreditedLimitUSD
      const expectedNonAccreditedLimitUSDResult = new BigNumber(100);
      // Mocked method
      const mockedNonAccreditedLimitUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.nonAccreditedLimitUSD).thenReturn(instance(mockedNonAccreditedLimitUSDMethod));
      // Stub the request
      when(mockedNonAccreditedLimitUSDMethod.callAsync()).thenResolve(expectedNonAccreditedLimitUSDResult);

      // Mock isOpen
      const expectedIsOpenResult = true;
      // Mocked method
      const mockedIsOpenMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isOpen).thenReturn(instance(mockedIsOpenMethod));
      // Stub the request
      when(mockedIsOpenMethod.callAsync()).thenResolve(expectedIsOpenResult);

      // Mock STO Details
      const expectedStartTime = new Date(2025, 1);
      const expectedEndTime = new Date(2026, 1);
      const expectedSTODetailsResult = [
        dateToBigNumber(expectedStartTime),
        dateToBigNumber(expectedEndTime),
        new BigNumber(1),
        [new BigNumber(1), new BigNumber(1)],
        [new BigNumber(1), new BigNumber(1)],
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        [true, false, false],
      ];
      // Mocked method
      const mockedSTODetailsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSTODetails).thenReturn(instance(mockedSTODetailsMethod));
      // Stub the request
      when(mockedSTODetailsMethod.callAsync()).thenResolve(expectedSTODetailsResult);

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

      const mockedParams = {
        beneficiary: investorAddress,
        value: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };
      const txPayableData = {
        ...{},
        value: valueToWei(mockedParams.value, FULL_DECIMALS),
      };

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.buyWithETH).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.buyWithETH(mockedParams);
      // Result expectation
      expect(result).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.buyWithETH).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.paused).once();
      verify(mockedPausedMethod.callAsync()).once();
      verify(mockedContract.allowBeneficialInvestments).once();
      verify(mockedAllowBeneficialInvestmentMethod.callAsync()).once();
      verify(mockedContract.getSTODetails).once();
      verify(mockedSTODetailsMethod.callAsync()).once();
      verify(mockedContract.isOpen).once();
      verify(mockedIsOpenMethod.callAsync()).once();
      verify(mockedContract.getRate).once();
      verify(mockedGetRateMethod.callAsync(FundRaiseType.ETH)).once();
      verify(mockedContract.investorInvestedUSD).once();
      verify(mockedInvestorInvestedUSDMethod.callAsync(investorAddress)).once();
      verify(mockedContract.minimumInvestmentUSD).once();
      verify(mockedMinimumInvestmentUSDMethod.callAsync()).once();
      verify(mockedContract.nonAccreditedLimitUSD).once();
      verify(mockedNonAccreditedLimitUSDMethod.callAsync()).once();
      verify(mockedContract.investors).once();
      verify(mockedInvestorsMethod.callAsync(investorAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedWrapper.getBalanceInWeiAsync(investorAddress)).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('BuyWithPOLY', () => {
    test('should buy with Poly', async () => {
      // Owner Address expected
      const investorAddress = '0x5555555555555555555555555555555555555555';

      // Result expected
      const expectedAllowBeneficialInvestmentResult = false;
      // Mocked method
      const mockedAllowBeneficialInvestmentMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowBeneficialInvestments).thenReturn(instance(mockedAllowBeneficialInvestmentMethod));
      // Stub the request
      when(mockedAllowBeneficialInvestmentMethod.callAsync()).thenResolve(expectedAllowBeneficialInvestmentResult);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([investorAddress]);

      // Pause Address expected
      const expectedPausedResult = false;
      // Mocked method
      const mockedPausedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPausedMethod));
      // Stub the request
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // Mock getRate
      const expectedGetRateResult = new BigNumber(1);
      // Mocked method
      const mockedGetRateMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getRate).thenReturn(instance(mockedGetRateMethod));
      // Stub the request
      when(mockedGetRateMethod.callAsync(FundRaiseType.POLY)).thenResolve(expectedGetRateResult);

      // Mock investorInvestedUSD
      const expectedInvestorInvestedUSDResult = new BigNumber(10);
      // Mocked method
      const mockedInvestorInvestedUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investorInvestedUSD).thenReturn(instance(mockedInvestorInvestedUSDMethod));
      // Stub the request
      when(mockedInvestorInvestedUSDMethod.callAsync(investorAddress)).thenResolve(expectedInvestorInvestedUSDResult);

      // Mock minimumInvestmentUSD
      const expectedMinimumInvestmentUSDResult = new BigNumber(1);
      // Mocked method
      const mockedMinimumInvestmentUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.minimumInvestmentUSD).thenReturn(instance(mockedMinimumInvestmentUSDMethod));
      // Stub the request
      when(mockedMinimumInvestmentUSDMethod.callAsync()).thenResolve(expectedMinimumInvestmentUSDResult);

      // Mock investors
      const expectedInvestorsResult = [new BigNumber(1), new BigNumber(1), new BigNumber(0)];
      // Mocked method
      const mockedInvestorsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investors).thenReturn(instance(mockedInvestorsMethod));
      // Stub the request
      when(mockedInvestorsMethod.callAsync(investorAddress)).thenResolve(expectedInvestorsResult);

      // Mock nonAccreditedLimitUSD
      const expectedNonAccreditedLimitUSDResult = new BigNumber(100);
      // Mocked method
      const mockedNonAccreditedLimitUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.nonAccreditedLimitUSD).thenReturn(instance(mockedNonAccreditedLimitUSDMethod));
      // Stub the request
      when(mockedNonAccreditedLimitUSDMethod.callAsync()).thenResolve(expectedNonAccreditedLimitUSDResult);

      // Mock isOpen
      const expectedIsOpenResult = true;
      // Mocked method
      const mockedIsOpenMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isOpen).thenReturn(instance(mockedIsOpenMethod));
      // Stub the request
      when(mockedIsOpenMethod.callAsync()).thenResolve(expectedIsOpenResult);

      // Mock STO Details
      const expectedStartTime = new Date(2025, 1);
      const expectedEndTime = new Date(2026, 1);
      const expectedSTODetailsResult = [
        dateToBigNumber(expectedStartTime),
        dateToBigNumber(expectedEndTime),
        new BigNumber(1),
        [new BigNumber(1), new BigNumber(1)],
        [new BigNumber(1), new BigNumber(1)],
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        [false, true, false],
      ];
      // Mocked method
      const mockedSTODetailsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSTODetails).thenReturn(instance(mockedSTODetailsMethod));
      // Stub the request
      when(mockedSTODetailsMethod.callAsync()).thenResolve(expectedSTODetailsResult);

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

      // Balance expected
      const expectedBalanceOfResult = valueToWei(new BigNumber(100), FULL_DECIMALS);
      // Setup get Security Token Address
      const mockedBalanceOfAddressMethod = mock(MockedCallMethod);
      when(mockedPolyTokenContract.balanceOf).thenReturn(instance(mockedBalanceOfAddressMethod));
      when(mockedBalanceOfAddressMethod.callAsync(investorAddress)).thenResolve(expectedBalanceOfResult);
      when(mockedContractFactory.getPolyTokenContract()).thenResolve(instance(mockedPolyTokenContract));

      const mockedParams = {
        beneficiary: investorAddress,
        investedPOLY: new BigNumber(1),
        value: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.buyWithPOLY).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          objectContaining(valueToWei(mockedParams.investedPOLY, FULL_DECIMALS)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.buyWithPOLY(mockedParams);
      // Result expectation
      expect(result).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.buyWithPOLY).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          objectContaining(valueToWei(mockedParams.investedPOLY, FULL_DECIMALS)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.paused).once();
      verify(mockedPausedMethod.callAsync()).once();
      verify(mockedContract.allowBeneficialInvestments).once();
      verify(mockedAllowBeneficialInvestmentMethod.callAsync()).once();
      verify(mockedContract.getSTODetails).once();
      verify(mockedSTODetailsMethod.callAsync()).once();
      verify(mockedContract.isOpen).once();
      verify(mockedIsOpenMethod.callAsync()).once();
      verify(mockedContract.getRate).once();
      verify(mockedGetRateMethod.callAsync(FundRaiseType.POLY)).once();
      verify(mockedContract.investorInvestedUSD).once();
      verify(mockedInvestorInvestedUSDMethod.callAsync(investorAddress)).once();
      verify(mockedContract.minimumInvestmentUSD).once();
      verify(mockedMinimumInvestmentUSDMethod.callAsync()).once();
      verify(mockedContract.nonAccreditedLimitUSD).once();
      verify(mockedNonAccreditedLimitUSDMethod.callAsync()).once();
      verify(mockedContract.investors).once();
      verify(mockedInvestorsMethod.callAsync(investorAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedPolyTokenContract.balanceOf).once();
      verify(mockedBalanceOfAddressMethod.callAsync(investorAddress)).once();
      verify(mockedContractFactory.getPolyTokenContract()).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('BuyWithUSD', () => {
    test('should buy with USD', async () => {
      // Owner Address expected
      const investorAddress = '0x5555555555555555555555555555555555555555';

      // Address expected
      const expectedAllowBeneficialInvestmentResult = false;
      // Mocked method
      const mockedAllowBeneficialInvestmentMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowBeneficialInvestments).thenReturn(instance(mockedAllowBeneficialInvestmentMethod));
      // Stub the request
      when(mockedAllowBeneficialInvestmentMethod.callAsync()).thenResolve(expectedAllowBeneficialInvestmentResult);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([investorAddress]);

      // Pause Address expected
      const expectedPausedResult = false;
      // Mocked method
      const mockedPausedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPausedMethod));
      // Stub the request
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // Mock getRate
      const expectedGetRateResult = new BigNumber(10);
      // Mocked method
      const mockedGetRateMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getRate).thenReturn(instance(mockedGetRateMethod));
      // Stub the request
      when(mockedGetRateMethod.callAsync(FundRaiseType.StableCoin)).thenResolve(expectedGetRateResult);

      // Mock investorInvestedUSD
      const expectedInvestorInvestedUSDResult = new BigNumber(1);
      // Mocked method
      const mockedInvestorInvestedUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investorInvestedUSD).thenReturn(instance(mockedInvestorInvestedUSDMethod));
      // Stub the request
      when(mockedInvestorInvestedUSDMethod.callAsync(investorAddress)).thenResolve(expectedInvestorInvestedUSDResult);

      // Mock minimumInvestmentUSD
      const expectedMinimumInvestmentUSDResult = new BigNumber(10);
      // Mocked method
      const mockedMinimumInvestmentUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.minimumInvestmentUSD).thenReturn(instance(mockedMinimumInvestmentUSDMethod));
      // Stub the request
      when(mockedMinimumInvestmentUSDMethod.callAsync()).thenResolve(expectedMinimumInvestmentUSDResult);

      // Mock investors
      const expectedInvestorsResult = [new BigNumber(10), new BigNumber(0), new BigNumber(0)];
      // Mocked method
      const mockedInvestorsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investors).thenReturn(instance(mockedInvestorsMethod));
      // Stub the request
      when(mockedInvestorsMethod.callAsync(investorAddress)).thenResolve(expectedInvestorsResult);

      // Mock nonAccreditedLimitUSD
      const expectedNonAccreditedLimitUSDResult = new BigNumber(50000);
      // Mocked method
      const mockedNonAccreditedLimitUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.nonAccreditedLimitUSD).thenReturn(instance(mockedNonAccreditedLimitUSDMethod));
      // Stub the request
      when(mockedNonAccreditedLimitUSDMethod.callAsync()).thenResolve(expectedNonAccreditedLimitUSDResult);

      // Mock isOpen
      const expectedIsOpenResult = true;
      // Mocked method
      const mockedIsOpenMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isOpen).thenReturn(instance(mockedIsOpenMethod));
      // Stub the request
      when(mockedIsOpenMethod.callAsync()).thenResolve(expectedIsOpenResult);

      // Mock STO Details
      const expectedStartTime = new Date(2025, 1);
      const expectedEndTime = new Date(2026, 1);
      const expectedSTODetailsResult = [
        dateToBigNumber(expectedStartTime),
        dateToBigNumber(expectedEndTime),
        new BigNumber(1),
        [new BigNumber(1), new BigNumber(1)],
        [new BigNumber(1), new BigNumber(1)],
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        [false, false, true],
      ];
      // Mocked method
      const mockedSTODetailsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSTODetails).thenReturn(instance(mockedSTODetailsMethod));
      // Stub the request
      when(mockedSTODetailsMethod.callAsync()).thenResolve(expectedSTODetailsResult);

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

      // Balance expected
      const expectedBalanceOfResult = valueToWei(new BigNumber(100), FULL_DECIMALS);
      const usdToken = '0x0123456789012345678901234567890123456789';
      // Setup get Security Token Address
      const mockedBalanceOfAddressMethod = mock(MockedCallMethod);
      when(mockedDetailedERC20Contract.balanceOf).thenReturn(instance(mockedBalanceOfAddressMethod));
      when(mockedBalanceOfAddressMethod.callAsync(investorAddress)).thenResolve(expectedBalanceOfResult);
      when(mockedContractFactory.getDetailedERC20Contract(usdToken)).thenResolve(instance(mockedDetailedERC20Contract));

      const mockedParams = {
        beneficiary: investorAddress,
        investedSC: new BigNumber(1),
        usdToken,
        value: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.buyWithUSD).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          objectContaining(valueToWei(mockedParams.investedSC, FULL_DECIMALS)),
          mockedParams.usdToken,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.buyWithUSD(mockedParams);
      // Result expectation
      expect(result).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.buyWithUSD).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          objectContaining(valueToWei(mockedParams.investedSC, FULL_DECIMALS)),
          mockedParams.usdToken,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.paused).once();
      verify(mockedPausedMethod.callAsync()).once();
      verify(mockedContract.allowBeneficialInvestments).once();
      verify(mockedAllowBeneficialInvestmentMethod.callAsync()).once();
      verify(mockedContract.getSTODetails).once();
      verify(mockedSTODetailsMethod.callAsync()).once();
      verify(mockedContract.isOpen).once();
      verify(mockedIsOpenMethod.callAsync()).once();
      verify(mockedContract.getRate).once();
      verify(mockedGetRateMethod.callAsync(FundRaiseType.StableCoin)).once();
      verify(mockedContract.investorInvestedUSD).once();
      verify(mockedInvestorInvestedUSDMethod.callAsync(investorAddress)).once();
      verify(mockedContract.minimumInvestmentUSD).once();
      verify(mockedMinimumInvestmentUSDMethod.callAsync()).once();
      verify(mockedContract.nonAccreditedLimitUSD).once();
      verify(mockedNonAccreditedLimitUSDMethod.callAsync()).once();
      verify(mockedContract.investors).once();
      verify(mockedInvestorsMethod.callAsync(investorAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedDetailedERC20Contract.balanceOf).once();
      verify(mockedBalanceOfAddressMethod.callAsync(investorAddress)).once();
      verify(mockedContractFactory.getDetailedERC20Contract(usdToken)).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('BuyTokensView', () => {
    test('should get buyTokensView values', async () => {
      const investorAddress = '0x1111111111111111111111111111111111111111';

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([investorAddress]);

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

      // Pause Address expected
      const expectedPausedResult = false;
      // Mocked method
      const mockedPausedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPausedMethod));
      // Stub the request
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // Mock isOpen
      const expectedIsOpenResult = true;
      // Mocked method
      const mockedIsOpenMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isOpen).thenReturn(instance(mockedIsOpenMethod));
      // Stub the request
      when(mockedIsOpenMethod.callAsync()).thenResolve(expectedIsOpenResult);

      // Mock STO Details
      const expectedStartTime = new Date(2025, 1);
      const expectedEndTime = new Date(2026, 1);
      const expectedSTODetailsResult = [
        dateToBigNumber(expectedStartTime),
        dateToBigNumber(expectedEndTime),
        new BigNumber(1),
        [new BigNumber(1), new BigNumber(1)],
        [new BigNumber(1), new BigNumber(1)],
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        [false, true, false],
      ];
      // Mocked method
      const mockedSTODetailsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSTODetails).thenReturn(instance(mockedSTODetailsMethod));
      // Stub the request
      when(mockedSTODetailsMethod.callAsync()).thenResolve(expectedSTODetailsResult);

      // Mock getRate
      const expectedGetRateResult = new BigNumber(1);
      // Mocked method
      const mockedGetRateMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getRate).thenReturn(instance(mockedGetRateMethod));
      // Stub the request
      when(mockedGetRateMethod.callAsync(FundRaiseType.POLY)).thenResolve(expectedGetRateResult);

      // Mock investorInvestedUSD
      const expectedInvestorInvestedUSDResult = new BigNumber(1);
      // Mocked method
      const mockedInvestorInvestedUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investorInvestedUSD).thenReturn(instance(mockedInvestorInvestedUSDMethod));
      // Stub the request
      when(mockedInvestorInvestedUSDMethod.callAsync(investorAddress)).thenResolve(expectedInvestorInvestedUSDResult);

      // Mock minimumInvestmentUSD
      const expectedMinimumInvestmentUSDResult = new BigNumber(1);
      // Mocked method
      const mockedMinimumInvestmentUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.minimumInvestmentUSD).thenReturn(instance(mockedMinimumInvestmentUSDMethod));
      // Stub the request
      when(mockedMinimumInvestmentUSDMethod.callAsync()).thenResolve(expectedMinimumInvestmentUSDResult);

      // Mock investors
      const expectedInvestorsResult = [new BigNumber(1), new BigNumber(1), new BigNumber(0)];
      // Mocked method
      const mockedInvestorsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investors).thenReturn(instance(mockedInvestorsMethod));
      // Stub the request
      when(mockedInvestorsMethod.callAsync(investorAddress)).thenResolve(expectedInvestorsResult);

      // Mock nonAccreditedLimitUSD
      const expectedNonAccreditedLimitUSDResult = new BigNumber(10);
      // Mocked method
      const mockedNonAccreditedLimitUSDMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.nonAccreditedLimitUSD).thenReturn(instance(mockedNonAccreditedLimitUSDMethod));
      // Stub the request
      when(mockedNonAccreditedLimitUSDMethod.callAsync()).thenResolve(expectedNonAccreditedLimitUSDResult);

      // Balance expected
      const expectedBalanceOfResult = valueToWei(new BigNumber(100), FULL_DECIMALS);
      // Setup get Security Token Address
      const mockedBalanceOfAddressMethod = mock(MockedCallMethod);
      when(mockedPolyTokenContract.balanceOf).thenReturn(instance(mockedBalanceOfAddressMethod));
      when(mockedBalanceOfAddressMethod.callAsync(investorAddress)).thenResolve(expectedBalanceOfResult);
      when(mockedContractFactory.getPolyTokenContract()).thenResolve(instance(mockedPolyTokenContract));

      // Result expected
      const expectedAllowBeneficialInvestmentResult = false;
      // Mocked method
      const mockedAllowBeneficialInvestmentMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowBeneficialInvestments).thenReturn(instance(mockedAllowBeneficialInvestmentMethod));
      // Stub the request
      when(mockedAllowBeneficialInvestmentMethod.callAsync()).thenResolve(expectedAllowBeneficialInvestmentResult);

      // Mock buyTokensView
      const params = {
        beneficiary: investorAddress,
        investmentValue: new BigNumber(2),
        fundRaiseType: FundRaiseType.POLY,
      };
      const expectedResult = [new BigNumber(1), new BigNumber(1), new BigNumber(1)];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.buyTokensView).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(
          params.beneficiary,
          objectContaining(valueToWei(params.investmentValue, FULL_DECIMALS)),
          params.fundRaiseType,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.buyTokensView(params);
      // Result expectation
      expect(result.spentUSD).toEqual(weiToValue(expectedResult[0], FULL_DECIMALS));
      expect(result.spentValue).toEqual(weiToValue(expectedResult[1], FULL_DECIMALS));
      expect(result.tokensMinted).toEqual(weiToValue(expectedResult[2], expectedDecimalsResult));

      // Verifications
      verify(mockedContract.paused).once();
      verify(mockedPausedMethod.callAsync()).once();
      verify(mockedContract.isOpen).once();
      verify(mockedIsOpenMethod.callAsync()).once();
      verify(mockedContract.getSTODetails).once();
      verify(mockedSTODetailsMethod.callAsync()).once();
      verify(mockedContract.getRate).once();
      verify(mockedGetRateMethod.callAsync(FundRaiseType.POLY)).once();
      verify(mockedContract.investorInvestedUSD).once();
      verify(mockedInvestorInvestedUSDMethod.callAsync(investorAddress)).once();
      verify(mockedContract.minimumInvestmentUSD).once();
      verify(mockedMinimumInvestmentUSDMethod.callAsync()).once();
      verify(mockedContract.nonAccreditedLimitUSD).once();
      verify(mockedNonAccreditedLimitUSDMethod.callAsync()).once();
      verify(mockedContract.investors).once();
      verify(mockedInvestorsMethod.callAsync(investorAddress)).once();
      verify(mockedContract.buyTokensView).once();
      verify(
        mockedMethod.callAsync(
          params.beneficiary,
          objectContaining(valueToWei(params.investmentValue, FULL_DECIMALS)),
          params.fundRaiseType,
        ),
      ).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedPolyTokenContract.balanceOf).once();
      verify(mockedBalanceOfAddressMethod.callAsync(investorAddress)).once();
      verify(mockedContractFactory.getPolyTokenContract()).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContract.securityToken).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedSecurityTokenContract.decimals).twice();
      verify(mockedDecimalsMethod.callAsync()).twice();
      verify(mockedContract.allowBeneficialInvestments).once();
      verify(mockedAllowBeneficialInvestmentMethod.callAsync()).once();
    });
  });

  describe('CapReached', () => {
    test('should get boolean of capReached', async () => {
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.capReached).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.capReached();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.capReached).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('ConvertFromUSD', () => {
    test('should get value of convertFromUSD', async () => {
      // Result expected
      const expectedAmount = new BigNumber(1);
      // Params
      const params = {
        fundRaiseType: FundRaiseType.ETH,
        amount: new BigNumber(2),
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.convertFromUSD).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(FundRaiseType.ETH, params.amount)).thenResolve(expectedAmount);

      // Real call
      const result = await target.convertFromUSD(params);
      // Result expectation
      expect(result).toEqual(weiToValue(expectedAmount, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.convertFromUSD).once();
      verify(mockedMethod.callAsync(FundRaiseType.ETH, params.amount)).once();
    });
  });

  describe('GetSTODetails', () => {
    test('should call getSTODetails', async () => {
      const expectedStartTime = new Date(2025, 1);
      const expectedEndTime = new Date(2026, 1);
      const capPerTier = [new BigNumber(1), new BigNumber(2)];
      const ratePerTier = [new BigNumber(1), new BigNumber(2)];
      const fundsRaised = new BigNumber(1);
      const tokensSold = new BigNumber(1);
      const expectedResult = [
        dateToBigNumber(expectedStartTime),
        dateToBigNumber(expectedEndTime),
        new BigNumber(1),
        capPerTier,
        ratePerTier,
        fundsRaised,
        new BigNumber(1),
        tokensSold,
        [true, false, false],
      ];

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
      when(mockedContract.getSTODetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getSTODetails();
      // Result expectation
      expect(result.startTime).toEqual(expectedStartTime);
      expect(result.endTime).toEqual(expectedEndTime);
      expect(result.currentTier).toEqual(1);
      expect(result.capPerTier).toEqual(weiArrayToValueArray(capPerTier, expectedDecimalsResult));
      expect(result.ratePerTier).toEqual(weiArrayToValueArray(ratePerTier, FULL_DECIMALS));
      expect(result.fundsRaised).toEqual(weiToValue(fundsRaised, FULL_DECIMALS));
      expect(result.investorCount).toEqual(1);
      expect(result.tokensSold).toEqual(weiToValue(tokensSold, expectedDecimalsResult));
      expect(result.isRaisedInETH).toBe(true);
      expect(result.isRaisedInPOLY).toBe(false);
      expect(result.isRaisedInSC).toBe(false);

      // Verifications
      verify(mockedContract.getSTODetails).once();
      verify(mockedMethod.callAsync()).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('GetTokensMinted', () => {
    test('should get amount from getTokensMinted', async () => {
      // Address expected
      const expectedResult = new BigNumber(100);

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
      when(mockedContract.getTokensMinted).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getTokensMinted();
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, expectedDecimalsResult));
      // Verifications
      verify(mockedContract.getTokensMinted).once();
      verify(mockedMethod.callAsync()).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('GetTokensSoldByTier', () => {
    test('should get value of getTokensSoldByTier', async () => {
      // TokensSoldByTier value expected
      const expectedAmount = new BigNumber(100);
      // Params
      const params = {
        tier: 2,
      };

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

      // GetNumberOfTiers Result expected
      const expectedGetNumberOfTiersAmount = new BigNumber(3);

      // Mocked getNumberOfTiers method
      const mockedGetNumberOfTiersMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getNumberOfTiers).thenReturn(instance(mockedGetNumberOfTiersMethod));
      // Stub the request
      when(mockedGetNumberOfTiersMethod.callAsync()).thenResolve(expectedGetNumberOfTiersAmount);

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTokensSoldByTier).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(params.tier))).thenResolve(expectedAmount);

      // Real call
      const result = await target.getTokensSoldByTier(params);
      // Result expectation
      expect(result).toEqual(weiToValue(expectedAmount, expectedDecimalsResult));
      // Verifications
      verify(mockedContract.getNumberOfTiers).once();
      verify(mockedGetNumberOfTiersMethod.callAsync()).once();
      verify(mockedContract.getTokensSoldByTier).once();
      verify(mockedMethod.callAsync(objectContaining(params.tier))).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('CurrentTier', () => {
    test('should get amount from currentTier', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.currentTier).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.currentTier();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.currentTier).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('IsOpen', () => {
    test('should get boolean of isOpen', async () => {
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isOpen).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.isOpen();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.isOpen).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetRate', () => {
    test('should get value of getRate', async () => {
      // Result expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getRate).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(FundRaiseType.ETH)).thenResolve(expectedResult);

      // Real call
      const result = await target.getRate({ fundRaiseType: FundRaiseType.ETH });
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.getRate).once();
      verify(mockedMethod.callAsync(FundRaiseType.ETH)).once();
    });
  });

  describe('NonAccreditedLimitUSD', () => {
    test('should get value of nonAccreditedLimitUSD', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.nonAccreditedLimitUSD).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.nonAccreditedLimitUSD();
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.nonAccreditedLimitUSD).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('MinimumInvestmentUSD', () => {
    test('should get value of minimumInvestmentUSD', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.minimumInvestmentUSD).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.minimumInvestmentUSD();
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.minimumInvestmentUSD).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('ReserveWallet', () => {
    test('should get address from reserveWallet', async () => {
      // Address expected
      const expectedResult = '0x1111111111111111111111111111111111111111';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.reserveWallet).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.reserveWallet();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.reserveWallet).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetTokensSold', () => {
    test('should get amount from getTokensSold', async () => {
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
      when(mockedContract.getTokensSold).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getTokensSold();
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, expectedDecimalsResult));
      // Verifications
      verify(mockedContract.getTokensSold).once();
      verify(mockedMethod.callAsync()).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('IsFinalized', () => {
    test('should get boolean of isFinalized', async () => {
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isFinalized).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.isFinalized();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.isFinalized).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetUSDTokens', () => {
    test('should get amount of getUSDTokens', async () => {
      // Address expected
      const expectedResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getUsdTokens).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getUsdTokens();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getUsdTokens).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('FundsRaisedUSD', () => {
    test('should get amount from fundsRaisedUSD', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.fundsRaisedUSD).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.fundsRaisedUSD();
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.fundsRaisedUSD).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Tiers', () => {
    test('should get tiers information', async () => {
      const params = {
        tier: 2,
      };

      const expectedResult = [
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
      ];

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
      when(mockedContract.tiers).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(params.tier))).thenResolve(expectedResult);

      // Real call
      const result = await target.tiers(params);
      // Result expectation
      expect(result.rate).toEqual(weiToValue(expectedResult[0], FULL_DECIMALS));
      expect(result.rateDiscountPoly).toEqual(weiToValue(expectedResult[1], FULL_DECIMALS));
      expect(result.tokenTotal).toEqual(weiToValue(expectedResult[2], expectedDecimalsResult));
      expect(result.tokensDiscountPoly).toEqual(weiToValue(expectedResult[3], expectedDecimalsResult));
      expect(result.mintedTotal).toEqual(weiToValue(expectedResult[4], expectedDecimalsResult));
      expect(result.mintedDiscountPoly).toEqual(weiToValue(expectedResult[5], expectedDecimalsResult));

      verify(mockedContract.tiers).once();
      verify(mockedMethod.callAsync(objectContaining(params.tier))).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('GetTokensMintedByTier', () => {
    test('should get value of getTokensMintedByTier', async () => {
      // TokensSoldByTier value expected
      const expectedAmount = [new BigNumber(100), new BigNumber(200), new BigNumber(300)];
      // Params
      const params = {
        tier: 2,
      };

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

      // GetNumberOfTiers Result expected
      const expectedGetNumberOfTiersAmount = new BigNumber(3);

      // Mocked getNumberOfTiers method
      const mockedGetNumberOfTiersMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getNumberOfTiers).thenReturn(instance(mockedGetNumberOfTiersMethod));
      // Stub the request
      when(mockedGetNumberOfTiersMethod.callAsync()).thenResolve(expectedGetNumberOfTiersAmount);

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTokensMintedByTier).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(params.tier))).thenResolve(expectedAmount);

      // Real call
      const result = await target.getTokensMintedByTier(params);
      // Result expectation
      expect(result.mintedInETH).toEqual(weiToValue(expectedAmount[0], expectedDecimalsResult));
      expect(result.mintedInPOLY).toEqual(weiToValue(expectedAmount[1], expectedDecimalsResult));
      expect(result.mintedInSC).toEqual(weiToValue(expectedAmount[2], expectedDecimalsResult));

      // Verifications
      verify(mockedContract.getNumberOfTiers).once();
      verify(mockedGetNumberOfTiersMethod.callAsync()).once();
      verify(mockedContract.getTokensMintedByTier).once();
      verify(mockedMethod.callAsync(objectContaining(params.tier))).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('ConvertToUSD', () => {
    test('should get value of convertToUSD', async () => {
      // Result expected
      const expectedAmount = new BigNumber(1);
      // Params
      const params = {
        fundRaiseType: FundRaiseType.ETH,
        amount: new BigNumber(2),
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.convertToUSD).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(FundRaiseType.ETH, params.amount)).thenResolve(expectedAmount);

      // Real call
      const result = await target.convertToUSD(params);
      // Result expectation
      expect(result).toEqual(weiToValue(expectedAmount, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.convertToUSD).once();
      verify(mockedMethod.callAsync(FundRaiseType.ETH, params.amount)).once();
    });
  });

  describe('GetTokensSoldFor', () => {
    test('should get value of getTokensSoldFor', async () => {
      // Result expected
      const expectedAmount = new BigNumber(1);
      // Params
      const params = {
        fundRaiseType: FundRaiseType.ETH,
      };

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
      when(mockedContract.getTokensSoldFor).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.fundRaiseType)).thenResolve(expectedAmount);

      // Real call
      const result = await target.getTokensSoldFor(params);
      // Result expectation
      expect(result).toEqual(weiToValue(expectedAmount, expectedDecimalsResult));
      // Verifications
      verify(mockedContract.getTokensSoldFor).once();
      verify(mockedMethod.callAsync(params.fundRaiseType)).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('StableCoinsRaised', () => {
    test('should get value of stableCoinsRaised', async () => {
      // Result expected
      const expectedAmount = new BigNumber(1);
      // Params
      const params = {
        stableCoinAddress: '0x1111111111111111111111111111111111111111',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.stableCoinsRaised).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.stableCoinAddress)).thenResolve(expectedAmount);

      // Real call
      const result = await target.stableCoinsRaised(params);
      // Result expectation
      expect(result).toEqual(weiToValue(expectedAmount, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.stableCoinsRaised).once();
      verify(mockedMethod.callAsync(params.stableCoinAddress)).once();
    });
  });

  describe('Finalize', () => {
    test('should finalize STO', async () => {
      // Address expected
      const expectedIsFinalizedResult = false;
      // Mocked method
      const mockedIsFinalizedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isFinalized).thenReturn(instance(mockedIsFinalizedMethod));
      // Stub the request
      when(mockedIsFinalizedMethod.callAsync()).thenResolve(expectedIsFinalizedResult);

      // Mock Only Owner and Security Token
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.finalize).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.finalize(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.finalize).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.isFinalized).once();
      verify(mockedIsFinalizedMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('ChangeAccredited', () => {
    test('should change accredited investors', async () => {
      // Mock Only Owner and Security Token
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        investors: ['0x9999999999999999999999999999999999999999', '0x8888888888888888888888888888888888888888'],
        accredited: [true, true],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeAccredited).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          mockedParams.accredited,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeAccredited(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeAccredited).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          mockedParams.accredited,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('ChangeNonAccreditedLimit', () => {
    test('should change accredited investors', async () => {
      // Mock Only Owner and Security Token
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        investors: ['0x9999999999999999999999999999999999999999', '0x8888888888888888888888888888888888888888'],
        nonAccreditedLimit: [new BigNumber(1), new BigNumber(2)],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeNonAccreditedLimit).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          objectContaining(valueArrayToWeiArray(mockedParams.nonAccreditedLimit, FULL_DECIMALS)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeNonAccreditedLimit(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeNonAccreditedLimit).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.investors,
          objectContaining(valueArrayToWeiArray(mockedParams.nonAccreditedLimit, FULL_DECIMALS)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('ModifyTimes', () => {
    test('should modifyTimes', async () => {
      // Mock Only Owner and Security Token
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Value expected
      const expectedStartTimeResult = dateToBigNumber(new Date(2029, 1));
      // Mocked method
      const mockedStartTimeMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.startTime).thenReturn(instance(mockedStartTimeMethod));
      // Stub the request
      when(mockedStartTimeMethod.callAsync()).thenResolve(expectedStartTimeResult);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        startTime: new Date(2030, 1),
        endTime: new Date(2031, 1),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyTimes).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyTimes(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyTimes).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedStartTimeMethod.callAsync()).once();
      verify(mockedContract.startTime).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('ModifyLimits', () => {
    test('should modifyLimits', async () => {
      // Mock Only Owner and Security Token
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Value expected
      const expectedStartTimeResult = dateToBigNumber(new Date(2029, 1));
      // Mocked method
      const mockedStartTimeMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.startTime).thenReturn(instance(mockedStartTimeMethod));
      // Stub the request
      when(mockedStartTimeMethod.callAsync()).thenResolve(expectedStartTimeResult);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        nonAccreditedLimitUSD: new BigNumber(1),
        minimumInvestmentUSD: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyLimits).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.minimumInvestmentUSD, FULL_DECIMALS)),
          objectContaining(valueToWei(mockedParams.nonAccreditedLimitUSD, FULL_DECIMALS)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyLimits(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyLimits).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.minimumInvestmentUSD, FULL_DECIMALS)),
          objectContaining(valueToWei(mockedParams.nonAccreditedLimitUSD, FULL_DECIMALS)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedStartTimeMethod.callAsync()).once();
      verify(mockedContract.startTime).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('ModifyFunding', () => {
    test('should modifyFunding', async () => {
      // Mock Only Owner and Security Token
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Value expected
      const expectedStartTimeResult = dateToBigNumber(new Date(2029, 1));
      // Mocked method
      const mockedStartTimeMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.startTime).thenReturn(instance(mockedStartTimeMethod));
      // Stub the request
      when(mockedStartTimeMethod.callAsync()).thenResolve(expectedStartTimeResult);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        fundRaiseTypes: [FundRaiseType.ETH, FundRaiseType.POLY, FundRaiseType.StableCoin],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyFunding).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(mockedParams.fundRaiseTypes),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyFunding(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyFunding).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(mockedParams.fundRaiseTypes),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedStartTimeMethod.callAsync()).once();
      verify(mockedContract.startTime).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('ModifyAddresses', () => {
    test('should modifyAddresses', async () => {
      // Mock Only Owner and Security Token
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        wallet: '0x1234567890123456789012345678901234567890',
        reserveWallet: '0x0987654321098765432109876543210987654321',
        usdTokens: ['0x9999999999999999999999999999999999999999', '0x8888888888888888888888888888888888888888'],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyAddresses).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.wallet,
          mockedParams.reserveWallet,
          mockedParams.usdTokens,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyAddresses(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyAddresses).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.wallet,
          mockedParams.reserveWallet,
          mockedParams.usdTokens,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('ModifyTiers', () => {
    test('should modifyTiers', async () => {
      // Mock Only Owner and Security Token
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      // Value expected
      const expectedStartTimeResult = dateToBigNumber(new Date(2029, 1));
      // Mocked method
      const mockedStartTimeMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.startTime).thenReturn(instance(mockedStartTimeMethod));
      // Stub the request
      when(mockedStartTimeMethod.callAsync()).thenResolve(expectedStartTimeResult);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        ratePerTier: [new BigNumber(2), new BigNumber(3)],
        ratePerTierDiscountPoly: [new BigNumber(1), new BigNumber(1)],
        tokensPerTierTotal: [new BigNumber(20), new BigNumber(30)],
        tokensPerTierDiscountPoly: [new BigNumber(10), new BigNumber(10)],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyTiers).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueArrayToWeiArray(mockedParams.ratePerTier, FULL_DECIMALS)),
          objectContaining(valueArrayToWeiArray(mockedParams.ratePerTierDiscountPoly, FULL_DECIMALS)),
          objectContaining(valueArrayToWeiArray(mockedParams.tokensPerTierTotal, expectedDecimalsResult)),
          objectContaining(valueArrayToWeiArray(mockedParams.tokensPerTierDiscountPoly, expectedDecimalsResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyTiers(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyTiers).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueArrayToWeiArray(mockedParams.ratePerTier, FULL_DECIMALS)),
          objectContaining(valueArrayToWeiArray(mockedParams.ratePerTierDiscountPoly, FULL_DECIMALS)),
          objectContaining(valueArrayToWeiArray(mockedParams.tokensPerTierTotal, expectedDecimalsResult)),
          objectContaining(valueArrayToWeiArray(mockedParams.tokensPerTierDiscountPoly, expectedDecimalsResult)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedStartTimeMethod.callAsync()).once();
      verify(mockedContract.startTime).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('GetAccreditedData', () => {
    test('should getAccreditedData', async () => {
      // TokensSoldByTier value expected
      const nonAccreditedLimits = [new BigNumber(100), new BigNumber(200), new BigNumber(300)];
      const expectedAmount = [
        [
          '0x1111111111111111111111111111111111111111',
          '0x2222222222222222222222222222222222222222',
          '0x3333333333333333333333333333333333333333',
        ],
        [true, true, true],
        nonAccreditedLimits,
      ];
      const typedExpectedResult = [];
      for (let i = 0; i < expectedAmount[0].length; i += 1) {
        const accreditedData = {
          investor: expectedAmount[0][i],
          accreditedData: {
            accredited: expectedAmount[1][i],
            nonAccreditedLimitUSDOverride: weiToValue(nonAccreditedLimits[i], FULL_DECIMALS),
          },
        };
        typedExpectedResult.push(accreditedData);
      }
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAccreditedData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedAmount);

      // Real call
      const result = await target.getAccreditedData();

      // Result expectation
      expect(result).toEqual(typedExpectedResult);
      // Verifications
      verify(mockedContract.getAccreditedData).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetNumberOfTiers', () => {
    test('should get value of getNumberOfTiers', async () => {
      // Result expected
      const expectedAmount = new BigNumber(1);

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getNumberOfTiers).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedAmount);

      // Real call
      const result = await target.getNumberOfTiers();
      // Result expectation
      expect(result).toBe(expectedAmount);
      // Verifications
      verify(mockedContract.getNumberOfTiers).once();
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
          `Expected eventName to be one of: 'SetAllowBeneficialInvestments', 'SetNonAccreditedLimit', 'SetAccredited', 'TokenPurchase', 'FundsReceived', 'ReserveTokenMint', 'SetAddresses', 'SetLimits', 'SetTimes', 'SetTiers', 'SetFundRaiseTypes', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});
