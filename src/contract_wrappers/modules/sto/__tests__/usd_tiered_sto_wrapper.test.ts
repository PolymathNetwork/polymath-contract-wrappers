// USDTieredSTOWrapper test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { USDTieredSTOContract, SecurityTokenContract, PolyTokenEvents } from '@polymathnetwork/abi-wrappers';
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
        stableCoinAddress: '0x1111111111111111111111111111111111111111'
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
      when(mockedMethod.callAsync(params.investorAddress)).thenResolve(
          expectedResult,
      );

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
