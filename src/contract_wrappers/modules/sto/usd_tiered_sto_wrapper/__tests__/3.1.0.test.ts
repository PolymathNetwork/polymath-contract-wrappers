// USDTieredSTOWrapper test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import {
  USDTieredSTOContract_3_1_0,
  ISecurityTokenContract_3_0_0,
  BigNumber,
  Web3Wrapper,
  PolyTokenEvents_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../../test_utils/mocked_methods';
import USDTieredSTOCommon from '../common';
import { USDTieredSTO_3_1_0 } from '../3.1.0';
import ContractFactory from '../../../../../factories/contractFactory';
import { weiToValue } from '../../../../../utils/convert';
import { FULL_DECIMALS } from '../../../../../types';

describe('USD Tiered STO 3.1.0', () => {  
  let target: USDTieredSTO_3_1_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: USDTieredSTOContract_3_1_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(USDTieredSTOContract_3_1_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new USDTieredSTO_3_1_0(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);
    reset(mockedSecurityTokenContract);
  });

  describe('Types', () => {
    test('should extend USDTieredSTOWrapper', async () => {
      expect(target instanceof USDTieredSTOCommon).toBe(true);
    });
  });

  describe('GetTotalTokensSoldByTierr', () => {
    test('should get value of getTotalTokensSoldByTier', async () => {
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
      when(mockedContract.getTotalTokensSoldByTier).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(params.tier))).thenResolve(expectedAmount);

      // Real call
      const result = await target.getTotalTokensSoldByTier(params);
      // Result expectation
      expect(result).toEqual(weiToValue(expectedAmount, expectedDecimalsResult));
      // Verifications
      verify(mockedContract.getNumberOfTiers).once();
      verify(mockedGetNumberOfTiersMethod.callAsync()).once();
      verify(mockedContract.getTotalTokensSoldByTier).once();
      verify(mockedMethod.callAsync(objectContaining(params.tier))).once();
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
      expect(result.totalTokensSoldInTier).toEqual(weiToValue(expectedResult[4], expectedDecimalsResult));
      expect(result.soldDiscountPoly).toEqual(weiToValue(expectedResult[5], expectedDecimalsResult));

      verify(mockedContract.tiers).once();
      verify(mockedMethod.callAsync(objectContaining(params.tier))).once();
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
      when(mockedContract.getTokensSoldByTier).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(params.tier))).thenResolve(expectedAmount);

      // Real call
      const result = await target.getTokensSoldByTier(params);
      // Result expectation
      expect(result.mintedInETH).toEqual(weiToValue(expectedAmount[0], expectedDecimalsResult));
      expect(result.mintedInPOLY).toEqual(weiToValue(expectedAmount[1], expectedDecimalsResult));
      expect(result.mintedInSC).toEqual(weiToValue(expectedAmount[2], expectedDecimalsResult));

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

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to FeatureRegistryEvents', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: PolyTokenEvents_3_0_0.Transfer,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(
          `Expected eventName to be one of: 'SetAllowBeneficialInvestments', 'SetNonAccreditedLimit', 'TokenPurchase', 'FundsReceived', 'ReserveTokenMint', 'ReserveTokenTransfer', 'SetAddresses', 'SetLimits', 'SetTimes', 'SetTiers', 'SetTreasuryWallet', 'Pause', 'Unpause', 'SetFundRaiseTypes', 'RevokePreMintFlag', 'AllowPreMintFlag', encountered: Transfer`,
        ),
      );
    });
  });
});
