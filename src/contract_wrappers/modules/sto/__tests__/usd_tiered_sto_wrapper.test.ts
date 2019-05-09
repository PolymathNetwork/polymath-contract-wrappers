// USDTieredSTOWrapper test
import { instance, mock, objectContaining, reset, verify, when } from 'ts-mockito';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { PolyTokenEvents, SecurityTokenContract, USDTieredSTOContract } from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import USDTieredSTOWrapper from '../usd_tiered_sto_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import STOWrapper from '../sto_wrapper';
import { dateToBigNumber, numberToBigNumber } from '../../../../utils/convert';
import { FundRaiseType } from '../../../../types';

describe('USDTieredSTOWrapper', () => {
  // Capped STO Wrapper is used as contract target here as STOWrapper is abstract
  let target: USDTieredSTOWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: USDTieredSTOContract;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: SecurityTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(USDTieredSTOContract);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(SecurityTokenContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new USDTieredSTOWrapper(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedSecurityTokenContract);
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
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.finalAmountReturned).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.finalAmountReturned();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.finalAmountReturned).once();
      verify(mockedMethod.callAsync()).once();
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
      expect(result.nonAccreditedLimitUSDOverride).toBe(expectedResult[2]);

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
      expect(result).toBe(expectedResult);
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
      expect(result).toBe(expectedResult);
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
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedAllowBeneficialInvestmentMethod.callAsync()).once();
    });
  });

  describe('BuyWithETH', () => {
    test('should buy with ETH', async () => {
      // Address expected
      const expectedAllowBeneficialInvestmentResult = false;
      // Mocked method
      const mockedAllowBeneficialInvestmentMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowBeneficialInvestments).thenReturn(instance(mockedAllowBeneficialInvestmentMethod));
      // Stub the request
      when(mockedAllowBeneficialInvestmentMethod.callAsync()).thenResolve(expectedAllowBeneficialInvestmentResult);

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Pause Address expected
      const expectedPausedResult = false;
      // Mocked method
      const mockedPausedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPausedMethod));
      // Stub the request
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // Mock STO Details
      const expectedStartTime = new Date(2025, 1);
      const expectedEndTime = new Date(2026, 1);
      const expectedSTODetailsResult = [
        dateToBigNumber(expectedStartTime),
        dateToBigNumber(expectedEndTime),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
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

      const mockedParams = {
        beneficiary: expectedOwnerResult,
        from: expectedOwnerResult,
        value: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };
      const txPayableData = {
        ...{},
        from: expectedOwnerResult,
        value: mockedParams.value,
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
    });
  });

  describe('BuyTokensView', () => {
    test('should get buyTokensView values', async () => {
      const investorAddress = '0x1111111111111111111111111111111111111111';

      // Mock isOpen
      const expectedIsOpenResult = true;
      // Mocked method
      const mockedIsOpenMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isOpen).thenReturn(instance(mockedIsOpenMethod));
      // Stub the request
      when(mockedIsOpenMethod.callAsync()).thenResolve(expectedIsOpenResult);

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
      when(mockedMethod.callAsync(params.beneficiary, params.investmentValue, params.fundRaiseType)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.buyTokensView(params);
      // Result expectation
      expect(result.spentUSD).toEqual(expectedResult[0]);
      expect(result.spentValue).toEqual(expectedResult[1]);
      expect(result.tokensMinted).toEqual(expectedResult[2]);

      // Verifications
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
      verify(mockedContract.buyTokensView).once();
      verify(mockedMethod.callAsync(params.beneficiary, params.investmentValue, params.fundRaiseType)).once();
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
      expect(result).toBe(expectedAmount);
      // Verifications
      verify(mockedContract.convertFromUSD).once();
      verify(mockedMethod.callAsync(FundRaiseType.ETH, params.amount)).once();
    });
  });

  describe('GetSTODetails', () => {
    test('should call getSTODetails', async () => {
      const expectedStartTime = new Date(2025, 1);
      const expectedEndTime = new Date(2026, 1);
      const expectedResult = [
        dateToBigNumber(expectedStartTime),
        dateToBigNumber(expectedEndTime),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        [true, false, false],
      ];
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
      expect(result.capPerTier).toBe(expectedResult[3]);
      expect(result.ratePerTier).toBe(expectedResult[4]);
      expect(result.fundsRaised).toBe(expectedResult[5]);
      expect(result.investorCount).toEqual(1);
      expect(result.tokensSold).toBe(expectedResult[7]);
      expect(result.isRaisedInETH).toBe(true);
      expect(result.isRaisedInPOLY).toBe(false);
      expect(result.isRaisedInSC).toBe(false);

      // Verifications
      verify(mockedContract.getSTODetails).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetTokensMinted', () => {
    test('should get amount from getTokensMinted', async () => {
      // Address expected
      const expectedResult = new BigNumber(100);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTokensMinted).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getTokensMinted();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getTokensMinted).once();
      verify(mockedMethod.callAsync()).once();
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
      expect(result).toBe(expectedAmount);
      // Verifications
      verify(mockedContract.getNumberOfTiers).once();
      verify(mockedGetNumberOfTiersMethod.callAsync()).once();
      verify(mockedContract.getTokensSoldByTier).once();
      verify(mockedMethod.callAsync(objectContaining(params.tier))).once();
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
      expect(result).toBe(expectedResult);
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
      expect(result).toBe(expectedResult);
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
      expect(result).toBe(expectedResult);
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
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTokensSold).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getTokensSold();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getTokensSold).once();
      verify(mockedMethod.callAsync()).once();
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
      expect(result).toBe(expectedResult);
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
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.tiers).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(params.tier))).thenResolve(expectedResult);

      // Real call
      const result = await target.tiers(params);
      // Result expectation
      expect(result.rate).toEqual(expectedResult[0]);
      expect(result.rateDiscountPoly).toEqual(expectedResult[1]);
      expect(result.tokenTotal).toEqual(expectedResult[2]);
      expect(result.tokensDiscountPoly).toEqual(expectedResult[3]);
      expect(result.mintedTotal).toEqual(expectedResult[4]);
      expect(result.mintedDiscountPoly).toEqual(expectedResult[5]);

      verify(mockedContract.tiers).once();
      verify(mockedMethod.callAsync(objectContaining(params.tier))).once();
    });
  });

  describe('GetTokensMintedByTier', () => {
    test('should get value of getTokensMintedByTier', async () => {
      // TokensSoldByTier value expected
      const expectedAmount = [ new BigNumber(100),new BigNumber(200),new BigNumber(300)];
      // Params
      const params = {
        tier: 2,
      };

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
      expect(result.mintedInETH).toBe(expectedAmount[0]);
      expect(result.mintedInPOLY).toBe(expectedAmount[1]);
      expect(result.mintedInSC).toBe(expectedAmount[2]);
      // Verifications
      verify(mockedContract.getNumberOfTiers).once();
      verify(mockedGetNumberOfTiersMethod.callAsync()).once();
      verify(mockedContract.getTokensMintedByTier).once();
      verify(mockedMethod.callAsync(objectContaining(params.tier))).once();
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
