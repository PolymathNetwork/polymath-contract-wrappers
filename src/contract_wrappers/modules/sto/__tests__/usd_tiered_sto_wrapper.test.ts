// USDTieredSTOWrapper test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { USDTieredSTOContract, SecurityTokenContract, PolyTokenEvents } from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import USDTieredSTOWrapper from '../usd_tiered_sto_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import STOWrapper from '../sto_wrapper';
import {dateToBigNumber, numberToBigNumber} from '../../../../utils/convert';

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
      expect(result).toEqual(expectedResult);
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
      const expectedResult = [
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investors).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(investorAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.investors({investorAddress});
      // Result expectation
      expect(result.accredited).toEqual(!expectedResult[0].isZero());
      expect(result.nonAccreditedLimitUSDOverride).toBe(expectedResult[2]);

      // Verifications
      verify(mockedContract.investors).once();
      verify(mockedMethod.callAsync(investorAddress)).once();
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
