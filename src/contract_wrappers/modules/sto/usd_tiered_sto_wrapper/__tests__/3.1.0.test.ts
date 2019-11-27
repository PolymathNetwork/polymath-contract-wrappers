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
import {
  weiToValue,
  stringToBytes32,
  bytes32ToString,
  weiArrayToValueArray,
  dateToBigNumber,
} from '../../../../../utils/convert';
import { FULL_DECIMALS, FundRaiseType } from '../../../../../types';

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

  describe('Get Total Tokens Sold By Tier', () => {
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
      const expectedDecimalsResult = FULL_DECIMALS;
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
      const expectedDecimalsResult = FULL_DECIMALS;
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

  describe('Get Tokens Sold By Tier', () => {
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
      const expectedDecimalsResult = FULL_DECIMALS;
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

  describe('Get STO Details', () => {
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
        true,
      ];

      // Security Token, its address, and decimals mocked
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = FULL_DECIMALS;
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
      expect(result.preMintingAllowed).toBe(true);

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

  describe('Get Denominated Currency', () => {
    test('should get currency from denominatedCurrency', async () => {
      const expectedResult = stringToBytes32('USDT');
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.denominatedCurrency).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.denominatedCurrency();

      // Result expectation
      expect(result).toBe(bytes32ToString(expectedResult));

      // Verifications
      verify(mockedContract.denominatedCurrency).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Modify Oracles', () => {
    test('should modify oracles with different currency symbol', async () => {
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
        customOracleAddresses: [
          '0x1111111111111111111111111111111111111111',
          '0x2221111111111111111111111111111111111111',
        ],
        denominatedCurrencySymbol: 'CAD',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);

      // denominatedCurrency mock
      const expectedDenominatedCurrencyResult = stringToBytes32('USD');
      const mockedDenominatedCurrencyMethod = mock(MockedCallMethod);
      when(mockedContract.denominatedCurrency).thenReturn(instance(mockedDenominatedCurrencyMethod));
      when(mockedDenominatedCurrencyMethod.callAsync()).thenResolve(expectedDenominatedCurrencyResult);

      // startTime mock
      const expectedStartTimeResult = dateToBigNumber(new Date(2022, 11, 11));
      const mockedStartTimeMethod = mock(MockedCallMethod);
      when(mockedContract.startTime).thenReturn(instance(mockedStartTimeMethod));
      when(mockedStartTimeMethod.callAsync()).thenResolve(expectedStartTimeResult);

      // fundRaiseTypes POLY mock
      const mockedFundRaiseTypesPolyMethod = mock(MockedCallMethod);
      when(mockedContract.fundRaiseTypes).thenReturn(instance(mockedFundRaiseTypesPolyMethod));
      when(mockedFundRaiseTypesPolyMethod.callAsync(FundRaiseType.POLY)).thenResolve(true);

      // Stub the method
      when(mockedContract.modifyOracles).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.customOracleAddresses,
          objectContaining(stringToBytes32(mockedParams.denominatedCurrencySymbol)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyOracles(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      // denominatedCurrency
      verify(mockedContract.denominatedCurrency).once();
      verify(mockedDenominatedCurrencyMethod.callAsync()).once();
      // startTime
      verify(mockedContract.startTime).once();
      verify(mockedStartTimeMethod.callAsync()).once();
      // fundRaiseTypes
      verify(mockedContract.fundRaiseTypes).twice();
      verify(mockedFundRaiseTypesPolyMethod.callAsync(FundRaiseType.ETH)).once();
      verify(mockedContract.modifyOracles).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.customOracleAddresses,
          objectContaining(stringToBytes32(mockedParams.denominatedCurrencySymbol)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });

    test('should modify oracles without oracle addresses', async () => {
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
        customOracleAddresses: [],
        denominatedCurrencySymbol: '',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);

      // denominatedCurrency mock
      const expectedDenominatedCurrencyResult = stringToBytes32('USDT');
      const mockedDenominatedCurrencyMethod = mock(MockedCallMethod);
      when(mockedContract.denominatedCurrency).thenReturn(instance(mockedDenominatedCurrencyMethod));
      when(mockedDenominatedCurrencyMethod.callAsync()).thenResolve(expectedDenominatedCurrencyResult);

      // startTime mock
      const expectedStartTimeResult = new BigNumber(3876536279);
      const mockedStartTimeMethod = mock(MockedCallMethod);
      when(mockedContract.startTime).thenReturn(instance(mockedStartTimeMethod));
      when(mockedStartTimeMethod.callAsync()).thenResolve(expectedStartTimeResult);

      // Stub the method
      when(mockedContract.modifyOracles).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.customOracleAddresses,
          objectContaining(stringToBytes32(mockedParams.denominatedCurrencySymbol)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyOracles(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      // denominatedCurrency
      verify(mockedContract.denominatedCurrency).once();
      verify(mockedDenominatedCurrencyMethod.callAsync()).once();
      // startTime
      verify(mockedContract.startTime).once();
      verify(mockedStartTimeMethod.callAsync()).once();
      verify(mockedContract.modifyOracles).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.customOracleAddresses,
          objectContaining(stringToBytes32(mockedParams.denominatedCurrencySymbol)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });

  describe('Get Custom Oracle Address', () => {
    test('should call getCustomOracleAddress', async () => {
      // Params
      const params = {
        fundRaiseType: FundRaiseType.StableCoin,
      };
      const expectedResult = '0x5555555555555555555555555555555555555555';
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getCustomOracleAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.fundRaiseType)).thenResolve(expectedResult);

      // Real call
      const result = await target.getCustomOracleAddress(params);

      // Result expectation
      expect(result).toBe(expectedResult);

      // Verifications
      verify(mockedContract.getCustomOracleAddress).once();
      verify(mockedMethod.callAsync(params.fundRaiseType)).once();
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
          `Expected eventName to be one of: 'SetAllowBeneficialInvestments', 'SetNonAccreditedLimit', 'TokenPurchase', 'FundsReceived', 'ReserveTokenMint', 'ReserveTokenTransfer', 'SetAddresses', 'SetLimits', 'SetTimes', 'SetTiers', 'SetTreasuryWallet', 'SetOracles', 'UsageFeeDeducted', 'Pause', 'Unpause', 'SetFundRaiseTypes', 'RevokePreMintFlag', 'AllowPreMintFlag', encountered: Transfer`,
        ),
      );
    });
  });
});
